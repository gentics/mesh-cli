#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const readline = require("readline");
const mesh_api_1 = require("mesh-api");
const commands_1 = require("./commands");
const completers_1 = require("./completers");
class State {
}
exports.State = State;
let mesh = new mesh_api_1.MeshAPI({ debug: false });
let state;
let rl;
mesh.api.auth.login.post({ username: 'admin', password: 'admin' })
    .then(() => {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: completer
    });
    rl.on('line', onLine);
    state = { project: '', current: null, buffer: [] };
    onLine('project demo');
})
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
function completer(line, callback) {
    let cmd = line.split(' ');
    if (completers_1.COMPLETERS[cmd[0]]) {
        completers_1.COMPLETERS[cmd[0]](mesh, line, cmd, state)
            .then((result) => {
            callback(null, result);
        }).catch((err) => {
            callback(err, [[], line]);
        });
    }
    else {
        completers_1.COMPLETERS['defaultCompleter'](mesh, line, cmd, state).then((result) => {
            callback(null, result);
        }).catch((err) => {
            callback(err, [[], line]);
        });
    }
}
function onLine(line) {
    return __awaiter(this, void 0, void 0, function* () {
        if (state.buffer.length) {
            if (line !== ';;') {
                state = __assign({}, state, { buffer: state.buffer.concat(line) });
                rl.prompt();
                return;
            }
            else {
                line = state.buffer[0];
            }
        }
        let cmd = line.split(' ');
        if (commands_1.COMMANDS[cmd[0]]) {
            commands_1.COMMANDS[cmd[0]](mesh, line, cmd, state)
                .then((newState) => {
                state = newState;
                if (state.buffer.length) {
                    rl.setPrompt('> ');
                }
                else {
                    rl.setPrompt(`${state.project}:${state.current.uuid}$ `);
                }
                if (state.buffer.length === 1) {
                    console.log('Multiline input: terminate with ";;⏎"');
                }
                rl.prompt();
            }).catch((e) => {
                console.error('ERROR', e);
                state = __assign({}, state, { buffer: [] });
                rl.setPrompt(`${state.project}:${state.current.uuid}$ `);
                rl.prompt();
            });
        }
        else {
            console.error('Unknown command ' + cmd[0]);
            rl.prompt();
        }
    });
}
