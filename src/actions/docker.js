'use strict';

const fs = require('fs');
const path = require('path');
const dockerCLI = require('docker-cli-js');
const rest = require("../inc/rest");
const chalk = require('chalk');
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
async function start(options) {
    debug("Options:", options);
    var port = parseInt(options.port) || 8080;
    debug("Port:" + port);
    var tag = options.tag || "latest";
    debug("Tag:" + tag);
    var image = options.image || "gentics/mesh";
    debug("Image: " + image);
    await startDocker(tag, port, image).then(waitForDocker);
}

function waitForDocker() {
    return rest.get("/api/v1/admin/status", true).end(r => {
        var ready = r.code == 200 && r.body && r.body.status == "READY";
        var status = r.code == 200 && r.body && r.body.status || "UNKNOWN";
        if (ready) {
            log("Status: " + chalk.green(status));
        } else {
            setTimeout(waitForDocker, 2000);
            log("Status: " + chalk.yellow(status));
        }
    });
}

/**
 * Start the docker container.
 * 
 * @param {string} tag
 * @param {integer} port
 * @param {string} image
 */
async function startDocker(tag, port, image) {
    var p = docker.command("ps -a -f name=" + CONTAINER_NAME).then(data => {
        if (data.containerList.length == 1) {
            var e = docker.command('start ' + CONTAINER_NAME).then(data => {
                log("Starting Gentics Mesh...");
            });
            return e;
        } else {
            var dataDirName = "mesh-data";
            var absPath = path.resolve(dataDirName);
            log("Storing data in " + absPath);
            ensureDataDir(absPath);
            var cmd = 'run -p ' + port + ':8080 -v ' + absPath + ':/data -d  --name ' + CONTAINER_NAME + ' ' + image + ':' + tag;
            debug(cmd);
            var p = docker.command(cmd).then(data => {
                log("Starting.. " + data.containerId);
            });
        }
    });

    return p;
}

function ensureDataDir(dirName) {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }
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
