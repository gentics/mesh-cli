'use strict';

const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const configure = require("./actions/configure");
const common = require("./inc/common");

const user = require("./actions/user");
const role = require("./actions/role");
const group = require("./actions/group");

const project = require("./actions/project");
const tagfamily = require("./actions/tagfamily");
const schema = require("./actions/schema");

const job = require("./actions/job");
const plugin = require("./actions/plugin");

common.register();
configure.register();

program
    .usage("get [options] [command]");

program
    .command("schema [name]")
    .alias("g")
    .description("Get the schema.")
    .action(schema.get);

program
    .command("project [name]")
    .alias("g")
    .description("Get the project.")
    .action(project.get);

program
    .command("user [name]")
    .alias("u")
    .description("Get the user.")
    .action(user.get);

program
    .command("role [name]")
    .alias("r")
    .description("Get the role.")
    .action(role.get);

program
    .command("group [name]")
    .alias("g")
    .description("Get the group.")
    .action(project.get);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}