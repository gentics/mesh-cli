'use strict';

const program = require('commander');


program
    .version('0.0.1')
    .usage("docker [options] [command]")
    .name("mesh-cli");

program
    .command("start")
    .description("Start Gentics Mesh using docker")
    .option("-p, --port [port]", "Http port to be used")
    .action(start);

program
    .command("stop")
    .description("Stop a running Gentics Mesh docker instance")
    .action(stop);

program
    .command("restart")
    .description("Restart Gentics Mesh")
    .action(restart);


program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}