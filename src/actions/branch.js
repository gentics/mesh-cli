'use strict';

const Table = require('cli-table');
const rest = require("../inc/rest");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

/**
 * List project branches.
 * 
 * @param {string} project
 */
function list(project) {
    common.isSet(project, "No project name specified.")
    rest.get("/api/v1/" + project + "/branches").end(r => {
        if (rest.check(r, 200, "Could not list branches")) {
            var json = r.body;
            var table = new Table({
                head: ['UUID', 'Name', 'Creator', 'Created', 'Editor', 'Edited'],
                colWidths: [34, 8, 34, 23, 34, 23]
            });

            json.data.forEach((element) => {
                console.dir(element.creator);
                table.push([element.uuid, element.name, element.creator.uuid, element.created, element.editor.uuid, element.edited])
            });
            log(table.toString());
        }
    });
}


function add() {

}

function remove() {

}

module.exports = { list, add, remove }