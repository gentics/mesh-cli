'use strict';

const program = require('commander');
const rest = require("./rest");
const lists = require("./lists");
const clui = require('clui');
const clc = require('cli-color');
const Line = clui.Line;

function addRole() {
  rest.post(cfg, "/api/v1/roles");
}

function removeRole(env) {
  var id = null;
  rest.delete(cfg, "/api/v1/roles/" + id);
}


function chmod() {
  var id = null;
  var path = null;
  rest.post(cfg, "/api/v1/roles/" + id + "/permissions/" + path);
}

function listRoles() {
  rest.get("/api/v1/roles").end(r => {

    var json = r.body;
    var buffer = lists.buffer();

    var header = new Line(buffer)
      .column('UUID', 34, [clc.cyan])
      .column('Name', 15, [clc.cyan])
      .column('Groups', 20, [clc.cyan])
      .fill()
      .store();

    json.data.forEach((element) => {
      var groups = new Array();
      element.groups.forEach(group => {
        groups.push(group.name);
      });

      var groupsStr = "[" + groups.join() + "]";

      new Line(buffer)
        .column(element.uuid, 34)
        .column(element.name || "-", 15)
        .column(groupsStr)
        .fill()
        .store();
    });

    buffer.output();
  });
}

program
  .version('1.0.0')
  .usage("role [options] [command]")
  .name("mesh-cli");

program
  .command("add [name]")
  .description("Add a new role.")
  .action(addRole);

program
  .command("remove [name/uuid]")
  .description("Remove the role.")
  .action(removeRole);

program
  .command("chmod [path]")
  .description("Change permissions on the given path.")
  .option("-r, --recursive", "Apply permission changes recursively")
  .action(chmod);

program
  .command("list")
  .description("List all roles.")
  .action(listRoles);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
  program.help();
}