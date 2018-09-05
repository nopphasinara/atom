# Bootstrap 4 Support for Atom

Provides [Bootstrap 4][1] classes and HTML tags with autocompletion features.

Install:
```ssh
apm install v-bootstrap4
```

Key Features:

  - Supports autocompletion of all helper classes in JavaScript, CSS and HTML
  - Snippet support for all components.
  - Autocompletion for **[Glyphicons][2]** and **[Fontawesome][3]**

Version:

  - Bootstrap v4.0.0-beta.2
  - Font Awesome v4.7.0
  - Glyphicons
    * 800 GLYPHICONS
    * 300 GLYPHICONS Halflings
    * 140 GLYPHICONS Filetypes
    * 70 GLYPHICONS Social

## Templates

  - `html-`: Generates Basic HTML Template
  - `html-min`: Generates Basic HTML (No Comment)
  - `html-oi`: Generates Basic HTML Template (replace `fontawesome` in favor of `octicons`)

## Components

All components also have autocompletion support for extra options.

### Icons

The plugin has Glyphicon and Fontawesome support.

  - `gly`: Generates glyphicon icon snippet
  - `gly-h`: Generates glyphicon halflings icon snippet
  - `gly-s`: Generates glyphicon social icon snippet
  - `gly-f`: Generates glyphicon filetypes icon snippet
  - `fa`: Generates fontawesome icon snippet
  - `oi`: Generates octicon snippet

### Grid

  * `con`: Generates container: `<div class="container"></div>`
  * `conf`: Generates fluid container: `<div class="container-fluid"></div>`
  * `row`: Generates column container: `<div class="row"></div>`
  * `col-`: Generates column: `<div class="col-..."></div>`
  * `col-sm`: Generates small column: `<div class="col-sm-..."></div>`
  * `col-md`: Generates medium column: `<div class="col-md-..."></div>`
  * `col-lg`: Generates large column: `<div class="col-lg-..."></div>`
  * `col-xl`: Generates extra large column: `<div class="col-xl-..."></div>`

[1]: http://v4-alpha.getbootstrap.com/
[2]: http://glyphicons.com/
[3]: https://fortawesome.github.io/Font-Awesome/
