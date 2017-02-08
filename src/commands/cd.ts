import { MeshAPI } from 'mesh-api-client';
import { State } from '../index';
export default async function cd(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    return new Promise<State>(async (resolve, reject) => {
        if (cmd[1] === '..') {
            let parent = await mesh.api.project(state.project).nodes.nodeUuid(state.current.parentNode.uuid).get({ version: 'draft'});
            resolve(new State(state.rl, state.project, parent));
        } else {
            let nodes = await mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children.get({ version: 'draft'});
            let found = nodes.data.filter((val) => {
                return val.container && (val.uuid === cmd[1] || val.fields.name === cmd[1]);
            });
            if (found.length === 1) {
                resolve(new State(state.rl, state.project, found[0]));
            } else {
                resolve(state);
            }
        }
    });
}