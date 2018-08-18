'use strict';

const Table = require('cli-table');
const rest = require("../inc/rest");
const common = require("../inc/common");

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

function get(project, tagfamily) {
    common.isSet(project, "No project name specified");
    common.isSet(tagfamily, "No tagfamily name or uuid specified");

    withIdFallback(project, tagfamily, id => {
        rest.get("/api/v1/" + project + "/tagFamilies/" + id).end(r => {
            if (rest.check(r, 200, "Could not load tagfamily '" + tagfamily + "' of project " + project)) {
                console.log(JSON.stringify(r.body, null, 4));
            }
        });
    });
}

function remove(project, tagfamily) {
    withIdFallback(project, tagfamily, id => {
        rest.del("/api/v1/" + project + "/tagfamily/" + id).end(r => {
            if (rest.check(r, 204, "Could not delete tagfamily of project " + project)) {
                console.log("Removed tag family '" + id + "'");
            }
        });
    });
}

function list(project, tagfamily) {
    common.isSet(project, "No project name specified");

    if (typeof tagfamily === 'string') {
        return listTags(project, tagfamily);
    } else {
        return listTagFamilies(project);
    }
}

function listTagFamilies(project) {
    rest.get("/api/v1/" + project + "/tagFamilies").end(r => {
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

function listTags(project, tagfamily) {
    withIdFallback(project, tagfamily, id => {
        rest.get("/api/v1/" + project + "/tagFamilies/" + id + "/tags").end(r => {
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
    });
}

function withIdFallback(project, tagfamily, action) {
    rest.get("/api/v1/" + project + "/tagFamilies").end(ur => {
        if (rest.check(ur, 200, "Could not load tagfamilies of project " + project)) {
            var id = null;
            ur.body.data.forEach(element => {
                if (element.name == tagfamily || element.uuid == tagfamily) {
                    id = element.uuid;
                }
            });
            if (id == null) {
                console.error("Could not find tag family '" + tagfamily + "'");
                process.exit(1);
            } else {
                action(id);
            }
        }
    });
}


module.exports = { list, add, remove, get }