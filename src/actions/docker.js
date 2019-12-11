'use strict';

const fs = require('fs');
const path = require('path');
const dockerCLI = require('docker-cli-js');
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;
var docker = new Docker(DockerOptions);

const CONTAINER_NAME = "gentics-mesh";

/**
 * Create or start a container.
 * 
 * @param {object} options
 */
function start(options) {
    debug("Options:", options);
    var port = parseInt(options.port) || 8080;
    debug("Port:" + port);
    var tag = options.tag || "latest";
    debug("Tag:" + tag);
    var image = options.image || "gentics/mesh";
    debug("Image: " + image);
    startDocker(tag, port, image);
}

/**
 * Start the docker container.
 * 
 * @param {string} tag
 * @param {integer} port
 * @param {string} image
 */
async function startDocker(tag, port, image) {
    log("Starting Gentics Mesh...");
    var p = docker.command("ps -a -f name=" + CONTAINER_NAME).then(data => {
        if (data.containerList.length == 1) {
            var e = docker.command('start ' + CONTAINER_NAME).then(data => {
                log("Starting server...");
            });
        } else {
            var dataVol = ' -v mesh-data:/graphdb ';
            var uploadVol = ' -v mesh-keystore:/keystore ';
            var uploadVol = ' -v mesh-uploads:/uploads ';
            var cmd = 'run -p ' + port + ':8080 ' + dataVol + uploadVol + ' -d --name ' + CONTAINER_NAME + ' ' + image + ':' + tag;
            debug(cmd);
            var p = docker.command(cmd).then(data => {
                log("Starting.. " + data.containerId);
            });
        }
    });

    return p;
}



/**
 * Remove the container.
 */
function remove() {
    docker.command('rm -f ' + CONTAINER_NAME).then(function (data) {
        //TODO remove volumes
        log("Removed docker container '" + CONTAINER_NAME + "'");
    });
}

/**
 * Return the logs of the mesh container.
 */
function logs() {
    docker.command('logs ' + CONTAINER_NAME).then(function (data) {
        log(data.raw);
    });
}

/**
 * Restart the container.
 * 
 * @param {string} env 
 * @param {object} options 
 */
function restart(env, options) {
    docker.command('restart ' + CONTAINER_NAME).then(function (data) {
        console.log("Container restarted");
    });
}

/**
 * Stop a running container.
 * 
 * @param {string} env 
 * @param {object} options 
 */
function stop(env, options) {
    docker.command('stop ' + CONTAINER_NAME).then(function (data) {
        log("Container stopped");
    });
}


module.exports = { start, stop, restart, remove, logs }
