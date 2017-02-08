import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api-client';
import { State } from '../index';
import * as readline from 'readline';

export default function nodeChildrenCompleter(resultFilter: (node: ProjectNodesNodeUuidGetResponse, cmd: string[]) => boolean) {
    return async (mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<readline.CompleterResult> => {
        return new Promise<readline.CompleterResult>(async (resolve, reject) => {
            let nodes = await mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children.get();
            if (cmd.length === 1) {
                resolve([
                    nodes.data.reduce((prev, curr) => {
                        return prev.concat(curr.uuid).concat(curr.fields.name);
                    }, []),
                    ''
                ]);
            }
            let found: string[] = nodes.data.filter((node) => {
                return resultFilter(node, cmd);
            }).reduce((prev, node) => {
                return prev.concat(node.uuid);
            }, []);
            resolve([found, cmd[1]]);
        });
    }
}