let FS = require('fs');
let Q = require('q');

const config = require.main.require('./config');
const meshWrapper = require('./mesh-api-wrapper');
const formatJson = require('format-json-pretty');

/*
const Slack = require('slack-node');
const SLACK_WEBHOOK_URI = process.env.SLACK_WEBHOOK_URI;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
let slack;

if (SLACK_WEBHOOK_URI && SLACK_CHANNEL) {
  slack = new Slack();
  slack.setWebhook(SLACK_WEBHOOK_URI);
} else {
  console.error('Process environment variables SLACK_WEBHOOK_URI and/or SLACK_CHANNEL are missing!');
}
*/

let slack = false;


async function updateExisting(type, name, existingSchema) {
  const schemaFile = await readSchemaFile(type, name);
  const uuidFunction = config.uuidFunctionNameMap[type];
  return meshWrapper.api[type][uuidFunction](existingSchema.uuid).post(schemaFile, {}, await meshWrapper.getMeshToken()).then((data) => {
    if (process.env.NODE_ENV === 'development' || data.message === 'Migration was not invoked. No changes were detected.') {
      // Log to console if no migration is required.
      console.log(`[${type}]:${name} - ${data.message}`);
    } else {
      existingSchema = {
        name: existingSchema.name,
        description: existingSchema.description,
        fields: existingSchema.fields
      };

      // Check if slack is available.
      if (slack) {
        // Notify slack about migrations.
        slack.webhook({
          channel: SLACK_CHANNEL,
          username: 'mesh-importer',
          text: `Message: ${data.message} \n Type: ${type} \n Name: ${name} \n Environment: ${process.env.MESHURL}`,
          attachments: [{
            fallback: 'Difference between old and new schema file',
            color: '#36a64f',
            text: 'Difference between schema files:',
            fields: [{
              title: 'Old schema',
              value: formatJson(existingSchema),
              short: true
            }, {
              title: 'New schema',
              value: formatJson(schemaFile),
              short: true
            }]
          }]
        }, (err, response) => {
          if (err) {
            console.error(err);
          }
        });
      } else {
        console.log(`[${type}]:${name} - ${data.message}`);
      }
    }
  });
}

async function createNew(type, name) {
  const schemaFile = await readSchemaFile(type, name);
  return meshWrapper.api[type].post(schemaFile, {}, await meshWrapper.getMeshToken()).then((data) => {
    // Check if slack is available and post not in development mode..
    if (process.env.NODE_ENV !== 'development' && slack) {
      // Notify slack about migrations.
      slack.webhook({
        channel: SLACK_CHANNEL,
        username: 'mesh-importer',
        text: 'Message: Schema has been created. \n Type: ' + type + '\n Name: ' + name + ' \n Environment: ' + process.env.MESHURL + ' \n Data: ```' + formatJson(data) + '```'
      }, (err, response) => {
        if (err) {
          console.error(err);
        }
      });
    } else {
      console.log(`[${type}]:${name} - Schema has been added.`);
    }
  });
}

async function readSchemaFile(type, name) {
  const data = await Q.nfcall(FS.readFile, getSchemaDir(type) + name + config.jsonFileEnding, 'utf-8');
  return JSON.parse(data);
}

function getSchemaDir(type) {
  return config.dataDirectory + '/' + type + '/';
}

async function getMeshSchemas(type) {
  const result = await meshWrapper.api[type].get({}, await meshWrapper.getMeshToken());
  const schemaMap = {};
  result.data.forEach(schema => schemaMap[schema.name] = schema);
  return schemaMap;
}

async function getLocalSchemaNames(type) {
  const files = await Q.nfcall(FS.readdir, getSchemaDir(type));
  return files.filter(fileName => fileName.endsWith(config.jsonFileEnding))
    .map(fileName => fileName.substr(0, fileName.length - config.jsonFileEnding.length));
}

async function updateSchemas(type) {
  console.log('Update ' + type);
  let [schemaMap, schemaNames] = await Promise.all([getMeshSchemas(type), getLocalSchemaNames(type)]);
  for (name of schemaNames) {
    if (schemaMap[name]) {
      console.log('Schema "' + name + '" already exists so we need to update it.');
      await updateExisting(type, name, schemaMap[name])
    } else {
      console.log('Schema "' + name + '" does not exist so we create it.');
      await createNew(type, name);
    }
  }
}

exports.updateSchemas = updateSchemas;
exports.getMeshSchemas = getMeshSchemas;
