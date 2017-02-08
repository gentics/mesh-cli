import { MeshAPI } from 'mesh-api-client';
import { State } from '../index';
export default async function read(mesh: MeshAPI, cmd: string[], state: State): Promise<State> {
    return new Promise<State>(async (resolve, reject) => {
        let node = await mesh.api.project(state.project).nodes.nodeUuid(cmd[1]).get();
        console.log(JSON.stringify(node, null, 4));
        resolve(state);
    });
}