
execr
===

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
```

Lint
---

Linted with jshint (not lint, even if lint command is run!)

```sh
$ npm run lint
--or--
$ npm run hint
```

