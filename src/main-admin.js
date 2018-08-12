'use strict';

const program = require('commander');
const Table = require('cli-table');
const debug = require('debug');
const rest = require("./rest");

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

program
    .version('1.0.0')
    .usage("admin [options] [command]")
    .name("mesh-cli");

program
    .command("status")
    .alias("s")
    .description("Fetch the Gentics Mesh status")
    .action(status);

program
    .command("index")
    .alias("i")
    .description("Invoke the search index sync")
    .action(indexSync);

program
    .command("backup")
    .alias("b")
    .description("Trigger the server-side backup process")
    .action(backup);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}