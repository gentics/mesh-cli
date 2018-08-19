#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const configure = require("./actions/configure");
const common = require("./inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

const project = require('./actions/project');
const plugin = require('./actions/plugin');

const user = require('./actions/user');
const role = require('./actions/role');
const group = require('./actions/group');

const schema = require('./actions/schema');
const microschema = require('./actions/microschema');
const tagfamily = require('./actions/tagfamily');


common.register("Add new elements to Gentics Mesh.");
configure.register();

program
    .usage("add [options] [command]");

program
    .command("plugin <path>")
    .description("Install a plugin.")
    .action(plugin.install)
    .group("Element");

program
    .command('tagfamily <name>')
    .description("Add a new tagfamily.")
    .action(tagfamily.add)
    .group("Element");

program
    .command("project <name>")
    .alias("p")
    .description("Add a new project.")
    .option("-s, --schema", "Use the given schema for the project root node.")
    .action(project.add)
    .group("Element");

program
    .command("schema [filename]")
    .alias("s")
    .description("Add a new schema via stdin or file.")
    .action(schema.add)
    .group("Element");

program
    .command("microschema [filename]")
    .alias("s")
    .description("Add a new microschema via stdin or file.")
    .action(microschema.add)
    .group("Element");

program
    .command('user <name>')
    .alias("u")
    .option("-p, --pass [password]", "Password")
    .description("Add a new user.")
    .action(user.add)
    .group("Element");

program
    .command('role <name>')
    .alias("r")
    .description("Add a new role.")
    .action(role.add)
    .group("Element");

program
    .command("group <name>")
    .alias("g")
    .description("Add a new group.")
    .action(group.add)
    .group("Element");

program.on('--help', function () {
    var cyan = chalk.cyan;
    var grey = chalk.grey;
    log(grey('\n  Examples:'));

    log(grey('\n  -  ') + "Add a new project called demo2\n");
    log(cyan('    $ mesh-cli add project demo2'));

    log(grey('\n  -  ') + "Add a new user\n");
    log(cyan('    $ mesh-cli add user dummyuser'));
    log('');
});

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

