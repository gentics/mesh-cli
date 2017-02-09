"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function projects(mesh, line, cmd, state) {
    return __awaiter(this, void 0, void 0, function* () {
        let projects = yield mesh.api.projects.get();
        projects.data.reduce((out, p) => {
            return `${out} ${p.name}`;
        }, '');
        return state;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = projects;
