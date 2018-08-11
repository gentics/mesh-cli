'use strict';

const program = require('commander');
const rest = require("./rest");
const lists = require("./lists");
const clui = require('clui');
const clc = require('cli-color');
const Line = clui.Line;

function addGroup() {
  rest.post(cfg, "/api/v1/groups");
}

function removeGroup() {
  var id = null;
  rest.delete(cfg, "/api/v1/groups/" + id);
}

function listGroups() {
  rest.get("/api/v1/groups").end(r => {

    var json = r.body;
    var buffer = lists.buffer();

    var header = new Line(buffer)
      .column('UUID', 34, [clc.cyan])
      .column('Name', 15, [clc.cyan])
      .column('Roles', 30, [clc.cyan])
      .fill()
      .store();

    json.data.forEach((element) => {
      var roles = new Array();
      element.roles.forEach(role => {
        roles.push(role.name);
      });

      var rolesStr = "[" + roles.join() + "]";
      new Line(buffer)
        .column(element.uuid, 34)
        .column(element.name || "-", 15)
        .column(rolesStr, 30)
        .fill()
        .store();
    });

    buffer.output();
  });
}

program
  .version('0.0.1')
  .usage("group [options] [command]")
  .name("mesh-cli");

program
  .command("add [name]")
  .description("Add a new group.")
  .action(addGroup);

program
  .command("remove [name/uuid]")
  .description("Remove the group.")
  .action(removeGroup);

program
  .command("list")
  .description("List all groups.")
  .action(listGroups);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
  program.help();
}