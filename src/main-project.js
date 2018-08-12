#!/usr/bin/env node

'use strict';

const program = require('commander');
const Table = require('cli-table');
const debug = require('debug');
const rest = require("./rest");
const common = require("./common");

function addProject(env, options) {
  var name = options.name;
  if (typeof name === 'undefined') {
    console.error("No name specified");
    process.exit(1);
  }
  var body = {
    name: env,
    schema: {
      name: options.schema || "folder"
    }
  };
  rest.post("/api/v1/projects", body).end(r => {
    if (rest.check(r, 201, "Could not create project")) {
      console.log("Created project '" + env + "'");
    }
  });
}

function removeProject(env) {
  if (typeof env === 'undefined') {
    console.error("No name specified");
    process.exit(1);
  }
  withIdFallback(env, id => {
    rest.del("/api/v1/projects/" + id).end(r => {
      if (rest.check(r, 204, "Could not remove project " + id)) {
        console.log("Project '" + id + "' removed");
      }
    });
  });
}

function listSchemas(env, options) {
  var project = env;
  if (typeof project === 'undefined') {
    console.error("No name specified");
    process.exit(1);
  }
  rest.get("/api/v1/" + project + "/schemas").end(r => {
    if (rest.check(r, 200, "Could not load schemas of project '" + project + "'")) {
      var json = r.body;
      var table = new Table({
        head: ['UUID', 'Name', 'Version'],
        colWidths: [34, 15, 8]
      });

      json.data.forEach((element) => {
        table.push([element.uuid, element.name, element.version])
      });
      console.log(table.toString());
    }

  });
}

function linkSchema(project, schemaUuid, options) {
  if (typeof project === 'undefined') {
    console.error("No name specified");
    process.exit(1);
  }
  if (typeof schemaUuid === 'undefined') {
    console.error("No schemaUuid specified");
    process.exit(1);
  }
  rest.post("/api/v1/" + project + "/schemas/" + schemaUuid).end(r => {
    if (rest.check(r, 200, "Could not link schema")) {
      console.log("Linked schema '" + schemaUuid + "' to project '" + project + "'");
    }
  });
}

function unlinkSchema(project, schemaUuid, options) {
  if (typeof project === 'undefined') {
    console.error("No name specified");
    process.exit(1);
  }
  if (typeof schemaUuid === 'undefined') {
    console.error("No schemaUuid specified");
    process.exit(1);
  }
  rest.del("/api/v1/" + project + "/schemas/" + schemaUuid).end(r => {
    if (rest.check(r, 204, "Could not unlink schema '" + schemaUuid + "'")) {
      console.log("Unlinked schema '" + schemaUuid + "' to project '" + project + "'");
    }
  });
}

function listProjects() {
  rest.get("/api/v1/projects").end(r => {
    if (rest.check(r, 200, "Could not load projects")) {
      var json = r.body;
      var table = new Table({
        head: ['UUID', 'Name', 'Base UUID'],
        colWidths: [34, 15, 34]
      });

      json.data.forEach((element) => {
        table.push([element.uuid, element.name, element.rootNode.uuid])
      });
      console.log(table.toString());
    }
  });
}

function withIdFallback(env, action) {
  rest.get("/api/v1/projects").end(ur => {
    if (rest.check(ur, 200, "Could not load projects")) {
      var id = null;
      ur.body.data.forEach(element => {
        if (element.name == env || element.uuid == env) {
          id = element.uuid;
        }
      });
      if (id == null) {
        console.error("Did not find project '" + env + "'");
        process.exit(1);
      } else {
        action(id);
      }
    }
  });
}

function main() {

  program
    .version('0.0.1')
    .usage("project [options] [command]")
    .name("mesh-cli");

  common.register();

  program
    .command("list")
    .alias("l")
    .description("List projects.")
    .action(listProjects);

  program
    .command("add [project]")
    .alias("a")
    .description("Add a new project.")
    .option("-s, --schema", "Use the given schema for the root node.")
    .action(addProject);

  program
    .command("remove [project]")
    .alias("r")
    .description("Remove the project.")
    .action(removeProject);

  program
    .command("schemas [project]")
    .alias("s")
    .description("List project schemas")
    .action(listSchemas);

  program
    .command("link [project] [schema]")
    .description("Link the schema with a project.")
    .action(linkSchema);

  program
    .command("unlink [project] [schema]")
    .description("Unlink the schema from a project.")
    .action(unlinkSchema);

  program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ mesh-cli project add demo --schema folder');
    console.log('    $ mesh-cli project schemas');
    console.log('    $ mesh-cli p l');
    console.log('    $ mesh-cli p link demo 09ac57542fde43ccac57542fdeb3ccf8');
    console.log('');
  });

  program.parse(process.argv);

  var noSubCommand = program.args.length === 0;
  if (noSubCommand) {
    program.help();
  }
}

main();
