'use babel';

console.clear();

var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');

const ATOM_PATH = path.dirname(atom.getUserInitScriptPath());

var foopath = lib('classes/CommandManager.js');

var CommandManager = requireFresh(foopath);

function requireFresh(module) {
  if (typeof require.cache[module] !== 'undefined') {
    delete require.cache[module];
  }

  module.loaded = false;

  return module.export = require(module);
}


function lib(...paths) {
  if (typeof paths === 'undefined') {
    return;
  }

  return path.join(ATOM_PATH, 'lib', paths.join('/'));
}

function atom_initialize() {
  console.log(_);
  return this;
}

function atom_get_editors(only_active = false) {
  if (only_active) {
    return atom.workspace.getActiveTextEditor();
  }

  return atom.workspace.getTextEditors();
}

function willDispatchReplConsole() {
  var editor = atom.workspace.getActiveTextEditor();

  Object.assign(global, {
    ReplConsole: {
      projectDir: atom.project.resolvePath('./'),
      workingDir: path.dirname(editor.getPath()),
    },
  });
}

Object.assign(global, {
  willDispatchReplConsole,
});


class ProviderManager {
  constructor() {
    atom.commands.add('atom-text-editor', 'awesome:select-line', function() {
      var editor = atom.workspace.getActiveTextEditor();

      editor.mutateSelectedText((selection, index) => {
        if (!selection.isEmpty()) {
          selection.clear();
        }

        atom.commands.dispatch(atom.views.getView(editor), 'editor:select-line');

        var selectedText = selection.getText();
        var selectedLength = selectedText.length;
        var startLength = selectedLength - selectedText.trimLeft().length;
        var endLength = selectedLength - selectedText.trimRight().length;
        var trimLength = startLength + endLength;

        editor.selectLeft();
        editor.moveToFirstCharacterOfLine();
        editor.selectRight(selectedLength - trimLength);
      });
    });

    atom.commands.add('atom-text-editor', 'awesome:cut-select-line', function() {
      var editor = atom.workspace.getActiveTextEditor();

      editor.mutateSelectedText((selection, index) => {
        if (!selection.isEmpty()) {
          selection.clear();
        }

        atom.commands.dispatch(atom.views.getView(selection.cursor.editor), 'editor:select-line');

        var selectedText = selection.getText();
        var selectedLength = selectedText.length;
        var startLength = selectedLength - selectedText.trimLeft().length;
        var endLength = selectedLength - selectedText.trimRight().length;
        var trimLength = startLength + endLength;

        selection.cursor.editor.selectLeft();
        selection.cursor.editor.moveToFirstCharacterOfLine();
        selection.cursor.editor.selectRight(selectedLength - trimLength);

        selection.cursor.editor.cutSelectedText();
        selection.cursor.editor.deleteLine();
      });
    });

    atom.commands.add('atom-text-editor', 'awesome:copy-select-line', function() {
      var editor = atom.workspace.getActiveTextEditor();

      editor.mutateSelectedText((selection, index) => {
        if (!selection.isEmpty()) {
          selection.clear();
        }

        atom.commands.dispatch(atom.views.getView(selection.cursor.editor), 'editor:select-line');

        var selectedText = selection.getText();
        var selectedLength = selectedText.length;
        var startLength = selectedLength - selectedText.trimLeft().length;
        var endLength = selectedLength - selectedText.trimRight().length;
        var trimLength = startLength + endLength;

        selection.cursor.editor.selectLeft();
        selection.cursor.editor.moveToFirstCharacterOfLine();
        selection.cursor.editor.selectRight(selectedLength - trimLength);

        selection.cursor.editor.copySelectedText();
      });
    });
  }

  register(provider) {
    const disposable = new CompositeDisposable();
    const providerId = provider ? provider.id : '';

    if (providerId) {
      disposable.add(operatorConfig.add(providerId, provider));
      disposable.add(
        atom.config.observe(providerId, (value) => {
          return operatorConfig.updateConfigWithAtom(providerId, value);
        })
      );
    }

    // Unregister provider from providerManager
    return disposable;
  }
};

// console.log(new ProviderManager());

module.export = new ProviderManager();
module.export = new atom_initialize();


atom.packages.onDidActivateInitialPackages(atom_initialize);
