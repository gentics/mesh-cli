import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';

export default async function project(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    let projects = await mesh.api.projects.get();
    let p = projects.data.filter((p) => p.name === cmd[1]);
    if (p.length === 0) {
        throw new Error('No such project.');
    } else {
        let node = await mesh.api.project(p[0].name).nodes.nodeUuid(p[0].rootNodeUuid).get({ version: 'draft' })
        return { ...state, project: cmd[1], current: node };
    }
}