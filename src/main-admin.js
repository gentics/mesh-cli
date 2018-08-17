'use strict';

const program = require('commander');
const Table = require('cli-table');
const debug = require('debug');
const rest = require("./rest");
const admin = require("./actions/admin");

program
    .version('1.0.0')
    .usage("admin [options] [command]")
    .name("mesh-cli");

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