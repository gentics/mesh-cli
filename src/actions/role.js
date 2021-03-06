'use strict';

const program = require('commander');
const Table = require('cli-table');
const rest = require("../inc/rest");
const group = require("../actions/group");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

function list() {
  rest.get("/api/v1/roles").end(r => {
    if (rest.check(r, 200, "Could not load roles")) {
      var json = r.body;
      var table = new Table({
        head: ['UUID', 'Name', 'Groups'],
        colWidths: [34, 15, 20]
      });

      json.data.forEach((element) => {
        var groups = new Array();
        element.groups.forEach(group => {
          groups.push(group.name);
        });

        var groupsStr = "[" + groups.join() + "]";
        table.push([element.uuid, element.name, groupsStr]);
      });
      log(table.toString());
    }
  });
}

function get() {
  error("Not Implemented");
  process.exit(1);
}


function update(name, options) {
  common.isSet(name, "No role name or uuid specified");
  withIdFallback(name, rid => {
      var remove = options.removeGroup;
      var add = options.addGroup;
      if (!(remove || add)) {
          error("No option specified.")
          process.exit(1);
      }
      if (remove) {
          group.withIdFallback(remove, gid => {
              rest.del("/api/v1/groups/" + gid + "/roles/" + rid).end(r => {
                  if (rest.check(r, 204, "Could not remove role '" + name + "' from group '" + remove + "'")) {
                      log("Removed role '" + name + "' from group '" + remove + "'");
                  }
              });
          });
      }
      if (add) {
          group.withIdFallback(add, gid => {
              rest.post("/api/v1/groups/" + gid + "/roles/" + rid).end(r => {
                  if (rest.check(r, 200, "Could not add role '" + name + "' to group '" + add + "'")) {
                      log("Added role '" + name + "' to group '" + add + "'");
                  }
              });
          });
      }
  });
}


function add(env) {
  if (typeof env === 'undefined') {
    error("No name specified");
    process.exit(1);
  }
  var body = {
    name: env
  };
  rest.post("/api/v1/roles", body).end(r => {
    if (rest.check(r, 201, "Could not create role")) {
      log("Created role '" + env + "'");
    }
  });
}

function remove(name) {
  common.isSet(name, "No name or uuid specified");
  withIdFallback(name, id => {
    rest.del("/api/v1/roles/" + id).end(r => {
      if (rest.check(r, 204, "Could remove role '" + id + "'")) {
        log("Removed role '" + id + "'");
      }
    });
  });
}

function chmod(env) {
  var id = null;
  var path = null;
  rest.post("/api/v1/roles/" + id + "/permissions/" + path).end(r => {
    if (rest.check(r, 200, "Could apply permissions")) {
      log("Applied permission changes.");
    }
  });
}

function withIdFallback(env, action) {
  rest.get("/api/v1/roles").end(ur => {
    if (rest.check(ur, 200, "Could not load roles")) {
      var id = null;
      ur.body.data.forEach(element => {
        if (element.name == env || element.uuid == env) {
          id = element.uuid;
        }
      });
      if (id == null) {
        error("Could not find role '" + env + "'");
        process.exit(1);
      } else {
        action(id);
      }
    }
  });
}

module.exports = { list, add, remove, get, update }