'use strict';

const program = require('commander');
const rest = require("./rest");
const Table = require('cli-table');
const Line = clui.Line;


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

function linkSchema() {
    var project = null;
    var uuid = null;
    rest.post("/api/v1/" + project + "/schemas/" + uuid).end(r => {

    });
}

function listSchemas(env) {
    rest.get("/api/v1/schemas").end(r => {
        var json = r.body;
        var table = new Table({
            head: ['UUID', 'Name', 'Version']
            , colWidths: [34, 15, 8]
        });

        json.data.forEach((element) => {
            table.push([element.uuid, element.name, element.version])
        });
        console.log(table.toString());
    });
}

program
    .version('1.0.0')
    .usage("schema [options] [command]")
    .name("mesh-cli");

program
    .command("add [name]")
    .description("Add a new schema.")
    .action(addSchema);

program
    .command("update [name/uuid]")
    .description("Update schema.")
    .action(updateSchema);

program
    .command("list")
    .description("List all schemas.")
    .action(listSchemas);

program
    .command("link")
    .description("Link the schema with a project.")
    .action(linkSchema);


program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}