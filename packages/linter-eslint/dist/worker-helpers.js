"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.didRulesChange = didRulesChange;
exports.findESLintDirectory = findESLintDirectory;
exports.getCLIEngineOptions = getCLIEngineOptions;
exports.getConfigForFile = getConfigForFile;
exports.getESLintFromDirectory = getESLintFromDirectory;
exports.getESLintInstance = getESLintInstance;
exports.getNodePrefixPath = getNodePrefixPath;
exports.getRelativePath = getRelativePath;
exports.getRules = getRules;
exports.log = log;
exports.refreshModulesPath = refreshModulesPath;

var _path = _interopRequireDefault(require("path"));

var _util = _interopRequireDefault(require("util"));

var _fsPlus = _interopRequireDefault(require("fs-plus"));

var _child_process = _interopRequireDefault(require("child_process"));

var _resolveEnv = _interopRequireDefault(require("resolve-env"));

var _atomLinter = require("atom-linter");

var _consistentPath = _interopRequireDefault(require("consistent-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global emit */
const Cache = {
  ESLINT_LOCAL_PATH: _path.default.normalize(_path.default.join(__dirname, '..', 'node_modules', 'eslint')),
  NODE_PREFIX_PATH: null,
  LAST_MODULES_PATH: null
};
/**
 * Takes a path and translates `~` to the user's home directory, and replaces
 * all environment variables with their value.
 * @param  {string} path The path to remove "strangeness" from
 * @return {string}      The cleaned path
 */

const cleanPath = path => path ? (0, _resolveEnv.default)(_fsPlus.default.normalize(path)) : '';
/**
 * @returns {string}
 */


function getNodePrefixPath() {
  if (Cache.NODE_PREFIX_PATH === null) {
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    try {
      Cache.NODE_PREFIX_PATH = _child_process.default.spawnSync(npmCommand, ['get', 'prefix'], {
        env: { ...process.env,
          PATH: (0, _consistentPath.default)()
        }
      }).output[1].toString().trim();
    } catch (e) {
      const errMsg = 'Unable to execute `npm get prefix`. Please make sure ' + 'Atom is getting $PATH correctly.';
      throw new Error(errMsg);
    }
  }

  return Cache.NODE_PREFIX_PATH;
}
/**
 * @param {string} dirPath
 * @returns {boolean}
 */


function isDirectory(dirPath) {
  let isDir;

  try {
    isDir = _fsPlus.default.statSync(dirPath).isDirectory();
  } catch (e) {
    isDir = false;
  }

  return isDir;
}

let fallbackForGlobalErrorThrown = false;
/**
 * @param {string} modulesDir
 * @param {object} config
 * @param {string} projectPath
 * @param {boolean} fallbackForGlobal
 * @returns {{ path: string, type: 'local project' | 'global' | 'advanced specified' | 'bundled fallback' }}
 */

function findESLintDirectory(modulesDir, config, projectPath, fallbackForGlobal = false) {
  let eslintDir = null;
  let locationType = null;

  if (config.global.useGlobalEslint && !fallbackForGlobal) {
    locationType = 'global';
    const configGlobal = cleanPath(config.global.globalNodePath);
    const prefixPath = configGlobal || getNodePrefixPath(); // NPM on Windows and Yarn on all platforms

    eslintDir = _path.default.join(prefixPath, 'node_modules', 'eslint');

    if (!isDirectory(eslintDir)) {
      // NPM on platforms other than Windows
      eslintDir = _path.default.join(prefixPath, 'lib', 'node_modules', 'eslint');
    }
  } else if (!config.advanced.localNodeModules) {
    locationType = 'local project';
    eslintDir = _path.default.join(modulesDir || '', 'eslint');
  } else if (_path.default.isAbsolute(cleanPath(config.advanced.localNodeModules))) {
    locationType = 'advanced specified';
    eslintDir = _path.default.join(cleanPath(config.advanced.localNodeModules), 'eslint');
  } else {
    locationType = 'advanced specified';
    eslintDir = _path.default.join(projectPath || '', cleanPath(config.advanced.localNodeModules), 'eslint');
  }

  if (isDirectory(eslintDir)) {
    return {
      path: eslintDir,
      type: locationType
    };
  }

  if (config.global.useGlobalEslint && !fallbackForGlobal) {
    if (!fallbackForGlobalErrorThrown) {
      // Throw the error only once to prevent performance issues
      fallbackForGlobalErrorThrown = true;
      console.error(`Global ESLint is not found, falling back to other Eslint installations...
        Please ensure the global Node path is set correctly.
        If you wanted to use a local installation of Eslint, disable Global Eslint option in the linter-eslint config.`);
    }

    return findESLintDirectory(modulesDir, config, projectPath, true);
  }

  return {
    path: Cache.ESLINT_LOCAL_PATH,
    type: 'bundled fallback'
  };
}
/**
 * @param {string} modulesDir
 * @param {object} config
 * @param {string} projectPath
 * @returns {import("eslint")}
 */


function getESLintFromDirectory(modulesDir, config, projectPath) {
  const {
    path: ESLintDirectory
  } = findESLintDirectory(modulesDir, config, projectPath);

  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(ESLintDirectory);
  } catch (e) {
    if (config.global.useGlobalEslint && e.code === 'MODULE_NOT_FOUND') {
      throw new Error('ESLint not found, try restarting Atom to clear caches.');
    } // eslint-disable-next-line import/no-dynamic-require


    return require(Cache.ESLINT_LOCAL_PATH);
  }
}
/**
 * @param {string} modulesDir
 */


function refreshModulesPath(modulesDir) {
  if (Cache.LAST_MODULES_PATH !== modulesDir) {
    Cache.LAST_MODULES_PATH = modulesDir;
    process.env.NODE_PATH = modulesDir || ''; // eslint-disable-next-line no-underscore-dangle

    require('module').Module._initPaths();
  }
}
/**
 * @param {string} fileDir
 * @param {object} config
 * @param {string} projectPath
 * @returns {import("eslint")}
 */


function getESLintInstance(fileDir, config, projectPath) {
  const modulesDir = _path.default.dirname((0, _atomLinter.findCached)(fileDir, 'node_modules/eslint') || '');

  refreshModulesPath(modulesDir);
  return getESLintFromDirectory(modulesDir, config, projectPath);
}
/**
 * console.log
 * @param  {any} args
 * @return {void}
 */


function log(...args) {
  const obj = args.length === 1 ? args[0] : args;
  let str;

  try {
    str = JSON.stringify(obj);
  } catch (e) {
    str = _util.default.inspect(obj);
  }

  emit('log', str);
}
/**
 * @param {import("eslint")} eslint
 * @param {string} filePath
 */


function getConfigForFile(eslint, filePath) {
  const cli = new eslint.CLIEngine();

  try {
    return cli.getConfigForFile(filePath);
  } catch (e) {
    // No configuration was found
    return null;
  }
}
/**
 * @param {string} fileDir
 * @param {string} filePath
 * @param {object} config
 * @param {string} projectPath
 * @returns {string}
 */


function getRelativePath(fileDir, filePath, config, projectPath) {
  const ignoreFile = config.advanced.disableEslintIgnore ? null : (0, _atomLinter.findCached)(fileDir, '.eslintignore'); // If we can find an .eslintignore file, we can set cwd there
  // (because they are expected to be at the project root)

  if (ignoreFile) {
    const ignoreDir = _path.default.dirname(ignoreFile);

    process.chdir(ignoreDir);
    return _path.default.relative(ignoreDir, filePath);
  } // Otherwise, we'll set the cwd to the atom project root as long as that exists


  if (projectPath) {
    process.chdir(projectPath);
    return _path.default.relative(projectPath, filePath);
  } // If all else fails, use the file location itself


  process.chdir(fileDir);
  return _path.default.basename(filePath);
}
/**
 * @param {string} type
 * @param {string[]} rules
 * @param {object} config
 * @param {string} filePath
 * @param {object} fileConfig
 */


function getCLIEngineOptions(type, config, rules, filePath, fileConfig) {
  const cliEngineConfig = {
    rules,
    ignore: !config.advanced.disableEslintIgnore,
    fix: type === 'fix'
  };
  cliEngineConfig.rulePaths = config.advanced.eslintRulesDirs.map(path => {
    const rulesDir = cleanPath(path);

    if (!_path.default.isAbsolute(rulesDir)) {
      return (0, _atomLinter.findCached)(_path.default.dirname(filePath), rulesDir);
    }

    return rulesDir;
  }).filter(path => path);

  if (fileConfig === null && config.global.eslintrcPath) {
    // If we didn't find a configuration use the fallback from the settings
    cliEngineConfig.configFile = cleanPath(config.global.eslintrcPath);
  }

  return cliEngineConfig;
}
/**
 * Gets the list of rules used for a lint job
 * @param  {import("eslint").CLIEngine} cliEngine The CLIEngine instance used for the lint job
 * @return {Map}              A Map of the rules used, rule names as keys, rule
 *                            properties as the contents.
 */


function getRules(cliEngine) {
  // Pull the list of rules used directly from the CLIEngine
  if (typeof cliEngine.getRules === 'function') {
    return cliEngine.getRules();
  } // Attempt to use the internal (undocumented) `linter` instance attached to
  // the CLIEngine to get the loaded rules (including plugin rules).
  // Added in ESLint v4


  if (Object.prototype.hasOwnProperty.call(cliEngine, 'linter')) {
    return cliEngine.linter.getRules();
  } // Older versions of ESLint don't (easily) support getting a list of rules


  return new Map();
}
/**
 * Given an exiting rule list and a new rule list, determines whether there
 * have been changes.
 * NOTE: This only accounts for presence of the rules, changes to their metadata
 * are not taken into account.
 * @param  {Map} newRules     A Map of the new rules
 * @param  {Map} currentRules A Map of the current rules
 * @return {boolean}             Whether or not there were changes
 */


function didRulesChange(currentRules, newRules) {
  return !(currentRules.size === newRules.size && Array.from(currentRules.keys()).every(ruleId => newRules.has(ruleId)));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93b3JrZXItaGVscGVycy5qcyJdLCJuYW1lcyI6WyJDYWNoZSIsIkVTTElOVF9MT0NBTF9QQVRIIiwiUGF0aCIsIm5vcm1hbGl6ZSIsImpvaW4iLCJfX2Rpcm5hbWUiLCJOT0RFX1BSRUZJWF9QQVRIIiwiTEFTVF9NT0RVTEVTX1BBVEgiLCJjbGVhblBhdGgiLCJwYXRoIiwiZnMiLCJnZXROb2RlUHJlZml4UGF0aCIsIm5wbUNvbW1hbmQiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJDaGlsZFByb2Nlc3MiLCJzcGF3blN5bmMiLCJlbnYiLCJQQVRIIiwib3V0cHV0IiwidG9TdHJpbmciLCJ0cmltIiwiZSIsImVyck1zZyIsIkVycm9yIiwiaXNEaXJlY3RvcnkiLCJkaXJQYXRoIiwiaXNEaXIiLCJzdGF0U3luYyIsImZhbGxiYWNrRm9yR2xvYmFsRXJyb3JUaHJvd24iLCJmaW5kRVNMaW50RGlyZWN0b3J5IiwibW9kdWxlc0RpciIsImNvbmZpZyIsInByb2plY3RQYXRoIiwiZmFsbGJhY2tGb3JHbG9iYWwiLCJlc2xpbnREaXIiLCJsb2NhdGlvblR5cGUiLCJnbG9iYWwiLCJ1c2VHbG9iYWxFc2xpbnQiLCJjb25maWdHbG9iYWwiLCJnbG9iYWxOb2RlUGF0aCIsInByZWZpeFBhdGgiLCJhZHZhbmNlZCIsImxvY2FsTm9kZU1vZHVsZXMiLCJpc0Fic29sdXRlIiwidHlwZSIsImNvbnNvbGUiLCJlcnJvciIsImdldEVTTGludEZyb21EaXJlY3RvcnkiLCJFU0xpbnREaXJlY3RvcnkiLCJyZXF1aXJlIiwiY29kZSIsInJlZnJlc2hNb2R1bGVzUGF0aCIsIk5PREVfUEFUSCIsIk1vZHVsZSIsIl9pbml0UGF0aHMiLCJnZXRFU0xpbnRJbnN0YW5jZSIsImZpbGVEaXIiLCJkaXJuYW1lIiwibG9nIiwiYXJncyIsIm9iaiIsImxlbmd0aCIsInN0ciIsIkpTT04iLCJzdHJpbmdpZnkiLCJVdGlsIiwiaW5zcGVjdCIsImVtaXQiLCJnZXRDb25maWdGb3JGaWxlIiwiZXNsaW50IiwiZmlsZVBhdGgiLCJjbGkiLCJDTElFbmdpbmUiLCJnZXRSZWxhdGl2ZVBhdGgiLCJpZ25vcmVGaWxlIiwiZGlzYWJsZUVzbGludElnbm9yZSIsImlnbm9yZURpciIsImNoZGlyIiwicmVsYXRpdmUiLCJiYXNlbmFtZSIsImdldENMSUVuZ2luZU9wdGlvbnMiLCJydWxlcyIsImZpbGVDb25maWciLCJjbGlFbmdpbmVDb25maWciLCJpZ25vcmUiLCJmaXgiLCJydWxlUGF0aHMiLCJlc2xpbnRSdWxlc0RpcnMiLCJtYXAiLCJydWxlc0RpciIsImZpbHRlciIsImVzbGludHJjUGF0aCIsImNvbmZpZ0ZpbGUiLCJnZXRSdWxlcyIsImNsaUVuZ2luZSIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImxpbnRlciIsIk1hcCIsImRpZFJ1bGVzQ2hhbmdlIiwiY3VycmVudFJ1bGVzIiwibmV3UnVsZXMiLCJzaXplIiwiQXJyYXkiLCJmcm9tIiwia2V5cyIsImV2ZXJ5IiwicnVsZUlkIiwiaGFzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBUkE7QUFVQSxNQUFNQSxLQUFLLEdBQUc7QUFDWkMsRUFBQUEsaUJBQWlCLEVBQUVDLGNBQUtDLFNBQUwsQ0FBZUQsY0FBS0UsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLGNBQTNCLEVBQTJDLFFBQTNDLENBQWYsQ0FEUDtBQUVaQyxFQUFBQSxnQkFBZ0IsRUFBRSxJQUZOO0FBR1pDLEVBQUFBLGlCQUFpQixFQUFFO0FBSFAsQ0FBZDtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFNQyxTQUFTLEdBQUlDLElBQUQsSUFBV0EsSUFBSSxHQUFHLHlCQUFXQyxnQkFBR1AsU0FBSCxDQUFhTSxJQUFiLENBQVgsQ0FBSCxHQUFvQyxFQUFyRTtBQUVBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0Us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cGF0aCdcbmltcG9ydCBVdGlsIGZyb20gJ3V0aWwnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBDaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCByZXNvbHZlRW52IGZyb20gJ3Jlc29sdmUtZW52J1xuaW1wb3J0IHsgZmluZENhY2hlZCB9IGZyb20gJ2F0b20tbGludGVyJ1xuaW1wb3J0IGdldFBhdGggZnJvbSAnY29uc2lzdGVudC1wYXRoJ1xuXG5jb25zdCBDYWNoZSA9IHtcbiAgRVNMSU5UX0xPQ0FMX1BBVEg6IFBhdGgubm9ybWFsaXplKFBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdub2RlX21vZHVsZXMnLCAnZXNsaW50JykpLFxuICBOT0RFX1BSRUZJWF9QQVRIOiBudWxsLFxuICBMQVNUX01PRFVMRVNfUEFUSDogbnVsbFxufVxuXG4vKipcbiAqIFRha2VzIGEgcGF0aCBhbmQgdHJhbnNsYXRlcyBgfmAgdG8gdGhlIHVzZXIncyBob21lIGRpcmVjdG9yeSwgYW5kIHJlcGxhY2VzXG4gKiBhbGwgZW52aXJvbm1lbnQgdmFyaWFibGVzIHdpdGggdGhlaXIgdmFsdWUuXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gcmVtb3ZlIFwic3RyYW5nZW5lc3NcIiBmcm9tXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgVGhlIGNsZWFuZWQgcGF0aFxuICovXG5jb25zdCBjbGVhblBhdGggPSAocGF0aCkgPT4gKHBhdGggPyByZXNvbHZlRW52KGZzLm5vcm1hbGl6ZShwYXRoKSkgOiAnJylcblxuLyoqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZVByZWZpeFBhdGgoKSB7XG4gIGlmIChDYWNoZS5OT0RFX1BSRUZJWF9QQVRIID09PSBudWxsKSB7XG4gICAgY29uc3QgbnBtQ29tbWFuZCA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgPyAnbnBtLmNtZCcgOiAnbnBtJ1xuICAgIHRyeSB7XG4gICAgICBDYWNoZS5OT0RFX1BSRUZJWF9QQVRIID0gQ2hpbGRQcm9jZXNzLnNwYXduU3luYyhucG1Db21tYW5kLCBbJ2dldCcsICdwcmVmaXgnXSwge1xuICAgICAgICBlbnY6IHsgLi4ucHJvY2Vzcy5lbnYsIFBBVEg6IGdldFBhdGgoKSB9XG4gICAgICB9KS5vdXRwdXRbMV0udG9TdHJpbmcoKS50cmltKClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zdCBlcnJNc2cgPSAnVW5hYmxlIHRvIGV4ZWN1dGUgYG5wbSBnZXQgcHJlZml4YC4gUGxlYXNlIG1ha2Ugc3VyZSAnXG4gICAgICAgICsgJ0F0b20gaXMgZ2V0dGluZyAkUEFUSCBjb3JyZWN0bHkuJ1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIENhY2hlLk5PREVfUFJFRklYX1BBVEhcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlyUGF0aFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzRGlyZWN0b3J5KGRpclBhdGgpIHtcbiAgbGV0IGlzRGlyXG4gIHRyeSB7XG4gICAgaXNEaXIgPSBmcy5zdGF0U3luYyhkaXJQYXRoKS5pc0RpcmVjdG9yeSgpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpc0RpciA9IGZhbHNlXG4gIH1cbiAgcmV0dXJuIGlzRGlyXG59XG5cbmxldCBmYWxsYmFja0Zvckdsb2JhbEVycm9yVGhyb3duID0gZmFsc2VcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlc0RpclxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZ1xuICogQHBhcmFtIHtzdHJpbmd9IHByb2plY3RQYXRoXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGZhbGxiYWNrRm9yR2xvYmFsXG4gKiBAcmV0dXJucyB7eyBwYXRoOiBzdHJpbmcsIHR5cGU6ICdsb2NhbCBwcm9qZWN0JyB8ICdnbG9iYWwnIHwgJ2FkdmFuY2VkIHNwZWNpZmllZCcgfCAnYnVuZGxlZCBmYWxsYmFjaycgfX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRFU0xpbnREaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aCwgZmFsbGJhY2tGb3JHbG9iYWwgPSBmYWxzZSkge1xuICBsZXQgZXNsaW50RGlyID0gbnVsbFxuICBsZXQgbG9jYXRpb25UeXBlID0gbnVsbFxuICBpZiAoY29uZmlnLmdsb2JhbC51c2VHbG9iYWxFc2xpbnQgJiYgIWZhbGxiYWNrRm9yR2xvYmFsKSB7XG4gICAgbG9jYXRpb25UeXBlID0gJ2dsb2JhbCdcbiAgICBjb25zdCBjb25maWdHbG9iYWwgPSBjbGVhblBhdGgoY29uZmlnLmdsb2JhbC5nbG9iYWxOb2RlUGF0aClcbiAgICBjb25zdCBwcmVmaXhQYXRoID0gY29uZmlnR2xvYmFsIHx8IGdldE5vZGVQcmVmaXhQYXRoKClcbiAgICAvLyBOUE0gb24gV2luZG93cyBhbmQgWWFybiBvbiBhbGwgcGxhdGZvcm1zXG4gICAgZXNsaW50RGlyID0gUGF0aC5qb2luKHByZWZpeFBhdGgsICdub2RlX21vZHVsZXMnLCAnZXNsaW50JylcbiAgICBpZiAoIWlzRGlyZWN0b3J5KGVzbGludERpcikpIHtcbiAgICAgIC8vIE5QTSBvbiBwbGF0Zm9ybXMgb3RoZXIgdGhhbiBXaW5kb3dzXG4gICAgICBlc2xpbnREaXIgPSBQYXRoLmpvaW4ocHJlZml4UGF0aCwgJ2xpYicsICdub2RlX21vZHVsZXMnLCAnZXNsaW50JylcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWNvbmZpZy5hZHZhbmNlZC5sb2NhbE5vZGVNb2R1bGVzKSB7XG4gICAgbG9jYXRpb25UeXBlID0gJ2xvY2FsIHByb2plY3QnXG4gICAgZXNsaW50RGlyID0gUGF0aC5qb2luKG1vZHVsZXNEaXIgfHwgJycsICdlc2xpbnQnKVxuICB9IGVsc2UgaWYgKFBhdGguaXNBYnNvbHV0ZShjbGVhblBhdGgoY29uZmlnLmFkdmFuY2VkLmxvY2FsTm9kZU1vZHVsZXMpKSkge1xuICAgIGxvY2F0aW9uVHlwZSA9ICdhZHZhbmNlZCBzcGVjaWZpZWQnXG4gICAgZXNsaW50RGlyID0gUGF0aC5qb2luKGNsZWFuUGF0aChjb25maWcuYWR2YW5jZWQubG9jYWxOb2RlTW9kdWxlcyksICdlc2xpbnQnKVxuICB9IGVsc2Uge1xuICAgIGxvY2F0aW9uVHlwZSA9ICdhZHZhbmNlZCBzcGVjaWZpZWQnXG4gICAgZXNsaW50RGlyID0gUGF0aC5qb2luKHByb2plY3RQYXRoIHx8ICcnLCBjbGVhblBhdGgoY29uZmlnLmFkdmFuY2VkLmxvY2FsTm9kZU1vZHVsZXMpLCAnZXNsaW50JylcbiAgfVxuXG4gIGlmIChpc0RpcmVjdG9yeShlc2xpbnREaXIpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGg6IGVzbGludERpcixcbiAgICAgIHR5cGU6IGxvY2F0aW9uVHlwZSxcbiAgICB9XG4gIH1cblxuICBpZiAoY29uZmlnLmdsb2JhbC51c2VHbG9iYWxFc2xpbnQgJiYgIWZhbGxiYWNrRm9yR2xvYmFsKSB7XG4gICAgaWYgKCFmYWxsYmFja0Zvckdsb2JhbEVycm9yVGhyb3duKSB7XG4gICAgICAvLyBUaHJvdyB0aGUgZXJyb3Igb25seSBvbmNlIHRvIHByZXZlbnQgcGVyZm9ybWFuY2UgaXNzdWVzXG4gICAgICBmYWxsYmFja0Zvckdsb2JhbEVycm9yVGhyb3duID0gdHJ1ZVxuICAgICAgY29uc29sZS5lcnJvcihgR2xvYmFsIEVTTGludCBpcyBub3QgZm91bmQsIGZhbGxpbmcgYmFjayB0byBvdGhlciBFc2xpbnQgaW5zdGFsbGF0aW9ucy4uLlxuICAgICAgICBQbGVhc2UgZW5zdXJlIHRoZSBnbG9iYWwgTm9kZSBwYXRoIGlzIHNldCBjb3JyZWN0bHkuXG4gICAgICAgIElmIHlvdSB3YW50ZWQgdG8gdXNlIGEgbG9jYWwgaW5zdGFsbGF0aW9uIG9mIEVzbGludCwgZGlzYWJsZSBHbG9iYWwgRXNsaW50IG9wdGlvbiBpbiB0aGUgbGludGVyLWVzbGludCBjb25maWcuYClcbiAgICB9XG4gICAgcmV0dXJuIGZpbmRFU0xpbnREaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aCwgdHJ1ZSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGF0aDogQ2FjaGUuRVNMSU5UX0xPQ0FMX1BBVEgsXG4gICAgdHlwZTogJ2J1bmRsZWQgZmFsbGJhY2snLFxuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZXNEaXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWdcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9qZWN0UGF0aFxuICogQHJldHVybnMge2ltcG9ydChcImVzbGludFwiKX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVTTGludEZyb21EaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aCkge1xuICBjb25zdCB7IHBhdGg6IEVTTGludERpcmVjdG9yeSB9ID0gZmluZEVTTGludERpcmVjdG9yeShtb2R1bGVzRGlyLCBjb25maWcsIHByb2plY3RQYXRoKVxuICB0cnkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZHluYW1pYy1yZXF1aXJlXG4gICAgcmV0dXJuIHJlcXVpcmUoRVNMaW50RGlyZWN0b3J5KVxuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGNvbmZpZy5nbG9iYWwudXNlR2xvYmFsRXNsaW50ICYmIGUuY29kZSA9PT0gJ01PRFVMRV9OT1RfRk9VTkQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VTTGludCBub3QgZm91bmQsIHRyeSByZXN0YXJ0aW5nIEF0b20gdG8gY2xlYXIgY2FjaGVzLicpXG4gICAgfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZHluYW1pYy1yZXF1aXJlXG4gICAgcmV0dXJuIHJlcXVpcmUoQ2FjaGUuRVNMSU5UX0xPQ0FMX1BBVEgpXG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlc0RpclxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVmcmVzaE1vZHVsZXNQYXRoKG1vZHVsZXNEaXIpIHtcbiAgaWYgKENhY2hlLkxBU1RfTU9EVUxFU19QQVRIICE9PSBtb2R1bGVzRGlyKSB7XG4gICAgQ2FjaGUuTEFTVF9NT0RVTEVTX1BBVEggPSBtb2R1bGVzRGlyXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9QQVRIID0gbW9kdWxlc0RpciB8fCAnJ1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgIHJlcXVpcmUoJ21vZHVsZScpLk1vZHVsZS5faW5pdFBhdGhzKClcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlRGlyXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdFBhdGhcbiAqIEByZXR1cm5zIHtpbXBvcnQoXCJlc2xpbnRcIil9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFU0xpbnRJbnN0YW5jZShmaWxlRGlyLCBjb25maWcsIHByb2plY3RQYXRoKSB7XG4gIGNvbnN0IG1vZHVsZXNEaXIgPSBQYXRoLmRpcm5hbWUoZmluZENhY2hlZChmaWxlRGlyLCAnbm9kZV9tb2R1bGVzL2VzbGludCcpIHx8ICcnKVxuICByZWZyZXNoTW9kdWxlc1BhdGgobW9kdWxlc0RpcilcbiAgcmV0dXJuIGdldEVTTGludEZyb21EaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aClcbn1cblxuLyoqXG4gKiBjb25zb2xlLmxvZ1xuICogQHBhcmFtICB7YW55fSBhcmdzXG4gKiBAcmV0dXJuIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9nKC4uLmFyZ3MpIHtcbiAgY29uc3Qgb2JqID0gYXJncy5sZW5ndGggPT09IDEgPyBhcmdzWzBdIDogYXJnc1xuICBsZXQgc3RyXG4gIHRyeSB7XG4gICAgc3RyID0gSlNPTi5zdHJpbmdpZnkob2JqKVxuICB9IGNhdGNoIChlKSB7XG4gICAgc3RyID0gVXRpbC5pbnNwZWN0KG9iailcbiAgfVxuXG4gIGVtaXQoJ2xvZycsIHN0cilcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2ltcG9ydChcImVzbGludFwiKX0gZXNsaW50XG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZ0ZvckZpbGUoZXNsaW50LCBmaWxlUGF0aCkge1xuICBjb25zdCBjbGkgPSBuZXcgZXNsaW50LkNMSUVuZ2luZSgpXG4gIHRyeSB7XG4gICAgcmV0dXJuIGNsaS5nZXRDb25maWdGb3JGaWxlKGZpbGVQYXRoKVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gTm8gY29uZmlndXJhdGlvbiB3YXMgZm91bmRcbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVEaXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aFxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZ1xuICogQHBhcmFtIHtzdHJpbmd9IHByb2plY3RQYXRoXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVsYXRpdmVQYXRoKGZpbGVEaXIsIGZpbGVQYXRoLCBjb25maWcsIHByb2plY3RQYXRoKSB7XG4gIGNvbnN0IGlnbm9yZUZpbGUgPSBjb25maWcuYWR2YW5jZWQuZGlzYWJsZUVzbGludElnbm9yZSA/IG51bGwgOiBmaW5kQ2FjaGVkKGZpbGVEaXIsICcuZXNsaW50aWdub3JlJylcblxuICAvLyBJZiB3ZSBjYW4gZmluZCBhbiAuZXNsaW50aWdub3JlIGZpbGUsIHdlIGNhbiBzZXQgY3dkIHRoZXJlXG4gIC8vIChiZWNhdXNlIHRoZXkgYXJlIGV4cGVjdGVkIHRvIGJlIGF0IHRoZSBwcm9qZWN0IHJvb3QpXG4gIGlmIChpZ25vcmVGaWxlKSB7XG4gICAgY29uc3QgaWdub3JlRGlyID0gUGF0aC5kaXJuYW1lKGlnbm9yZUZpbGUpXG4gICAgcHJvY2Vzcy5jaGRpcihpZ25vcmVEaXIpXG4gICAgcmV0dXJuIFBhdGgucmVsYXRpdmUoaWdub3JlRGlyLCBmaWxlUGF0aClcbiAgfVxuICAvLyBPdGhlcndpc2UsIHdlJ2xsIHNldCB0aGUgY3dkIHRvIHRoZSBhdG9tIHByb2plY3Qgcm9vdCBhcyBsb25nIGFzIHRoYXQgZXhpc3RzXG4gIGlmIChwcm9qZWN0UGF0aCkge1xuICAgIHByb2Nlc3MuY2hkaXIocHJvamVjdFBhdGgpXG4gICAgcmV0dXJuIFBhdGgucmVsYXRpdmUocHJvamVjdFBhdGgsIGZpbGVQYXRoKVxuICB9XG4gIC8vIElmIGFsbCBlbHNlIGZhaWxzLCB1c2UgdGhlIGZpbGUgbG9jYXRpb24gaXRzZWxmXG4gIHByb2Nlc3MuY2hkaXIoZmlsZURpcilcbiAgcmV0dXJuIFBhdGguYmFzZW5hbWUoZmlsZVBhdGgpXG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nW119IHJ1bGVzXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcbiAqIEBwYXJhbSB7b2JqZWN0fSBmaWxlQ29uZmlnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDTElFbmdpbmVPcHRpb25zKHR5cGUsIGNvbmZpZywgcnVsZXMsIGZpbGVQYXRoLCBmaWxlQ29uZmlnKSB7XG4gIGNvbnN0IGNsaUVuZ2luZUNvbmZpZyA9IHtcbiAgICBydWxlcyxcbiAgICBpZ25vcmU6ICFjb25maWcuYWR2YW5jZWQuZGlzYWJsZUVzbGludElnbm9yZSxcbiAgICBmaXg6IHR5cGUgPT09ICdmaXgnXG4gIH1cblxuICBjbGlFbmdpbmVDb25maWcucnVsZVBhdGhzID0gY29uZmlnLmFkdmFuY2VkLmVzbGludFJ1bGVzRGlycy5tYXAoKHBhdGgpID0+IHtcbiAgICBjb25zdCBydWxlc0RpciA9IGNsZWFuUGF0aChwYXRoKVxuICAgIGlmICghUGF0aC5pc0Fic29sdXRlKHJ1bGVzRGlyKSkge1xuICAgICAgcmV0dXJuIGZpbmRDYWNoZWQoUGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgcnVsZXNEaXIpXG4gICAgfVxuICAgIHJldHVybiBydWxlc0RpclxuICB9KS5maWx0ZXIoKHBhdGgpID0+IHBhdGgpXG5cbiAgaWYgKGZpbGVDb25maWcgPT09IG51bGwgJiYgY29uZmlnLmdsb2JhbC5lc2xpbnRyY1BhdGgpIHtcbiAgICAvLyBJZiB3ZSBkaWRuJ3QgZmluZCBhIGNvbmZpZ3VyYXRpb24gdXNlIHRoZSBmYWxsYmFjayBmcm9tIHRoZSBzZXR0aW5nc1xuICAgIGNsaUVuZ2luZUNvbmZpZy5jb25maWdGaWxlID0gY2xlYW5QYXRoKGNvbmZpZy5nbG9iYWwuZXNsaW50cmNQYXRoKVxuICB9XG5cbiAgcmV0dXJuIGNsaUVuZ2luZUNvbmZpZ1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGxpc3Qgb2YgcnVsZXMgdXNlZCBmb3IgYSBsaW50IGpvYlxuICogQHBhcmFtICB7aW1wb3J0KFwiZXNsaW50XCIpLkNMSUVuZ2luZX0gY2xpRW5naW5lIFRoZSBDTElFbmdpbmUgaW5zdGFuY2UgdXNlZCBmb3IgdGhlIGxpbnQgam9iXG4gKiBAcmV0dXJuIHtNYXB9ICAgICAgICAgICAgICBBIE1hcCBvZiB0aGUgcnVsZXMgdXNlZCwgcnVsZSBuYW1lcyBhcyBrZXlzLCBydWxlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzIGFzIHRoZSBjb250ZW50cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJ1bGVzKGNsaUVuZ2luZSkge1xuICAvLyBQdWxsIHRoZSBsaXN0IG9mIHJ1bGVzIHVzZWQgZGlyZWN0bHkgZnJvbSB0aGUgQ0xJRW5naW5lXG4gIGlmICh0eXBlb2YgY2xpRW5naW5lLmdldFJ1bGVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGNsaUVuZ2luZS5nZXRSdWxlcygpXG4gIH1cblxuICAvLyBBdHRlbXB0IHRvIHVzZSB0aGUgaW50ZXJuYWwgKHVuZG9jdW1lbnRlZCkgYGxpbnRlcmAgaW5zdGFuY2UgYXR0YWNoZWQgdG9cbiAgLy8gdGhlIENMSUVuZ2luZSB0byBnZXQgdGhlIGxvYWRlZCBydWxlcyAoaW5jbHVkaW5nIHBsdWdpbiBydWxlcykuXG4gIC8vIEFkZGVkIGluIEVTTGludCB2NFxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNsaUVuZ2luZSwgJ2xpbnRlcicpKSB7XG4gICAgcmV0dXJuIGNsaUVuZ2luZS5saW50ZXIuZ2V0UnVsZXMoKVxuICB9XG5cbiAgLy8gT2xkZXIgdmVyc2lvbnMgb2YgRVNMaW50IGRvbid0IChlYXNpbHkpIHN1cHBvcnQgZ2V0dGluZyBhIGxpc3Qgb2YgcnVsZXNcbiAgcmV0dXJuIG5ldyBNYXAoKVxufVxuXG4vKipcbiAqIEdpdmVuIGFuIGV4aXRpbmcgcnVsZSBsaXN0IGFuZCBhIG5ldyBydWxlIGxpc3QsIGRldGVybWluZXMgd2hldGhlciB0aGVyZVxuICogaGF2ZSBiZWVuIGNoYW5nZXMuXG4gKiBOT1RFOiBUaGlzIG9ubHkgYWNjb3VudHMgZm9yIHByZXNlbmNlIG9mIHRoZSBydWxlcywgY2hhbmdlcyB0byB0aGVpciBtZXRhZGF0YVxuICogYXJlIG5vdCB0YWtlbiBpbnRvIGFjY291bnQuXG4gKiBAcGFyYW0gIHtNYXB9IG5ld1J1bGVzICAgICBBIE1hcCBvZiB0aGUgbmV3IHJ1bGVzXG4gKiBAcGFyYW0gIHtNYXB9IGN1cnJlbnRSdWxlcyBBIE1hcCBvZiB0aGUgY3VycmVudCBydWxlc1xuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgV2hldGhlciBvciBub3QgdGhlcmUgd2VyZSBjaGFuZ2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaWRSdWxlc0NoYW5nZShjdXJyZW50UnVsZXMsIG5ld1J1bGVzKSB7XG4gIHJldHVybiAhKGN1cnJlbnRSdWxlcy5zaXplID09PSBuZXdSdWxlcy5zaXplXG4gICAgJiYgQXJyYXkuZnJvbShjdXJyZW50UnVsZXMua2V5cygpKS5ldmVyeSgocnVsZUlkKSA9PiBuZXdSdWxlcy5oYXMocnVsZUlkKSkpXG59XG4iXX0=