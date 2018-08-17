#!/usr/bin/env node

'use strict';

const program = require('commander');

const project = require('./actions/project');
const plugin = require('./actions/plugin');
const user = require('./actions/user');
const role = require('./actions/role');
const group = require('./actions/group');
const tagfamily = require('./actions/tagfamily');
const common = require("./common");


program
    .version('0.0.1')
    .usage("update [options] [command]")
    .name("mesh-cli");

common.register();


program
    .command('user [name/uuid]')
    .description("Remove the user.")
    .action(user.remove);

program
    .command("schema [filename]")
    .alias("u")
    .description("Update schema via stdin or file.")
    .action(schema.update);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

