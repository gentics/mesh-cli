import { State } from './mesh-cli';
import { MeshAPI } from 'mesh-api';
import { cd } from './commands/cd';
import { create } from './commands/create';
import { deleteNode } from './commands/delete';
import { lang } from './commands/lang';
import { ls } from './commands/ls';
import { project } from './commands/project';
import { projects } from './commands/projects';
import { read } from './commands/read';
import { schema } from './commands/schema';
import { schemas } from './commands/schemas';
import { update } from './commands/update';
import { users } from './commands/users';
import { groups } from './commands/groups';

export class Command {
    public readonly name: string;
    public readonly params: string[];
    public readonly buffer: string[];

    constructor (buffer: string[]) {
        let parts = lineToCmdParts(buffer[0]);
        this.name = parts[0];
        this.params = parts.filter((v, i) => i > 0);
        this.buffer = [];
        if (buffer.length > 1) {
            this.buffer = buffer.filter((v, i) => i > 0);
        }
    }
}

type ExecutableCommand = (cmd: Command, state: State, mesh: MeshAPI) => Promise<State>;
interface CommandTable { [key: string]: ExecutableCommand }
const COMMANDS: CommandTable = {
    cd: cd,
    create: create,
    delete: deleteNode,
    groups: groups,
    lang: lang,
    ls: ls,
    project: project,
    projects: projects,
    read: read,
    schema: schema,
    schemas: schemas,
    update: update,
    users: users
}

const MULTILINE_COMMANDS = ['create', 'update'];

export function commandNames() {
    return Object.keys(COMMANDS);
}

export function isMultilineCmd(cmd: string) {
    return MULTILINE_COMMANDS.indexOf(cmd) !== -1;
}

export function isBufferEndCmd(cmd: string[]) {
    return cmd.length === 1 && cmd[0] === ';;';
}

export function lineToCmdParts(line: string) {
    return line.split(' ').map((v) => v.trim());
}

export function isValidCommand(cmd: Command) {
    return !!COMMANDS[cmd.name];
}

export function isEmptyCommand(cmd: Command) {
    return cmd.name === '';
}

export function execute(cmd: Command, state: State, mesh: MeshAPI): Promise<State> {
    return COMMANDS[cmd.name](cmd, state, mesh);
}