'use strict';

const program = require('commander');
const rest = require("./rest");
const lists = require("./lists");
const clui = require('clui');
const clc = require('cli-color');
const Line = clui.Line;

function install(env) {
    rest.post(cfg, "/api/v1/admin/plugins");
}

function uninstall(env) {
    var id = null;
    rest.delete(cfg, "/api/v1/admin/plugins/" + id);
}

function listPlugins() {
    rest.get("/api/v1/admin/plugins").end(r => {

        var json = r.body;
        var buffer = lists.buffer();

        var header = new Line(buffer)
            .column('UUID', 34, [clc.cyan])
            .column('Name', 15, [clc.cyan])
            .fill()
            .store();

        json.data.forEach((element) => {
            new Line(buffer)
                .column(element.uuid, 34)
                .column(element.name || "-", 15)
                .fill()
                .store();
        });

        buffer.output();
    });
}

program
    .version('0.0.1')
    .usage("plugin [options] [command]")
    .name("mesh-cli");

program
    .command("install [path]")
    .description("Install a plugin")
    .action(install);

program
    .command("uninstall [id]")
    .description("Uninstall a plugin")
    .action(uninstall);

program
    .command("list")
    .description("List installed plugins")
    .action(listPlugins);


program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}