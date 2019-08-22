(function() {
  var CompositeDisposable, DiffView, Directory, File, FooterView, SplitDiff, StyleCalculator, SyncScroll, configSchema, path, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Directory = ref.Directory, File = ref.File;

  DiffView = require('./diff-view');

  FooterView = require('./ui/footer-view');

  SyncScroll = require('./sync-scroll');

  StyleCalculator = require('./style-calculator');

  configSchema = require('./config-schema');

  path = require('path');

  module.exports = SplitDiff = {
    diffView: null,
    config: configSchema,
    subscriptions: null,
    editorSubscriptions: null,
    lineEndingSubscription: null,
    contextMenuSubscriptions: null,
    isEnabled: false,
    wasEditor1Created: false,
    wasEditor2Created: false,
    wasEditor1SoftWrapped: false,
    wasEditor2SoftWrapped: false,
    hasGitRepo: false,
    docksToReopen: {
      left: false,
      right: false,
      bottom: false
    },
    process: null,
    splitDiffResolves: [],
    options: {},
    activate: function(state) {
      var styleCalculator;
      this.contextForService = this;
      styleCalculator = new StyleCalculator(atom.styles, atom.config);
      styleCalculator.startWatching('split-diff-custom-styles', ['split-diff.colors.addedColor', 'split-diff.colors.removedColor'], function(config) {
        var addedColor, addedWordColor, removedColor, removedWordColor;
        addedColor = config.get('split-diff.colors.addedColor');
        addedColor.alpha = 0.4;
        addedWordColor = addedColor;
        addedWordColor.alpha = 0.5;
        removedColor = config.get('split-diff.colors.removedColor');
        removedColor.alpha = 0.4;
        removedWordColor = removedColor;
        removedWordColor.alpha = 0.5;
        return "\n .split-diff-added-custom {\n \tbackground-color: " + (addedColor.toRGBAString()) + ";\n }\n .split-diff-removed-custom {\n \tbackground-color: " + (removedColor.toRGBAString()) + ";\n }\n .split-diff-word-added-custom .region {\n \tbackground-color: " + (addedWordColor.toRGBAString()) + ";\n }\n .split-diff-word-removed-custom .region {\n \tbackground-color: " + (removedWordColor.toRGBAString()) + ";\n }\n";
      });
      this.subscriptions = new CompositeDisposable();
      return this.subscriptions.add(atom.commands.add('atom-workspace, .tree-view .selected, .tab.texteditor', {
        'split-diff:enable': (function(_this) {
          return function(e) {
            _this.diffPanes(e);
            return e.stopPropagation();
          };
        })(this),
        'split-diff:next-diff': (function(_this) {
          return function() {
            if (_this.isEnabled) {
              return _this.nextDiff();
            } else {
              return _this.diffPanes();
            }
          };
        })(this),
        'split-diff:prev-diff': (function(_this) {
          return function() {
            if (_this.isEnabled) {
              return _this.prevDiff();
            } else {
              return _this.diffPanes();
            }
          };
        })(this),
        'split-diff:copy-to-right': (function(_this) {
          return function() {
            if (_this.isEnabled) {
              return _this.copyToRight();
            }
          };
        })(this),
        'split-diff:copy-to-left': (function(_this) {
          return function() {
            if (_this.isEnabled) {
              return _this.copyToLeft();
            }
          };
        })(this),
        'split-diff:disable': (function(_this) {
          return function() {
            return _this.disable();
          };
        })(this),
        'split-diff:set-ignore-whitespace': (function(_this) {
          return function() {
            return _this.toggleIgnoreWhitespace();
          };
        })(this),
        'split-diff:set-auto-diff': (function(_this) {
          return function() {
            return _this.toggleAutoDiff();
          };
        })(this),
        'split-diff:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.disable();
      return this.subscriptions.dispose();
    },
    toggle: function() {
      if (this.isEnabled) {
        return this.disable();
      } else {
        return this.diffPanes();
      }
    },
    disable: function() {
      var hideDocks, ref1;
      this.isEnabled = false;
      if (this.editorSubscriptions != null) {
        this.editorSubscriptions.dispose();
        this.editorSubscriptions = null;
      }
      if (this.contextMenuSubscriptions != null) {
        this.contextMenuSubscriptions.dispose();
        this.contextMenuSubscriptions = null;
      }
      if (this.lineEndingSubscription != null) {
        this.lineEndingSubscription.dispose();
        this.lineEndingSubscription = null;
      }
      if (this.diffView != null) {
        if (this.wasEditor1Created) {
          this.diffView.cleanUpEditor(1);
        } else if (this.wasEditor1SoftWrapped) {
          this.diffView.restoreEditorSoftWrap(1);
        }
        if (this.wasEditor2Created) {
          this.diffView.cleanUpEditor(2);
        } else if (this.wasEditor2SoftWrapped) {
          this.diffView.restoreEditorSoftWrap(2);
        }
        this.diffView.destroy();
        this.diffView = null;
      }
      if (this.footerView != null) {
        this.footerView.destroy();
        this.footerView = null;
      }
      if (this.syncScroll != null) {
        this.syncScroll.dispose();
        this.syncScroll = null;
      }
      hideDocks = (ref1 = this.options.hideDocks) != null ? ref1 : this._getConfig('hideDocks');
      if (hideDocks) {
        if (this.docksToReopen.left) {
          atom.workspace.getLeftDock().show();
        }
        if (this.docksToReopen.right) {
          atom.workspace.getRightDock().show();
        }
        if (this.docksToReopen.bottom) {
          atom.workspace.getBottomDock().show();
        }
      }
      this.docksToReopen = {
        left: false,
        right: false,
        bottom: false
      };
      this.wasEditor1Created = false;
      this.wasEditor2Created = false;
      this.wasEditor1SoftWrapped = false;
      this.wasEditor2SoftWrapped = false;
      return this.hasGitRepo = false;
    },
    toggleIgnoreWhitespace: function() {
      var ignoreWhitespace, ref1;
      if (!(this.options.ignoreWhitespace != null)) {
        ignoreWhitespace = this._getConfig('ignoreWhitespace');
        this._setConfig('ignoreWhitespace', !ignoreWhitespace);
        return (ref1 = this.footerView) != null ? ref1.setIgnoreWhitespace(!ignoreWhitespace) : void 0;
      }
    },
    toggleAutoDiff: function() {
      var autoDiff, ref1;
      if (!(this.options.autoDiff != null)) {
        autoDiff = this._getConfig('autoDiff');
        this._setConfig('autoDiff', !autoDiff);
        return (ref1 = this.footerView) != null ? ref1.setAutoDiff(!autoDiff) : void 0;
      }
    },
    nextDiff: function() {
      var isSyncScrollEnabled, ref1, ref2, scrollSyncType, selectedIndex;
      if (this.diffView != null) {
        isSyncScrollEnabled = false;
        scrollSyncType = (ref1 = this.options.scrollSyncType) != null ? ref1 : this._getConfig('scrollSyncType');
        if (scrollSyncType === 'Vertical + Horizontal' || scrollSyncType === 'Vertical') {
          isSyncScrollEnabled = true;
        }
        selectedIndex = this.diffView.nextDiff(isSyncScrollEnabled);
        return (ref2 = this.footerView) != null ? ref2.showSelectionCount(selectedIndex + 1) : void 0;
      }
    },
    prevDiff: function() {
      var isSyncScrollEnabled, ref1, ref2, scrollSyncType, selectedIndex;
      if (this.diffView != null) {
        isSyncScrollEnabled = false;
        scrollSyncType = (ref1 = this.options.scrollSyncType) != null ? ref1 : this._getConfig('scrollSyncType');
        if (scrollSyncType === 'Vertical + Horizontal' || scrollSyncType === 'Vertical') {
          isSyncScrollEnabled = true;
        }
        selectedIndex = this.diffView.prevDiff(isSyncScrollEnabled);
        return (ref2 = this.footerView) != null ? ref2.showSelectionCount(selectedIndex + 1) : void 0;
      }
    },
    copyToRight: function() {
      var ref1;
      if (this.diffView != null) {
        this.diffView.copyToRight();
        return (ref1 = this.footerView) != null ? ref1.hideSelectionCount() : void 0;
      }
    },
    copyToLeft: function() {
      var ref1;
      if (this.diffView != null) {
        this.diffView.copyToLeft();
        return (ref1 = this.footerView) != null ? ref1.hideSelectionCount() : void 0;
      }
    },
    diffPanes: function(event, editorsPromise, options) {
      var elemWithPath, params;
      if (options == null) {
        options = {};
      }
      this.options = options;
      if (!editorsPromise) {
        if ((event != null ? event.currentTarget.classList.contains('tab') : void 0) || (event != null ? event.currentTarget.classList.contains('file') : void 0)) {
          elemWithPath = event.currentTarget.querySelector('[data-path]');
          params = {};
          if (elemWithPath) {
            params.path = elemWithPath.dataset.path;
          } else if (event.currentTarget.item) {
            params.editor = event.currentTarget.item.copy();
          }
          this.disable();
          editorsPromise = this._getEditorsForDiffWithActive(params);
        } else {
          this.disable();
          editorsPromise = this._getEditorsForQuickDiff();
        }
      } else {
        this.disable();
      }
      return editorsPromise.then((function(editors) {
        var autoDiff, hideDocks, ignoreWhitespace, ref1, ref2, ref3;
        if (editors === null) {
          return;
        }
        this.editorSubscriptions = new CompositeDisposable();
        this._setupVisibleEditors(editors);
        this.diffView = new DiffView(editors);
        this._setupEditorSubscriptions(editors);
        if (this.footerView == null) {
          ignoreWhitespace = (ref1 = this.options.ignoreWhitespace) != null ? ref1 : this._getConfig('ignoreWhitespace');
          autoDiff = (ref2 = this.options.autoDiff) != null ? ref2 : this._getConfig('autoDiff');
          this.footerView = new FooterView(ignoreWhitespace, this.options.ignoreWhitespace != null, autoDiff, this.options.autoDiff != null);
          this.footerView.createPanel();
        }
        this.footerView.show();
        hideDocks = (ref3 = this.options.hideDocks) != null ? ref3 : this._getConfig('hideDocks');
        if (hideDocks) {
          this.docksToReopen.left = atom.workspace.getLeftDock().isVisible();
          this.docksToReopen.right = atom.workspace.getRightDock().isVisible();
          this.docksToReopen.bottom = atom.workspace.getBottomDock().isVisible();
          atom.workspace.getLeftDock().hide();
          atom.workspace.getRightDock().hide();
          atom.workspace.getBottomDock().hide();
        }
        if (!this.hasGitRepo) {
          this.updateDiff(editors);
        }
        this.contextMenuSubscriptions = new CompositeDisposable();
        this.contextMenuSubscriptions.add(atom.menu.add([
          {
            'label': 'Packages',
            'submenu': [
              {
                'label': 'Split Diff',
                'submenu': [
                  {
                    'label': 'Ignore Whitespace',
                    'command': 'split-diff:ignore-whitespace'
                  }, {
                    'label': 'Move to Next Diff',
                    'command': 'split-diff:next-diff'
                  }, {
                    'label': 'Move to Previous Diff',
                    'command': 'split-diff:prev-diff'
                  }, {
                    'label': 'Copy to Right',
                    'command': 'split-diff:copy-to-right'
                  }, {
                    'label': 'Copy to Left',
                    'command': 'split-diff:copy-to-left'
                  }
                ]
              }
            ]
          }
        ]));
        return this.contextMenuSubscriptions.add(atom.contextMenu.add({
          'atom-text-editor': [
            {
              'label': 'Split Diff',
              'submenu': [
                {
                  'label': 'Ignore Whitespace',
                  'command': 'split-diff:ignore-whitespace'
                }, {
                  'label': 'Move to Next Diff',
                  'command': 'split-diff:next-diff'
                }, {
                  'label': 'Move to Previous Diff',
                  'command': 'split-diff:prev-diff'
                }, {
                  'label': 'Copy to Right',
                  'command': 'split-diff:copy-to-right'
                }, {
                  'label': 'Copy to Left',
                  'command': 'split-diff:copy-to-left'
                }
              ]
            }
          ]
        }));
      }).bind(this));
    },
    updateDiff: function(editors) {
      var BufferedNodeProcess, args, command, editorPaths, exit, ignoreWhitespace, ref1, ref2, ref3, stderr, stdout, theOutput, turnOffSoftWrap;
      this.isEnabled = true;
      if (this.process != null) {
        this.process.kill();
        this.process = null;
      }
      turnOffSoftWrap = (ref1 = this.options.turnOffSoftWrap) != null ? ref1 : this._getConfig('turnOffSoftWrap');
      if (turnOffSoftWrap) {
        if (editors.editor1.isSoftWrapped()) {
          editors.editor1.setSoftWrapped(false);
        }
        if (editors.editor2.isSoftWrapped()) {
          editors.editor2.setSoftWrapped(false);
        }
      }
      ignoreWhitespace = (ref2 = this.options.ignoreWhitespace) != null ? ref2 : this._getConfig('ignoreWhitespace');
      editorPaths = this._createTempFiles(editors);
      if ((ref3 = this.footerView) != null) {
        ref3.setLoading();
      }
      BufferedNodeProcess = require('atom').BufferedNodeProcess;
      command = path.resolve(__dirname, "./compute-diff.js");
      args = [editorPaths.editor1Path, editorPaths.editor2Path, ignoreWhitespace];
      theOutput = '';
      stdout = (function(_this) {
        return function(output) {
          var computedDiff;
          theOutput = output;
          computedDiff = JSON.parse(output);
          _this.process.kill();
          _this.process = null;
          return _this._resumeUpdateDiff(editors, computedDiff);
        };
      })(this);
      stderr = (function(_this) {
        return function(err) {
          return theOutput = err;
        };
      })(this);
      exit = (function(_this) {
        return function(code) {
          if (code !== 0) {
            console.log('BufferedNodeProcess code was ' + code);
            return console.log(theOutput);
          }
        };
      })(this);
      return this.process = new BufferedNodeProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    },
    _resumeUpdateDiff: function(editors, computedDiff) {
      var addedColorSide, diffWords, ignoreWhitespace, overrideThemeColors, ref1, ref2, ref3, ref4, ref5, ref6, ref7, scrollSyncType;
      if (this.diffView == null) {
        return;
      }
      this.diffView.clearDiff();
      if (this.syncScroll != null) {
        this.syncScroll.dispose();
        this.syncScroll = null;
      }
      addedColorSide = (ref1 = this.options.addedColorSide) != null ? ref1 : this._getConfig('colors.addedColorSide');
      diffWords = (ref2 = this.options.diffWords) != null ? ref2 : this._getConfig('diffWords');
      ignoreWhitespace = (ref3 = this.options.ignoreWhitespace) != null ? ref3 : this._getConfig('ignoreWhitespace');
      overrideThemeColors = (ref4 = this.options.overrideThemeColors) != null ? ref4 : this._getConfig('colors.overrideThemeColors');
      this.diffView.displayDiff(computedDiff, addedColorSide, diffWords, ignoreWhitespace, overrideThemeColors);
      while ((ref5 = this.splitDiffResolves) != null ? ref5.length : void 0) {
        this.splitDiffResolves.pop()(this.diffView.getMarkerLayers());
      }
      if ((ref6 = this.footerView) != null) {
        ref6.setNumDifferences(this.diffView.getNumDifferences());
      }
      scrollSyncType = (ref7 = this.options.scrollSyncType) != null ? ref7 : this._getConfig('scrollSyncType');
      if (scrollSyncType === 'Vertical + Horizontal') {
        this.syncScroll = new SyncScroll(editors.editor1, editors.editor2, true);
        return this.syncScroll.syncPositions();
      } else if (scrollSyncType === 'Vertical') {
        this.syncScroll = new SyncScroll(editors.editor1, editors.editor2, false);
        return this.syncScroll.syncPositions();
      }
    },
    _getEditorsForQuickDiff: function() {
      var activeItem, editor1, editor2, j, len, p, panes, rightPaneIndex;
      editor1 = null;
      editor2 = null;
      panes = atom.workspace.getCenter().getPanes();
      for (j = 0, len = panes.length; j < len; j++) {
        p = panes[j];
        activeItem = p.getActiveItem();
        if (atom.workspace.isTextEditor(activeItem)) {
          if (editor1 === null) {
            editor1 = activeItem;
          } else if (editor2 === null) {
            editor2 = activeItem;
            break;
          }
        }
      }
      if (editor1 === null) {
        editor1 = atom.workspace.buildTextEditor({
          autoHeight: false
        });
        this.wasEditor1Created = true;
        panes[0].addItem(editor1);
        panes[0].activateItem(editor1);
      }
      if (editor2 === null) {
        editor2 = atom.workspace.buildTextEditor({
          autoHeight: false
        });
        this.wasEditor2Created = true;
        rightPaneIndex = panes.indexOf(atom.workspace.paneForItem(editor1)) + 1;
        if (panes[rightPaneIndex]) {
          panes[rightPaneIndex].addItem(editor2);
          panes[rightPaneIndex].activateItem(editor2);
        } else {
          atom.workspace.paneForItem(editor1).splitRight({
            items: [editor2]
          });
        }
        editor2.getBuffer().setLanguageMode(atom.grammars.languageModeForGrammarAndBuffer(editor1.getGrammar(), editor2.getBuffer()));
      }
      return Promise.resolve({
        editor1: editor1,
        editor2: editor2
      });
    },
    _getEditorsForDiffWithActive: function(params) {
      var activeEditor, editor1, editor2, editor2Promise, editorWithoutPath, filePath, noActiveEditorMsg, panes, rightPane, rightPaneIndex;
      filePath = params.path;
      editorWithoutPath = params.editor;
      activeEditor = atom.workspace.getCenter().getActiveTextEditor();
      if (activeEditor != null) {
        editor1 = activeEditor;
        this.wasEditor2Created = true;
        panes = atom.workspace.getCenter().getPanes();
        rightPaneIndex = panes.indexOf(atom.workspace.paneForItem(editor1)) + 1;
        rightPane = panes[rightPaneIndex] || atom.workspace.paneForItem(editor1).splitRight();
        if (params.path) {
          filePath = params.path;
          if (editor1.getPath() === filePath) {
            filePath = null;
          }
          editor2Promise = atom.workspace.openURIInPane(filePath, rightPane);
          return editor2Promise.then(function(editor2) {
            editor2.getBuffer().setLanguageMode(atom.grammars.languageModeForGrammarAndBuffer(editor1.getGrammar(), editor2.getBuffer()));
            return {
              editor1: editor1,
              editor2: editor2
            };
          });
        } else if (editorWithoutPath) {
          editor2 = atom.workspace.buildTextEditor({
            autoHeight: false
          });
          rightPane.addItem(editor2);
          return Promise.resolve({
            editor1: editor1,
            editor2: editor2
          });
        }
      } else {
        noActiveEditorMsg = 'No active file found! (Try focusing a text editor)';
        atom.notifications.addWarning('Split Diff', {
          detail: noActiveEditorMsg,
          dismissable: false,
          icon: 'diff'
        });
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    },
    _setupEditorSubscriptions: function(editors) {
      var autoDiff, ref1, ref2;
      if ((ref1 = this.editorSubscriptions) != null) {
        ref1.dispose();
      }
      this.editorSubscriptions = null;
      this.editorSubscriptions = new CompositeDisposable();
      autoDiff = (ref2 = this.options.autoDiff) != null ? ref2 : this._getConfig('autoDiff');
      if (autoDiff) {
        this.editorSubscriptions.add(editors.editor1.onDidStopChanging((function(_this) {
          return function() {
            return _this.updateDiff(editors);
          };
        })(this)));
        this.editorSubscriptions.add(editors.editor2.onDidStopChanging((function(_this) {
          return function() {
            return _this.updateDiff(editors);
          };
        })(this)));
      }
      this.editorSubscriptions.add(editors.editor1.onDidDestroy((function(_this) {
        return function() {
          return _this.disable();
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor2.onDidDestroy((function(_this) {
        return function() {
          return _this.disable();
        };
      })(this)));
      this.editorSubscriptions.add(atom.config.onDidChange('split-diff', (function(_this) {
        return function(event) {
          var ref3, ref4;
          _this._setupEditorSubscriptions(editors);
          if (event.newValue.ignoreWhitespace !== event.oldValue.ignoreWhitespace) {
            if ((ref3 = _this.footerView) != null) {
              ref3.setIgnoreWhitespace(event.newValue.ignoreWhitespace);
            }
          }
          if (event.newValue.autoDiff !== event.oldValue.autoDiff) {
            if ((ref4 = _this.footerView) != null) {
              ref4.setAutoDiff(event.newValue.autoDiff);
            }
          }
          return _this.updateDiff(editors);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor1.onDidChangeCursorPosition((function(_this) {
        return function(event) {
          return _this.diffView.handleCursorChange(event.cursor, event.oldBufferPosition, event.newBufferPosition);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor2.onDidChangeCursorPosition((function(_this) {
        return function(event) {
          return _this.diffView.handleCursorChange(event.cursor, event.oldBufferPosition, event.newBufferPosition);
        };
      })(this)));
      this.editorSubscriptions.add(editors.editor1.onDidAddCursor((function(_this) {
        return function(cursor) {
          return _this.diffView.handleCursorChange(cursor, -1, cursor.getBufferPosition());
        };
      })(this)));
      return this.editorSubscriptions.add(editors.editor2.onDidAddCursor((function(_this) {
        return function(cursor) {
          return _this.diffView.handleCursorChange(cursor, -1, cursor.getBufferPosition());
        };
      })(this)));
    },
    _setupVisibleEditors: function(editors) {
      var BufferExtender, buffer1LineEnding, buffer2LineEnding, lineEndingMsg, muteNotifications, ref1, ref2, shouldNotify, softWrapMsg, turnOffSoftWrap;
      BufferExtender = require('./buffer-extender');
      buffer1LineEnding = (new BufferExtender(editors.editor1.getBuffer())).getLineEnding();
      if (this.wasEditor2Created) {
        atom.views.getView(editors.editor1).focus();
        if (buffer1LineEnding === '\n' || buffer1LineEnding === '\r\n') {
          this.lineEndingSubscription = new CompositeDisposable();
          this.lineEndingSubscription.add(editors.editor2.onWillInsertText(function() {
            return editors.editor2.getBuffer().setPreferredLineEnding(buffer1LineEnding);
          }));
        }
      }
      this._setupGitRepo(editors);
      editors.editor1.unfoldAll();
      editors.editor2.unfoldAll();
      muteNotifications = (ref1 = this.options.muteNotifications) != null ? ref1 : this._getConfig('muteNotifications');
      turnOffSoftWrap = (ref2 = this.options.turnOffSoftWrap) != null ? ref2 : this._getConfig('turnOffSoftWrap');
      if (turnOffSoftWrap) {
        shouldNotify = false;
        if (editors.editor1.isSoftWrapped()) {
          this.wasEditor1SoftWrapped = true;
          editors.editor1.setSoftWrapped(false);
          shouldNotify = true;
        }
        if (editors.editor2.isSoftWrapped()) {
          this.wasEditor2SoftWrapped = true;
          editors.editor2.setSoftWrapped(false);
          shouldNotify = true;
        }
        if (shouldNotify && !muteNotifications) {
          softWrapMsg = 'Soft wrap automatically disabled so lines remain in sync.';
          atom.notifications.addWarning('Split Diff', {
            detail: softWrapMsg,
            dismissable: false,
            icon: 'diff'
          });
        }
      } else if (!muteNotifications && (editors.editor1.isSoftWrapped() || editors.editor2.isSoftWrapped())) {
        softWrapMsg = 'Warning: Soft wrap enabled! Lines may not align.\n(Try "Turn Off Soft Wrap" setting)';
        atom.notifications.addWarning('Split Diff', {
          detail: softWrapMsg,
          dismissable: false,
          icon: 'diff'
        });
      }
      buffer2LineEnding = (new BufferExtender(editors.editor2.getBuffer())).getLineEnding();
      if (buffer2LineEnding !== '' && (buffer1LineEnding !== buffer2LineEnding) && editors.editor1.getLineCount() !== 1 && editors.editor2.getLineCount() !== 1 && !muteNotifications) {
        lineEndingMsg = 'Warning: Line endings differ!';
        return atom.notifications.addWarning('Split Diff', {
          detail: lineEndingMsg,
          dismissable: false,
          icon: 'diff'
        });
      }
    },
    _setupGitRepo: function(editors) {
      var directory, editor1Path, gitHeadText, i, j, len, projectRepo, ref1, relativeEditor1Path, results;
      editor1Path = editors.editor1.getPath();
      if ((editor1Path != null) && (editors.editor2.getLineCount() === 1 && editors.editor2.lineTextForBufferRow(0) === '')) {
        ref1 = atom.project.getDirectories();
        results = [];
        for (i = j = 0, len = ref1.length; j < len; i = ++j) {
          directory = ref1[i];
          if (editor1Path === directory.getPath() || directory.contains(editor1Path)) {
            projectRepo = atom.project.getRepositories()[i];
            if (projectRepo != null) {
              projectRepo = projectRepo.getRepo(editor1Path);
              relativeEditor1Path = projectRepo.relativize(editor1Path);
              gitHeadText = projectRepo.getHeadBlob(relativeEditor1Path);
              if (gitHeadText != null) {
                editors.editor2.selectAll();
                editors.editor2.insertText(gitHeadText);
                this.hasGitRepo = true;
                break;
              } else {
                results.push(void 0);
              }
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    },
    _createTempFiles: function(editors) {
      var editor1Path, editor1TempFile, editor2Path, editor2TempFile, editorPaths, tempFolderPath;
      editor1Path = '';
      editor2Path = '';
      tempFolderPath = atom.getConfigDirPath() + '/split-diff';
      editor1Path = tempFolderPath + '/split-diff 1';
      editor1TempFile = new File(editor1Path);
      editor1TempFile.writeSync(editors.editor1.getText());
      editor2Path = tempFolderPath + '/split-diff 2';
      editor2TempFile = new File(editor2Path);
      editor2TempFile.writeSync(editors.editor2.getText());
      editorPaths = {
        editor1Path: editor1Path,
        editor2Path: editor2Path
      };
      return editorPaths;
    },
    _getConfig: function(config) {
      return atom.config.get("split-diff." + config);
    },
    _setConfig: function(config, value) {
      return atom.config.set("split-diff." + config, value);
    },
    getMarkerLayers: function() {
      return new Promise((function(resolve, reject) {
        return this.splitDiffResolves.push(resolve);
      }).bind(this));
    },
    diffEditors: function(editor1, editor2, options) {
      return this.diffPanes(null, Promise.resolve({
        editor1: editor1,
        editor2: editor2
      }), options);
    },
    provideSplitDiff: function() {
      return {
        getMarkerLayers: this.getMarkerLayers.bind(this.contextForService),
        diffEditors: this.diffEditors.bind(this.contextForService),
        disable: this.disable.bind(this.contextForService)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9zcGxpdC1kaWZmLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyw2Q0FBRCxFQUFzQix5QkFBdEIsRUFBaUM7O0VBQ2pDLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxVQUFBLEdBQWEsT0FBQSxDQUFRLGtCQUFSOztFQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFDYixlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUjs7RUFDbEIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUjs7RUFDZixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQSxHQUNmO0lBQUEsUUFBQSxFQUFVLElBQVY7SUFDQSxNQUFBLEVBQVEsWUFEUjtJQUVBLGFBQUEsRUFBZSxJQUZmO0lBR0EsbUJBQUEsRUFBcUIsSUFIckI7SUFJQSxzQkFBQSxFQUF3QixJQUp4QjtJQUtBLHdCQUFBLEVBQTBCLElBTDFCO0lBTUEsU0FBQSxFQUFXLEtBTlg7SUFPQSxpQkFBQSxFQUFtQixLQVBuQjtJQVFBLGlCQUFBLEVBQW1CLEtBUm5CO0lBU0EscUJBQUEsRUFBdUIsS0FUdkI7SUFVQSxxQkFBQSxFQUF1QixLQVZ2QjtJQVdBLFVBQUEsRUFBWSxLQVhaO0lBWUEsYUFBQSxFQUFlO01BQUMsSUFBQSxFQUFNLEtBQVA7TUFBYyxLQUFBLEVBQU8sS0FBckI7TUFBNEIsTUFBQSxFQUFRLEtBQXBDO0tBWmY7SUFhQSxPQUFBLEVBQVMsSUFiVDtJQWNBLGlCQUFBLEVBQW1CLEVBZG5CO0lBZUEsT0FBQSxFQUFTLEVBZlQ7SUFpQkEsUUFBQSxFQUFVLFNBQUMsS0FBRDtBQUNSLFVBQUE7TUFBQSxJQUFD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Q0FBQyxJQUFiLENBQWtCLElBQUMsQ0FBQSxpQkFBbkIsQ0FEYjtRQUVBLE9BQUEsRUFBUyxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxJQUFDLENBQUEsaUJBQWYsQ0FGVDs7SUFEZ0IsQ0FwakJsQjs7QUFURiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXJlY3RvcnksIEZpbGV9ID0gcmVxdWlyZSAnYXRvbSdcbkRpZmZWaWV3ID0gcmVxdWlyZSAnLi9kaWZmLXZpZXcnXG5Gb290ZXJWaWV3ID0gcmVxdWlyZSAnLi91aS9mb290ZXItdmlldydcblN5bmNTY3JvbGwgPSByZXF1aXJlICcuL3N5bmMtc2Nyb2xsJ1xuU3R5bGVDYWxjdWxhdG9yID0gcmVxdWlyZSAnLi9zdHlsZS1jYWxjdWxhdG9yJ1xuY29uZmlnU2NoZW1hID0gcmVxdWlyZSAnLi9jb25maWctc2NoZW1hJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbm1vZHVsZS5leHBvcnRzID0gU3BsaXREaWZmID1cbiAgZGlmZlZpZXc6IG51bGxcbiAgY29uZmlnOiBjb25maWdTY2hlbWFcbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBlZGl0b3JTdWJzY3JpcHRpb25zOiBudWxsXG4gIGxpbmVFbmRpbmdTdWJzY3JpcHRpb246IG51bGxcbiAgY29udGV4dE1lbnVTdWJzY3JpcHRpb25zOiBudWxsXG4gIGlzRW5hYmxlZDogZmFsc2VcbiAgd2FzRWRpdG9yMUNyZWF0ZWQ6IGZhbHNlXG4gIHdhc0VkaXRvcjJDcmVhdGVkOiBmYWxzZVxuICB3YXNFZGl0b3IxU29mdFdyYXBwZWQ6IGZhbHNlXG4gIHdhc0VkaXRvcjJTb2Z0V3JhcHBlZDogZmFsc2VcbiAgaGFzR2l0UmVwbzogZmFsc2VcbiAgZG9ja3NUb1Jlb3Blbjoge2xlZnQ6IGZhbHNlLCByaWdodDogZmFsc2UsIGJvdHRvbTogZmFsc2V9XG4gIHByb2Nlc3M6IG51bGxcbiAgc3BsaXREaWZmUmVzb2x2ZXM6IFtdXG4gIG9wdGlvbnM6IHt9XG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAY29udGV4dEZvclNlcnZpY2UgPSB0aGlzXG5cbiAgICBzdHlsZUNhbGN1bGF0b3IgPSBuZXcgU3R5bGVDYWxjdWxhdG9yKGF0b20uc3R5bGVzLCBhdG9tLmNvbmZpZylcbiAgICBzdHlsZUNhbGN1bGF0b3Iuc3RhcnRXYXRjaGluZyhcbiAgICAgICAgJ3NwbGl0LWRpZmYtY3VzdG9tLXN0eWxlcycsXG4gICAgICAgIFsnc3BsaXQtZGlmZi5jb2xvcnMuYWRkZWRDb2xvcicsICdzcGxpdC1kaWZmLmNvbG9ycy5yZW1vdmVkQ29sb3InXSxcbiAgICAgICAgKGNvbmZpZykgLT5cbiAgICAgICAgICBhZGRlZENvbG9yID0gY29uZmlnLmdldCgnc3BsaXQtZGlmZi5jb2xvcnMuYWRkZWRDb2xvcicpXG4gICAgICAgICAgYWRkZWRDb2xvci5hbHBoYSA9IDAuNFxuICAgICAgICAgIGFkZGVkV29yZENvbG9yID0gYWRkZWRDb2xvclxuICAgICAgICAgIGFkZGVkV29yZENvbG9yLmFscGhhID0gMC41XG4gICAgICAgICAgcmVtb3ZlZENvbG9yID0gY29uZmlnLmdldCgnc3BsaXQtZGlmZi5jb2xvcnMucmVtb3ZlZENvbG9yJylcbiAgICAgICAgICByZW1vdmVkQ29sb3IuYWxwaGEgPSAwLjRcbiAgICAgICAgICByZW1vdmVkV29yZENvbG9yID0gcmVtb3ZlZENvbG9yXG4gICAgICAgICAgcmVtb3ZlZFdvcmRDb2xvci5hbHBoYSA9IDAuNVxuICAgICAgICAgIFwiXFxuXG4gICAgICAgICAgLnNwbGl0LWRpZmYtYWRkZWQtY3VzdG9tIHtcXG5cbiAgICAgICAgICAgIFxcdGJhY2tncm91bmQtY29sb3I6ICN7YWRkZWRDb2xvci50b1JHQkFTdHJpbmcoKX07XFxuXG4gICAgICAgICAgfVxcblxuICAgICAgICAgIC5zcGxpdC1kaWZmLXJlbW92ZWQtY3VzdG9tIHtcXG5cbiAgICAgICAgICAgIFxcdGJhY2tncm91bmQtY29sb3I6ICN7cmVtb3ZlZENvbG9yLnRvUkdCQVN0cmluZygpfTtcXG5cbiAgICAgICAgICB9XFxuXG4gICAgICAgICAgLnNwbGl0LWRpZmYtd29yZC1hZGRlZC1jdXN0b20gLnJlZ2lvbiB7XFxuXG4gICAgICAgICAgICBcXHRiYWNrZ3JvdW5kLWNvbG9yOiAje2FkZGVkV29yZENvbG9yLnRvUkdCQVN0cmluZygpfTtcXG5cbiAgICAgICAgICB9XFxuXG4gICAgICAgICAgLnNwbGl0LWRpZmYtd29yZC1yZW1vdmVkLWN1c3RvbSAucmVnaW9uIHtcXG5cbiAgICAgICAgICAgIFxcdGJhY2tncm91bmQtY29sb3I6ICN7cmVtb3ZlZFdvcmRDb2xvci50b1JHQkFTdHJpbmcoKX07XFxuXG4gICAgICAgICAgfVxcblwiXG4gICAgKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZSwgLnRyZWUtdmlldyAuc2VsZWN0ZWQsIC50YWIudGV4dGVkaXRvcicsXG4gICAgICAnc3BsaXQtZGlmZjplbmFibGUnOiAoZSkgPT5cbiAgICAgICAgQGRpZmZQYW5lcyhlKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAnc3BsaXQtZGlmZjpuZXh0LWRpZmYnOiA9PlxuICAgICAgICBpZiBAaXNFbmFibGVkXG4gICAgICAgICAgQG5leHREaWZmKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBkaWZmUGFuZXMoKVxuICAgICAgJ3NwbGl0LWRpZmY6cHJldi1kaWZmJzogPT5cbiAgICAgICAgaWYgQGlzRW5hYmxlZFxuICAgICAgICAgIEBwcmV2RGlmZigpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAZGlmZlBhbmVzKClcbiAgICAgICdzcGxpdC1kaWZmOmNvcHktdG8tcmlnaHQnOiA9PlxuICAgICAgICBpZiBAaXNFbmFibGVkXG4gICAgICAgICAgQGNvcHlUb1JpZ2h0KClcbiAgICAgICdzcGxpdC1kaWZmOmNvcHktdG8tbGVmdCc6ID0+XG4gICAgICAgIGlmIEBpc0VuYWJsZWRcbiAgICAgICAgICBAY29weVRvTGVmdCgpXG4gICAgICAnc3BsaXQtZGlmZjpkaXNhYmxlJzogPT4gQGRpc2FibGUoKVxuICAgICAgJ3NwbGl0LWRpZmY6c2V0LWlnbm9yZS13aGl0ZXNwYWNlJzogPT4gQHRvZ2dsZUlnbm9yZVdoaXRlc3BhY2UoKVxuICAgICAgJ3NwbGl0LWRpZmY6c2V0LWF1dG8tZGlmZic6ID0+IEB0b2dnbGVBdXRvRGlmZigpXG4gICAgICAnc3BsaXQtZGlmZjp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkaXNhYmxlKClcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICAjIGNhbGxlZCBieSBcInRvZ2dsZVwiIGNvbW1hbmRcbiAgIyB0b2dnbGVzIHNwbGl0IGRpZmZcbiAgdG9nZ2xlOiAoKSAtPlxuICAgIGlmIEBpc0VuYWJsZWRcbiAgICAgIEBkaXNhYmxlKClcbiAgICBlbHNlXG4gICAgICBAZGlmZlBhbmVzKClcblxuICAjIGNhbGxlZCBieSBcIkRpc2FibGVcIiBjb21tYW5kXG4gICMgcmVtb3ZlcyBkaWZmIGFuZCBzeW5jIHNjcm9sbCwgZGlzcG9zZXMgb2Ygc3Vic2NyaXB0aW9uc1xuICBkaXNhYmxlOiAoKSAtPlxuICAgIEBpc0VuYWJsZWQgPSBmYWxzZVxuXG4gICAgIyByZW1vdmUgbGlzdGVuZXJzXG4gICAgaWYgQGVkaXRvclN1YnNjcmlwdGlvbnM/XG4gICAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIGlmIEBjb250ZXh0TWVudVN1YnNjcmlwdGlvbnM/XG4gICAgICBAY29udGV4dE1lbnVTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgQGNvbnRleHRNZW51U3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICBpZiBAbGluZUVuZGluZ1N1YnNjcmlwdGlvbj9cbiAgICAgIEBsaW5lRW5kaW5nU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgQGxpbmVFbmRpbmdTdWJzY3JpcHRpb24gPSBudWxsXG5cbiAgICBpZiBAZGlmZlZpZXc/XG4gICAgICBpZiBAd2FzRWRpdG9yMUNyZWF0ZWRcbiAgICAgICAgQGRpZmZWaWV3LmNsZWFuVXBFZGl0b3IoMSlcbiAgICAgIGVsc2UgaWYgQHdhc0VkaXRvcjFTb2Z0V3JhcHBlZFxuICAgICAgICBAZGlmZlZpZXcucmVzdG9yZUVkaXRvclNvZnRXcmFwKDEpXG4gICAgICBpZiBAd2FzRWRpdG9yMkNyZWF0ZWRcbiAgICAgICAgQGRpZmZWaWV3LmNsZWFuVXBFZGl0b3IoMilcbiAgICAgIGVsc2UgaWYgQHdhc0VkaXRvcjJTb2Z0V3JhcHBlZFxuICAgICAgICBAZGlmZlZpZXcucmVzdG9yZUVkaXRvclNvZnRXcmFwKDIpXG4gICAgICBAZGlmZlZpZXcuZGVzdHJveSgpXG4gICAgICBAZGlmZlZpZXcgPSBudWxsXG5cbiAgICAjIHJlbW92ZSB2aWV3c1xuICAgIGlmIEBmb290ZXJWaWV3P1xuICAgICAgQGZvb3RlclZpZXcuZGVzdHJveSgpXG4gICAgICBAZm9vdGVyVmlldyA9IG51bGxcblxuICAgIGlmIEBzeW5jU2Nyb2xsP1xuICAgICAgQHN5bmNTY3JvbGwuZGlzcG9zZSgpXG4gICAgICBAc3luY1Njcm9sbCA9IG51bGxcblxuICAgICMgYXV0byBoaWRlIHRyZWUgdmlldyB3aGlsZSBkaWZmaW5nICM4MlxuICAgIGhpZGVEb2NrcyA9IEBvcHRpb25zLmhpZGVEb2NrcyA/IEBfZ2V0Q29uZmlnKCdoaWRlRG9ja3MnKVxuICAgIGlmIGhpZGVEb2Nrc1xuICAgICAgaWYgQGRvY2tzVG9SZW9wZW4ubGVmdFxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaygpLnNob3coKVxuICAgICAgaWYgQGRvY2tzVG9SZW9wZW4ucmlnaHRcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0UmlnaHREb2NrKCkuc2hvdygpXG4gICAgICBpZiBAZG9ja3NUb1Jlb3Blbi5ib3R0b21cbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0Qm90dG9tRG9jaygpLnNob3coKVxuXG4gICAgIyByZXNldCBhbGwgdmFyaWFibGVzXG4gICAgQGRvY2tzVG9SZW9wZW4gPSB7bGVmdDogZmFsc2UsIHJpZ2h0OiBmYWxzZSwgYm90dG9tOiBmYWxzZX1cbiAgICBAd2FzRWRpdG9yMUNyZWF0ZWQgPSBmYWxzZVxuICAgIEB3YXNFZGl0b3IyQ3JlYXRlZCA9IGZhbHNlXG4gICAgQHdhc0VkaXRvcjFTb2Z0V3JhcHBlZCA9IGZhbHNlXG4gICAgQHdhc0VkaXRvcjJTb2Z0V3JhcHBlZCA9IGZhbHNlXG4gICAgQGhhc0dpdFJlcG8gPSBmYWxzZVxuXG4gICMgY2FsbGVkIGJ5IFwiaWdub3JlIHdoaXRlc3BhY2UgdG9nZ2xlXCIgY29tbWFuZFxuICB0b2dnbGVJZ25vcmVXaGl0ZXNwYWNlOiAtPlxuICAgICMgaWYgaWdub3JlV2hpdGVzcGFjZSBpcyBub3QgYmVpbmcgb3ZlcnJpZGRlblxuICAgIGlmICEoQG9wdGlvbnMuaWdub3JlV2hpdGVzcGFjZT8pXG4gICAgICBpZ25vcmVXaGl0ZXNwYWNlID0gQF9nZXRDb25maWcoJ2lnbm9yZVdoaXRlc3BhY2UnKVxuICAgICAgQF9zZXRDb25maWcoJ2lnbm9yZVdoaXRlc3BhY2UnLCAhaWdub3JlV2hpdGVzcGFjZSlcbiAgICAgIEBmb290ZXJWaWV3Py5zZXRJZ25vcmVXaGl0ZXNwYWNlKCFpZ25vcmVXaGl0ZXNwYWNlKVxuXG4gICMgY2FsbGVkIGJ5IFwiYXV0byBkaWZmIHRvZ2dsZVwiIGNvbW1hbmRcbiAgdG9nZ2xlQXV0b0RpZmY6IC0+XG4gICAgIyBpZiBpZ25vcmVXaGl0ZXNwYWNlIGlzIG5vdCBiZWluZyBvdmVycmlkZGVuXG4gICAgaWYgIShAb3B0aW9ucy5hdXRvRGlmZj8pXG4gICAgICBhdXRvRGlmZiA9IEBfZ2V0Q29uZmlnKCdhdXRvRGlmZicpXG4gICAgICBAX3NldENvbmZpZygnYXV0b0RpZmYnLCAhYXV0b0RpZmYpXG4gICAgICBAZm9vdGVyVmlldz8uc2V0QXV0b0RpZmYoIWF1dG9EaWZmKVxuXG4gICMgY2FsbGVkIGJ5IFwiTW92ZSB0byBuZXh0IGRpZmZcIiBjb21tYW5kXG4gIG5leHREaWZmOiAtPlxuICAgIGlmIEBkaWZmVmlldz9cbiAgICAgIGlzU3luY1Njcm9sbEVuYWJsZWQgPSBmYWxzZVxuICAgICAgc2Nyb2xsU3luY1R5cGUgPSBAb3B0aW9ucy5zY3JvbGxTeW5jVHlwZSA/IEBfZ2V0Q29uZmlnKCdzY3JvbGxTeW5jVHlwZScpXG4gICAgICBpZiBzY3JvbGxTeW5jVHlwZSA9PSAnVmVydGljYWwgKyBIb3Jpem9udGFsJyB8fCBzY3JvbGxTeW5jVHlwZSA9PSAnVmVydGljYWwnXG4gICAgICAgIGlzU3luY1Njcm9sbEVuYWJsZWQgPSB0cnVlXG4gICAgICBzZWxlY3RlZEluZGV4ID0gQGRpZmZWaWV3Lm5leHREaWZmKGlzU3luY1Njcm9sbEVuYWJsZWQpXG4gICAgICBAZm9vdGVyVmlldz8uc2hvd1NlbGVjdGlvbkNvdW50KCBzZWxlY3RlZEluZGV4ICsgMSApXG5cbiAgIyBjYWxsZWQgYnkgXCJNb3ZlIHRvIHByZXZpb3VzIGRpZmZcIiBjb21tYW5kXG4gIHByZXZEaWZmOiAtPlxuICAgIGlmIEBkaWZmVmlldz9cbiAgICAgIGlzU3luY1Njcm9sbEVuYWJsZWQgPSBmYWxzZVxuICAgICAgc2Nyb2xsU3luY1R5cGUgPSBAb3B0aW9ucy5zY3JvbGxTeW5jVHlwZSA/IEBfZ2V0Q29uZmlnKCdzY3JvbGxTeW5jVHlwZScpXG4gICAgICBpZiBzY3JvbGxTeW5jVHlwZSA9PSAnVmVydGljYWwgKyBIb3Jpem9udGFsJyB8fCBzY3JvbGxTeW5jVHlwZSA9PSAnVmVydGljYWwnXG4gICAgICAgIGlzU3luY1Njcm9sbEVuYWJsZWQgPSB0cnVlXG4gICAgICBzZWxlY3RlZEluZGV4ID0gQGRpZmZWaWV3LnByZXZEaWZmKGlzU3luY1Njcm9sbEVuYWJsZWQpXG4gICAgICBAZm9vdGVyVmlldz8uc2hvd1NlbGVjdGlvbkNvdW50KCBzZWxlY3RlZEluZGV4ICsgMSApXG5cbiAgIyBjYWxsZWQgYnkgXCJDb3B5IHRvIHJpZ2h0XCIgY29tbWFuZFxuICBjb3B5VG9SaWdodDogLT5cbiAgICBpZiBAZGlmZlZpZXc/XG4gICAgICBAZGlmZlZpZXcuY29weVRvUmlnaHQoKVxuICAgICAgQGZvb3RlclZpZXc/LmhpZGVTZWxlY3Rpb25Db3VudCgpXG5cbiAgIyBjYWxsZWQgYnkgXCJDb3B5IHRvIGxlZnRcIiBjb21tYW5kXG4gIGNvcHlUb0xlZnQ6IC0+XG4gICAgaWYgQGRpZmZWaWV3P1xuICAgICAgQGRpZmZWaWV3LmNvcHlUb0xlZnQoKVxuICAgICAgQGZvb3RlclZpZXc/LmhpZGVTZWxlY3Rpb25Db3VudCgpXG5cbiAgIyBjYWxsZWQgYnkgdGhlIGNvbW1hbmRzIGVuYWJsZS90b2dnbGUgdG8gZG8gaW5pdGlhbCBkaWZmXG4gICMgc2V0cyB1cCBzdWJzY3JpcHRpb25zIGZvciBhdXRvIGRpZmYgYW5kIGRpc2FibGluZyB3aGVuIGEgcGFuZSBpcyBkZXN0cm95ZWRcbiAgIyBldmVudCBpcyBhbiBvcHRpb25hbCBhcmd1bWVudCBvZiBhIGZpbGUgcGF0aCB0byBkaWZmIHdpdGggY3VycmVudFxuICAjIGVkaXRvcnNQcm9taXNlIGlzIGFuIG9wdGlvbmFsIGFyZ3VtZW50IG9mIGEgcHJvbWlzZSB0aGF0IHJldHVybnMgd2l0aCAyIGVkaXRvcnNcbiAgIyBvcHRpb25zIGlzIGFuIG9wdGlvbmFsIGFyZ3VtZW50IHdpdGggb3B0aW9uYWwgcHJvcGVydGllcyB0aGF0IGFyZSB1c2VkIHRvIG92ZXJyaWRlIHVzZXIncyBzZXR0aW5nc1xuICBkaWZmUGFuZXM6IChldmVudCwgZWRpdG9yc1Byb21pc2UsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICBAb3B0aW9ucyA9IG9wdGlvbnNcblxuICAgIGlmICFlZGl0b3JzUHJvbWlzZVxuICAgICAgaWYgZXZlbnQ/LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWInKSB8fCBldmVudD8uY3VycmVudFRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUnKVxuICAgICAgICBlbGVtV2l0aFBhdGggPSBldmVudC5jdXJyZW50VGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBhdGhdJylcbiAgICAgICAgcGFyYW1zID0ge31cblxuICAgICAgICBpZiBlbGVtV2l0aFBhdGhcbiAgICAgICAgICBwYXJhbXMucGF0aCA9IGVsZW1XaXRoUGF0aC5kYXRhc2V0LnBhdGhcbiAgICAgICAgZWxzZSBpZiBldmVudC5jdXJyZW50VGFyZ2V0Lml0ZW1cbiAgICAgICAgICBwYXJhbXMuZWRpdG9yID0gZXZlbnQuY3VycmVudFRhcmdldC5pdGVtLmNvcHkoKSAjIGNvcHkgaGVyZSBzbyBzdGlsbCBoYXZlIGl0IGlmIGRpc2FibGUgY2xvc2VzIGl0ICMxMjRcblxuICAgICAgICBAZGlzYWJsZSgpICMgbWFrZSBzdXJlIHdlJ3JlIGluIGEgZ29vZCBzdGFydGluZyBzdGF0ZVxuICAgICAgICBlZGl0b3JzUHJvbWlzZSA9IEBfZ2V0RWRpdG9yc0ZvckRpZmZXaXRoQWN0aXZlKHBhcmFtcylcbiAgICAgIGVsc2VcbiAgICAgICAgQGRpc2FibGUoKSAjIG1ha2Ugc3VyZSB3ZSdyZSBpbiBhIGdvb2Qgc3RhcnRpbmcgc3RhdGVcbiAgICAgICAgZWRpdG9yc1Byb21pc2UgPSBAX2dldEVkaXRvcnNGb3JRdWlja0RpZmYoKVxuICAgIGVsc2VcbiAgICAgIEBkaXNhYmxlKCkgIyBtYWtlIHN1cmUgd2UncmUgaW4gYSBnb29kIHN0YXJ0aW5nIHN0YXRlXG5cbiAgICBlZGl0b3JzUHJvbWlzZS50aGVuICgoZWRpdG9ycykgLT5cbiAgICAgIGlmIGVkaXRvcnMgPT0gbnVsbFxuICAgICAgICByZXR1cm5cbiAgICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgQF9zZXR1cFZpc2libGVFZGl0b3JzKGVkaXRvcnMpXG4gICAgICBAZGlmZlZpZXcgPSBuZXcgRGlmZlZpZXcoZWRpdG9ycylcblxuICAgICAgIyBhZGQgbGlzdGVuZXJzXG4gICAgICBAX3NldHVwRWRpdG9yU3Vic2NyaXB0aW9ucyhlZGl0b3JzKVxuXG4gICAgICAjIGFkZCB0aGUgYm90dG9tIFVJIHBhbmVsXG4gICAgICBpZiAhQGZvb3RlclZpZXc/XG4gICAgICAgIGlnbm9yZVdoaXRlc3BhY2UgPSBAb3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlID8gQF9nZXRDb25maWcoJ2lnbm9yZVdoaXRlc3BhY2UnKVxuICAgICAgICBhdXRvRGlmZiA9IEBvcHRpb25zLmF1dG9EaWZmID8gQF9nZXRDb25maWcoJ2F1dG9EaWZmJylcbiAgICAgICAgQGZvb3RlclZpZXcgPSBuZXcgRm9vdGVyVmlldyhpZ25vcmVXaGl0ZXNwYWNlLCBAb3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlPywgYXV0b0RpZmYsIEBvcHRpb25zLmF1dG9EaWZmPylcbiAgICAgICAgQGZvb3RlclZpZXcuY3JlYXRlUGFuZWwoKVxuICAgICAgQGZvb3RlclZpZXcuc2hvdygpXG5cbiAgICAgICMgYXV0byBoaWRlIHRyZWUgdmlldyB3aGlsZSBkaWZmaW5nICM4MlxuICAgICAgaGlkZURvY2tzID0gQG9wdGlvbnMuaGlkZURvY2tzID8gQF9nZXRDb25maWcoJ2hpZGVEb2NrcycpXG4gICAgICBpZiBoaWRlRG9ja3NcbiAgICAgICAgQGRvY2tzVG9SZW9wZW4ubGVmdCA9IGF0b20ud29ya3NwYWNlLmdldExlZnREb2NrKCkuaXNWaXNpYmxlKClcbiAgICAgICAgQGRvY2tzVG9SZW9wZW4ucmlnaHQgPSBhdG9tLndvcmtzcGFjZS5nZXRSaWdodERvY2soKS5pc1Zpc2libGUoKVxuICAgICAgICBAZG9ja3NUb1Jlb3Blbi5ib3R0b20gPSBhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21Eb2NrKCkuaXNWaXNpYmxlKClcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0TGVmdERvY2soKS5oaWRlKClcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0UmlnaHREb2NrKCkuaGlkZSgpXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldEJvdHRvbURvY2soKS5oaWRlKClcblxuICAgICAgIyB1cGRhdGUgZGlmZiBpZiB0aGVyZSBpcyBubyBnaXQgcmVwbyAobm8gb25jaGFuZ2UgZmlyZWQpXG4gICAgICBpZiAhQGhhc0dpdFJlcG9cbiAgICAgICAgQHVwZGF0ZURpZmYoZWRpdG9ycylcblxuICAgICAgIyBhZGQgYXBwbGljYXRpb24gbWVudSBpdGVtc1xuICAgICAgQGNvbnRleHRNZW51U3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgIEBjb250ZXh0TWVudVN1YnNjcmlwdGlvbnMuYWRkIGF0b20ubWVudS5hZGQgW1xuICAgICAgICB7XG4gICAgICAgICAgJ2xhYmVsJzogJ1BhY2thZ2VzJ1xuICAgICAgICAgICdzdWJtZW51JzogW1xuICAgICAgICAgICAgJ2xhYmVsJzogJ1NwbGl0IERpZmYnXG4gICAgICAgICAgICAnc3VibWVudSc6IFtcbiAgICAgICAgICAgICAgeyAnbGFiZWwnOiAnSWdub3JlIFdoaXRlc3BhY2UnLCAnY29tbWFuZCc6ICdzcGxpdC1kaWZmOmlnbm9yZS13aGl0ZXNwYWNlJyB9XG4gICAgICAgICAgICAgIHsgJ2xhYmVsJzogJ01vdmUgdG8gTmV4dCBEaWZmJywgJ2NvbW1hbmQnOiAnc3BsaXQtZGlmZjpuZXh0LWRpZmYnIH1cbiAgICAgICAgICAgICAgeyAnbGFiZWwnOiAnTW92ZSB0byBQcmV2aW91cyBEaWZmJywgJ2NvbW1hbmQnOiAnc3BsaXQtZGlmZjpwcmV2LWRpZmYnIH1cbiAgICAgICAgICAgICAgeyAnbGFiZWwnOiAnQ29weSB0byBSaWdodCcsICdjb21tYW5kJzogJ3NwbGl0LWRpZmY6Y29weS10by1yaWdodCd9XG4gICAgICAgICAgICAgIHsgJ2xhYmVsJzogJ0NvcHkgdG8gTGVmdCcsICdjb21tYW5kJzogJ3NwbGl0LWRpZmY6Y29weS10by1sZWZ0J31cbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICAgIEBjb250ZXh0TWVudVN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29udGV4dE1lbnUuYWRkIHtcbiAgICAgICAgJ2F0b20tdGV4dC1lZGl0b3InOiBbe1xuICAgICAgICAgICdsYWJlbCc6ICdTcGxpdCBEaWZmJyxcbiAgICAgICAgICAnc3VibWVudSc6IFtcbiAgICAgICAgICAgIHsgJ2xhYmVsJzogJ0lnbm9yZSBXaGl0ZXNwYWNlJywgJ2NvbW1hbmQnOiAnc3BsaXQtZGlmZjppZ25vcmUtd2hpdGVzcGFjZScgfVxuICAgICAgICAgICAgeyAnbGFiZWwnOiAnTW92ZSB0byBOZXh0IERpZmYnLCAnY29tbWFuZCc6ICdzcGxpdC1kaWZmOm5leHQtZGlmZicgfVxuICAgICAgICAgICAgeyAnbGFiZWwnOiAnTW92ZSB0byBQcmV2aW91cyBEaWZmJywgJ2NvbW1hbmQnOiAnc3BsaXQtZGlmZjpwcmV2LWRpZmYnIH1cbiAgICAgICAgICAgIHsgJ2xhYmVsJzogJ0NvcHkgdG8gUmlnaHQnLCAnY29tbWFuZCc6ICdzcGxpdC1kaWZmOmNvcHktdG8tcmlnaHQnfVxuICAgICAgICAgICAgeyAnbGFiZWwnOiAnQ29weSB0byBMZWZ0JywgJ2NvbW1hbmQnOiAnc3BsaXQtZGlmZjpjb3B5LXRvLWxlZnQnfVxuICAgICAgICAgIF1cbiAgICAgICAgfV1cbiAgICAgIH1cbiAgICApLmJpbmQodGhpcykgIyBtYWtlIHN1cmUgdGhlIHNjb3BlIGlzIGNvcnJlY3RcblxuICAjIGNhbGxlZCBieSBib3RoIGRpZmZQYW5lcyBhbmQgdGhlIGVkaXRvciBzdWJzY3JpcHRpb24gdG8gdXBkYXRlIHRoZSBkaWZmXG4gIHVwZGF0ZURpZmY6IChlZGl0b3JzKSAtPlxuICAgIEBpc0VuYWJsZWQgPSB0cnVlXG5cbiAgICAjIGlmIHRoZXJlIGlzIGEgZGlmZiBiZWluZyBjb21wdXRlZCBpbiB0aGUgYmFja2dyb3VuZCwgY2FuY2VsIGl0XG4gICAgaWYgQHByb2Nlc3M/XG4gICAgICBAcHJvY2Vzcy5raWxsKClcbiAgICAgIEBwcm9jZXNzID0gbnVsbFxuXG4gICAgIyBmb3JjZSBzb2Z0d3JhcCB0byBiZSBvZmYgaWYgaXQgc29tZWhvdyB0dXJuZWQgYmFjayBvbiAjMTQzXG4gICAgdHVybk9mZlNvZnRXcmFwID0gQG9wdGlvbnMudHVybk9mZlNvZnRXcmFwID8gQF9nZXRDb25maWcoJ3R1cm5PZmZTb2Z0V3JhcCcpXG4gICAgaWYgdHVybk9mZlNvZnRXcmFwXG4gICAgICBpZiBlZGl0b3JzLmVkaXRvcjEuaXNTb2Z0V3JhcHBlZCgpXG4gICAgICAgIGVkaXRvcnMuZWRpdG9yMS5zZXRTb2Z0V3JhcHBlZChmYWxzZSlcbiAgICAgIGlmIGVkaXRvcnMuZWRpdG9yMi5pc1NvZnRXcmFwcGVkKClcbiAgICAgICAgZWRpdG9ycy5lZGl0b3IyLnNldFNvZnRXcmFwcGVkKGZhbHNlKVxuXG4gICAgaWdub3JlV2hpdGVzcGFjZSA9IEBvcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UgPyBAX2dldENvbmZpZygnaWdub3JlV2hpdGVzcGFjZScpXG4gICAgZWRpdG9yUGF0aHMgPSBAX2NyZWF0ZVRlbXBGaWxlcyhlZGl0b3JzKVxuXG4gICAgQGZvb3RlclZpZXc/LnNldExvYWRpbmcoKVxuXG4gICAgIyAtLS0ga2ljayBvZmYgYmFja2dyb3VuZCBwcm9jZXNzIHRvIGNvbXB1dGUgZGlmZiAtLS1cbiAgICB7QnVmZmVyZWROb2RlUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xuICAgIGNvbW1hbmQgPSBwYXRoLnJlc29sdmUgX19kaXJuYW1lLCBcIi4vY29tcHV0ZS1kaWZmLmpzXCJcbiAgICBhcmdzID0gW2VkaXRvclBhdGhzLmVkaXRvcjFQYXRoLCBlZGl0b3JQYXRocy5lZGl0b3IyUGF0aCwgaWdub3JlV2hpdGVzcGFjZV1cbiAgICB0aGVPdXRwdXQgPSAnJ1xuICAgIHN0ZG91dCA9IChvdXRwdXQpID0+XG4gICAgICB0aGVPdXRwdXQgPSBvdXRwdXRcbiAgICAgIGNvbXB1dGVkRGlmZiA9IEpTT04ucGFyc2Uob3V0cHV0KVxuICAgICAgQHByb2Nlc3Mua2lsbCgpXG4gICAgICBAcHJvY2VzcyA9IG51bGxcbiAgICAgIEBfcmVzdW1lVXBkYXRlRGlmZihlZGl0b3JzLCBjb21wdXRlZERpZmYpXG4gICAgc3RkZXJyID0gKGVycikgPT5cbiAgICAgIHRoZU91dHB1dCA9IGVyclxuICAgIGV4aXQgPSAoY29kZSkgPT5cbiAgICAgIGlmIGNvZGUgIT0gMFxuICAgICAgICBjb25zb2xlLmxvZygnQnVmZmVyZWROb2RlUHJvY2VzcyBjb2RlIHdhcyAnICsgY29kZSlcbiAgICAgICAgY29uc29sZS5sb2codGhlT3V0cHV0KVxuICAgIEBwcm9jZXNzID0gbmV3IEJ1ZmZlcmVkTm9kZVByb2Nlc3Moe2NvbW1hbmQsIGFyZ3MsIHN0ZG91dCwgc3RkZXJyLCBleGl0fSlcbiAgICAjIC0tLSBraWNrIG9mZiBiYWNrZ3JvdW5kIHByb2Nlc3MgdG8gY29tcHV0ZSBkaWZmIC0tLVxuXG4gICMgcmVzdW1lcyBhZnRlciB0aGUgY29tcHV0ZSBkaWZmIHByb2Nlc3MgcmV0dXJuc1xuICBfcmVzdW1lVXBkYXRlRGlmZjogKGVkaXRvcnMsIGNvbXB1dGVkRGlmZikgLT5cbiAgICByZXR1cm4gdW5sZXNzIEBkaWZmVmlldz9cblxuICAgIEBkaWZmVmlldy5jbGVhckRpZmYoKVxuICAgIGlmIEBzeW5jU2Nyb2xsP1xuICAgICAgQHN5bmNTY3JvbGwuZGlzcG9zZSgpXG4gICAgICBAc3luY1Njcm9sbCA9IG51bGxcblxuICAgICMgZ3JhYiB0aGUgc2V0dGluZ3MgZm9yIHRoZSBkaWZmXG4gICAgYWRkZWRDb2xvclNpZGUgPSBAb3B0aW9ucy5hZGRlZENvbG9yU2lkZSA/IEBfZ2V0Q29uZmlnKCdjb2xvcnMuYWRkZWRDb2xvclNpZGUnKVxuICAgIGRpZmZXb3JkcyA9IEBvcHRpb25zLmRpZmZXb3JkcyA/IEBfZ2V0Q29uZmlnKCdkaWZmV29yZHMnKVxuICAgIGlnbm9yZVdoaXRlc3BhY2UgPSBAb3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlID8gQF9nZXRDb25maWcoJ2lnbm9yZVdoaXRlc3BhY2UnKVxuICAgIG92ZXJyaWRlVGhlbWVDb2xvcnMgPSBAb3B0aW9ucy5vdmVycmlkZVRoZW1lQ29sb3JzID8gQF9nZXRDb25maWcoJ2NvbG9ycy5vdmVycmlkZVRoZW1lQ29sb3JzJylcblxuICAgIEBkaWZmVmlldy5kaXNwbGF5RGlmZihjb21wdXRlZERpZmYsIGFkZGVkQ29sb3JTaWRlLCBkaWZmV29yZHMsIGlnbm9yZVdoaXRlc3BhY2UsIG92ZXJyaWRlVGhlbWVDb2xvcnMpXG5cbiAgICAjIGdpdmUgdGhlIG1hcmtlciBsYXllcnMgdG8gdGhvc2UgcmVnaXN0ZXJlZCB3aXRoIHRoZSBzZXJ2aWNlXG4gICAgd2hpbGUgQHNwbGl0RGlmZlJlc29sdmVzPy5sZW5ndGhcbiAgICAgIEBzcGxpdERpZmZSZXNvbHZlcy5wb3AoKShAZGlmZlZpZXcuZ2V0TWFya2VyTGF5ZXJzKCkpXG5cbiAgICBAZm9vdGVyVmlldz8uc2V0TnVtRGlmZmVyZW5jZXMoQGRpZmZWaWV3LmdldE51bURpZmZlcmVuY2VzKCkpXG5cbiAgICBzY3JvbGxTeW5jVHlwZSA9IEBvcHRpb25zLnNjcm9sbFN5bmNUeXBlID8gQF9nZXRDb25maWcoJ3Njcm9sbFN5bmNUeXBlJylcbiAgICBpZiBzY3JvbGxTeW5jVHlwZSA9PSAnVmVydGljYWwgKyBIb3Jpem9udGFsJ1xuICAgICAgQHN5bmNTY3JvbGwgPSBuZXcgU3luY1Njcm9sbChlZGl0b3JzLmVkaXRvcjEsIGVkaXRvcnMuZWRpdG9yMiwgdHJ1ZSlcbiAgICAgIEBzeW5jU2Nyb2xsLnN5bmNQb3NpdGlvbnMoKVxuICAgIGVsc2UgaWYgc2Nyb2xsU3luY1R5cGUgPT0gJ1ZlcnRpY2FsJ1xuICAgICAgQHN5bmNTY3JvbGwgPSBuZXcgU3luY1Njcm9sbChlZGl0b3JzLmVkaXRvcjEsIGVkaXRvcnMuZWRpdG9yMiwgZmFsc2UpXG4gICAgICBAc3luY1Njcm9sbC5zeW5jUG9zaXRpb25zKClcblxuICAjIEdldHMgdGhlIGZpcnN0IHR3byB2aXNpYmxlIGVkaXRvcnMgZm91bmQgb3IgY3JlYXRlcyB0aGVtIGFzIG5lZWRlZC5cbiAgIyBSZXR1cm5zIGEgUHJvbWlzZSB3aGljaCB5aWVsZHMgYSB2YWx1ZSBvZiB7ZWRpdG9yMTogVGV4dEVkaXRvciwgZWRpdG9yMjogVGV4dEVkaXRvcn1cbiAgX2dldEVkaXRvcnNGb3JRdWlja0RpZmY6ICgpIC0+XG4gICAgZWRpdG9yMSA9IG51bGxcbiAgICBlZGl0b3IyID0gbnVsbFxuXG4gICAgIyB0cnkgdG8gZmluZCB0aGUgZmlyc3QgdHdvIGVkaXRvcnNcbiAgICBwYW5lcyA9IGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldFBhbmVzKClcbiAgICBmb3IgcCBpbiBwYW5lc1xuICAgICAgYWN0aXZlSXRlbSA9IHAuZ2V0QWN0aXZlSXRlbSgpXG4gICAgICBpZiBhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IoYWN0aXZlSXRlbSlcbiAgICAgICAgaWYgZWRpdG9yMSA9PSBudWxsXG4gICAgICAgICAgZWRpdG9yMSA9IGFjdGl2ZUl0ZW1cbiAgICAgICAgZWxzZSBpZiBlZGl0b3IyID09IG51bGxcbiAgICAgICAgICBlZGl0b3IyID0gYWN0aXZlSXRlbVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAjIGF1dG8gb3BlbiBlZGl0b3IgcGFuZXMgc28gd2UgaGF2ZSB0d28gdG8gZGlmZiB3aXRoXG4gICAgaWYgZWRpdG9yMSA9PSBudWxsXG4gICAgICBlZGl0b3IxID0gYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHthdXRvSGVpZ2h0OiBmYWxzZX0pXG4gICAgICBAd2FzRWRpdG9yMUNyZWF0ZWQgPSB0cnVlXG4gICAgICAjIGFkZCBmaXJzdCBlZGl0b3IgdG8gdGhlIGZpcnN0IHBhbmVcbiAgICAgIHBhbmVzWzBdLmFkZEl0ZW0oZWRpdG9yMSlcbiAgICAgIHBhbmVzWzBdLmFjdGl2YXRlSXRlbShlZGl0b3IxKVxuICAgIGlmIGVkaXRvcjIgPT0gbnVsbFxuICAgICAgZWRpdG9yMiA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcih7YXV0b0hlaWdodDogZmFsc2V9KVxuICAgICAgQHdhc0VkaXRvcjJDcmVhdGVkID0gdHJ1ZVxuICAgICAgcmlnaHRQYW5lSW5kZXggPSBwYW5lcy5pbmRleE9mKGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGVkaXRvcjEpKSArIDFcbiAgICAgIGlmIHBhbmVzW3JpZ2h0UGFuZUluZGV4XVxuICAgICAgICAjIGFkZCBzZWNvbmQgZWRpdG9yIHRvIGV4aXN0aW5nIHBhbmUgdG8gdGhlIHJpZ2h0IG9mIGZpcnN0IGVkaXRvclxuICAgICAgICBwYW5lc1tyaWdodFBhbmVJbmRleF0uYWRkSXRlbShlZGl0b3IyKVxuICAgICAgICBwYW5lc1tyaWdodFBhbmVJbmRleF0uYWN0aXZhdGVJdGVtKGVkaXRvcjIpXG4gICAgICBlbHNlXG4gICAgICAgICMgbm8gZXhpc3RpbmcgcGFuZSBzbyBzcGxpdCByaWdodFxuICAgICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShlZGl0b3IxKS5zcGxpdFJpZ2h0KHtpdGVtczogW2VkaXRvcjJdfSlcbiAgICAgIGVkaXRvcjIuZ2V0QnVmZmVyKCkuc2V0TGFuZ3VhZ2VNb2RlKGF0b20uZ3JhbW1hcnMubGFuZ3VhZ2VNb2RlRm9yR3JhbW1hckFuZEJ1ZmZlcihlZGl0b3IxLmdldEdyYW1tYXIoKSwgZWRpdG9yMi5nZXRCdWZmZXIoKSkpXG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtlZGl0b3IxOiBlZGl0b3IxLCBlZGl0b3IyOiBlZGl0b3IyfSlcblxuICAjIEdldHMgdGhlIGFjdGl2ZSBlZGl0b3IgYW5kIG9wZW5zIHRoZSBzcGVjaWZpZWQgZmlsZSB0byB0aGUgcmlnaHQgb2YgaXRcbiAgIyBSZXR1cm5zIGEgUHJvbWlzZSB3aGljaCB5aWVsZHMgYSB2YWx1ZSBvZiB7ZWRpdG9yMTogVGV4dEVkaXRvciwgZWRpdG9yMjogVGV4dEVkaXRvcn1cbiAgX2dldEVkaXRvcnNGb3JEaWZmV2l0aEFjdGl2ZTogKHBhcmFtcykgLT5cbiAgICBmaWxlUGF0aCA9IHBhcmFtcy5wYXRoXG4gICAgZWRpdG9yV2l0aG91dFBhdGggPSBwYXJhbXMuZWRpdG9yXG4gICAgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICBpZiBhY3RpdmVFZGl0b3I/XG4gICAgICBlZGl0b3IxID0gYWN0aXZlRWRpdG9yXG4gICAgICBAd2FzRWRpdG9yMkNyZWF0ZWQgPSB0cnVlXG4gICAgICBwYW5lcyA9IGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldFBhbmVzKClcbiAgICAgICMgZ2V0IGluZGV4IG9mIHBhbmUgZm9sbG93aW5nIGFjdGl2ZSBlZGl0b3IgcGFuZVxuICAgICAgcmlnaHRQYW5lSW5kZXggPSBwYW5lcy5pbmRleE9mKGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGVkaXRvcjEpKSArIDFcbiAgICAgICMgcGFuZSBpcyBjcmVhdGVkIGlmIHRoZXJlIGlzIG5vdCBvbmUgdG8gdGhlIHJpZ2h0IG9mIHRoZSBhY3RpdmUgZWRpdG9yXG4gICAgICByaWdodFBhbmUgPSBwYW5lc1tyaWdodFBhbmVJbmRleF0gfHwgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oZWRpdG9yMSkuc3BsaXRSaWdodCgpXG5cbiAgICAgIGlmIHBhcmFtcy5wYXRoXG4gICAgICAgIGZpbGVQYXRoID0gcGFyYW1zLnBhdGhcbiAgICAgICAgaWYgZWRpdG9yMS5nZXRQYXRoKCkgPT0gZmlsZVBhdGhcbiAgICAgICAgICAjIGlmIGRpZmZpbmcgd2l0aCBpdHNlbGYsIHNldCBmaWxlUGF0aCB0byBudWxsIHNvIGFuIGVtcHR5IGVkaXRvciBpc1xuICAgICAgICAgICMgb3BlbmVkLCB3aGljaCB3aWxsIGNhdXNlIGEgZ2l0IGRpZmZcbiAgICAgICAgICBmaWxlUGF0aCA9IG51bGxcbiAgICAgICAgZWRpdG9yMlByb21pc2UgPSBhdG9tLndvcmtzcGFjZS5vcGVuVVJJSW5QYW5lKGZpbGVQYXRoLCByaWdodFBhbmUpXG5cbiAgICAgICAgcmV0dXJuIGVkaXRvcjJQcm9taXNlLnRoZW4gKGVkaXRvcjIpIC0+XG4gICAgICAgICAgZWRpdG9yMi5nZXRCdWZmZXIoKS5zZXRMYW5ndWFnZU1vZGUoYXRvbS5ncmFtbWFycy5sYW5ndWFnZU1vZGVGb3JHcmFtbWFyQW5kQnVmZmVyKGVkaXRvcjEuZ2V0R3JhbW1hcigpLCBlZGl0b3IyLmdldEJ1ZmZlcigpKSlcbiAgICAgICAgICByZXR1cm4ge2VkaXRvcjE6IGVkaXRvcjEsIGVkaXRvcjI6IGVkaXRvcjJ9XG4gICAgICBlbHNlIGlmIGVkaXRvcldpdGhvdXRQYXRoXG4gICAgICAgIGVkaXRvcjIgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3Ioe2F1dG9IZWlnaHQ6IGZhbHNlfSlcbiAgICAgICAgcmlnaHRQYW5lLmFkZEl0ZW0oZWRpdG9yMilcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtlZGl0b3IxOiBlZGl0b3IxLCBlZGl0b3IyOiBlZGl0b3IyfSlcbiAgICBlbHNlXG4gICAgICBub0FjdGl2ZUVkaXRvck1zZyA9ICdObyBhY3RpdmUgZmlsZSBmb3VuZCEgKFRyeSBmb2N1c2luZyBhIHRleHQgZWRpdG9yKSdcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdTcGxpdCBEaWZmJywge2RldGFpbDogbm9BY3RpdmVFZGl0b3JNc2csIGRpc21pc3NhYmxlOiBmYWxzZSwgaWNvbjogJ2RpZmYnfSlcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbClcblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbClcblxuICAjIHNldHMgdXAgYW55IGVkaXRvciBsaXN0ZW5lcnNcbiAgX3NldHVwRWRpdG9yU3Vic2NyaXB0aW9uczogKGVkaXRvcnMpIC0+XG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgIyBhZGQgbGlzdGVuZXJzXG4gICAgYXV0b0RpZmYgPSBAb3B0aW9ucy5hdXRvRGlmZiA/IEBfZ2V0Q29uZmlnKCdhdXRvRGlmZicpXG4gICAgaWYgYXV0b0RpZmZcbiAgICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBlZGl0b3JzLmVkaXRvcjEub25EaWRTdG9wQ2hhbmdpbmcgPT5cbiAgICAgICAgQHVwZGF0ZURpZmYoZWRpdG9ycylcbiAgICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBlZGl0b3JzLmVkaXRvcjIub25EaWRTdG9wQ2hhbmdpbmcgPT5cbiAgICAgICAgQHVwZGF0ZURpZmYoZWRpdG9ycylcbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9ycy5lZGl0b3IxLm9uRGlkRGVzdHJveSA9PlxuICAgICAgQGRpc2FibGUoKVxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBlZGl0b3JzLmVkaXRvcjIub25EaWREZXN0cm95ID0+XG4gICAgICBAZGlzYWJsZSgpXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdzcGxpdC1kaWZmJywgKGV2ZW50KSA9PlxuICAgICAgIyBuZWVkIHRvIHJlZG8gZWRpdG9yIHN1YnNjcmlwdGlvbnMgYmVjYXVzZSBzb21lIHNldHRpbmdzIGFmZmVjdCB0aGUgbGlzdGVuZXJzIHRoZW1zZWx2ZXNcbiAgICAgIEBfc2V0dXBFZGl0b3JTdWJzY3JpcHRpb25zKGVkaXRvcnMpXG5cbiAgICAgICMgdXBkYXRlIGZvb3RlciB2aWV3IGlnbm9yZSB3aGl0ZXNwYWNlIGNoZWNrYm94IGlmIHNldHRpbmcgaGFzIGNoYW5nZWRcbiAgICAgIGlmIGV2ZW50Lm5ld1ZhbHVlLmlnbm9yZVdoaXRlc3BhY2UgIT0gZXZlbnQub2xkVmFsdWUuaWdub3JlV2hpdGVzcGFjZVxuICAgICAgICBAZm9vdGVyVmlldz8uc2V0SWdub3JlV2hpdGVzcGFjZShldmVudC5uZXdWYWx1ZS5pZ25vcmVXaGl0ZXNwYWNlKVxuICAgICAgaWYgZXZlbnQubmV3VmFsdWUuYXV0b0RpZmYgIT0gZXZlbnQub2xkVmFsdWUuYXV0b0RpZmZcbiAgICAgICAgQGZvb3RlclZpZXc/LnNldEF1dG9EaWZmKGV2ZW50Lm5ld1ZhbHVlLmF1dG9EaWZmKVxuXG4gICAgICBAdXBkYXRlRGlmZihlZGl0b3JzKVxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBlZGl0b3JzLmVkaXRvcjEub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiAoZXZlbnQpID0+XG4gICAgICBAZGlmZlZpZXcuaGFuZGxlQ3Vyc29yQ2hhbmdlKGV2ZW50LmN1cnNvciwgZXZlbnQub2xkQnVmZmVyUG9zaXRpb24sIGV2ZW50Lm5ld0J1ZmZlclBvc2l0aW9uKVxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBlZGl0b3JzLmVkaXRvcjIub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiAoZXZlbnQpID0+XG4gICAgICBAZGlmZlZpZXcuaGFuZGxlQ3Vyc29yQ2hhbmdlKGV2ZW50LmN1cnNvciwgZXZlbnQub2xkQnVmZmVyUG9zaXRpb24sIGV2ZW50Lm5ld0J1ZmZlclBvc2l0aW9uKVxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBlZGl0b3JzLmVkaXRvcjEub25EaWRBZGRDdXJzb3IgKGN1cnNvcikgPT5cbiAgICAgIEBkaWZmVmlldy5oYW5kbGVDdXJzb3JDaGFuZ2UoY3Vyc29yLCAtMSwgY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvcnMuZWRpdG9yMi5vbkRpZEFkZEN1cnNvciAoY3Vyc29yKSA9PlxuICAgICAgQGRpZmZWaWV3LmhhbmRsZUN1cnNvckNoYW5nZShjdXJzb3IsIC0xLCBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcblxuICBfc2V0dXBWaXNpYmxlRWRpdG9yczogKGVkaXRvcnMpIC0+XG4gICAgQnVmZmVyRXh0ZW5kZXIgPSByZXF1aXJlICcuL2J1ZmZlci1leHRlbmRlcidcbiAgICBidWZmZXIxTGluZUVuZGluZyA9IChuZXcgQnVmZmVyRXh0ZW5kZXIoZWRpdG9ycy5lZGl0b3IxLmdldEJ1ZmZlcigpKSkuZ2V0TGluZUVuZGluZygpXG5cbiAgICBpZiBAd2FzRWRpdG9yMkNyZWF0ZWRcbiAgICAgICMgd2FudCB0byBzY3JvbGwgYSBuZXdseSBjcmVhdGVkIGVkaXRvciB0byB0aGUgZmlyc3QgZWRpdG9yJ3MgcG9zaXRpb25cbiAgICAgIGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3JzLmVkaXRvcjEpLmZvY3VzKClcbiAgICAgICMgc2V0IHRoZSBwcmVmZXJyZWQgbGluZSBlbmRpbmcgYmVmb3JlIGluc2VydGluZyB0ZXh0ICMzOVxuICAgICAgaWYgYnVmZmVyMUxpbmVFbmRpbmcgPT0gJ1xcbicgfHwgYnVmZmVyMUxpbmVFbmRpbmcgPT0gJ1xcclxcbidcbiAgICAgICAgQGxpbmVFbmRpbmdTdWJzY3JpcHRpb24gPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICAgIEBsaW5lRW5kaW5nU3Vic2NyaXB0aW9uLmFkZCBlZGl0b3JzLmVkaXRvcjIub25XaWxsSW5zZXJ0VGV4dCAoKSAtPlxuICAgICAgICAgIGVkaXRvcnMuZWRpdG9yMi5nZXRCdWZmZXIoKS5zZXRQcmVmZXJyZWRMaW5lRW5kaW5nKGJ1ZmZlcjFMaW5lRW5kaW5nKVxuXG4gICAgQF9zZXR1cEdpdFJlcG8oZWRpdG9ycylcblxuICAgICMgdW5mb2xkIGFsbCBsaW5lcyBzbyBkaWZmcyBwcm9wZXJseSBhbGlnblxuICAgIGVkaXRvcnMuZWRpdG9yMS51bmZvbGRBbGwoKVxuICAgIGVkaXRvcnMuZWRpdG9yMi51bmZvbGRBbGwoKVxuXG4gICAgbXV0ZU5vdGlmaWNhdGlvbnMgPSBAb3B0aW9ucy5tdXRlTm90aWZpY2F0aW9ucyA/IEBfZ2V0Q29uZmlnKCdtdXRlTm90aWZpY2F0aW9ucycpXG4gICAgdHVybk9mZlNvZnRXcmFwID0gQG9wdGlvbnMudHVybk9mZlNvZnRXcmFwID8gQF9nZXRDb25maWcoJ3R1cm5PZmZTb2Z0V3JhcCcpXG4gICAgaWYgdHVybk9mZlNvZnRXcmFwXG4gICAgICBzaG91bGROb3RpZnkgPSBmYWxzZVxuICAgICAgaWYgZWRpdG9ycy5lZGl0b3IxLmlzU29mdFdyYXBwZWQoKVxuICAgICAgICBAd2FzRWRpdG9yMVNvZnRXcmFwcGVkID0gdHJ1ZVxuICAgICAgICBlZGl0b3JzLmVkaXRvcjEuc2V0U29mdFdyYXBwZWQoZmFsc2UpXG4gICAgICAgIHNob3VsZE5vdGlmeSA9IHRydWVcbiAgICAgIGlmIGVkaXRvcnMuZWRpdG9yMi5pc1NvZnRXcmFwcGVkKClcbiAgICAgICAgQHdhc0VkaXRvcjJTb2Z0V3JhcHBlZCA9IHRydWVcbiAgICAgICAgZWRpdG9ycy5lZGl0b3IyLnNldFNvZnRXcmFwcGVkKGZhbHNlKVxuICAgICAgICBzaG91bGROb3RpZnkgPSB0cnVlXG4gICAgICBpZiBzaG91bGROb3RpZnkgJiYgIW11dGVOb3RpZmljYXRpb25zXG4gICAgICAgIHNvZnRXcmFwTXNnID0gJ1NvZnQgd3JhcCBhdXRvbWF0aWNhbGx5IGRpc2FibGVkIHNvIGxpbmVzIHJlbWFpbiBpbiBzeW5jLidcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1NwbGl0IERpZmYnLCB7ZGV0YWlsOiBzb2Z0V3JhcE1zZywgZGlzbWlzc2FibGU6IGZhbHNlLCBpY29uOiAnZGlmZid9KVxuICAgIGVsc2UgaWYgIW11dGVOb3RpZmljYXRpb25zICYmIChlZGl0b3JzLmVkaXRvcjEuaXNTb2Z0V3JhcHBlZCgpIHx8IGVkaXRvcnMuZWRpdG9yMi5pc1NvZnRXcmFwcGVkKCkpXG4gICAgICBzb2Z0V3JhcE1zZyA9ICdXYXJuaW5nOiBTb2Z0IHdyYXAgZW5hYmxlZCEgTGluZXMgbWF5IG5vdCBhbGlnbi5cXG4oVHJ5IFwiVHVybiBPZmYgU29mdCBXcmFwXCIgc2V0dGluZyknXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnU3BsaXQgRGlmZicsIHtkZXRhaWw6IHNvZnRXcmFwTXNnLCBkaXNtaXNzYWJsZTogZmFsc2UsIGljb246ICdkaWZmJ30pXG5cbiAgICBidWZmZXIyTGluZUVuZGluZyA9IChuZXcgQnVmZmVyRXh0ZW5kZXIoZWRpdG9ycy5lZGl0b3IyLmdldEJ1ZmZlcigpKSkuZ2V0TGluZUVuZGluZygpXG4gICAgaWYgYnVmZmVyMkxpbmVFbmRpbmcgIT0gJycgJiYgKGJ1ZmZlcjFMaW5lRW5kaW5nICE9IGJ1ZmZlcjJMaW5lRW5kaW5nKSAmJiBlZGl0b3JzLmVkaXRvcjEuZ2V0TGluZUNvdW50KCkgIT0gMSAmJiBlZGl0b3JzLmVkaXRvcjIuZ2V0TGluZUNvdW50KCkgIT0gMSAmJiAhbXV0ZU5vdGlmaWNhdGlvbnNcbiAgICAgICMgcG9wIHdhcm5pbmcgaWYgdGhlIGxpbmUgZW5kaW5ncyBkaWZmZXIgYW5kIHdlIGhhdmVuJ3QgZG9uZSBhbnl0aGluZyBhYm91dCBpdFxuICAgICAgbGluZUVuZGluZ01zZyA9ICdXYXJuaW5nOiBMaW5lIGVuZGluZ3MgZGlmZmVyISdcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdTcGxpdCBEaWZmJywge2RldGFpbDogbGluZUVuZGluZ01zZywgZGlzbWlzc2FibGU6IGZhbHNlLCBpY29uOiAnZGlmZid9KVxuXG4gIF9zZXR1cEdpdFJlcG86IChlZGl0b3JzKSAtPlxuICAgIGVkaXRvcjFQYXRoID0gZWRpdG9ycy5lZGl0b3IxLmdldFBhdGgoKVxuICAgICMgb25seSBzaG93IGdpdCBjaGFuZ2VzIGlmIHRoZSByaWdodCBlZGl0b3IgaXMgZW1wdHlcbiAgICBpZiBlZGl0b3IxUGF0aD8gJiYgKGVkaXRvcnMuZWRpdG9yMi5nZXRMaW5lQ291bnQoKSA9PSAxICYmIGVkaXRvcnMuZWRpdG9yMi5saW5lVGV4dEZvckJ1ZmZlclJvdygwKSA9PSAnJylcbiAgICAgIGZvciBkaXJlY3RvcnksIGkgaW4gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClcbiAgICAgICAgaWYgZWRpdG9yMVBhdGggaXMgZGlyZWN0b3J5LmdldFBhdGgoKSBvciBkaXJlY3RvcnkuY29udGFpbnMoZWRpdG9yMVBhdGgpXG4gICAgICAgICAgcHJvamVjdFJlcG8gPSBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClbaV1cbiAgICAgICAgICBpZiBwcm9qZWN0UmVwbz9cbiAgICAgICAgICAgIHByb2plY3RSZXBvID0gcHJvamVjdFJlcG8uZ2V0UmVwbyhlZGl0b3IxUGF0aCkgIyBmaXggcmVwbyBmb3Igc3VibW9kdWxlcyAjMTEyXG4gICAgICAgICAgICByZWxhdGl2ZUVkaXRvcjFQYXRoID0gcHJvamVjdFJlcG8ucmVsYXRpdml6ZShlZGl0b3IxUGF0aClcbiAgICAgICAgICAgIGdpdEhlYWRUZXh0ID0gcHJvamVjdFJlcG8uZ2V0SGVhZEJsb2IocmVsYXRpdmVFZGl0b3IxUGF0aClcbiAgICAgICAgICAgIGlmIGdpdEhlYWRUZXh0P1xuICAgICAgICAgICAgICBlZGl0b3JzLmVkaXRvcjIuc2VsZWN0QWxsKClcbiAgICAgICAgICAgICAgZWRpdG9ycy5lZGl0b3IyLmluc2VydFRleHQoZ2l0SGVhZFRleHQpXG4gICAgICAgICAgICAgIEBoYXNHaXRSZXBvID0gdHJ1ZVxuICAgICAgICAgICAgICBicmVha1xuXG4gICMgY3JlYXRlcyB0ZW1wIGZpbGVzIHNvIHRoZSBjb21wdXRlIGRpZmYgcHJvY2VzcyBjYW4gZ2V0IHRoZSB0ZXh0IGVhc2lseVxuICBfY3JlYXRlVGVtcEZpbGVzOiAoZWRpdG9ycykgLT5cbiAgICBlZGl0b3IxUGF0aCA9ICcnXG4gICAgZWRpdG9yMlBhdGggPSAnJ1xuICAgIHRlbXBGb2xkZXJQYXRoID0gYXRvbS5nZXRDb25maWdEaXJQYXRoKCkgKyAnL3NwbGl0LWRpZmYnXG5cbiAgICBlZGl0b3IxUGF0aCA9IHRlbXBGb2xkZXJQYXRoICsgJy9zcGxpdC1kaWZmIDEnXG4gICAgZWRpdG9yMVRlbXBGaWxlID0gbmV3IEZpbGUoZWRpdG9yMVBhdGgpXG4gICAgZWRpdG9yMVRlbXBGaWxlLndyaXRlU3luYyhlZGl0b3JzLmVkaXRvcjEuZ2V0VGV4dCgpKVxuXG4gICAgZWRpdG9yMlBhdGggPSB0ZW1wRm9sZGVyUGF0aCArICcvc3BsaXQtZGlmZiAyJ1xuICAgIGVkaXRvcjJUZW1wRmlsZSA9IG5ldyBGaWxlKGVkaXRvcjJQYXRoKVxuICAgIGVkaXRvcjJUZW1wRmlsZS53cml0ZVN5bmMoZWRpdG9ycy5lZGl0b3IyLmdldFRleHQoKSlcblxuICAgIGVkaXRvclBhdGhzID1cbiAgICAgIGVkaXRvcjFQYXRoOiBlZGl0b3IxUGF0aFxuICAgICAgZWRpdG9yMlBhdGg6IGVkaXRvcjJQYXRoXG5cbiAgICByZXR1cm4gZWRpdG9yUGF0aHNcblxuXG4gIF9nZXRDb25maWc6IChjb25maWcpIC0+XG4gICAgYXRvbS5jb25maWcuZ2V0KFwic3BsaXQtZGlmZi4je2NvbmZpZ31cIilcblxuICBfc2V0Q29uZmlnOiAoY29uZmlnLCB2YWx1ZSkgLT5cbiAgICBhdG9tLmNvbmZpZy5zZXQoXCJzcGxpdC1kaWZmLiN7Y29uZmlnfVwiLCB2YWx1ZSlcblxuXG4gICMgLS0tIFNFUlZJQ0UgQVBJIC0tLVxuICBnZXRNYXJrZXJMYXllcnM6ICgpIC0+XG4gICAgbmV3IFByb21pc2UgKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBAc3BsaXREaWZmUmVzb2x2ZXMucHVzaChyZXNvbHZlKVxuICAgICkuYmluZCh0aGlzKVxuXG4gIGRpZmZFZGl0b3JzOiAoZWRpdG9yMSwgZWRpdG9yMiwgb3B0aW9ucykgLT5cbiAgICBAZGlmZlBhbmVzKG51bGwsIFByb21pc2UucmVzb2x2ZSh7ZWRpdG9yMTogZWRpdG9yMSwgZWRpdG9yMjogZWRpdG9yMn0pLCBvcHRpb25zKVxuXG4gIHByb3ZpZGVTcGxpdERpZmY6IC0+XG4gICAgZ2V0TWFya2VyTGF5ZXJzOiBAZ2V0TWFya2VyTGF5ZXJzLmJpbmQoQGNvbnRleHRGb3JTZXJ2aWNlKVxuICAgIGRpZmZFZGl0b3JzOiBAZGlmZkVkaXRvcnMuYmluZChAY29udGV4dEZvclNlcnZpY2UpXG4gICAgZGlzYWJsZTogQGRpc2FibGUuYmluZChAY29udGV4dEZvclNlcnZpY2UpXG4iXX0=
