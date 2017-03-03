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
let table = require('text-table');
function schemas(cmd, state, mesh) {
    return __awaiter(this, void 0, void 0, function* () {
        let schemas = yield mesh.api.project(state.project).schemas.get();
        let data = schemas.data.reduce((out, schema) => {
            out.push([
                schema.uuid,
                schema.name,
                schema.displayField || '-',
                schema.segmentField || '-',
                schema.container ? 'true' : 'false'
            ]);
            return out;
        }, [['uuid', 'name', 'displayField', 'segmentField', 'container']]);
        console.log(table(data), '\n');
        return state;
    });
}
exports.schemas = schemas;
//# sourceMappingURL=schemas.js.map