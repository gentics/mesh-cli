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

const tagfamily = require('./actions/tagfamily');
const schema = require('./actions/schema');

common.register();
configure.register();

program
    .usage("remove [options] [command]");

program
    .command("user [name/uuid]")
    .alias("u")
    .description("Remove the user.")
    .action(user.remove);

program
    .command("role [name/uuid]")
    .alias("r")
    .description("Remove the role.")
    .action(role.remove);

program
    .command("group [name/uuid]")
    .alias("g")
    .description("Remove the group.")
    .action(group.remove);

program
    .command("plugin [id]")
    .description("Uninstall a plugin")
    .action(plugin.uninstall);

program
    .command("project [project]")
    .alias("r")
    .description("Remove the project.")
    .action(project.remove);

program
    .command("schema [name]")
    .alias("s")
    .description("Remove schema.")
    .action(schema.remove);

program
    .command("tagfamily [name/uuid]")
    .alias("tf")
    .description("Remove the tagfamily.")
    .action(tagfamily.remove);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

