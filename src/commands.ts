import { State } from './mesh-cli';
import { MeshAPI } from 'mesh-api';
import cd from './commands/cd';
import create from './commands/create';
import deleteNode from './commands/delete';
import ls from './commands/ls';
import project from './commands/project';
import projects from './commands/projects';
import read from './commands/read';
import schema from './commands/schema';
import schemas from './commands/schemas';
import update from './commands/update';

type Command = (mesh: MeshAPI, line: string, cmd: string[], state: State) => Promise<State>;
interface CommandTable { [key: string]: Command }
export const COMMANDS: CommandTable = {
    cd: cd,
    create: buffered(create),
    delete: deleteNode,
    ls: ls,
    project: project,
    projects: projects,
    read: read,
    schema: schema,
    schemas: schemas,
    update: buffered(update)
}

function buffered(func: Command): Command {
    return async (mesh: MeshAPI, line: string, cmd: string[], state: State): Promise<State> => {
        if (!state.buffer.length) {
            return { ...state, buffer: state.buffer.concat(line) };
        } else {
            let s = await func(mesh, line, cmd, state);
            return { ...s, buffer: [] };
        }
    }
}