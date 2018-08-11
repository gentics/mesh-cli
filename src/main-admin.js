'use strict';

const program = require('commander');

function status() {

}

function indexSync(env, options) {

}

function backup(env, options) {

}

program
    .version('1.0.0')
    .usage("admin [options] [command]")
    .name("mesh-cli");

program
    .command("status")
    .description("Fetch the Gentics Mesh status")
    .action(status);

program
    .command("syncIndex")
    .description("Invoke the search index sync")
    .action(indexSync);

program
    .command("backup")
    .description("Trigger the server-side backup process")
    .action(backup);


var noSubCommand = program.args.length === 1;
if (noSubCommand) {
    program.help();
}