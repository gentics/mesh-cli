'use strict';

const program = require('commander');
const debug = require("debug");

function register() {
    program
        .name("mesh-cli")
        .version("1.0.0")
        .description("CLI which can be used to interact with a Gentics Mesh server.", { "command": "ssss" });

    program
        .option("-e, --endpoint [url]", "API endpoint.", "http://localhost:8080")
        .option("-k, --key [key]", "API Key to be used")
        .option("-d, --debug", "Turn on debug logging");

    program
        .on('option:debug', function () {
            console.log("DEBUG enabled");
            debug.enable("app");
        });
}

module.exports = { register }
