'use strict';

const fuse = require('fuse-bindings');
const rest = require("../inc/rest");
const root = require("./resolver/root");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;
const Stack = require('stackjs');

function toStack(path) {
  debug("Transforming path: " + path);
  var stack = new Stack();
  var segments = path.split("/");
  for (var i = segments.length - 1; i > 0; i--) {
    stack.push(segments[i]);
  }
  console.dir(stack);
  return stack;
}

function resolve(path) {
  var stack = toStack(path);
  return root.resolve(stack);
}

function mount(mountPath, options) {
  if (process.platform != 'linux') {
    error("Currently only linux is supported for mesh filesystem.");
    process.exit(10);
  }


  fuse.mount(mountPath, {
    readdir: function (path, cb) {
      console.log('readdir(%s)', path)
      var result = resolve(path);
      if (result) {
        result.list(cb);
      } else {
        cb(0);
      }
    },
    getattr: function (path, cb) {
      console.log('getattr(%s)', path)
      var result = resolve(path);
      if (result) {
        result.attr(cb);
      } else {
        cb(fuse.ENOENT);
      }
    },
    open: function (path, flags, cb) {
      console.log('open(%s, %d)', path, flags)
      cb(0, 42) // 42 is an fd
      /*
      var result = resolve(path);
      if (result) {
      } else {
      }
      */

    },
    read: function (path, fd, buf, len, pos, cb) {
      var result = resolve(path);
      if (result) {
        result.read(cb, fd, buf, len, pos, cb);
      } else {
        cb(0);
      }

      /*
      console.log('read(%s, %d, %d, %d)', path, fd, len, pos)
      var str = 'hello world\n'.slice(pos, pos + len)
      if (!str) return cb(0)
      buf.write(str)
      return cb(str.length)
      */
    }
  }, function (err) {
    if (err) throw err
    console.log('filesystem mounted on ' + mountPath)
  })

  process.on('SIGINT', function () {
    fuse.unmount(mountPath, function (err) {
      if (err) {
        console.log('filesystem at ' + mountPath + ' not unmounted', err)
      } else {
        console.log('filesystem at ' + mountPath + ' unmounted')
      }
    })
  })
}

module.exports = { mount }
