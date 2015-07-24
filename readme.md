
execr
===

[![Codacy Badge](https://www.codacy.com/project/badge/3d23c3bb4b064025a527c9898049d207)](https://www.codacy.com/app/tsu-complete/node-execr)

> cross platform exec

Reason
---

Primary use is within npm scripts to execute cross platform commands.

In particular environment variables; at the time of writing this to use
an environment variable on linux/unix platforms is $NAME where on windows
it is %name% (case insensitive)

Any bugs, improvements or features, please leave a ticket or a merge request!

License
---

MIT (see LICENSE)

Usage
---

```sh
$ execr --help

Usage: execr

      --prefix=ARG  env syntax prefix
      --suffix=ARG  env syntax suffix
  -v, --verbose     print exec-ed stdout/stderr
  -s, --silent      exit gracefully on error
  -f, --file        command is a script to be run
  -h, --help        display this screen
      --version     display version
```

Command may be provided as single string or broken
if following an argument separator (note separator
works as expected in linux/unix as seen in the
last possibilities shown here)

```sh
$ execr -- echo hello world
$ execr echo hello world
$ execr echo "hello world"
$ execr "echo hello world"
$ execr "echo \"hello world\""
$ execr -- "echo hello world"
$ execr echo -- hello world
$ execr -- ls -AlhG
```

If it is a single command consider using the file flag
to denote this.  The change is purely for efficiency.

Do:
```sh
$ execr -f -- ls
```

Don't:
```sh
$ execr -f -- ls | grep package
```

> NOTE: this may appear to work correctly but consider
>       that it will be evaluated `{execr -f -- ls} | grep package`
>       to prevent this use `execr -f -- "ls | grep package"`
>       which will now error due to incorrect usage of the file flag

Show output with verbose mode

```sh
$ execr -v -- echo hi
running: [ 'echo', 'hi' ]
stdout:
hi
```

Prevent errors from affecting exit codes

```sh
$ execr -v -- foobar
running:  [ 'foobar' ]
Command failed: /bin/sh -c foobar
/bin/sh: foobar: command not found
(127) $ execr -v -s --foobar
running:  [ 'foobar' ]
Command failed: /bin/sh -c foobar
/bin/sh: foobar: command not found
stderr:
/bin/sh: foobar: command not found
$
```

Change prefix and suffix for environment variables

```sh
ENV=node execr --prefix=% --suffix=% -v -- echo %env%
running:  [ 'echo', '%env%' ]
stdout:
node
```

> NOTE: prefix nd suffix values are regular expressions
        so don't forget to escape special characters

```sh
ENV=node execr --prefix="" --suffix="\\\$" -v -- echo "ENV\$"
running:  [ 'echo', 'ENV$' ]
stdout:
node
```

Lint
---

Linted with jshint (not lint, even if lint command is run!)

```sh
$ npm run lint
--or--
$ npm run hint
```

