import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';

export async function schema(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    let schema = await mesh.api.schemas.schemaUuid(cmd.params[0]).get();
    console.log(JSON.stringify(schema, null, 4));
    return state;
}