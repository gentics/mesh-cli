"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let table = require('text-table');
function ls(mesh, line, cmd, state) {
    return __awaiter(this, void 0, void 0, function* () {
        let users = yield mesh.api.users.get();
        let data = users.data.reduce((out, user) => {
            out.push([
                user.uuid,
                user.emailAddress || '-',
                user.firstname || '-',
                user.lastname || '-',
                user.nodeReference ? user.nodeReference.uuid : '-',
                user.enabled ? 'true' : 'false',
                user.groups.reduce((p, c) => p.concat(c.name), []).join(', ')
            ]);
            return out;
        }, [['uuid', 'emailAddress', 'firstname', 'lastname', 'nodeReference', 'enabled', 'groups']]);
        console.log(data);
        console.log(table(data), '\n');
        return state;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ls;
