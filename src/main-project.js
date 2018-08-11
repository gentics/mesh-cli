'use strict';

const program = require('commander');
const rest = require("./rest");
const lists = require("./lists");
const clui = require('clui');
const clc = require('cli-color');
const debug = require('debug');
const Line = clui.Line;

function addProject(env, options) {
  var name = options.name;
  if (name === 'undefined') {
    log.error("You need to specifiy the name of the project.")
    process.exit(1);
  }
  var body = {
    name: name
  };
  rest.post(cfg, "/api/v1/projects", body);
}

function removeProject() {
  var id = null;
  rest.delete(cfg, "/api/v1/projects/" + id);
}

function listSchemas(env, options) {
  var path = "/api/v1/" + env + "/schemas";
  debug("Loading project schema list via {}", path);
  rest.get(path).end(r => {
    
    var json = r.body;
    var buffer = lists.buffer();

    var header = new Line(buffer)
      .column('UUID', 34, [clc.cyan])
      .column('Name', 20, [clc.cyan])
      .column('Version', 15, [clc.cyan])
      .fill()
      .store();

    json.data.forEach((element) => {
      new Line(buffer)
        .column(element.uuid, 34)
        .column(element.name || "-", 20)
        .column(element.version || "-", 15)
        .fill()
        .store();
    });

    buffer.output();
  });
}


function listProjects() {
  rest.get("/api/v1/projects").end(r => {

    var json = r.body;
    var buffer = lists.buffer();

    var header = new Line(buffer)
      .column('UUID', 34, [clc.cyan])
      .column('Name', 15, [clc.cyan])
      .column('Base UUID', 34, [clc.cyan])
      .fill()
      .store();

    json.data.forEach((element) => {
      new Line(buffer)
        .column(element.uuid, 34)
        .column(element.name || "-", 15)
        .column(element.rootNode.uuid, 30)
        .fill()
        .store();
    });

    buffer.output();
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

