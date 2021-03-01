module.exports = [
  {
    type: "url",
    iconset: "mdi",
    icon: "git",
    url: "https://github.com/{repo-owner}/{repo-name}",
    tooltip: "Open on Github",
  },
  { type: "spacer" },
  {
    type: "button",
    callback: [ "window:toggle-dev-tools" ],
    tooltip: "Dev Tools",
    icon: "console",
    iconset: "mdi",
  },
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