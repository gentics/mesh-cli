'use strict';

const program = require('commander');
const rest = require("./rest");
const Table = require('cli-table');
const debug = require('debug');


function addProject(env, options) {
  var name = options.name;
  if (name === 'undefined') {
    log.error("You need to specifiy the name of the project.")
    process.exit(1);
  }
  var body = {
    name: env,
    schema: {
      name: "folder"
    }
  };
  rest.post("/api/v1/projects", body).end(r => {
    console.dir(r.body);
  });
}

function removeProject(env) {
  withIdFallback(env, id => {
    rest.del("/api/v1/projects/" + id).end(r => {
      if (r.code == 204) {
        console.log("Project " + env + " removed");
      } else {
        console.error("Error while removing project", r.code);
        console.error(r.body);
      }
    });
  });
}

function listSchemas(env, options) {
  var project = env;
  var path = "/api/v1/" + project + "/schemas";
  debug("Loading project schema list via {}", path);
  rest.get(path).end(r => {
    var json = r.body;
    var table = new Table({
      head: ['UUID', 'Name', 'Version']
      , colWidths: [34, 15, 8]
    });

    json.data.forEach((element) => {
      table.push([element.uuid, element.name, element.version])
    });
    console.log(table.toString());

  });
}


function listProjects() {
  rest.get("/api/v1/projects").end(r => {
    var json = r.body;
    var table = new Table({
      head: ['UUID', 'Name', 'Base UUID']
      , colWidths: [34, 15, 34]
    });

    json.data.forEach((element) => {
      table.push([element.uuid, element.name, element.rootNode.uuid])
    });
    console.log(table.toString());

  });
}

function withIdFallback(env, action) {
  rest.get("/api/v1/projects").end(ur => {
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
  .usage("project [options] [command]")
  .name("mesh-cli");

program
  .command("add [name]")
  .description("Add a new project.")
  .option("-s, --schema", "Use the given schema for the root node.")
  .action(addProject);

program
  .command("remove [name/uuid]")
  .description("Remove the project.")
  .action(removeProject);

program
  .command("schemas [name/uuid]")
  .description("List project schemas")
  .action(listSchemas);

program
  .command("list")
  .description("List projects.")
  .action(listProjects);


program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
  program.help();
}

