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

module.exports = [
  // {
  //   type: "button",
  //   callback: {
  //     "": function (editor) {
  //       replConsole_RunCode(editor);
  //     },
  //     "shift": function (editor) {
  //       console.clear();
  //       replConsole_RunCode(editor);
  //     },
  //   },
  //   text: "<i>󰚌</i>",
  //   html: true,
  //   class: ["mdi", "bg-error", "fg-selected", "fg-warning-hover"],
  //   // show: {
  //   //   grammar: [
  //   //     "js",
  //   //     "json",
  //   //     "php",
  //   //   ],
  //   // },
  // },
  {
    type: "button",
    callback: {
      "": "window:reload",
    },
    tooltip: "Reload Window",
    text: "<i class='fg-selected fg-warning-hover'>󰇥</i>",
    html: true,
    class: ["mdi", "bg-warning", "bg-warning-hover"],
  },
  { type: "spacer" },
  {
    type: "url",
    url: "https://github.com/{repo-owner}/{repo-name}",
    tooltip: "Open on Github",
    text: "<i>󰊢</i>",
    html: true,
    class: ["mdi"],
  },
  {
    type: "button",
    callback: {
      "": "git-menu:discard-changes",
    },
    tooltip: "Discard Changes",
    text: "<i>󰊢</i>",
    html: true,
    class: ["mdi"],
  },
  {
    type: "button",
    callback: {
      "": "split-diff:toggle",
    },
    tooltip: "Split Diff",
    text: "<i>󰪚</i>",
    html: true,
    class: ["mdi"],
  },
  {
    type: "button",
    callback: {
      "": "symbols-list:toggle",
    },
    tooltip: "Symbol List",
    text: "<i>󰙮</i>",
    html: true,
    class: ["mdi"],
  },
  {
    type: "button",
    callback: {
      "": "git-history:show-file-history",
    },
    tooltip: "Git History",
    text: "<i>󰚰</i>",
    html: true,
    class: ["mdi"],
  },
  { type: "spacer" },
  {
    type: "button",
    callback: {
      "": "window:toggle-dev-tools",
    },
    text: "<i>󰲌</i>",
    html: true,
    class: ["mdi"],
  },
  { type: "spacer" },
  {
    type: "button",
    callback: {
      "": "markdown-preview:toggle",
    },
    text: "<i>󰍔</i>",
    html: true,
    class: ["mdi"],
    show: {
      grammar: [
        "Markdown",
      ],
    },
  },
  {
    type: "button",
    callback: {
      "": "chrome-color-picker:toggle",
      "alt": "chrome-color-picker:pickcolor",
    },
    text: "<i>󰈋</i>",
    html: true,
    show: {
      function: () => {
        return !atom.packages.isPackageDisabled('chrome-color-picker');
      },
    },
    class: ["mdi"],
  },
  {
    type: "button",
    callback: {
      "": function (editor) {
        console.log(getCursorScopes('chain'));
      },
      "shift": function (editor) {
        console.log(getCursorScopes('array'));
      },
      "alt": function (editor) {
        let scopeChain = getCursorScopes('chain') || '';
        if (scopeChain) {
          console.log(scopeChain);
          atom.clipboard.write(scopeChain);
        }
      },
    },
    tooltip: "Cursor Scope, To Array (󰜷󰍽)",
    text: "<i>x</i>",
    html: true,
    class: ["mdi"],
  },
  {
    type: "button",
    callback: {
      "": "emmet:increment-number-by-1",
      "shift": "emmet:increment-number-by-10",
      "alt": "emmet:decrement-number-by-1",
      "alt+shift": "emmet:decrement-number-by-10",
    },
    tooltip: "+1",
    text: "<i>󰃬</i>",
    html: true,
    class: ["mdi"],
  },
  {
    type: "button",
    callback: {
      "": "",
    },
    tooltip: "+1",
    text: "<i class=''>󰂔</i>",
    html: true,
    class: ["mdi", "bg-error", "bg-warning-hover"],
  },
  {
    type: "button",
    callback: {
      "": "flex-tool-bar:edit-config-file",
    },
    tooltip: "Edit Tool Bar",
    text: "<i class='fg-selected fg-error-hover'>󰊬</i><i class='fg-error fg-warning-hover'>󰚍</i>",
    html: true,
    class: ["mdi-stack"],
  },
  // { type: "spacer" },
  // {
  //   type: "button",
  //   callback: {
  //     "": "",
  //   },
  //   text: "<i>󰌞󰌝󰌟󰌧󰌨󰌴󰌹󰍓 󰍕󰍜󰍣󰍺󰍹󰍻󰍽󰎂 󰎔󰎙󰎝󰎠󰏋󰏌󰏑󰏔 󰏕󰏘󰏯󰏰󰐏󰐒󰐓󰐕 󰐣󰐤󰐭󰐰󰑇󰑋󰑐󰑑 󰑒󰑓󰑕󰑖󰑘󰑙󰑥󰑧 󰒍󰒓󰒟󰒲󰒻󰒺󰒾󰓂 󰓆󰓢󰓡󰓦󰓧󰓾󰕅󰕎 󰕏󰕕󰕒󰖶󰖽󰖿󰗀󰗇󰗊󰗠󰗡󰗨󰘎󰘞󰘢󰘡󰘣󰘥󰘦󰘧󰘨󰘬󰘮󰘲󰘳󰘴󰘵󰘶󰙁󰙆󰙖󰙪󰙩󰙰󰙲󰚈󰚑󰚔󰚖󰚝󰚧󰚲󰚹󰚽󰛄󰛉󰛦󰛬󰛭󰜄󰜉󰝉󰝓󰝕󰝖󰝔󰝗󰝠󰝡󰝰󰞷󰡰󰡱󰢹󰣀󰣞󰤀󰤌󰤍󰤘󰥦󰥨󰥩󰥪󰥻󰦄󰦍󰦎󰦏󰦐󰦒󰦓󰦛󰦣󰦪󰧞󰧟󰧾󰨤󰨮󰨾󰨿󰩀󰩎󰩍󰩤󰩭󰩮󰩨󰩫󰩬󰩷󰩺󰪒󰪚󰪛󰪮󰪺󰪻󰬴󰬵󰬶󰭛󰭜󰮓󰮝󰮞󰮥󰮦󰮫󰮱󰮳󰯍󰯎󰯟󰱒󰲋󰲌󰆍󰲏󰲎󰳏󰳤󰳾󰴊󰴌󰴍󰴑󰴱󰵮󰶯󰶵󰷉󰷋󰷍󰷎󰷏󰷐󰷜󰷾󰸌󰸲󰹑󰹖󰹸󰺧󰺩󰺫󰺭󰺯󰻀󰻭󰼬󰽘󰽛󰾹󰿇󱀫󱀰󱀱󱀷󱀶󱀸󱀻󱁛󱁼󱂀󱂆󱂕󱂛󱂵󱂶󱂸󱃖󱃶󱃸󱃺󱃼󱄀󱄁󱃿󱄄󱄋󱄌󱄍󱄊󱄽󱅇󱅈󱅉󱅿󱆃󱇏󱇎󱇬󱈔󱈕󱉸󱊕󱊔󱊖󱊗󱊘󱊙󱊚󱊛󱊜󱊝󱊫󱊬󱊭󱊮󱊯󱊰󱊱󱊲󱊳󱊴󱊵󱊶󱊷󱋌󱋖󱍦󱍨󱍪󱍫󱍭󱍯󱍾󱎄󱎅󱎆󱎇󱎈󱎉󱎊󱎎󱎏󱎐󱎑󱎒󱎘󱎚󱎛󱎜󱎢󱎣󱎤󱎥󱎧󱎨󱎩󱎴󱏒󱐀󱐁󱓉󱔁󱖫</i>",
  //   html: true,
  //   class: ["mdi"],
  // },
  // {
  //   type: "url",
  //   url: "https://github.com/{repo-owner}/{repo-name}",
  //   tooltip: "Open on Github",
  //   icon: "git",
  //   iconset: "mdi",
  // },
  // {
  //   type: "file",
  //   file: "/README.md",
  //   tooltip: "Open File",
  //   icon: "file",
  //   iconset: "mdi",
  // },
  // {
  //   type: "function",
  //   callback: function (editor) {
  //     console.log(editor);
  //     alert("fuck");
  //   },
  //   tooltip: "Run Function",
  //   icon: "function",
  //   iconset: "mdi",
  // },
  // {
  //   type: "button",
  //   icon: "columns",
  //   iconset: "fa",
  //   callback: [ "pane:split-right", "pane:split-right" ],
  // },
];
