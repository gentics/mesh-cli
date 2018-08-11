'use strict';

const unirest = require('unirest');

function post(cfg, path, body) {
    return unirest.post(cfg.server.endpoint + path)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        .send(body);
}

function get(cfg, path) {
    return unirest.get(cfg.server.endpoint + path)
        .headers({ 'Accept': 'application/json' })
        .send();
}

module.exports = { post, get }