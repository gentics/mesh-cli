import { MeshAPI } from 'mesh-api-client';
import { State } from '../mesh-cli';

export default async function schemas(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    let schemas = await mesh.api.project(state.project).schemas.get();
    console.log(schemas.data.reduce((out, schema) => {
        return `${out}${schema.uuid} ${schema.name}\n`;
    }, ''));
    return state;
}