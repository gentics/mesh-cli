import { MeshAPI } from 'mesh-api-client';
import { State } from '../index';

export default async function schemas(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    return new Promise<State>(async (resolve, reject) => {
        mesh.api.project(state.project).schemas.get().then((schemas) => {
            console.log(schemas.data.reduce((out, schema) => {
                return `${out}${schema.uuid} ${schema.name}\n`;
            }, ''));
            resolve(state);
        });
    });
}