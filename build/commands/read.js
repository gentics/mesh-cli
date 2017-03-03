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
function read(cmd, state, mesh) {
    return __awaiter(this, void 0, void 0, function* () {
        let uuid = cmd.params.length ? cmd.params[0] : state.current.uuid;
        let node = yield mesh.api.project(state.project).nodes.nodeUuid(uuid).get({ version: 'draft', lang: state.lang });
        console.log(JSON.stringify(node, null, 4));
        return state;
    });
}
exports.read = read;
//# sourceMappingURL=read.js.map