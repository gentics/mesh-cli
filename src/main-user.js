#!/usr/bin/env node
'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const Table = require('cli-table');
const debug = require('debug');
const rest = require("./rest");

function addUser(env, options) {
    var questions = new Array();
    if (typeof env === 'undefined') {
        questions.push({
            name: 'username',
            type: 'input',
            message: 'Enter username'
        });
    }

    if (typeof options.pass === 'undefined') {
        questions.push({
            name: 'password',
            type: 'password',
            message: 'Enter password'
        });
    }
    inquirer.prompt(questions).then(answers => {
        var body = {
            username: env || answers.username,
            password: options.pass || answers.password
        };
        rest.post("/api/v1/users", body).end(r => {
            if (rest.check(r, 201, "Could not create user")) {
                console.log("Created user '" + body.username + "'");
            }
        });

    });

}

function removeUser(env) {
    if (typeof env === 'undefined') {
        console.error("No name/uuid specified");
        return;
    }
    withIdFallback(env, id => {
        rest.del("/api/v1/users/" + id).end(r => {
            console.dir(r.body);
        });
    });
}

function passwd(env) {
    if (typeof env === 'undefined') {
        console.error("No name/uuid specified");
        return;
    }
    var body = {
        password: "pass"
    };
    withIdFallback(env, id => {
        rest.post("/api/v1/users/" + id, body).end(r => {
            console.dir(r.body);
        });
    });
}

function listUsers(env) {
    rest.get("/api/v1/users").end(r => {
        var json = r.body;
        var table = new Table({
            head: ['UUID', 'Username', 'Firstname', 'Lastname', 'Groups']
            , colWidths: [34, 15, 20, 30, 30]
        });

        json.data.forEach((element) => {
            var groups = new Array();
            element.groups.forEach(group => {
                groups.push(group.name);
            });
            var groupsStr = "[" + groups.join() + "]";

            table.push([element.uuid, element.username, element.firstname || "-", element.lastname || "-", groupsStr]);
        });
        console.log(table.toString());
    });
}

function apiKey(env, options) {
    withIdFallback(env, id => {
        rest.post("/api/v1/users/" + id + "/token").end(r => {
            console.dir(r.body);
        });
    });
}

function withIdFallback(env, action) {
    rest.get("/api/v1/users").end(ur => {
        var id = env;
        ur.body.data.forEach(element => {
            if (element.username == env) {
                id = element.uuid;
            }
        });
        action(id);
    });
}

program
    .version('1.0.0')
    .usage("user [options] [command]")
    .name("mesh-cli");

program
    .command('add [name]')
    .option("-p, --pass [password]", "Password")
    .description("Add a new user.")
    .action(addUser);

program
    .command('remove [name/uuid]')
    .description("Remove the user.")
    .action(removeUser);

program
    .command('list')
    .description("List all users.")
    .action(listUsers);

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