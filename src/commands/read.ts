import { MeshAPI } from 'mesh-api-client';
import { State } from '../mesh-cli';
export default async function read(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    let uuid = cmd.length === 1 ? state.current.uuid : cmd[1];
    let node = await mesh.api.project(state.project).nodes.nodeUuid(uuid).get({ version: 'draft' })
    console.log(JSON.stringify(node, null, 4));
    return state;
}