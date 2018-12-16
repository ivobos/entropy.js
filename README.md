# entropy-engine
JavaScript 3D Game Engine


## How to publish
Commit any outstanding changes.
```
npm login
npm run release
```

## Developing
If you haven't done so already, link entropy-engine in global modules folder
```
npm link
```
then run
```
npm start
```
this runs nodemon that watchers all ts file in src and re-builds library as needed.

Then in your test app, link entropy-engine using
```
npm link @ivobos/entropy-engine
```
note: you will have to remove @ivobos/entropy-engine from your test app, and install all entopy-engine dependencies
note: if you do npm insall in your test app, you will have to npm link @ivobos/entropy-engine again, it's an npm bug.

Any changes in entropy-engine will be picked up by your test app and live re-loaded.

see: https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557

