Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

// Dependencies
'use babel';var helpers = undefined;
var path = undefined;

// Local variables
var parseRegex = /^((?:Parse|Fatal) error|Deprecated):\s+(.+) in .+?(?: on line |:)(\d+)/gm;
var phpVersionMatchRegex = /^PHP (\d+)\.(\d+)\.(\d+)/;

var loadDeps = function loadDeps() {
  if (!helpers) {
    helpers = require('atom-linter');
  }
  if (!path) {
    path = require('path');
  }
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterPhpDeps = function installLinterPhpDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-php');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterPhpDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-php.executablePath', function (value) {
      _this.executablePath = value;
    }), atom.config.observe('linter-php.errorReporting', function (value) {
      _this.errorReporting = value;
    }), atom.config.observe('linter-php.ignorePhpIni', function (value) {
      _this.ignorePhpIni = value;
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'PHP',
      grammarScopes: ['text.html.php', 'source.php'],
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (textEditor) {
        if (!atom.workspace.isTextEditor(textEditor)) {
          return null;
        }
        var filePath = textEditor.getPath();
        var fileText = textEditor.getText();

        // Ensure that the dependencies are loaded
        loadDeps();

        var parameters = ['--syntax-check', '--define', 'display_errors=On', '--define', 'log_errors=Off'];
        if (_this2.errorReporting) {
          parameters.push('--define', 'error_reporting=E_ALL');
        }
        if (_this2.ignorePhpIni) {
          // No configuration (ini) files will be used
          parameters.push('-n');
        }

        var execOptions = {
          stdin: fileText,
          ignoreExitCode: true
        };

        if (filePath) {
          // Only specify a CWD if the file has been saved

          var _atom$project$relativizePath = atom.project.relativizePath(filePath);

          var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 1);

          var projectPath = _atom$project$relativizePath2[0];

          execOptions.cwd = projectPath !== null ? projectPath : path.dirname(filePath);
        }

        var output = yield helpers.exec(_this2.executablePath, parameters, execOptions);

        if (textEditor.getText() !== fileText) {
          // Editor contents have changed, don't update messages
          return null;
        }

        var messages = [];
        var match = parseRegex.exec(output);
        while (match !== null) {
          var line = Number.parseInt(match[3], 10) - 1;
          var errorType = match[1];

          messages.push({
            severity: /error/i.test(errorType) ? 'error' : 'warning',
            location: {
              file: filePath,
              position: helpers.generateRange(textEditor, line)
            },
            excerpt: match[2]
          });

          match = parseRegex.exec(output);
        }
        return messages;
      })
    };
  },

  getPhpVersionInfo: _asyncToGenerator(function* () {
    var execOptions = {
      ignoreExitCode: true
    };
    var output = yield helpers.exec(this.executablePath, ['--version'], execOptions);

    var match = phpVersionMatchRegex.exec(output);
    return {
      major: match[1],
      minor: match[2],
      patch: match[3]
    };
  })
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvbGludGVyLXBocC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUdvQyxNQUFNOzs7QUFIMUMsV0FBVyxDQUFDLEFBTVosSUFBSSxPQUFPLFlBQUEsQ0FBQztBQUNaLElBQUksSUFBSSxZQUFBLENBQUM7OztBQUdULElBQU0sVUFBVSxHQUFHLDBFQUEwRSxDQUFDO0FBQzlGLElBQU0sb0JBQW9CLEdBQUcsMEJBQTBCLENBQUM7O0FBRXhELElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxHQUFTO0FBQ3JCLE1BQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixXQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0dBQ2xDO0FBQ0QsTUFBSSxDQUFDLElBQUksRUFBRTtBQUNULFFBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDeEI7Q0FDRixDQUFDOztxQkFFYTtBQUNiLFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQy9CLFFBQUksY0FBYyxZQUFBLENBQUM7QUFDbkIsUUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBb0IsR0FBUztBQUNqQyxZQUFLLGFBQWEsVUFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdEIsZUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO09BQ3BEO0FBQ0QsY0FBUSxFQUFFLENBQUM7S0FDWixDQUFDO0FBQ0Ysa0JBQWMsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNsRSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFdkMsUUFBSSxDQUFDLGFBQWEs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LEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLGNBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFM0Isa0JBQVEsQ0FBQyxJQUFJLENBQUM7QUFDWixvQkFBUSxFQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxHQUFHLFNBQVMsQUFBQztBQUMxRCxvQkFBUSxFQUFFO0FBQ1Isa0JBQUksRUFBRSxRQUFRO0FBQ2Qsc0JBQVEsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7YUFDbEQ7QUFDRCxtQkFBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7V0FDbEIsQ0FBQyxDQUFDOztBQUVILGVBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pDO0FBQ0QsZUFBTyxRQUFRLENBQUM7T0FDakIsQ0FBQTtLQUNGLENBQUM7R0FDSDs7QUFFRCxBQUFNLG1CQUFpQixvQkFBQSxhQUFHO0FBQ3hCLFFBQU0sV0FBVyxHQUFHO0FBQ2xCLG9CQUFjLEVBQUUsSUFBSTtLQUNyQixDQUFDO0FBQ0YsUUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQzs7QUFFbkYsUUFBTSxLQUFLLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELFdBQU87QUFDTCxXQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNmLFdBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2YsV0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDaEIsQ0FBQztHQUNILENBQUE7Q0FDRiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1waHAvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcywgaW1wb3J0L2V4dGVuc2lvbnNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuLy8gRGVwZW5kZW5jaWVzXG5sZXQgaGVscGVycztcbmxldCBwYXRoO1xuXG4vLyBMb2NhbCB2YXJpYWJsZXNcbmNvbnN0IHBhcnNlUmVnZXggPSAvXigoPzpQYXJzZXxGYXRhbCkgZXJyb3J8RGVwcmVjYXRlZCk6XFxzKyguKykgaW4gLis/KD86IG9uIGxpbmUgfDopKFxcZCspL2dtO1xuY29uc3QgcGhwVmVyc2lvbk1hdGNoUmVnZXggPSAvXlBIUCAoXFxkKylcXC4oXFxkKylcXC4oXFxkKykvO1xuXG5jb25zdCBsb2FkRGVwcyA9ICgpID0+IHtcbiAgaWYgKCFoZWxwZXJzKSB7XG4gICAgaGVscGVycyA9IHJlcXVpcmUoJ2F0b20tbGludGVyJyk7XG4gIH1cbiAgaWYgKCFwYXRoKSB7XG4gICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MgPSBuZXcgU2V0KCk7XG4gICAgbGV0IGRlcHNDYWxsYmFja0lEO1xuICAgIGNvbnN0IGluc3RhbGxMaW50ZXJQaHBEZXBzID0gKCkgPT4ge1xuICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShkZXBzQ2FsbGJhY2tJRCk7XG4gICAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLXBocCcpO1xuICAgICAgfVxuICAgICAgbG9hZERlcHMoKTtcbiAgICB9O1xuICAgIGRlcHNDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soaW5zdGFsbExpbnRlclBocERlcHMpO1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5hZGQoZGVwc0NhbGxiYWNrSUQpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXBocC5leGVjdXRhYmxlUGF0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmV4ZWN1dGFibGVQYXRoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHAuZXJyb3JSZXBvcnRpbmcnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5lcnJvclJlcG9ydGluZyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwLmlnbm9yZVBocEluaScsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmlnbm9yZVBocEluaSA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmNsZWFyKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnUEhQJyxcbiAgICAgIGdyYW1tYXJTY29wZXM6IFsndGV4dC5odG1sLnBocCcsICdzb3VyY2UucGhwJ10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludHNPbkNoYW5nZTogdHJ1ZSxcbiAgICAgIGxpbnQ6IGFzeW5jICh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICAgIGlmICghYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKHRleHRFZGl0b3IpKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZVRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHQoKTtcblxuICAgICAgICAvLyBFbnN1cmUgdGhhdCB0aGUgZGVwZW5kZW5jaWVzIGFyZSBsb2FkZWRcbiAgICAgICAgbG9hZERlcHMoKTtcblxuICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0gW1xuICAgICAgICAgICctLXN5bnRheC1jaGVjaycsXG4gICAgICAgICAgJy0tZGVmaW5lJywgJ2Rpc3BsYXlfZXJyb3JzPU9uJyxcbiAgICAgICAgICAnLS1kZWZpbmUnLCAnbG9nX2Vycm9ycz1PZmYnLFxuICAgICAgICBdO1xuICAgICAgICBpZiAodGhpcy5lcnJvclJlcG9ydGluZykge1xuICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1kZWZpbmUnLCAnZXJyb3JfcmVwb3J0aW5nPUVfQUxMJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaWdub3JlUGhwSW5pKSB7XG4gICAgICAgICAgLy8gTm8gY29uZmlndXJhdGlvbiAoaW5pKSBmaWxlcyB3aWxsIGJlIHVzZWRcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy1uJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBleGVjT3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGRpbjogZmlsZVRleHQsXG4gICAgICAgICAgaWdub3JlRXhpdENvZGU6IHRydWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGZpbGVQYXRoKSB7XG4gICAgICAgICAgLy8gT25seSBzcGVjaWZ5IGEgQ1dEIGlmIHRoZSBmaWxlIGhhcyBiZWVuIHNhdmVkXG4gICAgICAgICAgY29uc3QgW3Byb2plY3RQYXRoXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aCk7XG4gICAgICAgICAgZXhlY09wdGlvbnMuY3dkID0gcHJvamVjdFBhdGggIT09IG51bGwgPyBwcm9qZWN0UGF0aCA6IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCBoZWxwZXJzLmV4ZWModGhpcy5leGVjdXRhYmxlUGF0aCwgcGFyYW1ldGVycywgZXhlY09wdGlvbnMpO1xuXG4gICAgICAgIGlmICh0ZXh0RWRpdG9yLmdldFRleHQoKSAhPT0gZmlsZVRleHQpIHtcbiAgICAgICAgICAvLyBFZGl0b3IgY29udGVudHMgaGF2ZSBjaGFuZ2VkLCBkb24ndCB1cGRhdGUgbWVzc2FnZXNcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gW107XG4gICAgICAgIGxldCBtYXRjaCA9IHBhcnNlUmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICB3aGlsZSAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBsaW5lID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzNdLCAxMCkgLSAxO1xuICAgICAgICAgIGNvbnN0IGVycm9yVHlwZSA9IG1hdGNoWzFdO1xuXG4gICAgICAgICAgbWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICBzZXZlcml0eTogKC9lcnJvci9pLnRlc3QoZXJyb3JUeXBlKSA/ICdlcnJvcicgOiAnd2FybmluZycpLFxuICAgICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgZmlsZTogZmlsZVBhdGgsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgbGluZSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXhjZXJwdDogbWF0Y2hbMl0sXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBtYXRjaCA9IHBhcnNlUmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXNzYWdlcztcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcblxuICBhc3luYyBnZXRQaHBWZXJzaW9uSW5mbygpIHtcbiAgICBjb25zdCBleGVjT3B0aW9ucyA9IHtcbiAgICAgIGlnbm9yZUV4aXRDb2RlOiB0cnVlLFxuICAgIH07XG4gICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgaGVscGVycy5leGVjKHRoaXMuZXhlY3V0YWJsZVBhdGgsIFsnLS12ZXJzaW9uJ10sIGV4ZWNPcHRpb25zKTtcblxuICAgIGNvbnN0IG1hdGNoID0gcGhwVmVyc2lvbk1hdGNoUmVnZXguZXhlYyhvdXRwdXQpO1xuICAgIHJldHVybiB7XG4gICAgICBtYWpvcjogbWF0Y2hbMV0sXG4gICAgICBtaW5vcjogbWF0Y2hbMl0sXG4gICAgICBwYXRjaDogbWF0Y2hbM10sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=