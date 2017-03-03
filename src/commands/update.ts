import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';

export async function update(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    if (!state.project) throw (new Error('Cannot create without an active project.'));
    let input = cmd.buffer.join('\n');
    let data = JSON.parse(input.substr(input.indexOf('{')));
    let msg = await mesh.api.project(state.project).nodes.nodeUuid(data.uuid).post(data, { lang: state.lang });
    console.log(msg)
    return state;
}
