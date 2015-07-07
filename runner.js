#!/usr/bin/env node

(function ( getopt, execr ) {
    "use strict";

    var opt, options;

    opt = getopt.create([
        ["" , "prefix=ARG", "env syntax prefix"]
    ,   ["" , "suffix=ARG", "env syntax suffix"]
    ,   ["v", "verbose"   , "print exec-ed stdout/stderr"]
    ,   ["s", "silent"    , "exit gracefully on error"]
    ,   ["f", "file"      , "command is a script to be run"]
    ,   ["h", "help"      , "display this screen"]
    ,   ["" , "version"   , "display version"]
    ]).bindHelp().parseSystem();

    if (opt.options.version) {
        console.log(require("./package.json").version);
        process.exit(0);
    }

    options = {  };

    if (opt.options.file) {
        options.isfile = true;
    }
    if (opt.options.prefix != null) {
        options.prefix = opt.options.prefix;
    }
    if (opt.options.suffix != null) {
        options.suffix = opt.options.suffix;
    }

    options.failed = function ( error ) {
        if (opt.options.verbose) {
            console.error(error.message);
            if (error.killed) {
                console.error("[killed: " + error.signal + "]");
            }
        }
        if (!opt.options.silent) {
            process.exit(error.code);
        }
    };

    if (opt.options.verbose) {
        options.stdout = function ( data ) {
            console.log("stdout:\n" + data);
        };
        options.stderr = function ( data ) {
            console.error("stderr:\n" + data);
        };

        console.log("running: ", opt.argv);
    }

    execr(opt.argv, options);

})(
    require("node-getopt")
,   require("./index")
);

