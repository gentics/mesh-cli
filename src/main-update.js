#!/usr/bin/env node

'use strict';

const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const configure = require("./actions/configure");
const common = require("./inc/common");

const project = require('./actions/project');
const plugin = require('./actions/plugin');

const user = require('./actions/user');
const role = require('./actions/role');
const group = require('./actions/group');

const schema = require('./actions/schema');
const microschema = require('./actions/microschema');
const tagfamily = require('./actions/tagfamily');

common.register("Update elements that are stored in the system.");
configure.register();

program
    .usage("update [options] [command]");

program
    .command('user [name/uuid]')
    .alias("u")
    .description("Update the user.")
    .option("-g, --addGroup [group]", "Add user to group.")
    .option("-G, --removeGroup [group]", "Remove user from group.")
    .action(user.update)
    .group("Element");

program
    .command('group [name/uuid]')
    .alias("g")
    .description("Update the group.")
    .action(group.update)
    .group("Element");

program
    .command('role [name/uuid]')
    .alias("r")
    .description("Update the role.")
    .option("-g, --addGroup [group]", "Add role to group.")
    .option("-G, --removeGroup [group]", "Remove role from group.")
    .action(role.update)
    .group("Element");

program
    .command("schema [filename]")
    .alias("s")
    .description("Update schema via stdin or file.")
    .action(schema.update)
    .group("Element");

program
    .command("microschema [filename]")
    .alias("ms")
    .description("Update microschema via stdin or file.")
    .action(microschema.update)
    .group("Element");

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

