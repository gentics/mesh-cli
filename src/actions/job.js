'use strict';

const Table = require('cli-table');
const rest = require("../inc/rest");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

function clearJob(uuid, options) {
    common.isSet(uuid, "No job uuid specified");
    rest.delete("/api/v1/admin/jobs/" + uuid + "/error").end(r => {
        if (rest.check(r, 200, "Could not clear errors of job " + uuid)) {
            log("Cleared errors for job '" + uuid + "'");
        }
    });
}

/**
 * List all jobs.
 */
function list() {
    rest.get("/api/v1/admin/jobs").end(r => {
        if (rest.check(r, 200, "Could not load jobs")) {
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



module.exports = { list, clearJob }