import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';

export default async function projects(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    let projects = await mesh.api.projects.get();
    projects.data.reduce((out, p) => {
        return `${out} ${p.name}`;
    }, '');
    return state;
}