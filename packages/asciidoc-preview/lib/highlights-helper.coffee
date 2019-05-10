scopesByFenceName =
  # support from Highlights https://github.com/atom/highlights/tree/master/deps
  'bash': 'source.shell'
  'c': 'source.c'
  'c++': 'source.cpp'
  'clojure': 'source.clojure'
  'coffee': 'source.coffee'
  'coffeescript': 'source.coffee'
  'coffee-script': 'source.coffee'
  'cpp': 'source.cpp'
  'cs': 'source.cs'
  'csharp': 'source.cs'
  'css': 'source.css'
  'erlang': 'source.erl'
  'go': 'source.go'
  'golang': 'source.go'
  'html': 'text.html.basic'
  'java': 'source.java'
  'javascript': 'source.js'
  'js': 'source.js'
  'json': 'source.json'
  'less': 'source.css.less'
  'make': 'source.makefile'
  'makefile': 'source.makefile'
  'markdown': 'source.gfm'
  'md': 'source.gfm'
  'mdown': 'source.gfm'
  'mustache': 'text.html.mustache'
  'objc': 'source.objc'
  'objective-c': 'source.objc'
  'perl': 'source.perl'
  'php': 'text.html.php'
  'plist': 'text.xml.plist'
  'properties': 'source.git-config'
  'py': 'source.python'
  'python': 'source.python'
  'rb': 'source.ruby'
  'ruby': 'source.ruby'
  'sass': 'source.sass'
  'scss': 'source.css.scss'
  'sh': 'source.shell'
  'shell': 'source.shell'
  'sql': 'source.sql'
  'text': 'text.plain'
  'todo': 'text.todo'
  'toml': 'source.toml'
  'xml': 'text.xml'
  'yaml': 'source.yaml'
  'yml': 'source.yaml'
  # support for others packages
  'csv': 'text.csv'
  'diff': 'source.diff'
  'docker': 'source.dockerfile'
  'dockerfile': 'source.dockerfile'
  'elixir': 'source.elixir'
  'elm': 'source.elm'
  'groovy': 'source.groovy'
  'haskell': 'source.haskell'
  'jsx': 'source.js.jsx'
  'julia': 'source.julia'
  'ocaml': 'source.ocaml'
  'patch': 'source.diff'
  'r': 'source.r'
  'rej': 'source.diff'
  'rs': 'source.rust'
  'rust': 'source.rust'
  'scala': 'source.scala'
  'swift': 'source.swift'
  'typescript': 'source.ts'
  'ts': 'source.ts'

module.exports =
  scopeForFenceName: (fenceName, blockText) ->
    fenceName = fenceName.toLowerCase()
    if fenceName is 'php' and not blockText.startsWith '<?php'
      "source.#{fenceName}"
    else
      scopesByFenceName[fenceName] ? "source.#{fenceName}"
