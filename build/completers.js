"use strict";
const default_1 = require("./completers/default");
const nodechildren_1 = require("./completers/nodechildren");
let defaultNodeChildrenQuery = (state, mesh) => mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children;
let uuidReducer = (prev, node) => prev.concat(node.uuid);
exports.COMPLETERS = {
    defaultCompleter: default_1.default,
    cd: nodechildren_1.default(defaultNodeChildrenQuery, (node, cmd) => node.container && (node.uuid.indexOf(cmd[1]) === 0 || node.fields.name.indexOf(cmd[1]) === 0), uuidReducer),
    delete: nodechildren_1.default(defaultNodeChildrenQuery, (node, cmd) => node.uuid.indexOf(cmd[1]) === 0, uuidReducer),
    project: nodechildren_1.default((state, mesh) => mesh.api.projects, (node, cmd) => node.name.indexOf(cmd[1]) === 0, (prev, node) => prev.concat(node.name)),
    read: nodechildren_1.default(defaultNodeChildrenQuery, (node, cmd) => node.uuid.indexOf(cmd[1]) === 0, uuidReducer),
    schema: nodechildren_1.default((state, mesh) => mesh.api.project(state.project).schemas, (node, cmd) => node.uuid.indexOf(cmd[1]) === 0, uuidReducer)
};
