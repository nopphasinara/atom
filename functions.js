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
    // this.r = this.e.getSelectedBufferRanges();
    // this.t = function(range) {
    //   return this.e.getTextInBufferRange(range);
    // };

    this.registerCommands();
  }

  registerCommands() {
    // atom.commands.add('atom-text-editor', 'nerd:show-current-file-in-file-manager', function() {
    //
    // });

    atom.commands.add('atom-text-editor', 'nerd:open-atom-src', function() {
      shell.openExternal('https://github.com/atom/atom/tree/master/src');
    });
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

  revealFileInFinder(file) {
    // if (typeof file == 'undefined' || !file) {
    //   // console.log(atom.textEditors);
    //   // console.log(atom.workspace);
    //   // console.log(atom);
    //   // this.showError('no file input');
    // }
  }

  wrapInlineComment() {
    var editor = atom.workspace.getActiveTextEditor();
    var selections = editor.getSelections();
    if (selections) {
      var snippets = atom.packages.getActivePackage('snippets');
      if (snippets) {
        var snippetsService = snippets.mainModule;
      }

      editor.mutateSelectedText((selection, index) => {
        snippetsService.insert('/* ${1:'+ selection.getText() +'} */$0', selection.editor, selection.cursor);
      });
    }
  }

  markdownWrapWithLink() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm') {
      var selections = editor.getSelections();
      if (selections) {
        var snippets = atom.packages.getActivePackage('snippets');
        if (snippets) {
          var snippetsService = snippets.mainModule;
        }

        editor.mutateSelectedText((selection, index) => {
          snippetsService.insert('[${1:'+ selection.getText() +'}]("${2:'+ selection.getText() +'}" "${3:#}")$0', selection.editor, selection.cursor);
        });
      }
    }
  }

  markdownTextBold() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm') {
      var selections = editor.getSelections();
      if (selections) {
        var snippets = atom.packages.getActivePackage('snippets');
        if (snippets) {
          var snippetsService = snippets.mainModule;
        }

        editor.mutateSelectedText((selection, index) => {
          snippetsService.insert('__${1:'+ selection.getText() +'}__$0', selection.editor, selection.cursor);
        });
      }
    }
  }

  markdownTextItalic() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm') {
      var selections = editor.getSelections();
      if (selections) {
        var snippets = atom.packages.getActivePackage('snippets');
        if (snippets) {
          var snippetsService = snippets.mainModule;
        }

        editor.mutateSelectedText((selection, index) => {
          snippetsService.insert('*${1:'+ selection.getText() +'}*$0', selection.editor, selection.cursor);
        });
      }
    }
  }

  plainTextComment() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'text.plain') {
      var selections = editor.getSelections();
      if (selections) {
        var snippets = atom.packages.getActivePackage('snippets');
        if (snippets) {
          var snippetsService = snippets.mainModule;

          editor.mutateSelectedText((selection, index) => {
            var selectedText = '';
            if (selection.getText() && selection.getText() != '') {
              selectedText = selection.getText();
            }
            snippetsService.insert('## ${1:'+ selectedText +'}\n# ---------------- #$0', selection.editor, selection.cursor);
          });
        }
      } else {
        editor.mutateSelectedText((selection, index) => {
          var selectedText = '';
          snippetsService.insert('## ${1:'+ selectedText +'}\n# ---------------- #$0', editor, editor.cursor);
        });
      }
    }
  }

  markdownCodeBlock() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    if (rootScope == 'source.gfm') {
      var selections = editor.getSelections();
      if (selections) {
        var snippets = atom.packages.getActivePackage('snippets');
        if (snippets) {
          var snippetsService = snippets.mainModule;

          editor.mutateSelectedText((selection, index) => {
            var selectedText = '';
            if (selection.getText() && selection.getText() != '') {
              selectedText = selection.getText();
            }
            snippetsService.insert('```\n${1:'+ selectedText +'}\n```$0', selection.editor, selection.cursor);
          });
        }
      } else {
        editor.mutateSelectedText((selection, index) => {
          var selectedText = '';
          snippetsService.insert('```\n${1:'+ selectedText +'}\n```$0', editor, editor.cursor);
        });
      }
    }
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
      global.pinnedCopySelectedText = selectedText;
    }
    return selectedText;
  }

  loadPinnedCopySelectedText() {
    var editor = atom.workspace.getActiveTextEditor();
    var rootScope = this.getRootScope(editor);
    var selectedText = global.pinnedCopySelectedText;
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

  }
}

global._data = new Data();
