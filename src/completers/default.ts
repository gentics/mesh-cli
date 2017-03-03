import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';
import { commandNames } from '../commands'
import * as readline from 'readline';
export async function defaultCompleter(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<readline.CompleterResult> {
    return new Promise<readline.CompleterResult>(async (resolve, reject) => {
        let completions = commandNames();
        let hits = completions.filter((c) => { return c.indexOf(line) === 0 });
        resolve([hits.length ? hits : completions, line]);
    });
}