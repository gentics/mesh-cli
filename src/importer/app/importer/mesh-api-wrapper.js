const MeshAPI = require('mesh-api')
const config = require.main.require('./config');

const mesh = new MeshAPI.MeshAPI({
    url: config.mesh.url,
    debug: config.mesh.debug
});

let meshTokenPromise = undefined;

exports.api = mesh.api;

async function login () {
    const response = await mesh.api.auth.login.post({
        username: config.mesh.user,
        password: config.mesh.password
    });
    mesh.token = response.token
    meshToken = response.token;
    return response.token;
}

async function getMeshToken() {
    if (!meshTokenPromise) {
        //throw new Error("No mesh toke available make sure login() was called and returned")
        meshTokenPromise = login();
    }
    return meshTokenPromise;
};

exports.getMeshToken = getMeshToken;
exports.login = login;
