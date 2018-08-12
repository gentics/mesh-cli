'use strict';

const program = require('commander');
const rest = require("./rest");
const Table = require('cli-table');
const debug = require('debug');

function addGroup(env, options) {
  if (typeof env === 'undefined') {
    console.error("No name specified");
    process.exit(1);
  }
  var body = {
    name: env
  };
  rest.post("/api/v1/groups", body).end(r => {
    if (rest.check(r, 201, "Could not create group")) {
      console.log("Created group '" + env + "'");
    }
  });
}

function removeGroup(env) {
  withIdFallback(env, id => {
    rest.del("/api/v1/groups/" + id).end(r => {
      if (rest.check(r, 200, "Could not remove group '" + id + "'")) {
        console.log("Removed group '" + id + "'");
      }
    });
  });
}

function listGroups() {
  rest.get("/api/v1/groups").end(r => {
    if (rest.check(r, 200, "Could not list groups")) {
      var json = r.body;
      var table = new Table({
        head: ['UUID', 'Name', 'Roles'],
        colWidths: [34, 15, 20]
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
    }
  });
}

function withIdFallback(env, action) {
  rest.get("/api/v1/groups").end(ur => {
    if (rest.check(ur, 200, "Could not list groups")) {
      var id = null;
      ur.body.data.forEach(element => {
        if (element.name == env || element.uuid == env) {
          id = element.uuid;
        }
      });
      if (id == null) {
        console.error("Could not find group '" + env + "'");
        process.exit(1);
      } else {
        action(id);
      }
    }
  });
}

program
  .version('0.0.1')
  .usage("group [options] [command]")
  .name("mesh-cli");

program
  .command("add [name]")
  .alias("a")
  .description("Add a new group.")
  .action(addGroup);

program
  .command("remove [name/uuid]")
  .alias("r")
  .description("Remove the group.")
  .action(removeGroup);

program
  .command("list")
  .alias("l")
  .description("List all groups.")
  .action(listGroups);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
  program.help();
}