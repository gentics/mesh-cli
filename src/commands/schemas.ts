import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';
let table = require('text-table');

export async function schemas(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    let schemas = await mesh.api.project(state.project).schemas.get();
    let data = schemas.data.reduce((out, schema) => {
        out.push([
            schema.uuid,
            schema.name,
            schema.displayField || '-',
            schema.segmentField || '-',
            schema.container ? 'true' : 'false'
        ]);
        return out;
    }, [['uuid', 'name', 'displayField', 'segmentField', 'container']]);
    console.log(table(data), '\n');
    return state;
}