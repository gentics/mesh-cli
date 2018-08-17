'use strict';

function status() {
    rest.get("/api/v1/admin/status").end(r => {
        if (rest.check(r, 200, "Could not get status")) {
            console.log("Status: " + r.body.status);
        }
    });
}

function indexSync(env, options) {
    rest.post("/api/v1/search/sync").end(r => {
        if (rest.check(r, 200, "Could not invoke index sync")) {
            console.log("Invoked: " + r.body.message);
        }
    });
}

function backup(env, options) {
    rest.post("/api/v1/admin/backup").end(r => {
        if (rest.check(r, 200, "Could not invoke backup")) {
            console.log("Invoked server side backup process.");
        }
    });
}