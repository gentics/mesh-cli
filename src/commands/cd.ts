import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';
export default async function cd(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    if (cmd[1] === '..') {
        let parent = await mesh.api.project(state.project).nodes.nodeUuid(state.current.parentNode.uuid).get({ version: 'draft' });
        return { ...state, current: parent };
    } else {
        let nodes = await mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children.get({ version: 'draft' });
        let found = nodes.data.filter((val) => {
            return val.container && (val.uuid === cmd[1] || val.fields.name === cmd[1]);
        });
        if (found.length === 1) {
            return { ...state, current: found[0] };
        } else {
            return state;
        }
    }
}