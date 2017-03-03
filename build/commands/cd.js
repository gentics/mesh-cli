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
function cd(cmd, state, mesh) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = { version: 'draft', lang: state.lang, resolveLinks: 'short' };
        if (cmd.params[0] === '..') {
            if (state.current && state.current.parentNode) {
                let parent = yield mesh.api
                    .project(state.project).nodes
                    .nodeUuid(state.current.parentNode.uuid)
                    .get(opts);
                return Object.assign({}, state, { current: parent });
            }
            else {
                return state;
            }
        }
        else {
            let nodes = yield mesh.api.project(state.project).nodes
                .nodeUuid(state.current.uuid)
                .children.get(opts);
            let found = nodes.data.filter((val) => {
                return val.container && (val.uuid === cmd.params[0] || val.fields.name === cmd.params[0]);
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
exports.cd = cd;
//# sourceMappingURL=cd.js.map