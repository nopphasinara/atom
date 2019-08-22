Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

exports.consumeElementIcons = consumeElementIcons;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _atom = require('atom');

var _eventKit = require('event-kit');

var _config = require('./config');

var config = _interopRequireWildcard(_config);

var _models = require('./models');

var _utils = require('./utils');

var addIconToElement = null;

/**
 * Consumer for file-icons
 * https://github.com/DanBrooker/file-icons
 */

function consumeElementIcons(cb) {
    addIconToElement = cb;
    return new _atom.Disposable(function () {
        addIconToElement = null;
    });
}

var AdvancedOpenFileView = (function () {
    function AdvancedOpenFileView() {
        var _this = this;

        _classCallCheck(this, AdvancedOpenFileView);

        this.emitter = new _eventKit.Emitter();
        this.cursorIndex = null;
        this._updatingPath = false;

        // Element references
        this.pathInput = this.content.querySelector('.path-input');
        this.pathList = this.content.querySelector('.list-group');
        this.parentDirectoryListItem = this.content.querySelector('.parent-directory');

        // Initialize text editor
        this.pathEditor = this.pathInput.getModel();
        this.pathEditor.setPlaceholderText('/path/to/file.txt');
        this.pathEditor.setSoftWrapped(false);

        // Update the path list whenever the path changes.
        this.pathEditor.onDidChange(function () {
            var newPath = new _models.Path(_this.pathEditor.getText());

            _this.parentDirectoryListItem.dataset.fileName = newPath.parent().full;

            _this.setPathList(newPath.matchingPaths(), {
                hideParent: newPath.fragment !== '' || newPath.isRoot(),
                sort: !(config.get('fuzzyMatch') && newPath.fragment !== '')
            });
        });

        this.content.addEventListener('click', function (ev) {
            // Keep focus on the text input and do not propagate so that the
            // outside click handler doesn't pick up the event.
            ev.stopPropagation();
            _this.pathInput.focus();
        });

        this.content.addEventListener('click', function (ev) {
            var _context;

            if ((_context = ev.target, _utils.closest).call(_context, '.add-project-folder') !== null) {
                var _context2;

                var _listItem = (_context2 = ev.target, _utils.closest).call(_context2, '.list-item');
                _this.emitter.emit('did-click-add-project-folder', _listItem.dataset.fileName);
                return; // Don't try to enter the folder too!
            }

            var listItem = (_context = ev.target, _utils.closest).call(_context, '.list-item');
            if (listItem !== null) {
                _this.emitter.emit('did-click-file', listItem.dataset.fileName);
            }
        });
    }

    _createDecoratedClass(AdvancedOpenFileView, [{
        key: 'createPathListItem',
        value: function createPathListItem(path) {
            var icon = path.isDirectory() ? 'icon-file-directory' : 'icon-file-text';
            return '\n            <li class="list-item ' + (path.isDirectory() ? 'directory' : '') + '"\n                data-file-name="' + path.full + '">\n                <span class="filename icon ' + icon + '"\n                      data-name="' + path.fragment + '">\n                    ' + path.fragment + '\n                </span>\n                ' + (path.isDirectory() && !path.isProjectDirectory() ? this.addProjectButton() : '') + '\n            </li>\n        ';
        }
    }, {
        key: 'addProjectButton',
        value: function addProjectButton() {
            return '\n            <span class="add-project-folder icon icon-plus"\n                title="Open as project folder">\n            </span>\n        ';
        }
    }, {
        key: 'createModalPanel',
        value: function createModalPanel() {
            var _this2 = this;

            var panel = atom.workspace.addModalPanel({
                item: this.content
            });

            // Bind the outside click handler and destroy it when the panel is
            // destroyed.
            var outsideClickHandler = function outsideClickHandler(ev) {
                var _context3;

                if ((_context3 = ev.target, _utils.closest).call(_context3, '.advanced-open-file') === null) {
                    _this2.emitter.emit('did-click-outside');
                }
            };

            document.documentElement.addEventListener('click', outsideClickHandler);
            panel.onDidDestroy(function () {
                document.documentElement.removeEventListener('click', outsideClickHandler);
            });

            var modal = this.content.parentNode;
            modal.style.maxHeight = document.body.clientHeight - modal.offsetTop + 'px';
            modal.style.display = 'flex';
            modal.style.flexDirection = 'column';

            this.pathInput.focus();

            return panel;
        }

        /**
         * Re-render list item for the given path, if it exists.
         */
    }, {
        key: 'refreshPathListItem',
        value: function refreshPathListItem(path) {
            var listItem = this.content.querySelector('.list-item[data-file-name="' + path.full + '"]');
            if (listItem) {
                var newListItem = (0, _utils.dom)(this.createPathListItem(path));
                listItem.parentNode.replaceChild(newListItem, listItem);
            }
        }
    }, {
        key: 'onDidClickFile',
        value: function onDidClickFile(callback) {
            this.emitter.on('did-click-file', callback);
        }
    }, {
        key: 'onDidClickAddProjectFolder',
        value: function onDidClickAddProjectFolder(callback) {
            this.emitter.on('did-click-add-project-folder', callback);
        }
    }, {
        key: 'onDidClickOutside',
        value: function onDidClickOutside(callback) {
            this.emitter.on('did-click-outside', callback);
        }

        /**
         * Subscribe to user-initiated changes in the path.
         */
    }, {
        key: 'onDidPathChange',
        value: function onDidPathChange(callback) {
            var _this3 = this;

            this.pathEditor.onDidChange(function () {
                if (!_this3._updatingPath) {
                    callback(new _models.Path(_this3.pathEditor.getText()));
                }
            });
        }
    }, {
        key: 'selectedPath',
        value: function selectedPath() {
            if (this.cursorIndex !== null) {
                var selected = this.pathList.querySelector('.list-item.selected');
                if (selected !== null) {
                    return new _models.Path(selected.dataset.fileName);
                }
            }

            return null;
        }
    }, {
        key: 'firstPath',
        value: function firstPath() {
            var pathItems = this.pathList.querySelectorAll('.list-item:not(.parent-directory)');
            if (pathItems.length > 0) {
                return new _models.Path(pathItems[0].dataset.fileName);
            } else {
                return null;
            }
        }
    }, {
        key: 'pathListLength',
        value: function pathListLength() {
            return this.pathList.querySelectorAll('.list-item:not(.hidden)').length;
        }
    }, {
        key: 'setPath',
        value: function setPath(path) {
            this._updatingPath = true;

            this.pathEditor.setText(path.full);
            this.pathEditor.scrollToCursorPosition();

            this._updatingPath = false;
        }
    }, {
        key: 'forEachListItem',
        value: function forEachListItem(selector, callback) {
            var listItems = this.pathList.querySelectorAll(selector);
            for (var k = 0; k < listItems.length; k++) {
                callback(listItems[k]);
            }
        }
    }, {
        key: 'setPathList',
        value: function setPathList(paths) {
            var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var _ref$hideParent = _ref.hideParent;
            var hideParent = _ref$hideParent === undefined ? false : _ref$hideParent;
            var _ref$sort = _ref.sort;
            var sort = _ref$sort === undefined ? true : _ref$sort;

            this.cursorIndex = null;

            this.forEachListItem('.list-item.selected', function (listItem) {
                listItem.classList.remove('selected');
            });

            this.forEachListItem('.list-item:not(.parent-directory)', function (listItem) {
                listItem.remove();
            });

            if (paths.length === 0 || hideParent) {
                this.parentDirectoryListItem.classList.add('hidden');
            } else {
                this.parentDirectoryListItem.classList.remove('hidden');
            }

            if (paths.length > 0) {
                if (sort) {
                    // Split list into directories and files and sort them.
                    paths = paths.sort(_models.Path.compare);
                    var directoryPaths = paths.filter(function (path) {
                        return path.isDirectory();
                    });
                    var filePaths = paths.filter(function (path) {
                        return path.isFile();
                    });
                    this._appendToPathList(directoryPaths);
                    this._appendToPathList(filePaths);
                } else {
                    this._appendToPathList(paths);
                }
            }
        }
    }, {
        key: '_appendToPathList',
        value: function _appendToPathList(paths) {
            for (var path of paths) {
                if (path.exists()) {
                    var listItem = (0, _utils.dom)(this.createPathListItem(path));
                    if (addIconToElement) {
                        var filenameElement = listItem.querySelector('.filename.icon');
                        filenameElement.classList.remove('icon-file-text', 'icon-file-directory');
                        addIconToElement(filenameElement, path.absolute);
                    }
                    this.pathList.appendChild(listItem);
                }
            }
        }
    }, {
        key: 'setCursorIndex',
        value: function setCursorIndex(index) {
            if (index < 0 || index >= this.pathListLength()) {
                index = null;
            }

            this.cursorIndex = index;
            this.forEachListItem('.list-item.selected', function (listItem) {
                listItem.classList.remove('selected');
            });

            if (this.cursorIndex !== null) {
                var listItems = this.pathList.querySelectorAll('.list-item:not(.hidden)');
                if (listItems.length > index) {
                    var selected = listItems[index];
                    selected.classList.add('selected');

                    // If the selected element is out of view, scroll it into view.
                    var parentElement = selected.parentElement;
                    var selectedTop = selected.offsetTop;
                    var parentScrollBottom = parentElement.scrollTop + parentElement.clientHeight;
                    if (selectedTop < parentElement.scrollTop) {
                        parentElement.scrollTop = selectedTop;
                    } else if (selectedTop >= parentScrollBottom) {
                        var selectedBottom = selectedTop + selected.clientHeight;
                        parentElement.scrollTop += selectedBottom - parentScrollBottom;
                    }
                }
            }
        }
    }, {
        key: 'content',
        decorators: [_utils.cachedProperty],
        get: function get() {
            return (0, _utils.dom)('\n            <div class="advanced-open-file">\n                <p class="info-message icon icon-file-add">\n                    Enter the path for the file to open or create.\n                </p>\n                <div class="path-input-container">\n                    <atom-text-editor class="path-input" mini></atom-text-editor>\n                </div>\n                <ul class="list-group">\n                    <li class="list-item parent-directory">\n                        <span class="icon icon-file-directory">..</span>\n                    </li>\n                </ul>\n            </div>\n        ');
        }
    }]);

    return AdvancedOpenFileView;
})();

exports['default'] = AdvancedOpenFileView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUN5QixNQUFNOzt3QkFDVCxXQUFXOztzQkFFVCxVQUFVOztJQUF0QixNQUFNOztzQkFDQyxVQUFVOztxQkFDYyxTQUFTOztBQUVwRCxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQzs7Ozs7OztBQU1yQixTQUFTLG1CQUFtQixDQUFDLEVBQUUsRUFBRTtBQUNwQyxvQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDdEIsV0FBTyxxQkFBZSxZQUFNO0FBQ3hCLHdCQUFnQixHQUFHLElBQUksQ0FBQztLQUMzQixDQUFDLENBQUM7Q0FDTjs7SUFFb0Isb0JBQW9CO0FBQzFCLGFBRE0sb0JBQW9CLEdBQ3ZCOzs7OEJBREcsb0JBQW9COztBQUVqQyxZQUFJLENBQUMsT0FBTyxHQUFHLHVCQUFhLENBQUM7QUFDN0IsWUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsWUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7OztBQUczQixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzNELFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsWUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7OztBQUcvRSxZQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDNUMsWUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3hELFlBQUksQ0FBQyxVQUFVLENBQUMsY0FB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a0JBQWtCLEVBQUU7QUFDMUMsNEJBQUksY0FBYyxHQUFHLFdBQVcsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDO0FBQ3pELHFDQUFhLENBQUMsU0FBUyxJQUFJLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQztxQkFDbEU7aUJBQ0o7YUFDSjtTQUNKOzs7O2FBek5VLGVBQUc7QUFDVixtQkFBTyx1bkJBY0wsQ0FBQztTQUNOOzs7V0FsRWdCLG9CQUFvQjs7O3FCQUFwQixvQkFBb0IiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvbGliL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5pbXBvcnQge0Rpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtQYXRofSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQge2NhY2hlZFByb3BlcnR5LCBjbG9zZXN0LCBkb219IGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgYWRkSWNvblRvRWxlbWVudCA9IG51bGw7XG5cbi8qKlxuICogQ29uc3VtZXIgZm9yIGZpbGUtaWNvbnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9EYW5Ccm9va2VyL2ZpbGUtaWNvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnN1bWVFbGVtZW50SWNvbnMoY2IpIHtcbiAgICBhZGRJY29uVG9FbGVtZW50ID0gY2I7XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgYWRkSWNvblRvRWxlbWVudCA9IG51bGw7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkdmFuY2VkT3BlbkZpbGVWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5jdXJzb3JJbmRleCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3VwZGF0aW5nUGF0aCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIEVsZW1lbnQgcmVmZXJlbmNlc1xuICAgICAgICB0aGlzLnBhdGhJbnB1dCA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcucGF0aC1pbnB1dCcpO1xuICAgICAgICB0aGlzLnBhdGhMaXN0ID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXN0LWdyb3VwJyk7XG4gICAgICAgIHRoaXMucGFyZW50RGlyZWN0b3J5TGlzdEl0ZW0gPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignLnBhcmVudC1kaXJlY3RvcnknKTtcblxuICAgICAgICAvLyBJbml0aWFsaXplIHRleHQgZWRpdG9yXG4gICAgICAgIHRoaXMucGF0aEVkaXRvciA9IHRoaXMucGF0aElucHV0LmdldE1vZGVsKCk7XG4gICAgICAgIHRoaXMucGF0aEVkaXRvci5zZXRQbGFjZWhvbGRlclRleHQoJy9wYXRoL3RvL2ZpbGUudHh0Jyk7XG4gICAgICAgIHRoaXMucGF0aEVkaXRvci5zZXRTb2Z0V3JhcHBlZChmYWxzZSk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBwYXRoIGxpc3Qgd2hlbmV2ZXIgdGhlIHBhdGggY2hhbmdlcy5cbiAgICAgICAgdGhpcy5wYXRoRWRpdG9yLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdQYXRoID0gbmV3IFBhdGgodGhpcy5wYXRoRWRpdG9yLmdldFRleHQoKSk7XG5cbiAgICAgICAgICAgIHRoaXMucGFyZW50RGlyZWN0b3J5TGlzdEl0ZW0uZGF0YXNldC5maWxlTmFtZSA9IG5ld1BhdGgucGFyZW50KCkuZnVsbDtcblxuICAgICAgICAgICAgdGhpcy5zZXRQYXRoTGlzdChuZXdQYXRoLm1hdGNoaW5nUGF0aHMoKSwge1xuICAgICAgICAgICAgICAgIGhpZGVQYXJlbnQ6IG5ld1BhdGguZnJhZ21lbnQgIT09ICcnIHx8IG5ld1BhdGguaXNSb290KCksXG4gICAgICAgICAgICAgICAgc29ydDogIShjb25maWcuZ2V0KCdmdXp6eU1hdGNoJykgJiYgbmV3UGF0aC5mcmFnbWVudCAhPT0gJycpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xuICAgICAgICAgICAgLy8gS2VlcCBmb2N1cyBvbiB0aGUgdGV4dCBpbnB1dCBhbmQgZG8gbm90IHByb3BhZ2F0ZSBzbyB0aGF0IHRoZVxuICAgICAgICAgICAgLy8gb3V0c2lkZSBjbGljayBoYW5kbGVyIGRvZXNuJ3QgcGljayB1cCB0aGUgZXZlbnQuXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMucGF0aElucHV0LmZvY3VzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xuICAgICAgICAgICAgaWYgKGV2LnRhcmdldDo6Y2xvc2VzdCgnLmFkZC1wcm9qZWN0LWZvbGRlcicpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxpc3RJdGVtID0gZXYudGFyZ2V0OjpjbG9zZXN0KCcubGlzdC1pdGVtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jbGljay1hZGQtcHJvamVjdC1mb2xkZXInLCBsaXN0SXRlbS5kYXRhc2V0LmZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm47IC8vIERvbid0IHRyeSB0byBlbnRlciB0aGUgZm9sZGVyIHRvbyFcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGxpc3RJdGVtID0gZXYudGFyZ2V0OjpjbG9zZXN0KCcubGlzdC1pdGVtJyk7XG4gICAgICAgICAgICBpZiAobGlzdEl0ZW0gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNsaWNrLWZpbGUnLCBsaXN0SXRlbS5kYXRhc2V0LmZpbGVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgQGNhY2hlZFByb3BlcnR5XG4gICAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgICAgIHJldHVybiBkb20oYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFkdmFuY2VkLW9wZW4tZmlsZVwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiaW5mby1tZXNzYWdlIGljb24gaWNvbi1maWxlLWFkZFwiPlxuICAgICAgICAgICAgICAgICAgICBFbnRlciB0aGUgcGF0aCBmb3IgdGhlIGZpbGUgdG8gb3BlbiBvciBjcmVhdGUuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYXRoLWlucHV0LWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICA8YXRvbS10ZXh0LWVkaXRvciBjbGFzcz1cInBhdGgtaW5wdXRcIiBtaW5pPjwvYXRvbS10ZXh0LWVkaXRvcj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbSBwYXJlbnQtZGlyZWN0b3J5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb24gaWNvbi1maWxlLWRpcmVjdG9yeVwiPi4uPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYCk7XG4gICAgfVxuXG4gICAgY3JlYXRlUGF0aExpc3RJdGVtKHBhdGgpIHtcbiAgICAgICAgbGV0IGljb24gPSBwYXRoLmlzRGlyZWN0b3J5KCkgPyAnaWNvbi1maWxlLWRpcmVjdG9yeScgOiAnaWNvbi1maWxlLXRleHQnO1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtICR7cGF0aC5pc0RpcmVjdG9yeSgpID8gJ2RpcmVjdG9yeScgOiAnJ31cIlxuICAgICAgICAgICAgICAgIGRhdGEtZmlsZS1uYW1lPVwiJHtwYXRoLmZ1bGx9XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmaWxlbmFtZSBpY29uICR7aWNvbn1cIlxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEtbmFtZT1cIiR7cGF0aC5mcmFnbWVudH1cIj5cbiAgICAgICAgICAgICAgICAgICAgJHtwYXRoLmZyYWdtZW50fVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAke3BhdGguaXNEaXJlY3RvcnkoKSAmJiAhcGF0aC5pc1Byb2plY3REaXJlY3RvcnkoKVxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuYWRkUHJvamVjdEJ1dHRvbigpXG4gICAgICAgICAgICAgICAgICAgIDogJyd9XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIGFkZFByb2plY3RCdXR0b24oKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImFkZC1wcm9qZWN0LWZvbGRlciBpY29uIGljb24tcGx1c1wiXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJPcGVuIGFzIHByb2plY3QgZm9sZGVyXCI+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIGA7XG4gICAgfVxuXG4gICAgY3JlYXRlTW9kYWxQYW5lbCgpIHtcbiAgICAgICAgbGV0IHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7XG4gICAgICAgICAgICBpdGVtOiB0aGlzLmNvbnRlbnQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEJpbmQgdGhlIG91dHNpZGUgY2xpY2sgaGFuZGxlciBhbmQgZGVzdHJveSBpdCB3aGVuIHRoZSBwYW5lbCBpc1xuICAgICAgICAvLyBkZXN0cm95ZWQuXG4gICAgICAgIGxldCBvdXRzaWRlQ2xpY2tIYW5kbGVyID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0OjpjbG9zZXN0KCcuYWR2YW5jZWQtb3Blbi1maWxlJykgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNsaWNrLW91dHNpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xpY2tIYW5kbGVyKTtcbiAgICAgICAgcGFuZWwub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG91dHNpZGVDbGlja0hhbmRsZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgbW9kYWwgPSB0aGlzLmNvbnRlbnQucGFyZW50Tm9kZTtcbiAgICAgICAgbW9kYWwuc3R5bGUubWF4SGVpZ2h0ID0gYCR7ZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSBtb2RhbC5vZmZzZXRUb3B9cHhgO1xuICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgICAgICBtb2RhbC5zdHlsZS5mbGV4RGlyZWN0aW9uID0gJ2NvbHVtbic7XG5cbiAgICAgICAgdGhpcy5wYXRoSW5wdXQuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gcGFuZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmUtcmVuZGVyIGxpc3QgaXRlbSBmb3IgdGhlIGdpdmVuIHBhdGgsIGlmIGl0IGV4aXN0cy5cbiAgICAgKi9cbiAgICByZWZyZXNoUGF0aExpc3RJdGVtKHBhdGgpIHtcbiAgICAgICAgbGV0IGxpc3RJdGVtID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoYC5saXN0LWl0ZW1bZGF0YS1maWxlLW5hbWU9XCIke3BhdGguZnVsbH1cIl1gKTtcbiAgICAgICAgaWYgKGxpc3RJdGVtKSB7XG4gICAgICAgICAgICBsZXQgbmV3TGlzdEl0ZW0gPSBkb20odGhpcy5jcmVhdGVQYXRoTGlzdEl0ZW0ocGF0aCkpO1xuICAgICAgICAgICAgbGlzdEl0ZW0ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3TGlzdEl0ZW0sIGxpc3RJdGVtKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRGlkQ2xpY2tGaWxlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5vbignZGlkLWNsaWNrLWZpbGUnLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgb25EaWRDbGlja0FkZFByb2plY3RGb2xkZXIoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2xpY2stYWRkLXByb2plY3QtZm9sZGVyJywgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIG9uRGlkQ2xpY2tPdXRzaWRlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5vbignZGlkLWNsaWNrLW91dHNpZGUnLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIHRvIHVzZXItaW5pdGlhdGVkIGNoYW5nZXMgaW4gdGhlIHBhdGguXG4gICAgICovXG4gICAgb25EaWRQYXRoQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMucGF0aEVkaXRvci5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3VwZGF0aW5nUGF0aCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBQYXRoKHRoaXMucGF0aEVkaXRvci5nZXRUZXh0KCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZWN0ZWRQYXRoKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJzb3JJbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5wYXRoTGlzdC5xdWVyeVNlbGVjdG9yKCcubGlzdC1pdGVtLnNlbGVjdGVkJyk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFBhdGgoc2VsZWN0ZWQuZGF0YXNldC5maWxlTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmaXJzdFBhdGgoKSB7XG4gICAgICAgIGxldCBwYXRoSXRlbXMgPSB0aGlzLnBhdGhMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LWl0ZW06bm90KC5wYXJlbnQtZGlyZWN0b3J5KScpO1xuICAgICAgICBpZiAocGF0aEl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGF0aChwYXRoSXRlbXNbMF0uZGF0YXNldC5maWxlTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhdGhMaXN0TGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXRoTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1pdGVtOm5vdCguaGlkZGVuKScpLmxlbmd0aDtcbiAgICB9XG5cbiAgICBzZXRQYXRoKHBhdGgpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRpbmdQYXRoID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnBhdGhFZGl0b3Iuc2V0VGV4dChwYXRoLmZ1bGwpO1xuICAgICAgICB0aGlzLnBhdGhFZGl0b3Iuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0aW5nUGF0aCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZvckVhY2hMaXN0SXRlbShzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGxpc3RJdGVtcyA9IHRoaXMucGF0aExpc3QucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGlzdEl0ZW1zLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhsaXN0SXRlbXNba10pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0UGF0aExpc3QocGF0aHMsIHtoaWRlUGFyZW50PWZhbHNlLCBzb3J0PXRydWV9PXt9KSB7XG4gICAgICAgIHRoaXMuY3Vyc29ySW5kZXggPSBudWxsO1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaExpc3RJdGVtKCcubGlzdC1pdGVtLnNlbGVjdGVkJywgKGxpc3RJdGVtKSA9PiB7XG4gICAgICAgICAgICBsaXN0SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZvckVhY2hMaXN0SXRlbSgnLmxpc3QtaXRlbTpub3QoLnBhcmVudC1kaXJlY3RvcnkpJywgKGxpc3RJdGVtKSA9PiB7XG4gICAgICAgICAgICBsaXN0SXRlbS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCB8fCBoaWRlUGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudERpcmVjdG9yeUxpc3RJdGVtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnREaXJlY3RvcnlMaXN0SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoc29ydCkge1xuICAgICAgICAgICAgICAgIC8vIFNwbGl0IGxpc3QgaW50byBkaXJlY3RvcmllcyBhbmQgZmlsZXMgYW5kIHNvcnQgdGhlbS5cbiAgICAgICAgICAgICAgICBwYXRocyA9IHBhdGhzLnNvcnQoUGF0aC5jb21wYXJlKTtcbiAgICAgICAgICAgICAgICBsZXQgZGlyZWN0b3J5UGF0aHMgPSBwYXRocy5maWx0ZXIoKHBhdGgpID0+IHBhdGguaXNEaXJlY3RvcnkoKSk7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVQYXRocyA9IHBhdGhzLmZpbHRlcigocGF0aCkgPT4gcGF0aC5pc0ZpbGUoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwZW5kVG9QYXRoTGlzdChkaXJlY3RvcnlQYXRocyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwZW5kVG9QYXRoTGlzdChmaWxlUGF0aHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcHBlbmRUb1BhdGhMaXN0KHBhdGhzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9hcHBlbmRUb1BhdGhMaXN0KHBhdGhzKSB7XG4gICAgICAgIGZvciAobGV0IHBhdGggb2YgcGF0aHMpIHtcbiAgICAgICAgICAgIGlmIChwYXRoLmV4aXN0cygpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxpc3RJdGVtID0gZG9tKHRoaXMuY3JlYXRlUGF0aExpc3RJdGVtKHBhdGgpKTtcbiAgICAgICAgICAgICAgICBpZiAoYWRkSWNvblRvRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZW5hbWVFbGVtZW50ID0gbGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignLmZpbGVuYW1lLmljb24nKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24tZmlsZS10ZXh0JywgJ2ljb24tZmlsZS1kaXJlY3RvcnknKTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSWNvblRvRWxlbWVudChmaWxlbmFtZUVsZW1lbnQsIHBhdGguYWJzb2x1dGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnBhdGhMaXN0LmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEN1cnNvckluZGV4KGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5wYXRoTGlzdExlbmd0aCgpKSB7XG4gICAgICAgICAgICBpbmRleCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnNvckluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuZm9yRWFjaExpc3RJdGVtKCcubGlzdC1pdGVtLnNlbGVjdGVkJywgKGxpc3RJdGVtKSA9PiB7XG4gICAgICAgICAgICBsaXN0SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5jdXJzb3JJbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGxpc3RJdGVtcyA9IHRoaXMucGF0aExpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3QtaXRlbTpub3QoLmhpZGRlbiknKTtcbiAgICAgICAgICAgIGlmIChsaXN0SXRlbXMubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBsaXN0SXRlbXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgc2VsZWN0ZWQgZWxlbWVudCBpcyBvdXQgb2Ygdmlldywgc2Nyb2xsIGl0IGludG8gdmlldy5cbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50RWxlbWVudCA9IHNlbGVjdGVkLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkVG9wID0gc2VsZWN0ZWQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRTY3JvbGxCb3R0b20gPSBwYXJlbnRFbGVtZW50LnNjcm9sbFRvcCArIHBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZFRvcCA8IHBhcmVudEVsZW1lbnQuc2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuc2Nyb2xsVG9wID0gc2VsZWN0ZWRUb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFRvcCA+PSBwYXJlbnRTY3JvbGxCb3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkQm90dG9tID0gc2VsZWN0ZWRUb3AgKyBzZWxlY3RlZC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudEVsZW1lbnQuc2Nyb2xsVG9wICs9IHNlbGVjdGVkQm90dG9tIC0gcGFyZW50U2Nyb2xsQm90dG9tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==