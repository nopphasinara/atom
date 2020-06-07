const customAutoTextItems = [
  {
    id: 1,
    text: 'xn--82ce5arg8cm8f1bf5a5ive.com',
  },
  {
    id: 2,
    text: 'โต๊ะจีนชลบุรี',
  },
];
const _ = require('underscore-plus');
const path = require('path');
const fs = require('fs-plus');
const electron = require('electron');
const {
  BrowserWindow,
  Menu,
  app,
  clipboard,
  dialog,
  ipcMain,
  shell,
  screen,
} = require('electron');

function mergeObject(obj, source) {
  if (source && Object.getOwnPropertyNames(source).length > 0) {
    for (key of Object.keys(source)) {
      obj[key] = source[key];
    }
  }

  return obj;
}


function getMethods(obj, options = {}) {
  if (options.returnAs && options.returnAs.toLowerCase() != 'array') {
    options.returnAs = 'string';
  }

  options = mergeObject({
    returnAs: 'string',
  }, options);

  var obj = atom.workspace.getActiveTextEditor();
  var objPrototypes = getObjectPrototypes(obj);
  if (obj = objPrototypes) {
    var properties = [];
    var objPropertyNames = getObjectPropertyNames(obj);
    objPropertyNames.map(function (item, index) {
      properties.push(item);
    });
    properties.sort();
  }

  if (options.returnAs == 'string') {
    return properties.join('\n');
  }
  return properties;

  var properties = [];
  var currentObj = obj;
  if (currentObj == Object.getPrototypeOf(currentObj)) {
    Object.getOwnPropertyNames(currentObj).map(function(item, key) {
      properties.push(item);
    });

    var filtered = properties.filter(function(item, key) {
      return (typeof obj[item] == 'function');
    });

    if (filtered.length > 0) {
      if (options.returnAs == 'string') {
        return filtered.join(', ');
      } else {
        return filtered;
      }
    }
  }
}


function getOptions(options) {
  var options = mergeObject({
    select: true,
    skip: false,
    undo: '',
    useSnippet: false,
  }, options);

  return options;
}


function mutateSelectedText(selections, options) {
  var options = mergeObject({
    select: true,
    skip: false,
    undo: '',
    useSnippet: false,
  }, options);

  for (var selection in selections) {
    if (selections.hasOwnProperty(selection)) {
      options.selectedText = selectedText = selection.getText();
      selection.retainSelection = true;
      selection.plantTail();

      var insertText = "/*{{replacement}}*/";
      insertText = insertText.replace("{{replacement}}", "#{selectedText}");
      selection.insertText(insertText, options);

      selection.retainSelection = false;
    }
  }
}


function getObjectPrototypes(obj) {
  return Object.getPrototypeOf(obj);
}

function getObjectPropertyNames(obj) {
  return Object.getOwnPropertyNames(obj);
}


class Data {

  constructor() {
    console.clear();

    this.e = atom.workspace.getActiveTextEditor();

    this.registerCommands();
  }

  registerCommands() {

    // var a = atom;
    // var w = atom.workspace;
    // var e = atom.workspace.getActiveTextEditor();
    // var remoteSync = atom.packages.getActivePackage('remote-sync');

    // w.panelContainers.modal.onDidAddPanel(() => {
    //   console.log('OK');
    //
    //   w.didActivatePaneContainer(() => {
    //     console.log('didActivatePaneContainer', this);
    //   });
    // });

    // atom.workspace.panelContainers.modal.onDidAddPanel((panel = null) => {
    //   atom.commands.add('.remote-sync', 'panel:xxx', () => {
    //     const editor = atom.workspace.getActiveTextEditor();
    //     console.log(editor);
    //     // editor.focusNext();
    //     atom.commands.dispatch(atom.views.getView(panel.panel.getElement()), 'core:focus-next');
    //     // console.log(editor);
    //   });

    //   // console.log(panel.panel.getElement());
    //   // console.log(panel.panel);
    //   // console.log(panel);
    //   // console.log(this);
    // });

    // console.log(w.panelContainers.modal.getPanels());
    // console.log(w.panelContainers);
    // console.log(w);

    // console.log(remoteSync.viewRegistry.getView());
    // console.log(remoteSync.viewRegistry);

    // console.log(Object.getPrototypeOf(remoteSync));
    // console.log(Object.getOwnPropertyNames(remoteSync).join("\n"));
    // console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(remoteSync)).join("\n"));

    // console.log(remoteSync);

    // Test
    // atom.commands.add('atom-text-editor', {
    //   'user:insert-date': (event) => {
    //     console.log(event);
    //     console.log(this);

    //     // const editor = this.getModel();
    //     // return editor.insertText(new Date().toLocaleString());
    //   }
    // });
  }



  doubleSpaces() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    var selections = editor.getSelections();
    var snippets = atom.packages.getActivePackage('snippets');
    if (snippets) {
      var snippetsService = snippets.mainModule;
    }

    editor.mutateSelectedText((selection, index) => {
      var __ = this.getEditorAndCursor(editor, selection);
      snippetsService.insert(' ${1:'+ __.selectedText +'}$0 ', __.editor, __.cursor);
    });
  }

  getRootScope(editor) {
    if (typeof editor == 'object' && editor) {
      return editor.getCursorScope().scopes.shift();
    }

    return;
  }

  openProjectFiles() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    var files = [
      '~/.atom/project-viewer.json',
      '~/.atom/projects.cson',
    ];
    files.forEach((file, index) => {
      exec("ls "+ file +" 2>/dev/null", (err, stdout, stderr) => {
        if (stdout) {
          // exec("atom '"+ stdout +"'");
        }
      });
    });
  }

  pinnedCopySelectedText() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    var selectedText = editor.getSelectedText();
    if (selectedText) {
      atom.pinnedCopySelectedText = selectedText;
    }
    return selectedText;
  }

  loadPinnedCopySelectedText() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    var selectedText = atom.pinnedCopySelectedText;
    if (selectedText) {
      editor.insertText(selectedText);
    }
    return selectedText;
  }

  buildCustomAutoTextItems() {
    var list = '<div class="select-list"><ol class="list-group">{{listItems}}</ol></div>';
    var listItems = '';
    for (var i = 0; i < customAutoTextItems.length; i++) {
      var textItem = customAutoTextItems[i];
      listItems += '<li class="item" data-id="'+ textItem.id +'">'+ textItem.text +'</li>';
    }
    return list.replace('{{listItems}}', listItems);
  }
  buildCustomAutoTextButtons() {
    var button = '<div class="block pull-right">{{buttonItems}}</div><div class="clear">&nbsp;</div>';
    var buttonItems = '';
    buttonItems += '<button class="inline-block-tight btn" click="close">Cancel</button>';
    // buttonItems += '<button class="inline-block-tight btn" click="confirm">Confirm</button>';
    return button.replace('{{buttonItems}}', buttonItems);
  }


  createModal() {
    /*

      var workspace = atom.workspace;
      var editor = atom.workspace.getActiveTextEditor();
      var rootScope = this.getRootScope(editor);
      const modalId = 'customAutoTextModal';
      const listItems = this.buildCustomAutoTextItems();
      const buttonItems = this.buildCustomAutoTextButtons();

      var el = document.createElement('div');
      el.setAttribute('id', modalId);
      el.innerHTML += listItems;
      el.innerHTML += buttonItems;

      var modalContent = el;
      var modal = workspace.addModalPanel({
        item: modalContent,
        visible: true,
        autoFocus: true,
        priority: 1,
      });

      var modalButtons = el.querySelectorAll('button');
      for (var i = 0; i < modalButtons.length; i++) {
        var modalButton = modalButtons[i];
        modalButton.addEventListener('click', function (evt) {
          evt.preventDefault();

          var button = this;
          modal.destroy();
        });
      }


      var modalListItems = el.querySelectorAll('.select-list .list-group .item');
      if (modalListItems.length > 0) {
        var snippets = atom.packages.getActivePackage('snippets');
        if (snippets) {
          var snippetsService = snippets.mainModule;
        }

        for (var i = 0; i < modalListItems.length; i++) {
          var modalListItem = modalListItems[i];
          modalListItem.addEventListener('click', function (evt) {
            evt.preventDefault();
            var listItem = this;
            var listItemText = '';
            if (listItem.innerText) {
              listItemText = listItem.innerText;
            }

            editor.mutateSelectedText(function (selection, index) {
              snippetsService.insert('${1:'+ listItemText +'}$0', selection.editor, selection.cursor);
            });

            modal.destroy();
          });
        }
      }


    */
  }


  getNotificationOptions(options) {
    var options = mergeObject({
      description: '',
      detail: '',
      stack: '',
      icon: 'info',
      dismissable: false,
    }, options);

    return options;
  }


  showError(message, options) {
    var options = mergeObject(this.getNotificationOptions(), mergeObject({
      icon: 'flame',
      dismissable: true,
    }, options));
    var notification = atom.notifications.addError(message, options);
  }


  escapeSnippetCharacters(snippetText = '') {
    if (snippetText) {
      snippetText = snippetText.replace(/\{/g, '\\{');
      snippetText = snippetText.replace(/\}/g, '\\}');
    }

    return snippetText;
  }


  getEditorAndCursor(editor, selection) {
    var __editor = editor;
    var __cursor = __editor.cursor;
    var selectedText = '';
    if (selection.getText()) {
      __editor = selection.editor;
      __cursor = selection.cursor;
      selectedText = this.escapeSnippetCharacters(selection.getText());
    }
    return {
      editor: __editor,
      cursor: __cursor,
      selectedText: selectedText,
    }
  }


  wrapInlineComment() {
    var editor = atom.workspace.getActiveTextEditor();
    var selections = editor.getSelections();
    var snippets = atom.packages.getActivePackage('snippets');
    if (snippets) {
      var snippetsService = snippets.mainModule;
    }

    editor.mutateSelectedText((selection, index) => {
      var __ = this.getEditorAndCursor(editor, selection);
      snippetsService.insert('/**${1: ${2:'+ __.selectedText +'} }*/$0', __.editor, __.cursor);
    });
  }


  wrapBlockComment() {
    var editor = atom.workspace.getActiveTextEditor();
    var selections = editor.getSelections();
    var snippets = atom.packages.getActivePackage('snippets');
    if (snippets) {
      var snippetsService = snippets.mainModule;
    }

    editor.mutateSelectedText((selection, index) => {
      var __ = this.getEditorAndCursor(editor, selection);
      snippetsService.insert('/*${1: ${2:'+ __.selectedText +'} }*/$0', __.editor, __.cursor);
    });
  }


  plainTextComment() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'text.plain') {
      var selections = editor.getSelections();
      var snippets = atom.packages.getActivePackage('snippets');
      if (snippets) {
        var snippetsService = snippets.mainModule;
      }

      editor.mutateSelectedText((selection, index) => {
        var __ = this.getEditorAndCursor(editor, selection);
        snippetsService.insert('## ${1:'+ __.selectedText +'}\n# ---------------- #$0', __.editor, __.cursor);
      });
    }
  }


  markdownWrapWithLink() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm' || rootScope == 'text.md') {
      var selections = editor.getSelections();
      var snippets = atom.packages.getActivePackage('snippets');
      if (snippets) {
        var snippetsService = snippets.mainModule;
      }

      editor.mutateSelectedText((selection, index) => {
        var __ = this.getEditorAndCursor(editor, selection);
        snippetsService.insert('[${1:'+ __.selectedText +'}]("${2:'+ __.selectedText +'}" "${3:#}")$0', __.editor, __.cursor);
      });
    }
  }


  markdownTextBold() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm' || rootScope == 'text.md') {
      var selections = editor.getSelections();
      var snippets = atom.packages.getActivePackage('snippets');
      if (snippets) {
        var snippetsService = snippets.mainModule;
      }

      editor.mutateSelectedText((selection, index) => {
        var __ = this.getEditorAndCursor(editor, selection);
        snippetsService.insert('__${1:'+ __.selectedText +'}__$0', __.editor, __.cursor);
      });
    }
  }


  markdownAddCheckList() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm' || rootScope == 'text.md') {
      var selections = editor.getSelections();
      var snippets = atom.packages.getActivePackage('snippets');
      if (snippets) {
        var snippetsService = snippets.mainModule;
      }

      editor.mutateSelectedText((selection, index) => {
        var __ = this.getEditorAndCursor(editor, selection);
        snippetsService.insert('- [${1: }] ${2:'+ __.selectedText +'}$0', __.editor, __.cursor);
      });
    }
  }

  markdownAddCheckedList() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm' || rootScope == 'text.md') {
      var selections = editor.getSelections();
      var snippets = atom.packages.getActivePackage('snippets');
      if (snippets) {
        var snippetsService = snippets.mainModule;
      }

      editor.mutateSelectedText((selection, index) => {
        var __ = this.getEditorAndCursor(editor, selection);
        snippetsService.insert('- [${1:x}] ${2:'+ __.selectedText +'}$0', __.editor, __.cursor);
      });
    }
  }


  markdownTextItalic() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm' || rootScope == 'text.md') {
      var selections = editor.getSelections();
      var snippets = atom.packages.getActivePackage('snippets');
      if (snippets) {
        var snippetsService = snippets.mainModule;
      }

      editor.mutateSelectedText((selection, index) => {
        var __ = this.getEditorAndCursor(editor, selection);
        snippetsService.insert('*${1:'+ __.selectedText +'}*$0', __.editor, __.cursor);
      });
    }
  }

  markdownCodeBlock() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm' || rootScope == 'text.md') {
      var selections = editor.getSelections();
      var snippets = atom.packages.getActivePackage('snippets');
      if (snippets) {
        var snippetsService = snippets.mainModule;
      }

      editor.mutateSelectedText((selection, index) => {
        var __ = this.getEditorAndCursor(editor, selection);
        snippetsService.insert('```\n${1:'+ __.selectedText +'}\n```$0', __.editor, __.cursor);
      });
    }
  }

  markdownToggleTask() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm' || rootScope == 'text.md') {
      var selections = editor.getSelections();
      var snippets = atom.packages.getActivePackage('snippets');
      if (snippets) {
        var snippetsService = snippets.mainModule;
      }

      editor.mutateSelectedText((selection, index) => {
        // var __ = this.getEditorAndCursor(editor, selection);

        if (selection.isEmpty()) {
          atom.commands.dispatch(atom.views.getView(selection.editor), 'toggle-markdown-task:toggle');
        } else {
          snippetsService.insert('- [ ] '+ selection.getText() +'$0', selection.editor, selection.cursor);
        }
      });
    }
  }


  isEmpty(v = '') {
    if (v.length == 0) {
      return 'length';
    }

    if (typeof v == 'boolean' && !v) {
      return 'boolean';
    }

    if (typeof v == 'undefined') {
      return 'undefined';
    }

    if (isNaN(v) ||  v == null || v == 'null' || v == '') {
      return 'null';
    }

    if (typeof v.length == 'undefined') {
      return 'length';
    }
  }


  getObjectPrototypes(obj = null, display = 'raw') {
    var properties = [];

    console.log(this.isEmpty());

    return;

    if (isNaN(obj) ||  typeof obj.length != 'undefined') {
      console.error('not type of object.');
    } else {

    }

    if (typeof obj == 'object' && obj) {
      if (typeof obj.__proto__ != 'undefined') {
        obj = obj.__proto__;
      }

      var properties = Object.getOwnPropertyDescriptors(obj);
      if (properties) {
        var keys = Object.keys(properties);

        display = (typeof display != 'string') ? 'raw' : display.toLowerCase();

        if (display == 'array') {
          return Object.keys(properties);
        } else if (display == 'row') {
          return keys.join("\n");
        } else {
          // Return as raw string.
          return keys.join(', ');
        }
      }
    }

    return;
  }

  getObjectProperties(obj = null, display = 'raw') {
    if (typeof obj.length > 0) {
      console.error('not type of object.');
    }

    if (typeof obj == 'object' && obj ) {
      var properties = Object.getOwnPropertyDescriptors(obj);
      if (properties) {
        var keys = Object.keys(properties);

        display = (typeof display != 'string') ? 'raw' : display.toLowerCase();

        if (display == 'array') {
          return Object.keys(properties);
        } else if (display == 'row') {
          return keys.join("\n");
        } else {
          // Return as raw string.
          return keys.join(', ');
        }
      }
    }

    return;
  }


  getActiveMarkdownPackage() {
    var workspace = atom.workspace;
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    var whichMarkdown = 'markdown-preview';
    if (atom.packages.isPackageActive('markdown-preview-plus')) {
      whichMarkdown = 'markdown-preview-plus';
    }

    return whichMarkdown.toLowerCase();
  }

  markdownPreview() {
    var workspace = atom.workspace;
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);

    if (rootScope == 'source.gfm' || rootScope == 'text.md') {
      if (this.getActiveMarkdownPackage() == 'markdown-preview-plus') {
        atom.commands.dispatch(atom.views.getView(editor), 'markdown-preview-plus:toggle');
      } else {
        atom.commands.dispatch(atom.views.getView(editor), 'markdown-preview:toggle');
      }
      var timeout = setTimeout(() => {
        atom.commands.dispatch(atom.views.getView(editor), 'window:focus-pane-on-right');
        clearTimeout(timeout);
      }, 1000);
    }
  }


  moveActiveItemToPaneAbove() {
    var workspace = atom.workspace;
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);

    atom.commands.dispatch(atom.views.getView(editor), 'window:move-active-item-to-pane-above').then(function () {
      atom.commands.dispatch(atom.views.getView(editor), 'window:focus-pane-below');
    });
  }
  moveActiveItemToPaneBelow() {
    var workspace = atom.workspace;
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);

    atom.commands.dispatch(atom.views.getView(editor), 'window:move-active-item-to-pane-below').then(function () {
      atom.commands.dispatch(atom.views.getView(editor), 'window:focus-pane-above');
    });
  }
  moveActiveItemToPaneOnLeft() {
    var workspace = atom.workspace;
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);

    atom.commands.dispatch(atom.views.getView(editor), 'window:move-active-item-to-pane-on-left').then(function () {
      atom.commands.dispatch(atom.views.getView(editor), 'window:focus-pane-on-right');
    });
  }
  moveActiveItemToPaneOnRight() {
    var workspace = atom.workspace;
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);

    atom.commands.dispatch(atom.views.getView(editor), 'window:move-active-item-to-pane-on-right').then(function () {
      atom.commands.dispatch(atom.views.getView(editor), 'window:focus-pane-on-left');
    });
  }

}

global._data = new Data();


// In init.coffee
// # atom.packages.onDidActivateInitialPackages(() => {
// #   const gitPlus = atom.packages.getActivePackage('git-plus')
// #   if (gitPlus) {
// #     const gp = gitPlus.mainModule.provideService()
// #     // commands go here, see below
// #   }
// # })

// # atom.packages.onDidActivateInitialPackages () ->
// # if gitPlus = atom.packages.getActivePackage('git-plus')?.mainModule.provideService()
// #   gitPlus.registerCommand 'atom-text-editor', 'custom-git-commands:undo-last-commit', ->
// #     gitPlus.getRepo() # If there are multiple repos in the project, you will be prompted to select which to use
// #     .then (repo) -> gitPlus.run repo, 'reset HEAD~1'
// #
// #     gitPlus.registerCommand 'atom-text-editor', 'akonwi:unstage-last-commit', ->
// #       gitPlus.getRepo() # If there are multiple repos in the project, you will be prompted to select which to use
// #       .then (repo) -> gitPlus.run repo, 'reset HEAD~1'
// #
// #     gitPlus.registerCommand 'atom-text-editor', 'akonwi:update-last-commit', ->
// #       gitPlus.getRepo() # If there are multiple repos in the project, you will be prompted to select which to use
// #       .then (repo) -> gitPlus.run repo, 'commit --all --amend --no-edit'
// #
// #     gitPlus.registerCommand 'atom-text-editor', 'akonwi:use-the-force', ->
// #       gitPlus.getRepo() # If there are multiple repos in the project, you will be prompted to select which to use
// #       .then (repo) -> gitPlus.run repo, 'push --force-with-lease'



// # wrapBlock = () ->
// #   editor = atom.workspace.getActiveTextEditor()
// #   rangesToWrap = editor.getSelectedBufferRanges().filter((r) -> !r.isEmpty())
// #   if rangesToWrap.length
// #     rangesToWrap.sort((a, b) ->
// #       return if a.start.row > b.start.row then -1 else 1
// #     ).forEach((range) ->
// #       text = editor.getTextInBufferRange(range)
// #       if (/^\s*\{\s*/.test(text) && /\s*\}\s*/.test(text))
// #         # unwrap each selection from its block
// #         editor.setTextInBufferRange(range, text.replace(/\{\s*/, '').replace(/\s*\}/, ''))
// #       else
// #         # wrap each selection in a block
// #         editor.setTextInBufferRange(range, '{\n' + text + '\n}')
// #     )
// #     editor.autoIndentSelectedRows()
// #   else
// #     # create an empty block at each cursor
// #     editor.insertText('{\n\n}')
// #     editor.selectUp(2)
// #     editor.autoIndentSelectedRows()
// #     editor.moveRight()
// #     editor.moveUp()
// #     editor.moveToEndOfLine()
