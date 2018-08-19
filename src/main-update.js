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
    .action(user.update);

program
    .command("schema [filename]")
    .alias("s")
    .description("Update schema via stdin or file.")
    .action(schema.update);

program
    .command("microschema [filename]")
    .alias("ms")
    .description("Update microschema via stdin or file.")
    .action(microschema.update);

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

