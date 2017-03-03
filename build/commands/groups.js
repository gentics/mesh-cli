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
function groups(cmd, state, mesh) {
    return __awaiter(this, void 0, void 0, function* () {
        let groups = yield mesh.api.groups.get();
        let data = groups.data.reduce((out, group) => {
            out.push([
                group.uuid,
                group.name,
                group.roles.reduce((p, c) => p.concat(c.name), []).join(', ')
            ]);
            return out;
        }, [['uuid', 'name', 'roles']]);
        console.log(table(data), '\n');
        return state;
    });
}
exports.groups = groups;
//# sourceMappingURL=groups.js.map