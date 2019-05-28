module.exports =
  activate: (toolBar) ->
    @toolBar = toolBar 'toolkits'

    @toolBar.addButton
      callback: 'command-palette:toggle'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Command Palette'
      type: 'button'

    @toolBar.addButton
      callback: 'todo-show:toggle'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Todo Show'
      type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      callback: 'atom-minify:minify-direct'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Minified'
      type: 'button'

    @toolBar.addButton
      callback:
        '': 'sort-lines:sort'
        'shift': 'sort-lines:reverse-sort'
        'shift-alt': 'sort-lines:shuffle'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Sort Lines (Shift click reverse sort)'
      type: 'button'

    @toolBar.addButton
      callback:
        '': 'change-case:swap'
        'shift': 'change-case:kebab'
        'shift-alt': 'change-case:camel'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Text Transform'
      type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      callback: 'github:toggle-git-tab'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Github Toggle'
      type: 'button'

    @toolBar.addButton
      callback: 'split-diff:toggle'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Split Diff'
      type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      callback:
        '': 'remote-sync:configure'
        'alt': 'remote-ftp:disconnect'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Remote FTP'
      type: 'button'

    @toolBar.addButton
      callback:
        '': 'remote-sync:upload-file'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Upload File'
      type: 'button'

    @toolBar.addButton
      callback:
        '': 'remote-sync:download-file'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Download File'
      type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      callback:
        '': 'key-binding-resolver:toggle'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Toggle Key Binding Resolver'
      type: 'button'

    @toolBar.addButton
      callback:
        '': 'editor:log-cursor-scope'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Cursor Scope'
      type: 'button'

    @toolBar.addButton
      icon: 'wrap'
      callback: 'editor:toggle-soft-wrap'
      tooltip: 'Toggle Soft Wrap'
      iconset: 'mdi'
      type: 'button'

    @toolBar.addButton
      icon: 'eye'
      callback: 'markdown-preview:toggle'
      tooltip: 'Markdown Preview'
      iconset: 'mdi'
      type: 'button'

    @toolBar.addButton
      callback: 'autoprefixer'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'CSS Autoprefixer'
      type: 'button'

    @toolBar.addButton
      icon: 'translate'
      url: 'https://translate.google.com'
      tooltip: 'Google Translate'
      iconset: 'mdi'
      type: 'button'

    @toolBar.addButton
      callback:
        '': 'sass-autocompile:compile-to-file'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Compile SASS'
      type: 'button'

    @toolBar.addButton
      callback:
        '': 'window:reload'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Reload Window'
      type: 'button'

    @toolBar.addButton
      callback:
        '': 'window:toggle-dev-tools'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Dev Tools'
      type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      icon: 'dots-vertical'
      callback: 'window:toggle-right-dock'
      tooltip: 'Toggle Right Dock'
      iconset: 'mdi'
      type: 'button'

    @toolBar.addButton
      icon: 'dots-horizontal'
      callback: 'window:toggle-bottom-dock'
      tooltip: 'Toggle Bottom Dock'
      iconset: 'mdi'
      type: 'button'

  deactivate: (state) ->
    @toolBar?.removeItems()
    @toolbar?.destroy()

    @toolbar = null
