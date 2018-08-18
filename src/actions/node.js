'use strict';

const rest = require("../inc/rest");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

function get(project, pathOrUuid) {
    common.isSet(project, "No project specified.")
    common.isSet(pathOrUuid, "No path or uuid specified.")

    if (pathOrUuid.startsWith("/")) {
        return getViaWebroot(project, pathOrUuid);
    } else {
        return getViaUuid(project, pathOrUuid);
    }
}

function remove(project, pathOrUuid) {
    //TODO add recursion parameter
    //TODO fallback path -> uuid
    common.isSet(project, "No project specified");
    common.isSet(pathOrUuid, "No path or uuid specified");

    rest.del("/api/v1/" + project + "/nodes/" + pathOrUuid).end(r => {
        if (rest.check(r, 204, "Could not remove node " + pathOrUuid)) {
            log("Removed node '" + pathOrUuid + "'");
        }
    });

}

function getViaWebroot(project, path) {
    rest.get("/api/v1/" + project + "/webroot/" + path).end(r => {
        if (rest.check(r, 200, "Could not load node for path '" + path + "'")) {
            log(JSON.stringify(r.body, null, 4));
        }
    });
}

function getViaUuid(project, uuid) {
    rest.get("/api/v1/" + project + "/nodes/" + uuid).end(r => {
        if (rest.check(r, 200, "Could not load node with uuid '" + uuid + "'")) {
            log(JSON.stringify(r.body, null, 4));
        }
    });
}

function publish() {
    error("Not yet implemented");
}

function unpublish() {
    error("Not yet implemented");
}

module.exports = { get, remove, publish, unpublish }