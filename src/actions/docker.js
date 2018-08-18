'use strict';

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
    var tag = options.tag || "latest";
    var image = options.image || "gentics/mesh";
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
            var p = docker.command('run -p ' + port + ':8080 -d --name ' + CONTAINER_NAME + ' ' + image + ':' + tag).then(data => {
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
        console.dir(data);
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
        log('data = ', data);
    });
    process.exit();
}


module.exports = { start, stop, restart, remove, logs }
