#!/usr/bin/env node

import * as readline from 'readline';
import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api-client'
import cd from './commands/cd';
import { COMMANDS } from './commands';
import { COMPLETERS } from './completers';

export interface State {
    readonly project: string;
    readonly current: ProjectNodesNodeUuidGetResponse;
    readonly bufferCMD?: string[];
    readonly buffer?: string;
}

let mesh = new MeshAPI({ debug: false });
let state: State;
let rl;

mesh.api.auth.login.post({ username: 'admin', password: 'admin' })
    .then(() => {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            completer: completer
        });
        rl.on('line', onLine);
        rl.on('close', onClose);
        state = { project: '', current: null };
        onLine('project demo');
    })
    .catch((e) => {
        console.error(e);
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
    let cmd = line.split(' ');
    if (COMMANDS[cmd[0]]) {
        COMMANDS[cmd[0]](mesh, line, cmd, state)
            .then((newState) => {
                state = newState;
                rl.setPrompt(`${state.project}:${state.current.uuid}$ `);
                rl.prompt();
            }).catch((e) => {
                console.error('ERROR', e);
                rl.prompt();
            });
    } else {
        console.error('Unknown command ' + cmd[0]);
        rl.prompt();
    }
}

function onClose() {
    rl.write('close!');
    return false;
    // rl.close();
}