var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _serverViewJs = require('./server-view.js');

var _serverViewJs2 = _interopRequireDefault(_serverViewJs);

var _helperHelperJs = require('./../helper/helper.js');

'use babel';

var FolderView = (function (_View) {
  _inherits(FolderView, _View);

  function FolderView() {
    _classCallCheck(this, FolderView);

    _get(Object.getPrototypeOf(FolderView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(FolderView, [{
    key: 'initialize',
    value: function initialize(config, parent) {
      var self = this;

      self.onDidAddServer = function (server) {};
      self.onDidAddFolder = function (folder) {};

      self.config = config;
      self.parent = parent;
      self.expanded = false;

      self.name = self.config.name;
      self.children = self.config.children;
      self.id = self.config.id;

      self.label.text(self.name);
      self.label.addClass('icon-file-submodule');

      self.attr('id', self.id);

      // Events
      self.on('click', function (e) {
        e.stopPropagation();
        self.toggle();
      });
      self.on('dblclick', function (e) {
        e.stopPropagation();
      });

      // Drag & Drop
      self.on('dragstart', function (e) {
        e.stopPropagation();return false;
      });
      self.on('dragenter', function (e) {
        e.stopPropagation();return false;
      });
      self.on('dragleave', function (e) {
        e.stopPropagation();return false;
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;

      this.remove();
    }
  }, {
    key: 'getRoot',
    value: function getRoot() {
      var self = this;

      return self.parent.getRoot();
    }
  }, {
    key: 'expand',
    value: function expand() {
      var self = this;

      self.expanded = true;
      self.addClass('expanded').removeClass('collapsed');

      self.entries.children().detach();

      self.children.forEach(function (config) {
        if (typeof config.children !== 'undefined') {
          self.addFolder(config);
        } else {
          self.addServer(config);
        }
      });
    }
  }, {
    key: 'isExpanded',
    value: function isExpanded() {
      var self = this;

      return self.expanded;
    }
  }, {
    key: 'addServer',
    value: function addServer(config) {
      var self = this;

      var server = new _serverViewJs2['default'](config);

      self.onDidAddServer(server);

      self.entries.append(server);
    }
  }, {
    key: 'addFolder',
    value: function addFolder(config) {
      var self = this;

      var folder = new FolderView(config, self);

      folder.onDidAddServer = function (server) {
        self.onDidAddServer(server);
      };
      self.onDidAddFolder(folder);

      self.entries.append(folder);
    }
  }, {
    key: 'collapse',
    value: function collapse() {
      var self = this;

      self.expanded = false;
      self.addClass('collapsed').removeClass('expanded');

      if (self.entries.children().length > 0) {
        var childNodes = Array.from(self.entries.children());
        childNodes.forEach(function (childNode) {
          var child = (0, _atomSpacePenViews.$)(childNode).view();
          if (child.isExpanded()) {
            child.collapse();
          }
        });
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var self = this;

      if (self.expanded) {
        self.collapse();
      } else {
        self.expand();
      }
    }
  }, {
    key: 'select',
    value: function select() {
      var deselectAllOther = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var self = this;

      if (deselectAllOther) {
        elementsToDeselect = (0, _atomSpacePenViews.$)('.ftp-remote-edit-view .selected');
        for (i = 0, len = elementsToDeselect.length; i < len; i++) {
          selected = elementsToDeselect[i];
          (0, _atomSpacePenViews.$)(selected).removeClass('selected');
        }
      }

      if (!self.hasClass('selected')) {
        self.addClass('selected');
      }
    }
  }, {
    key: 'deselect',
    value: function deselect() {
      var self = this;

      if (self.hasClass('selected')) {
        self.removeClass('selected');
      }
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this = this;

      return this.li({
        'class': 'folder entry list-nested-item project-root collapsed'
      }, function () {
        _this.div({
          'class': 'header list-item project-root-header',
          outlet: 'header'
        }, function () {
          return _this.span({
            'class': 'name icon',
            outlet: 'label'
          });
        });
        _this.ol({
          'class': 'entries list-tree',
          outlet: 'entries'
        });
      });
    }
  }]);

  return FolderView;
})(_atomSpacePenViews.View);

module.exports = FolderView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9mb2xkZXItdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUV3QixzQkFBc0I7OzRCQUN2QixrQkFBa0I7Ozs7OEJBQ2IsdUJBQXVCOztBQUpuRCxXQUFXLENBQUM7O0lBTU4sVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQW9CSixvQkFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO0FBQ3pCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFDLE1BQU0sRUFBSyxFQUFHLENBQUE7QUFDckMsVUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFDLE1BQU0sRUFBSyxFQUFHLENBQUE7O0FBRXJDLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDOztBQUV0QixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDckMsVUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRzNDLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzs7O0FBR3pCLFVBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQ3RCLFNBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUNwQixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFDLENBQUMsRUFBSztBQUFFLFNBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztPQUFFLENBQUMsQ0FBQzs7O0FBR3JELFVBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQUUsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLEFBQUMsT0FBTyxLQUFLLENBQUM7T0FBRSxDQUFDLENBQUM7QUFDcEUsVUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFBRSxTQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQUFBQyxPQUFPLEtBQUssQ0FBQztPQUFFLENBQUMsQ0FBQztBQUNwRSxVQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFDLENBQUMsRUFBSztBQUFFLFNBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxBQUFDLE9BQU8sS0FBSyxDQUFDO09BQUUsQ0FBQyxDQUFDO0tBRXJFOzs7V0FFTSxtQkFBRztBQUNSLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztXQUVNLG1CQUFHO0FBQ1IsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDOUI7OztXQUVLLGtCQUFHO0FBQ1AsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixVQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFbkQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFakMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDaEMsWUFBSSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEtBQUssV0FBVyxFQUFFO0FBQzFDLGNBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEIsTUFBTTtBQUNMLGNBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEI7T0FDRixDQUFDLENBQUM7S0FFSjs7O1dBRVMsc0JBQUc7QUFDWCxVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztLQUV0Qjs7O1dBRVEsbUJBQUMsTUFBTSxFQUFFO0FBQ2hCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxNQUFNLEdBQUcsOEJBQWUsTUFBTSxDQUFDLENBQUM7O0FBRXBDLFVBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTVCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzdCOzs7V0FFUSxtQkFBQyxNQUFNLEVBQUU7QUFDaEIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRTFDLFlBQU0sQ0FBQyxjQUFjLEdBQUcsVUFBQyxNQUFNLEVBQUs7QUFDbEMsWUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUM3QixDQUFDO0FBQ0YsVUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFNUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDN0I7OztXQUVPLG9CQUFHO0FBQ1QsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN0QixVQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFbkQsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdEMsWUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDdkQsa0JBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFTLEVBQUs7QUFDaEMsY0FBTSxLQUFLLEdBQUcsMEJBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEMsY0FBSSxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdEIsaUJBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztXQUNsQjtTQUNGLENBQUMsQ0FBQztPQUNKO0tBQ0Y7OztXQUVLLGtCQUFHO0FBQ1AsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsWUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO09BQ2pCLE1BQU07QUFDTCxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjtLQUNGOzs7V0FFSyxrQkFBMEI7VUFBekIsZ0JBQWdCLHlEQUFHLElBQUk7O0FBQzVCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxnQkFBZ0IsRUFBRTtBQUNwQiwwQkFBa0IsR0FBRywwQkFBRSxpQ0FBaUMsQ0FBQyxDQUFDO0FBQzFELGFBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekQsa0JBQVEsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxvQ0FBRSxRQUFRLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckM7T0FDRjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUM5QixZQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQzNCO0tBQ0Y7OztXQUVPLG9CQUFHO0FBQ1QsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDN0IsWUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztPQUM5QjtLQUNGOzs7V0FqS2EsbUJBQUc7OztBQUNmLGFBQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNiLGlCQUFPLHNEQUFzRDtPQUM5RCxFQUFFLFlBQU07QUFDUCxjQUFLLEdBQUcsQ0FBQztBQUNQLG1CQUFPLHNDQUFzQztBQUM3QyxnQkFBTSxFQUFFLFFBQVE7U0FDakIsRUFBRTtpQkFBTSxNQUFLLElBQUksQ0FBQztBQUNqQixxQkFBTyxXQUFXO0FBQ2xCLGtCQUFNLEVBQUUsT0FBTztXQUNoQixDQUFDO1NBQUEsQ0FBQyxDQUFDO0FBQ0osY0FBSyxFQUFFLENBQUM7QUFDTixtQkFBTyxtQkFBbUI7QUFDMUIsZ0JBQU0sRUFBRSxTQUFTO1NBQ2xCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0FsQkcsVUFBVTs7O0FBdUtoQixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvdmlld3MvZm9sZGVyLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgJCwgVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCBTZXJ2ZXJWaWV3IGZyb20gJy4vc2VydmVyLXZpZXcuanMnO1xuaW1wb3J0IHsgc2hvd01lc3NhZ2UgfSBmcm9tICcuLy4uL2hlbHBlci9oZWxwZXIuanMnO1xuXG5jbGFzcyBGb2xkZXJWaWV3IGV4dGVuZHMgVmlldyB7XG5cbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubGkoe1xuICAgICAgY2xhc3M6ICdmb2xkZXIgZW50cnkgbGlzdC1uZXN0ZWQtaXRlbSBwcm9qZWN0LXJvb3QgY29sbGFwc2VkJyxcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmRpdih7XG4gICAgICAgIGNsYXNzOiAnaGVhZGVyIGxpc3QtaXRlbSBwcm9qZWN0LXJvb3QtaGVhZGVyJyxcbiAgICAgICAgb3V0bGV0OiAnaGVhZGVyJyxcbiAgICAgIH0sICgpID0+IHRoaXMuc3Bhbih7XG4gICAgICAgIGNsYXNzOiAnbmFtZSBpY29uJyxcbiAgICAgICAgb3V0bGV0OiAnbGFiZWwnLFxuICAgICAgfSkpO1xuICAgICAgdGhpcy5vbCh7XG4gICAgICAgIGNsYXNzOiAnZW50cmllcyBsaXN0LXRyZWUnLFxuICAgICAgICBvdXRsZXQ6ICdlbnRyaWVzJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShjb25maWcsIHBhcmVudCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5vbkRpZEFkZFNlcnZlciA9IChzZXJ2ZXIpID0+IHsgfVxuICAgIHNlbGYub25EaWRBZGRGb2xkZXIgPSAoZm9sZGVyKSA9PiB7IH1cblxuICAgIHNlbGYuY29uZmlnID0gY29uZmlnO1xuICAgIHNlbGYucGFyZW50ID0gcGFyZW50O1xuICAgIHNlbGYuZXhwYW5kZWQgPSBmYWxzZTtcblxuICAgIHNlbGYubmFtZSA9IHNlbGYuY29uZmlnLm5hbWU7XG4gICAgc2VsZi5jaGlsZHJlbiA9IHNlbGYuY29uZmlnLmNoaWxkcmVuO1xuICAgIHNlbGYuaWQgPSBzZWxmLmNvbmZpZy5pZDtcblxuICAgIHNlbGYubGFiZWwudGV4dChzZWxmLm5hbWUpO1xuICAgIHNlbGYubGFiZWwuYWRkQ2xhc3MoJ2ljb24tZmlsZS1zdWJtb2R1bGUnKTtcblxuXG4gICAgc2VsZi5hdHRyKCdpZCcsIHNlbGYuaWQpO1xuXG4gICAgLy8gRXZlbnRzXG4gICAgc2VsZi5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHNlbGYudG9nZ2xlKCk7XG4gICAgfSk7XG4gICAgc2VsZi5vbignZGJsY2xpY2snLCAoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9KTtcblxuICAgIC8vIERyYWcgJiBEcm9wXG4gICAgc2VsZi5vbignZHJhZ3N0YXJ0JywgKGUpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgcmV0dXJuIGZhbHNlOyB9KTtcbiAgICBzZWxmLm9uKCdkcmFnZW50ZXInLCAoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyByZXR1cm4gZmFsc2U7IH0pO1xuICAgIHNlbGYub24oJ2RyYWdsZWF2ZScsIChlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHJldHVybiBmYWxzZTsgfSk7XG5cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLnJlbW92ZSgpO1xuICB9XG5cbiAgZ2V0Um9vdCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiBzZWxmLnBhcmVudC5nZXRSb290KCk7XG4gIH1cblxuICBleHBhbmQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmV4cGFuZGVkID0gdHJ1ZTtcbiAgICBzZWxmLmFkZENsYXNzKCdleHBhbmRlZCcpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcblxuICAgIHNlbGYuZW50cmllcy5jaGlsZHJlbigpLmRldGFjaCgpO1xuXG4gICAgc2VsZi5jaGlsZHJlbi5mb3JFYWNoKChjb25maWcpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY29uZmlnLmNoaWxkcmVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZWxmLmFkZEZvbGRlcihjb25maWcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5hZGRTZXJ2ZXIoY29uZmlnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG5cbiAgaXNFeHBhbmRlZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiBzZWxmLmV4cGFuZGVkO1xuXG4gIH1cblxuICBhZGRTZXJ2ZXIoY29uZmlnKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgc2VydmVyID0gbmV3IFNlcnZlclZpZXcoY29uZmlnKTtcblxuICAgIHNlbGYub25EaWRBZGRTZXJ2ZXIoc2VydmVyKTtcblxuICAgIHNlbGYuZW50cmllcy5hcHBlbmQoc2VydmVyKTtcbiAgfVxuXG4gIGFkZEZvbGRlcihjb25maWcpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBmb2xkZXIgPSBuZXcgRm9sZGVyVmlldyhjb25maWcsIHNlbGYpO1xuXG4gICAgZm9sZGVyLm9uRGlkQWRkU2VydmVyID0gKHNlcnZlcikgPT4ge1xuICAgICAgc2VsZi5vbkRpZEFkZFNlcnZlcihzZXJ2ZXIpO1xuICAgIH07XG4gICAgc2VsZi5vbkRpZEFkZEZvbGRlcihmb2xkZXIpO1xuXG4gICAgc2VsZi5lbnRyaWVzLmFwcGVuZChmb2xkZXIpO1xuICB9XG5cbiAgY29sbGFwc2UoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmV4cGFuZGVkID0gZmFsc2U7XG4gICAgc2VsZi5hZGRDbGFzcygnY29sbGFwc2VkJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZGVkJyk7XG5cbiAgICBpZiAoc2VsZi5lbnRyaWVzLmNoaWxkcmVuKCkubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY2hpbGROb2RlcyA9IEFycmF5LmZyb20oc2VsZi5lbnRyaWVzLmNoaWxkcmVuKCkpO1xuICAgICAgY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZE5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSAkKGNoaWxkTm9kZSkudmlldygpO1xuICAgICAgICBpZiAoY2hpbGQuaXNFeHBhbmRlZCgpKSB7XG4gICAgICAgICAgY2hpbGQuY29sbGFwc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuZXhwYW5kZWQpIHtcbiAgICAgIHNlbGYuY29sbGFwc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5leHBhbmQoKTtcbiAgICB9XG4gIH1cblxuICBzZWxlY3QoZGVzZWxlY3RBbGxPdGhlciA9IHRydWUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChkZXNlbGVjdEFsbE90aGVyKSB7XG4gICAgICBlbGVtZW50c1RvRGVzZWxlY3QgPSAkKCcuZnRwLXJlbW90ZS1lZGl0LXZpZXcgLnNlbGVjdGVkJyk7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBlbGVtZW50c1RvRGVzZWxlY3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc2VsZWN0ZWQgPSBlbGVtZW50c1RvRGVzZWxlY3RbaV07XG4gICAgICAgICQoc2VsZWN0ZWQpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghc2VsZi5oYXNDbGFzcygnc2VsZWN0ZWQnKSkge1xuICAgICAgc2VsZi5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICB9XG4gIH1cblxuICBkZXNlbGVjdCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG4gICAgICBzZWxmLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH1cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRm9sZGVyVmlldztcbiJdfQ==