'use strict';

const program = require('commander');

function addGroup() {

}

function removeGroup() {

}

function listGroups() {

}

program
  .version('0.0.1')
  .usage("group [options] [command]")
  .name("mesh-cli");

program
  .command("add [name]")
  .description("Add a new group.")
  .action(addGroup);

program
  .command("remove [name/uuid]")
  .description("Remove the group.")
  .action(removeGroup);

program
  .command("list")
  .description("List all groups.")
  .action(listGroups);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
  program.help();
}