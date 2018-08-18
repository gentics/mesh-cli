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
 * Handle the add schema command.
 * 
 * @param {string} path 
 * @param {object} options 
 */
function add(path, options) {
    // 1. Check whether a filename was specified
    if (path) {
        if (!fs.existsSync(path)) {
            error("Could not find file '" + path + "'");
            process.exit(1);
        } else {
            var json = JSON.parse(fs.readFileSync(path, 'utf8'));
            rest.post("/api/v1/schemas", json).end(r => {
                if (rest.check(r, 201, "Could not create schema")) {
                    var json = r.body;
                    log("Created schema '" + json.name + "' UUID: " + json.uuid);
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
            rest.post("/api/v1/schemas", json).end(r => {
                if (rest.check(r, 201, "Could not create schema")) {
                    var json = r.body;
                    log("Created schema '" + json.name + "' UUID: " + json.uuid);
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
 * Validate the schema.
 * 
 * @param {string} path Path to the schema
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
                if (rest.check(r, 200, "Failed to validate schema")) {
                    log("Validated schema '" + json.name + "'");
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
            rest.post("/api/v1/utilities/validateSchema", json).end(r => {
                if (rest.check(r, 200, "Could not validate schema")) {
                    log("Validated schema. Msg: " + r.body.message);
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
 * Update schema.
 * 
 * @param {string} path Path to the schema
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
                error("Schema uuid is missing.");
                process.exit(1);
            }
            rest.post("/api/v1/schemas/" + json.uuid, json).end(r => {
                if (rest.check(r, 201, "Could not update schema")) {
                    log("Updated schema '" + json.name + "'");
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
                error("Schema uuid is missing.");
                process.exit(1);
            }
            rest.post("/api/v1/schemas/" + json.uuid, json).end(r => {
                if (rest.check(r, 200, "Could not update schema")) {
                    log("Updated schema: '" + json.uuid + "' msg: " + r.body.message);
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
 * Remove the schema.
 * 
 * @param {string} name 
 */
function remove(name) {
    common.isSet(name, "No name or uuid specified.")
    withIdFallback(name, id => {
        rest.del("/api/v1/schemas/" + id).end(r => {
            if (rest.check(r, 204, "Could not remove schema " + id)) {
                log("Schema '" + id + "' removed");
            }
        });
    });
}

/**
 * Load the schema.
 * 
 * @param {string} name 
 * @param {object} options 
 */
function get(name, options) {
    common.isSet(name, "No name or uuid specified.")
    withIdFallback(name, id => {
        rest.get("/api/v1/schemas/" + id).end(r => {
            if (rest.check(r, 200, "Could not load schema")) {
                log(JSON.stringify(r.body, null, 4));
            }
        });
    });
}

/**
 * List schemas (globally)
 * 
 * @param {string} projectName
 */
function list(projectName) {
    if (typeof projectName === 'string') {
        listSchemas(projectName);
    } else {
        listGlobalSchemas();
    }
}

/**
 * List all project schemas.
 * 
 * @param {string} project 
 * @param {object} options 
 */
function listSchemas(project, options) {
    common.isSet(project, "No name or uuid specified");
    rest.get("/api/v1/" + project + "/schemas").end(r => {
        if (rest.check(r, 200, "Could not load schemas of project '" + project + "'")) {
            var json = r.body;
            var table = new Table({
                head: ['UUID', 'Name', 'Version'],
                colWidths: [34, 15, 10]
            });

            json.data.forEach((element) => {
                table.push([element.uuid, element.name, element.version])
            });
            log("Project '" + project + "' schemas:");
            log(table.toString());
        }
    });
}


function listGlobalSchemas() {
    rest.get("/api/v1/schemas").end(r => {
        if (rest.check(r, 200, "Could not list schemas")) {

            var json = r.body;
            var table = new Table({
                head: ['UUID', 'Name', 'Version'],
                colWidths: [34, 18, 9]
            });

            json.data.forEach((element) => {
                table.push([element.uuid, element.name, element.version])
            });
            log("Gobal schemas:");
            log(table.toString());
        }
    });
}

/**
 * Try to locate the schema with the given name.
 * 
 * @param {string} name 
 * @param {function} action 
 */
function withIdFallback(name, action) {
    rest.get("/api/v1/schemas").end(ur => {
        if (rest.check(ur, 200, "Could not load schemas")) {
            var id = null;
            ur.body.data.forEach(element => {
                if (element.name == name || element.uuid == name) {
                    id = element.uuid;
                }
            });
            if (id == null) {
                error("Did not find schema '" + name + "'");
                process.exit(1);
            } else {
                action(id);
            }
        }
    });
}

module.exports = { list, add, remove, get, update, validate, withIdFallback }