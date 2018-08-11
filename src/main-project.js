'use strict';

const program = require('commander');
const clui = require('clui');

function addProject(env, options) {
  var name = options.name;
  if (name === 'undefined') {
    log.error("You need to specifiy the name of the project.")
    process.exit(1);
  }
  console.log("createProject")
}

function removeProject() {

}

function listProjects() {
  console.log("print project list");
}

program
  .version('0.0.1')
  .usage("project [options] [command]")
  .name("mesh-cli");

program
  .command("add [name]")
  .description("Add a new project.")
  .option("-s, --schema", "Use the given schema for the root node.")
  .action(addProject);

program
  .command("remove [name/uuid]")
  .description("Remove the project.")
  .action(removeProject);

program
  .command("list")
  .description("List projects.")
  .action(listProjects);


program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
  program.help();
}

