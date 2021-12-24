(function() {
  var AtomMinifier, AtomMinifyOptions, AtomMinifyView, CompositeDisposable,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  AtomMinifyOptions = require('./options');

  AtomMinifyView = require('./atom-minify-view');

  AtomMinifier = require('./minifier');

  module.exports = {
    config: {
      minifyOnSave: {
        title: 'Minify on save',
        description: 'This option en-/disables minify on save.',
        type: 'boolean',
        "default": false,
        order: 1
      },
      showSavingInfo: {
        title: 'Show saving info',
        description: 'This option en-/disables showing some information about saving (percental & absolute).',
        type: 'boolean',
        "default": true,
        order: 2
      },
      checkOutputFileAlreadyExists: {
        title: 'Ask for overwriting already existent minified files',
        description: 'If target file already exists, atom-minify will ask you, if you want to overwrite this file',
        type: 'boolean',
        "default": false,
        order: 3
      },
      checkAlreadyMinifiedFile: {
        title: 'Ask for minification of already minified files',
        description: 'If filename contains \'.min.\', \'.minified.\' or \'.compressed.\', atom-minify will ask you, if you want to minify this file again',
        type: 'boolean',
        "default": true,
        order: 4
      },
      showMinifyItemInTreeViewContextMenu: {
        title: 'Show Minify-item in Tree View context menu',
        description: 'If enbaled, Tree View context menu contains a \'Minify\' item that allows you to minify that file via context menu.',
        type: 'string',
        "default": 'Only on CSS and JS files',
        "enum": ['Only on CSS and JS files', 'On every file', 'No'],
        order: 5
      },
      buffer: {
        title: 'Buffer',
        description: 'Only modify the buffer size when you have to compile large files.',
        type: 'integer',
        "default": 1024 * 1024,
        order: 20
      },
      cssMinifier: {
        title: 'CSS → Minifier',
        description: 'Select which CSS minifier you want to use.',
        type: 'string',
        "default": 'YUI Compressor',
        "enum": ['YUI Compressor', 'clean-css', 'CSSO', 'Sqwish'],
        order: 40
      },
      cssMinifiedFilenamePattern: {
        title: 'CSS → Filename pattern for minified file',
        description: 'Define the replacement pattern for minified CSS filename. If you want to minify \'Foo.CSS\', you can use $1 for \'Foo\' and $2 for \'CSS\'; The result of pattern \$1.minified.$2\' would be \'Foo.minified.CSS\'.',
        type: 'string',
        "default": '$1.min.$2',
        order: 41
      },
      cssParametersForYUI: {
        title: 'CSS → Options for YUI Compressor',
        type: 'string',
        "default": '',
        order: 42
      },
      cssParametersForCleanCSS: {
        title: 'CSS → Options for clean-css',
        type: 'string',
        "default": '',
        order: 43
      },
      cssParametersForCSSO: {
        title: 'CSS → Options for CSSO',
        type: 'string',
        "default": '',
        order: 44
      },
      cssParametersForSqwish: {
        title: 'CSS → Options for Sqwish',
        type: 'string',
        "default": '',
        order: 45
      },
      jsMinifier: {
        title: 'JS → Minifier',
        description: 'Select which JavaScript minifier you want to use.',
        type: 'string',
        "default": 'YUI Compressor',
        "enum": ['YUI Compressor', 'Google Closure Compiler', 'UglifyJS2'],
        order: 60
      },
      jsMinifiedFilenamePattern: {
        title: 'JS → Filename pattern for minified file',
        description: 'Define the replacement pattern for minified JS filename. If you want to minify \'Bar.JS\', you can use $1 for \'Bar\' and $2 for \'JS\'; The result of pattern \$1.xyz.$2\' would be \'Bar.xyz.JS\'.',
        type: 'string',
        "default": '$1.min.$2',
        order: 61
      },
      jsParametersForYUI: {
        title: 'JS → Options for YUI Compressor',
        type: 'string',
        "default": '',
        order: 62
      },
      jsParametersForGCC: {
        title: 'JS → Options for Google Closure Compiler',
        type: 'string',
        "default": '',
        order: 63
      },
      jsParametersForUglifyJS2: {
        title: 'JS → Options for UglifyJS2',
        type: 'string',
        "default": '',
        order: 64
      },
      notifications: {
        title: 'Notification type',
        description: 'Select which types of notifications you wish to see.',
        type: 'string',
        "default": 'Panel',
        "enum": ['Panel', 'Notifications', 'Panel, Notifications'],
        order: 80
      },
      autoHidePanel: {
        title: 'Automatically hide panel on ...',
        description: 'Select on which event the panel should automatically disappear.',
        type: 'string',
        "default": 'Success',
        "enum": ['Never', 'Success', 'Error', 'Success, Error'],
        order: 81
      },
      autoHidePanelDelay: {
        title: 'Panel-auto-hide delay',
        description: 'Delay after which panel is automatically hidden',
        type: 'integer',
        "default": 3000,
        order: 82
      },
      autoHideNotifications: {
        title: 'Automatically hide notifications on ...',
        description: 'Select which types of notifications should automatically disappear.',
        type: 'string',
        "default": 'Info, Success',
        "enum": ['Never', 'Info, Success', 'Error', 'Info, Success, Error'],
        order: 83
      },
      showStartMinificationNotification: {
        title: 'Show \'Minification started\' Notification',
        description: 'If enabled a \'Minification started\' notification is shown.',
        type: 'boolean',
        "default": false,
        order: 84
      },
      absoluteJavaPath: {
        title: 'Advanced → Java path',
        description: 'Please only use if you need this option! You can enter an absolute path to your Java executable. Useful when you have more than one Java installation',
        type: 'string',
        "default": '',
        order: 100
      }
    },
    atomMinifyView: null,
    mainSubmenu: null,
    contextMenuItem: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.editorSubscriptions = new CompositeDisposable;
      this.atomMinifyView = new AtomMinifyView(new AtomMinifyOptions(), state.atomMinifyViewState);
      this.isProcessing = false;
      this.registerCommands();
      this.registerTextEditorSaveCallback();
      this.registerConfigObserver();
      return this.registerContextMenuItem();
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.editorSubscriptions.dispose();
      return this.atomMinifyView.destroy();
    },
    serialize: function() {
      return {
        atomMinifyViewState: this.atomMinifyView.serialize()
      };
    },
    registerCommands: function() {
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-minify:toggle-minify-on-save': (function(_this) {
          return function() {
            return _this.toggleMinifyOnSave();
          };
        })(this),
        'atom-minify:minify-to-min-file': (function(_this) {
          return function(evt) {
            return _this.minifyToFile(evt);
          };
        })(this),
        'atom-minify:minify-direct': (function(_this) {
          return function() {
            return _this.minify(AtomMinifier.MINIFY_DIRECT);
          };
        })(this),
        'atom-minify:close-panel': (function(_this) {
          return function(evt) {
            _this.closePanel();
            return evt.abortKeyBinding();
          };
        })(this),
        'atom-minify:css-minifier-yui': (function(_this) {
          return function() {
            return _this.selectCssMinifier('YUI Compressor');
          };
        })(this),
        'atom-minify:css-minifier-clean-css': (function(_this) {
          return function() {
            return _this.selectCssMinifier('clean-css');
          };
        })(this),
        'atom-minify:css-minifier-csso': (function(_this) {
          return function() {
            return _this.selectCssMinifier('CSSO');
          };
        })(this),
        'atom-minify:css-minifier-sqwish': (function(_this) {
          return function() {
            return _this.selectCssMinifier('Sqwish');
          };
        })(this),
        'atom-minify:js-minifier-yui': (function(_this) {
          return function() {
            return _this.selectJsMinifier('YUI Compressor');
          };
        })(this),
        'atom-minify:js-minifier-gcc': (function(_this) {
          return function() {
            return _this.selectJsMinifier('Google Closure Compiler');
          };
        })(this),
        'atom-minify:js-minifier-uglifyjs2': (function(_this) {
          return function() {
            return _this.selectJsMinifier('UglifyJS2');
          };
        })(this)
      }));
    },
    registerTextEditorSaveCallback: function() {
      return this.editorSubscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.subscriptions.add(editor.onDidSave(function() {
            if (!_this.isProcessing) {
              return _this.minify(AtomMinifier.MINIFY_TO_MIN_FILE, null, true);
            }
          }));
        };
      })(this)));
    },
    registerConfigObserver: function() {
      this.subscriptions.add(atom.config.observe(AtomMinifyOptions.OPTIONS_PREFIX + 'cssMinifier', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe(AtomMinifyOptions.OPTIONS_PREFIX + 'jsMinifier', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe(AtomMinifyOptions.OPTIONS_PREFIX + 'minifyOnSave', (function(_this) {
        return function(newValue) {
          return _this.updateMenuItems();
        };
      })(this)));
    },
    registerContextMenuItem: function() {
      var menuItem;
      menuItem = this.getContextMenuItem();
      return menuItem.shouldDisplay = function(evt) {
        var basename, child, fileExtension, isFileItem, path, showItemOption, target;
        showItemOption = AtomMinifyOptions.get('showMinifyItemInTreeViewContextMenu');
        if (showItemOption === 'Only on CSS and JS files' || showItemOption === 'On every file') {
          target = evt.target;
          if (target.nodeName.toLowerCase() === 'span') {
            target = target.parentNode;
          }
          isFileItem = target.getAttribute('class').split(' ').indexOf('file') >= 0;
          if (isFileItem) {
            if (showItemOption === 'On every file') {
              return true;
            } else {
              path = require('path');
              child = target.firstElementChild;
              basename = path.basename(child.getAttribute('data-name'));
              fileExtension = path.extname(basename).replace('.', '').toLowerCase();
              return fileExtension === 'css' || fileExtension === 'js';
            }
          }
        }
        return false;
      };
    },
    toggleMinifyOnSave: function() {
      AtomMinifyOptions.set('minifyOnSave', !AtomMinifyOptions.get('minifyOnSave'));
      if (AtomMinifyOptions.get('minifyOnSave')) {
        atom.notifications.addInfo('Minify: Enabled minify on save');
      } else {
        atom.notifications.addWarning('Minify: Disabled minify on save');
      }
      return this.updateMenuItems();
    },
    selectCssMinifier: function(minifier) {
      var validCssMinifiers;
      validCssMinifiers = ['YUI Compressor', 'clean-css', 'CSSO', 'Sqwish'];
      if (indexOf.call(validCssMinifiers, minifier) >= 0) {
        AtomMinifyOptions.set('cssMinifier', minifier);
        atom.notifications.addInfo("Minify: " + minifier + " is new CSS minifier");
      }
      return this.updateMenuItems();
    },
    selectJsMinifier: function(minifier) {
      var validJsMinifiers;
      validJsMinifiers = ['YUI Compressor', 'Google Closure Compiler', 'UglifyJS2'];
      if (indexOf.call(validJsMinifiers, minifier) >= 0) {
        AtomMinifyOptions.set('jsMinifier', minifier);
        atom.notifications.addInfo("Minify: " + minifier + " is new JS minifier");
      }
      return this.updateMenuItems();
    },
    minifyToFile: function(evt) {
      var filename, isFileItem, target;
      filename = void 0;
      if (typeof evt === 'object') {
        target = evt.target;
        if (target.nodeName.toLowerCase() === 'span') {
          target = target.parentNode;
        }
        isFileItem = target.getAttribute('class').split(' ').indexOf('file') >= 0;
        if (isFileItem) {
          filename = target.firstElementChild.getAttribute('data-path');
        }
      }
      return this.minify(AtomMinifier.MINIFY_TO_MIN_FILE, filename, false);
    },
    minify: function(mode, filename, minifyOnSave) {
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
      options = new AtomMinifyOptions();
      this.isProcessing = true;
      this.panelIsHiddenAndReset = false;
      this.atomMinifyView.updateOptions(options);
      this.minifier = new AtomMinifier(options);
      this.minifier.onStart((function(_this) {
        return function(args) {
          if (!_this.panelIsHiddenAndReset) {
            _this.atomMinifyView.hidePanel(false, true);
            _this.panelIsHiddenAndReset = true;
          }
          return _this.atomMinifyView.startMinification(args);
        };
      })(this));
      this.minifier.onWarning((function(_this) {
        return function(args) {
          return _this.atomMinifyView.warning(args);
        };
      })(this));
      this.minifier.onSuccess((function(_this) {
        return function(args) {
          return _this.atomMinifyView.successfullMinification(args);
        };
      })(this));
      this.minifier.onError((function(_this) {
        return function(args) {
          if (!_this.panelIsHiddenAndReset) {
            _this.atomMinifyView.hidePanel(false, true);
            _this.panelIsHiddenAndReset = true;
          }
          return _this.atomMinifyView.erroneousMinification(args);
        };
      })(this));
      this.minifier.onFinished((function(_this) {
        return function(args) {
          _this.atomMinifyView.finished(args);
          _this.isProcessing = false;
          _this.minifier.destroy();
          return _this.minifier = null;
        };
      })(this));
      return this.minifier.minify(mode, filename, minifyOnSave);
    },
    updateMenuItems: function() {
      var cssMinifiers, jsMinifiers, menu;
      menu = this.getMainMenuSubmenu().submenu;
      if (!menu) {
        return;
      }
      menu[3].label = (AtomMinifyOptions.get('minifyOnSave') ? '✔' : '✕') + '  Minify on save';
      cssMinifiers = menu[5].submenu;
      if (cssMinifiers) {
        cssMinifiers[0].checked = AtomMinifyOptions.get('cssMinifier') === 'YUI Compressor';
        cssMinifiers[1].checked = AtomMinifyOptions.get('cssMinifier') === 'clean-css';
        cssMinifiers[2].checked = AtomMinifyOptions.get('cssMinifier') === 'CSSO';
        cssMinifiers[3].checked = AtomMinifyOptions.get('cssMinifier') === 'Sqwish';
      }
      jsMinifiers = menu[6].submenu;
      if (jsMinifiers) {
        jsMinifiers[0].checked = AtomMinifyOptions.get('jsMinifier') === 'YUI Compressor';
        jsMinifiers[1].checked = AtomMinifyOptions.get('jsMinifier') === 'Google Closure Compiler';
        jsMinifiers[2].checked = AtomMinifyOptions.get('jsMinifier') === 'UglifyJS2';
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
              if (submenu.label === 'Minify') {
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
              if (item.id === 'atom-minify-context-menu-minify') {
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
      return this.atomMinifyView.hidePanel();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2F0b20tbWluaWZ5L2xpYi9hdG9tLW1pbmlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9FQUFBO0lBQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixpQkFBQSxHQUFvQixPQUFBLENBQVEsV0FBUjs7RUFDcEIsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVI7O0VBQ2pCLFlBQUEsR0FBZSxPQUFBLENBQVEsWUFBUjs7RUFFZixNQUFNLENBQUMsT0FBUCxHQUVJO0lBQUEsTUFBQSxFQUlJO01BQUEsWUFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGdCQUFQO1FBQ0EsV0FBQSxFQUFhLDBDQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7UUFJQSxLQUFBLEVBQU8sQ0FKUDtPQURKO01BT0EsY0FBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGtCQUFQO1FBQ0EsV0FBQSxFQUFhLHdGQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7UUFJQSxLQUFBLEVBQU8sQ0FKUDtPQVJKO01BY0EsNEJBQUEsRUFDSTtRQUFBLEtBQUEsRUFBTyxxREFBUDtRQUNBLFdBQUEsRUFBYSw2RkFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1FBSUEsS0FBQSxFQUFPLENBSlA7T0FmSjtNQXFCQSx3QkFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGdEQUFQO1FBQ0EsV0FBQSxFQUFhLHFJQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7UUFJQSxLQUFBLEVBQU8sQ0FKUDtPQXRCSjtNQTRCQSxtQ0FBQSxFQUNJO1FBQUEs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SDtBQUNJLGtCQURKOztBQVBKLFNBRko7O0FBV0EsYUFBTyxJQUFDLENBQUE7SUFaUSxDQWxZcEI7SUFpWkEsa0JBQUEsRUFBb0IsU0FBQTtBQUNoQixVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsZUFBRCxLQUFvQixJQUF2QjtRQUNJLEtBQUEsR0FBUTtBQUNSO0FBQUEsYUFBQSxxQ0FBQTs7VUFDSSxJQUFHLEtBQUssQ0FBQyxRQUFOLEtBQWtCLFlBQXJCO0FBQ0k7QUFBQSxpQkFBQSx3Q0FBQTs7Y0FDSSxJQUFHLElBQUksQ0FBQyxFQUFMLEtBQVcsaUNBQWQ7Z0JBQ0ksS0FBQSxHQUFRO2dCQUNSLElBQUMsQ0FBQSxlQUFELEdBQW1CO0FBQ25CLHNCQUhKOztBQURKLGFBREo7O1VBT0EsSUFBRyxLQUFIO0FBQ0ksa0JBREo7O0FBUkosU0FGSjs7QUFZQSxhQUFPLElBQUMsQ0FBQTtJQWJRLENBalpwQjtJQWlhQSxVQUFBLEVBQVksU0FBQTthQUNSLElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBaEIsQ0FBQTtJQURRLENBamFaOztBQVJKIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSgnYXRvbScpXG5cbkF0b21NaW5pZnlPcHRpb25zID0gcmVxdWlyZSgnLi9vcHRpb25zJylcbkF0b21NaW5pZnlWaWV3ID0gcmVxdWlyZSgnLi9hdG9tLW1pbmlmeS12aWV3JylcbkF0b21NaW5pZmllciA9IHJlcXVpcmUoJy4vbWluaWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgICBjb25maWc6XG5cbiAgICAgICAgIyBHZW5lcmFsIHNldHRpbmdzXG5cbiAgICAgICAgbWluaWZ5T25TYXZlOlxuICAgICAgICAgICAgdGl0bGU6ICdNaW5pZnkgb24gc2F2ZSdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBvcHRpb24gZW4tL2Rpc2FibGVzIG1pbmlmeSBvbiBzYXZlLidcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiAxXG5cbiAgICAgICAgc2hvd1NhdmluZ0luZm86XG4gICAgICAgICAgICB0aXRsZTogJ1Nob3cgc2F2aW5nIGluZm8nXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgb3B0aW9uIGVuLS9kaXNhYmxlcyBzaG93aW5nIHNvbWUgaW5mb3JtYXRpb24gYWJvdXQgc2F2aW5nIChwZXJjZW50YWwgJiBhYnNvbHV0ZSkuJ1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgICAgICBvcmRlcjogMlxuXG4gICAgICAgIGNoZWNrT3V0cHV0RmlsZUFscmVhZHlFeGlzdHM6XG4gICAgICAgICAgICB0aXRsZTogJ0FzayBmb3Igb3ZlcndyaXRpbmcgYWxyZWFkeSBleGlzdGVudCBtaW5pZmllZCBmaWxlcydcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSWYgdGFyZ2V0IGZpbGUgYWxyZWFkeSBleGlzdHMsIGF0b20tbWluaWZ5IHdpbGwgYXNrIHlvdSwgaWYgeW91IHdhbnQgdG8gb3ZlcndyaXRlIHRoaXMgZmlsZSdcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiAzXG5cbiAgICAgICAgY2hlY2tBbHJlYWR5TWluaWZpZWRGaWxlOlxuICAgICAgICAgICAgdGl0bGU6ICdBc2sgZm9yIG1pbmlmaWNhdGlvbiBvZiBhbHJlYWR5IG1pbmlmaWVkIGZpbGVzJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBmaWxlbmFtZSBjb250YWlucyBcXCcubWluLlxcJywgXFwnLm1pbmlmaWVkLlxcJyBvciBcXCcuY29tcHJlc3NlZC5cXCcsIGF0b20tbWluaWZ5IHdpbGwgYXNrIHlvdSwgaWYgeW91IHdhbnQgdG8gbWluaWZ5IHRoaXMgZmlsZSBhZ2FpbidcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICAgICAgb3JkZXI6IDRcblxuICAgICAgICBzaG93TWluaWZ5SXRlbUluVHJlZVZpZXdDb250ZXh0TWVudTpcbiAgICAgICAgICAgIHRpdGxlOiAnU2hvdyBNaW5pZnktaXRlbSBpbiBUcmVlIFZpZXcgY29udGV4dCBtZW51J1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmJhbGVkLCBUcmVlIFZpZXcgY29udGV4dCBtZW51IGNvbnRhaW5zIGEgXFwnTWluaWZ5XFwnIGl0ZW0gdGhhdCBhbGxvd3MgeW91IHRvIG1pbmlmeSB0aGF0IGZpbGUgdmlhIGNvbnRleHQgbWVudS4nXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJ09ubHkgb24gQ1NTIGFuZCBKUyBmaWxlcydcbiAgICAgICAgICAgIGVudW06IFsnT25seSBvbiBDU1MgYW5kIEpTIGZpbGVzJywgJ09uIGV2ZXJ5IGZpbGUnLCAnTm8nXVxuICAgICAgICAgICAgb3JkZXI6IDVcblxuXG4gICAgICAgICMgRXh0ZW5kZWQgb3B0aW9ucyBmb3IgYWxsIG1pbmlmaWVyXG5cbiAgICAgICAgYnVmZmVyOlxuICAgICAgICAgICAgdGl0bGU6ICdCdWZmZXInXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ09ubHkgbW9kaWZ5IHRoZSBidWZmZXIgc2l6ZSB3aGVuIHlvdSBoYXZlIHRvIGNvbXBpbGUgbGFyZ2UgZmlsZXMuJ1xuICAgICAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICAgICAgICBkZWZhdWx0OiAxMDI0ICogMTAyNFxuICAgICAgICAgICAgb3JkZXI6IDIwXG5cblxuICAgICAgICAjIFBhcmFtZXRlcnMgZm9yIENTUyBtaW5pZmllcnNcblxuICAgICAgICBjc3NNaW5pZmllcjpcbiAgICAgICAgICAgIHRpdGxlOiAnQ1NTIOKGkiBNaW5pZmllcidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2VsZWN0IHdoaWNoIENTUyBtaW5pZmllciB5b3Ugd2FudCB0byB1c2UuJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdZVUkgQ29tcHJlc3NvcidcbiAgICAgICAgICAgIGVudW06IFsnWVVJIENvbXByZXNzb3InLCAnY2xlYW4tY3NzJywgJ0NTU08nLCAnU3F3aXNoJ11cbiAgICAgICAgICAgIG9yZGVyOiA0MFxuXG4gICAgICAgIGNzc01pbmlmaWVkRmlsZW5hbWVQYXR0ZXJuOlxuICAgICAgICAgICAgdGl0bGU6ICdDU1Mg4oaSIEZpbGVuYW1lIHBhdHRlcm4gZm9yIG1pbmlmaWVkIGZpbGUnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0RlZmluZSB0aGUgcmVwbGFjZW1lbnQgcGF0dGVybiBmb3IgbWluaWZpZWQgQ1NTIGZpbGVuYW1lLiBJZiB5b3Ugd2FudCB0byBtaW5pZnkgXFwnRm9vLkNTU1xcJywgeW91IGNhbiB1c2UgJDEgZm9yIFxcJ0Zvb1xcJyBhbmQgJDIgZm9yIFxcJ0NTU1xcJzsgVGhlIHJlc3VsdCBvZiBwYXR0ZXJuIFxcJDEubWluaWZpZWQuJDJcXCcgd291bGQgYmUgXFwnRm9vLm1pbmlmaWVkLkNTU1xcJy4nXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJyQxLm1pbi4kMidcbiAgICAgICAgICAgIG9yZGVyOiA0MVxuXG4gICAgICAgIGNzc1BhcmFtZXRlcnNGb3JZVUk6XG4gICAgICAgICAgICB0aXRsZTogJ0NTUyDihpIgT3B0aW9ucyBmb3IgWVVJIENvbXByZXNzb3InXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgICAgIG9yZGVyOiA0MlxuXG4gICAgICAgIGNzc1BhcmFtZXRlcnNGb3JDbGVhbkNTUzpcbiAgICAgICAgICAgIHRpdGxlOiAnQ1NTIOKGkiBPcHRpb25zIGZvciBjbGVhbi1jc3MnXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgICAgIG9yZGVyOiA0M1xuXG4gICAgICAgIGNzc1BhcmFtZXRlcnNGb3JDU1NPOlxuICAgICAgICAgICAgdGl0bGU6ICdDU1Mg4oaSIE9wdGlvbnMgZm9yIENTU08nXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgICAgIG9yZGVyOiA0NFxuXG4gICAgICAgIGNzc1BhcmFtZXRlcnNGb3JTcXdpc2g6XG4gICAgICAgICAgICB0aXRsZTogJ0NTUyDihpIgT3B0aW9ucyBmb3IgU3F3aXNoJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgICAgICBvcmRlcjogNDVcblxuXG4gICAgICAgICMgUGFyYW1ldGVycyBmb3IgSlMgbWluaWZpZXJzXG5cbiAgICAgICAganNNaW5pZmllcjpcbiAgICAgICAgICAgIHRpdGxlOiAnSlMg4oaSIE1pbmlmaWVyJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZWxlY3Qgd2hpY2ggSmF2YVNjcmlwdCBtaW5pZmllciB5b3Ugd2FudCB0byB1c2UuJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdZVUkgQ29tcHJlc3NvcidcbiAgICAgICAgICAgIGVudW06IFsnWVVJIENvbXByZXNzb3InLCAnR29vZ2xlIENsb3N1cmUgQ29tcGlsZXInLCAnVWdsaWZ5SlMyJ11cbiAgICAgICAgICAgIG9yZGVyOiA2MFxuXG4gICAgICAgIGpzTWluaWZpZWRGaWxlbmFtZVBhdHRlcm46XG4gICAgICAgICAgICB0aXRsZTogJ0pTIOKGkiBGaWxlbmFtZSBwYXR0ZXJuIGZvciBtaW5pZmllZCBmaWxlJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdEZWZpbmUgdGhlIHJlcGxhY2VtZW50IHBhdHRlcm4gZm9yIG1pbmlmaWVkIEpTIGZpbGVuYW1lLiBJZiB5b3Ugd2FudCB0byBtaW5pZnkgXFwnQmFyLkpTXFwnLCB5b3UgY2FuIHVzZSAkMSBmb3IgXFwnQmFyXFwnIGFuZCAkMiBmb3IgXFwnSlNcXCc7IFRoZSByZXN1bHQgb2YgcGF0dGVybiBcXCQxLnh5ei4kMlxcJyB3b3VsZCBiZSBcXCdCYXIueHl6LkpTXFwnLidcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiAnJDEubWluLiQyJ1xuICAgICAgICAgICAgb3JkZXI6IDYxXG5cbiAgICAgICAganNQYXJhbWV0ZXJzRm9yWVVJOlxuICAgICAgICAgICAgdGl0bGU6ICdKUyDihpIgT3B0aW9ucyBmb3IgWVVJIENvbXByZXNzb3InXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgICAgIG9yZGVyOiA2MlxuXG4gICAgICAgIGpzUGFyYW1ldGVyc0ZvckdDQzpcbiAgICAgICAgICAgIHRpdGxlOiAnSlMg4oaSIE9wdGlvbnMgZm9yIEdvb2dsZSBDbG9zdXJlIENvbXBpbGVyJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICAgICAgICBvcmRlcjogNjNcblxuICAgICAgICBqc1BhcmFtZXRlcnNGb3JVZ2xpZnlKUzI6XG4gICAgICAgICAgICB0aXRsZTogJ0pTIOKGkiBPcHRpb25zIGZvciBVZ2xpZnlKUzInXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgICAgIG9yZGVyOiA2NFxuXG5cbiAgICAgICAgIyBOb3RpZmljYXRpb24gb3B0aW9uc1xuXG4gICAgICAgIG5vdGlmaWNhdGlvbnM6XG4gICAgICAgICAgICB0aXRsZTogJ05vdGlmaWNhdGlvbiB0eXBlJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZWxlY3Qgd2hpY2ggdHlwZXMgb2Ygbm90aWZpY2F0aW9ucyB5b3Ugd2lzaCB0byBzZWUuJ1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAgIGRlZmF1bHQ6ICdQYW5lbCdcbiAgICAgICAgICAgIGVudW06IFsnUGFuZWwnLCAnTm90aWZpY2F0aW9ucycsICdQYW5lbCwgTm90aWZpY2F0aW9ucyddXG4gICAgICAgICAgICBvcmRlcjogODBcblxuICAgICAgICBhdXRvSGlkZVBhbmVsOlxuICAgICAgICAgICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IGhpZGUgcGFuZWwgb24gLi4uJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdTZWxlY3Qgb24gd2hpY2ggZXZlbnQgdGhlIHBhbmVsIHNob3VsZCBhdXRvbWF0aWNhbGx5IGRpc2FwcGVhci4nXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJ1N1Y2Nlc3MnXG4gICAgICAgICAgICBlbnVtOiBbJ05ldmVyJywgJ1N1Y2Nlc3MnLCAnRXJyb3InLCAnU3VjY2VzcywgRXJyb3InXVxuICAgICAgICAgICAgb3JkZXI6IDgxXG5cbiAgICAgICAgYXV0b0hpZGVQYW5lbERlbGF5OlxuICAgICAgICAgICAgdGl0bGU6ICdQYW5lbC1hdXRvLWhpZGUgZGVsYXknXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0RlbGF5IGFmdGVyIHdoaWNoIHBhbmVsIGlzIGF1dG9tYXRpY2FsbHkgaGlkZGVuJ1xuICAgICAgICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICAgICAgICBkZWZhdWx0OiAzMDAwXG4gICAgICAgICAgICBvcmRlcjogODJcblxuICAgICAgICBhdXRvSGlkZU5vdGlmaWNhdGlvbnM6XG4gICAgICAgICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgaGlkZSBub3RpZmljYXRpb25zIG9uIC4uLidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2VsZWN0IHdoaWNoIHR5cGVzIG9mIG5vdGlmaWNhdGlvbnMgc2hvdWxkIGF1dG9tYXRpY2FsbHkgZGlzYXBwZWFyLidcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiAnSW5mbywgU3VjY2VzcydcbiAgICAgICAgICAgIGVudW06IFsnTmV2ZXInLCAnSW5mbywgU3VjY2VzcycsICdFcnJvcicsICdJbmZvLCBTdWNjZXNzLCBFcnJvciddXG4gICAgICAgICAgICBvcmRlcjogODNcblxuICAgICAgICBzaG93U3RhcnRNaW5pZmljYXRpb25Ob3RpZmljYXRpb246XG4gICAgICAgICAgICB0aXRsZTogJ1Nob3cgXFwnTWluaWZpY2F0aW9uIHN0YXJ0ZWRcXCcgTm90aWZpY2F0aW9uJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkIGEgXFwnTWluaWZpY2F0aW9uIHN0YXJ0ZWRcXCcgbm90aWZpY2F0aW9uIGlzIHNob3duLidcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgICAgIG9yZGVyOiA4NFxuXG5cbiAgICAgICAgIyBBZHZhbmNlZCBvcHRpb25zXG5cbiAgICAgICAgYWJzb2x1dGVKYXZhUGF0aDpcbiAgICAgICAgICAgIHRpdGxlOiAnQWR2YW5jZWQg4oaSIEphdmEgcGF0aCdcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUGxlYXNlIG9ubHkgdXNlIGlmIHlvdSBuZWVkIHRoaXMgb3B0aW9uISBZb3UgY2FuIGVudGVyIGFuIGFic29sdXRlIHBhdGggdG8geW91ciBKYXZhIGV4ZWN1dGFibGUuIFVzZWZ1bCB3aGVuIHlvdSBoYXZlIG1vcmUgdGhhbiBvbmUgSmF2YSBpbnN0YWxsYXRpb24nXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJydcbiAgICAgICAgICAgIG9yZGVyOiAxMDBcblxuXG4gICAgYXRvbU1pbmlmeVZpZXc6IG51bGxcbiAgICBtYWluU3VibWVudTogbnVsbFxuICAgIGNvbnRleHRNZW51SXRlbTogbnVsbFxuXG5cbiAgICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICAgICBAYXRvbU1pbmlmeVZpZXcgPSBuZXcgQXRvbU1pbmlmeVZpZXcobmV3IEF0b21NaW5pZnlPcHRpb25zKCksIHN0YXRlLmF0b21NaW5pZnlWaWV3U3RhdGUpXG4gICAgICAgIEBpc1Byb2Nlc3NpbmcgPSBmYWxzZVxuXG4gICAgICAgIEByZWdpc3RlckNvbW1hbmRzKClcbiAgICAgICAgQHJlZ2lzdGVyVGV4dEVkaXRvclNhdmVDYWxsYmFjaygpXG4gICAgICAgIEByZWdpc3RlckNvbmZpZ09ic2VydmVyKClcbiAgICAgICAgQHJlZ2lzdGVyQ29udGV4dE1lbnVJdGVtKClcblxuXG4gICAgZGVhY3RpdmF0ZTogLT5cbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgICBAYXRvbU1pbmlmeVZpZXcuZGVzdHJveSgpXG5cblxuICAgIHNlcmlhbGl6ZTogLT5cbiAgICAgICAgYXRvbU1pbmlmeVZpZXdTdGF0ZTogQGF0b21NaW5pZnlWaWV3LnNlcmlhbGl6ZSgpXG5cblxuICAgIHJlZ2lzdGVyQ29tbWFuZHM6IC0+XG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgICAgICAgJ2F0b20tbWluaWZ5OnRvZ2dsZS1taW5pZnktb24tc2F2ZSc6ID0+XG4gICAgICAgICAgICAgICAgQHRvZ2dsZU1pbmlmeU9uU2F2ZSgpXG5cbiAgICAgICAgICAgICdhdG9tLW1pbmlmeTptaW5pZnktdG8tbWluLWZpbGUnOiAoZXZ0KSA9PlxuICAgICAgICAgICAgICAgIEBtaW5pZnlUb0ZpbGUoZXZ0KVxuXG4gICAgICAgICAgICAnYXRvbS1taW5pZnk6bWluaWZ5LWRpcmVjdCc6ID0+XG4gICAgICAgICAgICAgICAgQG1pbmlmeShBdG9tTWluaWZpZXIuTUlOSUZZX0RJUkVDVClcblxuICAgICAgICAgICAgJ2F0b20tbWluaWZ5OmNsb3NlLXBhbmVsJzogKGV2dCkgPT5cbiAgICAgICAgICAgICAgICBAY2xvc2VQYW5lbCgpXG4gICAgICAgICAgICAgICAgZXZ0LmFib3J0S2V5QmluZGluZygpXG5cbiAgICAgICAgICAgICdhdG9tLW1pbmlmeTpjc3MtbWluaWZpZXIteXVpJzogPT5cbiAgICAgICAgICAgICAgICBAc2VsZWN0Q3NzTWluaWZpZXIoJ1lVSSBDb21wcmVzc29yJylcblxuICAgICAgICAgICAgJ2F0b20tbWluaWZ5OmNzcy1taW5pZmllci1jbGVhbi1jc3MnOiA9PlxuICAgICAgICAgICAgICAgIEBzZWxlY3RDc3NNaW5pZmllcignY2xlYW4tY3NzJylcblxuICAgICAgICAgICAgJ2F0b20tbWluaWZ5OmNzcy1taW5pZmllci1jc3NvJzogPT5cbiAgICAgICAgICAgICAgICBAc2VsZWN0Q3NzTWluaWZpZXIoJ0NTU08nKVxuXG4gICAgICAgICAgICAnYXRvbS1taW5pZnk6Y3NzLW1pbmlmaWVyLXNxd2lzaCc6ID0+XG4gICAgICAgICAgICAgICAgQHNlbGVjdENzc01pbmlmaWVyKCdTcXdpc2gnKVxuXG4gICAgICAgICAgICAnYXRvbS1taW5pZnk6anMtbWluaWZpZXIteXVpJzogPT5cbiAgICAgICAgICAgICAgICBAc2VsZWN0SnNNaW5pZmllcignWVVJIENvbXByZXNzb3InKVxuXG4gICAgICAgICAgICAnYXRvbS1taW5pZnk6anMtbWluaWZpZXItZ2NjJzogPT5cbiAgICAgICAgICAgICAgICBAc2VsZWN0SnNNaW5pZmllcignR29vZ2xlIENsb3N1cmUgQ29tcGlsZXInKVxuXG4gICAgICAgICAgICAnYXRvbS1taW5pZnk6anMtbWluaWZpZXItdWdsaWZ5anMyJzogPT5cbiAgICAgICAgICAgICAgICBAc2VsZWN0SnNNaW5pZmllcignVWdsaWZ5SlMyJylcblxuXG4gICAgcmVnaXN0ZXJUZXh0RWRpdG9yU2F2ZUNhbGxiYWNrOiAtPlxuICAgICAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yLm9uRGlkU2F2ZSA9PlxuICAgICAgICAgICAgICAgIGlmICFAaXNQcm9jZXNzaW5nXG4gICAgICAgICAgICAgICAgICAgIEBtaW5pZnkoQXRvbU1pbmlmaWVyLk1JTklGWV9UT19NSU5fRklMRSwgbnVsbCwgdHJ1ZSlcblxuXG4gICAgcmVnaXN0ZXJDb25maWdPYnNlcnZlcjogLT5cbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgQXRvbU1pbmlmeU9wdGlvbnMuT1BUSU9OU19QUkVGSVggKyAnY3NzTWluaWZpZXInLCAobmV3VmFsdWUpID0+XG4gICAgICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgQXRvbU1pbmlmeU9wdGlvbnMuT1BUSU9OU19QUkVGSVggKyAnanNNaW5pZmllcicsIChuZXdWYWx1ZSkgPT5cbiAgICAgICAgICAgIEB1cGRhdGVNZW51SXRlbXMoKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBBdG9tTWluaWZ5T3B0aW9ucy5PUFRJT05TX1BSRUZJWCArICdtaW5pZnlPblNhdmUnLCAobmV3VmFsdWUpID0+XG4gICAgICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcblxuXG4gICAgcmVnaXN0ZXJDb250ZXh0TWVudUl0ZW06IC0+XG4gICAgICAgIG1lbnVJdGVtID0gQGdldENvbnRleHRNZW51SXRlbSgpXG4gICAgICAgIG1lbnVJdGVtLnNob3VsZERpc3BsYXkgPSAoZXZ0KSAtPlxuICAgICAgICAgICAgc2hvd0l0ZW1PcHRpb24gPSBBdG9tTWluaWZ5T3B0aW9ucy5nZXQoJ3Nob3dNaW5pZnlJdGVtSW5UcmVlVmlld0NvbnRleHRNZW51JylcbiAgICAgICAgICAgIGlmIHNob3dJdGVtT3B0aW9uIGluIFsnT25seSBvbiBDU1MgYW5kIEpTIGZpbGVzJywgJ09uIGV2ZXJ5IGZpbGUnXVxuICAgICAgICAgICAgICAgIHRhcmdldCA9IGV2dC50YXJnZXRcbiAgICAgICAgICAgICAgICBpZiB0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSBpcyAnc3BhbidcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcblxuICAgICAgICAgICAgICAgIGlzRmlsZUl0ZW0gPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdjbGFzcycpLnNwbGl0KCcgJykuaW5kZXhPZignZmlsZScpID49IDBcbiAgICAgICAgICAgICAgICBpZiBpc0ZpbGVJdGVtXG4gICAgICAgICAgICAgICAgICAgIGlmIHNob3dJdGVtT3B0aW9uIGlzICdPbiBldmVyeSBmaWxlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IHRhcmdldC5maXJzdEVsZW1lbnRDaGlsZFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZW5hbWUgPSBwYXRoLmJhc2VuYW1lKGNoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJykpXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlRXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGJhc2VuYW1lKS5yZXBsYWNlKCcuJywgJycpLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbGVFeHRlbnNpb24gaW4gWydjc3MnLCAnanMnXVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuXG4gICAgdG9nZ2xlTWluaWZ5T25TYXZlOiAtPlxuICAgICAgICBBdG9tTWluaWZ5T3B0aW9ucy5zZXQoJ21pbmlmeU9uU2F2ZScsICFBdG9tTWluaWZ5T3B0aW9ucy5nZXQoJ21pbmlmeU9uU2F2ZScpKVxuICAgICAgICBpZiBBdG9tTWluaWZ5T3B0aW9ucy5nZXQoJ21pbmlmeU9uU2F2ZScpXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnTWluaWZ5OiBFbmFibGVkIG1pbmlmeSBvbiBzYXZlJylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ01pbmlmeTogRGlzYWJsZWQgbWluaWZ5IG9uIHNhdmUnKVxuICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcblxuXG4gICAgc2VsZWN0Q3NzTWluaWZpZXI6IChtaW5pZmllcikgLT5cbiAgICAgICAgdmFsaWRDc3NNaW5pZmllcnMgPSBbJ1lVSSBDb21wcmVzc29yJywgJ2NsZWFuLWNzcycsICdDU1NPJywgJ1Nxd2lzaCddXG4gICAgICAgIGlmIG1pbmlmaWVyIGluIHZhbGlkQ3NzTWluaWZpZXJzXG4gICAgICAgICAgICBBdG9tTWluaWZ5T3B0aW9ucy5zZXQoJ2Nzc01pbmlmaWVyJywgbWluaWZpZXIpXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhcIk1pbmlmeTogI3ttaW5pZmllcn0gaXMgbmV3IENTUyBtaW5pZmllclwiKVxuICAgICAgICBAdXBkYXRlTWVudUl0ZW1zKClcblxuXG4gICAgc2VsZWN0SnNNaW5pZmllcjogKG1pbmlmaWVyKSAtPlxuICAgICAgICB2YWxpZEpzTWluaWZpZXJzID0gWydZVUkgQ29tcHJlc3NvcicsICdHb29nbGUgQ2xvc3VyZSBDb21waWxlcicsICdVZ2xpZnlKUzInXVxuICAgICAgICBpZiBtaW5pZmllciBpbiB2YWxpZEpzTWluaWZpZXJzXG4gICAgICAgICAgICBBdG9tTWluaWZ5T3B0aW9ucy5zZXQoJ2pzTWluaWZpZXInLCBtaW5pZmllcilcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKFwiTWluaWZ5OiAje21pbmlmaWVyfSBpcyBuZXcgSlMgbWluaWZpZXJcIilcbiAgICAgICAgQHVwZGF0ZU1lbnVJdGVtcygpXG5cblxuICAgIG1pbmlmeVRvRmlsZTogKGV2dCkgLT5cbiAgICAgICAgIyBEZXRlY3QgaWYgaXQncyBhIGNhbGwgYnkgVHJlZSBWaWV3IGNvbnRleHQgbWVudSwgYW5kIGlmIHNvLCBleHRyYWN0IHRoZSBmaWxlIHBhdGhcbiAgICAgICAgZmlsZW5hbWUgPSB1bmRlZmluZWRcbiAgICAgICAgaWYgdHlwZW9mIGV2dCBpcyAnb2JqZWN0J1xuICAgICAgICAgICAgdGFyZ2V0ID0gZXZ0LnRhcmdldFxuICAgICAgICAgICAgaWYgdGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgaXMgJ3NwYW4nXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcblxuICAgICAgICAgICAgaXNGaWxlSXRlbSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykuc3BsaXQoJyAnKS5pbmRleE9mKCdmaWxlJykgPj0gMFxuICAgICAgICAgICAgaWYgaXNGaWxlSXRlbVxuICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gdGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJylcblxuICAgICAgICBAbWluaWZ5KEF0b21NaW5pZmllci5NSU5JRllfVE9fTUlOX0ZJTEUsIGZpbGVuYW1lLCBmYWxzZSlcblxuXG4gICAgbWluaWZ5OiAobW9kZSwgZmlsZW5hbWUgPSBudWxsLCBtaW5pZnlPblNhdmUgPSBmYWxzZSkgLT5cbiAgICAgICAgaWYgQGlzUHJvY2Vzc2luZ1xuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgb3B0aW9ucyA9IG5ldyBBdG9tTWluaWZ5T3B0aW9ucygpXG4gICAgICAgIEBpc1Byb2Nlc3NpbmcgPSB0cnVlXG4gICAgICAgIEBwYW5lbElzSGlkZGVuQW5kUmVzZXQgPSBmYWxzZVxuXG4gICAgICAgIEBhdG9tTWluaWZ5Vmlldy51cGRhdGVPcHRpb25zKG9wdGlvbnMpXG5cbiAgICAgICAgQG1pbmlmaWVyID0gbmV3IEF0b21NaW5pZmllcihvcHRpb25zKVxuICAgICAgICBAbWluaWZpZXIub25TdGFydCAoYXJncykgPT5cbiAgICAgICAgICAgIGlmIG5vdCBAcGFuZWxJc0hpZGRlbkFuZFJlc2V0XG4gICAgICAgICAgICAgICAgQGF0b21NaW5pZnlWaWV3LmhpZGVQYW5lbChmYWxzZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICBAcGFuZWxJc0hpZGRlbkFuZFJlc2V0ID0gdHJ1ZVxuICAgICAgICAgICAgQGF0b21NaW5pZnlWaWV3LnN0YXJ0TWluaWZpY2F0aW9uKGFyZ3MpXG5cbiAgICAgICAgQG1pbmlmaWVyLm9uV2FybmluZyAoYXJncykgPT5cbiAgICAgICAgICAgIEBhdG9tTWluaWZ5Vmlldy53YXJuaW5nKGFyZ3MpXG5cbiAgICAgICAgQG1pbmlmaWVyLm9uU3VjY2VzcyAoYXJncykgPT5cbiAgICAgICAgICAgIEBhdG9tTWluaWZ5Vmlldy5zdWNjZXNzZnVsbE1pbmlmaWNhdGlvbihhcmdzKVxuXG4gICAgICAgIEBtaW5pZmllci5vbkVycm9yIChhcmdzKSA9PlxuICAgICAgICAgICAgaWYgbm90IEBwYW5lbElzSGlkZGVuQW5kUmVzZXRcbiAgICAgICAgICAgICAgICBAYXRvbU1pbmlmeVZpZXcuaGlkZVBhbmVsKGZhbHNlLCB0cnVlKVxuICAgICAgICAgICAgICAgIEBwYW5lbElzSGlkZGVuQW5kUmVzZXQgPSB0cnVlXG4gICAgICAgICAgICBAYXRvbU1pbmlmeVZpZXcuZXJyb25lb3VzTWluaWZpY2F0aW9uKGFyZ3MpXG5cbiAgICAgICAgQG1pbmlmaWVyLm9uRmluaXNoZWQgKGFyZ3MpID0+XG4gICAgICAgICAgICBAYXRvbU1pbmlmeVZpZXcuZmluaXNoZWQoYXJncylcbiAgICAgICAgICAgIEBpc1Byb2Nlc3NpbmcgPSBmYWxzZVxuICAgICAgICAgICAgQG1pbmlmaWVyLmRlc3Ryb3koKVxuICAgICAgICAgICAgQG1pbmlmaWVyID0gbnVsbFxuXG4gICAgICAgIEBtaW5pZmllci5taW5pZnkobW9kZSwgZmlsZW5hbWUsIG1pbmlmeU9uU2F2ZSlcblxuXG4gICAgdXBkYXRlTWVudUl0ZW1zOiAtPlxuICAgICAgICBtZW51ID0gQGdldE1haW5NZW51U3VibWVudSgpLnN1Ym1lbnVcbiAgICAgICAgcmV0dXJuIHVubGVzcyBtZW51XG5cbiAgICAgICAgbWVudVszXS5sYWJlbCA9IChpZiBBdG9tTWluaWZ5T3B0aW9ucy5nZXQoJ21pbmlmeU9uU2F2ZScpIHRoZW4gJ+KclCcgZWxzZSAn4pyVJykgKyAnICBNaW5pZnkgb24gc2F2ZSdcblxuICAgICAgICBjc3NNaW5pZmllcnMgPSBtZW51WzVdLnN1Ym1lbnVcbiAgICAgICAgaWYgY3NzTWluaWZpZXJzXG4gICAgICAgICAgICBjc3NNaW5pZmllcnNbMF0uY2hlY2tlZCA9IEF0b21NaW5pZnlPcHRpb25zLmdldCgnY3NzTWluaWZpZXInKSBpcyAnWVVJIENvbXByZXNzb3InXG4gICAgICAgICAgICBjc3NNaW5pZmllcnNbMV0uY2hlY2tlZCA9IEF0b21NaW5pZnlPcHRpb25zLmdldCgnY3NzTWluaWZpZXInKSBpcyAnY2xlYW4tY3NzJ1xuICAgICAgICAgICAgY3NzTWluaWZpZXJzWzJdLmNoZWNrZWQgPSBBdG9tTWluaWZ5T3B0aW9ucy5nZXQoJ2Nzc01pbmlmaWVyJykgaXMgJ0NTU08nXG4gICAgICAgICAgICBjc3NNaW5pZmllcnNbM10uY2hlY2tlZCA9IEF0b21NaW5pZnlPcHRpb25zLmdldCgnY3NzTWluaWZpZXInKSBpcyAnU3F3aXNoJ1xuXG4gICAgICAgIGpzTWluaWZpZXJzID0gbWVudVs2XS5zdWJtZW51XG4gICAgICAgIGlmIGpzTWluaWZpZXJzXG4gICAgICAgICAgICBqc01pbmlmaWVyc1swXS5jaGVja2VkID0gQXRvbU1pbmlmeU9wdGlvbnMuZ2V0KCdqc01pbmlmaWVyJykgaXMgJ1lVSSBDb21wcmVzc29yJ1xuICAgICAgICAgICAganNNaW5pZmllcnNbMV0uY2hlY2tlZCA9IEF0b21NaW5pZnlPcHRpb25zLmdldCgnanNNaW5pZmllcicpIGlzICdHb29nbGUgQ2xvc3VyZSBDb21waWxlcidcbiAgICAgICAgICAgIGpzTWluaWZpZXJzWzJdLmNoZWNrZWQgPSBBdG9tTWluaWZ5T3B0aW9ucy5nZXQoJ2pzTWluaWZpZXInKSBpcyAnVWdsaWZ5SlMyJ1xuXG4gICAgICAgIGF0b20ubWVudS51cGRhdGUoKVxuXG5cbiAgICBnZXRNYWluTWVudVN1Ym1lbnU6IC0+XG4gICAgICAgIGlmIEBtYWluU3VibWVudSBpcyBudWxsXG4gICAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgICBmb3IgbWVudSBpbiBhdG9tLm1lbnUudGVtcGxhdGVcbiAgICAgICAgICAgICAgICBpZiBtZW51LmxhYmVsIGlzICdQYWNrYWdlcycgfHwgbWVudS5sYWJlbCBpcyAnJlBhY2thZ2VzJ1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZm9yIHN1Ym1lbnUgaW4gbWVudS5zdWJtZW51XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzdWJtZW51LmxhYmVsIGlzICdNaW5pZnknXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQG1haW5TdWJtZW51ID0gc3VibWVudVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgaWYgZm91bmRcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgcmV0dXJuIEBtYWluU3VibWVudVxuXG5cbiAgICBnZXRDb250ZXh0TWVudUl0ZW06IC0+XG4gICAgICAgIGlmIEBjb250ZXh0TWVudUl0ZW0gaXMgbnVsbFxuICAgICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgICAgZm9yIGl0ZW1zIGluIGF0b20uY29udGV4dE1lbnUuaXRlbVNldHNcbiAgICAgICAgICAgICAgICBpZiBpdGVtcy5zZWxlY3RvciBpcyAnLnRyZWUtdmlldydcbiAgICAgICAgICAgICAgICAgICAgZm9yIGl0ZW0gaW4gaXRlbXMuaXRlbXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGl0ZW0uaWQgaXMgJ2F0b20tbWluaWZ5LWNvbnRleHQtbWVudS1taW5pZnknXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQGNvbnRleHRNZW51SXRlbSA9IGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgICAgICAgaWYgZm91bmRcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgcmV0dXJuIEBjb250ZXh0TWVudUl0ZW1cblxuXG4gICAgY2xvc2VQYW5lbDogLT5cbiAgICAgICAgQGF0b21NaW5pZnlWaWV3LmhpZGVQYW5lbCgpXG4iXX0=
