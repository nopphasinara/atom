/** @babel */

console.clear();


if (!global.hasOwnProperty('__filenameSync')) {
  global.__filenameSync = undefined;
}

if (!global.hasOwnProperty('__dirnameSync')) {
  global.__dirnameSync = undefined;
}

let didStartActivateInitialPackages = false;
let didStartObserveActiveTextEditor = false;

function isTextEditor(editor) {
  return atom.workspace.isTextEditor(editor) || false;
}

function observeTextEditors(editor) {
  editor = editor || atom.workspace.getActiveTextEditor();

  if (!isTextEditor(editor) || typeof editor.getPath() === 'undefined') {
    return;
  }

  __filenameSync = getTextEditorPath(editor);
  __dirnameSync = getTextEditorDirPath(editor);
}

function getTextEditorPath(editor = null) {
  editor = editor || atom.workspace.getActiveTextEditor();

  if (!isTextEditor(editor) || typeof editor.getPath() === 'undefined') {
    return;
  }

  return fs.realpathSync(editor.getPath()) || undefined;
}

function getTextEditorDirPath(editor = null) {
  let editorPath = getTextEditorPath(editor);

  if (typeof editorPath === 'undefined') {
    return;
  }

  return fs.realpathSync(stdpath.dirname(editorPath)) || undefined;
}

function requireResolveFrom(filepath) {
  filepath = filepath || '';

  if (typeof filepath === 'undefined') {
    console.error('Invalid path');
    return;
  }

  let resolveFilepath;
  let isRootPath = filepath.startsWith('/') || false;
  let isPrefixPath = filepath.startsWith('../') || filepath.startsWith('./') || false;

  if (isRootPath) {
    resolveFilepath = fs.realpathSync(stdpath.resolve(filepath));
  } else if (isPrefixPath) {
    resolveFilepath = fs.realpathSync(stdpath.resolve([getTextEditorDirPath(), filepath].join('/')));
  } else {
    resolveFilepath = filepath;
  }

  return resolveFilepath;
}

function requireFromModule(filepath) {
  filepath = filepath || '';

  if (typeof filepath === 'undefined' || !filepath) {
    console.error('Invalid path');
    return;
  }

  let resolveFilepath = stdpath.resolve([requireResolveFrom(atom.getLoadSettings().atomHome), 'node_modules', filepath].join('/'));

  return require(resolveFilepath);
}

function requireFromPackage(filepath) {
  filepath = filepath || '';

  if (typeof filepath === 'undefined' || !filepath) {
    console.error('Invalid path');
    return;
  }

  let resolveFilepath = stdpath.resolve([requireResolveFrom(getTextEditorDirPath()), filepath].join('/'));

  return require(resolveFilepath);
}

function requirePackageModule(filepath) {
  filepath = filepath || '';

  if (typeof filepath === 'undefined' || !filepath) {
    console.error('Invalid path');
    return;
  }

  let resolveFilepath = stdpath.resolve(['./', 'node_modules', filepath].join('/'));

  return require(resolveFilepath);
}

function requireFromAtom(filepath) {
  filepath = filepath || '';

  if (typeof filepath === 'undefined' || !filepath) {
    console.error('Invalid path');
    return;
  }

  let resolveFilepath = stdpath.resolve([requireResolveFrom(atom.getLoadSettings().atomHome), filepath].join('/'));

  return require(resolveFilepath);
}

function requireFromAtomPackage(filepath) {
  filepath = filepath || '';

  if (typeof filepath === 'undefined' || !filepath) {
    console.error('Invalid path');
    return;
  }

  let resolveFilepath = stdpath.resolve([requireResolveFrom(atom.getLoadSettings().atomHome), 'packages', filepath].join('/'));

  return require(resolveFilepath);
}

function getAtomHomePath() {
  return atom.getLoadSettings().atomHome || undefined;
}


let globalFunctions = {
  isTextEditor,
  observeTextEditors,
  getTextEditorPath,
  getTextEditorDirPath,
  requireResolveFrom,
  requireFromModule,
  requireFromPackage,
  requireFromAtom,
  requireFromAtomPackage,
  getAtomHomePath,
};
Object.assign(global, globalFunctions);
Object.assign(window, globalFunctions);


atom.workspace.observeTextEditors(observeTextEditors);

let Helpers = Object.assign({}, globalFunctions);

module.exports = Helpers;
