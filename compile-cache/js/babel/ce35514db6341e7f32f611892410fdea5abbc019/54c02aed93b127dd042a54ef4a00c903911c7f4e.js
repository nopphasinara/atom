Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

var _projectDeps = require('./project-deps');

var _projectDeps2 = _interopRequireDefault(_projectDeps);

var _utils = require('./utils');

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _lodashUniq = require('lodash.uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

// TODO: check windows compatibility
'use babel';
var PATH_DELIMITER = '/';

function readFilePromise(path) {
    return new Promise(function (resolve) {
        _fs2['default'].readFile(path, function (err, data) {
            return resolve({
                data: data,
                dir: (0, _utils.getParentDir)(path)
            });
        });
    });
}

function parsePackageJSON(file, projectDeps, _ref) {
    var suggestDev = _ref.suggestDev;
    var suggestProd = _ref.suggestProd;

    try {
        var conf = JSON.parse(file.data);
        var deps = [];

        if (conf.dependencies && suggestProd) {
            deps.push.apply(deps, _toConsumableArray(Object.keys(conf.dependencies)));
        }

        if (conf.devDependencies && suggestDev) {
            deps.push.apply(deps, _toConsumableArray(Object.keys(conf.devDependencies)));
        }

        projectDeps.set(file.dir, (0, _lodashUniq2['default'])(deps));
    } catch (e) {
        // this file was probably saved before it was a valid JSON
    }
}

var PACKAGE_NAME = 'autocomplete-js-import';

exports['default'] = {
    config: _settings2['default'],

    filesMap: new Map(),
    projectDeps: new _projectDeps2['default'](),

    _fileWatchers: [],
    _pathListeners: [],
    _settingsObservers: [],

    activate: function activate() {
        var _settingsObservers,
            _this = this;

        var settings = atom.config.get(PACKAGE_NAME);
        var projectPaths = atom.project.getPaths();

        (_settingsObservers = this._settingsObservers).push.apply(_settingsObservers, _toConsumableArray(['hiddenFiles', 'fuzzy', 'fileRelativePaths', 'projectDependencies'].map(function (setting) {
            return atom.config.onDidChange(PACKAGE_NAME + '.' + setting, function () {
                // Just wipe everything and start fresh, relatively expensive but effective
                _this.deactivate();
                _this.activate();
            });
        })));

        if (settings.fuzzy.enabled) {
            (function () {
                var options = {
                    excludedDirs: settings.fuzzy.excludedDirs,
                    showHidden: settings.hiddenFiles,
                    fileTypes: settings.fuzzy.fileTypes
                };

                // TODO: listen for file additions
                _this._buildProjectFilesList(projectPaths, options);

                _this._pathListeners.push(atom.project.onDidChangePaths(function (paths) {
                    var newPaths = paths.filter(function (p) {
                        return !_this.filesMap.has(p);
                    });

                    _this._buildProjectFilesList(newPaths, options);
                }));
            })();
        }

        if (settings.projectDependencies.suggestDev || settings.projectDependencies.suggestProd) {
            this._searchForProjectDeps(projectPaths, settings.projectDependencies);

            this._pathListeners.push(atom.project.onDidChangePaths(function (paths) {
                var newProjectPaths = paths.filter(function (p) {
                    return !_this.projectDeps.hasDeps(p);
                });

                _this._searchForProjectDeps(newProjectPaths, settings.projectDependencies);
            }));
        }
    },

    deactivate: function deactivate() {
        this._pathListeners.forEach(function (listener) {
            return listener.dispose();
        });
        this._pathListeners.length = 0;

        this._fileWatchers.forEach(function (watcher) {
            return watcher.close();
        });
        this._fileWatchers.length = 0;

        this._settingsObservers.forEach(function (observer) {
            return observer.dispose();
        });
        this._settingsObservers.length = 0;

        // In case of settings change, these references must stay intact for the provide method below to work
        this.filesMap.clear();
        this.projectDeps.clear();
    },

    provide: function provide() {
        return new _provider2['default'](this.projectDeps, this.filesMap);
    },

    _buildProjectFilesList: function _buildProjectFilesList(projectPaths, _ref2) {
        var _this2 = this;

        var excludedDirs = _ref2.excludedDirs;
        var fileTypes = _ref2.fileTypes;
        var showHidden = _ref2.showHidden;

        projectPaths.forEach(function (p) {

            // Join together our desired file extensions, like "ts,js,jsx,json"
            // if necessary. Glob will fail if you give it just one extension
            // like "js" so handle that case separately.
            var fileTypeSet = fileTypes.length === 1 ? fileTypes[0] : '{' + fileTypes.join(',') + '}';

            // Create our base glob like "/path/to/project/**/*.{ts,js,jsx,json}"
            var globPattern = p + '/**/*.' + fileTypeSet;

            // Use the ignore option to exclude the given directories anywhere
            // including a subpath.
            var ignore = excludedDirs.map(function (dir) {
                return p + '/**/' + dir + '/**';
            }); // like ["/path/to/project/**/node_modules/**", etc.]

            (0, _glob2['default'])(globPattern, { dot: showHidden, nodir: true, ignore: ignore }, function (err, childPaths) {
                _this2.filesMap.set(p, childPaths
                // Ensure no empty paths
                .filter(Boolean)
                // We want shortest paths to appear first when searching so sort based on total path parts
                // then alphabetically
                // E.G Searching for index.js should appear as so:
                // 1. index.js
                // 2. some/path/index.js
                // 3. some/long/path/index.js
                // 4. some/longer/path/index.js
                // If we used Glob's output directly, the shortest paths appear last,
                // which can cause non unique filenames with short paths to be unsearchable
                .sort(function (a, b) {
                    var pathDifference = a.split(PATH_DELIMITER).length - b.split(PATH_DELIMITER).length;

                    if (pathDifference !== 0) {
                        return pathDifference;
                    }

                    return a.localeCompare(b);
                }).map(function (child) {
                    return _path2['default'].relative(p, child);
                }));
            });
        });
    },

    _searchForProjectDeps: function _searchForProjectDeps(projectPaths, packageSettings) {
        var _this3 = this;

        if (!projectPaths.length) {
            return;
        }

        var packageExtraction = projectPaths.map(function (p) {
            var packageConfPath = p + '/package.json';

            return new Promise(function (resolve) {
                _fs2['default'].stat(packageConfPath, function (err, stats) {
                    return resolve({ stats: stats, path: packageConfPath });
                });
            });
        });

        Promise.all(packageExtraction).then(function (resolved) {
            // Only get the files that exist
            var packageConfs = resolved.filter(function (r) {
                return r.stats && r.stats.isFile();
            });

            return Promise.all(packageConfs.map(function (conf) {
                _this3._fileWatchers.push(_fs2['default'].watch(conf.path, function (eventType) {
                    if (eventType === 'change') {
                        return readFilePromise(conf.path).then(function (file) {
                            return parsePackageJSON(file, _this3.projectDeps, packageSettings);
                        });
                    }
                }));

                return readFilePromise(conf.path);
            }));
        }).then(function (files) {
            files.forEach(function (f) {
                return parsePackageJSON(f, _this3.projectDeps, packageSettings);
            });
        })['catch'](function () {});
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzLWltcG9ydC9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7d0JBQ3FDLFlBQVk7Ozs7MkJBQ3pCLGdCQUFnQjs7OztxQkFDYixTQUFTOzt3QkFDZixZQUFZOzs7O2tCQUNsQixJQUFJOzs7O29CQUNGLE1BQU07Ozs7b0JBQ04sTUFBTTs7OzswQkFDTixhQUFhOzs7OztBQVI5QixXQUFXLENBQUE7QUFXWCxJQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7O0FBRTNCLFNBQVMsZUFBZSxDQUFDLElBQUksRUFBRTtBQUMzQixXQUFPLElBQUksT0FBTyxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQzFCLHdCQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBQyxHQUFHLEVBQUUsSUFBSTttQkFBSyxPQUFPLENBQUM7QUFDckMsb0JBQUksRUFBSixJQUFJO0FBQ0osbUJBQUcsRUFBRSx5QkFBYSxJQUFJLENBQUM7YUFDMUIsQ0FBQztTQUFBLENBQUMsQ0FBQztLQUNQLENBQUMsQ0FBQztDQUNOOztBQUVELFNBQVMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUF5QixFQUFFO1FBQTFCLFVBQVUsR0FBWCxJQUF5QixDQUF4QixVQUFVO1FBQUUsV0FBVyxHQUF4QixJQUF5QixDQUFaLFdBQVc7O0FBQ2pFLFFBQUk7QUFDQSxZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQyxZQUFNLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRWhCLFlBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxXQUFXLEVBQUU7QUFDbEMsZ0JBQUksQ0FBQyxJQUFJLE1BQUEsQ0FBVCxJQUFJLHFCQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFDLENBQUM7U0FDaEQ7O0FB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O0FBQ1gsaUJBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO3VCQUFJLGdCQUFnQixDQUFDLENBQUMsRUFBRSxPQUFLLFdBQVcsRUFBRSxlQUFlLENBQUM7YUFBQSxDQUFDLENBQUM7U0FDOUUsQ0FBQyxTQUNJLENBQUMsWUFBTSxFQUFFLENBQUMsQ0FBQztLQUN4QjtDQUNKIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzLWltcG9ydC9saWIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuaW1wb3J0IEltcG9ydENvbXBsZXRpb25Qcm92aWRlciBmcm9tICcuL3Byb3ZpZGVyJztcbmltcG9ydCBQcm9qZWN0RGVwcyBmcm9tICcuL3Byb2plY3QtZGVwcyc7XG5pbXBvcnQge2dldFBhcmVudERpcn0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgc2V0dGluZ3MgZnJvbSAnLi9zZXR0aW5ncyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcblxuLy8gVE9ETzogY2hlY2sgd2luZG93cyBjb21wYXRpYmlsaXR5XG5jb25zdCBQQVRIX0RFTElNSVRFUiA9ICcvJztcblxuZnVuY3Rpb24gcmVhZEZpbGVQcm9taXNlKHBhdGgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIGZzLnJlYWRGaWxlKHBhdGgsIChlcnIsIGRhdGEpID0+IHJlc29sdmUoe1xuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIGRpcjogZ2V0UGFyZW50RGlyKHBhdGgpXG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcGFyc2VQYWNrYWdlSlNPTihmaWxlLCBwcm9qZWN0RGVwcywge3N1Z2dlc3REZXYsIHN1Z2dlc3RQcm9kfSkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNvbmYgPSBKU09OLnBhcnNlKGZpbGUuZGF0YSk7XG4gICAgICAgIGNvbnN0IGRlcHMgPSBbXTtcblxuICAgICAgICBpZiAoY29uZi5kZXBlbmRlbmNpZXMgJiYgc3VnZ2VzdFByb2QpIHtcbiAgICAgICAgICAgIGRlcHMucHVzaCguLi5PYmplY3Qua2V5cyhjb25mLmRlcGVuZGVuY2llcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmYuZGV2RGVwZW5kZW5jaWVzICYmIHN1Z2dlc3REZXYpIHtcbiAgICAgICAgICAgIGRlcHMucHVzaCguLi5PYmplY3Qua2V5cyhjb25mLmRldkRlcGVuZGVuY2llcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvamVjdERlcHMuc2V0KGZpbGUuZGlyLCB1bmlxKGRlcHMpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIHRoaXMgZmlsZSB3YXMgcHJvYmFibHkgc2F2ZWQgYmVmb3JlIGl0IHdhcyBhIHZhbGlkIEpTT05cbiAgICB9XG59XG5cbmNvbnN0IFBBQ0tBR0VfTkFNRSA9ICdhdXRvY29tcGxldGUtanMtaW1wb3J0JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzogc2V0dGluZ3MsXG5cbiAgICBmaWxlc01hcDogbmV3IE1hcCgpLFxuICAgIHByb2plY3REZXBzOiBuZXcgUHJvamVjdERlcHMoKSxcblxuICAgIF9maWxlV2F0Y2hlcnM6IFtdLFxuICAgIF9wYXRoTGlzdGVuZXJzOiBbXSxcbiAgICBfc2V0dGluZ3NPYnNlcnZlcnM6IFtdLFxuXG4gICAgYWN0aXZhdGUoKSB7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYXRvbS5jb25maWcuZ2V0KFBBQ0tBR0VfTkFNRSk7XG4gICAgICAgIGNvbnN0IHByb2plY3RQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuXG4gICAgICAgIHRoaXMuX3NldHRpbmdzT2JzZXJ2ZXJzLnB1c2goLi4uWydoaWRkZW5GaWxlcycsICdmdXp6eScsICdmaWxlUmVsYXRpdmVQYXRocycsICdwcm9qZWN0RGVwZW5kZW5jaWVzJ10ubWFwKHNldHRpbmcgPT5cbiAgICAgICAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKGAke1BBQ0tBR0VfTkFNRX0uJHtzZXR0aW5nfWAsICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBKdXN0IHdpcGUgZXZlcnl0aGluZyBhbmQgc3RhcnQgZnJlc2gsIHJlbGF0aXZlbHkgZXhwZW5zaXZlIGJ1dCBlZmZlY3RpdmVcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2YXRlKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApKTtcblxuICAgICAgICBpZiAoc2V0dGluZ3MuZnV6enkuZW5hYmxlZCkge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBleGNsdWRlZERpcnM6IHNldHRpbmdzLmZ1enp5LmV4Y2x1ZGVkRGlycyxcbiAgICAgICAgICAgICAgICBzaG93SGlkZGVuOiBzZXR0aW5ncy5oaWRkZW5GaWxlcyxcbiAgICAgICAgICAgICAgICBmaWxlVHlwZXM6IHNldHRpbmdzLmZ1enp5LmZpbGVUeXBlc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gVE9ETzogbGlzdGVuIGZvciBmaWxlIGFkZGl0aW9uc1xuICAgICAgICAgICAgdGhpcy5fYnVpbGRQcm9qZWN0RmlsZXNMaXN0KHByb2plY3RQYXRocywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHRoaXMuX3BhdGhMaXN0ZW5lcnMucHVzaChhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocyhwYXRocyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UGF0aHMgPSBwYXRocy5maWx0ZXIocCA9PiAhdGhpcy5maWxlc01hcC5oYXMocCkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fYnVpbGRQcm9qZWN0RmlsZXNMaXN0KG5ld1BhdGhzLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXR0aW5ncy5wcm9qZWN0RGVwZW5kZW5jaWVzLnN1Z2dlc3REZXYgfHwgc2V0dGluZ3MucHJvamVjdERlcGVuZGVuY2llcy5zdWdnZXN0UHJvZCkge1xuICAgICAgICAgICAgdGhpcy5fc2VhcmNoRm9yUHJvamVjdERlcHMocHJvamVjdFBhdGhzLCBzZXR0aW5ncy5wcm9qZWN0RGVwZW5kZW5jaWVzKTtcblxuICAgICAgICAgICAgdGhpcy5fcGF0aExpc3RlbmVycy5wdXNoKGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKHBhdGhzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdQcm9qZWN0UGF0aHMgPSBwYXRocy5maWx0ZXIocCA9PiAhdGhpcy5wcm9qZWN0RGVwcy5oYXNEZXBzKHApKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaEZvclByb2plY3REZXBzKG5ld1Byb2plY3RQYXRocywgc2V0dGluZ3MucHJvamVjdERlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVhY3RpdmF0ZSgpIHtcbiAgICAgICAgdGhpcy5fcGF0aExpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyLmRpc3Bvc2UoKSk7XG4gICAgICAgIHRoaXMuX3BhdGhMaXN0ZW5lcnMubGVuZ3RoID0gMDtcblxuICAgICAgICB0aGlzLl9maWxlV2F0Y2hlcnMuZm9yRWFjaCh3YXRjaGVyID0+IHdhdGNoZXIuY2xvc2UoKSk7XG4gICAgICAgIHRoaXMuX2ZpbGVXYXRjaGVycy5sZW5ndGggPSAwO1xuXG4gICAgICAgIHRoaXMuX3NldHRpbmdzT2JzZXJ2ZXJzLmZvckVhY2gob2JzZXJ2ZXIgPT4gb2JzZXJ2ZXIuZGlzcG9zZSgpKTtcbiAgICAgICAgdGhpcy5fc2V0dGluZ3NPYnNlcnZlcnMubGVuZ3RoID0gMDtcblxuICAgICAgICAvLyBJbiBjYXNlIG9mIHNldHRpbmdzIGNoYW5nZSwgdGhlc2UgcmVmZXJlbmNlcyBtdXN0IHN0YXkgaW50YWN0IGZvciB0aGUgcHJvdmlkZSBtZXRob2QgYmVsb3cgdG8gd29ya1xuICAgICAgICB0aGlzLmZpbGVzTWFwLmNsZWFyKCk7XG4gICAgICAgIHRoaXMucHJvamVjdERlcHMuY2xlYXIoKTtcbiAgICB9LFxuXG4gICAgcHJvdmlkZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBvcnRDb21wbGV0aW9uUHJvdmlkZXIodGhpcy5wcm9qZWN0RGVwcywgdGhpcy5maWxlc01hcCk7XG4gICAgfSxcblxuICAgIF9idWlsZFByb2plY3RGaWxlc0xpc3QocHJvamVjdFBhdGhzLCB7ZXhjbHVkZWREaXJzLCBmaWxlVHlwZXMsIHNob3dIaWRkZW59KSB7XG4gICAgICAgIHByb2plY3RQYXRocy5mb3JFYWNoKHAgPT4ge1xuXG4gICAgICAgICAgICAvLyBKb2luIHRvZ2V0aGVyIG91ciBkZXNpcmVkIGZpbGUgZXh0ZW5zaW9ucywgbGlrZSBcInRzLGpzLGpzeCxqc29uXCJcbiAgICAgICAgICAgIC8vIGlmIG5lY2Vzc2FyeS4gR2xvYiB3aWxsIGZhaWwgaWYgeW91IGdpdmUgaXQganVzdCBvbmUgZXh0ZW5zaW9uXG4gICAgICAgICAgICAvLyBsaWtlIFwianNcIiBzbyBoYW5kbGUgdGhhdCBjYXNlIHNlcGFyYXRlbHkuXG4gICAgICAgICAgICBjb25zdCBmaWxlVHlwZVNldCA9IGZpbGVUeXBlcy5sZW5ndGggPT09IDEgPyBmaWxlVHlwZXNbMF0gOiBgeyR7ZmlsZVR5cGVzLmpvaW4oJywnKX19YDtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIG91ciBiYXNlIGdsb2IgbGlrZSBcIi9wYXRoL3RvL3Byb2plY3QvKiovKi57dHMsanMsanN4LGpzb259XCJcbiAgICAgICAgICAgIGNvbnN0IGdsb2JQYXR0ZXJuID0gYCR7cH0vKiovKi4ke2ZpbGVUeXBlU2V0fWA7XG5cbiAgICAgICAgICAgIC8vIFVzZSB0aGUgaWdub3JlIG9wdGlvbiB0byBleGNsdWRlIHRoZSBnaXZlbiBkaXJlY3RvcmllcyBhbnl3aGVyZVxuICAgICAgICAgICAgLy8gaW5jbHVkaW5nIGEgc3VicGF0aC5cbiAgICAgICAgICAgIGNvbnN0IGlnbm9yZSA9IGV4Y2x1ZGVkRGlycy5tYXAoZGlyID0+IGAke3B9LyoqLyR7ZGlyfS8qKmApOyAvLyBsaWtlIFtcIi9wYXRoL3RvL3Byb2plY3QvKiovbm9kZV9tb2R1bGVzLyoqXCIsIGV0Yy5dXG5cbiAgICAgICAgICAgIGdsb2IoZ2xvYlBhdHRlcm4sIHtkb3Q6IHNob3dIaWRkZW4sIG5vZGlyOiB0cnVlLCBpZ25vcmV9LCAoZXJyLCBjaGlsZFBhdGhzKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxlc01hcC5zZXQoXG4gICAgICAgICAgICAgICAgICAgIHAsXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkUGF0aHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVuc3VyZSBubyBlbXB0eSBwYXRoc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2Ugd2FudCBzaG9ydGVzdCBwYXRocyB0byBhcHBlYXIgZmlyc3Qgd2hlbiBzZWFyY2hpbmcgc28gc29ydCBiYXNlZCBvbiB0b3RhbCBwYXRoIHBhcnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIGFscGhhYmV0aWNhbGx5XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFLkcgU2VhcmNoaW5nIGZvciBpbmRleC5qcyBzaG91bGQgYXBwZWFyIGFzIHNvOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMS4gaW5kZXguanNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDIuIHNvbWUvcGF0aC9pbmRleC5qc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gMy4gc29tZS9sb25nL3BhdGgvaW5kZXguanNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDQuIHNvbWUvbG9uZ2VyL3BhdGgvaW5kZXguanNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIHVzZWQgR2xvYidzIG91dHB1dCBkaXJlY3RseSwgdGhlIHNob3J0ZXN0IHBhdGhzIGFwcGVhciBsYXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggY2FuIGNhdXNlIG5vbiB1bmlxdWUgZmlsZW5hbWVzIHdpdGggc2hvcnQgcGF0aHMgdG8gYmUgdW5zZWFyY2hhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGhEaWZmZXJlbmNlID0gYS5zcGxpdChQQVRIX0RFTElNSVRFUikubGVuZ3RoIC0gYi5zcGxpdChQQVRIX0RFTElNSVRFUikubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhdGhEaWZmZXJlbmNlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXRoRGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5sb2NhbGVDb21wYXJlKGIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoY2hpbGQgPT4gcGF0aC5yZWxhdGl2ZShwLCBjaGlsZClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9zZWFyY2hGb3JQcm9qZWN0RGVwcyhwcm9qZWN0UGF0aHMsIHBhY2thZ2VTZXR0aW5ncykge1xuICAgICAgICBpZiAoIXByb2plY3RQYXRocy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhY2thZ2VFeHRyYWN0aW9uID0gcHJvamVjdFBhdGhzLm1hcChwID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VDb25mUGF0aCA9IHAgKyAnL3BhY2thZ2UuanNvbic7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgICAgICBmcy5zdGF0KHBhY2thZ2VDb25mUGF0aCwgKGVyciwgc3RhdHMpID0+IHJlc29sdmUoe3N0YXRzLCBwYXRoOiBwYWNrYWdlQ29uZlBhdGh9KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocGFja2FnZUV4dHJhY3Rpb24pXG4gICAgICAgICAgICAudGhlbihyZXNvbHZlZCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gT25seSBnZXQgdGhlIGZpbGVzIHRoYXQgZXhpc3RcbiAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlQ29uZnMgPSByZXNvbHZlZC5maWx0ZXIociA9PiByLnN0YXRzICYmIHIuc3RhdHMuaXNGaWxlKCkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHBhY2thZ2VDb25mcy5tYXAoY29uZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZpbGVXYXRjaGVycy5wdXNoKGZzLndhdGNoKGNvbmYucGF0aCwgZXZlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudFR5cGUgPT09ICdjaGFuZ2UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlYWRGaWxlUHJvbWlzZShjb25mLnBhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZpbGUgPT4gcGFyc2VQYWNrYWdlSlNPTihmaWxlLCB0aGlzLnByb2plY3REZXBzLCBwYWNrYWdlU2V0dGluZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWFkRmlsZVByb21pc2UoY29uZi5wYXRoKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oZmlsZXMgPT4ge1xuICAgICAgICAgICAgICAgIGZpbGVzLmZvckVhY2goZiA9PiBwYXJzZVBhY2thZ2VKU09OKGYsIHRoaXMucHJvamVjdERlcHMsIHBhY2thZ2VTZXR0aW5ncykpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfVxufVxuIl19