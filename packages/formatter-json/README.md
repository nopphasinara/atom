# formatter-json package

Formatter for JSON.

This Formatter plugin for [Formatter](https://atom.io/packages/formatter)
provides an interface to JSON.stringify().

## Installation

2.  Install [Formatter](https://atom.io/packages/formatter) package via Atom

    -   *or with* `apm install formatter`

3.  Install formatter-json package via Atom

    -   *or with* `apm install formatter-json`

## Usage

### In your source compatible file

Default (inspired from IntelliJ):

```cson
'atom-text-editor':
  'alt-ctrl-l': 'formatter:format-code'
  'alt-cmd-l': 'formatter:format-code'
```

### List of config

-   JSON language

    -   Enable formatter for JSON language (*need restart Atom*)

    -   Indent size

        -   Example : `8`

## TODO

-   [ ] optimize enable config
-   [ ] cursor position
-   [ ] more optimization ?

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## License

See [LICENSE.md](./LICENSE.md)
