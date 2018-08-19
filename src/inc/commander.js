'use strict';

const chalk = require('chalk');
const program = require('commander');
const Command = program.Command;

Command.prototype.group = function (name) {
    var command = this;
    if (this.commands.length !== 0) {
        command = this.commands[this.commands.length - 1];
    }
    if (arguments.length === 0) {
        return command._group || "CLI";
    }
    command._group = name;
    return this;
}

Command.prototype.padWidth = () => {
    return 39;
}

Command.prototype.commandHelp = function () {
    if (!this.commands.length) return '';

    var width = this.padWidth();
    var grey = chalk.grey;

    var groups = this.commands.reduce(function (rv, cmd) {
        (rv[cmd.group()] = rv[cmd.group()] || []).push(cmd);
        return rv;
    }, {});

    var maxNameLen = this.commands.reduce(function (rv, cmd) {
        var len = cmd.name().length;
        return Math.max(len, rv);
    }, 0);

    var groupInfo = Object.keys(groups).map((group) => {
        var commands = groups[group];
        var info = commands.map(cmd => {
            var alias = cmd.alias() ? " | " + cmd.alias() : ""
            var args = cmd._args.map(e => '[' + e.name + ']').join(" ");
            var name = cmd.name();
            var desc = cmd.description();

            // Padding
            var padded = pad("    " + name, maxNameLen + 4);
            padded = pad(padded + alias, 17);
            padded = pad(padded + " " + args, 45) + desc;
            var optionInfo = buildCmdOptions(cmd.options);
            return padded + optionInfo;
        }).join("\n");
        return "  " + grey(group + ":") + "\n\n" + info + "\n\n";
    }).join("");

    return groupInfo;
}

function buildCmdOptions(options) {
    var info = options.map(option => {
        var padded = pad("    [cmd]   " + option.flags, 45);
        padded += pad(option.description, 22);    
        return chalk.dim(padded);
    }).join("\n");
    if (info.length) {
        info = "    \n" + info +  "\n";
    }
    return info;
}


function pad(str, width) {
    var len = Math.max(0, width - str.length);
    return str + Array(len + 1).join(' ');
}

