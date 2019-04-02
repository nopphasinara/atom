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

    # @toolBar.addButton
    #   icon: 'document-text'
    #   callback: 'gc:control-files'
    #   tooltip: 'Control Files'
    #   iconset: 'ion'
    #   type: 'button'

    # @toolBar.addButton
    #   icon: 'document-text'
    #   callback: 'advanced-open-file:toggle'
    #   tooltip: 'Open File'
    #   iconset: 'ion'
    #   type: 'button'

    # @toolBar.addButton
    #   icon: 'folder'
    #   callback: 'application:open-folder'
    #   tooltip: 'Open Folder'
    #   iconset: 'ion'
    #   type: 'button'
    #
    # @toolBar.addButton
    #   icon: 'archive'
    #   callback: 'core:save'
    #   tooltip: 'Save File'
    #   iconset: 'ion'
    #   type: 'button'

    # @toolBar.addButton
    #   icon: 'json'
    #   callback: 'pretty-json:prettify'
    #   tooltip: 'JSON'
    #   iconset: 'mdi'
    #   type: 'button'

    @toolBar.addButton
      icon: 'json'
      callback: 'atom-minify:minify-direct'
      tooltip: 'Minified'
      iconset: 'mdi'
      type: 'button'
    # @toolBar.addButton
    #   callback: 'atom-minify:minify-direct'
    #   text: '<i class="gc"></i>'
    #   html: true
    #   tooltip: 'Minified'
    #   type: 'button'

    @toolBar.addButton
      icon: 'sort'
      callback:
        '': 'sort-lines:sort'
        'shift': 'sort-lines:reverse-sort'
        'shift-alt': 'sort-lines:shuffle'
      tooltip: 'Sort Lines (Shift click reverse sort)'
      iconset: 'mdi'
      type: 'button'
    # @toolBar.addButton
    #   callback:
    #     '': 'sort-lines:sort'
    #     'shift': 'sort-lines:reverse-sort'
    #     'shift-alt': 'sort-lines:shuffle'
    #   text: '<i class="gc"></i>'
    #   html: true
    #   tooltip: 'Sort Lines (Shift click reverse sort)'
    #   type: 'button'

    @toolBar.addButton
      icon: 'format-letter-case'
      callback:
        '': 'change-case:swap'
        'shift': 'change-case:kebab'
        'shift-alt': 'change-case:camel'
      tooltip: 'Text Transform'
      iconset: 'mdi'
      type: 'button'
    # @toolBar.addButton
    #   callback:
    #     '': 'change-case:swap'
    #     'shift': 'change-case:kebab'
    #     'shift-alt': 'change-case:camel'
    #   text: '<i class="gc">ﱉ</i>'
    #   html: true
    #   tooltip: 'Text Transform'
    #   type: 'button'

    # @toolBar.addButton
    #   callback:
    #     '': 'emmet:increment-number-by-1'
    #     'alt': 'emmet:decrement-number-by-1'
    #     'shift': 'emmet:increment-number-by-10'
    #     'shift-alt': 'emmet:decrement-number-by-10'
    #   text: '<i class="gc"></i>'
    #   html: true
    #   tooltip: 'Install Package'
    #   type: 'button'

    @toolBar.addSpacer()

    # @toolBar.addButton
    #   icon: 'github-circle'
    #   callback: 'github:toggle-git-tab'
    #   tooltip: 'Github Toggle'
    #   iconset: 'mdi'
    #   type: 'button'
    @toolBar.addButton
      callback: 'github:toggle-git-tab'
      text: '<i class="gc"></i>'
      html: true
      tooltip: 'Github Toggle'
      type: 'button'

    # @toolBar.addButton
    #   icon: 'plus'
    #   callback:
    #     '': 'git-plus:add-and-commit'
    #     'alt': 'git-plus:add'
    #     'shift': 'git-plus:commit'
    #     'shift-alt': 'git-plus:add-all'
    #   tooltip: 'Add + Commit'
    #   iconset: 'mdi'
    #   type: 'button'
    # @toolBar.addButton
    #   callback:
    #     '': 'git-plus:add-and-commit'
    #     'alt': 'git-plus:add'
    #     'shift': 'git-plus:commit'
    #     'shift-alt': 'git-plus:add-all'
    #   text: '<i class="gc"></i>'
    #   html: true
    #   tooltip: 'Add + Commit'
    #   type: 'button'

    # @toolBar.addButton
    #   callback: 'split-diff:toggle'
    #   text: '<i class="gc"></i>'
    #   html: true
    #   tooltip: 'Split Diff'
    #   type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      icon: 'power-settings'
      callback:
        '': 'remote-sync-pro:configure'
        # '': 'remote-sync:configure'
        'alt': 'remote-ftp:disconnect'
        'shift': 'remote-ftp:create-ftp-config'
        'shift-alt': 'remote-ftp:create-sftp-config'
      tooltip: 'FTP Configure'
      iconset: 'mdi'
      type: 'button'
    # @toolBar.addButton
    #   callback:
    #     '': 'remote-sync-pro:configure'
    #     # '': 'remote-sync:configure'
    #     'alt': 'remote-ftp:disconnect'
    #     'shift': 'remote-ftp:create-ftp-config'
    #     'shift-alt': 'remote-ftp:create-sftp-config'
    #   text: '<i class="gc"></i>'
    #   html: true
    #   tooltip: 'FTP Configure'
    #   type: 'button'

    @toolBar.addButton
      icon: 'upload'
      callback: 'remote-sync-pro:upload-file'
      # callback: 'remote-sync:upload-file'
      tooltip: 'Upload File'
      iconset: 'mdi'
      type: 'button'

    @toolBar.addButton
      icon: 'download'
      callback: 'remote-sync-pro:download-file'
      # callback: 'remote-sync:download-file'
      tooltip: 'Download File'
      iconset: 'mdi'
      type: 'button'

    @toolBar.addSpacer()

    @toolBar.addButton
      icon: 'keyboard-outline'
      callback: 'key-binding-resolver:toggle'
      tooltip: 'Toggle Key Binding Resolver'
      iconset: 'mdi'
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
      icon: 'translate'
      url: 'https://translate.google.com'
      tooltip: 'Google Translate'
      iconset: 'mdi'
      type: 'button'
    # @toolBar.addButton
    #   url: 'https://translate.google.com'
    #   text: '<i class="gc">擄</i>'
    #   html: true
    #   tooltip: 'Google Translate'
    #   type: 'url'

    @toolBar.addButton
      icon: 'auto-fix'
      callback: 'sass-autocompile:compile-to-file'
      tooltip: 'Compile SASS'
      iconset: 'mdi'
      type: 'button'

    # @toolBar.addButton
    #   callback: 'chrome-color-picker:toggle'
    #   text: '<i class="gc"></i>'
    #   html: true
    #   tooltip: 'Color Picker'
    #   type: 'button'

    # @toolBar.addButton
    #   callback: 'settings-view:install-packages-and-themes'
    #   text: '<i class="gc"></i>'
    #   html: true
    #   tooltip: 'Install Package'
    #   type: 'button'

    @toolBar.addButton
      icon: 'refresh'
      callback: 'window:reload'
      tooltip: 'Reload Window'
      iconset: 'ion'
      type: 'button'

    @toolBar.addButton
      icon: 'console'
      callback: 'window:toggle-dev-tools'
      tooltip: 'Dev Tools'
      iconset: 'mdi'
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


    # @toolBar.addButton
    #   icon: 'document-text'
    #   callback: 'application:open-file'
    #   tooltip: 'Open File'
    #   iconset: 'ion'
    #
    # @toolBar.addButton
    #   'icon': 'folder'
    #   'callback': 'application:open-folder'
    #   'tooltip': 'Open Folder'
    #   'iconset': 'ion'
    #
    # @toolBar.addButton
    #   'icon': 'archive'
    #   'callback': 'core:save'
    #   'tooltip': 'Save File'
    #   'iconset': 'ion'
    #
    # if atom.packages.loadedPackages['project-manager']
    #   @toolBar.addButton
    #     'icon': 'file-submodule'
    #     'tooltip': 'List projects'
    #     'callback': 'project-manager:list-projects'
    #
    # @toolBar.addSpacer()
    #
    # @toolBar.addButton
    #   'icon': 'columns'
    #   'iconset': 'fa'
    #   'tooltip': 'Split screen - Horizontally'
    #   'callback': 'pane:split-right'
    #
    # btn = @toolBar.addButton
    #   'icon': 'columns'
    #   'iconset': 'fa'
    #   'tooltip': 'Split screen - Vertically'
    #   'callback': 'pane:split-down'
    # btn.element.classList.add 'fa-rotate-270'
    #
    # @toolBar.addSpacer()
    #
    # @toolBar.addButton
    #   'iconset': 'fa'
    #   'icon': 'arrows-alt'
    #   'tooltip': 'Toggle Fullscreen'
    #   'callback': 'window:toggle-full-screen'
    #
    # @toolBar.addButton
    #   'icon': 'sitemap'
    #   'callback': 'tree-view:toggle'
    #   'tooltip': 'Toggle Sidebar'
    #   'iconset': 'fa'
    #
    # if atom.packages.loadedPackages['minimap']
    #   @toolBar.addButton
    #     'icon': 'eye'
    #     'tooltip': 'Toggle Minimap'
    #     'callback': 'minimap:toggle'
    #
    # if atom.packages.loadedPackages['expose']
    #   @toolBar.addButton
    #     'icon': 'browser'
    #     'tooltip': 'Toggle Exposé'
    #     'callback': 'expose:toggle'
    #
    # @toolBar.addSpacer()
    #
    # @toolBar.addButton
    #   'icon': 'indent'
    #   'callback': 'editor:auto-indent'
    #   'tooltip': 'Auto indent (selection)'
    #   'iconset': 'fa'
    #
    # @toolBar.addButton
    #   'icon': 'level-up'
    #   'callback': 'editor:fold-all'
    #   'tooltip': 'Fold all'
    #   'iconset': 'fa'
    #
    # @toolBar.addButton
    #   'icon': 'level-down'
    #   'callback': 'editor:unfold-all'
    #   'tooltip': 'Unfold all'
    #   'iconset': 'fa'
    #
    # if atom.packages.loadedPackages['atom-beautify']
    #   @toolBar.addButton
    #     'icon': 'star'
    #     'callback': 'atom-beautify:beautify-editor'
    #     'tooltip': 'Beautify'
    #     'iconset': 'fa'
    #
    # if atom.packages.loadedPackages['term3']
    #   @toolBar.addSpacer()
    #   @toolBar.addButton
    #     'icon': 'terminal'
    #     'callback': 'term3:open-split-down'
    #     'tooltip': 'Term3 Split Down'
    # else if atom.packages.loadedPackages['term2']
    #   @toolBar.addSpacer()
    #   @toolBar.addButton
    #     'icon': 'terminal'
    #     'callback': 'term2:open-split-down'
    #     'tooltip': 'Term2 Split Down'
    # else if atom.packages.loadedPackages['terminal-plus']
    #   @toolBar.addSpacer()
    #   @toolBar.addButton
    #     'icon': 'terminal'
    #     'callback': 'terminal-plus:toggle'
    #     'tooltip': 'Toggle Terminal-plus'
    # else if atom.packages.loadedPackages['platformio-ide-terminal']
    #   @toolBar.addSpacer()
    #   @toolBar.addButton
    #     'icon': 'terminal'
    #     'callback': 'platformio-ide-terminal:toggle'
    #     'tooltip': 'Toggle Platformio-ide-terminal'
    #
    # if atom.inDevMode()
    #
    #   @toolBar.addSpacer()
    #
    #   @toolBar.addButton
    #     'icon': 'refresh'
    #     'callback': 'window:reload'
    #     'tooltip': 'Reload Window'
    #     'iconset': 'ion'
    #
    #   @toolBar.addButton
    #     'icon': 'bug'
    #     'callback': 'window:toggle-dev-tools'
    #     'tooltip': 'Toggle Developer Tools'
    #
    # if atom.packages.loadedPackages['git-plus']
    #   @toolBar.addSpacer()
    #   @toolBar.addButton
    #     'icon' : 'git-plain'
    #     'callback' : 'git-plus:menu'
    #     'tooltip' : 'Git plus'
    #     'iconset' : 'devicon'
    # else if atom.packages.loadedPackages['git-control']
    #   @toolBar.addSpacer()
    #   @toolBar.addButton
    #     'icon' : 'git-plain'
    #     'callback' : 'git-control:toggle'
    #     'tooltip' : 'Git control'
    #     'iconset' : 'devicon'
    #
    # if atom.packages.loadedPackages['script']
    #   @toolBar.addSpacer()
    #   @toolBar.addButton
    #     'icon': 'play'
    #     'callback': 'script:run'
    #     'tooltip': 'Run script'
    #     'iconset': 'fa'
    #   @toolBar.addButton
    #     'icon': 'fast-forward'
    #     'callback': 'script:run-by-line-number'
    #     'tooltip': 'Run by Line Number'
    #     'iconset': 'fa'
    #   @toolBar.addButton
    #     'icon': 'stop'
    #     'callback': 'script:kill-process'
    #     'tooltip': 'Stop script'
    #     'iconset': 'fa'
    #   @toolBar.addButton
    #     'icon': 'gear'
    #     'callback': 'script:run-options'
    #     'tooltip': 'Configure script'
    #     'iconset': 'fa'
    #
    # @toolBar.addSpacer()
    # if atom.packages.loadedPackages['markdown-preview']
    #   @toolBar.addButton
    #     'icon': 'markdown'
    #     'callback': 'markdown-preview:toggle'
    #     'tooltip': 'Markdown Preview'
    # if atom.packages.loadedPackages['atom-html-preview']
    #   @toolBar.addButton
    #     'icon': 'globe'
    #     'callback': 'atom-html-preview:toggle'
    #     'tooltip': 'HTML Preview'
    #
    # @toolBar.addSpacer()
    # @toolBar.addButton
    #   icon: 'navicon-round'
    #   callback: 'command-palette:toggle'
    #   tooltip: 'Toggle Command Palette'
    #   iconset: 'ion'
    # @toolBar.addButton
    #   'icon': 'gear'
    #   'callback': 'settings-view:open'
    #   'tooltip': 'Open Settings View'

  deactivate: (state) ->
    @toolBar?.removeItems()
    @toolbar?.destroy()

    @toolbar = null
