#!/usr/bin/env node
'use strict';

const program = require('commander');
const rest = require("./rest");
const Table = require('cli-table');

function addTagFamily(env) {
    var project = null;
    var body = {
        name: env
    };
    rest.post("/api/v1/" + project + "/tagfamily", body).end(r => {
        console.dir(r.body);
    });
}

function removeTagFamily(env) {
    var project = null;
    withIdFallback(env, id => {
        rest.del("/api/v1/" + project + "/tagfamily/" + id).end(r => {
            console.dir(r.body);
        });
    });
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
        var table = new Table({
            head: ['UUID', 'Name']
            , colWidths: [34, 15]
        });

        json.data.forEach((element) => {
            table.push([element.uuid, element.name]);
        });
        console.log(table.toString());

    });
}

function withIdFallback(env, action) {
    rest.get("/api/v1/" + project + "/tagfamilies").end(ur => {
        var id = env;
        ur.body.data.forEach(element => {
            if (element.name == env) {
                id = element.uuid;
            }
        });
        action(id);
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