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
const microschema = require("./actions/microschema");
const branch = require("./actions/branch");

const job = require("./actions/job");
const plugin = require("./actions/plugin");

common.register();
configure.register();

program
    .usage("list [options] [command]");

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
    .command("branch")
    .alias("b")
    .description("List project branches.")
    .action(branch.list);

program
    .command("schema [project]")
    .alias("s")
    .description("List project schemas")
    .action(schema.list);

program
    .command("microschema [project]")
    .alias("ms")
    .description("List project microschemas")
    .action(microschema.list);

program
    .command("projectSchema [project]")
    .alias("ps")
    .description("List all project schemas.")
    .action(project.listSchemas);

program
    .command("projectMicroschema [project]")
    .alias("pms")
    .description("List all project microschemas.")
    .action(project.listMicroschemas);

common.registerEnd();

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}