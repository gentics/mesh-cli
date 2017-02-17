"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function update(mesh, line, cmd, state) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!state.project)
            throw (new Error('Cannot create without an active project.'));
        let input = state.buffer.join('\n');
        let data = JSON.parse(input.substr(input.indexOf('{')));
        let msg = yield mesh.api.project(state.project).nodes.nodeUuid(data.uuid).post(data);
        console.log(msg);
        return state;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = update;
