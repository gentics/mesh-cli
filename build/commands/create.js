"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
function create(mesh, line, cmd, state) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (cmd[1] === 'node') {
                let data = JSON.parse(line.substr(line.indexOf('{')));
                mesh.api.project(state.project).nodes.post(data)
                    .then((msg) => {
                    console.log(msg);
                    resolve(state);
                })
                    .catch((e) => {
                    reject(e);
                });
            }
            else {
                reject('Unknown operation ' + cmd[1]);
            }
        }));
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = create;
