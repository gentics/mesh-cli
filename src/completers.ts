import { State } from './mesh-cli';
import { MeshAPI, ProjectsProjectUuidGetResponse, ProjectSchemasSchemaUuidGetResponse } from 'mesh-api';
import * as readline from 'readline';
import { defaultCompleter } from './completers/default';
import { nodeChildrenCompleter } from './completers/nodechildren';

type Completer = (mesh: MeshAPI, line: string, cmd: string[], state: State) => Promise<[string[], string]>;

interface CompleterTable { [key: string]: Completer }

let defaultNodeChildrenQuery = (state, mesh) => mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children;
let uuidReducer = (prev, node) => prev.concat(node.uuid);

const COMPLETERS: CompleterTable = {
    defaultCompleter: defaultCompleter,
    cd: nodeChildrenCompleter(
        defaultNodeChildrenQuery,
        (node, cmd) => node.container && node.uuid.indexOf(cmd[1]) === 0,
        uuidReducer
    ),
    delete: nodeChildrenCompleter(
        defaultNodeChildrenQuery,
        (node, cmd) => node.uuid.indexOf(cmd[1]) === 0,
        uuidReducer
    ),
    project: nodeChildrenCompleter<ProjectsProjectUuidGetResponse>(
        (state, mesh) => mesh.api.projects,
        (node, cmd) => node.name.indexOf(cmd[1]) === 0,
        (prev, node) => prev.concat(node.name)
    ),
    read: nodeChildrenCompleter(
        defaultNodeChildrenQuery,
        (node, cmd) => node.uuid.indexOf(cmd[1]) === 0,
        uuidReducer
    ),
    schema: nodeChildrenCompleter<ProjectSchemasSchemaUuidGetResponse>(
        (state, mesh) => mesh.api.project(state.project).schemas,
        (node, cmd) => node.uuid.indexOf(cmd[1]) === 0,
        uuidReducer
    )
}

export function complete(mesh: MeshAPI, state: State, line: string, callback?: (err: any, result: readline.CompleterResult) => void): any {
    let cmd = line.split(' ');
    if (COMPLETERS[cmd[0]]) {
        COMPLETERS[cmd[0]](mesh, line, cmd, state)
            .then((result) => {
                callback(null, result);
            }).catch((err) => {
                callback(err, [[], line]);
            });
    } else {
        COMPLETERS['defaultCompleter'](mesh, line, cmd, state).then((result) => {
            callback(null, result);
        }).catch((err) => {
            callback(err, [[], line]);
        });
    }
}

