#!/usr/bin/env node

'use strict';


const clear = require('clear');
const debug = require('debug');
const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");
const config = require("./inc/config");
const common = require("./inc/common");

const configure = require("./actions/configure");
const user = require("./actions/user");
const schema = require("./actions/schema");
const job = require("./actions/job");
const role = require("./actions/role");
const project = require("./actions/project");
const log = console.log;

common.register();
configure.register();

program
  .command('docker', 'Docker specific commands')
  .alias("d")
  .group("Administration");

program
  .command("list", "List elements")
  .alias("l")
  .group("Element");

program
  .command("remove", "Remove element")
  .alias("r")
  .group("Element");

program
  .command("add", "Add element")
  .alias("a")
  .group("Element");

program
  .command("get", "Get an element")
  .alias("g")
  .group("Element");

program
  .command("update", "Update an element")
  .alias("u")
  .group("Element");

program
  .command('passwd [name]')
  .alias("p")
  .description("Change the password.")
  .option("-u, --user [username]", "Username")
  .option("-p, --pass [password]", "Password")
  .action(user.passwd)
  .group("User");

program
  .command("validate [file]")
  .alias("v")
  .description("Validate the schema via stdin or file.")
  .action(schema.validate)
  .group("Schema");

program
  .command("chmod [path]")
  .alias("c")
  .description("Change permissions on the given path.")
  .option("-r, --recursive", "Apply permission changes recursively")
  .action(role.chmod)
  .group("User");

program
  .command("key [name/uuid]")
  .alias("k")
  .description("Generate a new API key.")
  //. Note that generating a new API key will invalidate the existing API key of the user.")
  .action(user.apiKey)
  .group("User");

program
  .command("link [project] [schema]")
  .description("Link the schema with a project.")
  .action(project.linkSchema)
  .group("Schema");

program
  .command("unlink [project] [schema]")
  .description("Unlink the schema from a project.")
  .action(project.unlinkSchema)
  .group("Schema");

program.on('--help', function () {
  log('\n  Examples:');
  log('');
  log('    $ mesh-cli add project demo --schema folder');
  log('    $ mesh-cli list projectSchemas');
  log('    $ mesh-cli l p');
  log('    $ mesh-cli link demo 09ac57542fde43ccac57542fdeb3ccf8');
  log('');
});

program
  .command('sync', 'Sync specific commands')
  .alias("s")
  .group("Administration");

program
  .command('admin', 'Administration specific commands')
  .alias("a")
  .group("Administration");

program
  .command("reset [uuid]")
  .description("Reset the error state of the job.")
  .action(job.clearJob)
  .group("Administration");
/*
* useradd
* userdel
* usermod
* groupmod
* rolemod
*/


program.parse(process.argv);


