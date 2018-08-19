'use strict';

const program = require('commander');
const debug = require("debug")("app");
const chalk = require('chalk');

function register() {
    program
        .name("mesh-cli")
        //.version(require('./package.json').version)
        .version("1.0.0")
        .description("CLI which can be used to interact with a Gentics Mesh server.");

    program
        .option("-e, --endpoint [url]", "API endpoint.", "http://localhost:8080")
        .option("-k, --key [key]", "API Key to be used")
        .option("-d, --debug", "Turn on debug logging");

    program
        .on('option:debug', function () {
            log("DEBUG enabled");
            debug.enable("app");
        });
}

function registerEnd() {
    program
        .on('command:*', function (name) {
            var e = this.commands.find(cmd => {
                var first = name[0];
                var alias = cmd.alias();
                if (first === cmd.name() || first === alias) {
                    return cmd;
                }
            });
            if (typeof e === 'undefined') {
                error('Unknown Command: ' + program.args.join(' '));
                process.exit(10);
            }
        });
}

function isSet(value, message) {
    if (typeof value !== 'string') {
        error(message);
        process.exit(1);
    }
}

function log(line) {
    console.log(line);
}

function error(line) {
    console.error(chalk.red("Error: ") + line);
}


module.exports = { register, isSet, registerEnd, log, error, debug }

