# lightMarkdown

[![npm version](https://badge.fury.io/js/light-markdown.svg)](http://badge.fury.io/js/light-markdown) [![Bower version](https://badge.fury.io/bo/light-markdown.svg)](http://badge.fury.io/bo/light-markdown)

------
Javascript library that helps you convert simplified markdown (like used in Slack messages) to HTML

## Installation

### Download tarball

You can download the latest release tarball directly from [releases][releases]

### Bower

    bower install light-markdown

### npm (server-side)

    npm install light-markdown

### CDN

You can also use one of several CDNs available:

* github CDN

        https://cdn.rawgit.com/Tonkean/lightMarkdown/<version tag>/dist/light-markdown.min.js

## Quick Example

### Node

```js
    var light-markdown  = require('light-markdown');
    var text = 'This should be *bold*';
    var html = light-markdown.toHtml(text);
```

### Browser

```js
    var text = 'This should be *bold*';
    var html = light-markdown.toHtml(text);
```

### Output 

Both examples should output...

    <p>This should be <b>bold</b></p>
    
## Tests

A suite of tests is available which require node.js.  Once node is installed, run the following command from the project root to install the dependencies:

    npm install

Once installed the tests can be run from the project root using:

    npm test

New test cases can easily be added.  Create a light markdown file (ending in `.lmd`) which contains the markdown to test.  Create a `.html` file of the exact same name.  It will automatically be tested when the tests are executed with `mocha`.

