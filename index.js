
;(function ( cp ) {
    "use strict";

    var execr, extend;

    /**
     * extends a source onto a target
     * @private
     * @function extend
     * @param {Object} target onto what to extend
     * @param {Object} source what to pull from
     * @return {Object} target object
     */
    extend = function ( target, source ) {
        var key;
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    };

    /**
     * execute a command with the passed parameters
     * @function execr
     * @param {String|Array<String>} command what to execute
     * @param {Object} [options={}] fine tune controls
     * @param {String}   [options.prefix=LINUX_PREFIX] env syntax prefix
     * @param {String}   [options.suffix=LINUX_SUFFIX] env syntax suffix
     * @param {Function} [options.stdout=null] called with 1> output
     * @param {Function} [options.stderr=null] called with 2> output
     * @param {Function} [options.failed=null] called with caught errors
     * @param {Boolean}  [options.isfile=false] true if command is a file
     */
    module.exports = execr = function ( command, options ) {
        var key, callback, pregex, sufgex;

        options = extend({
            prefix: execr.LINUX_PREFIX
        ,   suffix: execr.LINUX_SUFFIX
        ,   stdout: null
        ,   stderr: null
        ,   failed: null
        ,   isfile: false
        }, options || { });

        pregex = new RegExp(options.prefix);
        sufgex = new RegExp(options.suffix);

        if (command instanceof Array) {
            command = command.join(" ");
        }

        for (key in process.env) {
            if (process.env.hasOwnProperty(key)) {
                if (!(pregex.test(command) && sufgex.test(command))) {
                    break; // exit early for efficiency
                }
                command = command.replace(
                    new RegExp(options.prefix + key + options.suffix, "gi")
                ,   process.env[key]
                );
            }
        }

        callback = function ( error, stdout, stderr ) {
            if (error && "function" === typeof options.failed) {
                options.failed(error);
            }
            if (stdout && "function" === typeof options.stdout) {
                options.stdout(stdout);
            }
            if (stderr && "function" === typeof options.stderr) {
                options.stderr(stderr);
            }
        };

        if (options.isfile) {
            options.isfile = command.match(/\S+|\S+".*"/g)
            .slice(2).map(function ( item ) {
                return item
                    .replace(/^(.*)"/g, "$1")
                    .replace(/"(.*)$/g, "$1");
            });
            command = command.substr(0, command.indexOf(" "));
            cp.execFile(command, options.isfile, callback);
        } else {
            cp.exec(command, callback);
        }

    };

    /**
     * linux style pattern prefix
     * @memberof execr
     * @member LINUX_PREFIX
     * @static
     */
    execr.LINUX_PREFIX = "\\$";

    /**
     * linux style pattern suffix
     * @memberof execr
     * @member LINUX_SUFFIX
     * @static
     */
    execr.LINUX_SUFFIX = "";

    /**
     * windows style pattern prefix
     * @memberof execr
     * @member WINDOWS_PREFIX
     * @static
     */
    execr.WINDOWS_PREFIX = "%";

    /**
     * windows style pattern suffix
     * @memberof execr
     * @member WINDOWS_SUFFIX
     * @static
     */
    execr.WINDOWS_SUFFIX = "%";

})(
    require("child_process")
);

