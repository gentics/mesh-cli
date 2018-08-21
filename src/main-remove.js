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

const node = require('./actions/node');
const tagfamily = require('./actions/tagfamily');
const schema = require('./actions/schema');

common.register("Remove various elements.");
configure.register();

program
    .usage("remove [options] [command]");

program
    .command("user <name/uuid>")
    .alias("u")
    .description("Remove the user.")
    .action(user.remove)
    .group("Element");

program
    .command("role <name/uuid>")
    .alias("r")
    .description("Remove the role.")
    .action(role.remove)
    .group("Element");

program
    .command("group <name/uuid>")
    .alias("g")
    .description("Remove the group.")
    .action(group.remove)
    .group("Element");

program
    .command("plugin <id>")
    .description("Uninstall a plugin")
    .action(plugin.uninstall)
    .group("Element");

program
    .command("project [project]")
    .alias("r")
    .description("Remove the project.")
    .action(project.remove)
    .group("Element");

program
    .command("schema <name>")
    .alias("s")
    .description("Remove schema.")
    .action(schema.remove)
    .group("Element");

program
    .command("node <project> <path|uuid>")
    .alias("n")
    .option("-r, --recursive", "Invoke recursive deletion")
    .description("Remove node.")
    .action(node.remove)
    .group("Element");

program
    .command("tagfamily <name/uuid>")
    .alias("tf")
    .description("Remove the tagfamily.")
    .action(tagfamily.remove)
    .group("Element");

program.on('--help', function () {
    var cyan = chalk.cyan;
    var grey = chalk.grey;
    log(grey('\n  Examples:'));

    log(grey('\n  -  ') + "Remove the complete project demo2\n");
    log(cyan('    $ mesh remove project demo2'));

    log(grey('\n  -  ') + "Remove the /vehicles node from the demo project\n");
    log(cyan('    $ mesh remove node demo "/vehicles" -r'));
    log('');
});

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

