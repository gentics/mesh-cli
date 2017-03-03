import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';

export async function project(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    let opts = { version: 'draft', lang: state.lang, resolveLinks: 'short' };
    let projects = await mesh.api.projects.get();
    let p = projects.data.filter((p) => p.name === cmd.params[0]);
    if (p.length === 0) {
        throw new Error('No such project.');
    } else {
        let node = await mesh.api.project(p[0].name).nodes.nodeUuid(p[0].rootNode.uuid).get(opts);
        return { ...state, project: cmd.params[0], current: node };
    }
}