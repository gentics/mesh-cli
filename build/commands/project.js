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
function project(mesh, line, cmd, state) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let projects = yield mesh.api.projects.get();
            let p = projects.data.filter((p) => p.name === cmd[1]);
            if (p.length === 0) {
                reject('No such project.');
            }
            else {
                mesh.api.project(p[0].name).nodes.nodeUuid(p[0].rootNodeUuid).get({ version: 'draft' })
                    .then((node) => {
                    resolve(__assign({}, state, { project: cmd[1], current: node }));
                })
                    .catch((e) => {
                    reject(e);
                });
            }
        }));
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = project;
