'use strict';

const program = require('commander');
const rest = require("./rest");
const Table = require('cli-table');
const Line = clui.Line;


function addSchema() {
    rest.post(cfg, "/api/v1/schemas");
}

function updateSchema() {
    rest.post(cfg, "/api/v1/schemas");
}

function linkSchema() {
    var project = null;
    var uuid = null;
    rest.post(cfg, "/api/v1/" + project + "/schemas/" + uuid);
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