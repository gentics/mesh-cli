'use strict';

const program = require('commander');

function addRole() {

}

function removeRole() {

}


function chmod() {

}

function listRoles() {

}

program
  .version('1.0.0')
  .usage("role [options] [command]")
  .name("mesh-cli");

program
  .command("add [name]")
  .description("Add a new role.")
  .action(addRole);

program
  .command("remove [name/uuid]")
  .description("Remove the role.")
  .action(removeRole);

program
  .command("chmod [path]")
  .description("Change permissions on the given path.")
  .option("-r, --recursive", "Apply permission changes recursively")
  .action(chmod);

program
  .command("list")
  .description("List all roles.")
  .action(listRoles);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
  program.help();
}