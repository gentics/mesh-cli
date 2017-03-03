#!/usr/bin/env node

import * as readline from 'readline';
import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api';
import { lineToCmdParts, isMultilineCmd, isBufferEndCmd, Command, isValidCommand, execute, isEmptyCommand } from './commands';
import { complete } from './completers';
import { Observable, Subject } from 'rxjs';
import { options } from './options';

export class State {
    public readonly project: string;
    public readonly current: ProjectNodesNodeUuidGetResponse;
    public readonly lang: string;
}

const opts = options();
const mesh = new MeshAPI({
    url: opts.url,
    debug: opts.debug
});
let state: State = { project: '', current: null, lang: 'en' };
let rl: readline.ReadLine;

const login$ = Observable.fromPromise(mesh.api.auth.login.post({ username: opts.username, password: opts.password }).catch((reason) => {
    console.error(reason);
    console.log('Maybe you forgot to specify the full api endpoint path, which includes "/api/v1"?');
    process.exit(1);
}));

type CompleterResultCallback = (err: any, result: readline.CompleterResult) => void;

class AutoCompleteRequest {
    constructor(public readonly line: string, public readonly callback: CompleterResultCallback) { };
}

const completer$ = new Subject<AutoCompleteRequest>();
rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line: string, callback?: CompleterResultCallback): any => {
        completer$.next(new AutoCompleteRequest(line, callback));
    }
});

const lines$ = login$.switchMap(() => {
    return new Observable<string>((subscriber) => {
        rl.on('line', (line) => subscriber.next(line));
    });
}).startWith('');

const command$ = new Observable<Command>((subscriber) => {
    let buffer: string[] = [];
    const subscription = lines$.subscribe(line => {
        let cmd = lineToCmdParts(line);
        if ((isMultilineCmd(cmd[0]) || buffer.length) && !isBufferEndCmd(cmd)) {
            buffer = buffer.concat(line);
        } else if (isBufferEndCmd(cmd)) {
            subscriber.next(new Command(buffer));
            buffer = [];
        } else {
            subscriber.next(new Command([line]));
        }
    });
    return subscription;
});

const state$ = command$.flatMap((cmd: Command) => {
    if (isValidCommand(cmd)) {
        return Observable.fromPromise(execute(cmd, state, mesh));
    } else if (isEmptyCommand(cmd)) {
        return [state];
    } else {
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
    complete(mesh, state, req.line, req.callback);
});

function prompt(state): string {
    if (state.project && state.current) {
        return `${state.project}${decodeURI(state.current.path)}:${state.current.uuid} (${state.lang})$ `;
    } else {
        return '$ ';
    }
}
