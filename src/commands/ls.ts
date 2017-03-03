import { MeshAPI, ProjectNodesNodeUuidGetResponse } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';
let table = require('text-table');

export async function ls(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    if (!state.project || !state.current.uuid) return state;
    let nodes = await mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children.get({ version: 'draft', lang: state.lang });
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
    console.log(
        table(data),
        '\n',
        `${data.length ? data.length - 1 : 0} nodes`,
        '\n'
    );
    return state;
}

function fields(node: any): string {
    if (!node.fields || Object.keys(node.fields).length === 0) return '-';
    let displayField;
    if (node['displayField']) {
        displayField = node['displayField'];
    } else {
        displayField = Object.keys(node.fields)[0];
    }
    return node.fields[displayField];
}