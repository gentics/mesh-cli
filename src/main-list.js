'use strict';

const program = require('commander');
const Table = require('cli-table');
const rest = require("./rest");

const user = require("./actions/user");
const role = require("./actions/role");
const group = require("./actions/group");

const project = require("./actions/project");
const tagfamily = require("./actions/tagfamily");
const schema = require("./actions/schema");

const job = require("./actions/job");
const plugin = require("./actions/plugin");

program
    .version('0.0.1')
    .usage("list [options] [command]")
    .name("mesh-cli");

program
    .command("plugin")
    .description("List installed plugins")
    .action(plugin.list);

program
    .command("user")
    .alias("u")
    .description("List users")
    .action(user.list);

program
    .command("role")
    .alias("r")
    .description("List roles")
    .action(role.list);

program
    .command("group")
    .alias("g")
    .description("List groups")
    .action(group.list);

program
    .command("tagfamily")
    .alias("tf")
    .description("List all tag families.")
    .action(tagfamily.list);

program
    .command("project")
    .alias("p")
    .description("List projects.")
    .action(project.list);

program
    .command("schemas [project]")
    .alias("s")
    .description("List project schemas")
    .action(schema.list);

program
    .command("projectSchemas [project]")
    .alias("ps")
    .description("List all schemas.")
    .action(project.listSchemas);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}