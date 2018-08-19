#!/usr/bin/env node

'use strict';

const program = require('commander');
// Patch commander for nicer help
require("./inc/commander");

const configure = require("./actions/configure");
const common = require("./inc/common");

const user = require("./actions/user");
const role = require("./actions/role");
const group = require("./actions/group");

const project = require("./actions/project");
const tagfamily = require("./actions/tagfamily");
const schema = require("./actions/schema");
const node = require("./actions/node");

const job = require("./actions/job");
const plugin = require("./actions/plugin");

common.register("Load elements from the system.");
configure.register();

program
    .usage("get [options] [command]");

program
    .command("schema [name]")
    .alias("s")
    .description("Get the schema.")
    .action(schema.get)
    .group("Element");

program
    .command("project [name]")
    .alias("p")
    .description("Get the project.")
    .action(project.get)
    .group("Element");

program
    .command("user [name]")
    .alias("u")
    .description("Get the user.")
    .action(user.get)
    .group("Element");

program
    .command("role [name]")
    .alias("r")
    .description("Get the role.")
    .action(role.get)
    .group("Element");

program
    .command("group [name]")
    .alias("g")
    .description("Get the group.")
    .action(project.get)
    .group("Element");

program
    .command("node [project] [path|id]")
    .alias("n")
    .description("Get the node.")
    .action(node.get)
    .group("Element");

program
    .command("tagfamily [project] [name]")
    .alias("tf")
    .description("Get the tagfamily.")
    .action(tagfamily.get)
    .group("Element");

program
    .command("plugin [name]")
    .alias("pl")
    .description("Get the plugin.")
    .action(plugin.get)
    .group("Element");

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}