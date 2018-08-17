#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const clear = require('clear');
const debug = require('debug');
const program = require('commander');
const config = require("./config");
const common = require("./common");

const configure = require("./actions/configure");
const user = require("./actions/user");
const schema = require("./actions/schema");
const job = require("./actions/job");
const role = require("./actions/role");
const project = require("./actions/project");
const log = console.log;
const Command = program.Command;

Command.prototype.commandHelp = function () {
  return "";
}

function main() {

  program
    .version('1.0.0')
    .name("mesh-cli");

  configure.register();

  common.register();

  program
    .command('docker', 'Docker specific commands', { noHelp: true })
    .alias("d");

  program
    .command("list", "List elements", { noHelp: true })
    .alias("l");

  program
    .command("remove", "Remove element", { noHelp: true })
    .alias("r");

  program
    .command("add", "Add element", { noHelp: true })
    .alias("a");

  program
    .command('passwd [name/uuid]', { noHelp: true })
    .alias("p")
    .description("Change the password.")
    .option("-u, --user [username]", "Username")
    .option("-p, --pass [password]", "Password")
    .action(user.passwd);

  program
    .command("validate [filename]", { noHelp: true })
    .alias("v")
    .description("Validate the schema via stdin or file.")
    .action(schema.getSchema);

  program
    .command("clear [uuid]", { noHelp: true })
    .description("Clear the job.")
    .action(job.clearJob);

  program
    .command("key [name/uuid]", { noHelp: true })
    .alias("k")
    .description("Generate a new API key.")
    //. Note that generating a new API key will invalidate the existing API key of the user.")
    .action(user.apiKey);

  program
    .command("chmod [path]", { noHelp: true })
    .alias("c")
    .description("Change permissions on the given path.")
    .option("-r, --recursive", "Apply permission changes recursively")
    .action(role.chmod);

  program
    .command("link [project] [schema]", { noHelp: true })
    .description("Link the schema with a project.")
    .action(project.linkSchema);

  program
    .command("unlink [project] [schema]", { noHelp: true })
    .description("Unlink the schema from a project.")
    .action(project.unlinkSchema);

  program.on('--help', function () {
    program.commands.forEach(command => {
      var alias = command.alias() ? " | " + command.alias() : ""
      var grey = chalk.grey;
      log("    " + grey(pad(command.name() + alias, 15)) + command.description());
    });
    log('  Examples:');
    log('');
    log('    $ mesh-cli project add demo --schema folder');
    log('    $ mesh-cli project schemas');
    log('    $ mesh-cli p l');
    log('    $ mesh-cli p link demo 09ac57542fde43ccac57542fdeb3ccf8');
    log('');
  });

  program
    .command('sync', 'Sync specific commands', { noHelp: true })
    .alias("s");

  program
    .command('admin', 'Administration specific commands', { noHelp: true })
    .alias("a");

  /*
  * useradd
  * userdel
  * usermod
  * groupmod
  * rolemod
  */


  program.parse(process.argv);


}

function pad(str, width) {
  var len = Math.max(0, width - str.length);
  return str + Array(len + 1).join(' ');
}


main();
