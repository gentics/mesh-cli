'use strict';

const Table = require('cli-table');
const rest = require("../inc/rest");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

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
            log(table.toString());
        }
    });
}

function install(pluginId) {
    common.isSet(pluginId, "No pluginId specified");
    rest.post("/api/v1/admin/plugins").end(r => {
        if (rest.check(r, 200, "Could not install plugin '" + pluginId + "'")) {
            log("Installed plugin '" + pluginId + "'");
        }
    });
}

function get(pluginId) {
    common.isSet(pluginId, "No pluginId specified");
    rest.get("/api/v1/admin/plugin/" + pluginId).end(r => {
        if (rest.check(r, 200, "Could not load plugin with id '" + pluginId + "'")) {
            log(JSON.stringify(r.body, null, 4));
        }
    });
}

function uninstall(pluginId) {
    common.isSet(pluginId, "No pluginId specified");
    rest.delete("/api/v1/admin/plugins/" + pluginId).end(r => {
        if (rest.check(r, 200, "Could not uninstall plugin '" + pluginId + "'")) {
            log("Plugin uninstalled");
        }
    });
}


module.exports = { list, install, uninstall, get }