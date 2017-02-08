import { State } from './index';
import { MeshAPI } from 'mesh-api-client';
import cd from './commands/cd';
import create from './commands/create';
import ls from './commands/ls';
import project from './commands/project';
import projects from './commands/projects';
import read from './commands/read';
import schema from './commands/schema';
import schemas from './commands/schemas';

type Command = (mesh: MeshAPI, line: string, cmd: string[], state: State) => Promise<State>;
interface CommandTable { [key: string]: Command }
export const COMMANDS: CommandTable = {
    cd: cd,
    create: create,
    ls: ls,
    project: project,
    projects: projects,
    read: read,
    schema: schema,
    schemas: schemas
}