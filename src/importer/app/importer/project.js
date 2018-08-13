const FS = require('fs');
const Q = require('q');

const meshWrapper = require('./mesh-api-wrapper');
const schema = require('./schema');
const config = require.main.require('./config');

async function getMeshProjects() {
    const result = await meshWrapper.api.projects.get({}, await meshWrapper.getMeshToken());
    const projectMap = {};
    result.data.forEach(project => {
        projectMap[project.name] = project;
    });
    return projectMap;
}

// TODO: Seems like this links ALL schemas to the new project.
// is this intended? If not: e.g. link only the schemas that are also locally available
async function updateSchemaRelationForType(type, meshProject, projectName, meshSchemas) {
    console.log('Update configured relations for ' + type + '.')
    const token = await meshWrapper.getMeshToken();
    const apiProject = meshWrapper.api.project(projectName);
    for (schemaName of Object.keys(meshSchemas)) {
        const schemaUuid = meshSchemas[schemaName]['uuid'];
        const schemaFnName = config.uuidFunctionNameMap[type];
        await apiProject[type][schemaFnName](schemaUuid).post({}, {}, token)
    };
}

async function updateSchemaRelation(meshProject, projectName, allSchemas) {
    await updateSchemaRelationForType('microschemas', meshProject, projectName, allSchemas['microschemas']);
    await updateSchemaRelationForType('schemas', meshProject, projectName, allSchemas['schemas']);
}

async function createMeshProject(projectName, meshSchemas) {
    const createProjectPayload = {
        name: projectName,
        rootNode: { uuid: ""},
        schema: {
            name: "folder"
        }
    };
    const meshProject = await meshWrapper.api.projects.post(createProjectPayload, {}, await meshWrapper.getMeshToken());
    return updateSchemaRelation(meshProject, projectName, meshSchemas);
}


async function updateProjects() {
    const projectName = config.projectName
    console.log('Start to update Project');
    const [meshProjects, meshMicroSchemas, meshSchemas, localProjects] = await Promise.all([
            getMeshProjects(),
            schema.getMeshSchemas('microschemas'),
            schema.getMeshSchemas('schemas'),
        ]);
    let promise;
    const schemas = {
        schemas: meshSchemas,
        microschemas: meshMicroSchemas
    };
    if (meshProjects[projectName]) {
        console.log('Project "' + projectName + '" exists so we just update the schema relations');
        promise = updateSchemaRelation(meshProjects[projectName], projectName, schemas)
    } else {
        console.log('Project "' + projectName + '" does not exist so we create it and add the schema relations');
        promise = createMeshProject(projectName, schemas);
    }
    return promise;
}

exports.updateProjects = updateProjects;
// exports.getLocalProjects = getLocalProjects;