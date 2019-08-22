Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _eventKit = require('event-kit');

var _osenv = require('osenv');

var _osenv2 = _interopRequireDefault(_osenv);

var _config = require('./config');

var config = _interopRequireWildcard(_config);

var _models = require('./models');

var _utils = require('./utils');

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

// Emitter for outside packages to subscribe to. Subscription functions
// are exponsed in ./advanced-open-file
var emitter = new _eventKit.Emitter();

exports.emitter = emitter;

var AdvancedOpenFileController = (function () {
    function AdvancedOpenFileController() {
        _classCallCheck(this, AdvancedOpenFileController);

        this.view = new _view2['default']();
        this.panel = null;

        this.currentPath = null;
        this.pathHistory = [];
        this.disposables = new _atom.CompositeDisposable();

        this.disposables.add(atom.commands.add('atom-workspace', {
            'advanced-open-file:toggle': this.toggle.bind(this)
        }));
        this.disposables.add(atom.commands.add('.advanced-open-file', {
            'core:confirm': this.confirm.bind(this),
            'core:cancel': this.detach.bind(this),
            'application:add-project-folder': this.addSelectedProjectFolder.bind(this),
            'advanced-open-file:autocomplete': this.autocomplete.bind(this),
            'advanced-open-file:undo': this.undo.bind(this),
            'advanced-open-file:move-cursor-down': this.moveCursorDown.bind(this),
            'advanced-open-file:move-cursor-up': this.moveCursorUp.bind(this),
            'advanced-open-file:move-cursor-bottom': this.moveCursorBottom.bind(this),
            'advanced-open-file:move-cursor-top': this.moveCursorTop.bind(this),
            'advanced-open-file:confirm-selected-or-first': this.confirmSelectedOrFirst.bind(this),
            'advanced-open-file:delete-path-component': this.deletePathComponent.bind(this),

            'pane:split-left': this.splitConfirm(function (pane) {
                return pane.splitLeft();
            }),
            'pane:split-right': this.splitConfirm(function (pane) {
                return pane.splitRight();
            }),
            'pane:split-up': this.splitConfirm(function (pane) {
                return pane.splitUp();
            }),
            'pane:split-down': this.splitConfirm(function (pane) {
                return pane.splitDown();
            })
        }));

        this.view.onDidClickFile(this.clickFile.bind(this));
        this.view.onDidClickAddProjectFolder(this.addProjectFolder.bind(this));
        this.view.onDidClickOutside(this.detach.bind(this));
        this.view.onDidPathChange(this.pathChange.bind(this));
    }

    _createClass(AdvancedOpenFileController, [{
        key: 'destroy',
        value: function destroy() {
            this.disposables.dispose();
        }
    }, {
        key: 'clickFile',
        value: function clickFile(fileName) {
            this.selectPath(new _models.Path(fileName));
        }
    }, {
        key: 'pathChange',
        value: function pathChange(newPath) {
            this.currentPath = newPath;

            var replace = false;

            // Since the user typed this, apply fast-dir-switch
            // shortcuts.
            if (config.get('helmDirSwitch')) {
                if (newPath.hasShortcut('')) {
                    // Empty shortcut == '//'
                    newPath = newPath.root();
                    replace = true;
                } else if (newPath.hasShortcut('~')) {
                    newPath = new _models.Path(_osenv2['default'].home() + _path2['default'].sep);
                    replace = true;
                } else if (newPath.hasShortcut(':')) {
                    var projectPath = (0, _utils.getProjectPath)();
                    if (projectPath) {
                        newPath = new _models.Path(projectPath + newPath.sep);
                        replace = true;
                    }
                }
            }

            // If we're replacing the path, save it in the history and set the path.
            // If we aren't, the user is just typing and we don't need the history
            // and want to avoid setting the path which resets the cursor.
            if (replace) {
                this.updatePath(newPath);
            }
        }
    }, {
        key: 'selectPath',
        value: function selectPath(newPath) {
            var split = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (newPath.isDirectory()) {
                if (split !== false) {
                    atom.beep();
                } else {
                    this.updatePath(newPath.asDirectory());
                }
            } else if (split !== false) {
                this.splitOpenPath(newPath, split);
            } else {
                this.openPath(newPath);
            }
        }
    }, {
        key: 'updatePath',
        value: function updatePath(newPath) {
            var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var _ref$saveHistory = _ref.saveHistory;
            var saveHistory = _ref$saveHistory === undefined ? true : _ref$saveHistory;

            if (saveHistory) {
                this.pathHistory.push(this.currentPath);
            }

            this.currentPath = newPath;
            this.view.setPath(newPath);
        }
    }, {
        key: 'splitOpenPath',
        value: function splitOpenPath(path, split) {
            split(atom.workspace.getActivePane());
            this.openPath(path);
        }
    }, {
        key: 'openPath',
        value: function openPath(path) {
            if (path.exists()) {
                if (path.isFile()) {
                    atom.workspace.open(path.absolute);
                    emitter.emit('did-open-path', path.absolute);
                    this.detach();
                } else {
                    atom.beep();
                }
            } else if (path.fragment) {
                try {
                    path.createDirectories();
                    if (config.get('createFileInstantly')) {
                        path.createFile();
                        emitter.emit('did-create-path', path.absolute);
                    }
                    atom.workspace.open(path.absolute);
                    emitter.emit('did-open-path', path.absolute);
                } catch (err) {
                    atom.notifications.addError('Could not open file', {
                        detail: err,
                        icon: 'alert'
                    });
                } finally {
                    this.detach();
                }
            } else if (config.get('createDirectories')) {
                try {
                    path.createDirectories();
                    atom.notifications.addSuccess('Directory created', {
                        detail: 'Created directory "' + path.full + '".',
                        icon: 'file-directory'
                    });
                    emitter.emit('did-create-path', path.absolute);
                    this.detach();
                } catch (err) {
                    atom.notifications.addError('Could not create directory', {
                        detail: err,
                        icon: 'file-directory'
                    });
                } finally {
                    this.detach();
                }
            } else {
                atom.beep();
            }
        }
    }, {
        key: 'deletePathComponent',
        value: function deletePathComponent() {
            if (this.currentPath.isRoot()) {
                atom.beep();
            } else {
                this.updatePath(this.currentPath.parent());
            }
        }
    }, {
        key: 'addProjectFolder',
        value: function addProjectFolder(fileName) {
            var folderPath = new _models.Path(fileName);
            if (folderPath.isDirectory() && !folderPath.isProjectDirectory()) {
                atom.project.addPath(folderPath.absolute);
                atom.notifications.addSuccess('Added project folder', {
                    detail: 'Added "' + folderPath.full + '" as a project folder.',
                    icon: 'file-directory'
                });
                this.view.refreshPathListItem(folderPath);
            } else {
                atom.beep();
            }
        }
    }, {
        key: 'addSelectedProjectFolder',
        value: function addSelectedProjectFolder(event) {
            event.stopPropagation();

            var selectedPath = this.view.selectedPath();
            if (selectedPath == null && this.currentPath.isDirectory()) {
                this.addProjectFolder(this.currentPath.full);
            } else if (selectedPath !== null && !selectedPath.equals(this.currentPath.parent())) {
                this.addProjectFolder(selectedPath.full);
            } else {
                atom.beep();
            }
        }

        /**
         * Autocomplete the current input to the longest common prefix among
         * paths matching the current input. If no change is made to the
         * current path, beep.
         */
    }, {
        key: 'autocomplete',
        value: function autocomplete() {
            var matchingPaths = this.currentPath.matchingPaths();
            if (matchingPaths.length === 0) {
                atom.beep();
            } else if (matchingPaths.length === 1 || config.get('fuzzyMatch')) {
                var newPath = matchingPaths[0];
                if (newPath.isDirectory()) {
                    this.updatePath(newPath.asDirectory());
                } else {
                    this.updatePath(newPath);
                }
            } else {
                var newPath = _models.Path.commonPrefix(matchingPaths);
                if (newPath.equals(this.currentPath)) {
                    atom.beep();
                } else {
                    this.updatePath(newPath);
                }
            }
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            if (this.panel) {
                this.detach();
            } else {
                this.attach();
            }
        }
    }, {
        key: 'splitConfirm',
        value: function splitConfirm(split) {
            return this.confirm.bind(this, undefined, split);
        }
    }, {
        key: 'confirm',
        value: function confirm(event) {
            var split = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var selectedPath = this.view.selectedPath();
            if (selectedPath !== null) {
                this.selectPath(selectedPath, split);
            } else {
                this.selectPath(this.currentPath, split);
            }
        }
    }, {
        key: 'confirmSelectedOrFirst',
        value: function confirmSelectedOrFirst() {
            var selectedPath = this.view.selectedPath();
            if (selectedPath !== null) {
                this.selectPath(selectedPath);
            } else {
                var firstPath = this.view.firstPath();
                if (firstPath !== null) {
                    this.selectPath(firstPath);
                } else {
                    this.selectPath(this.currentPath);
                }
            }
        }
    }, {
        key: 'undo',
        value: function undo() {
            if (this.pathHistory.length > 0) {
                this.updatePath(this.pathHistory.pop(), { saveHistory: false });
            } else {
                var initialPath = _models.Path.initial();
                if (!this.currentPath.equals(initialPath)) {
                    this.updatePath(initialPath, { saveHistory: false });
                } else {
                    atom.beep();
                }
            }
        }
    }, {
        key: 'moveCursorDown',
        value: function moveCursorDown() {
            var index = this.view.cursorIndex;
            if (index === null || index === this.view.pathListLength() - 1) {
                index = 0;
            } else {
                index++;
            }

            this.view.setCursorIndex(index);
        }
    }, {
        key: 'moveCursorUp',
        value: function moveCursorUp() {
            var index = this.view.cursorIndex;
            if (index === null || index === 0) {
                index = this.view.pathListLength() - 1;
            } else {
                index--;
            }

            this.view.setCursorIndex(index);
        }
    }, {
        key: 'moveCursorTop',
        value: function moveCursorTop() {
            this.view.setCursorIndex(0);
        }
    }, {
        key: 'moveCursorBottom',
        value: function moveCursorBottom() {
            this.view.setCursorIndex(this.view.pathListLength() - 1);
        }
    }, {
        key: 'detach',
        value: function detach() {
            if (this.panel === null) {
                return;
            }

            this.panel.destroy();
            this.panel = null;
            atom.workspace.getActivePane().activate();
        }
    }, {
        key: 'attach',
        value: function attach() {
            if (this.panel !== null) {
                return;
            }

            var initialPath = _models.Path.initial();
            this.pathHistory = [];
            this.currentPath = initialPath;
            this.updatePath(_models.Path.initial(), { saveHistory: false });
            this.panel = this.view.createModalPanel();
        }
    }]);

    return AdvancedOpenFileController;
})();

exports.AdvancedOpenFileController = AdvancedOpenFileController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUVvQixNQUFNOzs7O29CQUVRLE1BQU07O3dCQUVsQixXQUFXOztxQkFDZixPQUFPOzs7O3NCQUVELFVBQVU7O0lBQXRCLE1BQU07O3NCQUNDLFVBQVU7O3FCQUNBLFNBQVM7O29CQUNMLFFBQVE7Ozs7OztBQUtsQyxJQUFJLE9BQU8sR0FBRyx1QkFBYSxDQUFDOzs7O0lBR3RCLDBCQUEwQjtBQUN4QixhQURGLDBCQUEwQixHQUNyQjs4QkFETCwwQkFBMEI7O0FBRS9CLFlBQUksQ0FBQyxJQUFJLEdBQUcsdUJBQTBCLENBQUM7QUFDdkMsWUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFlBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFlBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUM7O0FBRTdDLFlBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3JELHVDQUEyQixFQUFJLElBQUksQ0FBQyxNQUFNLE1BQVgsSUFBSSxDQUFPO1NBQzdDLENBQUMsQ0FBQyxDQUFDO0FBQ0osWUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUU7QUFDMUQsMEJBQWMsRUFBSSxJQUFJLENBQUMsT0FBTyxNQUFaLElBQUksQ0FBUTtBQUM5Qix5QkFBYSxFQUFJLElBQUksQ0FBQyxNQUFNLE1BQVgsSUFBSSxDQUFPO0FBQzVCLDRDQUFnQyxFQUFJLElBQUksQ0FBQyx3QkFBd0IsTUFBN0IsSUFBSSxDQUF5QjtBQUNqRSw2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QUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLGdCQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUMvQixnQkFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFLLE9BQU8sRUFBRSxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7QUFDdEQsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQzdDOzs7V0F4VFEsMEJBQTBCIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgc3RkUGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IG9zZW52IGZyb20gJ29zZW52JztcblxuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7UGF0aH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHtnZXRQcm9qZWN0UGF0aH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgQWR2YW5jZWRPcGVuRmlsZVZpZXcgZnJvbSAnLi92aWV3JztcblxuXG4vLyBFbWl0dGVyIGZvciBvdXRzaWRlIHBhY2thZ2VzIHRvIHN1YnNjcmliZSB0by4gU3Vic2NyaXB0aW9uIGZ1bmN0aW9uc1xuLy8gYXJlIGV4cG9uc2VkIGluIC4vYWR2YW5jZWQtb3Blbi1maWxlXG5leHBvcnQgbGV0IGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG5cbmV4cG9ydCBjbGFzcyBBZHZhbmNlZE9wZW5GaWxlQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudmlldyA9IG5ldyBBZHZhbmNlZE9wZW5GaWxlVmlldygpO1xuICAgICAgICB0aGlzLnBhbmVsID0gbnVsbDtcblxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcbiAgICAgICAgdGhpcy5wYXRoSGlzdG9yeSA9IFtdO1xuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAgICAgICAnYWR2YW5jZWQtb3Blbi1maWxlOnRvZ2dsZSc6IDo6dGhpcy50b2dnbGVcbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnLmFkdmFuY2VkLW9wZW4tZmlsZScsIHtcbiAgICAgICAgICAgICdjb3JlOmNvbmZpcm0nOiA6OnRoaXMuY29uZmlybSxcbiAgICAgICAgICAgICdjb3JlOmNhbmNlbCc6IDo6dGhpcy5kZXRhY2gsXG4gICAgICAgICAgICAnYXBwbGljYXRpb246YWRkLXByb2plY3QtZm9sZGVyJzogOjp0aGlzLmFkZFNlbGVjdGVkUHJvamVjdEZvbGRlcixcbiAgICAgICAgICAgICdhZHZhbmNlZC1vcGVuLWZpbGU6YXV0b2NvbXBsZXRlJzogOjp0aGlzLmF1dG9jb21wbGV0ZSxcbiAgICAgICAgICAgICdhZHZhbmNlZC1vcGVuLWZpbGU6dW5kbyc6IDo6dGhpcy51bmRvLFxuICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZTptb3ZlLWN1cnNvci1kb3duJzogOjp0aGlzLm1vdmVDdXJzb3JEb3duLFxuICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZTptb3ZlLWN1cnNvci11cCc6IDo6dGhpcy5tb3ZlQ3Vyc29yVXAsXG4gICAgICAgICAgICAnYWR2YW5jZWQtb3Blbi1maWxlOm1vdmUtY3Vyc29yLWJvdHRvbSc6IDo6dGhpcy5tb3ZlQ3Vyc29yQm90dG9tLFxuICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZTptb3ZlLWN1cnNvci10b3AnOiA6OnRoaXMubW92ZUN1cnNvclRvcCxcbiAgICAgICAgICAgICdhZHZhbmNlZC1vcGVuLWZpbGU6Y29uZmlybS1zZWxlY3RlZC1vci1maXJzdCc6IDo6dGhpcy5jb25maXJtU2VsZWN0ZWRPckZpcnN0LFxuICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZTpkZWxldGUtcGF0aC1jb21wb25lbnQnOiA6OnRoaXMuZGVsZXRlUGF0aENvbXBvbmVudCxcblxuICAgICAgICAgICAgJ3BhbmU6c3BsaXQtbGVmdCc6IHRoaXMuc3BsaXRDb25maXJtKChwYW5lKSA9PiBwYW5lLnNwbGl0TGVmdCgpKSxcbiAgICAgICAgICAgICdwYW5lOnNwbGl0LXJpZ2h0JzogdGhpcy5zcGxpdENvbmZpcm0oKHBhbmUpID0+IHBhbmUuc3BsaXRSaWdodCgpKSxcbiAgICAgICAgICAgICdwYW5lOnNwbGl0LXVwJzogdGhpcy5zcGxpdENvbmZpcm0oKHBhbmUpID0+IHBhbmUuc3BsaXRVcCgpKSxcbiAgICAgICAgICAgICdwYW5lOnNwbGl0LWRvd24nOiB0aGlzLnNwbGl0Q29uZmlybSgocGFuZSkgPT4gcGFuZS5zcGxpdERvd24oKSksXG4gICAgICAgIH0pKTtcblxuICAgICAgICB0aGlzLnZpZXcub25EaWRDbGlja0ZpbGUoOjp0aGlzLmNsaWNrRmlsZSk7XG4gICAgICAgIHRoaXMudmlldy5vbkRpZENsaWNrQWRkUHJvamVjdEZvbGRlcig6OnRoaXMuYWRkUHJvamVjdEZvbGRlcik7XG4gICAgICAgIHRoaXMudmlldy5vbkRpZENsaWNrT3V0c2lkZSg6OnRoaXMuZGV0YWNoKTtcbiAgICAgICAgdGhpcy52aWV3Lm9uRGlkUGF0aENoYW5nZSg6OnRoaXMucGF0aENoYW5nZSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG4gICAgfVxuXG4gICAgY2xpY2tGaWxlKGZpbGVOYW1lKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0UGF0aChuZXcgUGF0aChmaWxlTmFtZSkpO1xuICAgIH1cblxuICAgIHBhdGhDaGFuZ2UobmV3UGF0aCkgIHtcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG5ld1BhdGg7XG5cbiAgICAgICAgbGV0IHJlcGxhY2UgPSBmYWxzZTtcblxuICAgICAgICAvLyBTaW5jZSB0aGUgdXNlciB0eXBlZCB0aGlzLCBhcHBseSBmYXN0LWRpci1zd2l0Y2hcbiAgICAgICAgLy8gc2hvcnRjdXRzLlxuICAgICAgICBpZiAoY29uZmlnLmdldCgnaGVsbURpclN3aXRjaCcpKSB7XG4gICAgICAgICAgICBpZiAobmV3UGF0aC5oYXNTaG9ydGN1dCgnJykpIHsgIC8vIEVtcHR5IHNob3J0Y3V0ID09ICcvLydcbiAgICAgICAgICAgICAgICBuZXdQYXRoID0gbmV3UGF0aC5yb290KCk7XG4gICAgICAgICAgICAgICAgcmVwbGFjZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1BhdGguaGFzU2hvcnRjdXQoJ34nKSkge1xuICAgICAgICAgICAgICAgIG5ld1BhdGggPSBuZXcgUGF0aChvc2Vudi5ob21lKCkgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICAgICAgcmVwbGFjZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1BhdGguaGFzU2hvcnRjdXQoJzonKSkge1xuICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0UGF0aCA9IGdldFByb2plY3RQYXRoKCk7XG4gICAgICAgICAgICAgICAgaWYgKHByb2plY3RQYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1BhdGggPSBuZXcgUGF0aChwcm9qZWN0UGF0aCArIG5ld1BhdGguc2VwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UncmUgcmVwbGFjaW5nIHRoZSBwYXRoLCBzYXZlIGl0IGluIHRoZSBoaXN0b3J5IGFuZCBzZXQgdGhlIHBhdGguXG4gICAgICAgIC8vIElmIHdlIGFyZW4ndCwgdGhlIHVzZXIgaXMganVzdCB0eXBpbmcgYW5kIHdlIGRvbid0IG5lZWQgdGhlIGhpc3RvcnlcbiAgICAgICAgLy8gYW5kIHdhbnQgdG8gYXZvaWQgc2V0dGluZyB0aGUgcGF0aCB3aGljaCByZXNldHMgdGhlIGN1cnNvci5cbiAgICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGF0aChuZXdQYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdFBhdGgobmV3UGF0aCwgc3BsaXQ9ZmFsc2UpIHtcbiAgICAgICAgaWYgKG5ld1BhdGguaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgaWYgKHNwbGl0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGF0b20uYmVlcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgobmV3UGF0aC5hc0RpcmVjdG9yeSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChzcGxpdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuc3BsaXRPcGVuUGF0aChuZXdQYXRoLCBzcGxpdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5QYXRoKG5ld1BhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlUGF0aChuZXdQYXRoLCB7c2F2ZUhpc3Rvcnk9dHJ1ZX09e30pIHtcbiAgICAgICAgaWYgKHNhdmVIaXN0b3J5KSB7XG4gICAgICAgICAgICB0aGlzLnBhdGhIaXN0b3J5LnB1c2godGhpcy5jdXJyZW50UGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbmV3UGF0aDtcbiAgICAgICAgdGhpcy52aWV3LnNldFBhdGgobmV3UGF0aCk7XG4gICAgfVxuXG4gICAgc3BsaXRPcGVuUGF0aChwYXRoLCBzcGxpdCkge1xuICAgICAgICBzcGxpdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpO1xuICAgICAgICB0aGlzLm9wZW5QYXRoKHBhdGgpO1xuICAgIH1cblxuICAgIG9wZW5QYXRoKHBhdGgpIHtcbiAgICAgICAgaWYgKHBhdGguZXhpc3RzKCkpIHtcbiAgICAgICAgICAgIGlmIChwYXRoLmlzRmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoLmFic29sdXRlKTtcbiAgICAgICAgICAgICAgICBlbWl0dGVyLmVtaXQoJ2RpZC1vcGVuLXBhdGgnLCBwYXRoLmFic29sdXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhdG9tLmJlZXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwYXRoLmZyYWdtZW50KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhdGguY3JlYXRlRGlyZWN0b3JpZXMoKTtcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmdldCgnY3JlYXRlRmlsZUluc3RhbnRseScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGguY3JlYXRlRmlsZSgpO1xuICAgICAgICAgICAgICAgICAgICBlbWl0dGVyLmVtaXQoJ2RpZC1jcmVhdGUtcGF0aCcsIHBhdGguYWJzb2x1dGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguYWJzb2x1dGUpO1xuICAgICAgICAgICAgICAgIGVtaXR0ZXIuZW1pdCgnZGlkLW9wZW4tcGF0aCcsIHBhdGguYWJzb2x1dGUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdDb3VsZCBub3Qgb3BlbiBmaWxlJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGVycixcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2FsZXJ0JyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjb25maWcuZ2V0KCdjcmVhdGVEaXJlY3RvcmllcycpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhdGguY3JlYXRlRGlyZWN0b3JpZXMoKTtcbiAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnRGlyZWN0b3J5IGNyZWF0ZWQnLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogYENyZWF0ZWQgZGlyZWN0b3J5IFwiJHtwYXRoLmZ1bGx9XCIuYCxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZpbGUtZGlyZWN0b3J5JyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBlbWl0dGVyLmVtaXQoJ2RpZC1jcmVhdGUtcGF0aCcsIHBhdGguYWJzb2x1dGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0NvdWxkIG5vdCBjcmVhdGUgZGlyZWN0b3J5Jywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGVycixcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZpbGUtZGlyZWN0b3J5JyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0b20uYmVlcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlUGF0aENvbXBvbmVudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGguaXNSb290KCkpIHtcbiAgICAgICAgICAgIGF0b20uYmVlcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoKHRoaXMuY3VycmVudFBhdGgucGFyZW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkUHJvamVjdEZvbGRlcihmaWxlTmFtZSkge1xuICAgICAgICBsZXQgZm9sZGVyUGF0aCA9IG5ldyBQYXRoKGZpbGVOYW1lKTtcbiAgICAgICAgaWYgKGZvbGRlclBhdGguaXNEaXJlY3RvcnkoKSAmJiAhZm9sZGVyUGF0aC5pc1Byb2plY3REaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgYXRvbS5wcm9qZWN0LmFkZFBhdGgoZm9sZGVyUGF0aC5hYnNvbHV0ZSk7XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnQWRkZWQgcHJvamVjdCBmb2xkZXInLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiBgQWRkZWQgXCIke2ZvbGRlclBhdGguZnVsbH1cIiBhcyBhIHByb2plY3QgZm9sZGVyLmAsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZpbGUtZGlyZWN0b3J5JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy52aWV3LnJlZnJlc2hQYXRoTGlzdEl0ZW0oZm9sZGVyUGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdG9tLmJlZXAoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFNlbGVjdGVkUHJvamVjdEZvbGRlcihldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBsZXQgc2VsZWN0ZWRQYXRoID0gdGhpcy52aWV3LnNlbGVjdGVkUGF0aCgpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRQYXRoID09IG51bGwgJiYgdGhpcy5jdXJyZW50UGF0aC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFByb2plY3RGb2xkZXIodGhpcy5jdXJyZW50UGF0aC5mdWxsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzZWxlY3RlZFBhdGggIT09IG51bGwgJiYgIXNlbGVjdGVkUGF0aC5lcXVhbHModGhpcy5jdXJyZW50UGF0aC5wYXJlbnQoKSkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkUHJvamVjdEZvbGRlcihzZWxlY3RlZFBhdGguZnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdG9tLmJlZXAoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF1dG9jb21wbGV0ZSB0aGUgY3VycmVudCBpbnB1dCB0byB0aGUgbG9uZ2VzdCBjb21tb24gcHJlZml4IGFtb25nXG4gICAgICogcGF0aHMgbWF0Y2hpbmcgdGhlIGN1cnJlbnQgaW5wdXQuIElmIG5vIGNoYW5nZSBpcyBtYWRlIHRvIHRoZVxuICAgICAqIGN1cnJlbnQgcGF0aCwgYmVlcC5cbiAgICAgKi9cbiAgICBhdXRvY29tcGxldGUoKSB7XG4gICAgICAgIGxldCBtYXRjaGluZ1BhdGhzID0gdGhpcy5jdXJyZW50UGF0aC5tYXRjaGluZ1BhdGhzKCk7XG4gICAgICAgIGlmIChtYXRjaGluZ1BhdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgYXRvbS5iZWVwKCk7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2hpbmdQYXRocy5sZW5ndGggPT09IDEgfHwgY29uZmlnLmdldCgnZnV6enlNYXRjaCcpKSB7XG4gICAgICAgICAgICBsZXQgbmV3UGF0aCA9IG1hdGNoaW5nUGF0aHNbMF07XG4gICAgICAgICAgICBpZiAobmV3UGF0aC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoKG5ld1BhdGguYXNEaXJlY3RvcnkoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGF0aChuZXdQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBuZXdQYXRoID0gUGF0aC5jb21tb25QcmVmaXgobWF0Y2hpbmdQYXRocyk7XG4gICAgICAgICAgICBpZiAobmV3UGF0aC5lcXVhbHModGhpcy5jdXJyZW50UGF0aCkpIHtcbiAgICAgICAgICAgICAgICBhdG9tLmJlZXAoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoKG5ld1BhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzcGxpdENvbmZpcm0oc3BsaXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlybS5iaW5kKHRoaXMsIHVuZGVmaW5lZCwgc3BsaXQpO1xuICAgIH1cblxuICAgIGNvbmZpcm0oZXZlbnQsIHNwbGl0PWZhbHNlKSB7XG4gICAgICAgIGxldCBzZWxlY3RlZFBhdGggPSB0aGlzLnZpZXcuc2VsZWN0ZWRQYXRoKCk7XG4gICAgICAgIGlmIChzZWxlY3RlZFBhdGggIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0UGF0aChzZWxlY3RlZFBhdGgsIHNwbGl0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0UGF0aCh0aGlzLmN1cnJlbnRQYXRoLCBzcGxpdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25maXJtU2VsZWN0ZWRPckZpcnN0KCkge1xuICAgICAgICBsZXQgc2VsZWN0ZWRQYXRoID0gdGhpcy52aWV3LnNlbGVjdGVkUGF0aCgpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRQYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFBhdGgoc2VsZWN0ZWRQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmaXJzdFBhdGggPSB0aGlzLnZpZXcuZmlyc3RQYXRoKCk7XG4gICAgICAgICAgICBpZiAoZmlyc3RQYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RQYXRoKGZpcnN0UGF0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0UGF0aCh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5kbygpIHtcbiAgICAgICAgaWYgKHRoaXMucGF0aEhpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoKHRoaXMucGF0aEhpc3RvcnkucG9wKCksIHtzYXZlSGlzdG9yeTogZmFsc2V9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpbml0aWFsUGF0aCA9IFBhdGguaW5pdGlhbCgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYXRoLmVxdWFscyhpbml0aWFsUGF0aCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgoaW5pdGlhbFBhdGgsIHtzYXZlSGlzdG9yeTogZmFsc2V9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXRvbS5iZWVwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlQ3Vyc29yRG93bigpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy52aWV3LmN1cnNvckluZGV4O1xuICAgICAgICBpZiAoaW5kZXggPT09IG51bGwgfHwgaW5kZXggPT09IHRoaXMudmlldy5wYXRoTGlzdExlbmd0aCgpIC0gMSkge1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlldy5zZXRDdXJzb3JJbmRleChpbmRleCk7XG4gICAgfVxuXG4gICAgbW92ZUN1cnNvclVwKCkge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnZpZXcuY3Vyc29ySW5kZXg7XG4gICAgICAgIGlmIChpbmRleCA9PT0gbnVsbCB8fCBpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLnZpZXcucGF0aExpc3RMZW5ndGgoKSAtIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmRleC0tO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52aWV3LnNldEN1cnNvckluZGV4KGluZGV4KTtcbiAgICB9XG5cbiAgICBtb3ZlQ3Vyc29yVG9wKCkge1xuICAgICAgICB0aGlzLnZpZXcuc2V0Q3Vyc29ySW5kZXgoMCk7XG4gICAgfVxuXG4gICAgbW92ZUN1cnNvckJvdHRvbSgpIHtcbiAgICAgICAgdGhpcy52aWV3LnNldEN1cnNvckluZGV4KHRoaXMudmlldy5wYXRoTGlzdExlbmd0aCgpIC0gMSk7XG4gICAgfVxuXG4gICAgZGV0YWNoKCkge1xuICAgICAgICBpZiAodGhpcy5wYW5lbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKTtcbiAgICB9XG5cbiAgICBhdHRhY2goKSB7XG4gICAgICAgIGlmICh0aGlzLnBhbmVsICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW5pdGlhbFBhdGggPSBQYXRoLmluaXRpYWwoKTtcbiAgICAgICAgdGhpcy5wYXRoSGlzdG9yeSA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gaW5pdGlhbFBhdGg7XG4gICAgICAgIHRoaXMudXBkYXRlUGF0aChQYXRoLmluaXRpYWwoKSwge3NhdmVIaXN0b3J5OiBmYWxzZX0pO1xuICAgICAgICB0aGlzLnBhbmVsID0gdGhpcy52aWV3LmNyZWF0ZU1vZGFsUGFuZWwoKTtcbiAgICB9XG59XG4iXX0=