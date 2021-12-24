'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.atom_initialize = atom_initialize;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

console.clear();

var _ = require('lodash');

var ProviderManager = (function () {
  function ProviderManager() {
    _classCallCheck(this, ProviderManager);
  }

  _createClass(ProviderManager, [{
    key: 'register',
    value: function register(provider) {
      var disposable = new CompositeDisposable();
      var providerId = provider ? provider.id : '';

      if (providerId) {
        disposable.add(operatorConfig.add(providerId, provider));
        disposable.add(atom.config.observe(providerId, function (value) {
          return operatorConfig.updateConfigWithAtom(providerId, value);
        }));
      }

      // Unregister provider from providerManager
      return disposable;
    }
  }]);

  return ProviderManager;
})();

exports.ProviderManager = ProviderManager;

console.log(new ProviderManager());

function atom_initialize() {
  console.log(_);
}

atom.packages.onDidActivateInitialPackages(atom_initialize);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7OztBQUVaLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFHaEIsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztJQUdiLGVBQWU7QUFDZixXQURBLGVBQWUsR0FDWjswQkFESCxlQUFlO0dBQ1Y7O2VBREwsZUFBZTs7V0FHbEIsa0JBQUMsUUFBUSxFQUFFO0FBQ2pCLFVBQU0sVUFBVSxHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztBQUM3QyxVQUFNLFVBQVUsR0FBRyxRQUFRLEdBQUcsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBRS9DLFVBQUksVUFBVSxFQUFFO0FBQ2Qsa0JBQVUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN6RCxrQkFBVSxDQUFDLEdBQUcsQ0FDWixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDekMsaUJBQU8sY0FBYyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMvRCxDQUFDLENBQ0gsQ0FBQztPQUNIOzs7QUFHRCxhQUFPLFVBQVUsQ0FBQztLQUNuQjs7O1NBbEJVLGVBQWU7Ozs7O0FBcUI1QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksZUFBZSxFQUFFLENBQUMsQ0FBQzs7QUFHNUIsU0FBUyxlQUFlLEdBQUc7QUFDaEMsU0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUNoQjs7QUFHRCxJQUFJLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDLGVBQWUsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zb2xlLmNsZWFyKCk7XG5cblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuXG5leHBvcnQgY2xhc3MgUHJvdmlkZXJNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHJlZ2lzdGVyKHByb3ZpZGVyKSB7XG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgY29uc3QgcHJvdmlkZXJJZCA9IHByb3ZpZGVyID8gcHJvdmlkZXIuaWQgOiAnJztcblxuICAgIGlmIChwcm92aWRlcklkKSB7XG4gICAgICBkaXNwb3NhYmxlLmFkZChvcGVyYXRvckNvbmZpZy5hZGQocHJvdmlkZXJJZCwgcHJvdmlkZXIpKTtcbiAgICAgIGRpc3Bvc2FibGUuYWRkKFxuICAgICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKHByb3ZpZGVySWQsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBvcGVyYXRvckNvbmZpZy51cGRhdGVDb25maWdXaXRoQXRvbShwcm92aWRlcklkLCB2YWx1ZSk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFVucmVnaXN0ZXIgcHJvdmlkZXIgZnJvbSBwcm92aWRlck1hbmFnZXJcbiAgICByZXR1cm4gZGlzcG9zYWJsZTtcbiAgfVxufVxuXG5jb25zb2xlLmxvZyhuZXcgUHJvdmlkZXJNYW5hZ2VyKCkpO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBhdG9tX2luaXRpYWxpemUoKSB7XG4gIGNvbnNvbGUubG9nKF8pO1xufVxuXG5cbmF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZUluaXRpYWxQYWNrYWdlcyhhdG9tX2luaXRpYWxpemUpO1xuIl19