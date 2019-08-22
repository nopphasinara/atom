var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _viewsProtocolItemViewJs = require('./../views/protocol-item-view.js');

var _viewsProtocolItemViewJs2 = _interopRequireDefault(_viewsProtocolItemViewJs);

'use babel';

var Queue = (function () {
  function Queue() {
    _classCallCheck(this, Queue);

    var self = this;

    self.onDidAddFile = function () {};
    self.onDidRemoveFile = function () {};

    self.list = [];
  }

  _createClass(Queue, [{
    key: 'destroy',
    value: function destroy() {
      var self = this;

      self.list = [];
    }
  }, {
    key: 'addFile',
    value: function addFile(file) {
      var self = this;

      var item = new _viewsProtocolItemViewJs2['default']({
        client: file.client,
        direction: file.direction,
        remotePath: file.remotePath,
        localPath: file.localPath,
        size: file.size,
        stream: file.stream
      });

      self.list.push(item);

      self.onDidAddFile(item);

      return item;
    }
  }, {
    key: 'removeFile',
    value: function removeFile(file) {
      var self = this;

      self.list = self.list.filter(function (item) {
        return item != file;
      });

      self.onDidRemoveFile(file);
    }
  }, {
    key: 'existsFile',
    value: function existsFile(path) {
      var self = this;

      if (self.list.length == 0) return false;

      var items = self.list.filter(function (item) {
        return item.info.localPath === path && (item.info.status == 'Waiting' || item.info.status == 'Transferring');
      });

      return items.length > 0 ? true : false;
    }
  }]);

  return Queue;
})();

module.exports = new Queue();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9oZWxwZXIvcXVldWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3VDQUU2QixrQ0FBa0M7Ozs7QUFGL0QsV0FBVyxDQUFDOztJQUlOLEtBQUs7QUFFRSxXQUZQLEtBQUssR0FFSzswQkFGVixLQUFLOztBQUdQLFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLFlBQVksR0FBRyxZQUFNLEVBQUUsQ0FBQztBQUM3QixRQUFJLENBQUMsZUFBZSxHQUFHLFlBQU0sRUFBRSxDQUFDOztBQUVoQyxRQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztHQUNoQjs7ZUFURyxLQUFLOztXQVdGLG1CQUFHO0FBQ1IsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztLQUNoQjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFO0FBQ1osVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLElBQUksR0FBRyx5Q0FBcUI7QUFDOUIsY0FBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ25CLGlCQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7QUFDekIsa0JBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtBQUMzQixpQkFBUyxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQ3pCLFlBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLGNBQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtPQUNwQixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXJCLFVBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXhCLGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVTLG9CQUFDLElBQUksRUFBRTtBQUNmLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBSztBQUNyQyxlQUFPLElBQUksSUFBSSxJQUFJLENBQUM7T0FDckIsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUI7OztXQUVTLG9CQUFDLElBQUksRUFBRTtBQUNmLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUM7O0FBRXhDLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3JDLGVBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxjQUFjLENBQUEsQUFBQyxDQUFDO09BQzlHLENBQUMsQ0FBQzs7QUFFSCxhQUFPLEFBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztLQUMxQzs7O1NBeERHLEtBQUs7OztBQTBEWCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxFQUFBLENBQUMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL2hlbHBlci9xdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgUHJvdG9jb2xJdGVtVmlldyBmcm9tICcuLy4uL3ZpZXdzL3Byb3RvY29sLWl0ZW0tdmlldy5qcyc7XG5cbmNsYXNzIFF1ZXVlIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYub25EaWRBZGRGaWxlID0gKCkgPT4ge307XG4gICAgc2VsZi5vbkRpZFJlbW92ZUZpbGUgPSAoKSA9PiB7fTtcblxuICAgIHNlbGYubGlzdCA9IFtdO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYubGlzdCA9IFtdO1xuICB9XG5cbiAgYWRkRmlsZShmaWxlKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBsZXQgaXRlbSA9IG5ldyBQcm90b2NvbEl0ZW1WaWV3KHtcbiAgICAgIGNsaWVudDogZmlsZS5jbGllbnQsXG4gICAgICBkaXJlY3Rpb246IGZpbGUuZGlyZWN0aW9uLFxuICAgICAgcmVtb3RlUGF0aDogZmlsZS5yZW1vdGVQYXRoLFxuICAgICAgbG9jYWxQYXRoOiBmaWxlLmxvY2FsUGF0aCxcbiAgICAgIHNpemU6IGZpbGUuc2l6ZSxcbiAgICAgIHN0cmVhbTogZmlsZS5zdHJlYW1cbiAgICB9KTtcblxuICAgIHNlbGYubGlzdC5wdXNoKGl0ZW0pO1xuICAgIFxuICAgIHNlbGYub25EaWRBZGRGaWxlKGl0ZW0pO1xuXG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICByZW1vdmVGaWxlKGZpbGUpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYubGlzdCA9IHNlbGYubGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtICE9IGZpbGU7XG4gICAgfSk7XG5cbiAgICBzZWxmLm9uRGlkUmVtb3ZlRmlsZShmaWxlKTtcbiAgfVxuXG4gIGV4aXN0c0ZpbGUocGF0aCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYubGlzdC5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgbGV0IGl0ZW1zID0gc2VsZi5saXN0LmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGl0ZW0uaW5mby5sb2NhbFBhdGggPT09IHBhdGggJiYgKGl0ZW0uaW5mby5zdGF0dXMgPT0gJ1dhaXRpbmcnIHx8IGl0ZW0uaW5mby5zdGF0dXMgPT0gJ1RyYW5zZmVycmluZycpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChpdGVtcy5sZW5ndGggPiAwKSA/IHRydWUgOiBmYWxzZTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUXVldWU7XG4iXX0=