#!/usr/bin/env node

'use strict';

const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const docker = require('./actions/docker');
const configure = require("./actions/configure");
const common = require("./inc/common");

common.register("Docker specific convenience commands.");
configure.register();

program
    .usage("docker [options] [command]");

program
    .command("start")
    .description("Start a Gentics Mesh container. Data will be stored in a local directory.")
    .option("-p, --port [port]", "Http port to be used")
    .option("-t, --tag [tag]", "Tag / version to be used")
    .option("-i, --image [image]", "Image to be used")
    .action(docker.start);

program
    .command("stop")
    .description("Stop a running Gentics Mesh container.")
    .action(docker.stop);

program
    .command("restart")
    .description("Restart the Gentics Mesh container.")
    .action(docker.restart);

program
    .command("logs")
    .alias("log")
    .description("Show the logs of the Gentics Mesh container.")
    .action(docker.logs);

program
    .command("remove")
    .alias("rm")
    .description("Remove the Gentics Mesh container.")
    .action(docker.remove);

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}