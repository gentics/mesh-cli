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
function cd(mesh, line, cmd, state) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cmd[1] === '..') {
            let parent = yield mesh.api.project(state.project).nodes.nodeUuid(state.current.parentNode.uuid).get({ version: 'draft' });
            return Object.assign({}, state, { current: parent });
        }
        else {
            let nodes = yield mesh.api.project(state.project).nodes.nodeUuid(state.current.uuid).children.get({ version: 'draft' });
            let found = nodes.data.filter((val) => {
                return val.container && (val.uuid === cmd[1] || val.fields.name === cmd[1]);
            });
            if (found.length === 1) {
                return Object.assign({}, state, { current: found[0] });
            }
            else {
                return state;
            }
        }
    });
}
exports.default = cd;
