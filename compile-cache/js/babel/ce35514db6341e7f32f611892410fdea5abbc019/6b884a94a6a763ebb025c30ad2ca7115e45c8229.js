'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  activate: function activate(state) {
    if (atom.packages.isPackageLoaded('emmet')) {
      (function () {
        var pkgDir = path.resolve(atom.packages.resolvePackagePath('emmet'), 'node_modules', 'emmet', 'lib');
        var emmet = require(path.join(pkgDir, 'emmet'));
        var filters = require(path.join(pkgDir, 'filter', 'main'));

        var transform = function transform(item) {
          item.start = item.start.replace(/\b(\w+)="([\w\d\.\(\)]+)"/g, "$1={$2}");
          if (item.children.length > 0) {
            item.children.forEach(transform);
          }
        };

        filters.add('jsx-props', function (tree) {
          tree.children.forEach(function (item) {
            transform(item);
          });
        });

        // Apply jsx-props after html so we can use a simple string replacement
        emmet.loadSnippets({ "jsx": { "filters": "jsx, html, jsx-props" } });
      })();
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZW1tZXQtanN4LXByb3BzL2xpYi9lbW1ldC1qc3gtcHJvcHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFRztBQUNiLFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7QUFDZCxRQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFOztBQUMxQyxZQUFNLE1BQU0sR0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4RyxZQUFNLEtBQUssR0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNwRCxZQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7O0FBRTdELFlBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLElBQUksRUFBSztBQUMxQixjQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3pFLGNBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzVCLGdCQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztXQUNsQztTQUNGLENBQUE7O0FBRUQsZUFBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDakMsY0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDOUIscUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNqQixDQUFDLENBQUE7U0FDSCxDQUFDLENBQUE7OztBQUdGLGFBQUssQ0FBQyxZQUFZLENBQUMsRUFBQyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsc0JBQXNCLEVBQUUsRUFBQyxDQUFDLENBQUE7O0tBQ25FO0dBQ0Y7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2VtbWV0LWpzeC1wcm9wcy9saWIvZW1tZXQtanN4LXByb3BzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoc3RhdGUpIHtcbiAgICBpZiAoYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoJ2VtbWV0JykpIHtcbiAgICAgIGNvbnN0IHBrZ0RpciAgPSBwYXRoLnJlc29sdmUoYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ2VtbWV0JyksICdub2RlX21vZHVsZXMnLCAnZW1tZXQnLCAnbGliJyk7XG4gICAgICBjb25zdCBlbW1ldCAgID0gcmVxdWlyZShwYXRoLmpvaW4ocGtnRGlyLCAnZW1tZXQnKSk7XG4gICAgICBjb25zdCBmaWx0ZXJzID0gcmVxdWlyZShwYXRoLmpvaW4ocGtnRGlyLCAnZmlsdGVyJywgJ21haW4nKSk7XG5cbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IChpdGVtKSA9PiB7XG4gICAgICAgIGl0ZW0uc3RhcnQgPSBpdGVtLnN0YXJ0LnJlcGxhY2UoL1xcYihcXHcrKT1cIihbXFx3XFxkXFwuXFwoXFwpXSspXCIvZywgXCIkMT17JDJ9XCIpO1xuICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaXRlbS5jaGlsZHJlbi5mb3JFYWNoKHRyYW5zZm9ybSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZmlsdGVycy5hZGQoJ2pzeC1wcm9wcycsICh0cmVlKSA9PiB7XG4gICAgICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIHRyYW5zZm9ybShpdGVtKTtcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFwcGx5IGpzeC1wcm9wcyBhZnRlciBodG1sIHNvIHdlIGNhbiB1c2UgYSBzaW1wbGUgc3RyaW5nIHJlcGxhY2VtZW50XG4gICAgICBlbW1ldC5sb2FkU25pcHBldHMoe1wianN4XCI6IHsgXCJmaWx0ZXJzXCI6IFwianN4LCBodG1sLCBqc3gtcHJvcHNcIiB9fSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==