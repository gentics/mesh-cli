import { MeshAPI } from 'mesh-api-client';
import { State } from '../mesh-cli';
let table = require('text-table');

export default async function schemas(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    let schemas = await mesh.api.project(state.project).schemas.get();
    let data = schemas.data.reduce((out, schema) => {
        out.push([
            schema.uuid,
            schema.name,
            schema.displayField,
            schema.segmentField,
            schema.container ? 'true' : 'false'
        ]);
        return out;
    }, [['uuid', 'name', 'displayField', 'segmentField', 'container']]);
    console.log(table(data), '\n');
    return state;
}