'use strict';

const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const docker = require('./actions/docker');

common.register();
configure.register();

program
    .usage("docker [options] [command]");

program
    .command("start")
    .description("Start Gentics Mesh using docker")
    .option("-p, --port [port]", "Http port to be used")
    .action(docker.start);

program
    .command("stop")
    .description("Stop a running Gentics Mesh docker instance")
    .action(docker.stop);

program
    .command("restart")
    .description("Restart Gentics Mesh")
    .action(docker.restart);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}