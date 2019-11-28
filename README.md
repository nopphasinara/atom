## Atom.io

__Language Specific Configuration Settings__

```
editor.autoIndent
editor.autoIndentOnPaste
editor.invisibles
editor.nonWordCharacters
editor.preferredLineLength
editor.scrollPastEnd
editor.showIndentGuide
editor.showInvisibles
editor.softWrap
editor.softWrapAtPreferredLineLength
editor.softWrapHangingIndent
editor.tabLength
```

__Language-specific Settings in your Config File__

```
'*': # all languages unless overridden
  'editor':
    'softWrap': false
    'tabLength': 8

'.source.gfm': # markdown overrides
  'editor':
    'softWrap': true

'.source.ruby': # ruby overrides
  'editor':
    'tabLength': 2

'.source.python': # python overrides
  'editor':
    'tabLength': 4
```

__Customizing Language Recognition__

If you want Atom to always recognize certain file types as a specific grammar, you'll need to manually edit your config.cson file. You can open it using the Application: Open Your Config command from the Command Palette. For example, if you wanted to add the foo extension to the CoffeeScript language, you could add this to your configuration file under the `*.core` section:
```
'*':
  core:
    customFileTypes:
      'source.coffee': [
        'foo'
      ]
```
In the example above, source.coffee is the language's scope name (see Finding a Language's Scope Name for more information) and foo is the file extension to match without the period. Adding a period to the beginning of either of these will not work.
