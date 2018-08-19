#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");
const config = require("./inc/config");
const common = require("./inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

const configure = require("./actions/configure");
const user = require("./actions/user");
const schema = require("./actions/schema");
const job = require("./actions/job");
const role = require("./actions/role");
const project = require("./actions/project");

common.register(
`  CLI which can be used to interact with a Gentics Mesh server.
    Use the ` + chalk.grey("configure") +  ` command to setup the CLI.
`);
configure.register();

program
  .command('docker', 'Docker specific commands.')
  .alias("d")
  .group("Administration");

program
  .command("list [type]", "List elements.")
  .alias("l")
  .group("Element");

program
  .command("remove [type] [id]", "Remove element.")
  .alias("rm")
  .group("Element");

program
  .command("add [type] [name]", "Add new element.")
  .alias("a")
  .group("Element");

program
  .command("get [type] [id]", "Get an element and return JSON.")
  .alias("g")
  .group("Element");

program
  .command("update [type] [id]", "Update an element.")
  .alias("u")
  .group("Element");

program
  .command('passwd [name]')
  .alias("p")
  .description("Change the password of an user.")
  .option("-u, --user [username]", "Username")
  .option("-p, --pass [password]", "Password")
  .action(user.passwd)
  .group("User");

program
  .command("validate [type] [file]", "Validate elements via stdin or file.")
  .alias("v")
  .group("Schema");

program
  .command("chmod [path]")
  .alias("c")
  .description("Change permissions of a role on the given path.")
  .option("-r, --recursive", "Apply permission changes recursively")
  .action(role.chmod)
  .group("User");

program
  .command("key [name]")
  .alias("k")
  .description("Generate a new API key for the user.")
  // Note that generating a new API key will invalidate the existing API key of the user.")
  .action(user.apiKey)
  .group("User");

program
  .command("link [type] [project] [schema]", "Link the microschema with a project.")
  .group("Schema");

program
  .command("unlink [type] [project] [schema]", "Unlink the microschema from a project.")
  .group("Schema");

/*
program
  .command('sync', 'Sync specific commands.')
  .alias("s")
  .group("Administration");
*/
program
  .command('admin', 'Administration specific commands.')
  .alias("a")
  .group("Administration");

program
  .command("reset [uuid]")
  .description("Reset the error state of the job.")
  .action(job.clearJob)
  .group("Administration");

program.on('--help', function () {
  var cyan = chalk.cyan;
  var grey = chalk.grey;
  log(grey('\n  Types:'));
  log(grey('\n  -  ') + "user,group,role,project,schema,microschema,tagfamily,job,plugin,branch");

  log(grey('\n  Examples:'));
  
  log(grey('\n  -  ') + "Add a new project named demo2 to the system\n");
  log(cyan('    $ mesh-cli add project demo2 --schema folder'));
  
  log(grey('\n  -  ') + "List all schemas that are linked to the demo project\n");
  log(cyan('    $ mesh-cli list projectSchemas demo'));
  
  log(grey('\n  -  ') + "Short form to list all projects\n");
  log(cyan('    $ mesh-cli l p'));
  
  log(grey('\n  -  ') + "Link the schema with the given uuid to the demo project\n");
  log(cyan('    $ mesh-cli link schema demo 09ac57542fde43ccac57542fdeb3ccf8'));
  
  log(grey('\n  -  ') + "Unlink the folder schema from the demo project\n");
  log(cyan('    $ mesh-cli unlink schema demo folder'));
  log('');
});



/*
* useradd
* userdel
* usermod
* groupmod
* rolemod
*/

common.registerEnd();


program.parse(process.argv);


