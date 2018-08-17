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

Command.prototype.group = function (name) {
  var command = this;
  if (this.commands.length !== 0) {
    command = this.commands[this.commands.length - 1];
  }
  if (arguments.length === 0) {
    return command._group || "CLI";
  }
  command._group = name;
  return this;
}

Command.prototype.padWidth = () => {
  return 30;
}

Command.prototype.commandHelp = function () {
  if (!this.commands.length) return '';

  var width = this.padWidth();
  var grey = chalk.grey;

  var groups = this.commands.reduce(function (rv, cmd) {
    (rv[cmd.group()] = rv[cmd.group()] || []).push(cmd);
    return rv;
  }, {});

  var groupInfo = Object.keys(groups).map((group) => {
    var commands = groups[group];
    var info = commands.map(cmd => {
      var alias = cmd.alias() ? " | " + cmd.alias() : ""
      var args = cmd._args.map(e => '[' + e.name + ']').join("");
      var name = cmd.name();
      var desc = cmd.description();
      return pad(pad("    " + name + alias, 16) + " " + args, 36) + desc;
    }).join("\n");
    return "  " + grey(group + ":") + "\n\n" + info + "\n\n";
  }).join("");

  return groupInfo;
}


function main() {

  program
    .version('1.0.0')
    .name("mesh-cli")
    .description("CLI which can be used to interact with a Gentics Mesh server.", { "command": "ssss" });

  configure.register();

  common.register();

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
    .action(schema.getSchema)
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
    log('    $ mesh-cli project add demo --schema folder');
    log('    $ mesh-cli project schemas');
    log('    $ mesh-cli p l');
    log('    $ mesh-cli p link demo 09ac57542fde43ccac57542fdeb3ccf8');
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
    .command("clearJob [uuid]")
    .description("Clear the job.")
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


}

function pad(str, width) {
  var len = Math.max(0, width - str.length);
  return str + Array(len + 1).join(' ');
}


main();
