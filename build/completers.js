"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_1 = require("./completers/default");
const nodechildren_1 = require("./completers/nodechildren");
let defaultNodeChildrenQuery = (state, mesh) => mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children;
let uuidReducer = (prev, node) => prev.concat(node.uuid);
const COMPLETERS = {
    defaultCompleter: default_1.defaultCompleter,
    cd: nodechildren_1.nodeChildrenCompleter(defaultNodeChildrenQuery, (node, cmd) => node.container && node.uuid.indexOf(cmd[1]) === 0, uuidReducer),
    delete: nodechildren_1.nodeChildrenCompleter(defaultNodeChildrenQuery, (node, cmd) => node.uuid.indexOf(cmd[1]) === 0, uuidReducer),
    project: nodechildren_1.nodeChildrenCompleter((state, mesh) => mesh.api.projects, (node, cmd) => node.name.indexOf(cmd[1]) === 0, (prev, node) => prev.concat(node.name)),
    read: nodechildren_1.nodeChildrenCompleter(defaultNodeChildrenQuery, (node, cmd) => node.uuid.indexOf(cmd[1]) === 0, uuidReducer),
    schema: nodechildren_1.nodeChildrenCompleter((state, mesh) => mesh.api.project(state.project).schemas, (node, cmd) => node.uuid.indexOf(cmd[1]) === 0, uuidReducer)
};
function complete(mesh, state, line, callback) {
    let cmd = line.split(' ');
    if (COMPLETERS[cmd[0]]) {
        COMPLETERS[cmd[0]](mesh, line, cmd, state)
            .then((result) => {
            callback(null, result);
        }).catch((err) => {
            callback(err, [[], line]);
        });
    }
    else {
        COMPLETERS['defaultCompleter'](mesh, line, cmd, state).then((result) => {
            callback(null, result);
        }).catch((err) => {
            callback(err, [[], line]);
        });
    }
}
exports.complete = complete;
//# sourceMappingURL=completers.js.map