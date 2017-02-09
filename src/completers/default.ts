import { MeshAPI } from 'mesh-api-client';
import { State } from '../mesh-cli';
import { COMMANDS } from '../commands'
import * as readline from 'readline';
export default async function defaultCompleter(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<readline.CompleterResult> {
    return new Promise<readline.CompleterResult>(async (resolve, reject) => {
        let completions = Object.keys(COMMANDS);
        let hits = completions.filter((c) => { return c.indexOf(line) === 0 });
        resolve([hits.length ? hits : completions, line]);
    });
}