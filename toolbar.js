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

module.exports = [
  {
    type: "button",
    callback: {
      "": "window:reload",
    },
    text: "<i>󰇥</i>",
    html: true,
    class: [ "mdi" ],
  },
  { type: "spacer" },
  {
    type: "url",
    url: "https://github.com/{repo-owner}/{repo-name}",
    text: "<i>󰊢</i>",
    html: true,
    class: [ "mdi" ],
  },
  { type: "spacer" },
  {
    type: "button",
    callback: {
      "": "window:toggle-dev-tools",
    },
    text: "<i>󰲌</i>",
    html: true,
    class: [ "mdi" ],
  },
  { type: "spacer" },
  {
    type: "button",
    callback: {
      "": "markdown-preview:toggle",
    },
    text: "<i>󰍔</i>",
    html: true,
    class: [ "mdi" ],
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
    class: [ "mdi" ],
    show: {
      function: () => {
        return !atom.packages.isPackageDisabled('chrome-color-picker');
      },
    },
  },
  {
    type: "button",
    callback: {
      "": function (editor) {
        replConsole_RunCode(editor);
      },
      "shift": function (editor) {
        console.clear();
        replConsole_RunCode(editor);
      },
    },
    text: "<i>󰚌</i>",
    html: true,
    class: [ "mdi", "bg-error", "bg-hover-warning", "fg-highlight", "fg-hover-color" ],
    // show: {
    //   grammar: [
    //     "js",
    //     "json",
    //     "php",
    //   ],
    // },
  },
  // {
  //   type: "button",
  //   callback: {
  //     "": "",
  //   },
  //   text: "<i>󰌞󰌝󰌟󰌧󰌨󰌴󰌹󰍓 󰍕󰍜󰍣󰍺󰍹󰍻󰍽󰎂 󰎔󰎙󰎝󰎠󰏋󰏌󰏑󰏔 󰏕󰏘󰏯󰏰󰐏󰐒󰐓󰐕 󰐣󰐤󰐭󰐰󰑇󰑋󰑐󰑑 󰑒󰑓󰑕󰑖󰑘󰑙󰑥󰑧 󰒍󰒓󰒟󰒲󰒻󰒺󰒾󰓂 󰓆󰓢󰓡󰓦󰓧󰓾󰕅󰕎 󰕏󰕕󰕒󰖶󰖽󰖿󰗀󰗇󰗊󰗠󰗡󰗨󰘎󰘞󰘢󰘡󰘣󰘥󰘦󰘧󰘨󰘬󰘮󰘲󰘳󰘴󰘵󰘶󰙁󰙆󰙖󰙪󰙩󰙰󰙲󰚈󰚑󰚔󰚖󰚝󰚧󰚲󰚹󰚽󰛄󰛉󰛦󰛬󰛭󰜄󰜉󰝉󰝓󰝕󰝖󰝔󰝗󰝠󰝡󰝰󰞷󰡰󰡱󰢹󰣀󰣞󰤀󰤌󰤍󰤘󰥦󰥨󰥩󰥪󰥻󰦄󰦍󰦎󰦏󰦐󰦒󰦓󰦛󰦣󰦪󰧞󰧟󰧾󰨤󰨮󰨾󰨿󰩀󰩎󰩍󰩤󰩭󰩮󰩨󰩫󰩬󰩷󰩺󰪒󰪚󰪛󰪮󰪺󰪻󰬴󰬵󰬶󰭛󰭜󰮓󰮝󰮞󰮥󰮦󰮫󰮱󰮳󰯍󰯎󰯟󰱒󰲋󰲌󰆍󰲏󰲎󰳏󰳤󰳾󰴊󰴌󰴍󰴑󰴱󰵮󰶯󰶵󰷉󰷋󰷍󰷎󰷏󰷐󰷜󰷾󰸌󰸲󰹑󰹖󰹸󰺧󰺩󰺫󰺭󰺯󰻀󰻭󰼬󰽘󰽛󰾹󰿇󱀫󱀰󱀱󱀷󱀶󱀸󱀻󱁛󱁼󱂀󱂆󱂕󱂛󱂵󱂶󱂸󱃖󱃶󱃸󱃺󱃼󱄀󱄁󱃿󱄄󱄋󱄌󱄍󱄊󱄽󱅇󱅈󱅉󱅿󱆃󱇏󱇎󱇬󱈔󱈕󱉸󱊕󱊔󱊖󱊗󱊘󱊙󱊚󱊛󱊜󱊝󱊫󱊬󱊭󱊮󱊯󱊰󱊱󱊲󱊳󱊴󱊵󱊶󱊷󱋌󱋖󱍦󱍨󱍪󱍫󱍭󱍯󱍾󱎄󱎅󱎆󱎇󱎈󱎉󱎊󱎎󱎏󱎐󱎑󱎒󱎘󱎚󱎛󱎜󱎢󱎣󱎤󱎥󱎧󱎨󱎩󱎴󱏒󱐀󱐁󱓉󱔁󱖫</i>",
  //   html: true,
  //   class: [ "mdi" ],
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
