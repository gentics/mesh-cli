'use strict';

const rest = require("../../inc/rest");
const common = require("../../inc/common");
const log = common.log;
const error = common.error;
const debug = common.debug;
const commonFuse = require("../commonFuse");

function resolve(stack) {
    debug("Resolving users: " + stack.size());
    if (stack.isEmpty()) {
        return {
            attr: cb => {
                commonFuse.directory(cb);
            },
            list: cb => {
                commonFuse.list("/api/v1/users", cb);
            },
            read: cb => {
                cb(0);
            }
        }
    } else {
        return resolveUser(stack);
    }
}

function withIdFallback(env, action) {
    rest.get("/api/v1/users").end(ur => {
        if (rest.check(ur, 200, "Could not list users")) {
            var id = null;
            ur.body.data.forEach(element => {
                if (element.username == env || element.uuid == env) {
                    id = element.uuid;
                }
            });
            if (id == null) {
                error("Did not find user '" + env + "'");
            } else {
                action(id);
            }
        }
    });
}


function resolveUser(stack) {
    if (stack.isEmpty()) {
        return commonFuse.nil();
    } else {
        var segment = stack.pop();
        console.log("Returing info for " + segment);
        return {
            attr: cb => {
                commonFuse.file(cb);
                //cb(fuse.ENOENT)
            },
            list: cb => {
                cb(0);
            },
            read: (cb, fd, buf, len, pos) => {
                withIdFallback(segment, id => {
                    rest.get("/api/v1/users/" + id).end(r => {
                        if (r.code == 200) {
                            var json = JSON.stringify(r.body, null, 4);
                            buf.write(json);
                            cb(json.length);
                        } else {
                            cb(0);
                        }
                    });
                });
            }
        }
    }
}

module.exports = { resolve }
