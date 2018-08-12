'use strict';

const unirest = require('unirest');
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

module.exports = { post, get, del }