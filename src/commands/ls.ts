import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api';
import { State } from '../mesh-cli';
let table = require('text-table');

export default async function ls(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    if (!state.project || !state.current.uuid) return state;
    let nodes = await mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children.get({ version: 'draft' });
    let data = nodes.data.reduce((out, node) => {
        out.push([
            node.uuid,
            node.schema.name,
            node.edited,
            node.fields ? node.fields[Object.keys(node.fields)[0]] : '...',
            node.container ? 'true' : 'false'
        ]);
        return out;
    }, [['uuid', 'schema', 'edited', 'displayField', 'container']]);
    console.log(table(data), '\n');
    return state;
}
