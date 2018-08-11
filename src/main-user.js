#!/usr/bin/env node
'use strict';

const program = require('commander');

function addUser() {

}

function removeUser() {

}

function passwd() {

}

function apiKey(env, options) {
    console.log("apiKey")
}

program
    .version('1.0.0')
    .usage("user [options] [command]")
    .name("mesh-cli");

program
    .command('add [name]')
    .description("Add a new user.")
    .action(addUser);

program
    .command('remove [name/uuid]')
    .description("Remove the user.")
    .action(removeUser);

program
    .command('passwd [name/uuid]')
    .description("Change the password.")
    .option("-u, --user [username]", "Username")
    .option("-p, --pass [password]", "Password")
    .action(passwd);

program
    .command("key [name/uuid]")
    .description("Generate a new API key.")
    //. Note that generating a new API key will invalidate the existing API key of the user.")
    .action(apiKey);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}