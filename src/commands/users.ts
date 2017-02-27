import { MeshAPI, UsersGetResponse } from 'mesh-api';
import { State } from '../mesh-cli';
let table = require('text-table');

export default async function users(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> {
    let users = await mesh.api.users.get();
    let data = users.data.reduce((out, user) => {
        out.push([
            user.uuid,
            user.emailAddress || '-',
            user.firstname || '-',
            user.lastname || '-',
            user.nodeReference ? user.nodeReference.uuid : '-',
            user.enabled ? 'true' : 'false',
            user.groups.reduce((p, c) => p.concat(c.name), []).join(', ')
        ]);
        return out;
    }, [['uuid', 'emailAddress', 'firstname', 'lastname', 'nodeReference', 'enabled', 'groups']]);
    console.log(table(data), '\n');
    return state;
}
