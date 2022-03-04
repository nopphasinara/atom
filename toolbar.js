function getRealpathSync(filepath) {
    if (typeof filepath === 'undefined') {
        return;
    }
    return typeof fs !== 'undefined' ? fs.realpathSync(filepath) : filepath;
}

function isTextEditor(editor = null) {
    editor = editor || getActiveTextEditor();
    return atom.workspace.isTextEditor(editor);
}

function getActiveTextEditor() {
    return atom.workspace.getActiveTextEditor() || undefined;
}

function getPackageModule(package) {
    if (typeof package !== 'undefined') {
        var cachedPackage = atom.packages.getLoadedPackage(package) || '';
        if (cachedPackage) {
            return cachedPackage;
        }
    }

    return '';
}

function getPackageMainModule(package) {
    if (typeof package !== 'undefined') {
        var packageModule = getPackageModule(package);
        if (packageModule) {
            var mainModule = packageModule.mainModule || '';
            if (mainModule) {
                return mainModule;
            }
        }
    }

    return '';
}

function replConsole_RunCode(editor) {
    var mainModule = getPackageMainModule('repl-console');
    if (mainModule) {
        mainModule.runCode();
    }
}

function getCursorScopes(returnType = '') {
    let editor, scopes;
    editor = atom.workspace.getActiveTextEditor();
    scopes = editor.getCursorSyntaxTreeScope();

    returnType = returnType.toLowerCase() || 'chain';

    if (returnType === 'chain') {
        return scopes.getScopeChain() || '';
    } else if (returnType === 'array') {
        return scopes.getScopesArray() || [];
    } else {
        return scopes || {};
    }
}

/**
 * Object.prototype.forEach() polyfill
 * https://gomakethings.com/looping-through-objects-with-es6/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!Object.prototype.forEach) {
    Object.defineProperty(Object.prototype, 'forEach', {
        readable: true,
        writable: true,
        value: function (callback, thisArg) {
            if (this == null) throw new TypeError('Not an object');

            thisArg = thisArg || window;
            for (var key in this) {
                if (this.hasOwnProperty(key)) callback.call(thisArg, this[key], key, this);
            }
        },
    });
}

if (!Object.prototype.isEmpty) {
    Object.defineProperty(Object.prototype, 'isEmpty', {
        readable: true,
        writable: true,
        value: function (callback, thisArg) {
            if (this == null) throw new TypeError('Not an object');

            thisArg = thisArg || window;

            if (typeof callback === 'function') {
                callback.call(thisArg, this);
            } else {
                return Object.entries(this).length ? false : true;
            }
        },
    });
}

function isObjectEmpty(obj) {
    if (typeof obj !== 'object') {
        throw new TypeError('aaa');
    }

    if (Object.entries(obj).length <= 0) {
        throw new TypeError('bbb');
    }

    // if (typeof obj !== 'object') {
    //   throw new TypeError('aaa');
    // }

    return obj.valueOf();

    // try {
    //
    // } catch (e) {
    //   console.log(e);
    //   console.log(arguments);
    //   // console.log(e.getRawStack());
    //   // console.log(e.toString());
    //   // console.log(e.__proto__);
    //   // console.error('invalid object');
    // }
}

module.exports = [
    // {
    //   type: 'button',
    //   callback: {
    //     ': function (editor) {
    //       replConsole_RunCode(editor);
    //     },
    //     'shift': function (editor) {
    //       console.clear();
    //       replConsole_RunCode(editor);
    //     },
    //   },
    //   text: '<i>󰚌</i>',
    //   html: true,
    //   class: ['mdi', 'bg-error', 'fg-dark', 'fg-warning-hover'],
    //   // show: {
    //   //   grammar: [
    //   //     'js',
    //   //     'json',
    //   //     'php',
    //   //   ],
    //   // },
    // },
    {
        type: 'button',
        callback: {
            '': 'window:reload',
        },
        tooltip: 'Reload Window',
        text: '<i>󰇥</i>',
        html: true,
        class: ['mdi', 'bg-warning', 'fg-dark'],
    },
    // { type: 'spacer' },
    {
        type: 'button',
        callback: {
            '': 'remote-sync:configure',
        },
        tooltip: 'Remote Sync: Config',
        text: '<i>󰒋</i>',
        html: true,
        class: ['mdi', 'bg-warning', 'fg-dark'],
    },
    // { type: 'spacer' },
    {
        type: 'url',
        url: 'https://github.com/{repo-owner}/{repo-name}',
        tooltip: 'Open on Github',
        text: '<i>󰊢</i>',
        html: true,
        class: ['mdi', 'bg-info', 'fg-dark'],
    },
    {
        type: 'button',
        callback: {
            '': 'git-menu:discard-changes',
        },
        tooltip: 'Discard Changes',
        text: '<i>󰪻</i>',
        html: true,
        show: {
          function: () => {
              return !atom.packages.isPackageDisabled('git-menu');
          },
        },
        class: ['mdi', 'bg-info', 'fg-dark'],
    },
    {
        type: 'button',
        callback: {
            '': 'split-diff:toggle',
        },
        tooltip: 'Split Diff',
        text: '<i>󰪚</i>',
        html: true,
        show: {
          function: () => {
              return !atom.packages.isPackageDisabled('split-diff');
          },
        },
        class: ['mdi', 'bg-info', 'fg-dark'],
    },
    {
        type: 'button',
        callback: {
            '': 'git-history:show-file-history',
        },
        tooltip: 'Git History',
        text: '<i>󰚰</i>',
        html: true,
        show: {
          function: () => {
              return !atom.packages.isPackageDisabled('git-history');
          },
        },
        class: ['mdi', 'bg-info', 'fg-dark'],
    },
    // { type: 'spacer' },
    {
        type: 'button',
        callback: {
            '': 'emmet:increment-number-by-1',
            shift: 'emmet:increment-number-by-10',
            alt: 'emmet:decrement-number-by-1',
            'alt+shift': 'emmet:decrement-number-by-10',
        },
        tooltip: '+1',
        text: '<i>󰃬</i>',
        html: true,
        class: ['mdi', 'bg-success', 'fg-dark'],
    },
    {
        type: 'button',
        callback: {
            '': 'editor:toggle-soft-wrap',
        },
        tooltip: 'Toggle Soft Wrap',
        text: '<i>󰖶</i>',
        html: true,
        show: {
            function: () => {
                return atom.workspace.isTextEditor(atom.workspace.getActiveTextEditor());
            },
        },
        class: ['mdi', 'bg-success', 'fg-dark'],
    },
    {
        type: 'button',
        callback: {
            '': 'markdown-preview:toggle',
        },
        text: '<i>󰍔</i>',
        html: true,
        show: {
            pattern: ['*.md'],
        },
        class: ['mdi', 'bg-success', 'fg-dark'],
    },
    // { type: 'spacer' },
    {
        type: 'button',
        callback: {
            '': function () {
                console.clear();

                var apiUrl = 'https://search.google.com/u/2/search-console/disavow-links?resource_id=';
                var sites = [
                    'abacus-gallery.com',
                    'modern-art-reproductions.com',
                    'museum-reproductions.com',
                    'oshjosh.com',
                    'reproduction-galleries.com',
                    'reproduction-gallery.com',
                    'reproduction-studio.com',
                    'soho-art.com',
                ];
                var protocols = ['http', 'https'];
                var encodedUrls = {};

                sites.map(function (site) {
                    protocols.map(function (protocol) {
                        var data, raw, encoded;

                        if (!encodedUrls.hasOwnProperty(site)) {
                            encodedUrls[site] = [];
                        }

                        encodedUrls[site].push(encodeURIComponent(`${protocol}://${site}/`));
                        encodedUrls[site].push(encodeURIComponent(`${protocol}://www.${site}/`));
                    });
                });

                if (!encodedUrls.isEmpty()) {
                    console.log(encodedUrls);

                    atom.commands.dispatch(atom.views.getView(atom.workspace), 'application:new-file');

                    setTimeout(function () {
                        var editor = getActiveTextEditor();

                        encodedUrls.forEach(function (urls, site) {
                            editor.insertText(`${site}:`);
                            editor.insertNewline();

                            if (urls.length > 0) {
                                urls.forEach(function (url) {
                                    var encodedUrl = encodeURIComponent(url);
                                    editor.insertText(`${apiUrl}${url}`);
                                    editor.insertNewline();
                                });

                                editor.insertNewline();
                            }
                        });
                    }, 500);
                }
            },
        },
        tooltip: 'Generate Disavow',
        text: '<i>󰌷</i>',
        html: true,
        class: ['mdi', 'bg-highlight', 'fg-dark'],
    },
    {
        type: 'button',
        callback: {
            '': 'remote-sync:download-file',
            'shift': 'remote-sync:upload-file',
        },
        tooltip: 'Remote Sync',
        text: '<i>󰈋</i>',
        html: true,
        show: {
            function: () => {
              var entries = atom.project.rootDirectories || [];
              entries = (typeof entries !== 'undefined' && entries.length) ? entries[0].getEntriesSync() : undefined;
              if (typeof entries !== 'undefined' && entries.length) {
                var filtered = entries.filter((item, i) => {
                  if (item.getBaseName().toLowerCase() === '.remote-sync.json') {
                    return true;
                  }
                  return false;
                });

                if (filtered.length) {
                  return true;
                }
              }
              return false;
            },
        },
        class: ['mdi'],
    },
    {
        type: 'button',
        callback: {
            '': 'atom-beautify:beautify-language-php',
            'shift': 'atom-beautify:beautify-language-javascript',
            'shift+alt': 'atom-beautify:beautify-language-css',
        },
        tooltip: 'Beautify',
        text: '<i>󰁨</i>',
        html: true,
        show: {
          function: () => {
              return !atom.packages.isPackageDisabled('atom-beautify:beautify-editor');
          },
        },
        class: ['mdi'],
    },
    { type: 'spacer' },
    {
        type: 'button',
        callback: {
            '': 'chrome-color-picker:toggle',
            alt: 'chrome-color-picker:pickcolor',
        },
        tooltip: 'Color Picker',
        text: '<i>󰈋</i>',
        html: true,
        show: {
            function: () => {
                return !atom.packages.isPackageDisabled('chrome-color-picker');
            },
        },
        class: ['mdi'],
    },
    {
        type: 'button',
        callback: {
            '': function (editor) {
                console.log(getCursorScopes('chain'));
            },
            shift: function (editor) {
                console.log(getCursorScopes('array'));
            },
            alt: function (editor) {
                let scopeChain = getCursorScopes('chain') || '';
                if (scopeChain) {
                    console.log(scopeChain);
                    atom.clipboard.write(scopeChain);
                }
            },
        },
        tooltip: 'Cursor Scope, To Array (󰜷󰍽)',
        text: '<i>󰆣</i>',
        html: true,
        class: ['mdi'],
    },
    {
        type: 'button',
        callback: {
            '': 'symbols-list:toggle',
        },
        tooltip: 'Symbol List',
        text: '<i>󰙮</i>',
        html: true,
        class: ['mdi'],
    },
    {
        type: 'button',
        callback: {
            '': function () {
                console.clear();

                var editor = getActiveTextEditor();
                if (isTextEditor(editor)) {
                    var filepath = getRealpathSync(editor.getPath());

                    console.log(console);
                    console.log(console.prototype);

                    // const exec = require('child_process').execFile;
                    const util = require('util');
                    const exec = util.promisify(require('child_process').exec);
                    const execFile = util.promisify(require('child_process').execFile);

                    async function runScripts(filepath) {
                        console.group('exec');
                        console.log(exec);
                        console.log(
                            exec(
                                `tap ${filepath}`,
                                {
                                    shell: '/bin/zsh',
                                },
                                function (error, stdout, stderr) {
                                    console.log(error);
                                    console.log(stdout);
                                    console.log(stderr);
                                }
                            )
                        );
                        console.groupEnd();

                        // console.group('execFile');
                        // console.log(execFile);
                        // console.log(execFile('node', [
                        //   filepath,
                        //   '--prof',
                        //   '--interactive',
                        //   '--print',
                        // ], function (error, stdout, stderr) {
                        //   console.log(error);
                        //   console.log(stdout);
                        //   console.log(stderr);
                        // }));
                        // console.groupEnd();
                    }

                    runScripts(filepath);
                }
            },
        },
        tooltip: 'Run Script',
        text: '<i>󰗀</i>',
        html: true,
        show: {
          pattern: ['*.js'],
        },
        class: ['mdi'],
    },
    {
        type: 'button',
        callback: {
            '': 'window:toggle-dev-tools',
        },
        tooltip: 'Toggle Dev Tools',
        text: '<i>󰲌</i>',
        html: true,
        class: ['mdi'],
    },
    // { type: 'spacer' },
    // {
    //   type: 'button',
    //   callback: {
    //     '': '',
    //   },
    //   text: '<i>󰌞󰌝󰌟󰌧󰌨󰌴󰌹󰍓 󰍕󰍜󰍣󰍺󰍹󰍻󰍽󰎂 󰎔󰎙󰎝󰎠󰏋󰏌󰏑󰏔 󰏕󰏘󰏯󰏰󰐏󰐒󰐓󰐕 󰐣󰐤󰐭󰐰󰑇󰑋󰑐󰑑 󰑒󰑓󰑕󰑖󰑘󰑙󰑥󰑧 󰒍󰒓󰒟󰒲󰒻󰒺󰒾󰓂 󰓆󰓢󰓡󰓦󰓧󰓾󰕅󰕎 󰕏󰕕󰕒󰖶󰖽󰖿󰗀󰗇󰗊󰗠󰗡󰗨󰘎󰘞󰘢󰘡󰘣󰘥󰘦󰘧󰘨󰘬󰘮󰘲󰘳󰘴󰘵󰘶󰙁󰙆󰙖󰙪󰙩󰙰󰙲󰚈󰚑󰚔󰚖󰚝󰚧󰚲󰚹󰚽󰛄󰛉󰛦󰛬󰛭󰜄󰜉󰝉󰝓󰝕󰝖󰝔󰝗󰝠󰝡󰝰󰞷󰡰󰡱󰢹󰣀󰣞󰤀󰤌󰤍󰤘󰥦󰥨󰥩󰥪󰥻󰦄󰦍󰦎󰦏󰦐󰦒󰦓󰦛󰦣󰦪󰧞󰧟󰧾󰨤󰨮󰨾󰨿󰩀󰩎󰩍󰩤󰩭󰩮󰩨󰩫󰩬󰩷󰩺󰪒󰪚󰪛󰪮󰪺󰪻󰬴󰬵󰬶󰭛󰭜󰮓󰮝󰮞󰮥󰮦󰮫󰮱󰮳󰯍󰯎󰯟󰱒󰲋󰲌󰆍󰲏󰲎󰳏󰳤󰳾󰴊󰴌󰴍󰴑󰴱󰵮󰶯󰶵󰷉󰷋󰷍󰷎󰷏󰷐󰷜󰷾󰸌󰸲󰹑󰹖󰹸󰺧󰺩󰺫󰺭󰺯󰻀󰻭󰼬󰽘󰽛󰾹󰿇󱀫󱀰󱀱󱀷󱀶󱀸󱀻󱁛󱁼󱂀󱂆󱂕󱂛󱂵󱂶󱂸󱃖󱃶󱃸󱃺󱃼󱄀󱄁󱃿󱄄󱄋󱄌󱄍󱄊󱄽󱅇󱅈󱅉󱅿󱆃󱇏󱇎󱇬󱈔󱈕󱉸󱊕󱊔󱊖󱊗󱊘󱊙󱊚󱊛󱊜󱊝󱊫󱊬󱊭󱊮󱊯󱊰󱊱󱊲󱊳󱊴󱊵󱊶󱊷󱋌󱋖󱍦󱍨󱍪󱍫󱍭󱍯󱍾󱎄󱎅󱎆󱎇󱎈󱎉󱎊󱎎󱎏󱎐󱎑󱎒󱎘󱎚󱎛󱎜󱎢󱎣󱎤󱎥󱎧󱎨󱎩󱎴󱏒󱐀󱐁󱓉󱔁󱖫</i>',
    //   html: true,
    //   class: ['mdi'],
    // },
    // {
    //   type: 'url',
    //   url: 'https://github.com/{repo-owner}/{repo-name}',
    //   tooltip: 'Open on Github',
    //   icon: 'git',
    //   iconset: 'mdi',
    // },
    // {
    //   type: 'file',
    //   file: '/README.md',
    //   tooltip: 'Open File',
    //   icon: 'file',
    //   iconset: 'mdi',
    // },
    // {
    //   type: 'function',
    //   callback: function (editor) {
    //     console.log(editor);
    //     alert('fuck');
    //   },
    //   tooltip: 'Run Function',
    //   icon: 'function',
    //   iconset: 'mdi',
    // },
    // {
    //   type: 'button',
    //   icon: 'columns',
    //   iconset: 'fa',
    //   callback: [ 'pane:split-right', 'pane:split-right' ],
    // },
];
