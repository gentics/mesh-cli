import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';

export async function lang(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    return { ...state, lang: cmd.params[0] };
}