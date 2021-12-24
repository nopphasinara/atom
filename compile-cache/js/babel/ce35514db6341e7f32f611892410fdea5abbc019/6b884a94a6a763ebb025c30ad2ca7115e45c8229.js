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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9lbW1ldC1qc3gtcHJvcHMvbGliL2VtbWV0LWpzeC1wcm9wcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2IsVUFBUSxFQUFBLGtCQUFDLEtBQUssRUFBRTtBQUNkLFFBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQUU7O0FBQzFDLFlBQU0sTUFBTSxHQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3hHLFlBQU0sS0FBSyxHQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3BELFlBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQzs7QUFFN0QsWUFBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksSUFBSSxFQUFLO0FBQzFCLGNBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsNEJBQTRCLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDekUsY0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDNUIsZ0JBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1dBQ2xDO1NBQ0YsQ0FBQTs7QUFFRCxlQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxVQUFDLElBQUksRUFBSztBQUNqQyxjQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUM5QixxQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ2pCLENBQUMsQ0FBQTtTQUNILENBQUMsQ0FBQTs7O0FBR0YsYUFBSyxDQUFDLFlBQVksQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxzQkFBc0IsRUFBRSxFQUFDLENBQUMsQ0FBQTs7S0FDbkU7R0FDRjtDQUNGIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9lbW1ldC1qc3gtcHJvcHMvbGliL2VtbWV0LWpzeC1wcm9wcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgaWYgKGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKCdlbW1ldCcpKSB7XG4gICAgICBjb25zdCBwa2dEaXIgID0gcGF0aC5yZXNvbHZlKGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKCdlbW1ldCcpLCAnbm9kZV9tb2R1bGVzJywgJ2VtbWV0JywgJ2xpYicpO1xuICAgICAgY29uc3QgZW1tZXQgICA9IHJlcXVpcmUocGF0aC5qb2luKHBrZ0RpciwgJ2VtbWV0JykpO1xuICAgICAgY29uc3QgZmlsdGVycyA9IHJlcXVpcmUocGF0aC5qb2luKHBrZ0RpciwgJ2ZpbHRlcicsICdtYWluJykpO1xuXG4gICAgICBjb25zdCB0cmFuc2Zvcm0gPSAoaXRlbSkgPT4ge1xuICAgICAgICBpdGVtLnN0YXJ0ID0gaXRlbS5zdGFydC5yZXBsYWNlKC9cXGIoXFx3Kyk9XCIoW1xcd1xcZFxcLlxcKFxcKV0rKVwiL2csIFwiJDE9eyQyfVwiKTtcbiAgICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGl0ZW0uY2hpbGRyZW4uZm9yRWFjaCh0cmFuc2Zvcm0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZpbHRlcnMuYWRkKCdqc3gtcHJvcHMnLCAodHJlZSkgPT4ge1xuICAgICAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICB0cmFuc2Zvcm0oaXRlbSk7XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyBBcHBseSBqc3gtcHJvcHMgYWZ0ZXIgaHRtbCBzbyB3ZSBjYW4gdXNlIGEgc2ltcGxlIHN0cmluZyByZXBsYWNlbWVudFxuICAgICAgZW1tZXQubG9hZFNuaXBwZXRzKHtcImpzeFwiOiB7IFwiZmlsdGVyc1wiOiBcImpzeCwgaHRtbCwganN4LXByb3BzXCIgfX0pXG4gICAgfVxuICB9XG59XG4iXX0=