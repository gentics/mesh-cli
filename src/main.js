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
    .alias("d")
    .command('user', 'User specific commands')
    .alias("u")
    .command('role', 'Role specific commands')
    .alias("r")
    .command('group', 'Group specific commands')
    .alias("g")
    .command('project', 'Project specific commands')
    .alias("p")
    .command('tagfamily', 'TagFamily specific commands')
    .alias("tf")
    .command('plugin', 'Plugin specific commands')
    .alias("pl")
    .command('job', 'Job specific commands')
    .alias("j")
    .command('schema', 'Schema specific commands')
    .command('sync', 'Sync specific commands')
    .alias("s")
    .command('admin', 'Administration specific commands')
    .alias("a");

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
