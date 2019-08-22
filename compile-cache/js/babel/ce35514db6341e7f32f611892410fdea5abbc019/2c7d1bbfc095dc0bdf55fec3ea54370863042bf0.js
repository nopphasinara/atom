var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _helperFormatJs = require('./../helper/format.js');

'use babel';

var md5 = require('md5');
var Path = require('path');
var getIconServices = require('./../helper/icon.js');

var FileView = (function (_View) {
  _inherits(FileView, _View);

  function FileView() {
    _classCallCheck(this, FileView);

    _get(Object.getPrototypeOf(FileView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(FileView, [{
    key: 'serialize',
    value: function serialize() {
      var self = this;

      return {
        id: self.id,
        config: self.config,
        name: self.name,
        size: self.size,
        rights: self.rights,
        path: self.getPath(false)
      };
    }
  }, {
    key: 'initialize',
    value: function initialize(parent, file) {
      var self = this;

      self.parent = parent;
      self.config = parent.config;

      self.name = file.name;
      self.size = file.size;
      self.rights = file.rights;
      self.id = self.getId();

      // Add filename
      self.label.text(self.name);

      // Add file icon
      getIconServices().updateFileIcon(self);

      self.attr('data-name', self.name);
      self.attr('data-host', self.config.host);
      self.attr('data-size', self.size);
      self.attr('id', self.id);

      // Events
      self.on('click', function (e) {
        e.stopPropagation();
        if (atom.config.get('ftp-remote-edit.tree.allowPendingPaneItems')) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'ftp-remote-edit:open-file-pending');
        }
      });
      self.on('dblclick', function (e) {
        e.stopPropagation();
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'ftp-remote-edit:open-file');
      });

      // Drag & Drop
      self.on('dragstart', function (e) {
        return self.onDragStart(e);
      });
      self.on('dragenter', function (e) {
        return self.onDragEnter(e);
      });
      self.on('dragleave', function (e) {
        return self.onDragLeave(e);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;

      self.remove();
    }
  }, {
    key: 'getId',
    value: function getId() {
      var self = this;

      return 'ftp-remote-edit-' + md5(self.getPath(false) + self.name);
    }
  }, {
    key: 'getRoot',
    value: function getRoot() {
      var self = this;

      return self.parent.getRoot();
    }
  }, {
    key: 'getPath',
    value: function getPath() {
      var useRemote = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var self = this;

      return (0, _helperFormatJs.normalize)(self.parent.getPath(useRemote));
    }
  }, {
    key: 'getLocalPath',
    value: function getLocalPath() {
      var useRemote = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var self = this;

      return (0, _helperFormatJs.normalize)(self.parent.getLocalPath(useRemote), Path.sep);
    }
  }, {
    key: 'getConnector',
    value: function getConnector() {
      var self = this;

      return self.getRoot().getConnector();
    }
  }, {
    key: 'addSyncIcon',
    value: function addSyncIcon() {
      var element = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var self = this;

      if (!element) element = self;
      if (!element.label) return;

      element.label.addClass('icon-sync').addClass('spin');
    }
  }, {
    key: 'removeSyncIcon',
    value: function removeSyncIcon() {
      var element = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var self = this;

      if (!element) element = self;
      if (!element.label) return;

      element.label.removeClass('icon-sync').removeClass('spin');
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
  }, {
    key: 'isVisible',
    value: function isVisible() {
      var self = this;

      return self.parent.isExpanded();
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(e) {
      var self = this;

      var initialPath = undefined;

      if (entry = e.target.closest('.entry.file')) {
        e.stopPropagation();
        initialPath = self.getPath(false) + self.name;

        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("initialPath", initialPath);
          e.dataTransfer.setData("initialType", "file");
          e.dataTransfer.setData("initialName", self.name);
        } else if (e.originalEvent.dataTransfer) {
          e.originalEvent.dataTransfer.effectAllowed = "move";
          e.originalEvent.dataTransfer.setData("initialPath", initialPath);
          e.originalEvent.dataTransfer.setData("initialType", "file");
          e.originalEvent.dataTransfer.setData("initialName", self.name);
        }
      }
    }
  }, {
    key: 'onDragEnter',
    value: function onDragEnter(e) {
      var self = this;

      var entry = undefined,
          initialType = undefined;

      if (entry = e.target.closest('.entry.file')) {
        e.stopPropagation();

        if (e.dataTransfer) {
          initialType = e.dataTransfer.getData("initialType");
        } else {
          initialType = e.originalEvent.dataTransfer.getData("initialType");
        }

        if (initialType == "server") {
          return;
        }

        (0, _atomSpacePenViews.$)(entry).view().select();
      }
    }
  }, {
    key: 'onDragLeave',
    value: function onDragLeave(e) {
      var self = this;

      var entry = undefined,
          initialType = undefined;

      if (entry = e.target.closest('.entry.file')) {
        e.stopPropagation();

        if (e.dataTransfer) {
          initialType = e.dataTransfer.getData("initialType");
        } else {
          initialType = e.originalEvent.dataTransfer.getData("initialType");
        }

        if (initialType == "server") {
          return;
        }

        (0, _atomSpacePenViews.$)(entry).view().deselect();
      }
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this = this;

      return this.li({
        'class': 'file entry list-item'
      }, function () {
        return _this.span({
          'class': 'name icon',
          outlet: 'label'
        });
      });
    }
  }]);

  return FileView;
})(_atomSpacePenViews.View);

module.exports = FileView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9maWxlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7aUNBRXdCLHNCQUFzQjs7OEJBQ3BCLHVCQUF1Qjs7QUFIakQsV0FBVyxDQUFDOztBQUtaLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0lBRWpELFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7K0JBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0FXSCxxQkFBRztBQUNWLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsYUFBTztBQUNMLFVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtBQUNYLGNBQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtBQUNuQixZQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixZQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixjQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07QUFDbkIsWUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO09BQzFCLENBQUM7S0FDSDs7O1dBRVMsb0JBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUN2QixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7QUFFNUIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUN0QixVQUFJ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QUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxLQUFLLFlBQUE7VUFBRSxXQUFXLFlBQUEsQ0FBQzs7QUFFdkIsVUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDM0MsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUVwQixZQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUU7QUFDbEIscUJBQVcsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNyRCxNQUFNO0FBQ0wscUJBQVcsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDbkU7O0FBRUQsWUFBSSxXQUFXLElBQUksUUFBUSxFQUFFO0FBQzNCLGlCQUFPO1NBQ1I7O0FBRUQsa0NBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7T0FDNUI7S0FDRjs7O1dBbk5hLG1CQUFHOzs7QUFDZixhQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDYixpQkFBTyxzQkFBc0I7T0FDOUIsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDO0FBQ2pCLG1CQUFPLFdBQVc7QUFDbEIsZ0JBQU0sRUFBRSxPQUFPO1NBQ2hCLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDTDs7O1NBVEcsUUFBUTs7O0FBd05kLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9maWxlLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgJCwgVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJy4vLi4vaGVscGVyL2Zvcm1hdC5qcyc7XG5cbmNvbnN0IG1kNSA9IHJlcXVpcmUoJ21kNScpO1xuY29uc3QgUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGdldEljb25TZXJ2aWNlcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVyL2ljb24uanMnKTtcblxuY2xhc3MgRmlsZVZpZXcgZXh0ZW5kcyBWaWV3IHtcblxuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5saSh7XG4gICAgICBjbGFzczogJ2ZpbGUgZW50cnkgbGlzdC1pdGVtJyxcbiAgICB9LCAoKSA9PiB0aGlzLnNwYW4oe1xuICAgICAgY2xhc3M6ICduYW1lIGljb24nLFxuICAgICAgb3V0bGV0OiAnbGFiZWwnLFxuICAgIH0pKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICBpZDogc2VsZi5pZCxcbiAgICAgIGNvbmZpZzogc2VsZi5jb25maWcsXG4gICAgICBuYW1lOiBzZWxmLm5hbWUsXG4gICAgICBzaXplOiBzZWxmLnNpemUsXG4gICAgICByaWdodHM6IHNlbGYucmlnaHRzLFxuICAgICAgcGF0aDogc2VsZi5nZXRQYXRoKGZhbHNlKSxcbiAgICB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZShwYXJlbnQsIGZpbGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYucGFyZW50ID0gcGFyZW50O1xuICAgIHNlbGYuY29uZmlnID0gcGFyZW50LmNvbmZpZztcblxuICAgIHNlbGYubmFtZSA9IGZpbGUubmFtZTtcbiAgICBzZWxmLnNpemUgPSBmaWxlLnNpemU7XG4gICAgc2VsZi5yaWdodHMgPSBmaWxlLnJpZ2h0cztcbiAgICBzZWxmLmlkID0gc2VsZi5nZXRJZCgpO1xuXG4gICAgLy8gQWRkIGZpbGVuYW1lXG4gICAgc2VsZi5sYWJlbC50ZXh0KHNlbGYubmFtZSk7XG5cbiAgICAvLyBBZGQgZmlsZSBpY29uXG4gICAgZ2V0SWNvblNlcnZpY2VzKCkudXBkYXRlRmlsZUljb24oc2VsZik7XG5cbiAgICBzZWxmLmF0dHIoJ2RhdGEtbmFtZScsIHNlbGYubmFtZSk7XG4gICAgc2VsZi5hdHRyKCdkYXRhLWhvc3QnLCBzZWxmLmNvbmZpZy5ob3N0KTtcbiAgICBzZWxmLmF0dHIoJ2RhdGEtc2l6ZScsIHNlbGYuc2l6ZSk7XG4gICAgc2VsZi5hdHRyKCdpZCcsIHNlbGYuaWQpO1xuXG4gICAgLy8gRXZlbnRzXG4gICAgc2VsZi5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2Z0cC1yZW1vdGUtZWRpdC50cmVlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpKSB7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgJ2Z0cC1yZW1vdGUtZWRpdDpvcGVuLWZpbGUtcGVuZGluZycpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHNlbGYub24oJ2RibGNsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksICdmdHAtcmVtb3RlLWVkaXQ6b3Blbi1maWxlJyk7XG4gICAgfSk7XG5cbiAgICAvLyBEcmFnICYgRHJvcFxuICAgIHNlbGYub24oJ2RyYWdzdGFydCcsIChlKSA9PiBzZWxmLm9uRHJhZ1N0YXJ0KGUpKTtcbiAgICBzZWxmLm9uKCdkcmFnZW50ZXInLCAoZSkgPT4gc2VsZi5vbkRyYWdFbnRlcihlKSk7XG4gICAgc2VsZi5vbignZHJhZ2xlYXZlJywgKGUpID0+IHNlbGYub25EcmFnTGVhdmUoZSkpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYucmVtb3ZlKCk7XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiAnZnRwLXJlbW90ZS1lZGl0LScgKyBtZDUoc2VsZi5nZXRQYXRoKGZhbHNlKSArIHNlbGYubmFtZSk7XG4gIH1cblxuICBnZXRSb290KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHNlbGYucGFyZW50LmdldFJvb3QoKTtcbiAgfVxuXG4gIGdldFBhdGgodXNlUmVtb3RlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZShzZWxmLnBhcmVudC5nZXRQYXRoKHVzZVJlbW90ZSkpO1xuICB9XG5cbiAgZ2V0TG9jYWxQYXRoKHVzZVJlbW90ZSA9IHRydWUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiBub3JtYWxpemUoc2VsZi5wYXJlbnQuZ2V0TG9jYWxQYXRoKHVzZVJlbW90ZSksIFBhdGguc2VwKTtcbiAgfVxuXG4gIGdldENvbm5lY3RvcigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiBzZWxmLmdldFJvb3QoKS5nZXRDb25uZWN0b3IoKTtcbiAgfVxuXG4gIGFkZFN5bmNJY29uKGVsZW1lbnQgPSBudWxsKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWVsZW1lbnQpIGVsZW1lbnQgPSBzZWxmO1xuICAgIGlmICghZWxlbWVudC5sYWJlbCkgcmV0dXJuO1xuXG4gICAgZWxlbWVudC5sYWJlbC5hZGRDbGFzcygnaWNvbi1zeW5jJykuYWRkQ2xhc3MoJ3NwaW4nKTtcbiAgfVxuXG4gIHJlbW92ZVN5bmNJY29uKGVsZW1lbnQgPSBudWxsKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIWVsZW1lbnQpIGVsZW1lbnQgPSBzZWxmO1xuICAgIGlmICghZWxlbWVudC5sYWJlbCkgcmV0dXJuO1xuXG4gICAgZWxlbWVudC5sYWJlbC5yZW1vdmVDbGFzcygnaWNvbi1zeW5jJykucmVtb3ZlQ2xhc3MoJ3NwaW4nKTtcbiAgfVxuXG4gIHNlbGVjdChkZXNlbGVjdEFsbE90aGVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKGRlc2VsZWN0QWxsT3RoZXIpIHtcbiAgICAgIGVsZW1lbnRzVG9EZXNlbGVjdCA9ICQoJy5mdHAtcmVtb3RlLWVkaXQtdmlldyAuc2VsZWN0ZWQnKTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGVsZW1lbnRzVG9EZXNlbGVjdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzZWxlY3RlZCA9IGVsZW1lbnRzVG9EZXNlbGVjdFtpXTtcbiAgICAgICAgJChzZWxlY3RlZCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFzZWxmLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG4gICAgICBzZWxmLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH1cbiAgfVxuXG4gIGRlc2VsZWN0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuaGFzQ2xhc3MoJ3NlbGVjdGVkJykpIHtcbiAgICAgIHNlbGYucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfVxuICB9XG5cbiAgaXNWaXNpYmxlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHNlbGYucGFyZW50LmlzRXhwYW5kZWQoKTtcbiAgfVxuXG4gIG9uRHJhZ1N0YXJ0KGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGxldCBpbml0aWFsUGF0aDtcblxuICAgIGlmIChlbnRyeSA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5lbnRyeS5maWxlJykpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpbml0aWFsUGF0aCA9IHNlbGYuZ2V0UGF0aChmYWxzZSkgKyBzZWxmLm5hbWU7XG5cbiAgICAgIGlmIChlLmRhdGFUcmFuc2Zlcikge1xuICAgICAgICBlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJtb3ZlXCI7XG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJpbml0aWFsUGF0aFwiLCBpbml0aWFsUGF0aCk7XG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJpbml0aWFsVHlwZVwiLCBcImZpbGVcIik7XG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJpbml0aWFsTmFtZVwiLCBzZWxmLm5hbWUpO1xuICAgICAgfSBlbHNlIGlmIChlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9IFwibW92ZVwiO1xuICAgICAgICBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJpbml0aWFsUGF0aFwiLCBpbml0aWFsUGF0aCk7XG4gICAgICAgIGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImluaXRpYWxUeXBlXCIsIFwiZmlsZVwiKTtcbiAgICAgICAgZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiaW5pdGlhbE5hbWVcIiwgc2VsZi5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkRyYWdFbnRlcihlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgZW50cnksIGluaXRpYWxUeXBlO1xuXG4gICAgaWYgKGVudHJ5ID0gZS50YXJnZXQuY2xvc2VzdCgnLmVudHJ5LmZpbGUnKSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKGUuZGF0YVRyYW5zZmVyKSB7XG4gICAgICAgIGluaXRpYWxUeXBlID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluaXRpYWxUeXBlXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbFR5cGUgPSBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbml0aWFsVHlwZVwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluaXRpYWxUeXBlID09IFwic2VydmVyXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkKGVudHJ5KS52aWV3KCkuc2VsZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgb25EcmFnTGVhdmUoZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgbGV0IGVudHJ5LCBpbml0aWFsVHlwZTtcblxuICAgIGlmIChlbnRyeSA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5lbnRyeS5maWxlJykpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGlmIChlLmRhdGFUcmFuc2Zlcikge1xuICAgICAgICBpbml0aWFsVHlwZSA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbml0aWFsVHlwZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxUeXBlID0gZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5pdGlhbFR5cGVcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbml0aWFsVHlwZSA9PSBcInNlcnZlclwiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJChlbnRyeSkudmlldygpLmRlc2VsZWN0KCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsZVZpZXc7XG4iXX0=