import { MeshAPI } from 'mesh-api-client';
import { State } from '../mesh-cli';

export default async function project(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    let schema = await mesh.api.schemas.schemaUuid(cmd[1]).get();
    console.log(JSON.stringify(schema, null, 4));
    return state;
}