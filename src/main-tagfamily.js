#!/usr/bin/env node
'use strict';

const program = require('commander');
const rest = require("./rest");
const lists = require("./lists");
const clui = require('clui');
const clc = require('cli-color');
const Line = clui.Line;

function addTagFamily() {
    var project = null;
    rest.post(cfg, "/api/v1/" + project + "/tagfamily");
}

function removeTagFamily(env) {
    var id = null;
    var project = null;
    rest.delete(cfg, "/api/v1/" + project + "/tagfamily/" + id);
}

function listTagFamilies(env) {
    var project = null;
    var path = "/api/v1/" + project + "/tagfamiles";
    rest.get(path).end(r => {
        if (r.code != 200) {
            console.error("Could not find endpoint for path " + path);
            return;
        }

        var json = r.body;
        var buffer = lists.buffer();

        var header = new Line(buffer)
            .column('UUID', 34, [clc.cyan])
            .column('Username', 15, [clc.cyan])
            .column('Firstname', 30, [clc.cyan])
            .column('Lastname', 30, [clc.cyan])
            .column('Groups', 30, [clc.cyan])
            .fill()
            .store();

        json.data.forEach((element) => {
            var groups = new Array();
            element.groups.forEach(group => {
                groups.push(group.name);
            });
            var groupsStr = "[" + groups.join() + "]";
            new Line(buffer)
                .column(element.uuid, 34)
                .column(element.username || "-", 15)
                .column(element.firstname || "-", 30)
                .column(element.lastname || "-", 30)
                .column(groupsStr, 30)
                .fill()
                .store();
        });

        buffer.output();

    });
}

program
    .version('1.0.0')
    .usage("user [options] [command]")
    .name("mesh-cli");

program
    .command('add [name]')
    .description("Add a new tagfamily.")
    .action(addTagFamily);

program
    .command('remove [name/uuid]')
    .description("Remove the tagfamily.")
    .action(removeTagFamily);

program
    .command('list')
    .description("List all tag families.")
    .action(listTagFamilies);

program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}