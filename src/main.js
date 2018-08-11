#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const clear = require('clear');
const debug = require('debug');
const program = require('commander');
const configure = require("./configure");


function main() {
  program
    .version('1.0.0')
    .name("mesh-cli");

  configure.register();

  program
    .option("-e, --endpoint", "API endpoint. Default: http://localhost:8080")
    .option("-k, --key", "API Key to be used")
    .option("-d, --debug", "Turn on debug logging")

    .command('docker', 'Docker specific commands')
    .command('user', 'User specific commands')
    .command('role', 'Role specific commands')
    .command('group', 'Group specific commands')
    .command('project', 'Project specific commands')
    .command('tagfamily', 'TagFamily specific commands')
    .command('plugin', 'Plugin specific commands')
    .command('job', 'Job specific commands')
    .command('schema', 'Schema specific commands')
    .command('sync', 'Sync specific commands')
    .command('admin', 'Administration specific commands');

  program.on('--debug', function () {
    console.log("DEBUG");
    debug.enable;
  });

  program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ mesh-cli project schemas demo');
    console.log('    $ mesh-cli user list');
    console.log('    $ mesh-cli user add');
    console.log('');
  });


  program.parse(process.argv);
}

main();
