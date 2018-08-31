# aligner-coffeescript

[Aligner](https://github.com/adrianlee44/atom-aligner) add-on to support Coffeescript.

## Supported character/operator
`=`: assignment
```coffeescript
foo   = "bar"
test  = "notest"
hello = "world"
```
`+=`, `-=` and other with `=`
```coffeescript
foo    = "bar"
test  += "notest"
hello -= "world"
```
`:`: Object
```coffeescript
random =
  troll: "internet"
  foo:   "bar"
  bar:   "beer"
```
`,`: Items in arrays
```coffeescript
["helloText", 123456, "world"]
["foo"      ,  32124, "bar"]
```
Comments (if `Align Comments` options on)
```coffeescript
hello = 'world' # line 1
foo   = 'bar'   # line 2
```

## Installation
Aligner must be installed along with this package. For more information, please check out [Aligner](https://github.com/adrianlee44/atom-aligner)

## Changelog
- 2017-05-13   v1.0.1   Update README
- 2017-05-07   v1.0.0   Initial release
