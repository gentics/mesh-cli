'use strict';

const program = require('commander');



program
    .version('1.0.0')
    .usage("sync [options] [command]")
    .name("mesh-cli");

program
    .command("pull [name]")
    .description("Pull the current structure of the server and store it locally.")
    .action(pull);

program
    .command("push")
    .description("Push the local changes to the remote server.")
    //the local bootstrap structure with the remote Gentics Mesh instance. You can use this command to setup initial project structure which you added to your local repository.
    .action(push);



program.parse(process.argv);

var noSubCommand = program.args.length === 0;
if (noSubCommand) {
    program.help();
}

