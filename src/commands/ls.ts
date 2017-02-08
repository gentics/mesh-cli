import { MeshAPI } from 'mesh-api-client';
import { State } from '../index';
export default async function ls(mesh: MeshAPI, cmd: string[], state: State): Promise<State> {
    return new Promise<State>(async (resolve, reject) => {
        let nodes = await mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children.get();
        console.log(nodes.data.reduce((out, node) => {
            let type = node.container ? 'DIR' : '   ';
            return `${out}\n${type} ${node.uuid} ${node.fields.name}`;
        }, ''));
        resolve(state);
    });
}