'use strict';

const unirest = require('unirest');
const debug = require("debug")("app");
const config = require("./config");

function post(path, body) {
    var cfg = config.get();
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + cfg.auth.key
    }
    var url = cfg.server.endpoint + path;
    debug("POST " + url);
    return unirest.post(url)
        .headers(headers)
        .send(body);
}

function get(path) {
    var cfg = config.get();
    var headers = {
        'Accept': 'application/json',
        'Authorization': "Bearer " + cfg.auth.key
    }
    var url = cfg.server.endpoint + path;
    debug("GET " + url);
    return unirest.get(url)
        .headers(headers)
        .send();
}

function del(path) {
    var cfg = config.get();
    var headers = {
        'Accept': 'application/json',
        'Authorization': "Bearer " + cfg.auth.key
    }
    var url = cfg.server.endpoint + path;
    debug("DELETE " + url);
    return unirest.delete(url)
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