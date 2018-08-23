'use strict';

const rest = require("../../inc/rest");
const common = require("../../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

const commonFuse = require("../commonFuse");
const users = require("./users");
const roles = require("./roles");
const groups = require("./groups");
const projects = require("./projects");
const schemas = require("./schemas");

function resolve(stack) {
  var segment = stack.pop();
  switch (segment) {
    case '':
      return {
        attr: cb => {
          commonFuse.directory(cb);
        },
        list: cb => {
          cb(0, ['users', 'groups', 'roles', 'projects', 'schemas']);
        },
        read: (cb, fd, buf, len, pos) => {
          cb(0);
        }
      }
    case 'users':
      return users.resolve(stack);
    case 'roles':
      return roles.resolve(stack);
    case 'groups':
      return groups.resolve(stack);
    case 'projects':
      return projects.resolve(stack);
    case 'schemas':
      return schemas.resolve(stack);
    default:
      return commonFuse.nil();
  }

}


module.exports = { resolve }
