const electron = require('electron');
const shell = electron.shell;


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
    this.r = this.e.getSelectedBufferRanges();
    this.t = function(range) {
      return this.e.getTextInBufferRange(range);
    };

    this.registerCommands();

    console.log(getMethods(this.e));
  }

  registerCommands() {
    // atom.commands.add('atom-text-editor', 'nerd:show-current-file-in-file-manager', function() {
    //
    // });
    //
    // atom.commands.add('atom-text-editor', 'nerd:open-atom-src', function() {
    //   shell.openExternal('https://github.com/atom/atom/tree/master/src');
    // });
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
    console.log(notification.getOptions());
    console.log(notification.getDetail());
    console.log(notification);
  }

  revealFileInFinder(file) {
    if (typeof file == 'undefined' || !file) {
      // console.log(atom.textEditors);
      // console.log(atom.workspace);
      // console.log(atom);
      // this.showError('no file input');
    }
  }
}
global._data = new Data();

// module.exports =
//   onSave: (editor) ->
//     console.log "Saved!"
//
//     selections = editor.getSelections()
//     if selections.length > 0
//       console.log selections
//       console.log "selectedText"
//       console.log editor.getSelectedText()
