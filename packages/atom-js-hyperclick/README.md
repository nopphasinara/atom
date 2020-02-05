<!--not to html-->
# atom-js-hyperclick
inspire from [js-hyperclick](https://atom.io/packages/js-hyperclick),identify webpack alias, and '@'especially

## features


## installation

``` bash
apm install atom-js-hyperclick
```
## create
``` bash
# command palette
Ctrl+Shift+P
input "Generate Package"
```

## debug

``` bash
#open devtool
Ctrl+Shift+I
#reload
Ctrl+Shift+F5/window reload(in command pannel)/Ctrl+R(in devtool)
#clear console
Ctrl+L(in devtool)
```

## publish

``` bash
# first time
git tag -a v0.0.1 -m "release 0.0.1 version"
git push origin --tags
apm publish minor
# other time
apm publish minor
```

## tip
- how to active when init
remove activationCommands in package.json
``` json
"activationCommands": {
  "atom-workspace": "path-to-file:toggle"
},
```
