'use strict';

const fs = require('fs');
const program = require('commander');
const Table = require('cli-table');
const rest = require("../inc/rest");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

/**
 * Handle the add microschema command.
 * 
 * @param {string} env 
 * @param {object} options 
 */
function add(env, options) {
    // 1. Check whether a filename was specified
    if (env) {
        if (!fs.existsSync(env)) {
            error("Could not find file '" + env + "'");
            process.exit(1);
        } else {
            var json = JSON.parse(fs.readFileSync(env, 'utf8'));
            rest.post("/api/v1/microschemas", json).end(r => {
                if (rest.check(r, 201, "Could not create microschema")) {
                    log("Created microschema '" + json.name + "'");
                }
            });
        }
        // Otherwise check stdin
    } else {

        var handled = false;
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', function (data) {
            handled = true;
            var json = JSON.parse(data);
            rest.post("/api/v1/microschema", json).end(r => {
                if (rest.check(r, 201, "Could not create microschema")) {
                    log("Created microschema '" + json.name + "'");
                }
            });
        });
        process.stdin.end();
        // Fail if no stdin could be found
        setTimeout(() => {
            if (!handled) {
                error("No json found.");
                process.exit(1);
            }
        }, 50);
    }
}

/**
 * Validate the microschema.
 * 
 * @param {string} path Path to the microschema
 * @param {object} options 
 */
function validate(path, options) {
    if (path) {
        if (!fs.existsSync(path)) {
            error("Could not find file '" + path + "'");
            process.exit(1);
        } else {
            var json = JSON.parse(fs.readFileSync(path, 'utf8'));
            rest.post("/api/v1/utilities/validateSchema", json).end(r => {
                if (rest.check(r, 200, "Failed to validate microschema")) {
                    log("Validated microschema '" + json.name + "'");
                }
            });
        }
    } else {
        var handled = false;
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', function (data) {
            handled = true;
            var json = JSON.parse(data);
            rest.post("/api/v1/utilities/validateMicroschema", json).end(r => {
                if (rest.check(r, 200, "Could not validate microschema")) {
                    log("Validated microschema. Msg: " + r.body.message);
                }
            });
        });
        process.stdin.end();
        setTimeout(() => {
            if (!handled) {
                error("No json found.");
                process.exit(1);
            }
        }, 50);
    }
}

/**
 * Update microschema.
 * 
 * @param {string} path Path to the microschema
 * @param {object} options 
 */
function update(path, options) {
    if (path) {
        if (!fs.existsSync(path)) {
            error("Could not find file '" + path + "'");
            process.exit(1);
        } else {
            var json = JSON.parse(fs.readFileSync(path, 'utf8'));
            if (!json.uuid) {
                error("Microschema uuid is missing.");
                process.exit(1);
            }
            rest.post("/api/v1/microschema/" + json.uuid, json).end(r => {
                if (rest.check(r, 201, "Could not update microschema")) {
                    log("Updated microschema '" + json.name + "'");
                }
            });
        }
    } else {
        var handled = false;
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', function (data) {
            handled = true;
            var json = JSON.parse(data);
            if (!json.uuid) {
                error("Microschema uuid is missing.");
                process.exit(1);
            }
            rest.post("/api/v1/microschemas/" + json.uuid, json).end(r => {
                if (rest.check(r, 200, "Could not update microschema")) {
                    log("Updated microschema: '" + json.uuid + "' msg: " + r.body.message);
                }
            });
        });
        process.stdin.end();
        setTimeout(() => {
            if (!handled) {
                error("No json found.");
                process.exit(1);
            }
        }, 50);
    }
}

/**
 * Remove the microschema.
 * 
 * @param {string} name 
 */
function remove(name) {
    common.isSet(name, "No name or uuid specified.")
    withIdFallback(name, id => {
        rest.del("/api/v1/microschemas/" + id).end(r => {
            if (rest.check(r, 204, "Could not remove microschema " + id)) {
                log("Microschema '" + id + "' removed");
            }
        });
    });
}

/**
 * Load the microschema.
 * 
 * @param {string} name 
 * @param {object} options 
 */
function get(name, options) {
    common.isSet(name, "No name or uuid specified.")
    withIdFallback(name, id => {
        rest.get("/api/v1/microschemas/" + id).end(r => {
            if (rest.check(r, 200, "Could not load microschema")) {
                log(JSON.stringify(r.body, null, 4));
            }
        });
    });
}


/**
 * List microschemas (globally).
 * 
 * @param {string} projectName
 */
function list(projectName) {
    if (typeof projectName === 'string') {
        listMicroschemas(projectName);
    } else {
        listGlobalMicroschemas();
    }
}

function listGlobalMicroschemas() {
    rest.get("/api/v1/microschemas").end(r => {
        if (rest.check(r, 200, "Could not list microschemas")) {

            var json = r.body;
            var table = new Table({
                head: ['UUID', 'Name', 'Version'],
                colWidths: [34, 18, 9]
            });

            json.data.forEach((element) => {
                table.push([element.uuid, element.name, element.version])
            });
            log("Global microschemas:");
            log(table.toString());
        }
    });
}

/**
 * List all project microschemas.
 * 
 * @param {string} project 
 * @param {object} options 
 */
function listMicroschemas(project, options) {
    common.isSet(project, "No name or uuid specified");
    rest.get("/api/v1/" + project + "/microschemas").end(r => {
        if (rest.check(r, 200, "Could not load microschemas of project '" + project + "'")) {
            var json = r.body;
            var table = new Table({
                head: ['UUID', 'Name', 'Version'],
                colWidths: [34, 15, 9]
            });

            json.data.forEach((element) => {
                table.push([element.uuid, element.name, element.version])
            });
            log("Project '" + project + "' microschemas:");
            log(table.toString());
        }

    });
}


/**
 * Try to locate the microschema with the given name.
 * 
 * @param {string} name 
 * @param {function} action 
 */
function withIdFallback(name, action) {
    rest.get("/api/v1/microschemas").end(ur => {
        if (rest.check(ur, 200, "Could not load microschemas")) {
            var id = null;
            ur.body.data.forEach(element => {
                if (element.name == name || element.uuid == name) {
                    id = element.uuid;
                }
            });
            if (id == null) {
                error("Did not find microschema '" + name + "'");
                process.exit(1);
            } else {
                action(id);
            }
        }
    });
}

module.exports = { list, add, remove, get, update, validate, withIdFallback }