#!/usr/bin/env node

'use strict';

const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const admin = require("./actions/admin");
const configure = require("./actions/configure");
const common = require("./inc/common");

common.register("CLI command for various administrative operations.");
configure.register();

program
    .usage("admin [options] [command]");

program
    .command("status")
    .alias("s")
    .description("Fetch the Gentics Mesh status")
    .action(admin.status);

program
    .command("index")
    .alias("i")
    .description("Invoke the search index sync. (Requires admin perm)")
    .action(admin.indexSync);

program
    .command("clear")
    .alias("c")
    .description("Clear the  search index. Use index command to re-build it. (Requires admin perm)")
    .action(admin.indexClear);

program
    .command("backup")
    .alias("b")
    .description("Trigger the server-side backup process. (Requires admin perm)")
    .action(admin.backup);

program
    .command("restore")
    .alias("r")
    .description("Trigger the server-side restore process. (Requires admin perm)")
    .action(admin.restore);

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}