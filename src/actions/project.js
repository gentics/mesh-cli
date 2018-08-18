'use strict';

const Table = require('cli-table');
const rest = require("../inc/rest");
const schema = require("../actions/schema");
const microschema = require("../actions/microschema");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;


/**
 * Add the project.
 * 
 * @param {string} name 
 * @param {options} options 
 */
function add(name, options) {
  common.isSet(name, "No project name specified.");
  var body = {
    name: name,
    schema: {
      name: options.schema || "folder"
    }
  };
  rest.post("/api/v1/projects", body).end(r => {
    if (rest.check(r, 201, "Could not create project")) {
      var json = r.body;
      log("Created project '" + name + "' UUID: " + json.uuid);
    }
  });
}

/**
 * Remove the project.
 *
 * @param {string} name 
 */
function remove(name) {
  common.isSet(name, "No project name or uuid specified");
  withIdFallback(name, id => {
    rest.del("/api/v1/projects/" + id).end(r => {
      if (rest.check(r, 204, "Could not remove project " + id)) {
        log("Project '" + id + "' removed");
      }
    });
  });
}

/**
 * List all project schemas.
 * 
 * @param {string} project 
 * @param {object} options 
 */
function listSchemas(project, options) {
  common.isSet(project, "No name or uuid specified");
  rest.get("/api/v1/" + project + "/schemas").end(r => {
    if (rest.check(r, 200, "Could not load schemas of project '" + project + "'")) {
      var json = r.body;
      var table = new Table({
        head: ['UUID', 'Name', 'Version'],
        colWidths: [34, 15, 10]
      });

      json.data.forEach((element) => {
        table.push([element.uuid, element.name, element.version])
      });
      log("Project '" + project + "' schemas:");
      log(table.toString());
    }
  });
}


/**
 * List all project microschemas.
 * 
 * @param {string} project 
 * @param {object} options 
 */
function listMicroschemas(project, options) {
  common.isSet(project, "No name or uuid specified");
  rest.get("/api/v1/" + project + "/microschemas").end(r => {
    if (rest.check(r, 200, "Could not load microschemas of project '" + project + "'")) {
      var json = r.body;
      var table = new Table({
        head: ['UUID', 'Name', 'Version'],
        colWidths: [34, 15, 8]
      });

      json.data.forEach((element) => {
        table.push([element.uuid, element.name, element.version])
      });
      log("Project '" + project + "' microschemas:");
      log(table.toString());
    }

  });
}

function linkSchema(schemaNameOrUuid, project, options) {
  common.isSet(schemaNameOrUuid, "No schema name or uuid specified");
  common.isSet(project, "No project name or uuid specified");
  schema.withIdFallback(schemaNameOrUuid, id => {
    rest.post("/api/v1/" + project + "/schemas/" + id).end(r => {
      if (rest.check(r, 200, "Could not link schema '" + schemaNameOrUuid + "'")) {
        log("Linked schema '" + schemaNameOrUuid + "' to project '" + project + "'");
      }
    });
  });
}

function unlinkSchema(schemaNameOrUuid, project, options) {
  common.isSet(schemaNameOrUuid, "No schema name or uuid specified");
  common.isSet(project, "No project name or uuid specified");
  schema.withIdFallback(schemaNameOrUuid, id => {
    rest.del("/api/v1/" + project + "/schemas/" + id).end(r => {
      if (rest.check(r, 204, "Could not unlink schema '" + schemaNameOrUuid + "'")) {
        log("Unlinked schema '" + schemaNameOrUuid + "' from project '" + project + "'");
      }
    });
  });
}

function linkMicroschema(microschemaNameOrUuid, project, options) {
  common.isSet(microschemaNameOrUuid, "No microschema name or uuid specified");
  common.isSet(project, "No project name or uuid specified");
  microschema.withIdFallback(microschemaNameOrUuid, id => {
    rest.post("/api/v1/" + project + "/microschemas/" + id).end(r => {
      if (rest.check(r, 200, "Could not link microschema '" + microschemaNameOrUuid + "'")) {
        log("Linked microschema '" + microschemaNameOrUuid + "' to project '" + project + "'");
      }
    });
  });
}

function unlinkMicroschema(microschemaNameOrUuid, project, options) {
  common.isSet(microschemaNameOrUuid, "No microschema name or uuid specified");
  common.isSet(project, "No project name or uuid specified");
  microschema.withIdFallback(microschemaNameOrUuid, id => {
    rest.del("/api/v1/" + project + "/microschemas/" + id).end(r => {
      if (rest.check(r, 204, "Could not unlink microschema '" + microschemaNameOrUuid + "'")) {
        log("Unlinked microschema '" + microschemaNameOrUuid + "' from project '" + project + "'");
      }
    });
  });
}

/**
 * List all projects.
 */
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
      log(table.toString());
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
        error("Did not find project '" + env + "'");
        process.exit(1);
      } else {
        action(id);
      }
    }
  });
}


module.exports = { list, add, remove, listSchemas, listMicroschemas, linkSchema, linkMicroschema, unlinkMicroschema, unlinkSchema }