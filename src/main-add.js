#!/usr/bin/env node

'use strict';

const program = require('commander');

const project = require('./actions/project');
const plugin = require('./actions/plugin');

const user = require('./actions/user');
const role = require('./actions/role');
const group = require('./actions/group');

const schema = require('./actions/schema');
const tagfamily = require('./actions/tagfamily');

program
    .version('0.0.1')
    .usage("add [options] [command]")
    .name("mesh-cli");

program
    .command("plugin [path]")
    .description("Install a plugin")
    .action(plugin.install);

program
    .command('tagfamily [name]')
    .description("Add a new tagfamily.")
    .action(tagfamily.add);

program
    .command("project [name]")
    .alias("a")
    .description("Add a new project.")
    .option("-s, --schema", "Use the given schema for the root node.")
    .action(project.add);

program
    .command("schema [filename]")
    .alias("a")
    .description("Add a new schema via stdin or file.")
    .action(schema.add);

program
    .command("group [name]")
    .alias("a")
    .description("Add a new group.")
    .action(group.add);

program
    .command('user [name]')
    .alias("u")
    .option("-p, --pass [password]", "Password")
    .description("Add a new user.")
    .action(user.add);

program
    .command('role [name]')
    .alias("r")
    .description("Add a new role.")
    .action(role.add);


program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

