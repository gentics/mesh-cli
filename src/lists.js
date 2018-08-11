'use strict';

const clui = require('clui');
const clc = require('cli-color');
const Line = clui.Line;
const LineBuffer = clui.LineBuffer;

var outputBuffer = new LineBuffer({
    x: 0,
    y: 0,
    width: 'console',
    height: 'console'
});

function buffer() {
    return outputBuffer;
}

module.exports = { buffer }
