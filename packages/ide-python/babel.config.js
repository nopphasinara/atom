let presets = ["babel-preset-atomic"]

let plugins = []

module.exports = {
  presets: presets,
  plugins: plugins,
  exclude: ["node_modules/**", "lib/debugger/VendorLib/**"],
  sourceMap: "inline",
}
