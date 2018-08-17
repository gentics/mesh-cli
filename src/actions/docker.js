'use strict';

const dockerCLI = require('docker-cli-js');

var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;
var docker = new Docker(DockerOptions);

function start(env) {
    var port = parseInt(env.port) || 8080;
    startDocker(port);
    //process.exit();
}

async function startDocker(port) {
    console.log("Starting Gentics Mesh...");
    var e = docker.command('start gentics-mesh').then(function (data) {
        console.dir(data);
    });
    var p = docker.command('run -p ' + port + ':8080 -d --name gentics-mesh gentics/mesh:latest')
        .then(function (data) {
            console.log('data = ', data);
        });
    return p;
}

function restart(env, options) {
    docker.command('restart gentics-mesh').then(function (data) {
        console.dir(data);
    });
}

function stop(env, options) {
    docker.command('stop gentics-mesh').then(function (data) {
        console.log('data = ', data);
    });
    process.exit();
}
