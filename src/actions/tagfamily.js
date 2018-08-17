'use strict';

const Table = require('cli-table');
const rest = require("../rest");
const common = require("../common");

function add(env) {
    if (typeof env === 'undefined') {
        console.error("No name specified");
        process.exit(1);
    }
    var project = null;
    var body = {
        name: env
    };
    rest.post("/api/v1/" + project + "/tagfamily", body).end(r => {
        if (rest.check(r, 201, "Could not create tagfamily '" + env + "' in project '" + project + "'")) {
            console.log("Created tagfamily '" + r.body.uuid + "'");
        }
    });
}

function remove(env) {
    var project = null;
    withIdFallback(env, id => {
        rest.del("/api/v1/" + project + "/tagfamily/" + id).end(r => {
            if (rest.check(r, 204, "Could not delete tagfamily of project " + project)) {
                console.log("Removed tag family '" + id + "'");
            }
        });
    });
}

function list(env) {
    var project = null;
    var path = "/api/v1/" + project + "/tagfamiles";
    rest.get(path).end(r => {
        if (rest.check(r, 200, "Could not load tagfamilies of project " + project)) {
            var json = r.body;
            var table = new Table({
                head: ['UUID', 'Name'],
                colWidths: [34, 15]
            });

            json.data.forEach((element) => {
                table.push([element.uuid, element.name]);
            });
            console.log(table.toString());
        }
    });
}

function withIdFallback(env, action) {
    rest.get("/api/v1/" + project + "/tagfamilies").end(ur => {
        if (rest.check(ur, 200, "Could not load tagfamilies of project " + project)) {
            var id = null;
            ur.body.data.forEach(element => {
                if (element.name == env || element.uuid == env) {
                    id = element.uuid;
                }
            });
            if (id == null) {
                console.error("Could not find tag family '" + env + "'");
                process.exit(1);
            } else {
                action(id);
            }
        }
    });
}


module.exports = { list, add, remove }