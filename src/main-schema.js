'use strict';

const program = require('commander');
const rest = require("./rest");
const lists = require("./lists");
const clui = require('clui');
const clc = require('cli-color');
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
        var buffer = lists.buffer();

        var header = new Line(buffer)
            .column('UUID', 34, [clc.cyan])
            .column('Name', 20, [clc.cyan])
            .column('Version', 15, [clc.cyan])
            .fill()
            .store();

        json.data.forEach((element) => {
            new Line(buffer)
                .column(element.uuid, 34)
                .column(element.name || "-", 20)
                .column(element.version || "-", 15)
                .fill()
                .store();
        });

        buffer.output();
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