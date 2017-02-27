import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api';
import { State } from '../mesh-cli';

export default async function create(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    let input = state.buffer.join('\n');
    let data = JSON.parse(input.substr(input.indexOf('{')));
    const msg = await mesh.api.project(state.project).nodes.post(data, { lang: state.lang });
    console.log(msg);
    return state;
}
