Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSelectList = require('atom-select-list');

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _fuzzaldrin = require('fuzzaldrin');

var _fuzzaldrin2 = _interopRequireDefault(_fuzzaldrin);

var _fuzzaldrinPlus = require('fuzzaldrin-plus');

var _fuzzaldrinPlus2 = _interopRequireDefault(_fuzzaldrinPlus);

var _atom = require('atom');

var _helperHelperJs = require('./../helper/helper.js');

'use babel';

var EventEmitter = require('events');
var Path = require('path');

var FinderView = (function (_EventEmitter) {
  _inherits(FinderView, _EventEmitter);

  function FinderView() {
    var _this = this;

    _classCallCheck(this, FinderView);

    _get(Object.getPrototypeOf(FinderView.prototype), 'constructor', this).call(this);
    var self = this;

    self.subscriptions = null;
    self.items = [];
    self.itemsCache = null;
    self.root = null;

    self.selectListView = new _atomSelectList2['default']({
      items: [],
      maxResults: 25,
      emptyMessage: 'No files found…',
      filterKeyForItem: function filterKeyForItem(item) {
        if (atom.config.get('ftp-remote-edit.finder.filterKeyForItem') == "Filename") {
          return item.file;
        } else {
          return item.relativePath;
        }
      },
      didCancelSelection: function didCancelSelection() {
        self.cancel();
      },
      didConfirmSelection: function didConfirmSelection(item) {
        self.open(item);
        self.cancel();
      },
      elementForItem: function elementForItem(_ref) {
        var file = _ref.file;
        var relativePath = _ref.relativePath;

        var key = null;
        if (atom.config.get('ftp-remote-edit.finder.filterKeyForItem') == "Filename") {
          key = file;
        } else {
          key = relativePath;
        }
        var filterQuery = self.selectListView.getFilterQuery();
        var matches = self.useAlternateScoring ? _fuzzaldrin2['default'].match(key, filterQuery) : _fuzzaldrinPlus2['default'].match(key, filterQuery);
        var li = document.createElement('li');
        var fileBasename = Path.basename(relativePath);
        var baseOffset = relativePath.length - fileBasename.length;
        var primaryLine = document.createElement('div');
        var secondaryLine = document.createElement('div');

        li.classList.add('two-lines');

        primaryLine.classList.add('primary-line', 'file', 'icon-file-text');
        primaryLine.dataset.name = fileBasename;
        primaryLine.dataset.path = relativePath;
        if (atom.config.get('ftp-remote-edit.finder.filterKeyForItem') == "Filename") {
          primaryLine.appendChild((0, _helperHelperJs.highlight)(key, matches, 0));
        } else {
          primaryLine.appendChild((0, _helperHelperJs.highlight)(fileBasename, matches, baseOffset));
        }
        li.appendChild(primaryLine);

        secondaryLine.classList.add('secondary-line', 'path', 'no-icon');
        if (atom.config.get('ftp-remote-edit.finder.filterKeyForItem') == "Filename") {
          var fragment = (0, _helperHelperJs.highlight)(key, matches, 0);
          var beforefragment = document.createTextNode(relativePath.replace(fileBasename, ""));
          secondaryLine.appendChild(beforefragment);
          secondaryLine.appendChild(fragment);
        } else {
          secondaryLine.appendChild((0, _helperHelperJs.highlight)(key, matches, 0));
        }
        li.appendChild(secondaryLine);

        return li;
      },
      order: function order(item1, item2) {
        return item1.relativePath.length - item2.relativePath.length;
      }
    });

    // Add class to use stylesheets from this package
    self.selectListView.element.classList.add('remote-finder');

    self.subscriptions = new _atom.CompositeDisposable();
    self.subscriptions.add(atom.config.observe('remote-finder.useAlternateScoring', function (newValue) {
      _this.useAlternateScoring = newValue;
      if (_this.useAlternateScoring) {
        _this.selectListView.update({
          filter: function filter(items, query) {
            return query ? _fuzzaldrinPlus2['default'].filter(items, query, { key: atom.config.get('ftp-remote-edit.finder.filterKeyForItem') }) : items;
          }
        });
      } else {
        _this.selectListView.update({ filter: null });
      }
    }));
  }

  _createClass(FinderView, [{
    key: 'show',
    value: function show() {
      var self = this;

      self.previouslyFocusedElement = document.activeElement;
      if (!self.panel) {
        self.panel = atom.workspace.addModalPanel({ item: self });
      }
      self.panel.show();
      self.selectListView.focus();
      self.emit('ftp-remote-edit-finder:show');
    }
  }, {
    key: 'hide',
    value: function hide() {
      var self = this;

      if (self.panel) {
        self.panel.hide();
      }
      if (self.previouslyFocusedElement) {
        self.previouslyFocusedElement.focus();
        self.previouslyFocusedElement = null;
      }
      self.emit('ftp-remote-edit-finder:hide');
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      var self = this;

      self.selectListView.reset();
      self.hide();
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var self = this;

      if (self.panel && self.panel.isVisible()) {
        self.cancel();
      } else {
        self.show();
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;

      if (self.panel) {
        self.panel.destroy();
      }

      if (self.subscriptions) {
        self.subscriptions.dispose();
        self.subscriptions = null;
      }
      return self.selectListView.destroy();
    }
  }, {
    key: 'open',
    value: function open(item) {
      var self = this;

      self.emit('ftp-remote-edit-finder:open', item);
    }
  }, {
    key: 'element',
    get: function get() {
      var self = this;

      return self.selectListView.element;
    }
  }]);

  return FinderView;
})(EventEmitter);

exports['default'] = FinderView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9maW5kZXItdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs4QkFFMkIsa0JBQWtCOzs7OzBCQUN0QixZQUFZOzs7OzhCQUNSLGlCQUFpQjs7OztvQkFDUixNQUFNOzs4QkFDaEIsdUJBQXVCOztBQU5qRCxXQUFXLENBQUM7O0FBUVosSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7SUFFUixVQUFVO1lBQVYsVUFBVTs7QUFFbEIsV0FGUSxVQUFVLEdBRWY7OzswQkFGSyxVQUFVOztBQUczQiwrQkFIaUIsVUFBVSw2Q0FHbkI7QUFDUixRQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixRQUFJLENBQUMsY0FBYyxHQUFHLGdDQUFtQjtBQUN2QyxXQUFLLEVBQUUsRUFBRTtBQUNULGdCQUFVLEVBQUUsRUFBRTtBQUNkLGtCQUFZLEVBQUUsaUJBQXNCO0FBQ3BDLHNCQUFnQixFQUFFLDBCQUFDLElBQUksRUFBSztBQUMxQixZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDLElBQUksVUFBVSxFQUFFO0FBQzVFLGlCQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDbEIsTUFBTTtBQUNMLGlCQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDMUI7T0FDRjtBQUNELHdCQUFrQixFQUFFLDhCQUFNO0FBQUUsWUFBSSxDQUFD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TSxtQkFBRztBQUNSLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN0Qjs7QUFFRCxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QixZQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztPQUMzQjtBQUNELGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN0Qzs7O1dBRUcsY0FBQyxJQUFJLEVBQUU7QUFDVCxVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxJQUFJLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDaEQ7OztTQWxFVSxlQUFHO0FBQ1osVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO0tBQ3BDOzs7U0FoR2tCLFVBQVU7R0FBUyxZQUFZOztxQkFBL0IsVUFBVSIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvdmlld3MvZmluZGVyLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFNlbGVjdExpc3RWaWV3IGZyb20gJ2F0b20tc2VsZWN0LWxpc3QnXG5pbXBvcnQgZnV6emFsZHJpbiBmcm9tICdmdXp6YWxkcmluJ1xuaW1wb3J0IGZ1enphbGRyaW5QbHVzIGZyb20gJ2Z1enphbGRyaW4tcGx1cydcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgaGlnaGxpZ2h0IH0gZnJvbSAnLi8uLi9oZWxwZXIvaGVscGVyLmpzJztcblxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBQYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaW5kZXJWaWV3IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICBzZWxmLml0ZW1zID0gW107XG4gICAgc2VsZi5pdGVtc0NhY2hlID0gbnVsbDtcbiAgICBzZWxmLnJvb3QgPSBudWxsO1xuXG4gICAgc2VsZi5zZWxlY3RMaXN0VmlldyA9IG5ldyBTZWxlY3RMaXN0Vmlldyh7XG4gICAgICBpdGVtczogW10sXG4gICAgICBtYXhSZXN1bHRzOiAyNSxcbiAgICAgIGVtcHR5TWVzc2FnZTogJ05vIGZpbGVzIGZvdW5kXFx1MjAyNicsXG4gICAgICBmaWx0ZXJLZXlGb3JJdGVtOiAoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQuZmluZGVyLmZpbHRlcktleUZvckl0ZW0nKSA9PSBcIkZpbGVuYW1lXCIpIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5maWxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBpdGVtLnJlbGF0aXZlUGF0aDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT4geyBzZWxmLmNhbmNlbCgpOyB9LFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogKGl0ZW0pID0+IHtcbiAgICAgICAgc2VsZi5vcGVuKGl0ZW0pO1xuICAgICAgICBzZWxmLmNhbmNlbCgpO1xuICAgICAgfSxcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiAoeyBmaWxlLCByZWxhdGl2ZVBhdGggfSkgPT4ge1xuICAgICAgICBsZXQga2V5ID0gbnVsbDtcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LmZpbmRlci5maWx0ZXJLZXlGb3JJdGVtJykgPT0gXCJGaWxlbmFtZVwiKSB7XG4gICAgICAgICAga2V5ID0gZmlsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBrZXkgPSByZWxhdGl2ZVBhdGg7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsdGVyUXVlcnkgPSBzZWxmLnNlbGVjdExpc3RWaWV3LmdldEZpbHRlclF1ZXJ5KCk7XG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxmLnVzZUFsdGVybmF0ZVNjb3JpbmcgPyBmdXp6YWxkcmluLm1hdGNoKGtleSwgZmlsdGVyUXVlcnkpIDogZnV6emFsZHJpblBsdXMubWF0Y2goa2V5LCBmaWx0ZXJRdWVyeSk7XG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgY29uc3QgZmlsZUJhc2VuYW1lID0gUGF0aC5iYXNlbmFtZShyZWxhdGl2ZVBhdGgpO1xuICAgICAgICBjb25zdCBiYXNlT2Zmc2V0ID0gcmVsYXRpdmVQYXRoLmxlbmd0aCAtIGZpbGVCYXNlbmFtZS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHByaW1hcnlMaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnN0IHNlY29uZGFyeUxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICBsaS5jbGFzc0xpc3QuYWRkKCd0d28tbGluZXMnKTtcblxuICAgICAgICBwcmltYXJ5TGluZS5jbGFzc0xpc3QuYWRkKCdwcmltYXJ5LWxpbmUnLCAnZmlsZScsICdpY29uLWZpbGUtdGV4dCcpO1xuICAgICAgICBwcmltYXJ5TGluZS5kYXRhc2V0Lm5hbWUgPSBmaWxlQmFzZW5hbWU7XG4gICAgICAgIHByaW1hcnlMaW5lLmRhdGFzZXQucGF0aCA9IHJlbGF0aXZlUGF0aDtcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LmZpbmRlci5maWx0ZXJLZXlGb3JJdGVtJykgPT0gXCJGaWxlbmFtZVwiKSB7XG4gICAgICAgICAgcHJpbWFyeUxpbmUuYXBwZW5kQ2hpbGQoaGlnaGxpZ2h0KGtleSwgbWF0Y2hlcywgMCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByaW1hcnlMaW5lLmFwcGVuZENoaWxkKGhpZ2hsaWdodChmaWxlQmFzZW5hbWUsIG1hdGNoZXMsIGJhc2VPZmZzZXQpKTtcbiAgICAgICAgfVxuICAgICAgICBsaS5hcHBlbmRDaGlsZChwcmltYXJ5TGluZSk7XG5cbiAgICAgICAgc2Vjb25kYXJ5TGluZS5jbGFzc0xpc3QuYWRkKCdzZWNvbmRhcnktbGluZScsICdwYXRoJywgJ25vLWljb24nKTtcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0LmZpbmRlci5maWx0ZXJLZXlGb3JJdGVtJykgPT0gXCJGaWxlbmFtZVwiKSB7XG4gICAgICAgICAgbGV0IGZyYWdtZW50ID0gaGlnaGxpZ2h0KGtleSwgbWF0Y2hlcywgMClcbiAgICAgICAgICBsZXQgYmVmb3JlZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZWxhdGl2ZVBhdGgucmVwbGFjZShmaWxlQmFzZW5hbWUsIFwiXCIpKTtcbiAgICAgICAgICBzZWNvbmRhcnlMaW5lLmFwcGVuZENoaWxkKGJlZm9yZWZyYWdtZW50KTtcbiAgICAgICAgICBzZWNvbmRhcnlMaW5lLmFwcGVuZENoaWxkKGZyYWdtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWNvbmRhcnlMaW5lLmFwcGVuZENoaWxkKGhpZ2hsaWdodChrZXksIG1hdGNoZXMsIDApKTtcbiAgICAgICAgfVxuICAgICAgICBsaS5hcHBlbmRDaGlsZChzZWNvbmRhcnlMaW5lKTtcblxuICAgICAgICByZXR1cm4gbGk7XG4gICAgICB9LFxuICAgICAgb3JkZXI6IChpdGVtMSwgaXRlbTIpID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW0xLnJlbGF0aXZlUGF0aC5sZW5ndGggLSBpdGVtMi5yZWxhdGl2ZVBhdGgubGVuZ3RoO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGNsYXNzIHRvIHVzZSBzdHlsZXNoZWV0cyBmcm9tIHRoaXMgcGFja2FnZVxuICAgIHNlbGYuc2VsZWN0TGlzdFZpZXcuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdyZW1vdGUtZmluZGVyJyk7XG5cbiAgICBzZWxmLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHNlbGYuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdyZW1vdGUtZmluZGVyLnVzZUFsdGVybmF0ZVNjb3JpbmcnLCAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy51c2VBbHRlcm5hdGVTY29yaW5nID0gbmV3VmFsdWVcbiAgICAgICAgaWYgKHRoaXMudXNlQWx0ZXJuYXRlU2NvcmluZykge1xuICAgICAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtcbiAgICAgICAgICAgIGZpbHRlcjogKGl0ZW1zLCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gcXVlcnkgPyBmdXp6YWxkcmluUGx1cy5maWx0ZXIoaXRlbXMsIHF1ZXJ5LCB7IGtleTogYXRvbS5jb25maWcuZ2V0KCdmdHAtcmVtb3RlLWVkaXQuZmluZGVyLmZpbHRlcktleUZvckl0ZW0nKSB9KSA6IGl0ZW1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7IGZpbHRlcjogbnVsbCB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBnZXQgZWxlbWVudCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiBzZWxmLnNlbGVjdExpc3RWaWV3LmVsZW1lbnQ7XG4gIH1cblxuICBzaG93KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGlmICghc2VsZi5wYW5lbCkge1xuICAgICAgc2VsZi5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiBzZWxmIH0pO1xuICAgIH1cbiAgICBzZWxmLnBhbmVsLnNob3coKTtcbiAgICBzZWxmLnNlbGVjdExpc3RWaWV3LmZvY3VzKCk7XG4gICAgc2VsZi5lbWl0KCdmdHAtcmVtb3RlLWVkaXQtZmluZGVyOnNob3cnKTtcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5wYW5lbCkge1xuICAgICAgc2VsZi5wYW5lbC5oaWRlKCk7XG4gICAgfVxuICAgIGlmIChzZWxmLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgICAgc2VsZi5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHNlbGYucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbDtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdmdHAtcmVtb3RlLWVkaXQtZmluZGVyOmhpZGUnKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuc2VsZWN0TGlzdFZpZXcucmVzZXQoKTtcbiAgICBzZWxmLmhpZGUoKTtcbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLnBhbmVsICYmIHNlbGYucGFuZWwuaXNWaXNpYmxlKCkpIHtcbiAgICAgIHNlbGYuY2FuY2VsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuc2hvdygpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5wYW5lbCkge1xuICAgICAgc2VsZi5wYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuc3Vic2NyaXB0aW9ucykge1xuICAgICAgc2VsZi5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICAgIHNlbGYuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBzZWxmLnNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKTtcbiAgfVxuXG4gIG9wZW4oaXRlbSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5lbWl0KCdmdHAtcmVtb3RlLWVkaXQtZmluZGVyOm9wZW4nLCBpdGVtKTtcbiAgfVxufVxuIl19