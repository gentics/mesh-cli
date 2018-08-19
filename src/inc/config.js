'use strict';

const program = require('commander');
const homeConfig = require('home-config');
const homedir = require('os').homedir();
const path = require('path');
const fs = require('fs');

const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;


const dirName = '.genticsmesh';
const cfg = loadConfig();

function loadConfig() {
  const confDir = path.join(homedir, dirName);
  if (!fs.existsSync(confDir)) {
    fs.mkdirSync(confDir);
  }
  return homeConfig.load(dirName + '/config');
}

function storeEndpoint(endpoint) {
  cfg.server = {
    endpoint: endpoint
  };
  cfg.save();
}

function storeKey(key) {
  cfg.auth = {
    key: key
  };
  cfg.save();
}

function get() {
  if (program.endpoint) {
    debug("Found endpoint option: " + program.endpoint)
    if (!cfg.server) {
      cfg.server = {};
    }
    cfg.server.endpoint = program.endpoint;
  }
  return cfg;
}

module.exports = { get, storeKey, storeEndpoint }
