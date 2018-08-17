'use strict';

const Table = require('cli-table');
const rest = require("../rest");

function list() {
    rest.get("/api/v1/admin/plugins").end(r => {
        if (rest.check(r, 200, "Could not load plugins")) {
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

function install(env) {
    var id = env;
    rest.post("/api/v1/admin/plugins").end(r => {
        if (rest.check(r, 200, "Could not install plugin '" + id + "'")) {
            console.log("Installed plugin '" + id + "'");
        }
    });
}

function uninstall(env) {
    var id = env;
    rest.delete("/api/v1/admin/plugins/" + id).end(r => {
        if (rest.check(r, 200, "Could not uninstall plugin '" + id + "'")) {
            console.log("Plugin uninstalled");
        }
    });
}


module.exports = { list, install, uninstall }