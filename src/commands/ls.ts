import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api-client';
import { State } from '../mesh-cli';
let table = require('text-table');

export default async function ls(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    let nodes = await mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children.get({ version: 'draft' });
    let data = nodes.data.reduce((out, node) => {
        let type = node.container ? 'DIR ' : 'NODE';
        out.push([
            node.uuid,
            node.schema.name,
            node.edited,
            node.fields ? node.fields[Object.keys(node.fields)[0]] : '...'
        ]);
        return out;
    }, [['uuid', 'schema', 'edited', 'displayField']]);
    console.log(table(data), '\n');
    return state;
}
