//TO DO: make init more generic and re-add it to import.js if need be
// remove "root-node"-functionality?

const meshWrapper = require('./importer/mesh-api-wrapper');
const config = require.main.require('./config');
// const nodes = require('./nodes')

let rootNodeUuid;

module.exports.init = async function init() {
  console.log("Granting read published permission to anonymous user and publish root node")
  anonUuid$ = anonymousRoleUuid()
  project = await getProject()
  rootNodeUuid = project.rootNode.uuid

  publishNode$ = publishNode(project.rootNode.uuid)
  setAnonPermissions$ = setAnonPermissions(await anonUuid$, project)
  await publishNode$;
  await setAnonPermissions$;

  if (process.argv.indexOf('--nodes') >= 0) {
    await initNodes();
  }
}

async function anonymousRoleUuid() {
  const roles = await meshWrapper.api.roles.get({}, await meshWrapper.getMeshToken())
  return roles.data.filter(role => role.name === 'anonymous')[0].uuid
}

async function getProject() {
  const projects = await meshWrapper.api.projects.get({}, await meshWrapper.getMeshToken())
  return projects.data.filter(it => it.name === config.projectName)[0]
}

async function publishNode(uuid) {
  return meshWrapper.api.project(config.projectName).nodes.nodeUuid(uuid).published.post({}, {}, await meshWrapper.getMeshToken())
}

async function setAnonPermissions(roleUuid, project) {
  return meshWrapper.api.roles.roleUuid(roleUuid).permissions.pathToElement(`projects/${project.uuid}/nodes/${project.rootNode.uuid}`).post({
    permissions: {
      readPublished: true
    },
    recursive: false
  })
}

/**
 * Create some initial nodes if no home node exists
 */
async function initNodes() {
  try {
    await meshWrapper.api.project(config.projectName).webroot.path('/home').get()
  } catch (err) {
    console.log("Node /home not found, intializing some data...")
    // obsolete? -> see structure.js
  }
}

// obsolete? -> see structure.js
async function createInRoot(node) {
  const response = await meshWrapper.api.project(config.projectName).nodes.post(Object.assign({}, node, {
    parentNode: {
      uuid: rootNodeUuid
    }
  }))
  await publishNode(response.uuid)
  return response
}
