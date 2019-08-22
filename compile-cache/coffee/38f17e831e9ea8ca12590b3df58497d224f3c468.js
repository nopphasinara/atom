(function() {
  var CompositeDisposable, File, NodeSassCompiler, SassAutocompileOptions, SassAutocompileView;

  CompositeDisposable = require('atom').CompositeDisposable;

  SassAutocompileOptions = require('./options');

  SassAutocompileView = require('./sass-autocompile-view');

  NodeSassCompiler = require('./compiler');

  File = require('./helper/file');

  module.exports = {
    config: {
      compileOnSave: {
        title: 'Compile on Save',
        description: 'This option en-/disables auto compiling on save',
        type: 'boolean',
        "default": true,
        order: 10
      },
      compileFiles: {
        title: 'Compile files ...',
        description: 'Choose which SASS files you want this package to compile',
        type: 'string',
        "enum": ['Only with first-line-comment', 'Every SASS file'],
        "default": 'Every SASS file',
        order: 11
      },
      compilePartials: {
        title: 'Compile Partials',
        description: 'Controls compilation of Partials (underscore as first character in filename) if there is no first-line-comment',
        type: 'boolean',
        "default": false,
        order: 12
      },
      checkOutputFileAlreadyExists: {
        title: 'Ask for overwriting already existent files',
        description: 'If target file already exists, sass-autocompile will ask you before overwriting',
        type: 'boolean',
        "default": false,
        order: 13
      },
      directlyJumpToError: {
        title: 'Directly jump to error',
        description: 'If enabled and you compile an erroneous SASS file, this file is opened and jumped to the problematic position.',
        type: 'boolean',
        "default": false,
        order: 14
      },
      showCompileSassItemInTreeViewContextMenu: {
        title: 'Show \'Compile SASS\' item in Tree View context menu',
        description: 'If enabled, Tree View context menu contains a \'Compile SASS\' item that allows you to compile that file via context menu',
        type: 'string',
        type: 'boolean',
        "default": true,
        order: 15
      },
      compileCompressed: {
        title: 'Compile with \'compressed\' output style',
        description: 'If enabled SASS files are compiled with \'compressed\' output style. Please define a corresponding output filename pattern or use inline parameter \'compressedFilenamePattern\'',
        type: 'boolean',
        "default": true,
        order: 30
      },
      compressedFilenamePattern: {
        title: 'Filename pattern for \'compressed\' compiled files',
        description: 'Define the replacement pattern for compiled filenames with \'compressed\' output style. Placeholders are: \'$1\' for basename of file and \'$2\' for original file extension.',
        type: 'string',
        "default": '$1.min.css',
        order: 31
      },
      compileCompact: {
        title: 'Compile with \'compact\' output style',
        description: 'If enabled SASS files are compiled with \'compact\' output style. Please define a corresponding output filename pattern or use inline parameter \'compactFilenamePattern\'',
        type: 'boolean',
        "default": false,
        order: 32
      },
      compactFilenamePattern: {
        title: 'Filename pattern for \'compact\' compiled files',
        description: 'Define the replacement pattern for compiled filenames with \'compact\' output style. Placeholders are: \'$1\' for basename of file and \'$2\' for original file extension.',
        type: 'string',
        "default": '$1.compact.css',
        order: 33
      },
      compileNested: {
        title: 'Compile with \'nested\' output style',
        description: 'If enabled SASS files are compiled with \'nested\' output style. Please define a corresponding output filename pattern or use inline parameter \'nestedFilenamePattern\'',
        type: 'boolean',
        "default": false,
        order: 34
      },
      nestedFilenamePattern: {
        title: 'Filename pattern for \'nested\' compiled files',
        description: 'Define the replacement pattern for compiled filenames with \'nested\' output style. Placeholders are: \'$1\' for basename of file and \'$2\' for original file extension.',
        type: 'string',
        "default": '$1.nested.css',
        order: 35
      },
      compileExpanded: {
        title: 'Compile with \'expanded\' output style',
        description: 'If enabled SASS files are compiled with \'expanded\' output style. Please define a corresponding output filename pattern or use inline parameter \'expandedFilenamePattern\'',
        type: 'boolean',
        "default": false,
        order: 36
      },
      expandedFilenamePattern: {
        title: 'Filename pattern for \'expanded\' compiled files',
        description: 'Define the replacement pattern for compiled filenames with \'expanded\' output style. Placeholders are: \'$1\' for basename of file and \'$2\' for original file extension.',
        type: 'string',
        "default": '$1.css',
        order: 37
      },
      indentType: {
        title: 'Indent type',
        description: 'Indent type for output CSS',
        type: 'string',
        "enum": ['Space', 'Tab'],
        "default": 'Space',
        order: 38
      },
      indentWidth: {
        title: 'Indent width',
        description: 'Indent width; number of spaces or tabs',
        type: 'integer',
        "enum": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "default": 2,
        minimum: 0,
        maximum: 10,
        order: 39
      },
      linefeed: {
        title: 'Linefeed',
        description: 'Used to determine whether to use \'cr\', \'crlf\', \'lf\' or \'lfcr\' sequence for line break',
        type: 'string',
        "enum": ['cr', 'crlf', 'lf', 'lfcr'],
        "default": 'lf',
        order: 40
      },
      sourceMap: {
        title: 'Build source map',
        description: 'If enabled a source map is generated',
        type: 'boolean',
        "default": false,
        order: 41
      },
      sourceMapEmbed: {
        title: 'Embed source map',
        description: 'If enabled source map is embedded as a data URI',
        type: 'boolean',
        "default": false,
        order: 42
      },
      sourceMapContents: {
        title: 'Include contents in source map information',
        description: 'If enabled contents are included in source map information',
        type: 'boolean',
        "default": false,
        order: 43
      },
      sourceComments: {
        title: 'Include additional debugging information in the output CSS file',
        description: 'If enabled additional debugging information are added to the output file as CSS comments. If CSS is compressed this feature is disabled by SASS compiler',
        type: 'boolean',
        "default": false,
        order: 44
      },
      includePath: {
        title: 'Include paths',
        description: 'Paths to look for imported files (@import declarations); comma separated, each path surrounded by quotes',
        type: 'string',
        "default": '',
        order: 45
      },
      precision: {
        title: 'Precision',
        description: 'Used to determine how many digits after the decimal will be allowed. For instance, if you had a decimal number of 1.23456789 and a precision of 5, the result will be 1.23457 in the final CSS',
        type: 'integer',
        "default": 5,
        minimum: 0,
        order: 46
      },
      importer: {
        title: 'Filename to custom importer',
        description: 'Path to .js file containing custom importer',
        type: 'string',
        "default": '',
        order: 47
      },
      functions: {
        title: 'Filename to custom functions',
        description: 'Path to .js file containing custom functions',
        type: 'string',
        "default": '',
        order: 48
      },
      notifications: {
        title: 'Notification type',
        description: 'Select which types of notifications you wish to see',
        type: 'string',
        "enum": ['Panel', 'Notifications', 'Panel, Notifications'],
        "default": 'Panel',
        order: 60
      },
      autoHidePanel: {
        title: 'Automatically hide panel on ...',
        description: 'Select on which event the panel should automatically disappear',
        type: 'string',
        "enum": ['Never', 'Success', 'Error', 'Success, Error'],
        "default": 'Success',
        order: 61
      },
      autoHidePanelDelay: {
        title: 'Panel-auto-hide delay',
        description: 'Delay after which panel is automatically hidden',
        type: 'integer',
        "default": 3000,
        order: 62
      },
      autoHideNotifications: {
        title: 'Automatically hide notifications on ...',
        description: 'Select which types of notifications should automatically disappear',
        type: 'string',
        "enum": ['Never', 'Info, Success', 'Error', 'Info, Success, Error'],
        "default": 'Info, Success',
        order: 63
      },
      showStartCompilingNotification: {
        title: 'Show \'Start Compiling\' Notification',
        description: 'If enabled a \'Start Compiling\' notification is shown',
        type: 'boolean',
        "default": false,
        order: 64
      },
      showAdditionalCompilationInfo: {
        title: 'Show additional compilation info',
        description: 'If enabled additiona infos like duration or file size is presented',
        type: 'boolean',
        "default": true,
        order: 65
      },
      showNodeSassOutput: {
        title: 'Show node-sass output after compilation',
        description: 'If enabled detailed output of node-sass command is shown in a new tab so you can analyse output',
        type: 'boolean',
        "default": false,
        order: 66
      },
      showOldParametersWarning: {
        title: 'Show warning when using old paramters',
        description: 'If enabled any time you compile a SASS file und you use old inline paramters, an warning will be occur not to use them',
        type: 'boolean',
        "default": true,
        order: 66
      },
      nodeSassTimeout: {
        title: '\'node-sass\' execution timeout',
        description: 'Maximal execution time of \'node-sass\'',
        type: 'integer',
        "default": 10000,
        order: 80
      },
      nodeSassPath: {
        title: 'Path to \'node-sass\' command',
        description: 'Absolute path where \'node-sass\' executable is placed. Please read documentation before usage!',
        type: 'string',
        "default": '',
        order: 81
      }
    },
    sassAutocompileView: null,
    mainSubmenu: null,
    contextMenuItem: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.editorSubscriptions = new CompositeDisposable;
      this.sassAutocompileView = new SassAutocompileView(new SassAutocompileOptions(), state.sassAutocompileViewState);
      this.isProcessing = false;
      if (SassAutocompileOptions.get('enabled')) {
        SassAutocompileOptions.set('compileOnSave', SassAutocompileOptions.get('enabled'));
        SassAutocompileOptions.unset('enabled');
      }
      if (SassAutocompileOptions.get('outputStyle')) {
        SassAutocompileOptions.unset('outputStyle');
      }
      if (SassAutocompileOptions.get('macOsNodeSassPath')) {
        SassAutocompileOptions.set('nodeSassPath', SassAutocompileOptions.get('macOsNodeSassPath'));
        SassAutocompileOptions.unset('macOsNodeSassPath');
      }
      this.registerCommands();
      this.registerTextEditorSaveCallback();
      this.registerConfigObserver();
      return this.registerContextMenuItem();
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.editorSubscriptions.dispose();
      return this.sassAutocompileView.destroy();
    },
    serialize: function() {
      return {
        sassAutocompileViewState: this.sassAutocompileView.serialize()
      };
    },
    registerCommands: function() {
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'sass-autocompile:compile-to-file': (function(_this) {
          return function(evt) {
            return _this.compileToFile(evt);
          };
        })(this),
        'sass-autocompile:compile-direct': (function(_this) {
          return function(evt) {
            return _this.compileDirect(evt);
          };
        })(this),
        'sass-autocompile:toggle-compile-on-save': (function(_this) {
          return function() {
            return _this.toggleCompileOnSave();
          };
        })(this),
        'sass-autocompile:toggle-output-style-nested': (function(_this) {
          return function() {
            return _this.toggleOutputStyle('Nested');
          };
        })(this),
        'sass-autocompile:toggle-output-style-compact': (function(_this) {
          return function() {
            return _this.toggleOutputStyle('Compact');
          };
        })(this),
        'sass-autocompile:toggle-output-style-expanded': (function(_this) {
          return function() {
            return _this.toggleOutputStyle('Expanded');
          };
        })(this),
        'sass-autocompile:toggle-output-style-compressed': (function(_this) {
          return function() {
            return _this.toggleOutputStyle('Compressed');
          };
        })(this),
        'sass-autocompile:compile-every-sass-file': (function(_this) {
          return function() {
            return _this.selectCompileFileType('every');
          };
        })(this),
        'sass-autocompile:compile-only-with-first-line-comment': (function(_this) {
          return function() {
            return _this.selectCompileFileType('first-line-comment');
          };
        })(this),
        'sass-autocompile:toggle-check-output-file-already-exists': (function(_this) {
          return function() {
            return _this.toggleCheckOutputFileAlreadyExists();
          };
        })(this),
        'sass-autocompile:toggle-directly-jump-to-error': (function(_this) {
          return function() {
            return _this.toggleDirectlyJumpToError();
          };
        })(this),
        'sass-autocompile:toggle-show-compile-sass-item-in-tree-view-context-menu': (function(_this) {
          return function() {
            return _this.toggleShowCompileSassItemInTreeViewContextMenu();
          };
        })(this),
        'sass-autocompile:close-message-panel': (function(_this) {
          return function(evt) {
            _this.closePanel();
            return evt.abortKeyBinding();
          };
        })(this)
      }));
    },
    compileToFile: function(evt) {
      var activeEditor, filename, isFileItem, target;
      filename = void 0;
      if (evt.target.nodeName.toLowerCase() === 'atom-text-editor' || evt.target.nodeName.toLowerCase() === 'input') {
        activeEditor = atom.workspace.getActiveTextEditor();
        if (activeEditor) {
          filename = activeEditor.getURI();
        }
      } else {
        target = evt.target;
        if (evt.target.nodeName.toLowerCase() === 'span') {
          target = evt.target.parentNode;
        }
        isFileItem = target.getAttribute('class').split(' ').indexOf('file') >= 0;
        if (isFileItem) {
          filename = target.firstElementChild.getAttribute('data-path');
        }
      }
      if (this.isSassFile(filename)) {
        return this.compile(NodeSassCompiler.MODE_FILE, filename, false);
      }
    },
    compileDirect: function(evt) {
      if (!atom.workspace.getActiveTextEditor()) {
        return;
      }
      return this.compile(NodeSassCompiler.MODE_DIRECT);
    },
    toggleCompileOnSave: function() {
      SassAutocompileOptions.set('compileOnSave', !SassAutocompileOptions.get('compileOnSave'));
      if (SassAutocompileOptions.get('compileOnSave')) {
        atom.notifications.addInfo('SASS-AutoCompile: Enabled compile on save');
      } else {
        atom.notifications.addWarning('SASS-AutoCompile: Disabled compile on save');
      }
      return this.updateMenuItems();
    },
    toggleOutputStyle: function(outputStyle) {
      switch (outputStyle.toLowerCase()) {
        case 'compressed':
          SassAutocompileOptions.set('compileCompressed', !SassAutocompileOptions.get('compileCompressed'));
          break;
        case 'compact':
          SassAutocompileOptions.set('compileCompact', !SassAutocompileOptions.get('compileCompact'));
          break;
        case 'nested':
          SassAutocompileOptions.set('compileNested', !SassAutocompileOptions.get('compileNested'));
          break;
        case 'expanded':
          SassAutocompileOptions.set('compileExpanded', !SassAutocompileOptions.get('compileExpanded'));
      }
      return this.updateMenuItems();
    },
    selectCompileFileType: function(type) {
      if (type === 'every') {
        SassAutocompileOptions.set('compileFiles', 'Every SASS file');
      } else if (type === 'first-line-comment') {
        SassAutocompileOptions.set('compileFiles', 'Only with first-line-comment');
      }
      return this.updateMenuItems();
    },
    toggleCheckOutputFileAlreadyExists: function() {
      SassAutocompileOptions.set('checkOutputFileAlreadyExists', !SassAutocompileOptions.get('checkOutputFileAlreadyExists'));
      return this.updateMenuItems();
    },
    toggleDirectlyJumpToError: function() {
      SassAutocompileOptions.set('directlyJumpToError', !SassAutocompileOptions.get('directlyJumpToError'));
      return this.updateMenuItems();
    },
    toggleShowCompileSassItemInTreeViewContextMenu: function() {
      SassAutocompileOptions.set('showCompileSassItemInTreeViewContextMenu', !SassAutocompileOptions.get('showCompileSassItemInTreeViewContextMenu'));
      return this.updateMenuItems();
    },
    compile: function(mode, filename, minifyOnSave) {
      var options;
      if (filename == null) {
        filename = null;
      }
      if (minifyOnSave == null) {
        minifyOnSave = false;
      }
      if (this.isProcessing) {
        return;
      }
      options = new SassAutocompileOptions();
      this.isProcessing = true;
      this.sassAutocompileView.updateOptions(options);
      this.sassAutocompileView.hidePanel(false, true);
      this.compiler = new NodeSassCompiler(options);
      this.compiler.onStart((function(_this) {
        return function(args) {
          return _this.sassAutocompileView.startCompilation(args);
        };
      })(this));
      this.compiler.onWarning((function(_this) {
        return function(args) {
          return _this.sassAutocompileView.warning(args);
        };
      })(this));
      this.compiler.onSuccess((function(_this) {
        return function(args) {
          return _this.sassAutocompileView.successfullCompilation(args);
        };
      })(this));
      this.compiler.onError((function(_this) {
        return function(args) {
          return _this.sassAutocompileView.erroneousCompilation(args);
        };
      })(this));
      this.compiler.onFinished((function(_this) {
        return function(args) {
          _this.sassAutocompileView.finished(args);
          _this.isProcessing = false;
          _this.compiler.destroy();
          return _this.compiler = null;
        };
      })(this));
      return this.compiler.compile(mode, filename, minifyOnSave);
    },
    registerTextEditorSaveCallback: function() {
      return this.editorSubscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.subscriptions.add(editor.onDidSave(function() {
            if (!_this.isProcessing && editor && editor.getURI && _this.isSassFile(editor.getURI())) {
              return _this.compile(NodeSassCompiler.MODE_FILE, editor.getURI(), true);
            }
          }));
        };
      })(this)));
    },
    isSassFile: function(filename) {
      return File.hasFileExtension(filename, ['.scss', '.sass']);
    },
    registerConfigObserver: function() {
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileOnSave', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileFiles', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'checkOutputFileAlreadyExists', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'directlyJumpToError', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'showCompileSassItemInTreeViewContextMenu', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileCompressed', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileCompact', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileNested', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe(SassAutocompileOptions.OPTIONS_PREFIX + 'compileExpanded', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
    },
    registerContextMenuItem: function() {
      var menuItem;
      menuItem = this.getContextMenuItem();
      return menuItem.shouldDisplay = (function(_this) {
        return function(evt) {
          var child, filename, isFileItem, showItemOption, target;
          showItemOption = SassAutocompileOptions.get('showCompileSassItemInTreeViewContextMenu');
          if (showItemOption) {
            target = evt.target;
            if (target.nodeName.toLowerCase() === 'span') {
              target = target.parentNode;
            }
            isFileItem = target.getAttribute('class').split(' ').indexOf('file') >= 0;
            if (isFileItem) {
              child = target.firstElementChild;
              filename = child.getAttribute('data-name');
              return _this.isSassFile(filename);
            }
          }
          return false;
        };
      })(this);
    },
    updateMenuItems: function() {
      var compileFileMenu, menu, outputStylesMenu;
      menu = this.getMainMenuSubmenu().submenu;
      if (!menu) {
        return;
      }
      menu[3].label = (SassAutocompileOptions.get('compileOnSave') ? '✔' : '✕') + '  Compile on Save';
      menu[4].label = (SassAutocompileOptions.get('checkOutputFileAlreadyExists') ? '✔' : '✕') + '  Check output file already exists';
      menu[5].label = (SassAutocompileOptions.get('directlyJumpToError') ? '✔' : '✕') + '  Directly jump to error';
      menu[6].label = (SassAutocompileOptions.get('showCompileSassItemInTreeViewContextMenu') ? '✔' : '✕') + '  Show \'Compile SASS\' item in tree view context menu';
      compileFileMenu = menu[8].submenu;
      if (compileFileMenu) {
        compileFileMenu[0].checked = SassAutocompileOptions.get('compileFiles') === 'Every SASS file';
        compileFileMenu[1].checked = SassAutocompileOptions.get('compileFiles') === 'Only with first-line-comment';
      }
      outputStylesMenu = menu[9].submenu;
      if (outputStylesMenu) {
        outputStylesMenu[0].label = (SassAutocompileOptions.get('compileCompressed') ? '✔' : '✕') + '  Compressed';
        outputStylesMenu[1].label = (SassAutocompileOptions.get('compileCompact') ? '✔' : '✕') + '  Compact';
        outputStylesMenu[2].label = (SassAutocompileOptions.get('compileNested') ? '✔' : '✕') + '  Nested';
        outputStylesMenu[3].label = (SassAutocompileOptions.get('compileExpanded') ? '✔' : '✕') + '  Expanded';
      }
      return atom.menu.update();
    },
    getMainMenuSubmenu: function() {
      var found, i, j, len, len1, menu, ref, ref1, submenu;
      if (this.mainSubmenu === null) {
        found = false;
        ref = atom.menu.template;
        for (i = 0, len = ref.length; i < len; i++) {
          menu = ref[i];
          if (menu.label === 'Packages' || menu.label === '&Packages') {
            found = true;
            ref1 = menu.submenu;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              submenu = ref1[j];
              if (submenu.label === 'SASS Autocompile') {
                this.mainSubmenu = submenu;
                break;
              }
            }
          }
          if (found) {
            break;
          }
        }
      }
      return this.mainSubmenu;
    },
    getContextMenuItem: function() {
      var found, i, item, items, j, len, len1, ref, ref1;
      if (this.contextMenuItem === null) {
        found = false;
        ref = atom.contextMenu.itemSets;
        for (i = 0, len = ref.length; i < len; i++) {
          items = ref[i];
          if (items.selector === '.tree-view') {
            ref1 = items.items;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              item = ref1[j];
              if (item.id === 'sass-autocompile-context-menu-compile') {
                found = true;
                this.contextMenuItem = item;
                break;
              }
            }
          }
          if (found) {
            break;
          }
        }
      }
      return this.contextMenuItem;
    },
    closePanel: function() {
      return this.sassAutocompileView.hidePanel();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9zYXNzLWF1dG9jb21waWxlL2xpYi9zYXNzLWF1dG9jb21waWxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixzQkFBQSxHQUF5QixPQUFBLENBQVEsV0FBUjs7RUFDekIsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSOztFQUN0QixnQkFBQSxHQUFtQixPQUFBLENBQVEsWUFBUjs7RUFFbkIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSOztFQUdQLE1BQU0sQ0FBQyxPQUFQLEdBRUk7SUFBQSxNQUFBLEVBSUk7TUFBQSxhQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8saUJBQVA7UUFDQSxXQUFBLEVBQWEsaURBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtRQUlBLEtBQUEsRUFBTyxFQUpQO09BREo7TUFPQSxZQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sbUJBQVA7UUFDQSxXQUFBLEVBQWEsMERBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyw4QkFBRCxFQUFpQyxpQkFBakMsQ0FITjtRQUlBLENBQUEsT0FBQSxDQUFBLEVBQVMsaUJBSlQ7UUFLQSxLQUFBLEVBQU8sRUFMUDtPQVJKO01BZUEsZUFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGtCQUFQO1FBQ0EsV0FBQSxFQUFhLGdIQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQWhCSjtNQXNCQSw0QkFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLDRDQUFQO1FBQ0EsV0FBQSxFQUFhLGlGQURiO1FBRUEsSUFBQSxFQUFNLFNB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QkFISjs7QUFESixhQURKOztVQU9BLElBQUcsS0FBSDtBQUNJLGtCQURKOztBQVJKLFNBRko7O0FBWUEsYUFBTyxJQUFDLENBQUE7SUFiUSxDQTVoQnBCO0lBNGlCQSxVQUFBLEVBQVksU0FBQTthQUNSLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxTQUFyQixDQUFBO0lBRFEsQ0E1aUJaOztBQVhKIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSgnYXRvbScpXG5cblNhc3NBdXRvY29tcGlsZU9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbnMnKVxuU2Fzc0F1dG9jb21waWxlVmlldyA9IHJlcXVpcmUoJy4vc2Fzcy1hdXRvY29tcGlsZS12aWV3Jylcbk5vZGVTYXNzQ29tcGlsZXIgPSByZXF1aXJlKCcuL2NvbXBpbGVyJylcblxuRmlsZSA9IHJlcXVpcmUoJy4vaGVscGVyL2ZpbGUnKVxuXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICAgIGNvbmZpZzpcblxuICAgICAgICAjIEdlbmVyYWwgc2V0dGluZ3NcblxuICAgICAgICBjb21waWxlT25TYXZlOlxuICAgICAgICAgICAgdGl0bGU6ICdDb21waWxlIG9uIFNhdmUnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgb3B0aW9uIGVuLS9kaXNhYmxlcyBhdXRvIGNvbXBpbGluZyBvbiBzYXZlJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgICBvcmRlcjogMTBcblxuICAgICAgICBjb21waWxlRmlsZXM6XG4gICAgICAgICAgICB0aXRsZTogJ0NvbXBpbGUgZmlsZXMgLi4uJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDaG9vc2Ugd2hpY2ggU0FTUyBmaWxlcyB5b3Ugd2FudCB0aGlzIHBhY2thZ2UgdG8gY29tcGlsZSdcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBlbnVtOiBbJ09ubHkgd2l0aCBmaXJzdC1saW5lLWNvbW1lbnQnLCAnRXZlcnkgU0FTUyBmaWxlJ11cbiAgICAgICAgICAgIGRlZmF1bHQ6ICdFdmVyeSBTQVNTIGZpbGUnXG4gICAgICAgICAgICBvcmRlcjogMTFcblxuICAgICAgICBjb21waWxlUGFydGlhbHM6XG4gICAgICAgICAgICB0aXRsZTogJ0NvbXBpbGUgUGFydGlhbHMnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbnRyb2xzIGNvbXBpbGF0aW9uIG9mIFBhcnRpYWxzICh1bmRlcnNjb3JlIGFzIGZpcnN0IGNoYXJhY3RlciBpbiBmaWxlbmFtZSkgaWYgdGhlcmUgaXMgbm8gZmlyc3QtbGluZS1jb21tZW50J1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgb3JkZXI6IDEyXG5cbiAgICAgICAgY2hlY2tPdXRwdXRGaWxlQWxyZWFkeUV4aXN0czpcbiAgICAgICAgICAgIHRpdGxlOiAnQXNrIGZvciBvdmVyd3JpdGluZyBhbHJlYWR5IGV4aXN0ZW50IGZpbGVzJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiB0YXJnZXQgZmlsZSBhbHJlYWR5IGV4aXN0cywgc2Fzcy1hdXRvY29tcGlsZSB3aWxsIGFzayB5b3UgYmVmb3JlIG92ZXJ3cml0aW5nJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgb3JkZXI6IDEzXG5cbiAgICAgICAgZGlyZWN0bHlKdW1wVG9FcnJvcjpcbiAgICAgICAgICAgIHRpdGxlOiAnRGlyZWN0bHkganVtcCB0byBlcnJvcidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCBhbmQgeW91IGNvbXBpbGUgYW4gZXJyb25lb3VzIFNBU1MgZmlsZSwgdGhpcyBmaWxlIGlzIG9wZW5lZCBhbmQganVtcGVkIHRvIHRoZSBwcm9ibGVtYXRpYyBwb3NpdGlvbi4nXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBvcmRlcjogMTRcblxuICAgICAgICBzaG93Q29tcGlsZVNhc3NJdGVtSW5UcmVlVmlld0NvbnRleHRNZW51OlxuICAgICAgICAgICAgdGl0bGU6ICdTaG93IFxcJ0NvbXBpbGUgU0FTU1xcJyBpdGVtIGluIFRyZWUgVmlldyBjb250ZXh0IG1lbnUnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQsIFRyZWUgVmlldyBjb250ZXh0IG1lbnUgY29udGFpbnMgYSBcXCdDb21waWxlIFNBU1NcXCcgaXRlbSB0aGF0IGFsbG93cyB5b3UgdG8gY29tcGlsZSB0aGF0IGZpbGUgdmlhIGNvbnRleHQgbWVudSdcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgICAgIG9yZGVyOiAxNVxuXG5cbiAgICAgICAgIyBub2RlLXNhc3Mgb3B0aW9uc1xuXG4gICAgICAgIGNvbXBpbGVDb21wcmVzc2VkOlxuICAgICAgICAgICAgdGl0bGU6ICdDb21waWxlIHdpdGggXFwnY29tcHJlc3NlZFxcJyBvdXRwdXQgc3R5bGUnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQgU0FTUyBmaWxlcyBhcmUgY29tcGlsZWQgd2l0aCBcXCdjb21wcmVzc2VkXFwnIG91dHB1dCBzdHlsZS4gUGxlYXNlIGRlZmluZSBhIGNvcnJlc3BvbmRpbmcgb3V0cHV0IGZpbGVuYW1lIHBhdHRlcm4gb3IgdXNlIGlubGluZSBwYXJhbWV0ZXIgXFwnY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVyblxcJydcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgb3JkZXI6IDMwXG5cbiAgICAgICAgY29tcHJlc3NlZEZpbGVuYW1lUGF0dGVybjpcbiAgICAgICAgICAgIHRpdGxlOiAnRmlsZW5hbWUgcGF0dGVybiBmb3IgXFwnY29tcHJlc3NlZFxcJyBjb21waWxlZCBmaWxlcydcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGVmaW5lIHRoZSByZXBsYWNlbWVudCBwYXR0ZXJuIGZvciBjb21waWxlZCBmaWxlbmFtZXMgd2l0aCBcXCdjb21wcmVzc2VkXFwnIG91dHB1dCBzdHlsZS4gUGxhY2Vob2xkZXJzIGFyZTogXFwnJDFcXCcgZm9yIGJhc2VuYW1lIG9mIGZpbGUgYW5kIFxcJyQyXFwnIGZvciBvcmlnaW5hbCBmaWxlIGV4dGVuc2lvbi4nXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJyQxLm1pbi5jc3MnXG4gICAgICAgICAgICBvcmRlcjogMzFcblxuICAgICAgICBjb21waWxlQ29tcGFjdDpcbiAgICAgICAgICAgIHRpdGxlOiAnQ29tcGlsZSB3aXRoIFxcJ2NvbXBhY3RcXCcgb3V0cHV0IHN0eWxlJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkIFNBU1MgZmlsZXMgYXJlIGNvbXBpbGVkIHdpdGggXFwnY29tcGFjdFxcJyBvdXRwdXQgc3R5bGUuIFBsZWFzZSBkZWZpbmUgYSBjb3JyZXNwb25kaW5nIG91dHB1dCBmaWxlbmFtZSBwYXR0ZXJuIG9yIHVzZSBpbmxpbmUgcGFyYW1ldGVyIFxcJ2NvbXBhY3RGaWxlbmFtZVBhdHRlcm5cXCcnXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBvcmRlcjogMzJcblxuICAgICAgICBjb21wYWN0RmlsZW5hbWVQYXR0ZXJuOlxuICAgICAgICAgICAgdGl0bGU6ICdGaWxlbmFtZSBwYXR0ZXJuIGZvciBcXCdjb21wYWN0XFwnIGNvbXBpbGVkIGZpbGVzJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdEZWZpbmUgdGhlIHJlcGxhY2VtZW50IHBhdHRlcm4gZm9yIGNvbXBpbGVkIGZpbGVuYW1lcyB3aXRoIFxcJ2NvbXBhY3RcXCcgb3V0cHV0IHN0eWxlLiBQbGFjZWhvbGRlcnMgYXJlOiBcXCckMVxcJyBmb3IgYmFzZW5hbWUgb2YgZmlsZSBhbmQgXFwnJDJcXCcgZm9yIG9yaWdpbmFsIGZpbGUgZXh0ZW5zaW9uLidcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiAnJDEuY29tcGFjdC5jc3MnXG4gICAgICAgICAgICBvcmRlcjogMzNcblxuICAgICAgICBjb21waWxlTmVzdGVkOlxuICAgICAgICAgICAgdGl0bGU6ICdDb21waWxlIHdpdGggXFwnbmVzdGVkXFwnIG91dHB1dCBzdHlsZSdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCBTQVNTIGZpbGVzIGFyZSBjb21waWxlZCB3aXRoIFxcJ25lc3RlZFxcJyBvdXRwdXQgc3R5bGUuIFBsZWFzZSBkZWZpbmUgYSBjb3JyZXNwb25kaW5nIG91dHB1dCBmaWxlbmFtZSBwYXR0ZXJuIG9yIHVzZSBpbmxpbmUgcGFyYW1ldGVyIFxcJ25lc3RlZEZpbGVuYW1lUGF0dGVyblxcJydcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiAzNFxuXG4gICAgICAgIG5lc3RlZEZpbGVuYW1lUGF0dGVybjpcbiAgICAgICAgICAgIHRpdGxlOiAnRmlsZW5hbWUgcGF0dGVybiBmb3IgXFwnbmVzdGVkXFwnIGNvbXBpbGVkIGZpbGVzJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdEZWZpbmUgdGhlIHJlcGxhY2VtZW50IHBhdHRlcm4gZm9yIGNvbXBpbGVkIGZpbGVuYW1lcyB3aXRoIFxcJ25lc3RlZFxcJyBvdXRwdXQgc3R5bGUuIFBsYWNlaG9sZGVycyBhcmU6IFxcJyQxXFwnIGZvciBiYXNlbmFtZSBvZiBmaWxlIGFuZCBcXCckMlxcJyBmb3Igb3JpZ2luYWwgZmlsZSBleHRlbnNpb24uJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICckMS5uZXN0ZWQuY3NzJ1xuICAgICAgICAgICAgb3JkZXI6IDM1XG5cbiAgICAgICAgY29tcGlsZUV4cGFuZGVkOlxuICAgICAgICAgICAgdGl0bGU6ICdDb21waWxlIHdpdGggXFwnZXhwYW5kZWRcXCcgb3V0cHV0IHN0eWxlJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkIFNBU1MgZmlsZXMgYXJlIGNvbXBpbGVkIHdpdGggXFwnZXhwYW5kZWRcXCcgb3V0cHV0IHN0eWxlLiBQbGVhc2UgZGVmaW5lIGEgY29ycmVzcG9uZGluZyBvdXRwdXQgZmlsZW5hbWUgcGF0dGVybiBvciB1c2UgaW5saW5lIHBhcmFtZXRlciBcXCdleHBhbmRlZEZpbGVuYW1lUGF0dGVyblxcJydcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiAzNlxuXG4gICAgICAgIGV4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuOlxuICAgICAgICAgICAgdGl0bGU6ICdGaWxlbmFtZSBwYXR0ZXJuIGZvciBcXCdleHBhbmRlZFxcJyBjb21waWxlZCBmaWxlcydcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGVmaW5lIHRoZSByZXBsYWNlbWVudCBwYXR0ZXJuIGZvciBjb21waWxlZCBmaWxlbmFtZXMgd2l0aCBcXCdleHBhbmRlZFxcJyBvdXRwdXQgc3R5bGUuIFBsYWNlaG9sZGVycyBhcmU6IFxcJyQxXFwnIGZvciBiYXNlbmFtZSBvZiBmaWxlIGFuZCBcXCckMlxcJyBmb3Igb3JpZ2luYWwgZmlsZSBleHRlbnNpb24uJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICckMS5jc3MnXG4gICAgICAgICAgICBvcmRlcjogMzdcblxuICAgICAgICBpbmRlbnRUeXBlOlxuICAgICAgICAgICAgdGl0bGU6ICdJbmRlbnQgdHlwZSdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW5kZW50IHR5cGUgZm9yIG91dHB1dCBDU1MnXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZW51bTogWydTcGFjZScsICdUYWInXVxuICAgICAgICAgICAgZGVmYXVsdDogJ1NwYWNlJ1xuICAgICAgICAgICAgb3JkZXI6IDM4XG5cbiAgICAgICAgaW5kZW50V2lkdGg6XG4gICAgICAgICAgICB0aXRsZTogJ0luZGVudCB3aWR0aCdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW5kZW50IHdpZHRoOyBudW1iZXIgb2Ygc3BhY2VzIG9yIHRhYnMnXG4gICAgICAgICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgICAgICAgIGVudW06IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMF1cbiAgICAgICAgICAgIGRlZmF1bHQ6IDJcbiAgICAgICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgICAgIG1heGltdW06IDEwXG4gICAgICAgICAgICBvcmRlcjogMzlcblxuICAgICAgICBsaW5lZmVlZDpcbiAgICAgICAgICAgIHRpdGxlOiAnTGluZWZlZWQnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1VzZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdG8gdXNlIFxcJ2NyXFwnLCBcXCdjcmxmXFwnLCBcXCdsZlxcJyBvciBcXCdsZmNyXFwnIHNlcXVlbmNlIGZvciBsaW5lIGJyZWFrJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGVudW06IFsnY3InLCAnY3JsZicsICdsZicsICdsZmNyJ11cbiAgICAgICAgICAgIGRlZmF1bHQ6ICdsZidcbiAgICAgICAgICAgIG9yZGVyOiA0MFxuXG4gICAgICAgIHNvdXJjZU1hcDpcbiAgICAgICAgICAgIHRpdGxlOiAnQnVpbGQgc291cmNlIG1hcCdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCBhIHNvdXJjZSBtYXAgaXMgZ2VuZXJhdGVkJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgb3JkZXI6IDQxXG5cbiAgICAgICAgc291cmNlTWFwRW1iZWQ6XG4gICAgICAgICAgICB0aXRsZTogJ0VtYmVkIHNvdXJjZSBtYXAnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQgc291cmNlIG1hcCBpcyBlbWJlZGRlZCBhcyBhIGRhdGEgVVJJJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgb3JkZXI6IDQyXG5cbiAgICAgICAgc291cmNlTWFwQ29udGVudHM6XG4gICAgICAgICAgICB0aXRsZTogJ0luY2x1ZGUgY29udGVudHMgaW4gc291cmNlIG1hcCBpbmZvcm1hdGlvbidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCBjb250ZW50cyBhcmUgaW5jbHVkZWQgaW4gc291cmNlIG1hcCBpbmZvcm1hdGlvbidcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiA0M1xuXG4gICAgICAgIHNvdXJjZUNvbW1lbnRzOlxuICAgICAgICAgICAgdGl0bGU6ICdJbmNsdWRlIGFkZGl0aW9uYWwgZGVidWdnaW5nIGluZm9ybWF0aW9uIGluIHRoZSBvdXRwdXQgQ1NTIGZpbGUnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQgYWRkaXRpb25hbCBkZWJ1Z2dpbmcgaW5mb3JtYXRpb24gYXJlIGFkZGVkIHRvIHRoZSBvdXRwdXQgZmlsZSBhcyBDU1MgY29tbWVudHMuIElmIENTUyBpcyBjb21wcmVzc2VkIHRoaXMgZmVhdHVyZSBpcyBkaXNhYmxlZCBieSBTQVNTIGNvbXBpbGVyJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgb3JkZXI6IDQ0XG5cbiAgICAgICAgaW5jbHVkZVBhdGg6XG4gICAgICAgICAgICB0aXRsZTogJ0luY2x1ZGUgcGF0aHMnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1BhdGhzIHRvIGxvb2sgZm9yIGltcG9ydGVkIGZpbGVzIChAaW1wb3J0IGRlY2xhcmF0aW9ucyk7IGNvbW1hIHNlcGFyYXRlZCwgZWFjaCBwYXRoIHN1cnJvdW5kZWQgYnkgcXVvdGVzJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgICAgICBvcmRlcjogNDVcblxuICAgICAgICBwcmVjaXNpb246XG4gICAgICAgICAgICB0aXRsZTogJ1ByZWNpc2lvbidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVXNlZCB0byBkZXRlcm1pbmUgaG93IG1hbnkgZGlnaXRzIGFmdGVyIHRoZSBkZWNpbWFsIHdpbGwgYmUgYWxsb3dlZC4gRm9yIGluc3RhbmNlLCBpZiB5b3UgaGFkIGEgZGVjaW1hbCBudW1iZXIgb2YgMS4yMzQ1Njc4OSBhbmQgYSBwcmVjaXNpb24gb2YgNSwgdGhlIHJlc3VsdCB3aWxsIGJlIDEuMjM0NTcgaW4gdGhlIGZpbmFsIENTUydcbiAgICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgICAgICAgZGVmYXVsdDogNVxuICAgICAgICAgICAgbWluaW11bTogMFxuICAgICAgICAgICAgb3JkZXI6IDQ2XG5cbiAgICAgICAgaW1wb3J0ZXI6XG4gICAgICAgICAgICB0aXRsZTogJ0ZpbGVuYW1lIHRvIGN1c3RvbSBpbXBvcnRlcidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUGF0aCB0byAuanMgZmlsZSBjb250YWluaW5nIGN1c3RvbSBpbXBvcnRlcidcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICAgICAgb3JkZXI6IDQ3XG5cbiAgICAgICAgZnVuY3Rpb25zOlxuICAgICAgICAgICAgdGl0bGU6ICdGaWxlbmFtZSB0byBjdXN0b20gZnVuY3Rpb25zJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQYXRoIHRvIC5qcyBmaWxlIGNvbnRhaW5pbmcgY3VzdG9tIGZ1bmN0aW9ucydcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiAnJ1xuICAgICAgICAgICAgb3JkZXI6IDQ4XG5cblxuICAgICAgICAjIE5vdGlmaWNhdGlvbiBvcHRpb25zXG5cbiAgICAgICAgbm90aWZpY2F0aW9uczpcbiAgICAgICAgICAgIHRpdGxlOiAnTm90aWZpY2F0aW9uIHR5cGUnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NlbGVjdCB3aGljaCB0eXBlcyBvZiBub3RpZmljYXRpb25zIHlvdSB3aXNoIHRvIHNlZSdcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBlbnVtOiBbJ1BhbmVsJywgJ05vdGlmaWNhdGlvbnMnLCAnUGFuZWwsIE5vdGlmaWNhdGlvbnMnXVxuICAgICAgICAgICAgZGVmYXVsdDogJ1BhbmVsJ1xuICAgICAgICAgICAgb3JkZXI6IDYwXG5cbiAgICAgICAgYXV0b0hpZGVQYW5lbDpcbiAgICAgICAgICAgIHRpdGxlOiAnQXV0b21hdGljYWxseSBoaWRlIHBhbmVsIG9uIC4uLidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2VsZWN0IG9uIHdoaWNoIGV2ZW50IHRoZSBwYW5lbCBzaG91bGQgYXV0b21hdGljYWxseSBkaXNhcHBlYXInXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZW51bTogWydOZXZlcicsICdTdWNjZXNzJywgJ0Vycm9yJywgJ1N1Y2Nlc3MsIEVycm9yJ11cbiAgICAgICAgICAgIGRlZmF1bHQ6ICdTdWNjZXNzJ1xuICAgICAgICAgICAgb3JkZXI6IDYxXG5cbiAgICAgICAgYXV0b0hpZGVQYW5lbERlbGF5OlxuICAgICAgICAgICAgdGl0bGU6ICdQYW5lbC1hdXRvLWhpZGUgZGVsYXknXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0RlbGF5IGFmdGVyIHdoaWNoIHBhbmVsIGlzIGF1dG9tYXRpY2FsbHkgaGlkZGVuJ1xuICAgICAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICAgICAgICBkZWZhdWx0OiAzMDAwXG4gICAgICAgICAgICBvcmRlcjogNjJcblxuICAgICAgICBhdXRvSGlkZU5vdGlmaWNhdGlvbnM6XG4gICAgICAgICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgaGlkZSBub3RpZmljYXRpb25zIG9uIC4uLidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2VsZWN0IHdoaWNoIHR5cGVzIG9mIG5vdGlmaWNhdGlvbnMgc2hvdWxkIGF1dG9tYXRpY2FsbHkgZGlzYXBwZWFyJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGVudW06IFsnTmV2ZXInLCAnSW5mbywgU3VjY2VzcycsICdFcnJvcicsICdJbmZvLCBTdWNjZXNzLCBFcnJvciddXG4gICAgICAgICAgICBkZWZhdWx0OiAnSW5mbywgU3VjY2VzcydcbiAgICAgICAgICAgIG9yZGVyOiA2M1xuXG4gICAgICAgIHNob3dTdGFydENvbXBpbGluZ05vdGlmaWNhdGlvbjpcbiAgICAgICAgICAgIHRpdGxlOiAnU2hvdyBcXCdTdGFydCBDb21waWxpbmdcXCcgTm90aWZpY2F0aW9uJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkIGEgXFwnU3RhcnQgQ29tcGlsaW5nXFwnIG5vdGlmaWNhdGlvbiBpcyBzaG93bidcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiA2NFxuXG4gICAgICAgIHNob3dBZGRpdGlvbmFsQ29tcGlsYXRpb25JbmZvOlxuICAgICAgICAgICAgdGl0bGU6ICdTaG93IGFkZGl0aW9uYWwgY29tcGlsYXRpb24gaW5mbydcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCBhZGRpdGlvbmEgaW5mb3MgbGlrZSBkdXJhdGlvbiBvciBmaWxlIHNpemUgaXMgcHJlc2VudGVkJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgICBvcmRlcjogNjVcblxuICAgICAgICBzaG93Tm9kZVNhc3NPdXRwdXQ6XG4gICAgICAgICAgICB0aXRsZTogJ1Nob3cgbm9kZS1zYXNzIG91dHB1dCBhZnRlciBjb21waWxhdGlvbidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCBkZXRhaWxlZCBvdXRwdXQgb2Ygbm9kZS1zYXNzIGNvbW1hbmQgaXMgc2hvd24gaW4gYSBuZXcgdGFiIHNvIHlvdSBjYW4gYW5hbHlzZSBvdXRwdXQnXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBvcmRlcjogNjZcblxuICAgICAgICBzaG93T2xkUGFyYW1ldGVyc1dhcm5pbmc6XG4gICAgICAgICAgICB0aXRsZTogJ1Nob3cgd2FybmluZyB3aGVuIHVzaW5nIG9sZCBwYXJhbXRlcnMnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQgYW55IHRpbWUgeW91IGNvbXBpbGUgYSBTQVNTIGZpbGUgdW5kIHlvdSB1c2Ugb2xkIGlubGluZSBwYXJhbXRlcnMsIGFuIHdhcm5pbmcgd2lsbCBiZSBvY2N1ciBub3QgdG8gdXNlIHRoZW0nXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgICAgIG9yZGVyOiA2NlxuXG5cbiAgICAgICAgIyBBZHZhbmNlZCBvcHRpb25zXG5cbiAgICAgICAgbm9kZVNhc3NUaW1lb3V0OlxuICAgICAgICAgICAgdGl0bGU6ICdcXCdub2RlLXNhc3NcXCcgZXhlY3V0aW9uIHRpbWVvdXQnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ01heGltYWwgZXhlY3V0aW9uIHRpbWUgb2YgXFwnbm9kZS1zYXNzXFwnJ1xuICAgICAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICAgICAgICBkZWZhdWx0OiAxMDAwMFxuICAgICAgICAgICAgb3JkZXI6IDgwXG5cbiAgICAgICAgbm9kZVNhc3NQYXRoOlxuICAgICAgICAgICAgdGl0bGU6ICdQYXRoIHRvIFxcJ25vZGUtc2Fzc1xcJyBjb21tYW5kJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBYnNvbHV0ZSBwYXRoIHdoZXJlIFxcJ25vZGUtc2Fzc1xcJyBleGVjdXRhYmxlIGlzIHBsYWNlZC4gUGxlYXNlIHJlYWQgZG9jdW1lbnRhdGlvbiBiZWZvcmUgdXNhZ2UhJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgICAgICBvcmRlcjogODFcblxuXG4gICAgc2Fzc0F1dG9jb21waWxlVmlldzogbnVsbFxuICAgIG1haW5TdWJtZW51OiBudWxsXG4gICAgY29udGV4dE1lbnVJdGVtOiBudWxsXG5cblxuICAgIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICAgICAgQGVkaXRvclN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgICAgIEBzYXNzQXV0b2NvbXBpbGVWaWV3ID0gbmV3IFNhc3NBdXRvY29tcGlsZVZpZXcobmV3IFNhc3NBdXRvY29tcGlsZU9wdGlvbnMoKSwgc3RhdGUuc2Fzc0F1dG9jb21waWxlVmlld1N0YXRlKVxuICAgICAgICBAaXNQcm9jZXNzaW5nID0gZmFsc2VcblxuXG4gICAgICAgICMgRGVwcmVjYXRlZCBvcHRpb24gLS0gUmVtb3ZlIGluIGxhdGVyIHZlcnNpb24hISFcbiAgICAgICAgaWYgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2VuYWJsZWQnKVxuICAgICAgICAgICAgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5zZXQoJ2NvbXBpbGVPblNhdmUnLCBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnZW5hYmxlZCcpKVxuICAgICAgICAgICAgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy51bnNldCgnZW5hYmxlZCcpXG4gICAgICAgIGlmIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdvdXRwdXRTdHlsZScpXG4gICAgICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnVuc2V0KCdvdXRwdXRTdHlsZScpXG4gICAgICAgIGlmIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdtYWNPc05vZGVTYXNzUGF0aCcpXG4gICAgICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnbm9kZVNhc3NQYXRoJywgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ21hY09zTm9kZVNhc3NQYXRoJykpXG4gICAgICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnVuc2V0KCdtYWNPc05vZGVTYXNzUGF0aCcpXG5cblxuICAgICAgICBAcmVnaXN0ZXJDb21tYW5kcygpXG4gICAgICAgIEByZWdpc3RlclRleHRFZGl0b3JTYXZlQ2FsbGJhY2soKVxuICAgICAgICBAcmVnaXN0ZXJDb25maWdPYnNlcnZlcigpXG4gICAgICAgIEByZWdpc3RlckNvbnRleHRNZW51SXRlbSgpXG5cblxuICAgIGRlYWN0aXZhdGU6ICgpIC0+XG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgICAgQHNhc3NBdXRvY29tcGlsZVZpZXcuZGVzdHJveSgpXG5cblxuICAgIHNlcmlhbGl6ZTogKCkgLT5cbiAgICAgICAgc2Fzc0F1dG9jb21waWxlVmlld1N0YXRlOiBAc2Fzc0F1dG9jb21waWxlVmlldy5zZXJpYWxpemUoKVxuXG5cbiAgICByZWdpc3RlckNvbW1hbmRzOiAoKSAtPlxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICAgICAgICdzYXNzLWF1dG9jb21waWxlOmNvbXBpbGUtdG8tZmlsZSc6IChldnQpID0+XG4gICAgICAgICAgICAgICAgQGNvbXBpbGVUb0ZpbGUoZXZ0KVxuXG4gICAgICAgICAgICAnc2Fzcy1hdXRvY29tcGlsZTpjb21waWxlLWRpcmVjdCc6IChldnQpID0+XG4gICAgICAgICAgICAgICAgQGNvbXBpbGVEaXJlY3QoZXZ0KVxuXG4gICAgICAgICAgICAnc2Fzcy1hdXRvY29tcGlsZTp0b2dnbGUtY29tcGlsZS1vbi1zYXZlJzogPT5cbiAgICAgICAgICAgICAgICBAdG9nZ2xlQ29tcGlsZU9uU2F2ZSgpXG5cbiAgICAgICAgICAgICdzYXNzLWF1dG9jb21waWxlOnRvZ2dsZS1vdXRwdXQtc3R5bGUtbmVzdGVkJzogPT5cbiAgICAgICAgICAgICAgICBAdG9nZ2xlT3V0cHV0U3R5bGUoJ05lc3RlZCcpXG5cbiAgICAgICAgICAgICdzYXNzLWF1dG9jb21waWxlOnRvZ2dsZS1vdXRwdXQtc3R5bGUtY29tcGFjdCc6ID0+XG4gICAgICAgICAgICAgICAgQHRvZ2dsZU91dHB1dFN0eWxlKCdDb21wYWN0JylcblxuICAgICAgICAgICAgJ3Nhc3MtYXV0b2NvbXBpbGU6dG9nZ2xlLW91dHB1dC1zdHlsZS1leHBhbmRlZCc6ID0+XG4gICAgICAgICAgICAgICAgQHRvZ2dsZU91dHB1dFN0eWxlKCdFeHBhbmRlZCcpXG5cbiAgICAgICAgICAgICdzYXNzLWF1dG9jb21waWxlOnRvZ2dsZS1vdXRwdXQtc3R5bGUtY29tcHJlc3NlZCc6ID0+XG4gICAgICAgICAgICAgICAgQHRvZ2dsZU91dHB1dFN0eWxlKCdDb21wcmVzc2VkJylcblxuICAgICAgICAgICAgJ3Nhc3MtYXV0b2NvbXBpbGU6Y29tcGlsZS1ldmVyeS1zYXNzLWZpbGUnOiA9PlxuICAgICAgICAgICAgICAgIEBzZWxlY3RDb21waWxlRmlsZVR5cGUoJ2V2ZXJ5JylcblxuICAgICAgICAgICAgJ3Nhc3MtYXV0b2NvbXBpbGU6Y29tcGlsZS1vbmx5LXdpdGgtZmlyc3QtbGluZS1jb21tZW50JzogPT5cbiAgICAgICAgICAgICAgICBAc2VsZWN0Q29tcGlsZUZpbGVUeXBlKCdmaXJzdC1saW5lLWNvbW1lbnQnKVxuXG4gICAgICAgICAgICAnc2Fzcy1hdXRvY29tcGlsZTp0b2dnbGUtY2hlY2stb3V0cHV0LWZpbGUtYWxyZWFkeS1leGlzdHMnOiA9PlxuICAgICAgICAgICAgICAgIEB0b2dnbGVDaGVja091dHB1dEZpbGVBbHJlYWR5RXhpc3RzKClcblxuICAgICAgICAgICAgJ3Nhc3MtYXV0b2NvbXBpbGU6dG9nZ2xlLWRpcmVjdGx5LWp1bXAtdG8tZXJyb3InOiA9PlxuICAgICAgICAgICAgICAgIEB0b2dnbGVEaXJlY3RseUp1bXBUb0Vycm9yKClcblxuICAgICAgICAgICAgJ3Nhc3MtYXV0b2NvbXBpbGU6dG9nZ2xlLXNob3ctY29tcGlsZS1zYXNzLWl0ZW0taW4tdHJlZS12aWV3LWNvbnRleHQtbWVudSc6ID0+XG4gICAgICAgICAgICAgICAgQHRvZ2dsZVNob3dDb21waWxlU2Fzc0l0ZW1JblRyZWVWaWV3Q29udGV4dE1lbnUoKVxuXG4gICAgICAgICAgICAnc2Fzcy1hdXRvY29tcGlsZTpjbG9zZS1tZXNzYWdlLXBhbmVsJzogKGV2dCkgPT5cbiAgICAgICAgICAgICAgICBAY2xvc2VQYW5lbCgpXG4gICAgICAgICAgICAgICAgZXZ0LmFib3J0S2V5QmluZGluZygpXG5cblxuICAgIGNvbXBpbGVUb0ZpbGU6IChldnQpIC0+XG4gICAgICAgIGZpbGVuYW1lID0gdW5kZWZpbmVkXG4gICAgICAgIGlmIGV2dC50YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSBpcyAnYXRvbS10ZXh0LWVkaXRvcicgb3IgZXZ0LnRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpIGlzICdpbnB1dCdcbiAgICAgICAgICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgICAgaWYgYWN0aXZlRWRpdG9yXG4gICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBhY3RpdmVFZGl0b3IuZ2V0VVJJKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGFyZ2V0ID0gZXZ0LnRhcmdldFxuICAgICAgICAgICAgaWYgZXZ0LnRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpIGlzICdzcGFuJ1xuICAgICAgICAgICAgICAgIHRhcmdldD0gZXZ0LnRhcmdldC5wYXJlbnROb2RlXG4gICAgICAgICAgICBpc0ZpbGVJdGVtID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKS5zcGxpdCgnICcpLmluZGV4T2YoJ2ZpbGUnKSA+PSAwXG4gICAgICAgICAgICBpZiBpc0ZpbGVJdGVtXG4gICAgICAgICAgICAgICAgZmlsZW5hbWUgPSB0YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKVxuXG4gICAgICAgIGlmIEBpc1Nhc3NGaWxlKGZpbGVuYW1lKVxuICAgICAgICAgICAgQGNvbXBpbGUoTm9kZVNhc3NDb21waWxlci5NT0RFX0ZJTEUsIGZpbGVuYW1lLCBmYWxzZSlcblxuXG4gICAgY29tcGlsZURpcmVjdDogKGV2dCkgLT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgQGNvbXBpbGUoTm9kZVNhc3NDb21waWxlci5NT0RFX0RJUkVDVClcblxuXG4gICAgdG9nZ2xlQ29tcGlsZU9uU2F2ZTogKCkgLT5cbiAgICAgICAgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5zZXQoJ2NvbXBpbGVPblNhdmUnLCAhU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NvbXBpbGVPblNhdmUnKSlcbiAgICAgICAgaWYgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NvbXBpbGVPblNhdmUnKVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8gJ1NBU1MtQXV0b0NvbXBpbGU6IEVuYWJsZWQgY29tcGlsZSBvbiBzYXZlJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyAnU0FTUy1BdXRvQ29tcGlsZTogRGlzYWJsZWQgY29tcGlsZSBvbiBzYXZlJ1xuICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcblxuXG4gICAgdG9nZ2xlT3V0cHV0U3R5bGU6IChvdXRwdXRTdHlsZSkgLT5cbiAgICAgICAgc3dpdGNoIG91dHB1dFN0eWxlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIHdoZW4gJ2NvbXByZXNzZWQnIHRoZW4gU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5zZXQoJ2NvbXBpbGVDb21wcmVzc2VkJywgIVNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdjb21waWxlQ29tcHJlc3NlZCcpKVxuICAgICAgICAgICAgd2hlbiAnY29tcGFjdCcgdGhlbiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnY29tcGlsZUNvbXBhY3QnLCAhU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NvbXBpbGVDb21wYWN0JykpXG4gICAgICAgICAgICB3aGVuICduZXN0ZWQnIHRoZW4gU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5zZXQoJ2NvbXBpbGVOZXN0ZWQnLCAhU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NvbXBpbGVOZXN0ZWQnKSlcbiAgICAgICAgICAgIHdoZW4gJ2V4cGFuZGVkJyB0aGVuIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuc2V0KCdjb21waWxlRXhwYW5kZWQnLCAhU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NvbXBpbGVFeHBhbmRlZCcpKVxuICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcblxuXG4gICAgc2VsZWN0Q29tcGlsZUZpbGVUeXBlOiAodHlwZSkgLT5cbiAgICAgICAgaWYgdHlwZSBpcyAnZXZlcnknXG4gICAgICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnY29tcGlsZUZpbGVzJywgJ0V2ZXJ5IFNBU1MgZmlsZScpXG4gICAgICAgIGVsc2UgaWYgdHlwZSBpcyAnZmlyc3QtbGluZS1jb21tZW50J1xuICAgICAgICAgICAgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5zZXQoJ2NvbXBpbGVGaWxlcycsICdPbmx5IHdpdGggZmlyc3QtbGluZS1jb21tZW50JylcblxuICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcblxuXG4gICAgdG9nZ2xlQ2hlY2tPdXRwdXRGaWxlQWxyZWFkeUV4aXN0czogKCkgLT5cbiAgICAgICAgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5zZXQoJ2NoZWNrT3V0cHV0RmlsZUFscmVhZHlFeGlzdHMnLCAhU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NoZWNrT3V0cHV0RmlsZUFscmVhZHlFeGlzdHMnKSlcbiAgICAgICAgQHVwZGF0ZU1lbnVJdGVtcygpXG5cblxuICAgIHRvZ2dsZURpcmVjdGx5SnVtcFRvRXJyb3I6ICgpIC0+XG4gICAgICAgIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuc2V0KCdkaXJlY3RseUp1bXBUb0Vycm9yJywgIVNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdkaXJlY3RseUp1bXBUb0Vycm9yJykpXG4gICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuXG5cbiAgICB0b2dnbGVTaG93Q29tcGlsZVNhc3NJdGVtSW5UcmVlVmlld0NvbnRleHRNZW51OiAoKSAtPlxuICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnc2hvd0NvbXBpbGVTYXNzSXRlbUluVHJlZVZpZXdDb250ZXh0TWVudScsICFTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnc2hvd0NvbXBpbGVTYXNzSXRlbUluVHJlZVZpZXdDb250ZXh0TWVudScpKVxuICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcblxuXG4gICAgY29tcGlsZTogKG1vZGUsIGZpbGVuYW1lID0gbnVsbCwgbWluaWZ5T25TYXZlID0gZmFsc2UpIC0+XG4gICAgICAgIGlmIEBpc1Byb2Nlc3NpbmdcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG9wdGlvbnMgPSBuZXcgU2Fzc0F1dG9jb21waWxlT3B0aW9ucygpXG4gICAgICAgIEBpc1Byb2Nlc3NpbmcgPSB0cnVlXG5cbiAgICAgICAgQHNhc3NBdXRvY29tcGlsZVZpZXcudXBkYXRlT3B0aW9ucyhvcHRpb25zKVxuICAgICAgICBAc2Fzc0F1dG9jb21waWxlVmlldy5oaWRlUGFuZWwoZmFsc2UsIHRydWUpXG5cbiAgICAgICAgQGNvbXBpbGVyID0gbmV3IE5vZGVTYXNzQ29tcGlsZXIob3B0aW9ucylcbiAgICAgICAgQGNvbXBpbGVyLm9uU3RhcnQgKGFyZ3MpID0+XG4gICAgICAgICAgICBAc2Fzc0F1dG9jb21waWxlVmlldy5zdGFydENvbXBpbGF0aW9uKGFyZ3MpXG5cbiAgICAgICAgQGNvbXBpbGVyLm9uV2FybmluZyAoYXJncykgPT5cbiAgICAgICAgICAgIEBzYXNzQXV0b2NvbXBpbGVWaWV3Lndhcm5pbmcoYXJncylcblxuICAgICAgICBAY29tcGlsZXIub25TdWNjZXNzIChhcmdzKSA9PlxuICAgICAgICAgICAgQHNhc3NBdXRvY29tcGlsZVZpZXcuc3VjY2Vzc2Z1bGxDb21waWxhdGlvbihhcmdzKVxuXG4gICAgICAgIEBjb21waWxlci5vbkVycm9yIChhcmdzKSA9PlxuICAgICAgICAgICAgQHNhc3NBdXRvY29tcGlsZVZpZXcuZXJyb25lb3VzQ29tcGlsYXRpb24oYXJncylcblxuICAgICAgICBAY29tcGlsZXIub25GaW5pc2hlZCAoYXJncykgPT5cbiAgICAgICAgICAgIEBzYXNzQXV0b2NvbXBpbGVWaWV3LmZpbmlzaGVkKGFyZ3MpXG4gICAgICAgICAgICBAaXNQcm9jZXNzaW5nID0gZmFsc2VcbiAgICAgICAgICAgIEBjb21waWxlci5kZXN0cm95KClcbiAgICAgICAgICAgIEBjb21waWxlciA9IG51bGxcblxuICAgICAgICBAY29tcGlsZXIuY29tcGlsZShtb2RlLCBmaWxlbmFtZSwgbWluaWZ5T25TYXZlKVxuXG5cbiAgICByZWdpc3RlclRleHRFZGl0b3JTYXZlQ2FsbGJhY2s6ICgpIC0+XG4gICAgICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBlZGl0b3Iub25EaWRTYXZlID0+XG4gICAgICAgICAgICAgICAgaWYgIUBpc1Byb2Nlc3NpbmcgYW5kIGVkaXRvciBhbmQgZWRpdG9yLmdldFVSSSBhbmQgQGlzU2Fzc0ZpbGUoZWRpdG9yLmdldFVSSSgpKVxuICAgICAgICAgICAgICAgICAgIEBjb21waWxlKE5vZGVTYXNzQ29tcGlsZXIuTU9ERV9GSUxFLCBlZGl0b3IuZ2V0VVJJKCksIHRydWUpXG5cblxuICAgIGlzU2Fzc0ZpbGU6IChmaWxlbmFtZSkgLT5cbiAgICAgICAgcmV0dXJuIEZpbGUuaGFzRmlsZUV4dGVuc2lvbihmaWxlbmFtZSwgWycuc2NzcycsICcuc2FzcyddKVxuXG5cbiAgICByZWdpc3RlckNvbmZpZ09ic2VydmVyOiAoKSAtPlxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLk9QVElPTlNfUFJFRklYICsgJ2NvbXBpbGVPblNhdmUnLCAobmV3VmFsdWUpID0+XG4gICAgICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5PUFRJT05TX1BSRUZJWCArICdjb21waWxlRmlsZXMnLCAobmV3VmFsdWUpID0+XG4gICAgICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5PUFRJT05TX1BSRUZJWCArICdjaGVja091dHB1dEZpbGVBbHJlYWR5RXhpc3RzJywgKG5ld1ZhbHVlKSA9PlxuICAgICAgICAgICAgQHVwZGF0ZU1lbnVJdGVtcygpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuT1BUSU9OU19QUkVGSVggKyAnZGlyZWN0bHlKdW1wVG9FcnJvcicsIChuZXdWYWx1ZSkgPT5cbiAgICAgICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLk9QVElPTlNfUFJFRklYICsgJ3Nob3dDb21waWxlU2Fzc0l0ZW1JblRyZWVWaWV3Q29udGV4dE1lbnUnLCAobmV3VmFsdWUpID0+XG4gICAgICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcblxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLk9QVElPTlNfUFJFRklYICsgJ2NvbXBpbGVDb21wcmVzc2VkJywgKG5ld1ZhbHVlKSA9PlxuICAgICAgICAgICAgQHVwZGF0ZU1lbnVJdGVtcygpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuT1BUSU9OU19QUkVGSVggKyAnY29tcGlsZUNvbXBhY3QnLCAobmV3VmFsdWUpID0+XG4gICAgICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5PUFRJT05TX1BSRUZJWCArICdjb21waWxlTmVzdGVkJywgKG5ld1ZhbHVlKSA9PlxuICAgICAgICAgICAgQHVwZGF0ZU1lbnVJdGVtcygpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuT1BUSU9OU19QUkVGSVggKyAnY29tcGlsZUV4cGFuZGVkJywgKG5ld1ZhbHVlKSA9PlxuICAgICAgICAgICAgQHVwZGF0ZU1lbnVJdGVtcygpXG5cblxuICAgIHJlZ2lzdGVyQ29udGV4dE1lbnVJdGVtOiAoKSAtPlxuICAgICAgICBtZW51SXRlbSA9IEBnZXRDb250ZXh0TWVudUl0ZW0oKVxuICAgICAgICBtZW51SXRlbS5zaG91bGREaXNwbGF5ID0gKGV2dCkgPT5cbiAgICAgICAgICAgIHNob3dJdGVtT3B0aW9uID0gU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ3Nob3dDb21waWxlU2Fzc0l0ZW1JblRyZWVWaWV3Q29udGV4dE1lbnUnKVxuICAgICAgICAgICAgaWYgc2hvd0l0ZW1PcHRpb25cbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBldnQudGFyZ2V0XG4gICAgICAgICAgICAgICAgaWYgdGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgaXMgJ3NwYW4nXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlXG5cbiAgICAgICAgICAgICAgICBpc0ZpbGVJdGVtID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKS5zcGxpdCgnICcpLmluZGV4T2YoJ2ZpbGUnKSA+PSAwXG4gICAgICAgICAgICAgICAgaWYgaXNGaWxlSXRlbVxuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IHRhcmdldC5maXJzdEVsZW1lbnRDaGlsZFxuICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEBpc1Nhc3NGaWxlKGZpbGVuYW1lKVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuXG4gICAgdXBkYXRlTWVudUl0ZW1zOiAtPlxuICAgICAgICBtZW51ID0gQGdldE1haW5NZW51U3VibWVudSgpLnN1Ym1lbnVcbiAgICAgICAgcmV0dXJuIHVubGVzcyBtZW51XG5cbiAgICAgICAgbWVudVszXS5sYWJlbCA9IChpZiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZU9uU2F2ZScpIHRoZW4gJ+KclCcgZWxzZSAn4pyVJykgKyAnICBDb21waWxlIG9uIFNhdmUnXG4gICAgICAgIG1lbnVbNF0ubGFiZWwgPSAoaWYgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NoZWNrT3V0cHV0RmlsZUFscmVhZHlFeGlzdHMnKSB0aGVuICfinJQnIGVsc2UgJ+KclScpICsgJyAgQ2hlY2sgb3V0cHV0IGZpbGUgYWxyZWFkeSBleGlzdHMnXG4gICAgICAgIG1lbnVbNV0ubGFiZWwgPSAoaWYgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2RpcmVjdGx5SnVtcFRvRXJyb3InKSB0aGVuICfinJQnIGVsc2UgJ+KclScpICsgJyAgRGlyZWN0bHkganVtcCB0byBlcnJvcidcbiAgICAgICAgbWVudVs2XS5sYWJlbCA9IChpZiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnc2hvd0NvbXBpbGVTYXNzSXRlbUluVHJlZVZpZXdDb250ZXh0TWVudScpIHRoZW4gJ+KclCcgZWxzZSAn4pyVJykgKyAnICBTaG93IFxcJ0NvbXBpbGUgU0FTU1xcJyBpdGVtIGluIHRyZWUgdmlldyBjb250ZXh0IG1lbnUnXG5cbiAgICAgICAgY29tcGlsZUZpbGVNZW51ID0gbWVudVs4XS5zdWJtZW51XG4gICAgICAgIGlmIGNvbXBpbGVGaWxlTWVudVxuICAgICAgICAgICAgY29tcGlsZUZpbGVNZW51WzBdLmNoZWNrZWQgPSBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZUZpbGVzJykgaXMgJ0V2ZXJ5IFNBU1MgZmlsZSdcbiAgICAgICAgICAgIGNvbXBpbGVGaWxlTWVudVsxXS5jaGVja2VkID0gU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NvbXBpbGVGaWxlcycpIGlzICdPbmx5IHdpdGggZmlyc3QtbGluZS1jb21tZW50J1xuXG4gICAgICAgIG91dHB1dFN0eWxlc01lbnUgPSBtZW51WzldLnN1Ym1lbnVcbiAgICAgICAgaWYgb3V0cHV0U3R5bGVzTWVudVxuICAgICAgICAgICAgb3V0cHV0U3R5bGVzTWVudVswXS5sYWJlbCA9IChpZiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZUNvbXByZXNzZWQnKSB0aGVuICfinJQnIGVsc2UgJ+KclScpICsgJyAgQ29tcHJlc3NlZCdcbiAgICAgICAgICAgIG91dHB1dFN0eWxlc01lbnVbMV0ubGFiZWwgPSAoaWYgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NvbXBpbGVDb21wYWN0JykgdGhlbiAn4pyUJyBlbHNlICfinJUnKSArICcgIENvbXBhY3QnXG4gICAgICAgICAgICBvdXRwdXRTdHlsZXNNZW51WzJdLmxhYmVsID0gKGlmIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdjb21waWxlTmVzdGVkJykgdGhlbiAn4pyUJyBlbHNlICfinJUnKSArICcgIE5lc3RlZCdcbiAgICAgICAgICAgIG91dHB1dFN0eWxlc01lbnVbM10ubGFiZWwgPSAoaWYgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NvbXBpbGVFeHBhbmRlZCcpIHRoZW4gJ+KclCcgZWxzZSAn4pyVJykgKyAnICBFeHBhbmRlZCdcblxuICAgICAgICBhdG9tLm1lbnUudXBkYXRlKClcblxuXG4gICAgZ2V0TWFpbk1lbnVTdWJtZW51OiAtPlxuICAgICAgICBpZiBAbWFpblN1Ym1lbnUgaXMgbnVsbFxuICAgICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgICAgZm9yIG1lbnUgaW4gYXRvbS5tZW51LnRlbXBsYXRlXG4gICAgICAgICAgICAgICAgaWYgbWVudS5sYWJlbCBpcyAnUGFja2FnZXMnIHx8IG1lbnUubGFiZWwgaXMgJyZQYWNrYWdlcydcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGZvciBzdWJtZW51IGluIG1lbnUuc3VibWVudVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgc3VibWVudS5sYWJlbCBpcyAnU0FTUyBBdXRvY29tcGlsZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAbWFpblN1Ym1lbnUgPSBzdWJtZW51XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBpZiBmb3VuZFxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICByZXR1cm4gQG1haW5TdWJtZW51XG5cblxuICAgIGdldENvbnRleHRNZW51SXRlbTogLT5cbiAgICAgICAgaWYgQGNvbnRleHRNZW51SXRlbSBpcyBudWxsXG4gICAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgICBmb3IgaXRlbXMgaW4gYXRvbS5jb250ZXh0TWVudS5pdGVtU2V0c1xuICAgICAgICAgICAgICAgIGlmIGl0ZW1zLnNlbGVjdG9yIGlzICcudHJlZS12aWV3J1xuICAgICAgICAgICAgICAgICAgICBmb3IgaXRlbSBpbiBpdGVtcy5pdGVtc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgaXRlbS5pZCBpcyAnc2Fzcy1hdXRvY29tcGlsZS1jb250ZXh0LW1lbnUtY29tcGlsZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAY29udGV4dE1lbnVJdGVtID0gaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICAgICAgICBpZiBmb3VuZFxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICByZXR1cm4gQGNvbnRleHRNZW51SXRlbVxuXG5cbiAgICBjbG9zZVBhbmVsOiAoKSAtPlxuICAgICAgICBAc2Fzc0F1dG9jb21waWxlVmlldy5oaWRlUGFuZWwoKVxuIl19
