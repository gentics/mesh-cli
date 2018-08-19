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

const user = require("./actions/user");
const role = require("./actions/role");
const group = require("./actions/group");

const project = require("./actions/project");
const tagfamily = require("./actions/tagfamily");
const schema = require("./actions/schema");
const microschema = require("./actions/microschema");
const branch = require("./actions/branch");

const job = require("./actions/job");
const plugin = require("./actions/plugin");

common.register("List various elements that have been stored.");
configure.register();

program
    .usage("list [options] [command]");

program
    .command("user")
    .alias("u")
    .description("List users.")
    .action(user.list)
    .group("Element");

program
    .command("role")
    .alias("r")
    .description("List roles.")
    .action(role.list)
    .group("Element");

program
    .command("group")
    .alias("g")
    .description("List groups.")
    .action(group.list)
    .group("Element");

program
    .command("tagfamily <project>")
    .alias("tf")
    .description("List all tag families.")
    .action(tagfamily.list)
    .group("Element");

program
    .command("project")
    .alias("p")
    .description("List projects.")
    .action(project.list)
    .group("Element");

program
    .command("branch <project>")
    .alias("b")
    .description("List project branches.")
    .action(branch.list)
    .group("Element");

program
    .command("schema [project]")
    .alias("s")
    .description(`List schemas. (globally or project schemas)`)
    .action(schema.list)
    .group("Schema");

program
    .command("microschema [project]")
    .alias("ms")
    .description(`List microschemas. (globally or project microschemas)`)
    .action(microschema.list)
    .group("Schema");

program
    .command("plugin")
    .alias("pl")
    .description("List installed plugins.")
    .action(plugin.list)
    .group("Element");

program.on('--help', function () {
    var cyan = chalk.cyan;
    var grey = chalk.grey;
    log(grey('\n  Examples:'));

    log(grey('\n  -  ') + "List all schemas in the system\n");
    log(cyan('    $ mesh-cli list schema'));

    log(grey('\n  -  ') + "List all schemas that are linked to the demo project\n");
    log(cyan('    $ mesh-cli list schema demo'));

    log('');
});

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}