import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';

export default async function project(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    return { ...state, lang: cmd[1] };
}