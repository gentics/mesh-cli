"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cd_1 = require("./commands/cd");
const create_1 = require("./commands/create");
const delete_1 = require("./commands/delete");
const ls_1 = require("./commands/ls");
const project_1 = require("./commands/project");
const projects_1 = require("./commands/projects");
const read_1 = require("./commands/read");
const schema_1 = require("./commands/schema");
const schemas_1 = require("./commands/schemas");
const update_1 = require("./commands/update");
exports.COMMANDS = {
    cd: cd_1.default,
    create: buffered(create_1.default),
    delete: delete_1.default,
    ls: ls_1.default,
    project: project_1.default,
    projects: projects_1.default,
    read: read_1.default,
    schema: schema_1.default,
    schemas: schemas_1.default,
    update: buffered(update_1.default)
};
function buffered(func) {
    return (mesh, line, cmd, state) => __awaiter(this, void 0, void 0, function* () {
        if (!state.buffer.length) {
            return __assign({}, state, { buffer: state.buffer.concat(line) });
        }
        else {
            let s = yield func(mesh, line, cmd, state);
            return __assign({}, s, { buffer: [] });
        }
    });
}
