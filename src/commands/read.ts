import { MeshAPI } from 'mesh-api-client';
import { State } from '../index';
export default async function read(mesh: MeshAPI, cmd: string[], state: State): Promise<State> {
    return new Promise<State>(async (resolve, reject) => {
        let uuid = cmd.length === 1 ? state.current.uuid : cmd[1];
        mesh.api.project(state.project).nodes.nodeUuid(uuid).get({ version: 'draft'})
            .then((node) => {
                console.log(JSON.stringify(node, null, 4));
                resolve(state);
            })
            .catch((reason) => {
                console.error(reason);
                resolve(state);
            });
    });
}