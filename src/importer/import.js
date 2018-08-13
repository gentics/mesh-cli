const meshWrapper = require('./app/importer/mesh-api-wrapper');
const schema = require('./app/importer/schema');
const project = require('./app/importer/project');
const structure = require('./app/importer/structure');
// const tagFamilies = require('./app/importer/tagFamilies')
const init = require('./app/init');
(async () => {
    try {
        await schema.updateSchemas('microschemas');
        await schema.updateSchemas('schemas');
        await project.updateProjects();

        /**
         * EXPLENATION why we call the following function 2 times:
         * 
         * In theory we would need to traverse our existing structure two times to fully recrate our project:
         * 1) once to create all necessary nodes
         * 2) and a second time to set all the references between those nodes (e.g. fields from type "List of nodes").
         * 
         * As of now, when we send an update/create call to Mesh that contains references to nodes that do not exist (yet)
         * Mesh simply omits the uuid of the non-existing nodes but continues to create/update the node without responding with an error.
         * This behaviour makes things simpler for us now but might change in the future.
         * 
         * So after the first call to "updateStructure" all Nodes should exist, although some of the references may be broken (depending on the creation order)
         * In the second call we simply update all nodes so the nodes that contain references can now correctly be udpated by Mesh.
         * This is somewhat naive and not the most efficient way to go but works for now.
         * 
         * So this brings us to the TODOs:
         * 1) change the first call to create/update all nodes BUT OMIT all referencing fields 
         * (since Mesh might respond with an Error when creating references to non-existing nodes some time in the future)
         * 2) change the second call to only update the necessary nodes that contain references
         */
        await structure.updateStructure();
        // call a second time (see explanation above)
        await structure.updateStructure();
        // await tagFamilies.updateTagFamilies();

        //TO DO: make init generic 
        //await init.init();

    } catch(err) {
        console.error('Error encountered');
        console.error(err);
    }
})();
