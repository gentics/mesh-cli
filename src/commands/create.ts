import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api-client';
import { State } from '../index';

export default async function create(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    return new Promise<State>(async (resolve, reject) => {
        if (cmd[1] === 'node') {
            let data = JSON.parse(line.substr(line.indexOf('{')));
            mesh.api.project(state.project).nodes.post(data)
                .then((msg) => {
                    console.log(msg)
                    resolve(state);
                })
                .catch((e) => {
                    reject(e);
                })
        } else {
            reject('Unknown operation ' + cmd[1]);
        }
    });
}
