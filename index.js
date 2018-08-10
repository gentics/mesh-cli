#!/usr/bin/env node

'use strict';

const dockerCLI = require('docker-cli-js');
const chalk = require('chalk');
const clear = require('clear');
const clui = require('clui');
const program = require('commander');

var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;
var docker = new Docker(DockerOptions);

program
  .version('1.0.0')

  // start
  .command("start", "Start Gentics Mesh using docker")
  .action(start)

  // stop
  .command("stop", "Stop a running Gentics Mesh instance")
  .action(stop)

  // restart
  .command("restart", "Restart Gentics Mesh")
  .action(restart)

  // apiKey
  .command("apiKey", "Generate a new API Key. Note that generating a new API key will invalidate the existing API key of the user.")  
  .action(apiKey)
  
  // sync
  .command("sync", "Synchronize the bootstrap structure with Gentics Mesh") 
  .action(sync)
  
  // list
  .command("list", "List various elements of Gentics Mesh")  
  .action(list)
  
  // status
  .command("status", "Fetch the Gentics Mesh status")
  .action(status)
  
  // backup
  // import
  // export
  // sync index
  // install, uninstall (plugins)
  .option("-user [username]", "Username")
  .option("-port [port]", "Http port to be used")
  .option("-pass [password]", "Password")
  .option("-p, --project", "Project to be used")
  .option("-t, --type", "Type of elements to be listed: [projects, users, groups, roles, schemas, jobs, branches]")
  .option("-k, --key", "API key to be used")
  .option("-a, --api", "API URL to Gentics Mesh. Default: http://localhost:8080")
  
  .parse(process.argv);

async function start(env, options) {
  var port = parseInt(options.port) || 8080;
  await startDocker(port);
  console.dir(p);
  //process.exit();
}

async function startDocker(port) {
  console.log("Starting Gentics Mesh...");
  var p = docker.command('run -p ' + port + ':8080 -d --name gentics-mesh gentics/mesh:latest')
    .then(function(data) {
    console.log('data = ' , data);
  });
  return p;
}

function restart(env, options) {

}

function stop(env, options) {
  docker.command('stop gentics-mesh').then(function(data) {
    console.log('data = ' , data);
  });
  process.exit();
}

function list(env, options) {

}

function status(env, options) {

}

function sync(env, options) {

}

function createProject(env, options) {
  var name = options.name;
  if (name === 'undefined') {
    log.error("You need to specifiy the name of the project.")
    process.exit(1);
  }
  console.log("createProject")
}

function syncSchemas(env, options) {

}

function apiKey(env, options) {
  console.log("apiKey")
}

program.parse(process.argv);
program.help();
