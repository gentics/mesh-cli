#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const mesh_api_1 = require("mesh-api");
const commands_1 = require("./commands");
const completers_1 = require("./completers");
const rxjs_1 = require("rxjs");
const options_1 = require("./options");
class State {
}
exports.State = State;
const opts = options_1.options();
const mesh = new mesh_api_1.MeshAPI({
    url: opts.url,
    debug: opts.debug
});
let state = { project: '', current: null, lang: 'en' };
let rl;
const login$ = rxjs_1.Observable.fromPromise(mesh.api.auth.login.post({ username: opts.username, password: opts.password }).catch((reason) => {
    console.error(reason);
    console.log('Maybe you forgot to specify the full api endpoint path, which includes "/api/v1"?');
    process.exit(1);
}));
class AutoCompleteRequest {
    constructor(line, callback) {
        this.line = line;
        this.callback = callback;
    }
    ;
}
const completer$ = new rxjs_1.Subject();
rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line, callback) => {
        completer$.next(new AutoCompleteRequest(line, callback));
    }
});
const lines$ = login$.switchMap(() => {
    return new rxjs_1.Observable((subscriber) => {
        rl.on('line', (line) => subscriber.next(line));
    });
}).startWith('');
const command$ = new rxjs_1.Observable((subscriber) => {
    let buffer = [];
    const subscription = lines$.subscribe(line => {
        let cmd = commands_1.lineToCmdParts(line);
        if ((commands_1.isMultilineCmd(cmd[0]) || buffer.length) && !commands_1.isBufferEndCmd(cmd)) {
            buffer = buffer.concat(line);
        }
        else if (commands_1.isBufferEndCmd(cmd)) {
            subscriber.next(new commands_1.Command(buffer));
            buffer = [];
        }
        else {
            subscriber.next(new commands_1.Command([line]));
        }
    });
    return subscription;
});
const state$ = command$.flatMap((cmd) => {
    if (commands_1.isValidCommand(cmd)) {
        return rxjs_1.Observable.fromPromise(commands_1.execute(cmd, state, mesh));
    }
    else if (commands_1.isEmptyCommand(cmd)) {
        return [state];
    }
    else {
        console.error(`Unknown command ${cmd.name}`);
        return [state];
    }
}).catch((err, caught) => {
    console.error('Error:', err);
    return caught;
}).share();
state$.subscribe((newState) => {
    state = newState;
    if (rl) {
        rl.setPrompt(prompt(state));
        rl.prompt();
    }
});
completer$.withLatestFrom(state$).subscribe(([req, state]) => {
    let line = req.line;
    let callback = req.callback;
    completers_1.complete(mesh, state, req.line, req.callback);
});
function prompt(state) {
    if (state.project && state.current) {
        return `${state.project}${decodeURI(state.current.path)}:${state.current.uuid} (${state.lang})$ `;
    }
    else {
        return '$ ';
    }
}
//# sourceMappingURL=mesh-cli.js.map