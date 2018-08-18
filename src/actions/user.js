'use strict';

const inquirer = require('inquirer');
const Table = require('cli-table');
const rest = require("../inc/rest");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

function list() {
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
            log(table.toString());
        }
    });
}

/**
 * Get the user.
 * 
 * @param {string} name 
 */
function get(name) {
    common.isSet(name, "No name or uuid specified.")
    withIdFallback(name, id => {
        rest.get("/api/v1/users/" + id).end(r => {
            if (rest.check(r, 200, "Could not load '" + id + "'")) {
                log(JSON.stringify(r.body, null, 4));
            }
        });
    });
}


/**
 * Add a new user.
 * 
 * @param {string} env 
 * @param {object} options 
 */
function add(env, options) {
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
                log("Created user '" + body.username + "'");
            }
        });

    });

}

/**
 * Remove the user.
 * 
 * @param {string} name 
 */
function remove(name) {
    common.isSet(name, "No name or uuid specified");

    withIdFallback(name, id => {
        rest.del("/api/v1/users/" + id).end(r => {
            if (rest.check(r, 204, "Could not remove user " + name)) {
                log("Removed user '" + id + "'");
            }
        });
    });
}

/**
 * Change the password of the user.
 * 
 * @param {string} env 
 * @param {object} options 
 */
function passwd(env, options) {
    var questions = new Array();

    if (typeof env !== 'string') {
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
                    log("Updated password of user '" + user + "'");
                }
            });
        });
    });
}


function apiKey(env, options) {
    withIdFallback(env, id => {
        rest.post("/api/v1/users/" + id + "/token").end(r => {
            if (rest.check(r, 200, "Could not generate token for user '" + id + "'")) {
                log("Token: " + r.body.token);
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
                error("Did not find user '" + env + "'");
            } else {
                action(id);
            }
        }
    });
}

module.exports = { list, add, remove, get, apiKey, passwd }