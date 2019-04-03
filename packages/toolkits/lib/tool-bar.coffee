module.exports =
  activate: (toolBar) ->
    @toolBar = toolBar 'toolkits'

    @toolBar.addButton
      icon: 'navicon-round'
      callback: 'command-palette:toggle'
      tooltip: 'Command Palette'
      iconset: 'ion'
      type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      icon: 'json'
      callback: 'atom-minify:minify-direct'
      tooltip: 'Minified'
      iconset: 'mdi'
      type: 'button'

    @toolBar.addButton
      icon: 'sort'
      callback:
        '': 'sort-lines:sort'
        'shift': 'sort-lines:reverse-sort'
        'shift-alt': 'sort-lines:shuffle'
      tooltip: 'Sort Lines (Shift click reverse sort)'
      iconset: 'mdi'
      type: 'button'

    @toolBar.addButton
      icon: 'format-letter-case'
      callback:
        '': 'change-case:swap'
        'shift': 'change-case:kebab'
        'shift-alt': 'change-case:camel'
      tooltip: 'Text Transform'
      iconset: 'mdi'
      type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      callback: 'github:toggle-git-tab'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Github Toggle'
      type: 'button'

    @toolBar.addButton
      callback: 'split-diff:toggle'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Split Diff'
      type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      callback:
        '': 'remote-sync-pro:configure'
        'alt': 'remote-ftp:disconnect'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Remote FTP'
      type: 'button'

    @toolBar.addButton
      callback:
        '': 'remote-sync-pro:upload-file'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Upload File'
      type: 'button'

    @toolBar.addButton
      callback:
        '': 'remote-sync-pro:download-file'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Download File'
      type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      callback:
        '': 'key-binding-resolver:toggle'
      text: '<i class="gc">梁</i>'
      html: true
      tooltip: 'Toggle Key Binding Resolver'
      type: 'button'

    @toolBar.addButton
      icon: 'target'
      callback: 'editor:log-cursor-scope'
      tooltip: 'Cursor Scope'
      iconset: 'mdi'
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
      icon: 'auto-fix'
      callback: 'sass-autocompile:compile-to-file'
      tooltip: 'Compile SASS'
      iconset: 'mdi'
      type: 'button'

    @toolBar.addButton
      icon: 'refresh'
      callback: 'window:reload'
      tooltip: 'Reload Window'
      iconset: 'ion'
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
