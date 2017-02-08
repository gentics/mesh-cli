import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api-client';
import { State } from '../index';
import * as readline from 'readline';

export interface MeshQuery {
    (state: State, mesh: MeshAPI): { get: (options?: any) => Promise<any> }
}

export default function nodeChildrenCompleter<T>(
    query: MeshQuery,
    filter: (node: T, cmd: string[]) => boolean,
    reducer: (prev: string[], node: T) => string[]
) {
    return async (mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<readline.CompleterResult> => {
        return new Promise<readline.CompleterResult>(async (resolve, reject) => {
            query(state, mesh).get({ version: 'draft' })
                .then((nodes) => {
                    if (cmd.length === 1) {
                        resolve([
                            nodes.data.reduce((prev, curr) => {
                                return prev.concat(curr.uuid).concat(curr.fields.name);
                            }, []),
                            ''
                        ]);
                    }
                    let found: string[] = nodes.data.filter((node) => {
                        return filter(node, cmd);
                    }).reduce(reducer, []);
                    resolve([found, cmd[1]]);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}