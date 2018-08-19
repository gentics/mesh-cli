#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const admin = require("./actions/admin");
const configure = require("./actions/configure");
const common = require("./inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

common.register("CLI command for various administrative operations.");
configure.register();

program
    .usage("admin [options] [command]");

program
    .command("status")
    .alias("s")
    .description("Fetch the Gentics Mesh server status.")
    .action(admin.status)
    .group("Administration");

program
    .command("index")
    .alias("i")
    .description("Invoke the search index sync. (Requires admin perm)")
    .action(admin.indexSync)
    .group("Administration");

program
    .command("clear")
    .alias("c")
    .description("Clear the  search index. Use index command to re-build it. (Requires admin perm)")
    .action(admin.indexClear)
    .group("Administration");

program
    .command("backup")
    .alias("b")
    .description("Trigger the server-side backup process. (Requires admin perm)")
    .action(admin.backup)
    .group("Administration");

program
    .command("restore")
    .alias("r")
    .description("Trigger the server-side restore process. (Requires admin perm)")
    .action(admin.restore)
    .group("Administration");

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}