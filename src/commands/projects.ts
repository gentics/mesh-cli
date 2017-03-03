import { MeshAPI } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';
let table = require('text-table');

export async function projects(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    let projects = await mesh.api.projects.get();
    let data = projects.data.reduce((out, p) => {
        out.push([p.uuid, p.name, p.created, p.rootNode.uuid]);
        return out;
    }, [['uuid', 'name', 'created', 'rootNode.uuid']]);
    console.log(table(data));
    return state;
}