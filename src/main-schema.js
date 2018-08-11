'use strict';

const program = require('commander');

function addSchema() {

}

function updateSchema() {

}

function linkSchema() {

}

function listSchemas() {

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