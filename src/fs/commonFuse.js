'use strict';

const fuse = require('fuse-bindings');
const rest = require("../inc/rest");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

function directory(cb) {
  console.log("Returning directory attr");
  cb(0, {
    mtime: new Date(),
    atime: new Date(),
    ctime: new Date(),
    nlink: 1,
    size: 1000,
    mode: 16877,
    uid: process.getuid ? process.getuid() : 0,
    gid: process.getgid ? process.getgid() : 0
  });
}

function file(cb) {
  console.log("Returning file attr");
  cb(0, {
    mtime: new Date(),
    atime: new Date(),
    ctime: new Date(),
    nlink: 1,
    size: 100000,
    mode: 33188,
    uid: process.getuid ? process.getuid() : 0,
    gid: process.getgid ? process.getgid() : 0
  });
}

function nil() {
  console.log("Returning nil");
  return {
    attr: cb => {
      cb(fuse.ENOENT);
    },
    list: cb => {
      cb(0);
    },
    read: cb => {
      cb(0);
    }
  }
}


function list(path, cb) {
  rest.get(path).end(r => {
    if (rest.check(r, 200, "Could not list elements for path " + path)) {
      var json = r.body;
      var names = new Array();
      json.data.forEach((element) => {
        names.push(element.username || element.name || element.uuid);
      });
      cb(null, names);
    }
  });
}

module.exports = { directory, file, list, nil }