'use strict';

const unirest = require('unirest');

const config = require("./config");
const common = require("./common");
const log = common.log;
const error = common.error;
const debug = common.debug;

function post(path, body, noAuth) {
    var cfg = config.get();
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
    if (!noAuth) {
        if (!(cfg.auth && cfg.auth.key)) {
            error("No API key was specified");
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
        error("No API key was specified");
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
    debug("Response code: " + r.code);
    if (r.body) {
        debug("Response:", r.body);
    }
    if (r.error) {
        var info = "";
        if (r.body && r.body.message) {
            info += ": " + r.body.message;
        }

        error(message + info);
        if (r.error.code) {
            error(r.error.code);
        }
        assertCode(r, expectedCode);
        return false;
    }

    return assertCode(r, expectedCode);
}

function assertCode(r, expectedCode) {
    var code = r.code;

    if (code == 401) {
        error("Error: You are not authorized. Maybe the API token is invalid.");
        error("Path: " + r.request.path);
        return false;
    }
    if (code == 403) {
        error("Error: You are not allowed to access the resource.");
        error("Path: " + r.request.path);
        return false;
    }
    if (code == 404) {
        error("Error: The resource could not be found.");
        error("Path: " + r.request.path);
        return false;
    }
    // Finally assert that the response code matches with our expectation.
    if (code != expectedCode) {
        debug("Response code: " + code);
        var info = "";
        if (r.body && r.body.message) {
            info += ": " + r.body.message;
        }
        if (code) {
            info += " code: " + code
        }
        error(info);
        if (r.error.code) {
            error("Error: ", r.error.code);
        }
        return false;
    } else {
        return true;
    }
}


module.exports = { post, get, del, check, login }