'use strict';

const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const admin = require("./actions/admin");
const configure = require("./actions/configure");
const common = require("./inc/common");

common.register();
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
    .description("Invoke the search index sync")
    .action(admin.indexSync);

program
    .command("backup")
    .alias("b")
    .description("Trigger the server-side backup process")
    .action(admin.backup);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}