#!/usr/bin/env node
'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const Table = require('cli-table');
const debug = require('debug')('app');
const rest = require("./rest");
const common = require("./common");

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
            if (rest.check(r, 200, "Could remove user " + env)) {
                console.log("Removed user '" + id + "'");
            }
        });
    });
}

function passwd(env, options) {
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
            password: options.pass || answers.password
        };
        var user = env || answers.username;
        withIdFallback(user, id => {
            rest.post("/api/v1/users/" + id, body).end(r => {
                if (rest.check(r, 200, "Could change password for user '" + id + "'")) {
                    console.log("Updated password of user '" + user + "'");
                }
            });
        });
    });
}

function listUsers(env) {
    rest.get("/api/v1/users").end(r => {
        if (rest.check(r, 200, "Could not list users")) {
            var json = r.body;
            var table = new Table({
                head: ['UUID', 'Username', 'Firstname', 'Lastname', 'Groups'],
                colWidths: [34, 15, 20, 30, 30]
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
        }
    });
}

function apiKey(env, options) {
    withIdFallback(env, id => {
        rest.post("/api/v1/users/" + id + "/token").end(r => {
            if (rest.check(r, 200, "Could not generate token for user '" + id + "'")) {
                console.log("Token: " + r.body.token);
            }
        });
    });
}

function withIdFallback(env, action) {
    rest.get("/api/v1/users").end(ur => {
        if (rest.check(ur, 200, "Could not list users")) {
            var id = null;
            ur.body.data.forEach(element => {
                if (element.username == env || element.uuid == env) {
                    id = element.uuid;
                }
            });
            if (id == null) {
                console.error("Did not find user '" + env + "'");
            } else {
                action(id);
            }
        }
    });
}

program
    .version('1.0.0')
    .usage("user [options] [command]")
    .name("mesh-cli");

common.register();

program
    .command('add [name]')
    .alias("a")
    .option("-p, --pass [password]", "Password")
    .description("Add a new user.")
    .action(addUser);

program
    .command('remove [name/uuid]')
    .alias("r")
    .description("Remove the user.")
    .action(removeUser);

program
    .command('list')
    .alias("l")
    .description("List all users.")
    .action(listUsers);

program
    .command('passwd [name/uuid]')
    .alias("p")
    .description("Change the password.")
    .option("-u, --user [username]", "Username")
    .option("-p, --pass [password]", "Password")
    .action(passwd);

program
    .command("key [name/uuid]")
    .alias("k")
    .description("Generate a new API key.")
    //. Note that generating a new API key will invalidate the existing API key of the user.")
    .action(apiKey);


debug("Parsing arguments");
program.parse(process.argv);


var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}