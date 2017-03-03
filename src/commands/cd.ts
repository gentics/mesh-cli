import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';


export async function cd(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    const opts = { version: 'draft', lang: state.lang, resolveLinks: 'short' };
    if (cmd.params[0] === '..') {
        if (state.current && state.current.parentNode) {
            let parent = await mesh.api
                .project(state.project).nodes
                .nodeUuid(state.current.parentNode.uuid)
                .get(opts);
            return { ...state, current: parent };
        } else {
            return state;
        }
    } else {
        let nodes = await mesh.api.project(state.project).nodes
            .nodeUuid(state.current.uuid)
            .children.get(opts);
        let found = nodes.data.filter((val) => {
            return val.container && (val.uuid === cmd.params[0] || val.fields.name === cmd.params[0]);
        });
        if (found.length === 1) {
            return { ...state, current: found[0] };
        } else {
            return state;
        }
    }
}