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
            node.edited || '-', // turns out edited can be null, even if that's a bug in mesh
            fields(node),
            node.availableLanguages.join(', '),
            node.container ? 'true' : 'false'
        ]);
        return out;
    }, [['uuid', 'schema', 'edited', 'displayField', 'availableLanguages', 'container']]);
    console.log(table(data), '\n');
    return state;
}

function fields(node: any): string {
    if (node.fields && node.fields.length) {
        return node.fields[Object.keys(node.fields)[0]];
    } else {
        return '-';
    }
}