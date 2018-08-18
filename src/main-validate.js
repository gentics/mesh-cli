'use strict';

const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const configure = require("./actions/configure");
const common = require("./inc/common");

const schema = require("./actions/schema");
const microschema = require("./actions/microschema");

common.register();
configure.register();

program
    .usage("unlink [options] [command]");

program
    .command("schema [path]")
    .alias("s")
    .description("Validate schema.")
    .action(schema.validate);

program
    .command("microschema [path]")
    .alias("m")
    .description("Validate microschema.")
    .action(microschema.validate);

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

