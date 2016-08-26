Target users
============

If some of the points below apply to you, check out reponote!

* you have lots of personal notes, or perhaps a knowledge-base you constantly "refactor"?
* you have used many note apps but it makes you uneasy that you rely solely on 3rd party to store & backup your precious data
* you're familiar with a **DVCS** (like **git** or **mercurial**) and you think **it is the right tool for the job** when it comes to **storing, versioning, replicating & syncing your notes**? After all, with codebases it works well enough.
* actually you would be totally fine with editing text files on your desktop machine, but you'd like to have it on other devices as well, without much hassle
* you wouldn't like a slow internet connection (or lack of it) affect the experience
* you don't like being forced to use the mouse

Reponote is a yet another note app, aimed to fill these needs. At least, someday, hopefully, it will :)

Goals
=====

* have a client for mobile & desktop devices
* full offline capability, design offline-first
* support git & mercurial
* transparency, the repo is all yours, and it shouldn't be a problem to work on it directly, without the app
* primary repo is an external one, we're not dealing with hosting (at least not now)
* facilitating multiuser collaboration is currently NOT a design goal (maybe future versions)
* everything should be achievable from keyboard with as few keystrokes as possible


Some important design decisions
===============================

**Repo authentication**. I'd like to keep authentication concerns out of this app & rely solely on external repo authentication (the same way I don't wanna deal with storage, as mentioned above, all relies on external repo). We'll see if it's feasible. The idea is that each request receives repo auth data via headers or query (https deadly required). On the app side the repo auth data is hashed and the hash is used to denote the repo working dir on reponote server. This way the hash also sufficiently identifies the working dir, no need for other identifier. Later, the auth data can be discarded or saved in repo config, as it sometimes is on desktop, but it's very disputable - it's like storing your password in plaintext). If it's saved, pulling from remote can be done in background. Any thoughts, ideas?

**Apparent queries are commands**, ie. FetchNoteList & FetchNote. I decided to make them commands for a couple reasons: **(1)** Each of them can possibly clone a repo, so it's not really idempotent, at least not from the server perspective. **(2)** They may have to be atomic (per repo of course, not per whole server), thus need to be eg. processed by a command queue (see below). There are easy ways around (not to require atomicity), but I thought is a safer bet for the time being. **(3)** In the early days of the system, things can often go awry, I don't want to deal with potential problems caused by concurrency (again, I mean per-repo concurrency; concurrency for various repos obvioulsy shouldn't be restricted anyhow).

**Command queueing**. For the reasons above there's a simple command queue for each repo, identified by the aforementioned repo-auth-data hash. Main command dispatcher picks the right queue for the command, then passes it to the right command queue & finally hands over to the command bus.

**Pulling and pushing from remote repos**. Currently it's done synchronously, but can be done async, eg. pull in bg at certain periods, push in bg right after commiting something. Initial clone obviously has to be done in sync.

**Ephemeral local repos on the server**. Deleting local repos on the reponote server at any given time shouldn't break anything as a consequence of some of the above points - if it's deleted, it will simply clone again (of course deleting cannot happen when a request is being processed or push didn't finish). This way you can easily get rid of repos that weren't accessed for some time & save space.

**Prefer simple over smart**, at least when the latter is not smart enough. Example: handling conflicts. There's no plan to support multi user collaboration in first versions, so this shouldn't happen a lot. When a conflict appears, just perform the merge, conflict the default merge-tool output & let the user cleanup on client side. This app is not for codebases, so it shouldn't be a problem.

Architecture
============

* "domain should be free of technology"; apart, obviously, from the tech that the domain purposedly deals with (git & hg); it's the reponote-core package
* adapters should be swappable, eg. packages: reponote-api|cli, cmd-adapter-*; git & hg logic, though, is not meant to replace one another, so they're both in core
* use commands & service objects
* eventually, layers should be testable in isolation with mocks (currently api is tested in isolation with service mocks, but reponote-core tests do real operations on test repositories)
* double test mocks (or some other way to keep them in tune with the other layer); current solution is a lil ugly, but does the job
* currently I handcrafted (some) dependecy injection to easily mock classes, but it feels fragile and not quite right yet

Code organization
=================

The repo is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) managed with [lerna](https://github.com/lerna/lerna). For the actual code see [packages](packages/) folder.

**Package descriptions**:

* [cmd-adapter-git-cli](packages/cmd-adapter-git-cli/) - command line git api adapter
* [cmd-adapter-hg-cli](packages/cmd-adapter-hg-cli/) - same as above, for mercurial
* [reponote-api](packages/reponote-api/) - api server exposing reponote to the web
* [reponote-core](packages/reponote-core/) - reponote domain (git & mercurial handling goes both here, because they're not intended to replace one another - should be both supported)
* [simple-command-queue](packages/simple-command-queue/) - make commands patiently wait for each other
* [simple-command-bus](packages/simple-command-bus/) - let command and service objects meet
* [simple-dispatcher](packages/simple-dispatcher/) - put stuff on the right queue 
* [test-server-git](packages/test-server-git/) - spin up a local git repo server for intergration tests 
* [test-server-hg](packages/test-server-hg/) - same as above for mercurial

**To come**:

* cmd-adapter-git-lib - adapt native libgit bindings via [nodegit](https://github.com/nodegit/nodegit); possible replacement for cmd-adapter-git-cli 
* cmd-adapter-hg-cmd-server - adapt [mercurial command server](https://www.mercurial-scm.org/wiki/CommandServer), possibly via [this package](https://www.npmjs.com/package/hg), possible replacement for cmd-adapter-hg-cli
* reponote-cli - provide some reponote functionality on your commandline, without the mediation by reponote-api  
* reponote-client-web - awesome lean web client, currently residing in my mind
* reponote-client-mobile - try [React Native](https://facebook.github.io/react-native/)...
* reponote-client-core - ...while extracting as much logic as possible here


Setup & test
============

Prerequisites:

* [nvm](https://github.com/creationix/nvm#install-script), or some other version manager
* alternatively, if you already have node v6, it should be fine
* git & hg binaries available on your command line

```
$ cd reponote
$ nvm install
$ npm install
$ npm run bootstrap
$ npm test
```
Caveat: you may experience a random failure in the integration tests from time to time (in my case rarily enough). That's because the git/hg test server doesn't daemonize by itself and I don't know how detect when it's already listening. TODO: use eg. --daemon option for hg serve (or --detach for git), wait for exit & manage the pidfile, that will definitely help.


Coding style
============

The coding style is somewhat heterodox, but hopefully consistent:

* no semicolons; it's nothing new, eg. [npm does it](https://github.com/npm/npm/tree/master/lib); just put a semicolon at the beginning of the line when expression begins with a paren|bracket|operand|backtick, [see here](http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding)
* wrap parens content with spaces, same with curly, except square brackets; again, it's nothing new, [jquery does it too](https://github.com/jquery/jquery/tree/master/src)
* use ES2015 on server side, no transpilation required
* use ES2017's life-changing [async/await](https://medium.com/@tmvvr/ecmascript-async-await-to-the-rescue-fc379ff89146#.yre9hvnyq) achievable via [async-to-gen](https://github.com/leebyron/async-to-gen)
* double quotes by default
* indent with 2 spaces
* every var declaration in new line beginning with const/let; don't overthink, use let most of the time
* vertical alignment allowed where it makes sense
* dangling commas allowed in arrays and objects
* no relative paths in require statemets, achievable via symlinking app/lib dirs to node_modules, see symlink_local_dirs script [here[(packages/reponote-core/package.json)
* don't depend on globally installed npm modules, install them locally (eg. executables) and invoke via npm scripts where correct env is already set 