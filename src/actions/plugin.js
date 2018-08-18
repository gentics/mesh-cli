'use strict';

const Table = require('cli-table');
const rest = require("../inc/rest");

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

function install(pluginId) {
    common.isSet(pluginId, "No pluginId specified");
    rest.post("/api/v1/admin/plugins").end(r => {
        if (rest.check(r, 200, "Could not install plugin '" + pluginId + "'")) {
            console.log("Installed plugin '" + pluginId + "'");
        }
    });
}

function uninstall(pluginId) {
    common.isSet(pluginId, "No pluginId specified");
    rest.delete("/api/v1/admin/plugins/" + pluginId).end(r => {
        if (rest.check(r, 200, "Could not uninstall plugin '" + pluginId + "'")) {
            console.log("Plugin uninstalled");
        }
    });
}


module.exports = { list, install, uninstall }