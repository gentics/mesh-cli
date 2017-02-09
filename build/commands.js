"use strict";
const cd_1 = require("./commands/cd");
const create_1 = require("./commands/create");
const delete_1 = require("./commands/delete");
const ls_1 = require("./commands/ls");
const project_1 = require("./commands/project");
const projects_1 = require("./commands/projects");
const read_1 = require("./commands/read");
const schema_1 = require("./commands/schema");
const schemas_1 = require("./commands/schemas");
const update_1 = require("./commands/update");
exports.COMMANDS = {
    cd: cd_1.default,
    create: create_1.default,
    delete: delete_1.default,
    ls: ls_1.default,
    project: project_1.default,
    projects: projects_1.default,
    read: read_1.default,
    schema: schema_1.default,
    schemas: schemas_1.default,
    update: update_1.default
};
