module.exports =
  activate: (state) ->
    require('atom-package-deps').install('tool-bar-main')

  deactivate: ->
    @toolBar?.removeItems()

  serialize: ->

  consumeToolBar: (toolBar) ->
    @toolBar = toolBar 'main-tool-bar'

    @toolBar.addButton
      icon: "navicon-round"
      callback: "command-palette:toggle"
      tooltip: "Command Palette"
      iconset: "ion"
      type: "button"

    @toolBar.addSpacer()

    @toolBar.addButton
      icon: "document-text"
      callback: "application:open-file"
      tooltip: "Open File"
      iconset: "ion"
      type: "button"

    @toolBar.addButton
      icon: "folder"
      callback: "application:open-folder"
      tooltip: "Open Folder"
      iconset: "ion"
      type: "button"

    @toolBar.addButton
      icon: "archive"
      callback: "core:save"
      tooltip: "Save File"
      iconset: "ion"
      type: "button"

    @toolBar.addSpacer()

    @toolBar.addButton
      icon: "json"
      callback: "pretty-json:prettify"
      tooltip: "JSON"
      iconset: "mdi"
      type: "button"

    @toolBar.addButton
      callback: 'atom-minify:minify-to-min-file'
      text: '<i class="gc"></i>'
      html: true
      tooltip: "Minified"
      type: "button"

    @toolBar.addButton
      callback:
        '': 'sort-lines:sort'
        'shift': 'sort-lines:reverse-sort'
        'shift-alt': 'sort-lines:shuffle'
      text: '<i class="gc"></i>'
      html: true
      tooltip: "Sort Lines (Shift click reverse sort)"
      type: "button"

    @toolBar.addButton
      callback:
        '': 'change-case:swap'
        'shift': 'change-case:kebab'
        'shift-alt': 'change-case:camel'
      text: '<i class="gc">ﱉ</i>'
      html: true
      tooltip: "Text Transform"
      type: "button"

    @toolBar.addButton
      callback:
        '': 'emmet:increment-number-by-1'
        'alt': 'emmet:decrement-number-by-1'
        'shift': 'emmet:increment-number-by-10'
        'shift-alt': 'emmet:decrement-number-by-10'
      text: '<i class="gc"></i>'
      html: true
      tooltip: "Install Package"
      type: "button"

    @toolBar.addSpacer()

    @toolBar.addButton
      callback: "split-diff:toggle"
      text: '<i class="gc"></i>'
      html: true
      tooltip: "Split Diff"
      type: "button"

    @toolBar.addButton
      callback:
        '': 'remote-sync:configure'
        'shift': 'remote-ftp:create-ftp-config'
        'shift-alt': 'remote-ftp:create-sftp-config'
      text: '<i class="gc"></i>'
      html: true
      tooltip: "Remote Sync - Configure"
      type: "button"

    @toolBar.addButton
      icon: "upload"
      callback: "remote-sync:upload-file"
      tooltip: "Upload File"
      iconset: "mdi"
      type: "button"

    @toolBar.addButton
      icon: "download"
      callback: "remote-sync:download-file"
      tooltip: "Download File"
      iconset: "mdi"
      type: "button"

    @toolBar.addSpacer()

    @toolBar.addButton
      icon: "keyboard"
      callback: "key-binding-resolver:toggle"
      tooltip: "Toggle Key Binding Resolver"
      iconset: ""
      type: "button"

    @toolBar.addButton
      icon: "target"
      callback: "editor:log-cursor-scope"
      tooltip: "Cursor Scope"
      iconset: "mdi"
      type: "button"

    @toolBar.addButton
      icon: "wrap"
      callback: "editor:toggle-soft-wrap"
      tooltip: "Toggle Soft Wrap"
      iconset: "mdi"
      type: "button"

    @toolBar.addButton
      icon: "eye"
      callback: "markdown-preview:toggle"
      tooltip: "Markdown Preview"
      iconset: "mdi"
      type: "button"

    @toolBar.addButton
      url: "https://translate.google.com"
      text: '<i class="gc">擄</i>'
      html: true
      tooltip: "Google Translate"
      type: "url"

    @toolBar.addButton
      callback: 'chrome-color-picker:toggle'
      text: '<i class="gc"></i>'
      html: true
      tooltip: "Color Picker"
      type: "button"

    @toolBar.addButton
      callback: 'settings-view:install-packages-and-themes'
      text: '<i class="gc"></i>'
      html: true
      tooltip: "Install Package"
      type: "button"

    @toolBar.addButton
      icon: "refresh"
      callback: "window:reload"
      tooltip: "Reload Window"
      iconset: "ion"
      type: "button"

    @toolBar.addButton
      icon: "console"
      callback: "window:toggle-dev-tools"
      tooltip: "Dev Tools"
      iconset: "mdi"
      type: "button"


    @toolBar.addSpacer()

    @toolBar.addButton
      icon: "dots-vertical"
      callback: "window:toggle-right-dock"
      tooltip: "Toggle Right Dock"
      iconset: "mdi"
      type: "button"

    @toolBar.addButton
      icon: "dots-horizontal"
      callback: "window:toggle-bottom-dock"
      tooltip: "Toggle Bottom Dock"
      iconset: "mdi"
      type: "button"

    # @toolBar.addButton
    #   icon: 'octoface'
    #   # Without modifiers is default action
    #   callback:
    #     '': 'application:about'
    #     'alt': 'application:minimize'
    #     # With function callback
    #     'ctrl': 'application:hide'
    #     'shift': (data) ->
    #       console.log(data)
    #     'alt-shift': 'application:quit'
    #   data: 'foo'
    #   tooltip: 'Toggle Developer Tools'
    #   iconset: ''
    #
    # @toolBar.addButton
    #   icon: 'terminal'
    #   callback: (data) ->
    #     alert(data[0])
    #   # callback: ->
    #   #   require('remote').getCurrentWindow().toggleDevTools()
    #   tooltip: 'Toggle Developer Tools'
    #   data: [
    #     'foo'
    #     'bar'
    #   ]
