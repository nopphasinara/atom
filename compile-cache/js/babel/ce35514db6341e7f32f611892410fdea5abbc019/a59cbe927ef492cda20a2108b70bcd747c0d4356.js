'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  config: {
    "styleObjectName": {
      type: 'string',
      'default': 'style'
    }
  },
  activate: function activate(state) {

    if (atom.packages.isPackageLoaded('emmet')) {
      var pkgDir = path.resolve(atom.packages.resolvePackagePath('emmet'), 'node_modules', 'emmet', 'lib');
      var emmet = require(path.join(pkgDir, 'emmet'));
      var filters = require(path.join(pkgDir, 'filter', 'main'));

      filters.add('jsx-css-modules', function (tree) {
        var styleObjectName = atom.config.get('emmet-jsx-css-modules.styleObjectName') || 'style';
        tree.children.forEach(function (item) {
          item.start = item.start.replace(/className="(.*?)"/, 'className={' + styleObjectName + '.$1}');
        });
      });

      // Apply jsx-css-modules after html so we can use a simple string replacement
      // and not have to mess with how the the html filter wraps attribute values with
      // quotation marks rather than curly brace pairs
      emmet.loadSnippets({ "jsx": { "filters": "jsx, html, jsx-css-modules" } });
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9lbW1ldC1qc3gtY3NzLW1vZHVsZXMvbGliL2VtbWV0LWpzeC1jc3MtbW9kdWxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2IsUUFBTSxFQUFDO0FBQ0wscUJBQWlCLEVBQUM7QUFDaEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxPQUFPO0tBQ2pCO0dBQ0Y7QUFDRCxVQUFRLEVBQUEsa0JBQUMsS0FBSyxFQUFFOztBQUVkLFFBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDMUMsVUFBTSxNQUFNLEdBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDdkcsVUFBTSxLQUFLLEdBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDbkQsVUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFBOztBQUU1RCxhQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ3ZDLFlBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxDQUFDLElBQUksT0FBTyxDQUFDO0FBQzVGLFlBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQzlCLGNBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLGtCQUFnQixlQUFlLFVBQU8sQ0FBQTtTQUMxRixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7Ozs7O0FBS0YsV0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSw0QkFBNEIsRUFBRSxFQUFDLENBQUMsQ0FBQTtLQUN6RTtHQUNGO0NBQ0YiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2VtbWV0LWpzeC1jc3MtbW9kdWxlcy9saWIvZW1tZXQtanN4LWNzcy1tb2R1bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnOntcbiAgICBcInN0eWxlT2JqZWN0TmFtZVwiOntcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ3N0eWxlJ1xuICAgIH1cbiAgfSxcbiAgYWN0aXZhdGUoc3RhdGUpIHtcblxuICAgIGlmIChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZCgnZW1tZXQnKSkge1xuICAgICAgY29uc3QgcGtnRGlyICA9IHBhdGgucmVzb2x2ZShhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aCgnZW1tZXQnKSwgJ25vZGVfbW9kdWxlcycsICdlbW1ldCcsICdsaWInKVxuICAgICAgY29uc3QgZW1tZXQgICA9IHJlcXVpcmUocGF0aC5qb2luKHBrZ0RpciwgJ2VtbWV0JykpXG4gICAgICBjb25zdCBmaWx0ZXJzID0gcmVxdWlyZShwYXRoLmpvaW4ocGtnRGlyLCAnZmlsdGVyJywgJ21haW4nKSlcblxuICAgICAgZmlsdGVycy5hZGQoJ2pzeC1jc3MtbW9kdWxlcycsICh0cmVlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0eWxlT2JqZWN0TmFtZSA9IGF0b20uY29uZmlnLmdldCgnZW1tZXQtanN4LWNzcy1tb2R1bGVzLnN0eWxlT2JqZWN0TmFtZScpIHx8ICdzdHlsZSc7XG4gICAgICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGl0ZW0uc3RhcnQgPSBpdGVtLnN0YXJ0LnJlcGxhY2UoL2NsYXNzTmFtZT1cIiguKj8pXCIvLCBgY2xhc3NOYW1lPXske3N0eWxlT2JqZWN0TmFtZX0uJDF9YClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFwcGx5IGpzeC1jc3MtbW9kdWxlcyBhZnRlciBodG1sIHNvIHdlIGNhbiB1c2UgYSBzaW1wbGUgc3RyaW5nIHJlcGxhY2VtZW50XG4gICAgICAvLyBhbmQgbm90IGhhdmUgdG8gbWVzcyB3aXRoIGhvdyB0aGUgdGhlIGh0bWwgZmlsdGVyIHdyYXBzIGF0dHJpYnV0ZSB2YWx1ZXMgd2l0aFxuICAgICAgLy8gcXVvdGF0aW9uIG1hcmtzIHJhdGhlciB0aGFuIGN1cmx5IGJyYWNlIHBhaXJzXG4gICAgICBlbW1ldC5sb2FkU25pcHBldHMoe1wianN4XCI6IHsgXCJmaWx0ZXJzXCI6IFwianN4LCBodG1sLCBqc3gtY3NzLW1vZHVsZXNcIiB9fSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==