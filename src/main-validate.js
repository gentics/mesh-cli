#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const configure = require("./actions/configure");
const common = require("./inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

const schema = require("./actions/schema");
const microschema = require("./actions/microschema");

common.register("Validate a schema or microschema JSON file.");
configure.register();

program
    .usage("unlink [options] [command]");

program
    .command("schema [path]")
    .alias("s")
    .description("Validate schema.")
    .action(schema.validate)
    .group("Schema");

program
    .command("microschema [path]")
    .alias("m")
    .description("Validate microschema.")
    .action(microschema.validate)
    .group("Schema");

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

