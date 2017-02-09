import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api-client';
import { State } from '../mesh-cli';

export default async function update(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    return new Promise<State>(async (resolve, reject) => {
        if (cmd[1] === 'node') {
            let data = JSON.parse(line.substr(line.indexOf('{')));
            mesh.api.project(state.project).nodes.nodeUuid(data.uuid).post(data)
                .then((msg) => {
                    console.log(msg)
                    resolve(state);
                })
                .catch((e) => {
                    reject(e);
                })
        }
    });
}
