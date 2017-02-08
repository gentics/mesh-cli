import { MeshAPI } from 'mesh-api-client';
import { State } from '../index';
import * as readline from 'readline';
export default async function cd(mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<readline.CompleterResult> {
    return new Promise<readline.CompleterResult>(async (resolve, reject) => {
        let nodes = await mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children.get();
        if (cmd.length === 1) {
            resolve([
                nodes.data.reduce((prev, curr) => {
                    return prev.concat(curr.uuid).concat(curr.fields.name);
                }, []),
                line   
            ]);
        }
        let found: string[] = nodes.data.filter((val) => {
            return val.container && (val.uuid.indexOf(cmd[1]) === 0 || val.fields.name.indexOf(cmd[1]) === 0);
        }).reduce((prev, current) => {
            let v = current.uuid.indexOf(cmd[1]) === 0 ? current.uuid : current.fields.name;
            return prev.concat(v);
        }, []);
        resolve([found, cmd[0]]);
    });
}