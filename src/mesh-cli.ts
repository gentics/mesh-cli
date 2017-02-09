#!/usr/bin/env node

import * as readline from 'readline';
import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api';
import cd from './commands/cd';
import { COMMANDS } from './commands';
import { COMPLETERS } from './completers';

export class State {
    public readonly project: string;
    public readonly current: ProjectNodesNodeUuidGetResponse;
    public readonly buffer: string[];
}

let mesh = new MeshAPI({ debug: false });
let state: State;
let rl: readline.ReadLine;

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

function completer(line: string, callback?: (err: any, result: readline.CompleterResult) => void): any {
    let cmd = line.split(' ');
    if (COMPLETERS[cmd[0]]) {
        COMPLETERS[cmd[0]](mesh, line, cmd, state)
            .then((result) => {
                callback(null, result);
            }).catch((err) => {
                callback(err, [[], line]);
            });
    } else {
        COMPLETERS['defaultCompleter'](mesh, line, cmd, state).then((result) => {
            callback(null, result);
        }).catch((err) => {
            callback(err, [[], line]);
        });
    }
}

async function onLine(line: string) {
    if (state.buffer.length) {
        if (line !== ';;') {
            state = { ...state, buffer: state.buffer.concat(line) };
            rl.prompt();
            return;
        } else {
            line = state.buffer[0];
        }
    }
    let cmd = line.split(' ');
    if (COMMANDS[cmd[0]]) {
        COMMANDS[cmd[0]](mesh, line, cmd, state)
            .then((newState) => {
                state = newState;
                if (state.buffer.length) {
                    rl.setPrompt('> ');
                } else {
                    rl.setPrompt(`${state.project}:${state.current.uuid}$ `);
                }
                if (state.buffer.length === 1) {
                    console.log('Multiline input: terminate with ";;⏎"');
                }
                rl.prompt();
            }).catch((e) => {
                console.error('ERROR', e);
                state = { ...state, buffer: [] };
                rl.setPrompt(`${state.project}:${state.current.uuid}$ `);
                rl.prompt();
            });
    } else {
        console.error('Unknown command ' + cmd[0]);
        rl.prompt();
    }
}
