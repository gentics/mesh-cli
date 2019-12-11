#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const docker = require('./actions/docker');
const configure = require("./actions/configure");
const common = require("./inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

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
    .action(docker.start)
    .group("Docker");

program
    .command("stop")
    .description("Stop a running Gentics Mesh container.")
    .action(docker.stop)
    .group("Docker");

program
    .command("restart")
    .description("Restart the Gentics Mesh container.")
    .action(docker.restart)
    .group("Docker");

program
    .command("logs")
    .alias("log")
    .description("Show the logs of the Gentics Mesh container.")
    .action(docker.logs)
    .group("Docker");

program
    .command("remove")
    .alias("rm")
    .description("Stop and remove the Gentics Mesh container. Local volume data will not be removed.")
    .action(docker.remove)
    .group("Docker");

program.on('--help', function () {
    var cyan = chalk.cyan;
    var grey = chalk.grey;
    log(grey('\n  Examples:'));

    log(grey('\n  -  ') + "Start a Gentics Mesh container with version 0.27.0 on port 8888\n");
    log(cyan('    $ mesh docker start -t 0.27.0 -p 8888'));

    log('');
});

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}
