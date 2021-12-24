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
      var activeEditor, editor1, editor2Promise, editorWithoutPath, filePath, noActiveEditorMsg, panes, rightPane, rightPaneIndex;
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
          rightPane.addItem(editorWithoutPath);
          return Promise.resolve({
            editor1: editor1,
            editor2: editorWithoutPath
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3NwbGl0LWRpZmYvbGliL3NwbGl0LWRpZmYuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLDZDQUFELEVBQXNCLHlCQUF0QixFQUFpQzs7RUFDakMsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLFVBQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0VBQ2IsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztFQUNiLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSOztFQUNsQixZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSOztFQUNmLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQ2Y7SUFBQSxRQUFBLEVBQVUsSUFBVjtJQUNBLE1BQUEsRUFBUSxZQURSO0lBRUEsYUFBQSxFQUFlLElBRmY7SUFHQSxtQkFBQSxFQUFxQixJQUhyQjtJQUlBLHNCQUFBLEVBQXdCLElBSnhCO0lBS0Esd0JBQUEsRUFBMEIsSUFMMUI7SUFNQSxTQUFBLEVBQVcsS0FOWDtJQU9BLGlCQUFBLEVBQW1CLEtBUG5CO0lBUUEsaUJBQUEsRUFBbUIsS0FSbkI7SUFTQSxxQkFBQSxFQUF1QixLQVR2QjtJQVVBLHFCQUFBLEVBQXVCLEtBVnZCO0lBV0EsVUFBQSxFQUFZLEtBWFo7SUFZQSxhQUFBLEVBQWU7TUFBQyxJQUFBLEVBQU0sS0FBUDtNQUFjLEtBQUEsRUFBTyxLQUFyQjtNQUE0QixNQUFBLEVBQVEsS0FBcEM7S0FaZjtJQWFBLE9BQUEsRUFBUyxJQWJUO0lBY0EsaUJBQUEsRUFBbUIsRUFkbkI7SUFlQSxPQUFBLEVBQVMsRUFmVDtJQWlCQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtN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LE9BQU8sQ0FBQyxJQUFULENBQWMsSUFBQyxDQUFBLGlCQUFmLENBRlQ7O0lBRGdCLENBbGpCbEI7O0FBVEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlyZWN0b3J5LCBGaWxlfSA9IHJlcXVpcmUgJ2F0b20nXG5EaWZmVmlldyA9IHJlcXVpcmUgJy4vZGlmZi12aWV3J1xuRm9vdGVyVmlldyA9IHJlcXVpcmUgJy4vdWkvZm9vdGVyLXZpZXcnXG5TeW5jU2Nyb2xsID0gcmVxdWlyZSAnLi9zeW5jLXNjcm9sbCdcblN0eWxlQ2FsY3VsYXRvciA9IHJlcXVpcmUgJy4vc3R5bGUtY2FsY3VsYXRvcidcbmNvbmZpZ1NjaGVtYSA9IHJlcXVpcmUgJy4vY29uZmlnLXNjaGVtYSdcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwbGl0RGlmZiA9XG4gIGRpZmZWaWV3OiBudWxsXG4gIGNvbmZpZzogY29uZmlnU2NoZW1hXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgZWRpdG9yU3Vic2NyaXB0aW9uczogbnVsbFxuICBsaW5lRW5kaW5nU3Vic2NyaXB0aW9uOiBudWxsXG4gIGNvbnRleHRNZW51U3Vic2NyaXB0aW9uczogbnVsbFxuICBpc0VuYWJsZWQ6IGZhbHNlXG4gIHdhc0VkaXRvcjFDcmVhdGVkOiBmYWxzZVxuICB3YXNFZGl0b3IyQ3JlYXRlZDogZmFsc2VcbiAgd2FzRWRpdG9yMVNvZnRXcmFwcGVkOiBmYWxzZVxuICB3YXNFZGl0b3IyU29mdFdyYXBwZWQ6IGZhbHNlXG4gIGhhc0dpdFJlcG86IGZhbHNlXG4gIGRvY2tzVG9SZW9wZW46IHtsZWZ0OiBmYWxzZSwgcmlnaHQ6IGZhbHNlLCBib3R0b206IGZhbHNlfVxuICBwcm9jZXNzOiBudWxsXG4gIHNwbGl0RGlmZlJlc29sdmVzOiBbXVxuICBvcHRpb25zOiB7fVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQGNvbnRleHRGb3JTZXJ2aWNlID0gdGhpc1xuXG4gICAgc3R5bGVDYWxjdWxhdG9yID0gbmV3IFN0eWxlQ2FsY3VsYXRvcihhdG9tLnN0eWxlcywgYXRvbS5jb25maWcpXG4gICAgc3R5bGVDYWxjdWxhdG9yLnN0YXJ0V2F0Y2hpbmcoXG4gICAgICAgICdzcGxpdC1kaWZmLWN1c3RvbS1zdHlsZXMnLFxuICAgICAgICBbJ3NwbGl0LWRpZmYuY29sb3JzLmFkZGVkQ29sb3InLCAnc3BsaXQtZGlmZi5jb2xvcnMucmVtb3ZlZENvbG9yJ10sXG4gICAgICAgIChjb25maWcpIC0+XG4gICAgICAgICAgYWRkZWRDb2xvciA9IGNvbmZpZy5nZXQoJ3NwbGl0LWRpZmYuY29sb3JzLmFkZGVkQ29sb3InKVxuICAgICAgICAgIGFkZGVkQ29sb3IuYWxwaGEgPSAwLjRcbiAgICAgICAgICBhZGRlZFdvcmRDb2xvciA9IGFkZGVkQ29sb3JcbiAgICAgICAgICBhZGRlZFdvcmRDb2xvci5hbHBoYSA9IDAuNVxuICAgICAgICAgIHJlbW92ZWRDb2xvciA9IGNvbmZpZy5nZXQoJ3NwbGl0LWRpZmYuY29sb3JzLnJlbW92ZWRDb2xvcicpXG4gICAgICAgICAgcmVtb3ZlZENvbG9yLmFscGhhID0gMC40XG4gICAgICAgICAgcmVtb3ZlZFdvcmRDb2xvciA9IHJlbW92ZWRDb2xvclxuICAgICAgICAgIHJlbW92ZWRXb3JkQ29sb3IuYWxwaGEgPSAwLjVcbiAgICAgICAgICBcIlxcblxuICAgICAgICAgIC5zcGxpdC1kaWZmLWFkZGVkLWN1c3RvbSB7XFxuXG4gICAgICAgICAgICBcXHRiYWNrZ3JvdW5kLWNvbG9yOiAje2FkZGVkQ29sb3IudG9SR0JBU3RyaW5nKCl9O1xcblxuICAgICAgICAgIH1cXG5cbiAgICAgICAgICAuc3BsaXQtZGlmZi1yZW1vdmVkLWN1c3RvbSB7XFxuXG4gICAgICAgICAgICBcXHRiYWNrZ3JvdW5kLWNvbG9yOiAje3JlbW92ZWRDb2xvci50b1JHQkFTdHJpbmcoKX07XFxuXG4gICAgICAgICAgfVxcblxuICAgICAgICAgIC5zcGxpdC1kaWZmLXdvcmQtYWRkZWQtY3VzdG9tIC5yZWdpb24ge1xcblxuICAgICAgICAgICAgXFx0YmFja2dyb3VuZC1jb2xvcjogI3thZGRlZFdvcmRDb2xvci50b1JHQkFTdHJpbmcoKX07XFxuXG4gICAgICAgICAgfVxcblxuICAgICAgICAgIC5zcGxpdC1kaWZmLXdvcmQtcmVtb3ZlZC1jdXN0b20gLnJlZ2lvbiB7XFxuXG4gICAgICAgICAgICBcXHRiYWNrZ3JvdW5kLWNvbG9yOiAje3JlbW92ZWRXb3JkQ29sb3IudG9SR0JBU3RyaW5nKCl9O1xcblxuICAgICAgICAgIH1cXG5cIlxuICAgIClcblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UsIC50cmVlLXZpZXcgLnNlbGVjdGVkLCAudGFiLnRleHRlZGl0b3InLFxuICAgICAgJ3NwbGl0LWRpZmY6ZW5hYmxlJzogKGUpID0+XG4gICAgICAgIEBkaWZmUGFuZXMoZSlcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgJ3NwbGl0LWRpZmY6bmV4dC1kaWZmJzogPT5cbiAgICAgICAgaWYgQGlzRW5hYmxlZFxuICAgICAgICAgIEBuZXh0RGlmZigpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAZGlmZlBhbmVzKClcbiAgICAgICdzcGxpdC1kaWZmOnByZXYtZGlmZic6ID0+XG4gICAgICAgIGlmIEBpc0VuYWJsZWRcbiAgICAgICAgICBAcHJldkRpZmYoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGRpZmZQYW5lcygpXG4gICAgICAnc3BsaXQtZGlmZjpjb3B5LXRvLXJpZ2h0JzogPT5cbiAgICAgICAgaWYgQGlzRW5hYmxlZFxuICAgICAgICAgIEBjb3B5VG9SaWdodCgpXG4gICAgICAnc3BsaXQtZGlmZjpjb3B5LXRvLWxlZnQnOiA9PlxuICAgICAgICBpZiBAaXNFbmFibGVkXG4gICAgICAgICAgQGNvcHlUb0xlZnQoKVxuICAgICAgJ3NwbGl0LWRpZmY6ZGlzYWJsZSc6ID0+IEBkaXNhYmxlKClcbiAgICAgICdzcGxpdC1kaWZmOnNldC1pZ25vcmUtd2hpdGVzcGFjZSc6ID0+IEB0b2dnbGVJZ25vcmVXaGl0ZXNwYWNlKClcbiAgICAgICdzcGxpdC1kaWZmOnNldC1hdXRvLWRpZmYnOiA9PiBAdG9nZ2xlQXV0b0RpZmYoKVxuICAgICAgJ3NwbGl0LWRpZmY6dG9nZ2xlJzogPT4gQHRvZ2dsZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZGlzYWJsZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgIyBjYWxsZWQgYnkgXCJ0b2dnbGVcIiBjb21tYW5kXG4gICMgdG9nZ2xlcyBzcGxpdCBkaWZmXG4gIHRvZ2dsZTogKCkgLT5cbiAgICBpZiBAaXNFbmFibGVkXG4gICAgICBAZGlzYWJsZSgpXG4gICAgZWxzZVxuICAgICAgQGRpZmZQYW5lcygpXG5cbiAgIyBjYWxsZWQgYnkgXCJEaXNhYmxlXCIgY29tbWFuZFxuICAjIHJlbW92ZXMgZGlmZiBhbmQgc3luYyBzY3JvbGwsIGRpc3Bvc2VzIG9mIHN1YnNjcmlwdGlvbnNcbiAgZGlzYWJsZTogKCkgLT5cbiAgICBAaXNFbmFibGVkID0gZmFsc2VcblxuICAgICMgcmVtb3ZlIGxpc3RlbmVyc1xuICAgIGlmIEBlZGl0b3JTdWJzY3JpcHRpb25zP1xuICAgICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICBpZiBAY29udGV4dE1lbnVTdWJzY3JpcHRpb25zP1xuICAgICAgQGNvbnRleHRNZW51U3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIEBjb250ZXh0TWVudVN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgaWYgQGxpbmVFbmRpbmdTdWJzY3JpcHRpb24/XG4gICAgICBAbGluZUVuZGluZ1N1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIEBsaW5lRW5kaW5nU3Vic2NyaXB0aW9uID0gbnVsbFxuXG4gICAgaWYgQGRpZmZWaWV3P1xuICAgICAgaWYgQHdhc0VkaXRvcjFDcmVhdGVkXG4gICAgICAgIEBkaWZmVmlldy5jbGVhblVwRWRpdG9yKDEpXG4gICAgICBlbHNlIGlmIEB3YXNFZGl0b3IxU29mdFdyYXBwZWRcbiAgICAgICAgQGRpZmZWaWV3LnJlc3RvcmVFZGl0b3JTb2Z0V3JhcCgxKVxuICAgICAgaWYgQHdhc0VkaXRvcjJDcmVhdGVkXG4gICAgICAgIEBkaWZmVmlldy5jbGVhblVwRWRpdG9yKDIpXG4gICAgICBlbHNlIGlmIEB3YXNFZGl0b3IyU29mdFdyYXBwZWRcbiAgICAgICAgQGRpZmZWaWV3LnJlc3RvcmVFZGl0b3JTb2Z0V3JhcCgyKVxuICAgICAgQGRpZmZWaWV3LmRlc3Ryb3koKVxuICAgICAgQGRpZmZWaWV3ID0gbnVsbFxuXG4gICAgIyByZW1vdmUgdmlld3NcbiAgICBpZiBAZm9vdGVyVmlldz9cbiAgICAgIEBmb290ZXJWaWV3LmRlc3Ryb3koKVxuICAgICAgQGZvb3RlclZpZXcgPSBudWxsXG5cbiAgICBpZiBAc3luY1Njcm9sbD9cbiAgICAgIEBzeW5jU2Nyb2xsLmRpc3Bvc2UoKVxuICAgICAgQHN5bmNTY3JvbGwgPSBudWxsXG5cbiAgICAjIGF1dG8gaGlkZSB0cmVlIHZpZXcgd2hpbGUgZGlmZmluZyAjODJcbiAgICBoaWRlRG9ja3MgPSBAb3B0aW9ucy5oaWRlRG9ja3MgPyBAX2dldENvbmZpZygnaGlkZURvY2tzJylcbiAgICBpZiBoaWRlRG9ja3NcbiAgICAgIGlmIEBkb2Nrc1RvUmVvcGVuLmxlZnRcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0TGVmdERvY2soKS5zaG93KClcbiAgICAgIGlmIEBkb2Nrc1RvUmVvcGVuLnJpZ2h0XG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldFJpZ2h0RG9jaygpLnNob3coKVxuICAgICAgaWYgQGRvY2tzVG9SZW9wZW4uYm90dG9tXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldEJvdHRvbURvY2soKS5zaG93KClcblxuICAgICMgcmVzZXQgYWxsIHZhcmlhYmxlc1xuICAgIEBkb2Nrc1RvUmVvcGVuID0ge2xlZnQ6IGZhbHNlLCByaWdodDogZmFsc2UsIGJvdHRvbTogZmFsc2V9XG4gICAgQHdhc0VkaXRvcjFDcmVhdGVkID0gZmFsc2VcbiAgICBAd2FzRWRpdG9yMkNyZWF0ZWQgPSBmYWxzZVxuICAgIEB3YXNFZGl0b3IxU29mdFdyYXBwZWQgPSBmYWxzZVxuICAgIEB3YXNFZGl0b3IyU29mdFdyYXBwZWQgPSBmYWxzZVxuICAgIEBoYXNHaXRSZXBvID0gZmFsc2VcblxuICAjIGNhbGxlZCBieSBcImlnbm9yZSB3aGl0ZXNwYWNlIHRvZ2dsZVwiIGNvbW1hbmRcbiAgdG9nZ2xlSWdub3JlV2hpdGVzcGFjZTogLT5cbiAgICAjIGlmIGlnbm9yZVdoaXRlc3BhY2UgaXMgbm90IGJlaW5nIG92ZXJyaWRkZW5cbiAgICBpZiAhKEBvcHRpb25zLmlnbm9yZVdoaXRlc3BhY2U/KVxuICAgICAgaWdub3JlV2hpdGVzcGFjZSA9IEBfZ2V0Q29uZmlnKCdpZ25vcmVXaGl0ZXNwYWNlJylcbiAgICAgIEBfc2V0Q29uZmlnKCdpZ25vcmVXaGl0ZXNwYWNlJywgIWlnbm9yZVdoaXRlc3BhY2UpXG4gICAgICBAZm9vdGVyVmlldz8uc2V0SWdub3JlV2hpdGVzcGFjZSghaWdub3JlV2hpdGVzcGFjZSlcblxuICAjIGNhbGxlZCBieSBcImF1dG8gZGlmZiB0b2dnbGVcIiBjb21tYW5kXG4gIHRvZ2dsZUF1dG9EaWZmOiAtPlxuICAgICMgaWYgaWdub3JlV2hpdGVzcGFjZSBpcyBub3QgYmVpbmcgb3ZlcnJpZGRlblxuICAgIGlmICEoQG9wdGlvbnMuYXV0b0RpZmY/KVxuICAgICAgYXV0b0RpZmYgPSBAX2dldENvbmZpZygnYXV0b0RpZmYnKVxuICAgICAgQF9zZXRDb25maWcoJ2F1dG9EaWZmJywgIWF1dG9EaWZmKVxuICAgICAgQGZvb3RlclZpZXc/LnNldEF1dG9EaWZmKCFhdXRvRGlmZilcblxuICAjIGNhbGxlZCBieSBcIk1vdmUgdG8gbmV4dCBkaWZmXCIgY29tbWFuZFxuICBuZXh0RGlmZjogLT5cbiAgICBpZiBAZGlmZlZpZXc/XG4gICAgICBpc1N5bmNTY3JvbGxFbmFibGVkID0gZmFsc2VcbiAgICAgIHNjcm9sbFN5bmNUeXBlID0gQG9wdGlvbnMuc2Nyb2xsU3luY1R5cGUgPyBAX2dldENvbmZpZygnc2Nyb2xsU3luY1R5cGUnKVxuICAgICAgaWYgc2Nyb2xsU3luY1R5cGUgPT0gJ1ZlcnRpY2FsICsgSG9yaXpvbnRhbCcgfHwgc2Nyb2xsU3luY1R5cGUgPT0gJ1ZlcnRpY2FsJ1xuICAgICAgICBpc1N5bmNTY3JvbGxFbmFibGVkID0gdHJ1ZVxuICAgICAgc2VsZWN0ZWRJbmRleCA9IEBkaWZmVmlldy5uZXh0RGlmZihpc1N5bmNTY3JvbGxFbmFibGVkKVxuICAgICAgQGZvb3RlclZpZXc/LnNob3dTZWxlY3Rpb25Db3VudCggc2VsZWN0ZWRJbmRleCArIDEgKVxuXG4gICMgY2FsbGVkIGJ5IFwiTW92ZSB0byBwcmV2aW91cyBkaWZmXCIgY29tbWFuZFxuICBwcmV2RGlmZjogLT5cbiAgICBpZiBAZGlmZlZpZXc/XG4gICAgICBpc1N5bmNTY3JvbGxFbmFibGVkID0gZmFsc2VcbiAgICAgIHNjcm9sbFN5bmNUeXBlID0gQG9wdGlvbnMuc2Nyb2xsU3luY1R5cGUgPyBAX2dldENvbmZpZygnc2Nyb2xsU3luY1R5cGUnKVxuICAgICAgaWYgc2Nyb2xsU3luY1R5cGUgPT0gJ1ZlcnRpY2FsICsgSG9yaXpvbnRhbCcgfHwgc2Nyb2xsU3luY1R5cGUgPT0gJ1ZlcnRpY2FsJ1xuICAgICAgICBpc1N5bmNTY3JvbGxFbmFibGVkID0gdHJ1ZVxuICAgICAgc2VsZWN0ZWRJbmRleCA9IEBkaWZmVmlldy5wcmV2RGlmZihpc1N5bmNTY3JvbGxFbmFibGVkKVxuICAgICAgQGZvb3RlclZpZXc/LnNob3dTZWxlY3Rpb25Db3VudCggc2VsZWN0ZWRJbmRleCArIDEgKVxuXG4gICMgY2FsbGVkIGJ5IFwiQ29weSB0byByaWdodFwiIGNvbW1hbmRcbiAgY29weVRvUmlnaHQ6IC0+XG4gICAgaWYgQGRpZmZWaWV3P1xuICAgICAgQGRpZmZWaWV3LmNvcHlUb1JpZ2h0KClcbiAgICAgIEBmb290ZXJWaWV3Py5oaWRlU2VsZWN0aW9uQ291bnQoKVxuXG4gICMgY2FsbGVkIGJ5IFwiQ29weSB0byBsZWZ0XCIgY29tbWFuZFxuICBjb3B5VG9MZWZ0OiAtPlxuICAgIGlmIEBkaWZmVmlldz9cbiAgICAgIEBkaWZmVmlldy5jb3B5VG9MZWZ0KClcbiAgICAgIEBmb290ZXJWaWV3Py5oaWRlU2VsZWN0aW9uQ291bnQoKVxuXG4gICMgY2FsbGVkIGJ5IHRoZSBjb21tYW5kcyBlbmFibGUvdG9nZ2xlIHRvIGRvIGluaXRpYWwgZGlmZlxuICAjIHNldHMgdXAgc3Vic2NyaXB0aW9ucyBmb3IgYXV0byBkaWZmIGFuZCBkaXNhYmxpbmcgd2hlbiBhIHBhbmUgaXMgZGVzdHJveWVkXG4gICMgZXZlbnQgaXMgYW4gb3B0aW9uYWwgYXJndW1lbnQgb2YgYSBmaWxlIHBhdGggdG8gZGlmZiB3aXRoIGN1cnJlbnRcbiAgIyBlZGl0b3JzUHJvbWlzZSBpcyBhbiBvcHRpb25hbCBhcmd1bWVudCBvZiBhIHByb21pc2UgdGhhdCByZXR1cm5zIHdpdGggMiBlZGl0b3JzXG4gICMgb3B0aW9ucyBpcyBhbiBvcHRpb25hbCBhcmd1bWVudCB3aXRoIG9wdGlvbmFsIHByb3BlcnRpZXMgdGhhdCBhcmUgdXNlZCB0byBvdmVycmlkZSB1c2VyJ3Mgc2V0dGluZ3NcbiAgZGlmZlBhbmVzOiAoZXZlbnQsIGVkaXRvcnNQcm9taXNlLCBvcHRpb25zID0ge30pIC0+XG4gICAgQG9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICBpZiAhZWRpdG9yc1Byb21pc2VcbiAgICAgIGlmIGV2ZW50Py5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndGFiJykgfHwgZXZlbnQ/LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlJylcbiAgICAgICAgZWxlbVdpdGhQYXRoID0gZXZlbnQuY3VycmVudFRhcmdldC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wYXRoXScpXG4gICAgICAgIHBhcmFtcyA9IHt9XG5cbiAgICAgICAgaWYgZWxlbVdpdGhQYXRoXG4gICAgICAgICAgcGFyYW1zLnBhdGggPSBlbGVtV2l0aFBhdGguZGF0YXNldC5wYXRoXG4gICAgICAgIGVsc2UgaWYgZXZlbnQuY3VycmVudFRhcmdldC5pdGVtXG4gICAgICAgICAgcGFyYW1zLmVkaXRvciA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuaXRlbS5jb3B5KCkgIyBjb3B5IGhlcmUgc28gc3RpbGwgaGF2ZSBpdCBpZiBkaXNhYmxlIGNsb3NlcyBpdCAjMTI0XG5cbiAgICAgICAgQGRpc2FibGUoKSAjIG1ha2Ugc3VyZSB3ZSdyZSBpbiBhIGdvb2Qgc3RhcnRpbmcgc3RhdGVcbiAgICAgICAgZWRpdG9yc1Byb21pc2UgPSBAX2dldEVkaXRvcnNGb3JEaWZmV2l0aEFjdGl2ZShwYXJhbXMpXG4gICAgICBlbHNlXG4gICAgICAgIEBkaXNhYmxlKCkgIyBtYWtlIHN1cmUgd2UncmUgaW4gYSBnb29kIHN0YXJ0aW5nIHN0YXRlXG4gICAgICAgIGVkaXRvcnNQcm9taXNlID0gQF9nZXRFZGl0b3JzRm9yUXVpY2tEaWZmKClcbiAgICBlbHNlXG4gICAgICBAZGlzYWJsZSgpICMgbWFrZSBzdXJlIHdlJ3JlIGluIGEgZ29vZCBzdGFydGluZyBzdGF0ZVxuXG4gICAgZWRpdG9yc1Byb21pc2UudGhlbiAoKGVkaXRvcnMpIC0+XG4gICAgICBpZiBlZGl0b3JzID09IG51bGxcbiAgICAgICAgcmV0dXJuXG4gICAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgIEBfc2V0dXBWaXNpYmxlRWRpdG9ycyhlZGl0b3JzKVxuICAgICAgQGRpZmZWaWV3ID0gbmV3IERpZmZWaWV3KGVkaXRvcnMpXG5cbiAgICAgICMgYWRkIGxpc3RlbmVyc1xuICAgICAgQF9zZXR1cEVkaXRvclN1YnNjcmlwdGlvbnMoZWRpdG9ycylcblxuICAgICAgIyBhZGQgdGhlIGJvdHRvbSBVSSBwYW5lbFxuICAgICAgaWYgIUBmb290ZXJWaWV3P1xuICAgICAgICBpZ25vcmVXaGl0ZXNwYWNlID0gQG9wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSA/IEBfZ2V0Q29uZmlnKCdpZ25vcmVXaGl0ZXNwYWNlJylcbiAgICAgICAgYXV0b0RpZmYgPSBAb3B0aW9ucy5hdXRvRGlmZiA/IEBfZ2V0Q29uZmlnKCdhdXRvRGlmZicpXG4gICAgICAgIEBmb290ZXJWaWV3ID0gbmV3IEZvb3RlclZpZXcoaWdub3JlV2hpdGVzcGFjZSwgQG9wdGlvbnMuaWdub3JlV2hpdGVzcGFjZT8sIGF1dG9EaWZmLCBAb3B0aW9ucy5hdXRvRGlmZj8pXG4gICAgICAgIEBmb290ZXJWaWV3LmNyZWF0ZVBhbmVsKClcbiAgICAgIEBmb290ZXJWaWV3LnNob3coKVxuXG4gICAgICAjIGF1dG8gaGlkZSB0cmVlIHZpZXcgd2hpbGUgZGlmZmluZyAjODJcbiAgICAgIGhpZGVEb2NrcyA9IEBvcHRpb25zLmhpZGVEb2NrcyA/IEBfZ2V0Q29uZmlnKCdoaWRlRG9ja3MnKVxuICAgICAgaWYgaGlkZURvY2tzXG4gICAgICAgIEBkb2Nrc1RvUmVvcGVuLmxlZnQgPSBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaygpLmlzVmlzaWJsZSgpXG4gICAgICAgIEBkb2Nrc1RvUmVvcGVuLnJpZ2h0ID0gYXRvbS53b3Jrc3BhY2UuZ2V0UmlnaHREb2NrKCkuaXNWaXNpYmxlKClcbiAgICAgICAgQGRvY2tzVG9SZW9wZW4uYm90dG9tID0gYXRvbS53b3Jrc3BhY2UuZ2V0Qm90dG9tRG9jaygpLmlzVmlzaWJsZSgpXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldExlZnREb2NrKCkuaGlkZSgpXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldFJpZ2h0RG9jaygpLmhpZGUoKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21Eb2NrKCkuaGlkZSgpXG5cbiAgICAgICMgdXBkYXRlIGRpZmYgaWYgdGhlcmUgaXMgbm8gZ2l0IHJlcG8gKG5vIG9uY2hhbmdlIGZpcmVkKVxuICAgICAgaWYgIUBoYXNHaXRSZXBvXG4gICAgICAgIEB1cGRhdGVEaWZmKGVkaXRvcnMpXG5cbiAgICAgICMgYWRkIGFwcGxpY2F0aW9uIG1lbnUgaXRlbXNcbiAgICAgIEBjb250ZXh0TWVudVN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICBAY29udGV4dE1lbnVTdWJzY3JpcHRpb25zLmFkZCBhdG9tLm1lbnUuYWRkIFtcbiAgICAgICAge1xuICAgICAgICAgICdsYWJlbCc6ICdQYWNrYWdlcydcbiAgICAgICAgICAnc3VibWVudSc6IFtcbiAgICAgICAgICAgICdsYWJlbCc6ICdTcGxpdCBEaWZmJ1xuICAgICAgICAgICAgJ3N1Ym1lbnUnOiBbXG4gICAgICAgICAgICAgIHsgJ2xhYmVsJzogJ0lnbm9yZSBXaGl0ZXNwYWNlJywgJ2NvbW1hbmQnOiAnc3BsaXQtZGlmZjppZ25vcmUtd2hpdGVzcGFjZScgfVxuICAgICAgICAgICAgICB7ICdsYWJlbCc6ICdNb3ZlIHRvIE5leHQgRGlmZicsICdjb21tYW5kJzogJ3NwbGl0LWRpZmY6bmV4dC1kaWZmJyB9XG4gICAgICAgICAgICAgIHsgJ2xhYmVsJzogJ01vdmUgdG8gUHJldmlvdXMgRGlmZicsICdjb21tYW5kJzogJ3NwbGl0LWRpZmY6cHJldi1kaWZmJyB9XG4gICAgICAgICAgICAgIHsgJ2xhYmVsJzogJ0NvcHkgdG8gUmlnaHQnLCAnY29tbWFuZCc6ICdzcGxpdC1kaWZmOmNvcHktdG8tcmlnaHQnfVxuICAgICAgICAgICAgICB7ICdsYWJlbCc6ICdDb3B5IHRvIExlZnQnLCAnY29tbWFuZCc6ICdzcGxpdC1kaWZmOmNvcHktdG8tbGVmdCd9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgICBAY29udGV4dE1lbnVTdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbnRleHRNZW51LmFkZCB7XG4gICAgICAgICdhdG9tLXRleHQtZWRpdG9yJzogW3tcbiAgICAgICAgICAnbGFiZWwnOiAnU3BsaXQgRGlmZicsXG4gICAgICAgICAgJ3N1Ym1lbnUnOiBbXG4gICAgICAgICAgICB7ICdsYWJlbCc6ICdJZ25vcmUgV2hpdGVzcGFjZScsICdjb21tYW5kJzogJ3NwbGl0LWRpZmY6aWdub3JlLXdoaXRlc3BhY2UnIH1cbiAgICAgICAgICAgIHsgJ2xhYmVsJzogJ01vdmUgdG8gTmV4dCBEaWZmJywgJ2NvbW1hbmQnOiAnc3BsaXQtZGlmZjpuZXh0LWRpZmYnIH1cbiAgICAgICAgICAgIHsgJ2xhYmVsJzogJ01vdmUgdG8gUHJldmlvdXMgRGlmZicsICdjb21tYW5kJzogJ3NwbGl0LWRpZmY6cHJldi1kaWZmJyB9XG4gICAgICAgICAgICB7ICdsYWJlbCc6ICdDb3B5IHRvIFJpZ2h0JywgJ2NvbW1hbmQnOiAnc3BsaXQtZGlmZjpjb3B5LXRvLXJpZ2h0J31cbiAgICAgICAgICAgIHsgJ2xhYmVsJzogJ0NvcHkgdG8gTGVmdCcsICdjb21tYW5kJzogJ3NwbGl0LWRpZmY6Y29weS10by1sZWZ0J31cbiAgICAgICAgICBdXG4gICAgICAgIH1dXG4gICAgICB9XG4gICAgKS5iaW5kKHRoaXMpICMgbWFrZSBzdXJlIHRoZSBzY29wZSBpcyBjb3JyZWN0XG5cbiAgIyBjYWxsZWQgYnkgYm90aCBkaWZmUGFuZXMgYW5kIHRoZSBlZGl0b3Igc3Vic2NyaXB0aW9uIHRvIHVwZGF0ZSB0aGUgZGlmZlxuICB1cGRhdGVEaWZmOiAoZWRpdG9ycykgLT5cbiAgICBAaXNFbmFibGVkID0gdHJ1ZVxuXG4gICAgIyBpZiB0aGVyZSBpcyBhIGRpZmYgYmVpbmcgY29tcHV0ZWQgaW4gdGhlIGJhY2tncm91bmQsIGNhbmNlbCBpdFxuICAgIGlmIEBwcm9jZXNzP1xuICAgICAgQHByb2Nlc3Mua2lsbCgpXG4gICAgICBAcHJvY2VzcyA9IG51bGxcblxuICAgICMgZm9yY2Ugc29mdHdyYXAgdG8gYmUgb2ZmIGlmIGl0IHNvbWVob3cgdHVybmVkIGJhY2sgb24gIzE0M1xuICAgIHR1cm5PZmZTb2Z0V3JhcCA9IEBvcHRpb25zLnR1cm5PZmZTb2Z0V3JhcCA/IEBfZ2V0Q29uZmlnKCd0dXJuT2ZmU29mdFdyYXAnKVxuICAgIGlmIHR1cm5PZmZTb2Z0V3JhcFxuICAgICAgaWYgZWRpdG9ycy5lZGl0b3IxLmlzU29mdFdyYXBwZWQoKVxuICAgICAgICBlZGl0b3JzLmVkaXRvcjEuc2V0U29mdFdyYXBwZWQoZmFsc2UpXG4gICAgICBpZiBlZGl0b3JzLmVkaXRvcjIuaXNTb2Z0V3JhcHBlZCgpXG4gICAgICAgIGVkaXRvcnMuZWRpdG9yMi5zZXRTb2Z0V3JhcHBlZChmYWxzZSlcblxuICAgIGlnbm9yZVdoaXRlc3BhY2UgPSBAb3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlID8gQF9nZXRDb25maWcoJ2lnbm9yZVdoaXRlc3BhY2UnKVxuICAgIGVkaXRvclBhdGhzID0gQF9jcmVhdGVUZW1wRmlsZXMoZWRpdG9ycylcblxuICAgIEBmb290ZXJWaWV3Py5zZXRMb2FkaW5nKClcblxuICAgICMgLS0tIGtpY2sgb2ZmIGJhY2tncm91bmQgcHJvY2VzcyB0byBjb21wdXRlIGRpZmYgLS0tXG4gICAge0J1ZmZlcmVkTm9kZVByb2Nlc3N9ID0gcmVxdWlyZSAnYXRvbSdcbiAgICBjb21tYW5kID0gcGF0aC5yZXNvbHZlIF9fZGlybmFtZSwgXCIuL2NvbXB1dGUtZGlmZi5qc1wiXG4gICAgYXJncyA9IFtlZGl0b3JQYXRocy5lZGl0b3IxUGF0aCwgZWRpdG9yUGF0aHMuZWRpdG9yMlBhdGgsIGlnbm9yZVdoaXRlc3BhY2VdXG4gICAgdGhlT3V0cHV0ID0gJydcbiAgICBzdGRvdXQgPSAob3V0cHV0KSA9PlxuICAgICAgdGhlT3V0cHV0ID0gb3V0cHV0XG4gICAgICBjb21wdXRlZERpZmYgPSBKU09OLnBhcnNlKG91dHB1dClcbiAgICAgIEBwcm9jZXNzLmtpbGwoKVxuICAgICAgQHByb2Nlc3MgPSBudWxsXG4gICAgICBAX3Jlc3VtZVVwZGF0ZURpZmYoZWRpdG9ycywgY29tcHV0ZWREaWZmKVxuICAgIHN0ZGVyciA9IChlcnIpID0+XG4gICAgICB0aGVPdXRwdXQgPSBlcnJcbiAgICBleGl0ID0gKGNvZGUpID0+XG4gICAgICBpZiBjb2RlICE9IDBcbiAgICAgICAgY29uc29sZS5sb2coJ0J1ZmZlcmVkTm9kZVByb2Nlc3MgY29kZSB3YXMgJyArIGNvZGUpXG4gICAgICAgIGNvbnNvbGUubG9nKHRoZU91dHB1dClcbiAgICBAcHJvY2VzcyA9IG5ldyBCdWZmZXJlZE5vZGVQcm9jZXNzKHtjb21tYW5kLCBhcmdzLCBzdGRvdXQsIHN0ZGVyciwgZXhpdH0pXG4gICAgIyAtLS0ga2ljayBvZmYgYmFja2dyb3VuZCBwcm9jZXNzIHRvIGNvbXB1dGUgZGlmZiAtLS1cblxuICAjIHJlc3VtZXMgYWZ0ZXIgdGhlIGNvbXB1dGUgZGlmZiBwcm9jZXNzIHJldHVybnNcbiAgX3Jlc3VtZVVwZGF0ZURpZmY6IChlZGl0b3JzLCBjb21wdXRlZERpZmYpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBAZGlmZlZpZXc/XG5cbiAgICBAZGlmZlZpZXcuY2xlYXJEaWZmKClcbiAgICBpZiBAc3luY1Njcm9sbD9cbiAgICAgIEBzeW5jU2Nyb2xsLmRpc3Bvc2UoKVxuICAgICAgQHN5bmNTY3JvbGwgPSBudWxsXG5cbiAgICAjIGdyYWIgdGhlIHNldHRpbmdzIGZvciB0aGUgZGlmZlxuICAgIGFkZGVkQ29sb3JTaWRlID0gQG9wdGlvbnMuYWRkZWRDb2xvclNpZGUgPyBAX2dldENvbmZpZygnY29sb3JzLmFkZGVkQ29sb3JTaWRlJylcbiAgICBkaWZmV29yZHMgPSBAb3B0aW9ucy5kaWZmV29yZHMgPyBAX2dldENvbmZpZygnZGlmZldvcmRzJylcbiAgICBpZ25vcmVXaGl0ZXNwYWNlID0gQG9wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSA/IEBfZ2V0Q29uZmlnKCdpZ25vcmVXaGl0ZXNwYWNlJylcbiAgICBvdmVycmlkZVRoZW1lQ29sb3JzID0gQG9wdGlvbnMub3ZlcnJpZGVUaGVtZUNvbG9ycyA/IEBfZ2V0Q29uZmlnKCdjb2xvcnMub3ZlcnJpZGVUaGVtZUNvbG9ycycpXG5cbiAgICBAZGlmZlZpZXcuZGlzcGxheURpZmYoY29tcHV0ZWREaWZmLCBhZGRlZENvbG9yU2lkZSwgZGlmZldvcmRzLCBpZ25vcmVXaGl0ZXNwYWNlLCBvdmVycmlkZVRoZW1lQ29sb3JzKVxuXG4gICAgIyBnaXZlIHRoZSBtYXJrZXIgbGF5ZXJzIHRvIHRob3NlIHJlZ2lzdGVyZWQgd2l0aCB0aGUgc2VydmljZVxuICAgIHdoaWxlIEBzcGxpdERpZmZSZXNvbHZlcz8ubGVuZ3RoXG4gICAgICBAc3BsaXREaWZmUmVzb2x2ZXMucG9wKCkoQGRpZmZWaWV3LmdldE1hcmtlckxheWVycygpKVxuXG4gICAgQGZvb3RlclZpZXc/LnNldE51bURpZmZlcmVuY2VzKEBkaWZmVmlldy5nZXROdW1EaWZmZXJlbmNlcygpKVxuXG4gICAgc2Nyb2xsU3luY1R5cGUgPSBAb3B0aW9ucy5zY3JvbGxTeW5jVHlwZSA/IEBfZ2V0Q29uZmlnKCdzY3JvbGxTeW5jVHlwZScpXG4gICAgaWYgc2Nyb2xsU3luY1R5cGUgPT0gJ1ZlcnRpY2FsICsgSG9yaXpvbnRhbCdcbiAgICAgIEBzeW5jU2Nyb2xsID0gbmV3IFN5bmNTY3JvbGwoZWRpdG9ycy5lZGl0b3IxLCBlZGl0b3JzLmVkaXRvcjIsIHRydWUpXG4gICAgICBAc3luY1Njcm9sbC5zeW5jUG9zaXRpb25zKClcbiAgICBlbHNlIGlmIHNjcm9sbFN5bmNUeXBlID09ICdWZXJ0aWNhbCdcbiAgICAgIEBzeW5jU2Nyb2xsID0gbmV3IFN5bmNTY3JvbGwoZWRpdG9ycy5lZGl0b3IxLCBlZGl0b3JzLmVkaXRvcjIsIGZhbHNlKVxuICAgICAgQHN5bmNTY3JvbGwuc3luY1Bvc2l0aW9ucygpXG5cbiAgIyBHZXRzIHRoZSBmaXJzdCB0d28gdmlzaWJsZSBlZGl0b3JzIGZvdW5kIG9yIGNyZWF0ZXMgdGhlbSBhcyBuZWVkZWQuXG4gICMgUmV0dXJucyBhIFByb21pc2Ugd2hpY2ggeWllbGRzIGEgdmFsdWUgb2Yge2VkaXRvcjE6IFRleHRFZGl0b3IsIGVkaXRvcjI6IFRleHRFZGl0b3J9XG4gIF9nZXRFZGl0b3JzRm9yUXVpY2tEaWZmOiAoKSAtPlxuICAgIGVkaXRvcjEgPSBudWxsXG4gICAgZWRpdG9yMiA9IG51bGxcblxuICAgICMgdHJ5IHRvIGZpbmQgdGhlIGZpcnN0IHR3byBlZGl0b3JzXG4gICAgcGFuZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpXG4gICAgZm9yIHAgaW4gcGFuZXNcbiAgICAgIGFjdGl2ZUl0ZW0gPSBwLmdldEFjdGl2ZUl0ZW0oKVxuICAgICAgaWYgYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKGFjdGl2ZUl0ZW0pXG4gICAgICAgIGlmIGVkaXRvcjEgPT0gbnVsbFxuICAgICAgICAgIGVkaXRvcjEgPSBhY3RpdmVJdGVtXG4gICAgICAgIGVsc2UgaWYgZWRpdG9yMiA9PSBudWxsXG4gICAgICAgICAgZWRpdG9yMiA9IGFjdGl2ZUl0ZW1cbiAgICAgICAgICBicmVha1xuXG4gICAgIyBhdXRvIG9wZW4gZWRpdG9yIHBhbmVzIHNvIHdlIGhhdmUgdHdvIHRvIGRpZmYgd2l0aFxuICAgIGlmIGVkaXRvcjEgPT0gbnVsbFxuICAgICAgZWRpdG9yMSA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcih7YXV0b0hlaWdodDogZmFsc2V9KVxuICAgICAgQHdhc0VkaXRvcjFDcmVhdGVkID0gdHJ1ZVxuICAgICAgIyBhZGQgZmlyc3QgZWRpdG9yIHRvIHRoZSBmaXJzdCBwYW5lXG4gICAgICBwYW5lc1swXS5hZGRJdGVtKGVkaXRvcjEpXG4gICAgICBwYW5lc1swXS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICBpZiBlZGl0b3IyID09IG51bGxcbiAgICAgIGVkaXRvcjIgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3Ioe2F1dG9IZWlnaHQ6IGZhbHNlfSlcbiAgICAgIEB3YXNFZGl0b3IyQ3JlYXRlZCA9IHRydWVcbiAgICAgIHJpZ2h0UGFuZUluZGV4ID0gcGFuZXMuaW5kZXhPZihhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShlZGl0b3IxKSkgKyAxXG4gICAgICBpZiBwYW5lc1tyaWdodFBhbmVJbmRleF1cbiAgICAgICAgIyBhZGQgc2Vjb25kIGVkaXRvciB0byBleGlzdGluZyBwYW5lIHRvIHRoZSByaWdodCBvZiBmaXJzdCBlZGl0b3JcbiAgICAgICAgcGFuZXNbcmlnaHRQYW5lSW5kZXhdLmFkZEl0ZW0oZWRpdG9yMilcbiAgICAgICAgcGFuZXNbcmlnaHRQYW5lSW5kZXhdLmFjdGl2YXRlSXRlbShlZGl0b3IyKVxuICAgICAgZWxzZVxuICAgICAgICAjIG5vIGV4aXN0aW5nIHBhbmUgc28gc3BsaXQgcmlnaHRcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oZWRpdG9yMSkuc3BsaXRSaWdodCh7aXRlbXM6IFtlZGl0b3IyXX0pXG4gICAgICBlZGl0b3IyLmdldEJ1ZmZlcigpLnNldExhbmd1YWdlTW9kZShhdG9tLmdyYW1tYXJzLmxhbmd1YWdlTW9kZUZvckdyYW1tYXJBbmRCdWZmZXIoZWRpdG9yMS5nZXRHcmFtbWFyKCksIGVkaXRvcjIuZ2V0QnVmZmVyKCkpKVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7ZWRpdG9yMTogZWRpdG9yMSwgZWRpdG9yMjogZWRpdG9yMn0pXG5cbiAgIyBHZXRzIHRoZSBhY3RpdmUgZWRpdG9yIGFuZCBvcGVucyB0aGUgc3BlY2lmaWVkIGZpbGUgdG8gdGhlIHJpZ2h0IG9mIGl0XG4gICMgUmV0dXJucyBhIFByb21pc2Ugd2hpY2ggeWllbGRzIGEgdmFsdWUgb2Yge2VkaXRvcjE6IFRleHRFZGl0b3IsIGVkaXRvcjI6IFRleHRFZGl0b3J9XG4gIF9nZXRFZGl0b3JzRm9yRGlmZldpdGhBY3RpdmU6IChwYXJhbXMpIC0+XG4gICAgZmlsZVBhdGggPSBwYXJhbXMucGF0aFxuICAgIGVkaXRvcldpdGhvdXRQYXRoID0gcGFyYW1zLmVkaXRvclxuICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgaWYgYWN0aXZlRWRpdG9yP1xuICAgICAgZWRpdG9yMSA9IGFjdGl2ZUVkaXRvclxuICAgICAgQHdhc0VkaXRvcjJDcmVhdGVkID0gdHJ1ZVxuICAgICAgcGFuZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpXG4gICAgICAjIGdldCBpbmRleCBvZiBwYW5lIGZvbGxvd2luZyBhY3RpdmUgZWRpdG9yIHBhbmVcbiAgICAgIHJpZ2h0UGFuZUluZGV4ID0gcGFuZXMuaW5kZXhPZihhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShlZGl0b3IxKSkgKyAxXG4gICAgICAjIHBhbmUgaXMgY3JlYXRlZCBpZiB0aGVyZSBpcyBub3Qgb25lIHRvIHRoZSByaWdodCBvZiB0aGUgYWN0aXZlIGVkaXRvclxuICAgICAgcmlnaHRQYW5lID0gcGFuZXNbcmlnaHRQYW5lSW5kZXhdIHx8IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGVkaXRvcjEpLnNwbGl0UmlnaHQoKVxuXG4gICAgICBpZiBwYXJhbXMucGF0aFxuICAgICAgICBmaWxlUGF0aCA9IHBhcmFtcy5wYXRoXG4gICAgICAgIGlmIGVkaXRvcjEuZ2V0UGF0aCgpID09IGZpbGVQYXRoXG4gICAgICAgICAgIyBpZiBkaWZmaW5nIHdpdGggaXRzZWxmLCBzZXQgZmlsZVBhdGggdG8gbnVsbCBzbyBhbiBlbXB0eSBlZGl0b3IgaXNcbiAgICAgICAgICAjIG9wZW5lZCwgd2hpY2ggd2lsbCBjYXVzZSBhIGdpdCBkaWZmXG4gICAgICAgICAgZmlsZVBhdGggPSBudWxsXG4gICAgICAgIGVkaXRvcjJQcm9taXNlID0gYXRvbS53b3Jrc3BhY2Uub3BlblVSSUluUGFuZShmaWxlUGF0aCwgcmlnaHRQYW5lKVxuXG4gICAgICAgIHJldHVybiBlZGl0b3IyUHJvbWlzZS50aGVuIChlZGl0b3IyKSAtPlxuICAgICAgICAgIGVkaXRvcjIuZ2V0QnVmZmVyKCkuc2V0TGFuZ3VhZ2VNb2RlKGF0b20uZ3JhbW1hcnMubGFuZ3VhZ2VNb2RlRm9yR3JhbW1hckFuZEJ1ZmZlcihlZGl0b3IxLmdldEdyYW1tYXIoKSwgZWRpdG9yMi5nZXRCdWZmZXIoKSkpXG4gICAgICAgICAgcmV0dXJuIHtlZGl0b3IxOiBlZGl0b3IxLCBlZGl0b3IyOiBlZGl0b3IyfVxuICAgICAgZWxzZSBpZiBlZGl0b3JXaXRob3V0UGF0aFxuICAgICAgICByaWdodFBhbmUuYWRkSXRlbShlZGl0b3JXaXRob3V0UGF0aClcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7ZWRpdG9yMTogZWRpdG9yMSwgZWRpdG9yMjogZWRpdG9yV2l0aG91dFBhdGh9KVxuICAgIGVsc2VcbiAgICAgIG5vQWN0aXZlRWRpdG9yTXNnID0gJ05vIGFjdGl2ZSBmaWxlIGZvdW5kISAoVHJ5IGZvY3VzaW5nIGEgdGV4dCBlZGl0b3IpJ1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1NwbGl0IERpZmYnLCB7ZGV0YWlsOiBub0FjdGl2ZUVkaXRvck1zZywgZGlzbWlzc2FibGU6IGZhbHNlLCBpY29uOiAnZGlmZid9KVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKVxuXG4gICMgc2V0cyB1cCBhbnkgZWRpdG9yIGxpc3RlbmVyc1xuICBfc2V0dXBFZGl0b3JTdWJzY3JpcHRpb25zOiAoZWRpdG9ycykgLT5cbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMgPSBudWxsXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAjIGFkZCBsaXN0ZW5lcnNcbiAgICBhdXRvRGlmZiA9IEBvcHRpb25zLmF1dG9EaWZmID8gQF9nZXRDb25maWcoJ2F1dG9EaWZmJylcbiAgICBpZiBhdXRvRGlmZlxuICAgICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvcnMuZWRpdG9yMS5vbkRpZFN0b3BDaGFuZ2luZyA9PlxuICAgICAgICBAdXBkYXRlRGlmZihlZGl0b3JzKVxuICAgICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvcnMuZWRpdG9yMi5vbkRpZFN0b3BDaGFuZ2luZyA9PlxuICAgICAgICBAdXBkYXRlRGlmZihlZGl0b3JzKVxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBlZGl0b3JzLmVkaXRvcjEub25EaWREZXN0cm95ID0+XG4gICAgICBAZGlzYWJsZSgpXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvcnMuZWRpdG9yMi5vbkRpZERlc3Ryb3kgPT5cbiAgICAgIEBkaXNhYmxlKClcbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3NwbGl0LWRpZmYnLCAoZXZlbnQpID0+XG4gICAgICAjIG5lZWQgdG8gcmVkbyBlZGl0b3Igc3Vic2NyaXB0aW9ucyBiZWNhdXNlIHNvbWUgc2V0dGluZ3MgYWZmZWN0IHRoZSBsaXN0ZW5lcnMgdGhlbXNlbHZlc1xuICAgICAgQF9zZXR1cEVkaXRvclN1YnNjcmlwdGlvbnMoZWRpdG9ycylcblxuICAgICAgIyB1cGRhdGUgZm9vdGVyIHZpZXcgaWdub3JlIHdoaXRlc3BhY2UgY2hlY2tib3ggaWYgc2V0dGluZyBoYXMgY2hhbmdlZFxuICAgICAgaWYgZXZlbnQubmV3VmFsdWUuaWdub3JlV2hpdGVzcGFjZSAhPSBldmVudC5vbGRWYWx1ZS5pZ25vcmVXaGl0ZXNwYWNlXG4gICAgICAgIEBmb290ZXJWaWV3Py5zZXRJZ25vcmVXaGl0ZXNwYWNlKGV2ZW50Lm5ld1ZhbHVlLmlnbm9yZVdoaXRlc3BhY2UpXG4gICAgICBpZiBldmVudC5uZXdWYWx1ZS5hdXRvRGlmZiAhPSBldmVudC5vbGRWYWx1ZS5hdXRvRGlmZlxuICAgICAgICBAZm9vdGVyVmlldz8uc2V0QXV0b0RpZmYoZXZlbnQubmV3VmFsdWUuYXV0b0RpZmYpXG5cbiAgICAgIEB1cGRhdGVEaWZmKGVkaXRvcnMpXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvcnMuZWRpdG9yMS5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uIChldmVudCkgPT5cbiAgICAgIEBkaWZmVmlldy5oYW5kbGVDdXJzb3JDaGFuZ2UoZXZlbnQuY3Vyc29yLCBldmVudC5vbGRCdWZmZXJQb3NpdGlvbiwgZXZlbnQubmV3QnVmZmVyUG9zaXRpb24pXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvcnMuZWRpdG9yMi5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uIChldmVudCkgPT5cbiAgICAgIEBkaWZmVmlldy5oYW5kbGVDdXJzb3JDaGFuZ2UoZXZlbnQuY3Vyc29yLCBldmVudC5vbGRCdWZmZXJQb3NpdGlvbiwgZXZlbnQubmV3QnVmZmVyUG9zaXRpb24pXG4gICAgQGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvcnMuZWRpdG9yMS5vbkRpZEFkZEN1cnNvciAoY3Vyc29yKSA9PlxuICAgICAgQGRpZmZWaWV3LmhhbmRsZUN1cnNvckNoYW5nZShjdXJzb3IsIC0xLCBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9ycy5lZGl0b3IyLm9uRGlkQWRkQ3Vyc29yIChjdXJzb3IpID0+XG4gICAgICBAZGlmZlZpZXcuaGFuZGxlQ3Vyc29yQ2hhbmdlKGN1cnNvciwgLTEsIGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpKVxuXG4gIF9zZXR1cFZpc2libGVFZGl0b3JzOiAoZWRpdG9ycykgLT5cbiAgICBCdWZmZXJFeHRlbmRlciA9IHJlcXVpcmUgJy4vYnVmZmVyLWV4dGVuZGVyJ1xuICAgIGJ1ZmZlcjFMaW5lRW5kaW5nID0gKG5ldyBCdWZmZXJFeHRlbmRlcihlZGl0b3JzLmVkaXRvcjEuZ2V0QnVmZmVyKCkpKS5nZXRMaW5lRW5kaW5nKClcblxuICAgIGlmIEB3YXNFZGl0b3IyQ3JlYXRlZFxuICAgICAgIyB3YW50IHRvIHNjcm9sbCBhIG5ld2x5IGNyZWF0ZWQgZWRpdG9yIHRvIHRoZSBmaXJzdCBlZGl0b3IncyBwb3NpdGlvblxuICAgICAgYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcnMuZWRpdG9yMSkuZm9jdXMoKVxuICAgICAgIyBzZXQgdGhlIHByZWZlcnJlZCBsaW5lIGVuZGluZyBiZWZvcmUgaW5zZXJ0aW5nIHRleHQgIzM5XG4gICAgICBpZiBidWZmZXIxTGluZUVuZGluZyA9PSAnXFxuJyB8fCBidWZmZXIxTGluZUVuZGluZyA9PSAnXFxyXFxuJ1xuICAgICAgICBAbGluZUVuZGluZ1N1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgICAgQGxpbmVFbmRpbmdTdWJzY3JpcHRpb24uYWRkIGVkaXRvcnMuZWRpdG9yMi5vbldpbGxJbnNlcnRUZXh0ICgpIC0+XG4gICAgICAgICAgZWRpdG9ycy5lZGl0b3IyLmdldEJ1ZmZlcigpLnNldFByZWZlcnJlZExpbmVFbmRpbmcoYnVmZmVyMUxpbmVFbmRpbmcpXG5cbiAgICBAX3NldHVwR2l0UmVwbyhlZGl0b3JzKVxuXG4gICAgIyB1bmZvbGQgYWxsIGxpbmVzIHNvIGRpZmZzIHByb3Blcmx5IGFsaWduXG4gICAgZWRpdG9ycy5lZGl0b3IxLnVuZm9sZEFsbCgpXG4gICAgZWRpdG9ycy5lZGl0b3IyLnVuZm9sZEFsbCgpXG5cbiAgICBtdXRlTm90aWZpY2F0aW9ucyA9IEBvcHRpb25zLm11dGVOb3RpZmljYXRpb25zID8gQF9nZXRDb25maWcoJ211dGVOb3RpZmljYXRpb25zJylcbiAgICB0dXJuT2ZmU29mdFdyYXAgPSBAb3B0aW9ucy50dXJuT2ZmU29mdFdyYXAgPyBAX2dldENvbmZpZygndHVybk9mZlNvZnRXcmFwJylcbiAgICBpZiB0dXJuT2ZmU29mdFdyYXBcbiAgICAgIHNob3VsZE5vdGlmeSA9IGZhbHNlXG4gICAgICBpZiBlZGl0b3JzLmVkaXRvcjEuaXNTb2Z0V3JhcHBlZCgpXG4gICAgICAgIEB3YXNFZGl0b3IxU29mdFdyYXBwZWQgPSB0cnVlXG4gICAgICAgIGVkaXRvcnMuZWRpdG9yMS5zZXRTb2Z0V3JhcHBlZChmYWxzZSlcbiAgICAgICAgc2hvdWxkTm90aWZ5ID0gdHJ1ZVxuICAgICAgaWYgZWRpdG9ycy5lZGl0b3IyLmlzU29mdFdyYXBwZWQoKVxuICAgICAgICBAd2FzRWRpdG9yMlNvZnRXcmFwcGVkID0gdHJ1ZVxuICAgICAgICBlZGl0b3JzLmVkaXRvcjIuc2V0U29mdFdyYXBwZWQoZmFsc2UpXG4gICAgICAgIHNob3VsZE5vdGlmeSA9IHRydWVcbiAgICAgIGlmIHNob3VsZE5vdGlmeSAmJiAhbXV0ZU5vdGlmaWNhdGlvbnNcbiAgICAgICAgc29mdFdyYXBNc2cgPSAnU29mdCB3cmFwIGF1dG9tYXRpY2FsbHkgZGlzYWJsZWQgc28gbGluZXMgcmVtYWluIGluIHN5bmMuJ1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnU3BsaXQgRGlmZicsIHtkZXRhaWw6IHNvZnRXcmFwTXNnLCBkaXNtaXNzYWJsZTogZmFsc2UsIGljb246ICdkaWZmJ30pXG4gICAgZWxzZSBpZiAhbXV0ZU5vdGlmaWNhdGlvbnMgJiYgKGVkaXRvcnMuZWRpdG9yMS5pc1NvZnRXcmFwcGVkKCkgfHwgZWRpdG9ycy5lZGl0b3IyLmlzU29mdFdyYXBwZWQoKSlcbiAgICAgIHNvZnRXcmFwTXNnID0gJ1dhcm5pbmc6IFNvZnQgd3JhcCBlbmFibGVkISBMaW5lcyBtYXkgbm90IGFsaWduLlxcbihUcnkgXCJUdXJuIE9mZiBTb2Z0IFdyYXBcIiBzZXR0aW5nKSdcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdTcGxpdCBEaWZmJywge2RldGFpbDogc29mdFdyYXBNc2csIGRpc21pc3NhYmxlOiBmYWxzZSwgaWNvbjogJ2RpZmYnfSlcblxuICAgIGJ1ZmZlcjJMaW5lRW5kaW5nID0gKG5ldyBCdWZmZXJFeHRlbmRlcihlZGl0b3JzLmVkaXRvcjIuZ2V0QnVmZmVyKCkpKS5nZXRMaW5lRW5kaW5nKClcbiAgICBpZiBidWZmZXIyTGluZUVuZGluZyAhPSAnJyAmJiAoYnVmZmVyMUxpbmVFbmRpbmcgIT0gYnVmZmVyMkxpbmVFbmRpbmcpICYmIGVkaXRvcnMuZWRpdG9yMS5nZXRMaW5lQ291bnQoKSAhPSAxICYmIGVkaXRvcnMuZWRpdG9yMi5nZXRMaW5lQ291bnQoKSAhPSAxICYmICFtdXRlTm90aWZpY2F0aW9uc1xuICAgICAgIyBwb3Agd2FybmluZyBpZiB0aGUgbGluZSBlbmRpbmdzIGRpZmZlciBhbmQgd2UgaGF2ZW4ndCBkb25lIGFueXRoaW5nIGFib3V0IGl0XG4gICAgICBsaW5lRW5kaW5nTXNnID0gJ1dhcm5pbmc6IExpbmUgZW5kaW5ncyBkaWZmZXIhJ1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1NwbGl0IERpZmYnLCB7ZGV0YWlsOiBsaW5lRW5kaW5nTXNnLCBkaXNtaXNzYWJsZTogZmFsc2UsIGljb246ICdkaWZmJ30pXG5cbiAgX3NldHVwR2l0UmVwbzogKGVkaXRvcnMpIC0+XG4gICAgZWRpdG9yMVBhdGggPSBlZGl0b3JzLmVkaXRvcjEuZ2V0UGF0aCgpXG4gICAgIyBvbmx5IHNob3cgZ2l0IGNoYW5nZXMgaWYgdGhlIHJpZ2h0IGVkaXRvciBpcyBlbXB0eVxuICAgIGlmIGVkaXRvcjFQYXRoPyAmJiAoZWRpdG9ycy5lZGl0b3IyLmdldExpbmVDb3VudCgpID09IDEgJiYgZWRpdG9ycy5lZGl0b3IyLmxpbmVUZXh0Rm9yQnVmZmVyUm93KDApID09ICcnKVxuICAgICAgZm9yIGRpcmVjdG9yeSwgaSBpbiBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVxuICAgICAgICBpZiBlZGl0b3IxUGF0aCBpcyBkaXJlY3RvcnkuZ2V0UGF0aCgpIG9yIGRpcmVjdG9yeS5jb250YWlucyhlZGl0b3IxUGF0aClcbiAgICAgICAgICBwcm9qZWN0UmVwbyA9IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKVtpXVxuICAgICAgICAgIGlmIHByb2plY3RSZXBvP1xuICAgICAgICAgICAgcHJvamVjdFJlcG8gPSBwcm9qZWN0UmVwby5nZXRSZXBvKGVkaXRvcjFQYXRoKSAjIGZpeCByZXBvIGZvciBzdWJtb2R1bGVzICMxMTJcbiAgICAgICAgICAgIHJlbGF0aXZlRWRpdG9yMVBhdGggPSBwcm9qZWN0UmVwby5yZWxhdGl2aXplKGVkaXRvcjFQYXRoKVxuICAgICAgICAgICAgZ2l0SGVhZFRleHQgPSBwcm9qZWN0UmVwby5nZXRIZWFkQmxvYihyZWxhdGl2ZUVkaXRvcjFQYXRoKVxuICAgICAgICAgICAgaWYgZ2l0SGVhZFRleHQ/XG4gICAgICAgICAgICAgIGVkaXRvcnMuZWRpdG9yMi5zZWxlY3RBbGwoKVxuICAgICAgICAgICAgICBlZGl0b3JzLmVkaXRvcjIuaW5zZXJ0VGV4dChnaXRIZWFkVGV4dClcbiAgICAgICAgICAgICAgQGhhc0dpdFJlcG8gPSB0cnVlXG4gICAgICAgICAgICAgIGJyZWFrXG5cbiAgIyBjcmVhdGVzIHRlbXAgZmlsZXMgc28gdGhlIGNvbXB1dGUgZGlmZiBwcm9jZXNzIGNhbiBnZXQgdGhlIHRleHQgZWFzaWx5XG4gIF9jcmVhdGVUZW1wRmlsZXM6IChlZGl0b3JzKSAtPlxuICAgIGVkaXRvcjFQYXRoID0gJydcbiAgICBlZGl0b3IyUGF0aCA9ICcnXG4gICAgdGVtcEZvbGRlclBhdGggPSBhdG9tLmdldENvbmZpZ0RpclBhdGgoKSArICcvc3BsaXQtZGlmZidcblxuICAgIGVkaXRvcjFQYXRoID0gdGVtcEZvbGRlclBhdGggKyAnL3NwbGl0LWRpZmYgMSdcbiAgICBlZGl0b3IxVGVtcEZpbGUgPSBuZXcgRmlsZShlZGl0b3IxUGF0aClcbiAgICBlZGl0b3IxVGVtcEZpbGUud3JpdGVTeW5jKGVkaXRvcnMuZWRpdG9yMS5nZXRUZXh0KCkpXG5cbiAgICBlZGl0b3IyUGF0aCA9IHRlbXBGb2xkZXJQYXRoICsgJy9zcGxpdC1kaWZmIDInXG4gICAgZWRpdG9yMlRlbXBGaWxlID0gbmV3IEZpbGUoZWRpdG9yMlBhdGgpXG4gICAgZWRpdG9yMlRlbXBGaWxlLndyaXRlU3luYyhlZGl0b3JzLmVkaXRvcjIuZ2V0VGV4dCgpKVxuXG4gICAgZWRpdG9yUGF0aHMgPVxuICAgICAgZWRpdG9yMVBhdGg6IGVkaXRvcjFQYXRoXG4gICAgICBlZGl0b3IyUGF0aDogZWRpdG9yMlBhdGhcblxuICAgIHJldHVybiBlZGl0b3JQYXRoc1xuXG5cbiAgX2dldENvbmZpZzogKGNvbmZpZykgLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoXCJzcGxpdC1kaWZmLiN7Y29uZmlnfVwiKVxuXG4gIF9zZXRDb25maWc6IChjb25maWcsIHZhbHVlKSAtPlxuICAgIGF0b20uY29uZmlnLnNldChcInNwbGl0LWRpZmYuI3tjb25maWd9XCIsIHZhbHVlKVxuXG5cbiAgIyAtLS0gU0VSVklDRSBBUEkgLS0tXG4gIGdldE1hcmtlckxheWVyczogKCkgLT5cbiAgICBuZXcgUHJvbWlzZSAoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIEBzcGxpdERpZmZSZXNvbHZlcy5wdXNoKHJlc29sdmUpXG4gICAgKS5iaW5kKHRoaXMpXG5cbiAgZGlmZkVkaXRvcnM6IChlZGl0b3IxLCBlZGl0b3IyLCBvcHRpb25zKSAtPlxuICAgIEBkaWZmUGFuZXMobnVsbCwgUHJvbWlzZS5yZXNvbHZlKHtlZGl0b3IxOiBlZGl0b3IxLCBlZGl0b3IyOiBlZGl0b3IyfSksIG9wdGlvbnMpXG5cbiAgcHJvdmlkZVNwbGl0RGlmZjogLT5cbiAgICBnZXRNYXJrZXJMYXllcnM6IEBnZXRNYXJrZXJMYXllcnMuYmluZChAY29udGV4dEZvclNlcnZpY2UpXG4gICAgZGlmZkVkaXRvcnM6IEBkaWZmRWRpdG9ycy5iaW5kKEBjb250ZXh0Rm9yU2VydmljZSlcbiAgICBkaXNhYmxlOiBAZGlzYWJsZS5iaW5kKEBjb250ZXh0Rm9yU2VydmljZSlcbiJdfQ==
