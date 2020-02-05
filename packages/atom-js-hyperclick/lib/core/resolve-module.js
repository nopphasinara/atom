"use babel"
// @flow
import path from "path"
import fs from "fs"
import { sync as resolve } from "resolve"
import type { Resolved } from "../types"
import get from "lodash/get"

// Default comes from Node's `require.extensions`
const defaultExtensions = [".js", ".json", ".node", ".vue"]
type ResolveOptions = {
  extensions?: typeof defaultExtensions,
}

function getProjectPath(activePanePath) {
  const [projectPath] = atom.project.relativizePath(activePanePath)
  return projectPath
}

function findPackageJson(basedir) {
  const packagePath = path.resolve(basedir, "package.json")
  try {
    fs.accessSync(packagePath)
  } catch (e) {
    const parent = path.resolve(basedir, "../")
    if (parent != basedir) {
      return findPackageJson(parent)
    }
    return undefined
  }
  return packagePath
}

function loadModuleRoots(basedir) {
  const packagePath = findPackageJson(basedir)
  if (!packagePath) {
    return
  }
  const config = JSON.parse(String(fs.readFileSync(packagePath)))

  if (config && config.moduleRoots) {
    let roots = config.moduleRoots
    if (typeof roots === "string") {
      roots = [roots]
    }

    const packageDir = path.dirname(packagePath)
    return roots.map(r => path.resolve(packageDir, r))
  }
}

function resolveWithCustomRoots(basedir, absoluteModule, options) {
  const { extensions = defaultExtensions } = options
  const moduleName = `./${absoluteModule}`

  const roots = loadModuleRoots(basedir)

  if (roots) {
    const resolveOptions = { basedir, extensions }
    for (let i = 0; i < roots.length; i++) {
      resolveOptions.basedir = roots[i]

      try {
        return resolve(moduleName, resolveOptions)
      } catch (e) {
        /* do nothing */
      }
    }
  }
}

function fetchWebpackConfig(basedir) {
  const webpackConfigFilename = atom.config.get(
    "js-hyperclick.webpackConfigFilename",
  )
  const webpackConfigPath = path.join(
    getProjectPath(basedir),
    webpackConfigFilename,
  )
  try {
    return require(webpackConfigPath) // eslint-disable-line
  } catch (error) {
    console.error("Failed to load webpack config") // eslint-disable-line
    console.error(error) // eslint-disable-line
    return {}
  }
}

function resolveWithWebpackAlias(basedir, absoluteModule, options) {
  if (atom.config.get("js-hyperclick.webpack")) {
    const { extensions = defaultExtensions } = options
    const webpackConfig = fetchWebpackConfig(basedir)
    const webpackAliases = get(webpackConfig, "resolve.alias", {})
    const matchingAliases = Object.keys(webpackAliases)
      .filter(
        alias =>
          absoluteModule === alias || absoluteModule.startsWith(`${alias}/`),
      )
      .map(alias => {
        if (alias === absoluteModule) {
          return webpackAliases[alias]
        }
        const moduleSplit = absoluteModule.split("/")
        const subpath = moduleSplit.slice(1).join("/")
        return path.join(webpackAliases[alias], subpath)
      })
    if (matchingAliases.length > 0) {
      const resolveOptions = { basedir, extensions }
      return resolve(matchingAliases[0], resolveOptions)
    }
  }
}

function resolveWithVue(basedir, text, options) {
  // console.log('basedir', basedir)
  // console.log('text', text)
  // console.log('options', options)
  if (text.startsWith(`@/`) && basedir.indexOf('\\src\\') >-1) {
    const extName = path.extname(text)
    const basename = path.basename(text)
    const s = basedir.substr(0,basedir.indexOf('\\src\\')+4)
    const t = text.substr(text.indexOf('@')+1)
    let target = path.normalize(`${s}${t}`)
    // console.log('target', target)
    if (extName === '') {
      if ( fs.existsSync(`${target}.vue` ) ) {
        target += '.vue'
      } else if (fs.existsSync(`${target}.js`)) {
        target += '.js'
      } else {
        target += '/index'
        if ( fs.existsSync(`${target}.vue`) ) {
          target += '.vue'
        } else if( fs.existsSync(`${target}.js`) ) {
          target += '.js'
        }
      }
    }
    return target
  }
}

export default function resolveModule(
  filePath: string,
  suggestion: { moduleName: string },
  options: ResolveOptions = {},
): Resolved {
  const { extensions = defaultExtensions } = options
  let { moduleName } = suggestion

  const basedir = path.dirname(filePath)
  const resolveOptions = { basedir, extensions }

  let filename
  // console.log('resolveOptions', resolveOptions)
  try {
    filename = resolve(moduleName, resolveOptions)
    if (filename == moduleName) {
      return {
        type: "url",
        url: `http://nodejs.org/api/${moduleName}.html`,
      }
    }
  } catch (e) {
    /* do nothing */
  }

  // Allow linking to relative files that don't exist yet.
  // console.log('filename', filename)
  // console.log('moduleName', moduleName)
  if (!filename && moduleName[0] === ".") {
    if (path.extname(moduleName) == "") {
      moduleName += ".js"
    }

    filename = path.join(basedir, moduleName)
  } else if (!filename) {
    filename = resolveWithCustomRoots(basedir, moduleName, options)
    // console.log('filename2',filename)
    if (!filename) {
      filename = resolveWithWebpackAlias(basedir, moduleName, options)
      // console.log('filename3', filename)
      if (!filename) {
        filename = resolveWithVue(basedir, moduleName, options)
      }
    }
  }

  return { type: "file", filename }
}
