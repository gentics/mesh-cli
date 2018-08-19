#!/usr/bin/env node

'use strict';

const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const configure = require("./actions/configure");
const common = require("./inc/common");

const project = require("./actions/project");

common.register("Unlink schemas or microschemas from projects.");
configure.register();

program
    .usage("unlink [options] [command]");

program
    .command("schema [name] [project]")
    .alias("s")
    .description("Link the schema.")
    .action(project.unlinkSchema);

program
    .command("microschema [name] [project]")
    .alias("ms")
    .description("Link the microschema.")
    .action(project.unlinkMicroschema);

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

