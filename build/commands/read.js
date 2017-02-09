"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function read(mesh, line, cmd, state) {
    return __awaiter(this, void 0, void 0, function* () {
        let uuid = cmd.length === 1 ? state.current.uuid : cmd[1];
        let node = yield mesh.api.project(state.project).nodes.nodeUuid(uuid).get({ version: 'draft' });
        console.log(JSON.stringify(node, null, 4));
        return state;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = read;
