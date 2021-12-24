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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL3Nhc3MtYXV0b2NvbXBpbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSxXQUFSOztFQUN6QixtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVI7O0VBQ3RCLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxZQUFSOztFQUVuQixJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVI7O0VBR1AsTUFBTSxDQUFDLE9BQVAsR0FFSTtJQUFBLE1BQUEsRUFJSTtNQUFBLGFBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxpQkFBUDtRQUNBLFdBQUEsRUFBYSxpREFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0FESjtNQU9BLFlBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxtQkFBUDtRQUNBLFdBQUEsRUFBYSwwREFEYjtRQUVBLElBQUEsRUFBTSxRQUZOO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLDhCQUFELEVBQWlDLGlCQUFqQyxDQUhOO1FBSUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxpQkFKVDtRQUtBLEtBQUEsRUFBTyxFQUxQO09BUko7TUFlQSxlQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sa0JBQVA7UUFDQSxXQUFBLEVBQWEsZ0hBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtRQUlBLEtBQUEsRUFBTyxFQUpQO09BaEJKO01Bc0JBLDRCQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sNENBQVA7UUFDQSxXQUFBLEVBQWEsaUZBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtRQUlBLEtBQUEsRUFBTyxFQUpQO09BdkJKO01BNkJBLG1CQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sd0JBQVA7UUFDQSxXQUFBLEVBQWEsZ0hBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtRQUlBLEtBQUEsRUFBTyxFQUpQO09BOUJKO01Bb0NBLHdDQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sc0RBQVA7UUFDQSxXQUFBLEVBQWEsMkhBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLElBQUEsRUFBTSxTQUhOO1FBSUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUpUO1FBS0EsS0FBQSxFQUFPLEVBTFA7T0FyQ0o7TUErQ0EsaUJBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTywwQ0FBUDtRQUNBLFdBQUEsRUFBYSxrTEFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0FoREo7TUFzREEseUJBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxvREFBUDtRQUNBLFdBQUEsRUFBYSwrS0FEYjtRQUVBLElBQUEsRUFBTSxRQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxZQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0F2REo7TUE2REEsY0FBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLHVDQUFQO1FBQ0EsV0FBQSxFQUFhLDRLQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQTlESjtNQW9FQSxzQkFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGlEQUFQO1FBQ0EsV0FBQSxFQUFhLDRLQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGdCQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0FyRUo7TUEyRUEsYUFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLHNDQUFQO1FBQ0EsV0FBQSxFQUFhLDBLQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQTVFSjtNQWtGQSxxQkFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGdEQUFQO1FBQ0EsV0FBQSxFQUFhLDJLQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGVBSFQ7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQW5GSjtNQXlGQSxlQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sd0NBQVA7UUFDQSxXQUFBLEVBQWEsOEtBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtRQUlBLEtBQUEsRUFBTyxFQUpQO09BMUZKO01BZ0dBLHVCQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sa0RBQVA7UUFDQSxXQUFBLEVBQWEsNktBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsUUFIVDtRQUlBLEtBQUEsRUFBTyxFQUpQO09BakdKO01BdUdBLFVBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxhQUFQO1FBQ0EsV0FBQSxFQUFhLDRCQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsT0FBRCxFQUFVLEtBQVYsQ0FITjtRQUlBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FKVDtRQUtBLEtBQUEsRUFBTyxFQUxQO09BeEdKO01BK0dBLFdBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxjQUFQO1FBQ0EsV0FBQSxFQUFhLHdDQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFNLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsRUFBL0IsQ0FITjtRQUlBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FKVDtRQUtBLE9BQUEsRUFBUyxDQUxUO1FBTUEsT0FBQSxFQUFTLEVBTlQ7UUFPQSxLQUFBLEVBQU8sRUFQUDtPQWhISjtNQXlIQSxRQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sVUFBUDtRQUNBLFdBQUEsRUFBYSwrRkFEYjtRQUVBLElBQUEsRUFBTSxRQUZOO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLElBQUQsRUFBTyxNQUFQLEVBQWUsSUFBZixFQUFxQixNQUFyQixDQUhOO1FBSUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUpUO1FBS0EsS0FBQSxFQUFPLEVBTFA7T0ExSEo7TUFpSUEsU0FBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGtCQUFQO1FBQ0EsV0FBQSxFQUFhLHNDQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQWxJSjtNQXdJQSxjQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sa0JBQVA7UUFDQSxXQUFBLEVBQWEsaURBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtRQUlBLEtBQUEsRUFBTyxFQUpQO09BeklKO01BK0lBLGlCQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sNENBQVA7UUFDQSxXQUFBLEVBQWEsNERBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtRQUlBLEtBQUEsRUFBTyxFQUpQO09BaEpKO01Bc0pBLGNBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxpRUFBUDtRQUNBLFdBQUEsRUFBYSwwSkFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0F2Sko7TUE2SkEsV0FBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGVBQVA7UUFDQSxXQUFBLEVBQWEsMEdBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFIVDtRQUlBLEtBQUEsRUFBTyxFQUpQO09BOUpKO01Bb0tBLFNBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxXQUFQO1FBQ0EsV0FBQSxFQUFhLGdNQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBSFQ7UUFJQSxPQUFBLEVBQVMsQ0FKVDtRQUtBLEtBQUEsRUFBTyxFQUxQO09BcktKO01BNEtBLFFBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyw2QkFBUDtRQUNBLFdBQUEsRUFBYSw2Q0FEYjtRQUVBLElBQUEsRUFBTSxRQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0E3S0o7TUFtTEEsU0FBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLDhCQUFQO1FBQ0EsV0FBQSxFQUFhLDhDQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBSFQ7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQXBMSjtNQTZMQSxhQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sbUJBQVA7UUFDQSxXQUFBLEVBQWEscURBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsZUFBVixFQUEyQixzQkFBM0IsQ0FITjtRQUlBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FKVDtRQUtBLEtBQUEsRUFBTyxFQUxQO09BOUxKO01BcU1BLGFBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxpQ0FBUDtRQUNBLFdBQUEsRUFBYSxnRUFEYjtRQUVBLElBQUEsRUFBTSxRQUZOO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLE9BQXJCLEVBQThCLGdCQUE5QixDQUhOO1FBSUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxTQUpUO1FBS0EsS0FBQSxFQUFPLEVBTFA7T0F0TUo7TUE2TUEsa0JBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyx1QkFBUDtRQUNBLFdBQUEsRUFBYSxpREFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0E5TUo7TUFvTkEscUJBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyx5Q0FBUDtRQUNBLFdBQUEsRUFBYSxvRUFEYjtRQUVBLElBQUEsRUFBTSxRQUZOO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxlQUFWLEVBQTJCLE9BQTNCLEVBQW9DLHNCQUFwQyxDQUhOO1FBSUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxlQUpUO1FBS0EsS0FBQSxFQUFPLEVBTFA7T0FyTko7TUE0TkEsOEJBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyx1Q0FBUDtRQUNBLFdBQUEsRUFBYSx3REFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0E3Tko7TUFtT0EsNkJBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxrQ0FBUDtRQUNBLFdBQUEsRUFBYSxvRUFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0FwT0o7TUEwT0Esa0JBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyx5Q0FBUDtRQUNBLFdBQUEsRUFBYSxpR0FEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0EzT0o7TUFpUEEsd0JBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyx1Q0FBUDtRQUNBLFdBQUEsRUFBYSx3SEFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0FsUEo7TUEyUEEsZUFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGlDQUFQO1FBQ0EsV0FBQSxFQUFhLHlDQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQTVQSjtNQWtRQSxZQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8sK0JBQVA7UUFDQSxXQUFBLEVBQWEsaUdBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFIVDtRQUlBLEtBQUEsRUFBTyxFQUpQO09BblFKO0tBSko7SUE4UUEsbUJBQUEsRUFBcUIsSUE5UXJCO0lBK1FBLFdBQUEsRUFBYSxJQS9RYjtJQWdSQSxlQUFBLEVBQWlCLElBaFJqQjtJQW1SQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ04sSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBSTtNQUUzQixJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBSSxtQkFBSixDQUF3QixJQUFJLHNCQUFKLENBQUEsQ0FBeEIsRUFBc0QsS0FBSyxDQUFDLHdCQUE1RDtNQUN2QixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUloQixJQUFHLHNCQUFzQixDQUFDLEdBQXZCLENBQTJCLFNBQTNCLENBQUg7UUFDSSxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixlQUEzQixFQUE0QyxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixTQUEzQixDQUE1QztRQUNBLHNCQUFzQixDQUFDLEtBQXZCLENBQTZCLFNBQTdCLEVBRko7O01BR0EsSUFBRyxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixhQUEzQixDQUFIO1FBQ0ksc0JBQXNCLENBQUMsS0FBdkIsQ0FBNkIsYUFBN0IsRUFESjs7TUFFQSxJQUFHLHNCQUFzQixDQUFDLEdBQXZCLENBQTJCLG1CQUEzQixDQUFIO1FBQ0ksc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIsY0FBM0IsRUFBMkMsc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIsbUJBQTNCLENBQTNDO1FBQ0Esc0JBQXNCLENBQUMsS0FBdkIsQ0FBNkIsbUJBQTdCLEVBRko7O01BS0EsSUFBQyxDQUFBLGdCQUFELENBQUE7TUFDQSxJQUFDLENBQUEsOEJBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxzQkFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLHVCQUFELENBQUE7SUF0Qk0sQ0FuUlY7SUE0U0EsVUFBQSxFQUFZLFNBQUE7TUFDUixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtNQUNBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxPQUFyQixDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFtQixDQUFDLE9BQXJCLENBQUE7SUFIUSxDQTVTWjtJQWtUQSxTQUFBLEVBQVcsU0FBQTthQUNQO1FBQUEsd0JBQUEsRUFBMEIsSUFBQyxDQUFBLG1CQUFtQixDQUFDLFNBQXJCLENBQUEsQ0FBMUI7O0lBRE8sQ0FsVFg7SUFzVEEsZ0JBQUEsRUFBa0IsU0FBQTthQUNkLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2Y7UUFBQSxrQ0FBQSxFQUFvQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEdBQUQ7bUJBQ2hDLEtBQUMsQ0FBQSxhQUFELENBQWUsR0FBZjtVQURnQztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEM7UUFHQSxpQ0FBQSxFQUFtQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEdBQUQ7bUJBQy9CLEtBQUMsQ0FBQSxhQUFELENBQWUsR0FBZjtVQUQrQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIbkM7UUFNQSx5Q0FBQSxFQUEyQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUN2QyxLQUFDLENBQUEsbUJBQUQsQ0FBQTtVQUR1QztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOM0M7UUFTQSw2Q0FBQSxFQUErQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUMzQyxLQUFDLENBQUEsaUJBQUQsQ0FBbUIsUUFBbkI7VUFEMkM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBVC9DO1FBWUEsOENBQUEsRUFBZ0QsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDNUMsS0FBQyxDQUFBLGlCQUFELENBQW1CLFNBQW5CO1VBRDRDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVpoRDtRQWVBLCtDQUFBLEVBQWlELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQzdDLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixVQUFuQjtVQUQ2QztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FmakQ7UUFrQkEsaURBQUEsRUFBbUQsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDL0MsS0FBQyxDQUFBLGlCQUFELENBQW1CLFlBQW5CO1VBRCtDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWxCbkQ7UUFxQkEsMENBQUEsRUFBNEMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDeEMsS0FBQyxDQUFBLHFCQUFELENBQXVCLE9BQXZCO1VBRHdDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXJCNUM7UUF3QkEsdURBQUEsRUFBeUQsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDckQsS0FBQyxDQUFBLHFCQUFELENBQXVCLG9CQUF2QjtVQURxRDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0F4QnpEO1FBMkJBLDBEQUFBLEVBQTRELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ3hELEtBQUMsQ0FBQSxrQ0FBRCxDQUFBO1VBRHdEO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQTNCNUQ7UUE4QkEsZ0RBQUEsRUFBa0QsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDOUMsS0FBQyxDQUFBLHlCQUFELENBQUE7VUFEOEM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBOUJsRDtRQWlDQSwwRUFBQSxFQUE0RSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUN4RSxLQUFDLENBQUEsOENBQUQsQ0FBQTtVQUR3RTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FqQzVFO1FBb0NBLHNDQUFBLEVBQXdDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsR0FBRDtZQUNwQyxLQUFDLENBQUEsVUFBRCxDQUFBO21CQUNBLEdBQUcsQ0FBQyxlQUFKLENBQUE7VUFGb0M7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBcEN4QztPQURlLENBQW5CO0lBRGMsQ0F0VGxCO0lBaVdBLGFBQUEsRUFBZSxTQUFDLEdBQUQ7QUFDWCxVQUFBO01BQUEsUUFBQSxHQUFXO01BQ1gsSUFBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFwQixDQUFBLENBQUEsS0FBcUMsa0JBQXJDLElBQTJELEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQXBCLENBQUEsQ0FBQSxLQUFxQyxPQUFuRztRQUNJLFlBQUEsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7UUFDZixJQUFHLFlBQUg7VUFDSSxRQUFBLEdBQVcsWUFBWSxDQUFDLE1BQWIsQ0FBQSxFQURmO1NBRko7T0FBQSxNQUFBO1FBS0ksTUFBQSxHQUFTLEdBQUcsQ0FBQztRQUNiLElBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBcEIsQ0FBQSxDQUFBLEtBQXFDLE1BQXhDO1VBQ0ksTUFBQSxHQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FEdkI7O1FBRUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxZQUFQLENBQW9CLE9BQXBCLENBQTRCLENBQUMsS0FBN0IsQ0FBbUMsR0FBbkMsQ0FBdUMsQ0FBQyxPQUF4QyxDQUFnRCxNQUFoRCxDQUFBLElBQTJEO1FBQ3hFLElBQUcsVUFBSDtVQUNJLFFBQUEsR0FBVyxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBekIsQ0FBc0MsV0FBdEMsRUFEZjtTQVRKOztNQVlBLElBQUcsSUFBQyxDQUFBLFVBQUQsQ0FBWSxRQUFaLENBQUg7ZUFDSSxJQUFDLENBQUEsT0FBRCxDQUFTLGdCQUFnQixDQUFDLFNBQTFCLEVBQXFDLFFBQXJDLEVBQStDLEtBQS9DLEVBREo7O0lBZFcsQ0FqV2Y7SUFtWEEsYUFBQSxFQUFlLFNBQUMsR0FBRDtNQUNYLElBQUEsQ0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBZDtBQUFBLGVBQUE7O2FBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxnQkFBZ0IsQ0FBQyxXQUExQjtJQUZXLENBblhmO0lBd1hBLG1CQUFBLEVBQXFCLFNBQUE7TUFDakIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIsZUFBM0IsRUFBNEMsQ0FBQyxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixlQUEzQixDQUE3QztNQUNBLElBQUcsc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIsZUFBM0IsQ0FBSDtRQUNJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsMkNBQTNCLEVBREo7T0FBQSxNQUFBO1FBR0ksSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUE4Qiw0Q0FBOUIsRUFISjs7YUFJQSxJQUFDLENBQUEsZUFBRCxDQUFBO0lBTmlCLENBeFhyQjtJQWlZQSxpQkFBQSxFQUFtQixTQUFDLFdBQUQ7QUFDZixjQUFPLFdBQVcsQ0FBQyxXQUFaLENBQUEsQ0FBUDtBQUFBLGFBQ1MsWUFEVDtVQUMyQixzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixtQkFBM0IsRUFBZ0QsQ0FBQyxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixtQkFBM0IsQ0FBakQ7QUFBbEI7QUFEVCxhQUVTLFNBRlQ7VUFFd0Isc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIsZ0JBQTNCLEVBQTZDLENBQUMsc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIsZ0JBQTNCLENBQTlDO0FBQWY7QUFGVCxhQUdTLFFBSFQ7VUFHdUIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIsZUFBM0IsRUFBNEMsQ0FBQyxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixlQUEzQixDQUE3QztBQUFkO0FBSFQsYUFJUyxVQUpUO1VBSXlCLHNCQUFzQixDQUFDLEdBQXZCLENBQTJCLGlCQUEzQixFQUE4QyxDQUFDLHNCQUFzQixDQUFDLEdBQXZCLENBQTJCLGlCQUEzQixDQUEvQztBQUp6QjthQUtBLElBQUMsQ0FBQSxlQUFELENBQUE7SUFOZSxDQWpZbkI7SUEwWUEscUJBQUEsRUFBdUIsU0FBQyxJQUFEO01BQ25CLElBQUcsSUFBQSxLQUFRLE9BQVg7UUFDSSxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixjQUEzQixFQUEyQyxpQkFBM0MsRUFESjtPQUFBLE1BRUssSUFBRyxJQUFBLEtBQVEsb0JBQVg7UUFDRCxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixjQUEzQixFQUEyQyw4QkFBM0MsRUFEQzs7YUFHTCxJQUFDLENBQUEsZUFBRCxDQUFBO0lBTm1CLENBMVl2QjtJQW1aQSxrQ0FBQSxFQUFvQyxTQUFBO01BQ2hDLHNCQUFzQixDQUFDLEdBQXZCLENBQTJCLDhCQUEzQixFQUEyRCxDQUFDLHNCQUFzQixDQUFDLEdBQXZCLENBQTJCLDhCQUEzQixDQUE1RDthQUNBLElBQUMsQ0FBQSxlQUFELENBQUE7SUFGZ0MsQ0FuWnBDO0lBd1pBLHlCQUFBLEVBQTJCLFNBQUE7TUFDdkIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIscUJBQTNCLEVBQWtELENBQUMsc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIscUJBQTNCLENBQW5EO2FBQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBQTtJQUZ1QixDQXhaM0I7SUE2WkEsOENBQUEsRUFBZ0QsU0FBQTtNQUM1QyxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQiwwQ0FBM0IsRUFBdUUsQ0FBQyxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQiwwQ0FBM0IsQ0FBeEU7YUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBO0lBRjRDLENBN1poRDtJQWthQSxPQUFBLEVBQVMsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUF3QixZQUF4QjtBQUNMLFVBQUE7O1FBRFksV0FBVzs7O1FBQU0sZUFBZTs7TUFDNUMsSUFBRyxJQUFDLENBQUEsWUFBSjtBQUNJLGVBREo7O01BR0EsT0FBQSxHQUFVLElBQUksc0JBQUosQ0FBQTtNQUNWLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BRWhCLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxhQUFyQixDQUFtQyxPQUFuQztNQUNBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxTQUFyQixDQUErQixLQUEvQixFQUFzQyxJQUF0QztNQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxnQkFBSixDQUFxQixPQUFyQjtNQUNaLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtpQkFDZCxLQUFDLENBQUEsbUJBQW1CLENBQUMsZ0JBQXJCLENBQXNDLElBQXRDO1FBRGM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO01BR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLENBQW9CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO2lCQUNoQixLQUFDLENBQUEsbUJBQW1CLENBQUMsT0FBckIsQ0FBNkIsSUFBN0I7UUFEZ0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCO01BR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLENBQW9CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO2lCQUNoQixLQUFDLENBQUEsbUJBQW1CLENBQUMsc0JBQXJCLENBQTRDLElBQTVDO1FBRGdCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtNQUdBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtpQkFDZCxLQUFDLENBQUEsbUJBQW1CLENBQUMsb0JBQXJCLENBQTBDLElBQTFDO1FBRGM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO01BR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQXFCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQ2pCLEtBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxRQUFyQixDQUE4QixJQUE5QjtVQUNBLEtBQUMsQ0FBQSxZQUFELEdBQWdCO1VBQ2hCLEtBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFBO2lCQUNBLEtBQUMsQ0FBQSxRQUFELEdBQVk7UUFKSztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7YUFNQSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsSUFBbEIsRUFBd0IsUUFBeEIsRUFBa0MsWUFBbEM7SUE3QkssQ0FsYVQ7SUFrY0EsOEJBQUEsRUFBZ0MsU0FBQTthQUM1QixJQUFDLENBQUEsbUJBQW1CLENBQUMsR0FBckIsQ0FBeUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtpQkFDdkQsS0FBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQUE7WUFDaEMsSUFBRyxDQUFDLEtBQUMsQ0FBQSxZQUFGLElBQW1CLE1BQW5CLElBQThCLE1BQU0sQ0FBQyxNQUFyQyxJQUFnRCxLQUFDLENBQUEsVUFBRCxDQUFZLE1BQU0sQ0FBQyxNQUFQLENBQUEsQ0FBWixDQUFuRDtxQkFDRyxLQUFDLENBQUEsT0FBRCxDQUFTLGdCQUFnQixDQUFDLFNBQTFCLEVBQXFDLE1BQU0sQ0FBQyxNQUFQLENBQUEsQ0FBckMsRUFBc0QsSUFBdEQsRUFESDs7VUFEZ0MsQ0FBakIsQ0FBbkI7UUFEdUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQXpCO0lBRDRCLENBbGNoQztJQXljQSxVQUFBLEVBQVksU0FBQyxRQUFEO0FBQ1IsYUFBTyxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsUUFBdEIsRUFBZ0MsQ0FBQyxPQUFELEVBQVUsT0FBVixDQUFoQztJQURDLENBemNaO0lBNmNBLHNCQUFBLEVBQXdCLFNBQUE7TUFDcEIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixzQkFBc0IsQ0FBQyxjQUF2QixHQUF3QyxlQUE1RCxFQUE2RSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRDtpQkFDNUYsS0FBQyxDQUFBLGVBQUQsQ0FBQTtRQUQ0RjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0UsQ0FBbkI7TUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHNCQUFzQixDQUFDLGNBQXZCLEdBQXdDLGNBQTVELEVBQTRFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO2lCQUMzRixLQUFDLENBQUEsZUFBRCxDQUFBO1FBRDJGO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1RSxDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXNCLENBQUMsY0FBdkIsR0FBd0MsOEJBQTVELEVBQTRGLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO2lCQUMzRyxLQUFDLENBQUEsZUFBRCxDQUFBO1FBRDJHO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1RixDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXNCLENBQUMsY0FBdkIsR0FBd0MscUJBQTVELEVBQW1GLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO2lCQUNsRyxLQUFDLENBQUEsZUFBRCxDQUFBO1FBRGtHO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuRixDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXNCLENBQUMsY0FBdkIsR0FBd0MsMENBQTVELEVBQXdHLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO2lCQUN2SCxLQUFDLENBQUEsZUFBRCxDQUFBO1FBRHVIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4RyxDQUFuQjtNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXNCLENBQUMsY0FBdkIsR0FBd0MsbUJBQTVELEVBQWlGLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO2lCQUNoRyxLQUFDLENBQUEsZUFBRCxDQUFBO1FBRGdHO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRixDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXNCLENBQUMsY0FBdkIsR0FBd0MsZ0JBQTVELEVBQThFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO2lCQUM3RixLQUFDLENBQUEsZUFBRCxDQUFBO1FBRDZGO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5RSxDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXNCLENBQUMsY0FBdkIsR0FBd0MsZUFBNUQsRUFBNkUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFFBQUQ7aUJBQzVGLEtBQUMsQ0FBQSxlQUFELENBQUE7UUFENEY7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdFLENBQW5CO2FBRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixzQkFBc0IsQ0FBQyxjQUF2QixHQUF3QyxpQkFBNUQsRUFBK0UsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFFBQUQ7aUJBQzlGLEtBQUMsQ0FBQSxlQUFELENBQUE7UUFEOEY7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9FLENBQW5CO0lBbEJvQixDQTdjeEI7SUFtZUEsdUJBQUEsRUFBeUIsU0FBQTtBQUNyQixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxrQkFBRCxDQUFBO2FBQ1gsUUFBUSxDQUFDLGFBQVQsR0FBeUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFDckIsY0FBQTtVQUFBLGNBQUEsR0FBaUIsc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIsMENBQTNCO1VBQ2pCLElBQUcsY0FBSDtZQUNJLE1BQUEsR0FBUyxHQUFHLENBQUM7WUFDYixJQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBaEIsQ0FBQSxDQUFBLEtBQWlDLE1BQXBDO2NBQ0ksTUFBQSxHQUFTLE1BQU0sQ0FBQyxXQURwQjs7WUFHQSxVQUFBLEdBQWEsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsT0FBcEIsQ0FBNEIsQ0FBQyxLQUE3QixDQUFtQyxHQUFuQyxDQUF1QyxDQUFDLE9BQXhDLENBQWdELE1BQWhELENBQUEsSUFBMkQ7WUFDeEUsSUFBRyxVQUFIO2NBQ0ksS0FBQSxHQUFRLE1BQU0sQ0FBQztjQUNmLFFBQUEsR0FBVyxLQUFLLENBQUMsWUFBTixDQUFtQixXQUFuQjtBQUNYLHFCQUFPLEtBQUMsQ0FBQSxVQUFELENBQVksUUFBWixFQUhYO2FBTko7O0FBV0EsaUJBQU87UUFiYztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7SUFGSixDQW5lekI7SUFxZkEsZUFBQSxFQUFpQixTQUFBO0FBQ2IsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsa0JBQUQsQ0FBQSxDQUFxQixDQUFDO01BQzdCLElBQUEsQ0FBYyxJQUFkO0FBQUEsZUFBQTs7TUFFQSxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBUixHQUFnQixDQUFJLHNCQUFzQixDQUFDLEdBQXZCLENBQTJCLGVBQTNCLENBQUgsR0FBb0QsR0FBcEQsR0FBNkQsR0FBOUQsQ0FBQSxHQUFxRTtNQUNyRixJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBUixHQUFnQixDQUFJLHNCQUFzQixDQUFDLEdBQXZCLENBQTJCLDhCQUEzQixDQUFILEdBQW1FLEdBQW5FLEdBQTRFLEdBQTdFLENBQUEsR0FBb0Y7TUFDcEcsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQVIsR0FBZ0IsQ0FBSSxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixxQkFBM0IsQ0FBSCxHQUEwRCxHQUExRCxHQUFtRSxHQUFwRSxDQUFBLEdBQTJFO01BQzNGLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFSLEdBQWdCLENBQUksc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIsMENBQTNCLENBQUgsR0FBK0UsR0FBL0UsR0FBd0YsR0FBekYsQ0FBQSxHQUFnRztNQUVoSCxlQUFBLEdBQWtCLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQztNQUMxQixJQUFHLGVBQUg7UUFDSSxlQUFnQixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQW5CLEdBQTZCLHNCQUFzQixDQUFDLEdBQXZCLENBQTJCLGNBQTNCLENBQUEsS0FBOEM7UUFDM0UsZUFBZ0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFuQixHQUE2QixzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixjQUEzQixDQUFBLEtBQThDLCtCQUYvRTs7TUFJQSxnQkFBQSxHQUFtQixJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUM7TUFDM0IsSUFBRyxnQkFBSDtRQUNJLGdCQUFpQixDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQXBCLEdBQTRCLENBQUksc0JBQXNCLENBQUMsR0FBdkIsQ0FBMkIsbUJBQTNCLENBQUgsR0FBd0QsR0FBeEQsR0FBaUUsR0FBbEUsQ0FBQSxHQUF5RTtRQUNyRyxnQkFBaUIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFwQixHQUE0QixDQUFJLHNCQUFzQixDQUFDLEdBQXZCLENBQTJCLGdCQUEzQixDQUFILEdBQXFELEdBQXJELEdBQThELEdBQS9ELENBQUEsR0FBc0U7UUFDbEcsZ0JBQWlCLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBcEIsR0FBNEIsQ0FBSSxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixlQUEzQixDQUFILEdBQW9ELEdBQXBELEdBQTZELEdBQTlELENBQUEsR0FBcUU7UUFDakcsZ0JBQWlCLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBcEIsR0FBNEIsQ0FBSSxzQkFBc0IsQ0FBQyxHQUF2QixDQUEyQixpQkFBM0IsQ0FBSCxHQUFzRCxHQUF0RCxHQUErRCxHQUFoRSxDQUFBLEdBQXVFLGFBSnZHOzthQU1BLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBVixDQUFBO0lBckJhLENBcmZqQjtJQTZnQkEsa0JBQUEsRUFBb0IsU0FBQTtBQUNoQixVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsV0FBRCxLQUFnQixJQUFuQjtRQUNJLEtBQUEsR0FBUTtBQUNSO0FBQUEsYUFBQSxxQ0FBQTs7VUFDSSxJQUFHLElBQUksQ0FBQyxLQUFMLEtBQWMsVUFBZCxJQUE0QixJQUFJLENBQUMsS0FBTCxLQUFjLFdBQTdDO1lBQ0ksS0FBQSxHQUFRO0FBQ1I7QUFBQSxpQkFBQSx3Q0FBQTs7Y0FDSSxJQUFHLE9BQU8sQ0FBQyxLQUFSLEtBQWlCLGtCQUFwQjtnQkFDSSxJQUFDLENBQUEsV0FBRCxHQUFlO0FBQ2Ysc0JBRko7O0FBREosYUFGSjs7VUFNQSxJQUFHLEtBQUg7QUFDSSxrQkFESjs7QUFQSixTQUZKOztBQVdBLGFBQU8sSUFBQyxDQUFBO0lBWlEsQ0E3Z0JwQjtJQTRoQkEsa0JBQUEsRUFBb0IsU0FBQTtBQUNoQixVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsZUFBRCxLQUFvQixJQUF2QjtRQUNJLEtBQUEsR0FBUTtBQUNSO0FBQUEsYUFBQSxxQ0FBQTs7VUFDSSxJQUFHLEtBQUssQ0FBQyxRQUFOLEtBQWtCLFlBQXJCO0FBQ0k7QUFBQSxpQkFBQSx3Q0FBQTs7Y0FDSSxJQUFHLElBQUksQ0FBQyxFQUFMLEtBQVcsdUNBQWQ7Z0JBQ0ksS0FBQSxHQUFRO2dCQUNSLElBQUMsQ0FBQSxlQUFELEdBQW1CO0FBQ25CLHNCQUhKOztBQURKLGFBREo7O1VBT0EsSUFBRyxLQUFIO0FBQ0ksa0JBREo7O0FBUkosU0FGSjs7QUFZQSxhQUFPLElBQUMsQ0FBQTtJQWJRLENBNWhCcEI7SUE0aUJBLFVBQUEsRUFBWSxTQUFBO2FBQ1IsSUFBQyxDQUFBLG1CQUFtQixDQUFDLFNBQXJCLENBQUE7SUFEUSxDQTVpQlo7O0FBWEoiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlKCdhdG9tJylcblxuU2Fzc0F1dG9jb21waWxlT3B0aW9ucyA9IHJlcXVpcmUoJy4vb3B0aW9ucycpXG5TYXNzQXV0b2NvbXBpbGVWaWV3ID0gcmVxdWlyZSgnLi9zYXNzLWF1dG9jb21waWxlLXZpZXcnKVxuTm9kZVNhc3NDb21waWxlciA9IHJlcXVpcmUoJy4vY29tcGlsZXInKVxuXG5GaWxlID0gcmVxdWlyZSgnLi9oZWxwZXIvZmlsZScpXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gICAgY29uZmlnOlxuXG4gICAgICAgICMgR2VuZXJhbCBzZXR0aW5nc1xuXG4gICAgICAgIGNvbXBpbGVPblNhdmU6XG4gICAgICAgICAgICB0aXRsZTogJ0NvbXBpbGUgb24gU2F2ZSdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBvcHRpb24gZW4tL2Rpc2FibGVzIGF1dG8gY29tcGlsaW5nIG9uIHNhdmUnXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgICAgIG9yZGVyOiAxMFxuXG4gICAgICAgIGNvbXBpbGVGaWxlczpcbiAgICAgICAgICAgIHRpdGxlOiAnQ29tcGlsZSBmaWxlcyAuLi4nXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Nob29zZSB3aGljaCBTQVNTIGZpbGVzIHlvdSB3YW50IHRoaXMgcGFja2FnZSB0byBjb21waWxlJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGVudW06IFsnT25seSB3aXRoIGZpcnN0LWxpbmUtY29tbWVudCcsICdFdmVyeSBTQVNTIGZpbGUnXVxuICAgICAgICAgICAgZGVmYXVsdDogJ0V2ZXJ5IFNBU1MgZmlsZSdcbiAgICAgICAgICAgIG9yZGVyOiAxMVxuXG4gICAgICAgIGNvbXBpbGVQYXJ0aWFsczpcbiAgICAgICAgICAgIHRpdGxlOiAnQ29tcGlsZSBQYXJ0aWFscydcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQ29udHJvbHMgY29tcGlsYXRpb24gb2YgUGFydGlhbHMgKHVuZGVyc2NvcmUgYXMgZmlyc3QgY2hhcmFjdGVyIGluIGZpbGVuYW1lKSBpZiB0aGVyZSBpcyBubyBmaXJzdC1saW5lLWNvbW1lbnQnXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBvcmRlcjogMTJcblxuICAgICAgICBjaGVja091dHB1dEZpbGVBbHJlYWR5RXhpc3RzOlxuICAgICAgICAgICAgdGl0bGU6ICdBc2sgZm9yIG92ZXJ3cml0aW5nIGFscmVhZHkgZXhpc3RlbnQgZmlsZXMnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIHRhcmdldCBmaWxlIGFscmVhZHkgZXhpc3RzLCBzYXNzLWF1dG9jb21waWxlIHdpbGwgYXNrIHlvdSBiZWZvcmUgb3ZlcndyaXRpbmcnXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBvcmRlcjogMTNcblxuICAgICAgICBkaXJlY3RseUp1bXBUb0Vycm9yOlxuICAgICAgICAgICAgdGl0bGU6ICdEaXJlY3RseSBqdW1wIHRvIGVycm9yJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkIGFuZCB5b3UgY29tcGlsZSBhbiBlcnJvbmVvdXMgU0FTUyBmaWxlLCB0aGlzIGZpbGUgaXMgb3BlbmVkIGFuZCBqdW1wZWQgdG8gdGhlIHByb2JsZW1hdGljIHBvc2l0aW9uLidcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiAxNFxuXG4gICAgICAgIHNob3dDb21waWxlU2Fzc0l0ZW1JblRyZWVWaWV3Q29udGV4dE1lbnU6XG4gICAgICAgICAgICB0aXRsZTogJ1Nob3cgXFwnQ29tcGlsZSBTQVNTXFwnIGl0ZW0gaW4gVHJlZSBWaWV3IGNvbnRleHQgbWVudSdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCwgVHJlZSBWaWV3IGNvbnRleHQgbWVudSBjb250YWlucyBhIFxcJ0NvbXBpbGUgU0FTU1xcJyBpdGVtIHRoYXQgYWxsb3dzIHlvdSB0byBjb21waWxlIHRoYXQgZmlsZSB2aWEgY29udGV4dCBtZW51J1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgb3JkZXI6IDE1XG5cblxuICAgICAgICAjIG5vZGUtc2FzcyBvcHRpb25zXG5cbiAgICAgICAgY29tcGlsZUNvbXByZXNzZWQ6XG4gICAgICAgICAgICB0aXRsZTogJ0NvbXBpbGUgd2l0aCBcXCdjb21wcmVzc2VkXFwnIG91dHB1dCBzdHlsZSdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCBTQVNTIGZpbGVzIGFyZSBjb21waWxlZCB3aXRoIFxcJ2NvbXByZXNzZWRcXCcgb3V0cHV0IHN0eWxlLiBQbGVhc2UgZGVmaW5lIGEgY29ycmVzcG9uZGluZyBvdXRwdXQgZmlsZW5hbWUgcGF0dGVybiBvciB1c2UgaW5saW5lIHBhcmFtZXRlciBcXCdjb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuXFwnJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgICBvcmRlcjogMzBcblxuICAgICAgICBjb21wcmVzc2VkRmlsZW5hbWVQYXR0ZXJuOlxuICAgICAgICAgICAgdGl0bGU6ICdGaWxlbmFtZSBwYXR0ZXJuIGZvciBcXCdjb21wcmVzc2VkXFwnIGNvbXBpbGVkIGZpbGVzJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdEZWZpbmUgdGhlIHJlcGxhY2VtZW50IHBhdHRlcm4gZm9yIGNvbXBpbGVkIGZpbGVuYW1lcyB3aXRoIFxcJ2NvbXByZXNzZWRcXCcgb3V0cHV0IHN0eWxlLiBQbGFjZWhvbGRlcnMgYXJlOiBcXCckMVxcJyBmb3IgYmFzZW5hbWUgb2YgZmlsZSBhbmQgXFwnJDJcXCcgZm9yIG9yaWdpbmFsIGZpbGUgZXh0ZW5zaW9uLidcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiAnJDEubWluLmNzcydcbiAgICAgICAgICAgIG9yZGVyOiAzMVxuXG4gICAgICAgIGNvbXBpbGVDb21wYWN0OlxuICAgICAgICAgICAgdGl0bGU6ICdDb21waWxlIHdpdGggXFwnY29tcGFjdFxcJyBvdXRwdXQgc3R5bGUnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQgU0FTUyBmaWxlcyBhcmUgY29tcGlsZWQgd2l0aCBcXCdjb21wYWN0XFwnIG91dHB1dCBzdHlsZS4gUGxlYXNlIGRlZmluZSBhIGNvcnJlc3BvbmRpbmcgb3V0cHV0IGZpbGVuYW1lIHBhdHRlcm4gb3IgdXNlIGlubGluZSBwYXJhbWV0ZXIgXFwnY29tcGFjdEZpbGVuYW1lUGF0dGVyblxcJydcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiAzMlxuXG4gICAgICAgIGNvbXBhY3RGaWxlbmFtZVBhdHRlcm46XG4gICAgICAgICAgICB0aXRsZTogJ0ZpbGVuYW1lIHBhdHRlcm4gZm9yIFxcJ2NvbXBhY3RcXCcgY29tcGlsZWQgZmlsZXMnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0RlZmluZSB0aGUgcmVwbGFjZW1lbnQgcGF0dGVybiBmb3IgY29tcGlsZWQgZmlsZW5hbWVzIHdpdGggXFwnY29tcGFjdFxcJyBvdXRwdXQgc3R5bGUuIFBsYWNlaG9sZGVycyBhcmU6IFxcJyQxXFwnIGZvciBiYXNlbmFtZSBvZiBmaWxlIGFuZCBcXCckMlxcJyBmb3Igb3JpZ2luYWwgZmlsZSBleHRlbnNpb24uJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICckMS5jb21wYWN0LmNzcydcbiAgICAgICAgICAgIG9yZGVyOiAzM1xuXG4gICAgICAgIGNvbXBpbGVOZXN0ZWQ6XG4gICAgICAgICAgICB0aXRsZTogJ0NvbXBpbGUgd2l0aCBcXCduZXN0ZWRcXCcgb3V0cHV0IHN0eWxlJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkIFNBU1MgZmlsZXMgYXJlIGNvbXBpbGVkIHdpdGggXFwnbmVzdGVkXFwnIG91dHB1dCBzdHlsZS4gUGxlYXNlIGRlZmluZSBhIGNvcnJlc3BvbmRpbmcgb3V0cHV0IGZpbGVuYW1lIHBhdHRlcm4gb3IgdXNlIGlubGluZSBwYXJhbWV0ZXIgXFwnbmVzdGVkRmlsZW5hbWVQYXR0ZXJuXFwnJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgb3JkZXI6IDM0XG5cbiAgICAgICAgbmVzdGVkRmlsZW5hbWVQYXR0ZXJuOlxuICAgICAgICAgICAgdGl0bGU6ICdGaWxlbmFtZSBwYXR0ZXJuIGZvciBcXCduZXN0ZWRcXCcgY29tcGlsZWQgZmlsZXMnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0RlZmluZSB0aGUgcmVwbGFjZW1lbnQgcGF0dGVybiBmb3IgY29tcGlsZWQgZmlsZW5hbWVzIHdpdGggXFwnbmVzdGVkXFwnIG91dHB1dCBzdHlsZS4gUGxhY2Vob2xkZXJzIGFyZTogXFwnJDFcXCcgZm9yIGJhc2VuYW1lIG9mIGZpbGUgYW5kIFxcJyQyXFwnIGZvciBvcmlnaW5hbCBmaWxlIGV4dGVuc2lvbi4nXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJyQxLm5lc3RlZC5jc3MnXG4gICAgICAgICAgICBvcmRlcjogMzVcblxuICAgICAgICBjb21waWxlRXhwYW5kZWQ6XG4gICAgICAgICAgICB0aXRsZTogJ0NvbXBpbGUgd2l0aCBcXCdleHBhbmRlZFxcJyBvdXRwdXQgc3R5bGUnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQgU0FTUyBmaWxlcyBhcmUgY29tcGlsZWQgd2l0aCBcXCdleHBhbmRlZFxcJyBvdXRwdXQgc3R5bGUuIFBsZWFzZSBkZWZpbmUgYSBjb3JyZXNwb25kaW5nIG91dHB1dCBmaWxlbmFtZSBwYXR0ZXJuIG9yIHVzZSBpbmxpbmUgcGFyYW1ldGVyIFxcJ2V4cGFuZGVkRmlsZW5hbWVQYXR0ZXJuXFwnJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgb3JkZXI6IDM2XG5cbiAgICAgICAgZXhwYW5kZWRGaWxlbmFtZVBhdHRlcm46XG4gICAgICAgICAgICB0aXRsZTogJ0ZpbGVuYW1lIHBhdHRlcm4gZm9yIFxcJ2V4cGFuZGVkXFwnIGNvbXBpbGVkIGZpbGVzJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdEZWZpbmUgdGhlIHJlcGxhY2VtZW50IHBhdHRlcm4gZm9yIGNvbXBpbGVkIGZpbGVuYW1lcyB3aXRoIFxcJ2V4cGFuZGVkXFwnIG91dHB1dCBzdHlsZS4gUGxhY2Vob2xkZXJzIGFyZTogXFwnJDFcXCcgZm9yIGJhc2VuYW1lIG9mIGZpbGUgYW5kIFxcJyQyXFwnIGZvciBvcmlnaW5hbCBmaWxlIGV4dGVuc2lvbi4nXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJyQxLmNzcydcbiAgICAgICAgICAgIG9yZGVyOiAzN1xuXG4gICAgICAgIGluZGVudFR5cGU6XG4gICAgICAgICAgICB0aXRsZTogJ0luZGVudCB0eXBlJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJbmRlbnQgdHlwZSBmb3Igb3V0cHV0IENTUydcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBlbnVtOiBbJ1NwYWNlJywgJ1RhYiddXG4gICAgICAgICAgICBkZWZhdWx0OiAnU3BhY2UnXG4gICAgICAgICAgICBvcmRlcjogMzhcblxuICAgICAgICBpbmRlbnRXaWR0aDpcbiAgICAgICAgICAgIHRpdGxlOiAnSW5kZW50IHdpZHRoJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJbmRlbnQgd2lkdGg7IG51bWJlciBvZiBzcGFjZXMgb3IgdGFicydcbiAgICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgICAgICAgZW51bTogWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwXVxuICAgICAgICAgICAgZGVmYXVsdDogMlxuICAgICAgICAgICAgbWluaW11bTogMFxuICAgICAgICAgICAgbWF4aW11bTogMTBcbiAgICAgICAgICAgIG9yZGVyOiAzOVxuXG4gICAgICAgIGxpbmVmZWVkOlxuICAgICAgICAgICAgdGl0bGU6ICdMaW5lZmVlZCdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVXNlZCB0byBkZXRlcm1pbmUgd2hldGhlciB0byB1c2UgXFwnY3JcXCcsIFxcJ2NybGZcXCcsIFxcJ2xmXFwnIG9yIFxcJ2xmY3JcXCcgc2VxdWVuY2UgZm9yIGxpbmUgYnJlYWsnXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZW51bTogWydjcicsICdjcmxmJywgJ2xmJywgJ2xmY3InXVxuICAgICAgICAgICAgZGVmYXVsdDogJ2xmJ1xuICAgICAgICAgICAgb3JkZXI6IDQwXG5cbiAgICAgICAgc291cmNlTWFwOlxuICAgICAgICAgICAgdGl0bGU6ICdCdWlsZCBzb3VyY2UgbWFwJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkIGEgc291cmNlIG1hcCBpcyBnZW5lcmF0ZWQnXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBvcmRlcjogNDFcblxuICAgICAgICBzb3VyY2VNYXBFbWJlZDpcbiAgICAgICAgICAgIHRpdGxlOiAnRW1iZWQgc291cmNlIG1hcCdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCBzb3VyY2UgbWFwIGlzIGVtYmVkZGVkIGFzIGEgZGF0YSBVUkknXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBvcmRlcjogNDJcblxuICAgICAgICBzb3VyY2VNYXBDb250ZW50czpcbiAgICAgICAgICAgIHRpdGxlOiAnSW5jbHVkZSBjb250ZW50cyBpbiBzb3VyY2UgbWFwIGluZm9ybWF0aW9uJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkIGNvbnRlbnRzIGFyZSBpbmNsdWRlZCBpbiBzb3VyY2UgbWFwIGluZm9ybWF0aW9uJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgb3JkZXI6IDQzXG5cbiAgICAgICAgc291cmNlQ29tbWVudHM6XG4gICAgICAgICAgICB0aXRsZTogJ0luY2x1ZGUgYWRkaXRpb25hbCBkZWJ1Z2dpbmcgaW5mb3JtYXRpb24gaW4gdGhlIG91dHB1dCBDU1MgZmlsZSdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCBhZGRpdGlvbmFsIGRlYnVnZ2luZyBpbmZvcm1hdGlvbiBhcmUgYWRkZWQgdG8gdGhlIG91dHB1dCBmaWxlIGFzIENTUyBjb21tZW50cy4gSWYgQ1NTIGlzIGNvbXByZXNzZWQgdGhpcyBmZWF0dXJlIGlzIGRpc2FibGVkIGJ5IFNBU1MgY29tcGlsZXInXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBvcmRlcjogNDRcblxuICAgICAgICBpbmNsdWRlUGF0aDpcbiAgICAgICAgICAgIHRpdGxlOiAnSW5jbHVkZSBwYXRocydcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUGF0aHMgdG8gbG9vayBmb3IgaW1wb3J0ZWQgZmlsZXMgKEBpbXBvcnQgZGVjbGFyYXRpb25zKTsgY29tbWEgc2VwYXJhdGVkLCBlYWNoIHBhdGggc3Vycm91bmRlZCBieSBxdW90ZXMnXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgICAgIG9yZGVyOiA0NVxuXG4gICAgICAgIHByZWNpc2lvbjpcbiAgICAgICAgICAgIHRpdGxlOiAnUHJlY2lzaW9uJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdVc2VkIHRvIGRldGVybWluZSBob3cgbWFueSBkaWdpdHMgYWZ0ZXIgdGhlIGRlY2ltYWwgd2lsbCBiZSBhbGxvd2VkLiBGb3IgaW5zdGFuY2UsIGlmIHlvdSBoYWQgYSBkZWNpbWFsIG51bWJlciBvZiAxLjIzNDU2Nzg5IGFuZCBhIHByZWNpc2lvbiBvZiA1LCB0aGUgcmVzdWx0IHdpbGwgYmUgMS4yMzQ1NyBpbiB0aGUgZmluYWwgQ1NTJ1xuICAgICAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICAgICAgICBkZWZhdWx0OiA1XG4gICAgICAgICAgICBtaW5pbXVtOiAwXG4gICAgICAgICAgICBvcmRlcjogNDZcblxuICAgICAgICBpbXBvcnRlcjpcbiAgICAgICAgICAgIHRpdGxlOiAnRmlsZW5hbWUgdG8gY3VzdG9tIGltcG9ydGVyJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQYXRoIHRvIC5qcyBmaWxlIGNvbnRhaW5pbmcgY3VzdG9tIGltcG9ydGVyJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgICAgICBvcmRlcjogNDdcblxuICAgICAgICBmdW5jdGlvbnM6XG4gICAgICAgICAgICB0aXRsZTogJ0ZpbGVuYW1lIHRvIGN1c3RvbSBmdW5jdGlvbnMnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1BhdGggdG8gLmpzIGZpbGUgY29udGFpbmluZyBjdXN0b20gZnVuY3Rpb25zJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgICAgICBvcmRlcjogNDhcblxuXG4gICAgICAgICMgTm90aWZpY2F0aW9uIG9wdGlvbnNcblxuICAgICAgICBub3RpZmljYXRpb25zOlxuICAgICAgICAgICAgdGl0bGU6ICdOb3RpZmljYXRpb24gdHlwZSdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2VsZWN0IHdoaWNoIHR5cGVzIG9mIG5vdGlmaWNhdGlvbnMgeW91IHdpc2ggdG8gc2VlJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGVudW06IFsnUGFuZWwnLCAnTm90aWZpY2F0aW9ucycsICdQYW5lbCwgTm90aWZpY2F0aW9ucyddXG4gICAgICAgICAgICBkZWZhdWx0OiAnUGFuZWwnXG4gICAgICAgICAgICBvcmRlcjogNjBcblxuICAgICAgICBhdXRvSGlkZVBhbmVsOlxuICAgICAgICAgICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IGhpZGUgcGFuZWwgb24gLi4uJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZWxlY3Qgb24gd2hpY2ggZXZlbnQgdGhlIHBhbmVsIHNob3VsZCBhdXRvbWF0aWNhbGx5IGRpc2FwcGVhcidcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBlbnVtOiBbJ05ldmVyJywgJ1N1Y2Nlc3MnLCAnRXJyb3InLCAnU3VjY2VzcywgRXJyb3InXVxuICAgICAgICAgICAgZGVmYXVsdDogJ1N1Y2Nlc3MnXG4gICAgICAgICAgICBvcmRlcjogNjFcblxuICAgICAgICBhdXRvSGlkZVBhbmVsRGVsYXk6XG4gICAgICAgICAgICB0aXRsZTogJ1BhbmVsLWF1dG8taGlkZSBkZWxheSdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGVsYXkgYWZ0ZXIgd2hpY2ggcGFuZWwgaXMgYXV0b21hdGljYWxseSBoaWRkZW4nXG4gICAgICAgICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgICAgICAgIGRlZmF1bHQ6IDMwMDBcbiAgICAgICAgICAgIG9yZGVyOiA2MlxuXG4gICAgICAgIGF1dG9IaWRlTm90aWZpY2F0aW9uczpcbiAgICAgICAgICAgIHRpdGxlOiAnQXV0b21hdGljYWxseSBoaWRlIG5vdGlmaWNhdGlvbnMgb24gLi4uJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZWxlY3Qgd2hpY2ggdHlwZXMgb2Ygbm90aWZpY2F0aW9ucyBzaG91bGQgYXV0b21hdGljYWxseSBkaXNhcHBlYXInXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZW51bTogWydOZXZlcicsICdJbmZvLCBTdWNjZXNzJywgJ0Vycm9yJywgJ0luZm8sIFN1Y2Nlc3MsIEVycm9yJ11cbiAgICAgICAgICAgIGRlZmF1bHQ6ICdJbmZvLCBTdWNjZXNzJ1xuICAgICAgICAgICAgb3JkZXI6IDYzXG5cbiAgICAgICAgc2hvd1N0YXJ0Q29tcGlsaW5nTm90aWZpY2F0aW9uOlxuICAgICAgICAgICAgdGl0bGU6ICdTaG93IFxcJ1N0YXJ0IENvbXBpbGluZ1xcJyBOb3RpZmljYXRpb24nXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0lmIGVuYWJsZWQgYSBcXCdTdGFydCBDb21waWxpbmdcXCcgbm90aWZpY2F0aW9uIGlzIHNob3duJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgb3JkZXI6IDY0XG5cbiAgICAgICAgc2hvd0FkZGl0aW9uYWxDb21waWxhdGlvbkluZm86XG4gICAgICAgICAgICB0aXRsZTogJ1Nob3cgYWRkaXRpb25hbCBjb21waWxhdGlvbiBpbmZvJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkIGFkZGl0aW9uYSBpbmZvcyBsaWtlIGR1cmF0aW9uIG9yIGZpbGUgc2l6ZSBpcyBwcmVzZW50ZWQnXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgICAgIG9yZGVyOiA2NVxuXG4gICAgICAgIHNob3dOb2RlU2Fzc091dHB1dDpcbiAgICAgICAgICAgIHRpdGxlOiAnU2hvdyBub2RlLXNhc3Mgb3V0cHV0IGFmdGVyIGNvbXBpbGF0aW9uJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkIGRldGFpbGVkIG91dHB1dCBvZiBub2RlLXNhc3MgY29tbWFuZCBpcyBzaG93biBpbiBhIG5ldyB0YWIgc28geW91IGNhbiBhbmFseXNlIG91dHB1dCdcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiA2NlxuXG4gICAgICAgIHNob3dPbGRQYXJhbWV0ZXJzV2FybmluZzpcbiAgICAgICAgICAgIHRpdGxlOiAnU2hvdyB3YXJuaW5nIHdoZW4gdXNpbmcgb2xkIHBhcmFtdGVycydcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCBhbnkgdGltZSB5b3UgY29tcGlsZSBhIFNBU1MgZmlsZSB1bmQgeW91IHVzZSBvbGQgaW5saW5lIHBhcmFtdGVycywgYW4gd2FybmluZyB3aWxsIGJlIG9jY3VyIG5vdCB0byB1c2UgdGhlbSdcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgb3JkZXI6IDY2XG5cblxuICAgICAgICAjIEFkdmFuY2VkIG9wdGlvbnNcblxuICAgICAgICBub2RlU2Fzc1RpbWVvdXQ6XG4gICAgICAgICAgICB0aXRsZTogJ1xcJ25vZGUtc2Fzc1xcJyBleGVjdXRpb24gdGltZW91dCdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWF4aW1hbCBleGVjdXRpb24gdGltZSBvZiBcXCdub2RlLXNhc3NcXCcnXG4gICAgICAgICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEwMDAwXG4gICAgICAgICAgICBvcmRlcjogODBcblxuICAgICAgICBub2RlU2Fzc1BhdGg6XG4gICAgICAgICAgICB0aXRsZTogJ1BhdGggdG8gXFwnbm9kZS1zYXNzXFwnIGNvbW1hbmQnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Fic29sdXRlIHBhdGggd2hlcmUgXFwnbm9kZS1zYXNzXFwnIGV4ZWN1dGFibGUgaXMgcGxhY2VkLiBQbGVhc2UgcmVhZCBkb2N1bWVudGF0aW9uIGJlZm9yZSB1c2FnZSEnXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgICAgIG9yZGVyOiA4MVxuXG5cbiAgICBzYXNzQXV0b2NvbXBpbGVWaWV3OiBudWxsXG4gICAgbWFpblN1Ym1lbnU6IG51bGxcbiAgICBjb250ZXh0TWVudUl0ZW06IG51bGxcblxuXG4gICAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAgICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAgICAgQHNhc3NBdXRvY29tcGlsZVZpZXcgPSBuZXcgU2Fzc0F1dG9jb21waWxlVmlldyhuZXcgU2Fzc0F1dG9jb21waWxlT3B0aW9ucygpLCBzdGF0ZS5zYXNzQXV0b2NvbXBpbGVWaWV3U3RhdGUpXG4gICAgICAgIEBpc1Byb2Nlc3NpbmcgPSBmYWxzZVxuXG5cbiAgICAgICAgIyBEZXByZWNhdGVkIG9wdGlvbiAtLSBSZW1vdmUgaW4gbGF0ZXIgdmVyc2lvbiEhIVxuICAgICAgICBpZiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnZW5hYmxlZCcpXG4gICAgICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnY29tcGlsZU9uU2F2ZScsIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdlbmFibGVkJykpXG4gICAgICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnVuc2V0KCdlbmFibGVkJylcbiAgICAgICAgaWYgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ291dHB1dFN0eWxlJylcbiAgICAgICAgICAgIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMudW5zZXQoJ291dHB1dFN0eWxlJylcbiAgICAgICAgaWYgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ21hY09zTm9kZVNhc3NQYXRoJylcbiAgICAgICAgICAgIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuc2V0KCdub2RlU2Fzc1BhdGgnLCBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnbWFjT3NOb2RlU2Fzc1BhdGgnKSlcbiAgICAgICAgICAgIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMudW5zZXQoJ21hY09zTm9kZVNhc3NQYXRoJylcblxuXG4gICAgICAgIEByZWdpc3RlckNvbW1hbmRzKClcbiAgICAgICAgQHJlZ2lzdGVyVGV4dEVkaXRvclNhdmVDYWxsYmFjaygpXG4gICAgICAgIEByZWdpc3RlckNvbmZpZ09ic2VydmVyKClcbiAgICAgICAgQHJlZ2lzdGVyQ29udGV4dE1lbnVJdGVtKClcblxuXG4gICAgZGVhY3RpdmF0ZTogKCkgLT5cbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgICBAc2Fzc0F1dG9jb21waWxlVmlldy5kZXN0cm95KClcblxuXG4gICAgc2VyaWFsaXplOiAoKSAtPlxuICAgICAgICBzYXNzQXV0b2NvbXBpbGVWaWV3U3RhdGU6IEBzYXNzQXV0b2NvbXBpbGVWaWV3LnNlcmlhbGl6ZSgpXG5cblxuICAgIHJlZ2lzdGVyQ29tbWFuZHM6ICgpIC0+XG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgICAgICAgJ3Nhc3MtYXV0b2NvbXBpbGU6Y29tcGlsZS10by1maWxlJzogKGV2dCkgPT5cbiAgICAgICAgICAgICAgICBAY29tcGlsZVRvRmlsZShldnQpXG5cbiAgICAgICAgICAgICdzYXNzLWF1dG9jb21waWxlOmNvbXBpbGUtZGlyZWN0JzogKGV2dCkgPT5cbiAgICAgICAgICAgICAgICBAY29tcGlsZURpcmVjdChldnQpXG5cbiAgICAgICAgICAgICdzYXNzLWF1dG9jb21waWxlOnRvZ2dsZS1jb21waWxlLW9uLXNhdmUnOiA9PlxuICAgICAgICAgICAgICAgIEB0b2dnbGVDb21waWxlT25TYXZlKClcblxuICAgICAgICAgICAgJ3Nhc3MtYXV0b2NvbXBpbGU6dG9nZ2xlLW91dHB1dC1zdHlsZS1uZXN0ZWQnOiA9PlxuICAgICAgICAgICAgICAgIEB0b2dnbGVPdXRwdXRTdHlsZSgnTmVzdGVkJylcblxuICAgICAgICAgICAgJ3Nhc3MtYXV0b2NvbXBpbGU6dG9nZ2xlLW91dHB1dC1zdHlsZS1jb21wYWN0JzogPT5cbiAgICAgICAgICAgICAgICBAdG9nZ2xlT3V0cHV0U3R5bGUoJ0NvbXBhY3QnKVxuXG4gICAgICAgICAgICAnc2Fzcy1hdXRvY29tcGlsZTp0b2dnbGUtb3V0cHV0LXN0eWxlLWV4cGFuZGVkJzogPT5cbiAgICAgICAgICAgICAgICBAdG9nZ2xlT3V0cHV0U3R5bGUoJ0V4cGFuZGVkJylcblxuICAgICAgICAgICAgJ3Nhc3MtYXV0b2NvbXBpbGU6dG9nZ2xlLW91dHB1dC1zdHlsZS1jb21wcmVzc2VkJzogPT5cbiAgICAgICAgICAgICAgICBAdG9nZ2xlT3V0cHV0U3R5bGUoJ0NvbXByZXNzZWQnKVxuXG4gICAgICAgICAgICAnc2Fzcy1hdXRvY29tcGlsZTpjb21waWxlLWV2ZXJ5LXNhc3MtZmlsZSc6ID0+XG4gICAgICAgICAgICAgICAgQHNlbGVjdENvbXBpbGVGaWxlVHlwZSgnZXZlcnknKVxuXG4gICAgICAgICAgICAnc2Fzcy1hdXRvY29tcGlsZTpjb21waWxlLW9ubHktd2l0aC1maXJzdC1saW5lLWNvbW1lbnQnOiA9PlxuICAgICAgICAgICAgICAgIEBzZWxlY3RDb21waWxlRmlsZVR5cGUoJ2ZpcnN0LWxpbmUtY29tbWVudCcpXG5cbiAgICAgICAgICAgICdzYXNzLWF1dG9jb21waWxlOnRvZ2dsZS1jaGVjay1vdXRwdXQtZmlsZS1hbHJlYWR5LWV4aXN0cyc6ID0+XG4gICAgICAgICAgICAgICAgQHRvZ2dsZUNoZWNrT3V0cHV0RmlsZUFscmVhZHlFeGlzdHMoKVxuXG4gICAgICAgICAgICAnc2Fzcy1hdXRvY29tcGlsZTp0b2dnbGUtZGlyZWN0bHktanVtcC10by1lcnJvcic6ID0+XG4gICAgICAgICAgICAgICAgQHRvZ2dsZURpcmVjdGx5SnVtcFRvRXJyb3IoKVxuXG4gICAgICAgICAgICAnc2Fzcy1hdXRvY29tcGlsZTp0b2dnbGUtc2hvdy1jb21waWxlLXNhc3MtaXRlbS1pbi10cmVlLXZpZXctY29udGV4dC1tZW51JzogPT5cbiAgICAgICAgICAgICAgICBAdG9nZ2xlU2hvd0NvbXBpbGVTYXNzSXRlbUluVHJlZVZpZXdDb250ZXh0TWVudSgpXG5cbiAgICAgICAgICAgICdzYXNzLWF1dG9jb21waWxlOmNsb3NlLW1lc3NhZ2UtcGFuZWwnOiAoZXZ0KSA9PlxuICAgICAgICAgICAgICAgIEBjbG9zZVBhbmVsKClcbiAgICAgICAgICAgICAgICBldnQuYWJvcnRLZXlCaW5kaW5nKClcblxuXG4gICAgY29tcGlsZVRvRmlsZTogKGV2dCkgLT5cbiAgICAgICAgZmlsZW5hbWUgPSB1bmRlZmluZWRcbiAgICAgICAgaWYgZXZ0LnRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpIGlzICdhdG9tLXRleHQtZWRpdG9yJyBvciBldnQudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgaXMgJ2lucHV0J1xuICAgICAgICAgICAgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgICBpZiBhY3RpdmVFZGl0b3JcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IGFjdGl2ZUVkaXRvci5nZXRVUkkoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0YXJnZXQgPSBldnQudGFyZ2V0XG4gICAgICAgICAgICBpZiBldnQudGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgaXMgJ3NwYW4nXG4gICAgICAgICAgICAgICAgdGFyZ2V0PSBldnQudGFyZ2V0LnBhcmVudE5vZGVcbiAgICAgICAgICAgIGlzRmlsZUl0ZW0gPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdjbGFzcycpLnNwbGl0KCcgJykuaW5kZXhPZignZmlsZScpID49IDBcbiAgICAgICAgICAgIGlmIGlzRmlsZUl0ZW1cbiAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IHRhcmdldC5maXJzdEVsZW1lbnRDaGlsZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcpXG5cbiAgICAgICAgaWYgQGlzU2Fzc0ZpbGUoZmlsZW5hbWUpXG4gICAgICAgICAgICBAY29tcGlsZShOb2RlU2Fzc0NvbXBpbGVyLk1PREVfRklMRSwgZmlsZW5hbWUsIGZhbHNlKVxuXG5cbiAgICBjb21waWxlRGlyZWN0OiAoZXZ0KSAtPlxuICAgICAgICByZXR1cm4gdW5sZXNzIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBAY29tcGlsZShOb2RlU2Fzc0NvbXBpbGVyLk1PREVfRElSRUNUKVxuXG5cbiAgICB0b2dnbGVDb21waWxlT25TYXZlOiAoKSAtPlxuICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnY29tcGlsZU9uU2F2ZScsICFTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZU9uU2F2ZScpKVxuICAgICAgICBpZiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZU9uU2F2ZScpXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyAnU0FTUy1BdXRvQ29tcGlsZTogRW5hYmxlZCBjb21waWxlIG9uIHNhdmUnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nICdTQVNTLUF1dG9Db21waWxlOiBEaXNhYmxlZCBjb21waWxlIG9uIHNhdmUnXG4gICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuXG5cbiAgICB0b2dnbGVPdXRwdXRTdHlsZTogKG91dHB1dFN0eWxlKSAtPlxuICAgICAgICBzd2l0Y2ggb3V0cHV0U3R5bGUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgd2hlbiAnY29tcHJlc3NlZCcgdGhlbiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnY29tcGlsZUNvbXByZXNzZWQnLCAhU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NvbXBpbGVDb21wcmVzc2VkJykpXG4gICAgICAgICAgICB3aGVuICdjb21wYWN0JyB0aGVuIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuc2V0KCdjb21waWxlQ29tcGFjdCcsICFTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZUNvbXBhY3QnKSlcbiAgICAgICAgICAgIHdoZW4gJ25lc3RlZCcgdGhlbiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnY29tcGlsZU5lc3RlZCcsICFTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZU5lc3RlZCcpKVxuICAgICAgICAgICAgd2hlbiAnZXhwYW5kZWQnIHRoZW4gU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5zZXQoJ2NvbXBpbGVFeHBhbmRlZCcsICFTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZUV4cGFuZGVkJykpXG4gICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuXG5cbiAgICBzZWxlY3RDb21waWxlRmlsZVR5cGU6ICh0eXBlKSAtPlxuICAgICAgICBpZiB0eXBlIGlzICdldmVyeSdcbiAgICAgICAgICAgIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuc2V0KCdjb21waWxlRmlsZXMnLCAnRXZlcnkgU0FTUyBmaWxlJylcbiAgICAgICAgZWxzZSBpZiB0eXBlIGlzICdmaXJzdC1saW5lLWNvbW1lbnQnXG4gICAgICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnY29tcGlsZUZpbGVzJywgJ09ubHkgd2l0aCBmaXJzdC1saW5lLWNvbW1lbnQnKVxuXG4gICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuXG5cbiAgICB0b2dnbGVDaGVja091dHB1dEZpbGVBbHJlYWR5RXhpc3RzOiAoKSAtPlxuICAgICAgICBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLnNldCgnY2hlY2tPdXRwdXRGaWxlQWxyZWFkeUV4aXN0cycsICFTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY2hlY2tPdXRwdXRGaWxlQWxyZWFkeUV4aXN0cycpKVxuICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcblxuXG4gICAgdG9nZ2xlRGlyZWN0bHlKdW1wVG9FcnJvcjogKCkgLT5cbiAgICAgICAgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5zZXQoJ2RpcmVjdGx5SnVtcFRvRXJyb3InLCAhU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2RpcmVjdGx5SnVtcFRvRXJyb3InKSlcbiAgICAgICAgQHVwZGF0ZU1lbnVJdGVtcygpXG5cblxuICAgIHRvZ2dsZVNob3dDb21waWxlU2Fzc0l0ZW1JblRyZWVWaWV3Q29udGV4dE1lbnU6ICgpIC0+XG4gICAgICAgIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuc2V0KCdzaG93Q29tcGlsZVNhc3NJdGVtSW5UcmVlVmlld0NvbnRleHRNZW51JywgIVNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdzaG93Q29tcGlsZVNhc3NJdGVtSW5UcmVlVmlld0NvbnRleHRNZW51JykpXG4gICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuXG5cbiAgICBjb21waWxlOiAobW9kZSwgZmlsZW5hbWUgPSBudWxsLCBtaW5pZnlPblNhdmUgPSBmYWxzZSkgLT5cbiAgICAgICAgaWYgQGlzUHJvY2Vzc2luZ1xuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgb3B0aW9ucyA9IG5ldyBTYXNzQXV0b2NvbXBpbGVPcHRpb25zKClcbiAgICAgICAgQGlzUHJvY2Vzc2luZyA9IHRydWVcblxuICAgICAgICBAc2Fzc0F1dG9jb21waWxlVmlldy51cGRhdGVPcHRpb25zKG9wdGlvbnMpXG4gICAgICAgIEBzYXNzQXV0b2NvbXBpbGVWaWV3LmhpZGVQYW5lbChmYWxzZSwgdHJ1ZSlcblxuICAgICAgICBAY29tcGlsZXIgPSBuZXcgTm9kZVNhc3NDb21waWxlcihvcHRpb25zKVxuICAgICAgICBAY29tcGlsZXIub25TdGFydCAoYXJncykgPT5cbiAgICAgICAgICAgIEBzYXNzQXV0b2NvbXBpbGVWaWV3LnN0YXJ0Q29tcGlsYXRpb24oYXJncylcblxuICAgICAgICBAY29tcGlsZXIub25XYXJuaW5nIChhcmdzKSA9PlxuICAgICAgICAgICAgQHNhc3NBdXRvY29tcGlsZVZpZXcud2FybmluZyhhcmdzKVxuXG4gICAgICAgIEBjb21waWxlci5vblN1Y2Nlc3MgKGFyZ3MpID0+XG4gICAgICAgICAgICBAc2Fzc0F1dG9jb21waWxlVmlldy5zdWNjZXNzZnVsbENvbXBpbGF0aW9uKGFyZ3MpXG5cbiAgICAgICAgQGNvbXBpbGVyLm9uRXJyb3IgKGFyZ3MpID0+XG4gICAgICAgICAgICBAc2Fzc0F1dG9jb21waWxlVmlldy5lcnJvbmVvdXNDb21waWxhdGlvbihhcmdzKVxuXG4gICAgICAgIEBjb21waWxlci5vbkZpbmlzaGVkIChhcmdzKSA9PlxuICAgICAgICAgICAgQHNhc3NBdXRvY29tcGlsZVZpZXcuZmluaXNoZWQoYXJncylcbiAgICAgICAgICAgIEBpc1Byb2Nlc3NpbmcgPSBmYWxzZVxuICAgICAgICAgICAgQGNvbXBpbGVyLmRlc3Ryb3koKVxuICAgICAgICAgICAgQGNvbXBpbGVyID0gbnVsbFxuXG4gICAgICAgIEBjb21waWxlci5jb21waWxlKG1vZGUsIGZpbGVuYW1lLCBtaW5pZnlPblNhdmUpXG5cblxuICAgIHJlZ2lzdGVyVGV4dEVkaXRvclNhdmVDYWxsYmFjazogKCkgLT5cbiAgICAgICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZFNhdmUgPT5cbiAgICAgICAgICAgICAgICBpZiAhQGlzUHJvY2Vzc2luZyBhbmQgZWRpdG9yIGFuZCBlZGl0b3IuZ2V0VVJJIGFuZCBAaXNTYXNzRmlsZShlZGl0b3IuZ2V0VVJJKCkpXG4gICAgICAgICAgICAgICAgICAgQGNvbXBpbGUoTm9kZVNhc3NDb21waWxlci5NT0RFX0ZJTEUsIGVkaXRvci5nZXRVUkkoKSwgdHJ1ZSlcblxuXG4gICAgaXNTYXNzRmlsZTogKGZpbGVuYW1lKSAtPlxuICAgICAgICByZXR1cm4gRmlsZS5oYXNGaWxlRXh0ZW5zaW9uKGZpbGVuYW1lLCBbJy5zY3NzJywgJy5zYXNzJ10pXG5cblxuICAgIHJlZ2lzdGVyQ29uZmlnT2JzZXJ2ZXI6ICgpIC0+XG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuT1BUSU9OU19QUkVGSVggKyAnY29tcGlsZU9uU2F2ZScsIChuZXdWYWx1ZSkgPT5cbiAgICAgICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLk9QVElPTlNfUFJFRklYICsgJ2NvbXBpbGVGaWxlcycsIChuZXdWYWx1ZSkgPT5cbiAgICAgICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLk9QVElPTlNfUFJFRklYICsgJ2NoZWNrT3V0cHV0RmlsZUFscmVhZHlFeGlzdHMnLCAobmV3VmFsdWUpID0+XG4gICAgICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5PUFRJT05TX1BSRUZJWCArICdkaXJlY3RseUp1bXBUb0Vycm9yJywgKG5ld1ZhbHVlKSA9PlxuICAgICAgICAgICAgQHVwZGF0ZU1lbnVJdGVtcygpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuT1BUSU9OU19QUkVGSVggKyAnc2hvd0NvbXBpbGVTYXNzSXRlbUluVHJlZVZpZXdDb250ZXh0TWVudScsIChuZXdWYWx1ZSkgPT5cbiAgICAgICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuT1BUSU9OU19QUkVGSVggKyAnY29tcGlsZUNvbXByZXNzZWQnLCAobmV3VmFsdWUpID0+XG4gICAgICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5PUFRJT05TX1BSRUZJWCArICdjb21waWxlQ29tcGFjdCcsIChuZXdWYWx1ZSkgPT5cbiAgICAgICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLk9QVElPTlNfUFJFRklYICsgJ2NvbXBpbGVOZXN0ZWQnLCAobmV3VmFsdWUpID0+XG4gICAgICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5PUFRJT05TX1BSRUZJWCArICdjb21waWxlRXhwYW5kZWQnLCAobmV3VmFsdWUpID0+XG4gICAgICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcblxuXG4gICAgcmVnaXN0ZXJDb250ZXh0TWVudUl0ZW06ICgpIC0+XG4gICAgICAgIG1lbnVJdGVtID0gQGdldENvbnRleHRNZW51SXRlbSgpXG4gICAgICAgIG1lbnVJdGVtLnNob3VsZERpc3BsYXkgPSAoZXZ0KSA9PlxuICAgICAgICAgICAgc2hvd0l0ZW1PcHRpb24gPSBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnc2hvd0NvbXBpbGVTYXNzSXRlbUluVHJlZVZpZXdDb250ZXh0TWVudScpXG4gICAgICAgICAgICBpZiBzaG93SXRlbU9wdGlvblxuICAgICAgICAgICAgICAgIHRhcmdldCA9IGV2dC50YXJnZXRcbiAgICAgICAgICAgICAgICBpZiB0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSBpcyAnc3BhbidcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcblxuICAgICAgICAgICAgICAgIGlzRmlsZUl0ZW0gPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdjbGFzcycpLnNwbGl0KCcgJykuaW5kZXhPZignZmlsZScpID49IDBcbiAgICAgICAgICAgICAgICBpZiBpc0ZpbGVJdGVtXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0gdGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkXG4gICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQGlzU2Fzc0ZpbGUoZmlsZW5hbWUpXG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG5cbiAgICB1cGRhdGVNZW51SXRlbXM6IC0+XG4gICAgICAgIG1lbnUgPSBAZ2V0TWFpbk1lbnVTdWJtZW51KCkuc3VibWVudVxuICAgICAgICByZXR1cm4gdW5sZXNzIG1lbnVcblxuICAgICAgICBtZW51WzNdLmxhYmVsID0gKGlmIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdjb21waWxlT25TYXZlJykgdGhlbiAn4pyUJyBlbHNlICfinJUnKSArICcgIENvbXBpbGUgb24gU2F2ZSdcbiAgICAgICAgbWVudVs0XS5sYWJlbCA9IChpZiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY2hlY2tPdXRwdXRGaWxlQWxyZWFkeUV4aXN0cycpIHRoZW4gJ+KclCcgZWxzZSAn4pyVJykgKyAnICBDaGVjayBvdXRwdXQgZmlsZSBhbHJlYWR5IGV4aXN0cydcbiAgICAgICAgbWVudVs1XS5sYWJlbCA9IChpZiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnZGlyZWN0bHlKdW1wVG9FcnJvcicpIHRoZW4gJ+KclCcgZWxzZSAn4pyVJykgKyAnICBEaXJlY3RseSBqdW1wIHRvIGVycm9yJ1xuICAgICAgICBtZW51WzZdLmxhYmVsID0gKGlmIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdzaG93Q29tcGlsZVNhc3NJdGVtSW5UcmVlVmlld0NvbnRleHRNZW51JykgdGhlbiAn4pyUJyBlbHNlICfinJUnKSArICcgIFNob3cgXFwnQ29tcGlsZSBTQVNTXFwnIGl0ZW0gaW4gdHJlZSB2aWV3IGNvbnRleHQgbWVudSdcblxuICAgICAgICBjb21waWxlRmlsZU1lbnUgPSBtZW51WzhdLnN1Ym1lbnVcbiAgICAgICAgaWYgY29tcGlsZUZpbGVNZW51XG4gICAgICAgICAgICBjb21waWxlRmlsZU1lbnVbMF0uY2hlY2tlZCA9IFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdjb21waWxlRmlsZXMnKSBpcyAnRXZlcnkgU0FTUyBmaWxlJ1xuICAgICAgICAgICAgY29tcGlsZUZpbGVNZW51WzFdLmNoZWNrZWQgPSBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZUZpbGVzJykgaXMgJ09ubHkgd2l0aCBmaXJzdC1saW5lLWNvbW1lbnQnXG5cbiAgICAgICAgb3V0cHV0U3R5bGVzTWVudSA9IG1lbnVbOV0uc3VibWVudVxuICAgICAgICBpZiBvdXRwdXRTdHlsZXNNZW51XG4gICAgICAgICAgICBvdXRwdXRTdHlsZXNNZW51WzBdLmxhYmVsID0gKGlmIFNhc3NBdXRvY29tcGlsZU9wdGlvbnMuZ2V0KCdjb21waWxlQ29tcHJlc3NlZCcpIHRoZW4gJ+KclCcgZWxzZSAn4pyVJykgKyAnICBDb21wcmVzc2VkJ1xuICAgICAgICAgICAgb3V0cHV0U3R5bGVzTWVudVsxXS5sYWJlbCA9IChpZiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZUNvbXBhY3QnKSB0aGVuICfinJQnIGVsc2UgJ+KclScpICsgJyAgQ29tcGFjdCdcbiAgICAgICAgICAgIG91dHB1dFN0eWxlc01lbnVbMl0ubGFiZWwgPSAoaWYgU2Fzc0F1dG9jb21waWxlT3B0aW9ucy5nZXQoJ2NvbXBpbGVOZXN0ZWQnKSB0aGVuICfinJQnIGVsc2UgJ+KclScpICsgJyAgTmVzdGVkJ1xuICAgICAgICAgICAgb3V0cHV0U3R5bGVzTWVudVszXS5sYWJlbCA9IChpZiBTYXNzQXV0b2NvbXBpbGVPcHRpb25zLmdldCgnY29tcGlsZUV4cGFuZGVkJykgdGhlbiAn4pyUJyBlbHNlICfinJUnKSArICcgIEV4cGFuZGVkJ1xuXG4gICAgICAgIGF0b20ubWVudS51cGRhdGUoKVxuXG5cbiAgICBnZXRNYWluTWVudVN1Ym1lbnU6IC0+XG4gICAgICAgIGlmIEBtYWluU3VibWVudSBpcyBudWxsXG4gICAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgICBmb3IgbWVudSBpbiBhdG9tLm1lbnUudGVtcGxhdGVcbiAgICAgICAgICAgICAgICBpZiBtZW51LmxhYmVsIGlzICdQYWNrYWdlcycgfHwgbWVudS5sYWJlbCBpcyAnJlBhY2thZ2VzJ1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZm9yIHN1Ym1lbnUgaW4gbWVudS5zdWJtZW51XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzdWJtZW51LmxhYmVsIGlzICdTQVNTIEF1dG9jb21waWxlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBtYWluU3VibWVudSA9IHN1Ym1lbnVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGlmIGZvdW5kXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIHJldHVybiBAbWFpblN1Ym1lbnVcblxuXG4gICAgZ2V0Q29udGV4dE1lbnVJdGVtOiAtPlxuICAgICAgICBpZiBAY29udGV4dE1lbnVJdGVtIGlzIG51bGxcbiAgICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICAgIGZvciBpdGVtcyBpbiBhdG9tLmNvbnRleHRNZW51Lml0ZW1TZXRzXG4gICAgICAgICAgICAgICAgaWYgaXRlbXMuc2VsZWN0b3IgaXMgJy50cmVlLXZpZXcnXG4gICAgICAgICAgICAgICAgICAgIGZvciBpdGVtIGluIGl0ZW1zLml0ZW1zXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBpdGVtLmlkIGlzICdzYXNzLWF1dG9jb21waWxlLWNvbnRleHQtbWVudS1jb21waWxlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBjb250ZXh0TWVudUl0ZW0gPSBpdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgICAgIGlmIGZvdW5kXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIHJldHVybiBAY29udGV4dE1lbnVJdGVtXG5cblxuICAgIGNsb3NlUGFuZWw6ICgpIC0+XG4gICAgICAgIEBzYXNzQXV0b2NvbXBpbGVWaWV3LmhpZGVQYW5lbCgpXG4iXX0=
