'use strict';

const program = require('commander');
const rest = require("./rest");
const Table = require('cli-table');
const debug = require('debug');

function addGroup(env, options) {
  if (typeof env === 'undefined') {
    console.error("No name specified");
    return;
  }
  var body = {
    name: env
  };
  rest.post("/api/v1/groups", body).end(r => {
    if (r.code === 201) {
      console.log("Created group " + env);
    } else {
      console.error("Error while creating group", r.code);
      console.error(r.body);
    }
  });
}

function removeGroup(env) {
  withIdFallback(env, id => {
    rest.del("/api/v1/groups/" + id).end(r => {
      console.dir(r.body);
    });
  });
}

function listGroups() {
  rest.get("/api/v1/groups").end(r => {
    var json = r.body;
    var table = new Table({
      head: ['UUID', 'Name', 'Roles']
      , colWidths: [34, 15, 20]
    });

    json.data.forEach((element) => {
      var roles = new Array();
      element.roles.forEach(role => {
        roles.push(role.name);
      });

      var rolesStr = "[" + roles.join() + "]";

      table.push([element.uuid, element.name, rolesStr]);
    });
    console.log(table.toString());
  });
}

function withIdFallback(env, action) {
  rest.get("/api/v1/groups").end(ur => {
    var id = env;
    ur.body.data.forEach(element => {
      if (element.name == env) {
        id = element.uuid;
      }
    });
    action(id);
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