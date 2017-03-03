import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';
export async function read(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    let uuid = cmd.params.length ? cmd.params[0] : state.current.uuid;
    let node = await mesh.api.project(state.project).nodes.nodeUuid(uuid).get({ version: 'draft', lang: state.lang })
    console.log(JSON.stringify(node, null, 4));
    return state;
}