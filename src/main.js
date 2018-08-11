#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const clear = require('clear');
const program = require('commander');
const config = require("./config");


function main() {
  program
    .version('1.0.0')
    .name("mesh-cli");

  config.register();

  program
    .option("-e, --endpoint", "API endpoint. Default: http://localhost:8080")
    .option("-k, --key", "API Key to be used")
    .option("-d, --debug", "Turn on debug logging")

    .command('docker', 'Docker specific commands')
    .command('user', 'User specific commands')
    .command('role', 'Role specific commands')
    .command('group', 'Group specific commands')
    .command('project', 'Project specific commands')
    .command('plugin', 'Plugin specific commands')
    .command('job', 'Job specific commands')
    .command('schema', 'Schema specific commands')
    .command('sync', 'Sync specific commands')
    .command('admin', 'Administration specific commands');

  program.parse(process.argv);
}

main();
