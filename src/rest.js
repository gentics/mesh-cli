'use strict';

const unirest = require('unirest');
const debug = require("debug");
const config = require("./config");
const cfg = config.get();

function post(path, body) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + cfg.auth.key
    }
    return unirest.post(cfg.server.endpoint + path)
        .headers(headers)
        .send(body);
}

function get(path) {
    var headers = {
        'Accept': 'application/json',
        'Authorization': "Bearer " + cfg.auth.key
    }
    return unirest.get(cfg.server.endpoint + path)
        .headers(headers)
        .send();
}

function del(path) {
    var headers = {
        'Accept': 'application/json',
        'Authorization': "Bearer " + cfg.auth.key
    }
    return unirest.delete(cfg.server.endpoint + path)
        .headers(headers)
        .send();
}

function check(r, expectedCode, message) {
    if (r.body) {
        debug("Response:", r.body);
    }
    if (r.error || r.code != expectedCode) {
        var info = "";
        if (r.body && r.body.message) {
            info = ": " + r.body.message;
        }
        console.error(message + info);
        if (r.error.code) {
            console.error("Error: ", r.error.code);
        }
        return false;
    }
    return true;
}

module.exports = { post, get, del, check }