'use strict';

const unirest = require('unirest');
const debug = require("debug")("app");
const config = require("./config");

function post(path, body, noAuth) {
    var cfg = config.get();
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
    if (!noAuth) {
        if (!(cfg.auth && cfg.auth.key)) {
            console.error("No API key was specified");
            process.exit(1);
        }
        headers['Authorization'] = "Bearer " + cfg.auth.key;
    }
    var url = cfg.server.endpoint + path;
    debug("POST " + url);
    return unirest.post(url)
        .headers(headers)
        .send(body);
}

/**
 * Invoke a login request.
 * 
 * @param {string} username 
 * @param {string} password 
 */
function login(username, password) {
    var body = { "username": username, "password": password };
    return post("/api/v1/auth/login", body, true);
}

function get(path) {
    var cfg = config.get();
    if (!(cfg.auth && cfg.auth.key)) {
        console.error("No API key was specified");
        process.exit(1);
    }
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

/**
 * Assert that the response contains the expected code.
 * 
 * @param {*} r 
 * @param {*} expectedCode 
 * @param {*} message 
 */
function check(r, expectedCode, message) {
    if (r.body) {
        debug("Response:", r.body);
    }
    if (r.error || r.code != expectedCode) {
        debug("Response code: " + r.code);
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

module.exports = { post, get, del, check, login }