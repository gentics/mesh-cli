"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function project(mesh, line, cmd, state) {
    return __awaiter(this, void 0, void 0, function* () {
        let projects = yield mesh.api.projects.get();
        let p = projects.data.filter((p) => p.name === cmd[1]);
        if (p.length === 0) {
            throw new Error('No such project.');
        }
        else {
            let node = yield mesh.api.project(p[0].name).nodes.nodeUuid(p[0].rootNode.uuid).get({ version: 'draft' });
            return Object.assign({}, state, { project: cmd[1], current: node });
        }
    });
}
exports.default = project;
