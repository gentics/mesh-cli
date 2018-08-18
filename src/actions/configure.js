'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const rest = require("../inc/rest");
const config = require("../inc/config");
const common = require("../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;

const cfg = config.get();

function configure() {
  checkEndpoint().then(a => checkGenNewKey());
}

function checkEndpoint() {

  var endpointValue = "http://localhost:8080";
  if (cfg.server && cfg.server.endpoint) {
    endpointValue = cfg.server.endpoint;
  }
  return inquirer.prompt([{
    name: 'endpoint',
    type: 'input',
    default: endpointValue,
    message: 'Endpoint'
  }]).then(answer => {
    var endpoint = answer.endpoint;
    if (endpoint === 'undefined' || endpoint == '') {
      error("Invalid endpoint.");
    } else {
      config.storeEndpoint(answer.endpoint);
    }
  });
}

function checkGenNewKey() {
  inquirer.prompt([{
    name: 'input',
    type: 'confirm',
    message: 'Generate a new API key?'
  }]).then(answer => {
    if (answer.input) {
      genNewKey();
    } else {
      promptKey();
    }
  });
}

function genNewKey() {
  inquirer.prompt([
    {
      name: 'username',
      type: 'input',
      default: 'admin',
      message: 'Enter username'
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter password'
    }]).then(answers => {
      gen(answers.username, answers.password);
    });
}

function promptKey() {
  inquirer.prompt([{
    name: 'key',
    type: 'password',
    message: 'API Key'
  }]).then(answers => {
    var key = answers.key;
    if (key === 'undefined' || key == "") {
      error("Invalid key");
    } else {
      config.storeKey(key);
      log("key saved");
    }
  });
}

function register() {
  program
    .command("configure")
    .description("Configure the CLI")
    .action(configure);
}

/**
 * Login mesh and generate a new api token.
 * 
 * @param {string} username 
 * @param {string} password 
 */
function gen(username, password) {
  rest.login(username, password).end(loginResponse => {
    if (rest.check(loginResponse, 200, "Login failed")) {
      config.storeKey(loginResponse.body.token);
      rest.get("/api/v1/auth/me").end(meResponse => {
        if (rest.check(meResponse, 200, "Could not load user information")) {
          var id = meResponse.body.uuid;
          rest.post("/api/v1/users/" + id + "/token").end(response => {
            if (rest.check(response, 201, "Could not generate API token")) {
              config.storeKey(response.body.token);
              log("New key saved");
            }
          });
        }
      });
    }
  });
}


module.exports = { register }
