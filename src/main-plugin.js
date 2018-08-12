'use strict';

const program = require('commander');
const rest = require("./rest");
const Table = require('cli-table');

function install(env) {
    rest.post("/api/v1/admin/plugins");
}

function uninstall(env) {
    var id = null;
    rest.delete("/api/v1/admin/plugins/" + id);
}

function listPlugins() {
    rest.get("/api/v1/admin/plugins").end(r => {
        var json = r.body;
        var table = new Table({
            head: ['UUID', 'Name']
            , colWidths: [34, 15]
        });

        json.data.forEach((element) => {
            table.push([element.uuid, element.name]);
        });
        console.log(table.toString());
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