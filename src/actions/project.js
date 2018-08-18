'use strict';

const Table = require('cli-table');
const rest = require("../inc/rest");
const common = require("../inc/common");

function add(env, options) {
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
  
  function remove(env) {
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
  
  function listSchemas(project, options) {
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
  
  function list() {
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
  

  module.exports = { list, add, remove, listSchemas }