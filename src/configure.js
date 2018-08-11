'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const debug = require("debug");
const rest = require("./rest");
const config = require("./config");
const cfg = config.get();

function configure() {
  checkEndpoint().then(a => checkGenNewKey());
}

function checkEndpoint() {
  var endpointValue = cfg.server.endpoint || "http://localhost:8080";
  return inquirer.prompt([{
    name: 'endpoint',
    type: 'input',
    default: endpointValue,
    message: 'Endpoint'
  }]).then(answer => {
    var endpoint = answer.endpoint;
    if (endpoint === 'undefined' || endpoint == '') {
      console.error("Invalid endpoint.");
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
      log.error("Invalid key");
    } else {
      config.storeKey(key);
    }
  });
}

function register() {
  program
    .command("configure")
    .alias("config")
    .description("Configure the CLI")
    .action(configure);
}

/**
 * Login mesh and generate a new api token
 * @param {string} username 
 * @param {string} password 
 */
function gen(username, password) {
  var body = { "username": username, "password": password };
  rest.post("/api/v1/auth/login", body)
    .end(loginResponse => {
      debug("Response:", loginResponse.body);
      config.storeKey(loginResponse.body.token);
      rest.get("/api/v1/auth/me").end(meResponse => {
        debug("Response:", meResponse.body);
        var id = meResponse.body.uuid;
        rest.post("/api/v1/users/" + id + "/token").end(response => {
          debug("Response:", response.body);
          config.storeKey(response.body.token);
        });
      })
    });
}


module.exports = { register }
