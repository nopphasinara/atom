Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Console = require('./Console');

var _Console2 = _interopRequireDefault(_Console);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _EditorView = require('./EditorView');

var _EditorView2 = _interopRequireDefault(_EditorView);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var Editor = (function () {
  function Editor() {
    var _this = this;

    _classCallCheck(this, Editor);

    this.defaultText = 'Write javascript code here';

    this.onClose = function () {
      _this.editorPanel.hide();
      _this.console.hide();
    };

    this.onEditor = function (editor, selectedText) {
      _this.editor = editor;
      editor.setPlaceholderText(_this.defaultText);
      if (selectedText) editor.setText(selectedText);
      editor.onDidStopChanging(_this.onChange); // debounce change
    };

    this.onChange = function (e) {
      var code = _this.editor.getText();

      var _execute = _this.execute(code);

      var output = _execute.output;
      var error = _execute.error;
      var stdout = _execute.stdout;
      var executionTime = _execute.executionTime;

      _this.console.render({ code: code, output: output, stdout: stdout, error: error, executionTime: executionTime });
    };

    this.console = new _Console2['default']();

    this.editor = atom.workspace.buildTextEditor();
    this.editor.setGrammar(atom.grammars.grammarForScopeName('source.js'));
    this.editor.setPlaceholderText(this.defaultText);

    this.editorView = new _EditorView2['default'](this.editor, this.onClose);

    this.editorPanel = atom.workspace.addBottomPanel({
      item: this.editorView.getElement(),
      visible: false
    });

    // TODO Listen ESC key to close

    this.editor.onDidStopChanging(this.onChange); // debounce change
  }

  _createClass(Editor, [{
    key: 'show',
    value: function show() {
      var selectedText = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this.editor.setText(selectedText || '');
      // TODO Get focus on this.editor
      this.editorPanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.editorPanel.destroy();
      this.console.destroy();
    }
  }, {
    key: 'execute',
    value: function execute(code) {
      var stdout = [];
      // let oldWrite = process.stdout.write
      // process.stdout.write = function(str, encoding, fd) { // start capture
      //   stdout += str
      // }

      var log = console.log;
      console.log = function () {
        // capture console.log
        stdout.push(arguments[0]);
        log.apply(undefined, arguments);
      };

      var output = null;
      var error = null;
      var executionTime = 0;
      try {
        var start = Date.now();
        var sandbox = _extends({ window: window }, window);
        code = babel.transform(code, {
          'extends': _path2['default'].resolve(__dirname, '../.babelrc')
        }).code;
        output = _vm2['default'].runInNewContext(code, sandbox);
        output = String(_util2['default'].inspect(output, { showHidden: false, depth: null }));
        var end = Date.now();
        executionTime = end - start;
      } catch (e) {
        output = null;
        error = e;
      }

      // process.stdout.write = oldWrite // end capture
      return { output: output, error: error, stdout: stdout, executionTime: executionTime };
    }
  }]);

  return Editor;
})();

exports['default'] = Editor;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXRvbS1qcy1jb25zb2xlL2xpYi9FZGl0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7dUJBQ29CLFdBQVc7Ozs7a0JBQ2hCLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OzswQkFDQSxjQUFjOzs7O3lCQUNkLFlBQVk7O0lBQXZCLEtBQUs7O29CQUNBLE1BQU07Ozs7QUFOdkIsV0FBVyxDQUFBOztJQVFVLE1BQU07QUFJZCxXQUpRLE1BQU0sR0FJWDs7OzBCQUpLLE1BQU07O1NBRXpCLFdBQVcsR0FBRyw0QkFBNEI7O1NBMkIxQyxPQUFPLEdBQUcsWUFBTTtBQUNkLFlBQUssV0FBVyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ3ZCLFlBQUssT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO0tBQ3BCOztTQU9ELFFBQVEsR0FBRyxVQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUs7QUFDbkMsWUFBSyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFlBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFLLFdBQVcsQ0FBQyxDQUFBO0FBQzNDLFVBQUksWUFBWSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDOUMsWUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQUssUUFBUSxDQUFDLENBQUE7S0FDeEM7O1NBc0NELFFBQVEsR0FBRyxVQUFDLENBQUMsRUFBSztBQUNoQixVQUFNLElBQUksR0FBRyxNQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTs7cUJBQ2UsTUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDOztVQUEzRCxNQUFNLFlBQU4sTUFBTTtVQUFFLEtBQUssWUFBTCxLQUFLO1VBQUUsTUFBTSxZQUFOLE1BQU07VUFBRSxhQUFhLFlBQWIsYUFBYTs7QUFDNUMsWUFBSyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxNQUFNLEVBQU4s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TCxLQUFLLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxhQUFhLEVBQWIsYUFBYSxFQUFFLENBQUE7S0FDaEQ7OztTQWhGa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWpzLWNvbnNvbGUvbGliL0VkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5pbXBvcnQgQ29uc29sZSBmcm9tICcuL0NvbnNvbGUnXG5pbXBvcnQgdm0gZnJvbSAndm0nXG5pbXBvcnQgdXRpbCBmcm9tICd1dGlsJ1xuaW1wb3J0IEVkaXRvclZpZXcgZnJvbSAnLi9FZGl0b3JWaWV3J1xuaW1wb3J0ICogYXMgYmFiZWwgZnJvbSAnYmFiZWwtY29yZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvciB7XG5cbiAgZGVmYXVsdFRleHQgPSAnV3JpdGUgamF2YXNjcmlwdCBjb2RlIGhlcmUnXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25zb2xlID0gbmV3IENvbnNvbGUoKVxuXG4gICAgdGhpcy5lZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3IoKVxuICAgIHRoaXMuZWRpdG9yLnNldEdyYW1tYXIoYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKCdzb3VyY2UuanMnKSlcbiAgICB0aGlzLmVkaXRvci5zZXRQbGFjZWhvbGRlclRleHQodGhpcy5kZWZhdWx0VGV4dClcblxuICAgIHRoaXMuZWRpdG9yVmlldyA9IG5ldyBFZGl0b3JWaWV3KHRoaXMuZWRpdG9yLCB0aGlzLm9uQ2xvc2UpXG5cbiAgICB0aGlzLmVkaXRvclBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5lZGl0b3JWaWV3LmdldEVsZW1lbnQoKSxcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSlcblxuICAgIC8vIFRPRE8gTGlzdGVuIEVTQyBrZXkgdG8gY2xvc2VcblxuICAgIHRoaXMuZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nKHRoaXMub25DaGFuZ2UpIC8vIGRlYm91bmNlIGNoYW5nZVxuICB9XG5cbiAgc2hvdyhzZWxlY3RlZFRleHQ9bnVsbCkge1xuICAgIHRoaXMuZWRpdG9yLnNldFRleHQoc2VsZWN0ZWRUZXh0IHx8ICcnKVxuICAgIC8vIFRPRE8gR2V0IGZvY3VzIG9uIHRoaXMuZWRpdG9yXG4gICAgdGhpcy5lZGl0b3JQYW5lbC5zaG93KClcbiAgfVxuXG4gIG9uQ2xvc2UgPSAoKSA9PiB7XG4gICAgdGhpcy5lZGl0b3JQYW5lbC5oaWRlKClcbiAgICB0aGlzLmNvbnNvbGUuaGlkZSgpXG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZWRpdG9yUGFuZWwuZGVzdHJveSgpXG4gICAgdGhpcy5jb25zb2xlLmRlc3Ryb3koKVxuICB9XG5cbiAgb25FZGl0b3IgPSAoZWRpdG9yLCBzZWxlY3RlZFRleHQpID0+IHtcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgIGVkaXRvci5zZXRQbGFjZWhvbGRlclRleHQodGhpcy5kZWZhdWx0VGV4dClcbiAgICBpZiAoc2VsZWN0ZWRUZXh0KSBlZGl0b3Iuc2V0VGV4dChzZWxlY3RlZFRleHQpXG4gICAgZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nKHRoaXMub25DaGFuZ2UpIC8vIGRlYm91bmNlIGNoYW5nZVxuICB9XG5cbiAgZXhlY3V0ZShjb2RlKSB7XG4gICAgbGV0IHN0ZG91dCA9IFtdXG4gICAgLy8gbGV0IG9sZFdyaXRlID0gcHJvY2Vzcy5zdGRvdXQud3JpdGVcbiAgICAvLyBwcm9jZXNzLnN0ZG91dC53cml0ZSA9IGZ1bmN0aW9uKHN0ciwgZW5jb2RpbmcsIGZkKSB7IC8vIHN0YXJ0IGNhcHR1cmVcbiAgICAvLyAgIHN0ZG91dCArPSBzdHJcbiAgICAvLyB9XG5cbiAgICBjb25zdCBsb2cgPSBjb25zb2xlLmxvZ1xuICAgIGNvbnNvbGUubG9nID0gKC4uLmFyZ3MpID0+IHsgLy8gY2FwdHVyZSBjb25zb2xlLmxvZ1xuICAgICAgc3Rkb3V0LnB1c2goYXJnc1swXSlcbiAgICAgIGxvZyguLi5hcmdzKVxuICAgIH1cblxuICAgIGxldCBvdXRwdXQgPSBudWxsXG4gICAgbGV0IGVycm9yID0gbnVsbFxuICAgIGxldCBleGVjdXRpb25UaW1lID0gMFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGFydCA9IERhdGUubm93KClcbiAgICAgIGNvbnN0IHNhbmRib3ggPSB7IHdpbmRvdywgLi4ud2luZG93IH1cbiAgICAgIGNvZGUgPSBiYWJlbC50cmFuc2Zvcm0oY29kZSwge1xuICAgICAgICBleHRlbmRzOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLmJhYmVscmMnKVxuICAgICAgfSkuY29kZVxuICAgICAgb3V0cHV0ID0gdm0ucnVuSW5OZXdDb250ZXh0KGNvZGUsIHNhbmRib3gpXG4gICAgICBvdXRwdXQgPSBTdHJpbmcodXRpbC5pbnNwZWN0KG91dHB1dCwge3Nob3dIaWRkZW46IGZhbHNlLCBkZXB0aDogbnVsbH0pKVxuICAgICAgY29uc3QgZW5kID0gRGF0ZS5ub3coKVxuICAgICAgZXhlY3V0aW9uVGltZSA9IGVuZC1zdGFydFxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgb3V0cHV0ID0gbnVsbFxuICAgICAgZXJyb3IgPSBlXG4gICAgfVxuXG4gICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUgPSBvbGRXcml0ZSAvLyBlbmQgY2FwdHVyZVxuICAgIHJldHVybiB7IG91dHB1dCwgZXJyb3IsIHN0ZG91dCwgZXhlY3V0aW9uVGltZSB9XG4gIH1cblxuICBvbkNoYW5nZSA9IChlKSA9PiB7XG4gICAgY29uc3QgY29kZSA9IHRoaXMuZWRpdG9yLmdldFRleHQoKVxuICAgIGNvbnN0IHsgb3V0cHV0LCBlcnJvciwgc3Rkb3V0LCBleGVjdXRpb25UaW1lIH0gPSB0aGlzLmV4ZWN1dGUoY29kZSlcbiAgICB0aGlzLmNvbnNvbGUucmVuZGVyKHsgY29kZSwgb3V0cHV0LCBzdGRvdXQsIGVycm9yLCBleGVjdXRpb25UaW1lIH0pXG4gIH1cblxufVxuIl19