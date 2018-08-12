'use strict';

const program = require('commander');
const rest = require("./rest");
const Table = require('cli-table');
const debug = require('debug');

function addRole(env) {
  var body = {
    name: env
  };
  rest.post("/api/v1/roles", body).end(r => {
    console.dir(r.body);
  });
}

function removeRole(env) {
  withIdFallback(env, id => {
    rest.del("/api/v1/roles/" + id).end(r => {
      console.dir(r);
    });
  });
}

function chmod(env) {
  var id = null;
  var path = null;
  rest.post("/api/v1/roles/" + id + "/permissions/" + path).end(r => {
    console.dir(r.body);
  });
}

function listRoles() {
  rest.get("/api/v1/roles").end(r => {
    var json = r.body;
    var table = new Table({
      head: ['UUID', 'Name', 'Groups']
      , colWidths: [34, 15, 20]
    });

    json.data.forEach((element) => {
      var groups = new Array();
      element.groups.forEach(group => {
        groups.push(group.name);
      });

      var groupsStr = "[" + groups.join() + "]";

      table.push([element.uuid, element.name, groupsStr]);
    });
    console.log(table.toString());
  });
}

function withIdFallback(env, action) {
  rest.get("/api/v1/roles").end(ur => {
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