'use strict';

const program = require('commander');
const Table = require('cli-table');
const rest = require("./rest");

function clearJob(env, options) {
    var id = null;
    rest.delete("/api/v1/admin/jobs/" + id + "/error").end(r => {
        if (rest.check(r, 200, "Could not clear errors of job " + id)) {
            console.log("Cleared errors for job '" + id + "'");
        }
    });
}

function listJobs() {
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
            console.log(table.toString());
        }
    });
}

program
    .version('0.0.1')
    .usage("job [options] [command]")
    .name("mesh-cli");

program
    .command("clear [uuid]")
    .description("Clear the job.")
    .action(clearJob);

program
    .command("list")
    .description("List jobs.")
    .action(listJobs);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}