import { MeshAPI, UsersGetResponse } from 'mesh-api';
import { State } from '../mesh-cli';
import { Command } from '../commands';
let table = require('text-table');

export async function groups(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
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


