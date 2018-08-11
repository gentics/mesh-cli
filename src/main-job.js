'use strict';

const program = require('commander');
const clui = require('clui');

function listJobs() {

}


program
    .version('0.0.1')
    .usage("job [options] [command]")
    .name("mesh-cli");

program
    .command("clear [uuid]")
    .description("Clear the job.")
    .action(clearJob);

program
    .command("list")
    .description("List jobs.")
    .action(listJobs);



program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}