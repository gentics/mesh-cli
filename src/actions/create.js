const util = require('util');
const pathUtil = require('path');
const downloadGitRepo = util.promisify(require('download-git-repo'));
const R = require('ramda');
const fs = require('fs-extra');
const chalk = require('chalk').default;
const spawn = require('cross-spawn');
const inquirer = require('inquirer');

const common = require("../inc/common");
const log = common.log;
const error = common.error;

// See https://www.npmjs.com/package/download-git-repo for docs on repo strings
// name and value entries are required for inquirer
const templates = {
  'react-app': {
    name: 'React App', 
    value: 'react-app',
    repo: 'github:gentics/mesh-react-template#master'
  }
}

async function create(params) {
  const { templateName, appName, url } = await readParams(params);
  const template = templates[templateName];
  const fullPath = pathUtil.resolve(appName);
  log('');
  if (!await checkTargetFolder(fullPath)) {
    error(`The directory ${chalk.green(appName)} already exists and is not empty. Please choose another name or remove the existing folder.`)
    return;
  }
  log(`Creating a new Gentics Mesh ${templateName} in ${chalk.green(fullPath)}.`)
  log('');
  await downloadGitRepo(template.repo, appName, {});
  await configureApp(fullPath, appName, url);
  await install(fullPath);
  endMessage(appName, fullPath);
}

async function readParams(params) {
  return inquirer.prompt([
    {
      message: 'What kind of app do you want to create?',
      name: 'templateName',
      type: 'list',
      choices: R.values(templates),
      default: 'react-app'
    },
    {
      message: 'Please enter the name of your app',
      name: 'appName',
      type: 'input',
      default: 'mesh-app'
    },
    {
      message: 'Please enter the URL to your Gentics Mesh instance',
      name: 'url',
      type: 'input',
      default: 'https://demo.getmesh.io'
    },
  ]);
}

async function checkTargetFolder(fullPath) {
  try {
    const content = await fs.readdir(fullPath);
    return content.length === 0;
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Everything is fine if the folder does not exist
      return true;
    } else {
      throw err;
    }
  }
}

async function configureApp(path, name, proxyUrl) {
  const packagePath = pathUtil.join(path, 'package.json')
  const package = await fs.readJSON(packagePath);
  package.proxy = proxyUrl;
  package.name = name;
  await fs.writeJson(packagePath, package);
}

async function install(path) {
  log('Installing packages. This might take a couple of minutes.');
  await runCommand(path, 'npm', ['install']);
}

function runCommand(cwd, command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd
    });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  })
}

function endMessage(name, fullPath) {
  log(`Success! Created ${chalk.green(name)} at ${chalk.green(fullPath)}

We suggest that you begin by typing:
  
  ${chalk.cyan('cd')} ${chalk.green(name)}
  ${chalk.cyan('npm start')}
  
Inside that directory you can run several commands:

${chalk.cyan('npm start')}
  Starts the development server.

${chalk.cyan('npm build')}
  Bundles the app into static files for production.

${chalk.cyan('npm test')}
  Starts the test runner.

${chalk.cyan('npm eject')}
  Removes this tool and copies build dependencies, configuration files
  and scripts into the app directory. If you do this, you can’t go back!

Have fun with Gentics Mesh!`)
  
}

module.exports = {create}