#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const clear = require('clear');
const debug = require('debug');
const prog = require('caporal');
/*
const configure = require("./configure");
const config = require("./config");
const common = require("./common");
*/
function main() {


  prog
    .version('1.0.0');

  prog
    .command('project', 'Deploy an application')
    .alias("p")
    .argument('[name]', 'Environment to deploy on')
    .argument('[command]', 'Name of the project', /^test|test2$/)
    .option("--name <name>", "Extra name")
    .action(function (args, options, logger) {
      if (Object.keys(args).length == 1) {
        console.error("Missing command");
      } else {
        console.log("AAAAAAAAAAAa");
        console.dir(args);
      }
    });


  prog
    .command('user list', 'List schemas')
    .alias("s")
    .argument('[name]', 'Environment to deploy on')
    .action(function (args, options, logger) {
      console.log("BBBBBBBBBB");
    });


  prog.parse(process.argv);

  /*
  program
    .version('1.0.0')
    .name("mesh-cli");

  configure.register();

  common.register();
    program
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

  program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ mesh-cli project schemas demo');
    console.log('    $ mesh-cli user list');
    console.log('    $ mesh-cli user add');
    console.log('');
  });

  program.parse(process.argv);
  */

}

main();