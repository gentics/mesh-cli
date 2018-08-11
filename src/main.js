#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const clear = require('clear');
const program = require('commander');

const config = require("./config");

program
  .version('1.0.0')
  .name("mesh-cli")
  .option("-a, --api", "API URL to Gentics Mesh. Default: http://localhost:8080")
  .option("-k, --key", "API Key to be used")
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
config.register();

/*
program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });
*/

program.parse(process.argv);
//program.help();