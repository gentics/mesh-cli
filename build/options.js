"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashdash = require("dashdash");
const url = require("url");
function options() {
    let options = [
        {
            names: ['url', 'u'],
            type: 'string',
            help: 'URL to connect to, with credentials as basic auth',
            default: 'http://admin:admin@localhost:8080/api/v1'
        },
        {
            names: ['project', 'p'],
            type: 'string',
            help: 'Set the project to be selected on startup'
        },
        {
            names: ['debug', 'd'],
            type: 'bool',
            help: 'Enable debug',
            default: false
        },
        {
            name: 'username',
            type: 'string',
            help: 'Username used to connect',
            default: 'admin'
        },
        {
            name: 'password',
            type: 'string',
            help: 'Password used to connect',
            default: 'admin'
        }
    ];
    let parser = dashdash.createParser({ options: options });
    try {
        let opts = parser.parse(process.argv);
        let parts = url.parse(opts.url);
        opts.url = `${parts.protocol}//${parts.host}${parts.path}`;
        if (parts.auth !== null) {
            opts.username = parts.auth.split(':')[0];
            opts.password = parts.auth.split(':')[1];
        }
        return opts;
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
exports.options = options;
//# sourceMappingURL=options.js.map