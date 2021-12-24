console.clear();

function editorGetCursorScope(editor) {
  var editor = atom.workspace.getActiveTextEditor();
  var cursorScope = editor.getCursorScope();
  var treeScope = editor.getCursorSyntaxTreeScope();
  var result = null;

  result = cursorScope.toString();
  console.log(result);

  // atom.commands.dispatch(atom.views.getView(editor), 'window:toggle-dev-tools');

  return result;

  // console.log(editor);
  // console.log(treeScope);
  // console.log(cursorScope);
  // console.log(cursorScope.getScopeChain());
  // console.log(cursorScope.getScopesArray());
  // console.log(cursorScope.toString());
}

Object.defineProperties(global, {
  editorGetCursorScope: {
    value: editorGetCursorScope,
    enumulable: true,
    configulable: true,
    writable: true,
  },
});

atom.commands.add('atom-workspace atom-text-editor:not([mini])', 'custom:cursor-scope', global.editorGetCursorScope);





