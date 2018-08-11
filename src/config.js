'use strict';

const program = require('commander');

function config() {

}

function register() {
  program
    .command("config")
    .description("Configure the CLI");
    //.action(config);
}

module.exports = { register }
