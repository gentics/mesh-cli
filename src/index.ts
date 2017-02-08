import * as readline from 'readline';
import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api-client'
import cd from './commands/cd';
import { COMMANDS } from './commands';
import { COMPLETERS } from './completers';

export class State {
  constructor(readonly rl: readline.ReadLine, readonly project: string, readonly current: ProjectNodesNodeUuidGetResponse) { }
}

let mesh = new MeshAPI({ debug: false });
let state = new State(null, '', null);
let rl;

mesh.api.auth.login.post({ username: 'admin', password: 'admin' }).then(() => {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: completer
  });
  rl.on('line', onLine);
  state = new State(rl, '', null);
  onLine('project demo');
});
                  
function completer(line: string, callback?: (err: any, result: readline.CompleterResult) => void): any {
  let cmd = line.split(' ');
  if (COMPLETERS[cmd[0]]) {
    COMPLETERS[cmd[0]](mesh, line, cmd, state).then((result) => {
      callback(null, result);
    });
  } else {
    COMPLETERS['defaultCompleter'](mesh, line, cmd, state).then((result) => {
      callback(null, result);
    });
  }
}

async function onLine(line: string) {
  let cmd = line.split(' ');
  if (COMMANDS[cmd[0]]) {
    COMMANDS[cmd[0]](mesh, cmd, state).then((newState) => {
      state = newState;
      let breadcrumb = state.current.fields.name || '/';
      if (state.current.breadcrumb.length) {
        breadcrumb = state.current.breadcrumb.reduce((str, cur) => `${str}/${cur.displayName}`, '/') + state.current.fields.name;
      }
      state.rl.setPrompt(`${state.project}:${breadcrumb}> `);
      state.rl.prompt();
    }).catch((e) => {
      console.error(e);
      state.rl.prompt();
    });
  }
}