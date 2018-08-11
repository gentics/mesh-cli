'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const homeConfig = require('home-config');
const homedir = require('os').homedir();
const path = require('path');
const unirest = require('unirest');

const dirName = '.genticsmesh';
const cfg = loadConfig();

function loadConfig() {
  const fs = require('fs');
  const confDir = path.join(homedir, dirName);
  if (!fs.existsSync(confDir)) {
    fs.mkdirSync(confDir);
  }
  return homeConfig.load(dirName + '/config');
}

function config() {
  checkEndpoint().then(a => checkGenNewKey());
}

function checkEndpoint() {
  return inquirer.prompt([{
    name: 'endpoint',
    type: 'input',
    default: "http://localhost:8080",
    message: 'Endpoint'
  }]).then(answer => {
    var endpoint = answer.endpoint;
    if (endpoint === 'undefined' || endpoint == '') {
      console.error("Invalid endpoint.");
    } else {
      storeEndpoint(answer.endpoint);
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
      storeKey(key);
    }
  });
}

function register() {
  program
    .command("configure")
    .alias("config")
    .description("Configure the CLI")
    .action(config);
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

function gen(username, password) {
  var u = unirest.post('http://localhost:8888/api/v1/auth/login')
    .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
    .send({ "username": username, "password": password })
    .end(function (response) {
      storeKey(response.body.token);
    });
}


module.exports = { register }
