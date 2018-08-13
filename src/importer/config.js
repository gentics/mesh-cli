//TO DO: move some of the variables to localconfig(.example) where it makes sense

const fs = require('fs');
let fileConfig = {};

if (fs.existsSync(__dirname + '/localconfig.json')) {
  fileConfig = require('./localconfig.json')
}

const envConfig = {
  url: process.env.MESHURL,
  password: process.env.MESHPASSWORD
}
const config = Object.assign({}, stripEmpty(fileConfig), stripEmpty(envConfig));

if (!config.url) {
  throw new Error("Mesh URL not set! Provide a valid url via environment variable MESHURL or local config file in folder mesh-import. Example: http://localhost:8080")
}

if (!config.password) {
  throw new Error("Mesh admin password not set! Provide a password via environment variable MESHPASSWORD or local config file in folder mesh-import.")
}

module.exports = {
    projectName: config.projectName,
    langugage: config.language,
    //tagFamilies: ['type'],
    dataDirectory: __dirname + '/data',
    schemaDirectory: __dirname + '/data/schemas',
    microschemaDirectory: __dirname + '/data/microschemas',
    structureDirectory: __dirname + '/data/nodes',
    mesh: {
        url: `${config.url}/api/v1`,
        user: 'admin',
        password: config.password,
        debug: true
    },
    jsonFileEnding: '.json',
    uuidFunctionNameMap: {
        'microschemas': 'microschemaUuid',
        'schemas': 'schemaUuid'
    },
    meshProjectJsonFile: '.mesh.project.json', // not in use at the moment
    meshNodeJsonFile: '.mesh.node.json'
}


function stripEmpty(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
      delete obj[key]
    }
  })
  return obj
}
