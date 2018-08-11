'use strict';

const program = require('commander');

function install() {

}

function uninstall() {

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


program.parse(process.argv);

var noSubCommand = program.args.length === 1;
if (noSubCommand) {
    program.help();
}