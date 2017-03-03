"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cd_1 = require("./commands/cd");
const create_1 = require("./commands/create");
const delete_1 = require("./commands/delete");
const lang_1 = require("./commands/lang");
const ls_1 = require("./commands/ls");
const project_1 = require("./commands/project");
const projects_1 = require("./commands/projects");
const read_1 = require("./commands/read");
const schema_1 = require("./commands/schema");
const schemas_1 = require("./commands/schemas");
const update_1 = require("./commands/update");
const users_1 = require("./commands/users");
const groups_1 = require("./commands/groups");
class Command {
    constructor(buffer) {
        let parts = lineToCmdParts(buffer[0]);
        this.name = parts[0];
        this.params = parts.filter((v, i) => i > 0);
        this.buffer = [];
        if (buffer.length > 1) {
            this.buffer = buffer.filter((v, i) => i > 0);
        }
    }
}
exports.Command = Command;
const COMMANDS = {
    cd: cd_1.cd,
    create: create_1.create,
    delete: delete_1.deleteNode,
    groups: groups_1.groups,
    lang: lang_1.lang,
    ls: ls_1.ls,
    project: project_1.project,
    projects: projects_1.projects,
    read: read_1.read,
    schema: schema_1.schema,
    schemas: schemas_1.schemas,
    update: update_1.update,
    users: users_1.users
};
const MULTILINE_COMMANDS = ['create', 'update'];
function commandNames() {
    return Object.keys(COMMANDS);
}
exports.commandNames = commandNames;
function isMultilineCmd(cmd) {
    return MULTILINE_COMMANDS.indexOf(cmd) !== -1;
}
exports.isMultilineCmd = isMultilineCmd;
function isBufferEndCmd(cmd) {
    return cmd.length === 1 && cmd[0] === ';;';
}
exports.isBufferEndCmd = isBufferEndCmd;
function lineToCmdParts(line) {
    return line.split(' ').map((v) => v.trim());
}
exports.lineToCmdParts = lineToCmdParts;
function isValidCommand(cmd) {
    return !!COMMANDS[cmd.name];
}
exports.isValidCommand = isValidCommand;
function isEmptyCommand(cmd) {
    return cmd.name === '';
}
exports.isEmptyCommand = isEmptyCommand;
function execute(cmd, state, mesh) {
    return COMMANDS[cmd.name](cmd, state, mesh);
}
exports.execute = execute;
//# sourceMappingURL=commands.js.map