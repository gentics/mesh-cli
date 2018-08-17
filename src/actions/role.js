'use strict';

const program = require('commander');
const Table = require('cli-table');
const debug = require('debug');
const rest = require("../rest");
const common = require("../common");

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
        console.log(table.toString());
      }
    });
  }


  function add(env) {
    if (typeof env === 'undefined') {
      console.error("No name specified");
      process.exit(1);
    }
    var body = {
      name: env
    };
    rest.post("/api/v1/roles", body).end(r => {
      if (rest.check(r, 201, "Could not create role")) {
        console.log("Created role '" + env + "'");
      }
    });
  }
  
  function remove(env) {
    withIdFallback(env, id => {
      rest.del("/api/v1/roles/" + id).end(r => {
        if (rest.check(r, 204, "Could remove role '" + id + "'")) {
          console.log("Removed role '" + id + "'");
        }
      });
    });
  }
  
  function chmod(env) {
    var id = null;
    var path = null;
    rest.post("/api/v1/roles/" + id + "/permissions/" + path).end(r => {
      if (rest.check(r, 200, "Could apply permissions")) {
        console.log("Applied permission changes.");
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
          console.error("Could not find role '" + env + "'");
          process.exit(1);
        } else {
          action(id);
        }
      }
    });
  }

  module.exports = { list, add, remove }