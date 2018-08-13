//CONSIDER: renaming this file to something like "nodes.js"?
// I refrained from this since it may lead to confusion with "node.js"
// - mo

const FS = require('fs');
const Q = require('q');

const meshWrapper = require('./mesh-api-wrapper');
const schema = require('./schema');
const config = require.main.require('./config');

/**
 * not in use at the moment
 * can maybe be used in the future to init multiple projects
 */
async function getLocalProjects() {
	const dirs = await Q.nfcall(FS.readdir, config.structureDirectory);
	const promises = [];
	dirs.forEach(dirName => {
		if (FS.lstatSync(config.structureDirectory + '/' + dirName).isDirectory()) {
			// promises.push(getLocalProjectFile(dirName));
			promises.push(dirName);
		}
	});
	const allDirs = await Q.allSettled(promises);
	const localProjectsMap = [];
	allDirs.forEach(dirStatus => {
		if (dirStatus.state === 'fulfilled') {
			localProjectsMap.push(dirStatus.value);
		}
	})
	return localProjectsMap;
}


/**
 * Read a local file from the configured data-directory.
 * Before we read we check if we are allowed to read. The
 * file will retrieved as 'utf-8' and parsed as JSON.
 * 
 * @return the JSON parsed file data
 */
function getLocalFile(fileName) {
	// console.log('__||||getLocalFile was called for file [' + fileName + ']')
	const localFilenName = config.structureDirectory + '/' + config.projectName + '/' + fileName;
	try {
		FS.accessSync(localFilenName, FS.constants.R_OK);
	} catch (err) {
		console.error('Some error occured when trying to access ' + localFilenName + '.');
		console.error(err);
	}
	const data = FS.readFileSync(localFilenName, 'utf-8');
	return JSON.parse(data);
}


function getLocalNodesInDirectory(relativePath) {
	const path = config.structureDirectory + '/' + config.projectName + '/' + relativePath;

	let files = [];
	files = FS.readdirSync(path)
		.filter(fileName => fileName.endsWith(config.jsonFileEnding) && fileName !== config.meshProjectJsonFile && fileName !== config.meshNodeJsonFile)
		.map(file => getLocalFile(relativePath + '/' + file));

	return files
}

function getLocalFolders(relativePath) {
	const path = config.structureDirectory + '/' + config.projectName + '/' + relativePath;
	let dirs = [];

	FS.readdirSync(path).forEach(file => {
		if (FS.lstatSync(path + '/' + file).isDirectory()) {
			// on the first call we don't want to add an unnecessary slash
			if(relativePath == ""){
				dirs.push(relativePath + file);
			}else{
				dirs.push(relativePath + '/' + file);
			}
		}
	});

	return dirs;
}

async function getMeshNodeFromProject(projectName, webrootPath) {
	const projectApi = meshWrapper.api.project(projectName);
	return await projectApi.webroot.path(webrootPath).get({
		lang: config.langugage
	});
}

async function publishNode(projectApi, meshNode) {
	return await projectApi.nodes.nodeUuid(meshNode.uuid).published.post({}, {});
}

async function updateMeshNode(meshNode, localNode) {
	console.log("Updating Node with uuid ["+localNode.uuid+"]")
	const projectApi = meshWrapper.api.project(meshNode.project.name);
	localNode.version = meshNode.version;
	meshNode = await projectApi.nodes.nodeUuid(meshNode.uuid).post(localNode, {});
	await publishNode(projectApi, meshNode);
	return meshNode;
}

async function createMeshNode(parentUuid, localNode) {
	console.log("creating node and attaching to parent with uuid:["+parentUuid+"]");
	const projectApi = meshWrapper.api.project(config.projectName);

	localNode.parentNode = {
		uuid: parentUuid
	};
	try {
		const meshNode = await projectApi.nodes.nodeUuid(localNode.uuid).post(localNode, {});
		await publishNode(projectApi, meshNode);
		return await meshNode;
	} catch (err) {
		console.error(err)
	}
}

function getWebRootPathFromNode(localNode, meshSchemas) {
	let path = '(no webroot path found)';
	try {
		if (localNode.fields[meshSchemas[localNode.schema.name].segmentField]) {
			path = localNode.fields[meshSchemas[localNode.schema.name].segmentField];
		}
		return path;
	} catch (err) {
		console.error(err);
	}
}

// Consider: do we need the "isContainer" Flag? We could get this information from the "localNode" ...
async function createOrUpdateMeshNode(relativePath, localNode, meshSchemas, isContainer = false) {

	if (!localNode.schema.name && !meshSchemas[localNode.schema.name]) {
		throw new Error('No schema configured for node or schema not found in mesh');
	}
	const schema = meshSchemas[localNode.schema.name];
	localNode.schema.uuid = schema.uuid;
	// always use the newest versions of schemas for imported nodes
	localNode.schema.version = schema.version;
	if (!schema.segmentField && !localNode.fields[schema.segmentField]) {
		throw new Error('No segment field defined in schema or segment field not set on node.')
	}
	let webrootPath = relativePath;
	if (isContainer) {
		try {
			//check for mismatch (we expect that the last part of the relative path to be exactly the webRootpath)
			if (getWebRootPathFromNode(localNode, meshSchemas) != relativePath.split("/").pop()) {
				throw new Error("There seems to be a mismatch between the name of the folder and the name in the corresponding .mesh.node.json-File!");
			}
		} catch (err) {
			console.error(err);
		}
	} else {
		webrootPath = relativePath + '/' + getWebRootPathFromNode(localNode, meshSchemas);
	}

	console.log(" Updating or Creating Node [" + webrootPath + "]");

	let meshNode;
	try {
		meshNode = await getMeshNodeFromProject(config.projectName, webrootPath);
	} catch (err) {
		console.info("\n// Not to worry! The following message is only feedback that this mesh node does not YET exist.");
		console.info(err);
		console.info("// Check done, we now know we need to create this node!\n");
	}
	if (!meshNode) {
		let parentPath = relativePath;
		if(isContainer){
			let tmpA = relativePath.split("/");
			tmpA = tmpA.slice(0,tmpA.length-1);
			parentPath = tmpA.join("/");
		}

		const parent = await meshWrapper.api.project(config.projectName).webroot.path(parentPath).get({
				lang: config.langugage
			});
		parentUuid = parent.uuid;
		return await createMeshNode(parentUuid, localNode);
	}
	if (meshNode.schema.name !== localNode.schema.name) {
		throw new Error('Schemas of local node and node in mesh don\'t match.');
	}
	return await updateMeshNode(meshNode, localNode);
}

async function createOrUpdateContainerNode(project, relativePath, meshSchemas) {
	console.log("\n+ Updating or Creating Container-Node [" + relativePath + "]");

	//create or update the corresponding container-node in the Mesh-CR
	const localContainer = getLocalFile(relativePath + '/' + config.meshNodeJsonFile);
	const containerNode = await createOrUpdateMeshNode(relativePath, localContainer, meshSchemas, true);

	// get all json-files inside the current folder
	const subNodes = getLocalNodesInDirectory(relativePath);

	// foreach json-file:
	subNodePromises = subNodes.map(localNode =>
		createOrUpdateMeshNode(relativePath, localNode, meshSchemas).catch(err => {
			console.error('Error while updating node ' + getWebRootPathFromNode(localNode, meshSchemas) + ' for project ' + project);
			throw err;
		})
	);

	// get all subdirectories
	const subDirs = getLocalFolders(relativePath);
	
	// foreach subdir:
	subDirPromises = subDirs.map(localNode =>
		createOrUpdateContainerNode(project, localNode, meshSchemas).catch(err => {
			console.error('Error while updating node ' + getWebRootPathFromNode(localNode, meshSchemas) + ' in relative path ' + project);
			throw err;
		})
	);

	return Promise.all([...subNodePromises,...subDirPromises] );
}

async function updateProjectRootNode(projectName) {
	console.log('\n\nStart to update nodes for project "' + projectName + '".');
	const [localNodes, localContainerNodes, meshSchemas] = await Promise.all([
		getLocalNodesInDirectory(''),
		getLocalFolders(''),
		schema.getMeshSchemas('schemas')
	]);

	localNodesPromises = localNodes.map(localNode =>
		createOrUpdateMeshNode(projectName, localNode, meshSchemas).catch(err => {
			console.error('Error while updating node ' + getWebRootPathFromNode(localNode, meshSchemas) + ' for project ' + projectName);
			throw err;
		})
	);

	localContainerNodesPromises = localContainerNodes.map(localContainerNode =>
		createOrUpdateContainerNode(projectName, localContainerNode, meshSchemas).catch(err => {
			console.error('Error while updating node ' + localContainerNode + ' for project ' + projectName);
			throw err;
		})
	);

	await Promise.all([...localNodesPromises, ...localContainerNodesPromises]);
}

//MAIN:

/**
 * Create and update nodes for projects. Currently
 * only nodes directly in the root node can be updated.
 * TODO: UPDATE THIS AND OTHER COMMENTS
 * 
 * @return a promise which is resolved when all nodes have been created or updated.
 */
async function updateStructure() {
	// should we one day want to import multiple projects at once use getLocalProjects for a list of all folders in data/nodes/
	await updateProjectRootNode(config.projectName);
}

exports.updateStructure = updateStructure;