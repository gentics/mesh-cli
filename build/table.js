"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let textTable = require('text-table');
/**
 * draw a pretty table
 */
function table(headers, data) {
    let underscores = headers.reduce((p, c) => p.concat('-'.repeat(c.length)), []);
    return textTable(headers.concat(underscores).concat(data));
}
exports.table = table;
