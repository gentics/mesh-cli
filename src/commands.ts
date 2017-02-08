import { State } from './index';
import { MeshAPI } from 'mesh-api-client';
import cd from './commands/cd';
import ls from './commands/ls';
import project from './commands/project';
import projects from './commands/projects';
import read from './commands/read';

type Command = (mesh: MeshAPI, cmd: string[], state: State) => Promise<State>;
interface CommandTable { [key: string]: Command }
export const COMMANDS: CommandTable = {
    cd: cd,
    ls: ls,
    project: project,
    projects: projects,
    read: read
}