#!/usr/bin/env node

import * as readline from 'readline';
import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api';
import cd from './commands/cd';
import { COMMANDS } from './commands';
import { COMPLETERS } from './completers';
import * as url from 'url';

export class State {
    public readonly project?: string;
    public readonly current?: ProjectNodesNodeUuidGetResponse;
    public readonly buffer?: string[];
    public readonly lang: string;
}

let config: any = {};
let auth = ['admin', 'admin']
let initProject;
if (process.argv[2]) {
    let parts = url.parse(process.argv[2]);
    config.url = `${parts.protocol}//${parts.host}${parts.path}`;
    config.debug = false;
    if (parts.auth !== null) auth = parts.auth.split(':');
}

if (process.argv[3]) {
    initProject = process.argv[3];
}

let mesh = new MeshAPI(config);
let state: State;
let rl: readline.ReadLine;

mesh.api.auth.login.post({ username: auth[0], password: auth[1] })
    .then(() => {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            completer: completer
        });
        rl.on('line', onLine);
        state = { project: '', current: null, buffer: [], lang: 'en' };
        if (initProject) {
            onLine(`project ${initProject}`);
        } else {
            rl.setPrompt(prompt(state));
            rl.prompt();
        }
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
                rl.setPrompt(prompt(state));
                if (state.buffer.length === 1) {
                    console.log('Multiline input: terminate with ";;⏎"');
                }
                rl.prompt();
            }).catch((e) => {
                console.error('ERROR', e);
                state = { ...state, buffer: [] };
                rl.setPrompt(prompt(state));
                rl.prompt();
            });
    } else {
        console.error('Unknown command ' + cmd[0]);
        rl.prompt();
    }
}

function prompt(state): string {
    if (state.buffer.length) {
        return '> ';
    } else if (state.project && state.current) {
        return `${state.project}:${state.current.uuid} (${state.lang})$ `;
    } else {
        return '$ ';
    }
}
