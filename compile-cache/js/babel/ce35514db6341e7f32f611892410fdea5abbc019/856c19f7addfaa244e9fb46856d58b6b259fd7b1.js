Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

'use babel';

var Settings = (function () {
  function Settings() {
    _classCallCheck(this, Settings);
  }

  _createClass(Settings, [{
    key: 'update',
    value: function update() {
      var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.load(settings);
    }
  }, {
    key: 'load',
    value: function load() {
      var values = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var settings = values;
      if ('global' in settings) {
        settings['*'] = settings.global;
        delete settings.global;
      }

      if ('*' in settings) {
        var scopedSettings = settings;
        settings = settings['*'];
        delete scopedSettings['*'];

        (0, _underscorePlus.each)(scopedSettings, this.set, this);
      }

      this.set(settings);
    }
  }, {
    key: 'set',
    value: function set(settings, scope) {
      var flatSettings = {};
      var options = scope ? { scopeSelector: scope } : {};
      options.save = false;
      this.flatten(flatSettings, settings);

      (0, _underscorePlus.each)(flatSettings, function (value, key) {
        atom.config.set(key, value, options);
      });
    }
  }, {
    key: 'flatten',
    value: function flatten(root, dict, path) {
      var _this = this;

      var dotPath = undefined;
      var valueIsObject = undefined;

      (0, _underscorePlus.each)(dict, function (value, key) {
        dotPath = path ? path + '.' + key : key;
        valueIsObject = !(0, _underscorePlus.isArray)(value) && (0, _underscorePlus.isObject)(value);

        if (valueIsObject) {
          _this.flatten(root, dict[key], dotPath);
        } else {
          root[dotPath] = value; // eslint-disable-line no-param-reassign
        }
      }, this);
    }
  }]);

  return Settings;
})();

exports['default'] = Settings;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9wcm9qZWN0LW1hbmFnZXIvbGliL1NldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzhCQUV3QyxpQkFBaUI7O0FBRnpELFdBQVcsQ0FBQzs7SUFJUyxRQUFRO1dBQVIsUUFBUTswQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUNyQixrQkFBZ0I7VUFBZixRQUFRLHlEQUFHLEVBQUU7O0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDckI7OztXQUVHLGdCQUFjO1VBQWIsTUFBTSx5REFBRyxFQUFFOztBQUNkLFVBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUN0QixVQUFJLFFBQVEsSUFBSSxRQUFRLEVBQUU7QUFDeEIsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQ2hDLGVBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztPQUN4Qjs7QUFFRCxVQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUU7QUFDbkIsWUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDO0FBQ2hDLGdCQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLGVBQU8sY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUzQixrQ0FBSyxjQUFjLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztPQUN0Qzs7QUFFRCxVQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3BCOzs7V0FFRSxhQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUU7QUFDbkIsVUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFVBQU0sT0FBTyxHQUFHLEtBQUssR0FBRyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDdEQsYUFBTyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7QUFDckIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRXJDLGdDQUFLLFlBQVksRUFBRSxVQUFDLEtBQUssRUFBRSxHQUFHLEVBQUs7QUFDakMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztPQUN0QyxDQUFDLENBQUM7S0FDSjs7O1dBRU0saUJBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7OztBQUN4QixVQUFJLE9BQU8sWUFBQSxDQUFDO0FBQ1osVUFBSSxhQUFhLFlBQUEsQ0FBQzs7QUFFbEIsZ0NBQUssSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBSztBQUN6QixlQUFPLEdBQUcsSUFBSSxHQUFNLElBQUksU0FBSSxHQUFHLEdBQUssR0FBRyxDQUFDO0FBQ3hDLHFCQUFhLEdBQUcsQ0FBQyw2QkFBUSxLQUFLLENBQUMsSUFBSSw4QkFBUyxLQUFLLENBQUMsQ0FBQzs7QUFFbkQsWUFBSSxhQUFhLEVBQUU7QUFDakIsZ0JBQUssT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDeEMsTUFBTTtBQUNMLGNBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDdkI7T0FDRixFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ1Y7OztTQWhEa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvU2V0dGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgZWFjaCwgaXNBcnJheSwgaXNPYmplY3QgfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0aW5ncyB7XG4gIHVwZGF0ZShzZXR0aW5ncyA9IHt9KSB7XG4gICAgdGhpcy5sb2FkKHNldHRpbmdzKTtcbiAgfVxuXG4gIGxvYWQodmFsdWVzID0ge30pIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB2YWx1ZXM7XG4gICAgaWYgKCdnbG9iYWwnIGluIHNldHRpbmdzKSB7XG4gICAgICBzZXR0aW5nc1snKiddID0gc2V0dGluZ3MuZ2xvYmFsO1xuICAgICAgZGVsZXRlIHNldHRpbmdzLmdsb2JhbDtcbiAgICB9XG5cbiAgICBpZiAoJyonIGluIHNldHRpbmdzKSB7XG4gICAgICBjb25zdCBzY29wZWRTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgc2V0dGluZ3MgPSBzZXR0aW5nc1snKiddO1xuICAgICAgZGVsZXRlIHNjb3BlZFNldHRpbmdzWycqJ107XG5cbiAgICAgIGVhY2goc2NvcGVkU2V0dGluZ3MsIHRoaXMuc2V0LCB0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldChzZXR0aW5ncyk7XG4gIH1cblxuICBzZXQoc2V0dGluZ3MsIHNjb3BlKSB7XG4gICAgY29uc3QgZmxhdFNldHRpbmdzID0ge307XG4gICAgY29uc3Qgb3B0aW9ucyA9IHNjb3BlID8geyBzY29wZVNlbGVjdG9yOiBzY29wZSB9IDoge307XG4gICAgb3B0aW9ucy5zYXZlID0gZmFsc2U7XG4gICAgdGhpcy5mbGF0dGVuKGZsYXRTZXR0aW5ncywgc2V0dGluZ3MpO1xuXG4gICAgZWFjaChmbGF0U2V0dGluZ3MsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoa2V5LCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBmbGF0dGVuKHJvb3QsIGRpY3QsIHBhdGgpIHtcbiAgICBsZXQgZG90UGF0aDtcbiAgICBsZXQgdmFsdWVJc09iamVjdDtcblxuICAgIGVhY2goZGljdCwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIGRvdFBhdGggPSBwYXRoID8gYCR7cGF0aH0uJHtrZXl9YCA6IGtleTtcbiAgICAgIHZhbHVlSXNPYmplY3QgPSAhaXNBcnJheSh2YWx1ZSkgJiYgaXNPYmplY3QodmFsdWUpO1xuXG4gICAgICBpZiAodmFsdWVJc09iamVjdCkge1xuICAgICAgICB0aGlzLmZsYXR0ZW4ocm9vdCwgZGljdFtrZXldLCBkb3RQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3RbZG90UGF0aF0gPSB2YWx1ZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9XG59XG4iXX0=