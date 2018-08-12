'use strict';

const program = require('commander');
const Table = require('cli-table');
const debug = require('debug');
const rest = require("./rest");

function status() {
    rest.get("/api/v1/admin/status").end(r => {
        if (rest.check(r, 200, "Could invoke backup")) {
            console.dir(r.body);
        }
    });
}

function indexSync(env, options) {
    rest.post("/api/v1/search/sync").end(r => {
        if (rest.check(r, 200, "Could invoke index sync")) {
            console.log("Invoked index sync");
        }
    });
}

function backup(env, options) {
    rest.post("/api/v1/admin/backup").end(r => {
        if (rest.check(r, 200, "Could invoke backup")) {
            console.log("Invoked server side backup process.");
        }
    });
}

program
    .version('1.0.0')
    .usage("admin [options] [command]")
    .name("mesh-cli");

program
    .command("status")
    .description("Fetch the Gentics Mesh status")
    .action(status);

program
    .command("syncIndex")
    .description("Invoke the search index sync")
    .action(indexSync);

program
    .command("backup")
    .description("Trigger the server-side backup process")
    .action(backup);


var noSubCommand = program.args.length === 1;
if (noSubCommand) {
    program.help();
}