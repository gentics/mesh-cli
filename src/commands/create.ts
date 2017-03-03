import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';

export async function create(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    let input = cmd.buffer.join('\n');
    let data = JSON.parse(input.substr(input.indexOf('{')));
    const msg = await mesh.api.project(state.project).nodes.post(data, { lang: state.lang });
    console.log(msg);
    return state;
}
