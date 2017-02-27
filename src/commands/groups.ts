import { MeshAPI, UsersGetResponse } from 'mesh-api';
import { State } from '../mesh-cli';
let table = require('text-table');

export default async function groups(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    let groups = await mesh.api.groups.get();
    let data = groups.data.reduce((out, group) => {
        out.push([
            group.uuid,
            group.name,
            group.roles.reduce((p, c) => p.concat(c.name), []).join(', ')
        ]);
        return out;
    }, [['uuid', 'name', 'roles']]);
    console.log(table(data), '\n');
    return state;
}


