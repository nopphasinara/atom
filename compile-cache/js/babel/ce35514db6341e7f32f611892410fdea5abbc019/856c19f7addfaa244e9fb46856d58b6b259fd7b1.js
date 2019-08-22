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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9TZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs4QkFFd0MsaUJBQWlCOztBQUZ6RCxXQUFXLENBQUM7O0lBSVMsUUFBUTtXQUFSLFFBQVE7MEJBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0FDckIsa0JBQWdCO1VBQWYsUUFBUSx5REFBRyxFQUFFOztBQUNsQixVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3JCOzs7V0FFRyxnQkFBYztVQUFiLE1BQU0seURBQUcsRUFBRTs7QUFDZCxVQUFJLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFDdEIsVUFBSSxRQUFRLElBQUksUUFBUSxFQUFFO0FBQ3hCLGdCQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUNoQyxlQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUM7T0FDeEI7O0FBRUQsVUFBSSxHQUFHLElBQUksUUFBUSxFQUFFO0FBQ25CLFlBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQztBQUNoQyxnQkFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixlQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFM0Isa0NBQUssY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDdEM7O0FBRUQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQjs7O1dBRUUsYUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFO0FBQ25CLFVBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN4QixVQUFNLE9BQU8sR0FBRyxLQUFLLEdBQUcsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3RELGFBQU8sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUVyQyxnQ0FBSyxZQUFZLEVBQUUsVUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFLO0FBQ2pDLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7T0FDdEMsQ0FBQyxDQUFDO0tBQ0o7OztXQUVNLGlCQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFOzs7QUFDeEIsVUFBSSxPQUFPLFlBQUEsQ0FBQztBQUNaLFVBQUksYUFBYSxZQUFBLENBQUM7O0FBRWxCLGdDQUFLLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxHQUFHLEVBQUs7QUFDekIsZUFBTyxHQUFHLElBQUksR0FBTSxJQUFJLFNBQUksR0FBRyxHQUFLLEdBQUcsQ0FBQztBQUN4QyxxQkFBYSxHQUFHLENBQUMsNkJBQVEsS0FBSyxDQUFDLElBQUksOEJBQVMsS0FBSyxDQUFDLENBQUM7O0FBRW5ELFlBQUksYUFBYSxFQUFFO0FBQ2pCLGdCQUFLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3hDLE1BQU07QUFDTCxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCO09BQ0YsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNWOzs7U0FoRGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL2xpYi9TZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBlYWNoLCBpc0FycmF5LCBpc09iamVjdCB9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmdzIHtcbiAgdXBkYXRlKHNldHRpbmdzID0ge30pIHtcbiAgICB0aGlzLmxvYWQoc2V0dGluZ3MpO1xuICB9XG5cbiAgbG9hZCh2YWx1ZXMgPSB7fSkge1xuICAgIGxldCBzZXR0aW5ncyA9IHZhbHVlcztcbiAgICBpZiAoJ2dsb2JhbCcgaW4gc2V0dGluZ3MpIHtcbiAgICAgIHNldHRpbmdzWycqJ10gPSBzZXR0aW5ncy5nbG9iYWw7XG4gICAgICBkZWxldGUgc2V0dGluZ3MuZ2xvYmFsO1xuICAgIH1cblxuICAgIGlmICgnKicgaW4gc2V0dGluZ3MpIHtcbiAgICAgIGNvbnN0IHNjb3BlZFNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICBzZXR0aW5ncyA9IHNldHRpbmdzWycqJ107XG4gICAgICBkZWxldGUgc2NvcGVkU2V0dGluZ3NbJyonXTtcblxuICAgICAgZWFjaChzY29wZWRTZXR0aW5ncywgdGhpcy5zZXQsIHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0KHNldHRpbmdzKTtcbiAgfVxuXG4gIHNldChzZXR0aW5ncywgc2NvcGUpIHtcbiAgICBjb25zdCBmbGF0U2V0dGluZ3MgPSB7fTtcbiAgICBjb25zdCBvcHRpb25zID0gc2NvcGUgPyB7IHNjb3BlU2VsZWN0b3I6IHNjb3BlIH0gOiB7fTtcbiAgICBvcHRpb25zLnNhdmUgPSBmYWxzZTtcbiAgICB0aGlzLmZsYXR0ZW4oZmxhdFNldHRpbmdzLCBzZXR0aW5ncyk7XG5cbiAgICBlYWNoKGZsYXRTZXR0aW5ncywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldChrZXksIHZhbHVlLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZsYXR0ZW4ocm9vdCwgZGljdCwgcGF0aCkge1xuICAgIGxldCBkb3RQYXRoO1xuICAgIGxldCB2YWx1ZUlzT2JqZWN0O1xuXG4gICAgZWFjaChkaWN0LCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgZG90UGF0aCA9IHBhdGggPyBgJHtwYXRofS4ke2tleX1gIDoga2V5O1xuICAgICAgdmFsdWVJc09iamVjdCA9ICFpc0FycmF5KHZhbHVlKSAmJiBpc09iamVjdCh2YWx1ZSk7XG5cbiAgICAgIGlmICh2YWx1ZUlzT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuZmxhdHRlbihyb290LCBkaWN0W2tleV0sIGRvdFBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdFtkb3RQYXRoXSA9IHZhbHVlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH1cbn1cbiJdfQ==