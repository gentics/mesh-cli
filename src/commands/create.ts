import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api-client';
import { State } from '../mesh-cli';

export default async function create(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    if (!state.buffer.length) {
        return { ...state, buffer: state.buffer.concat(line) };
    } else {
        let input = state.buffer.join('\n');
        let data = JSON.parse(input.substr(input.indexOf('{')));
        const msg = await mesh.api.project(state.project).nodes.post(data)
        console.log(msg);
        return { ...state, buffer: [] };
    }
}
