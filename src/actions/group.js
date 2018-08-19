'use strict';

const Table = require('cli-table');
const rest = require("../inc/rest");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

function list() {
    rest.get("/api/v1/groups").end(r => {
        if (rest.check(r, 200, "Could not list groups")) {
            var json = r.body;
            var table = new Table({
                head: ['UUID', 'Name', 'Roles'],
                colWidths: [34, 15, 20]
            });

            json.data.forEach((element) => {
                var roles = new Array();
                element.roles.forEach(role => {
                    roles.push(role.name);
                });

                var rolesStr = "[" + roles.join() + "]";

                table.push([element.uuid, element.name, rolesStr]);
            });
            log(table.toString());
        }
    });
}

/**
 * Add a new group.
 * 
 * @param {string} name 
 * @param {object} options 
 */
function add(name, options) {
    common.isSet(name, "No name specified");
    var body = {
        name: env
    };
    rest.post("/api/v1/groups", body).end(r => {
        if (rest.check(r, 201, "Could not create group")) {
            log("Created group '" + env + "'");
        }
    });
}

/**
 * Remove the group.
 * 
 * @param {string} name 
 */
function remove(name) {
    common.isSet(name, "No name or uuid specified");
    withIdFallback(name, id => {
        rest.del("/api/v1/groups/" + id).end(r => {
            if (rest.check(r, 204, "Could not remove group '" + id + "'")) {
                log("Removed group '" + id + "'");
            }
        });
    });
}


function withIdFallback(env, action) {
    rest.get("/api/v1/groups").end(ur => {
        if (rest.check(ur, 200, "Could not list groups")) {
            var id = null;
            ur.body.data.forEach(element => {
                if (element.name == env || element.uuid == env) {
                    id = element.uuid;
                }
            });
            if (id == null) {
                error("Could not find group '" + env + "'");
                process.exit(1);
            } else {
                action(id);
            }
        }
    });
}

module.exports = { list, add, remove }