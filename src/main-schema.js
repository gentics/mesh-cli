'use strict';

const program = require('commander');
const rest = require("./rest");
const Table = require('cli-table');

function addSchema(env, options) {
    var body = {

    };
    rest.post("/api/v1/schemas", body).end(r => {
        if (rest.check(r, 201, "Could not create schema")) {
            console.log("Created schema '" + env + "'");
        }
    });
}

function updateSchema(env, options) {
    var body = {

    };
    rest.post("/api/v1/schemas", body).end(r => {
        if (rest.check(r, 200, "Could not update schema")) {
            console.log("Updated schema '" + env + "'");
        }
    });
}

function unlinkSchema(env, options) {

}

function linkSchema(env, options) {
    var project = null;
    var uuid = null;
    rest.post("/api/v1/" + project + "/schemas/" + uuid).end(r => {
        if (rest.check(r, 200, "Could list schemas")) {
            console.log("Linked schema '" + uuid + "' to project '" + project + "'");
        }
    });
}

function listSchemas(env, options) {
    rest.get("/api/v1/schemas").end(r => {
        if (rest.check(r, 200, "Could list schemas")) {

            var json = r.body;
            var table = new Table({
                head: ['UUID', 'Name', 'Version'],
                colWidths: [34, 18, 9]
            });

            json.data.forEach((element) => {
                table.push([element.uuid, element.name, element.version])
            });
            console.log(table.toString());
        }
    });
}

program
    .version('1.0.0')
    .usage("schema [options] [command]")
    .name("mesh-cli");

program
    .command("add [name]")
    .alias("a")
    .description("Add a new schema.")
    .action(addSchema);

program
    .command("update [name/uuid]")
    .alias("u")
    .description("Update schema.")
    .action(updateSchema);

program
    .command("list")
    .alias("l")
    .description("List all schemas.")
    .action(listSchemas);

program
    .command("link")
    .description("Link the schema with a project.")
    .action(linkSchema);

program
    .command("unlink")
    .description("Unlink the schema from a project.")
    .action(unlinkSchema);


program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}