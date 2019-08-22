function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path2 = require("path");

var _path3 = _interopRequireDefault(_path2);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

'use babel';

module.exports = {
  activate: function activate() {
    require("atom-package-deps").install("path-hyperclick");
  },
  getProvider: function getProvider() {
    return {
      wordRegExp: /\.{0,2}\/[A-Za-z0-9\-_\/.][A-Za-z0-9\-_\/. ]*/g,
      providerName: "path-hyperclick",
      /**
       * textEditor {atom$TextEditor}
       * path {string}
       * range {atom$Range}
       */
      getSuggestionForWord: function getSuggestionForWord(textEditor, _path, range) {
        var dir = _path3["default"].dirname(atom.workspace.getActiveTextEditor().getPath());
        _path = _path3["default"].join(dir, _path);
        return {
          range: range,
          callback: function callback() {
            if (_path === undefined || _path.length === 0) {
              return;
            }
            _fs2["default"].exists(_path, function (exists) {
              if (!exists) {
                atom.notifications.addError("File doesn't exists");
                return;
              }

              _fs2["default"].lstat(_path, function (_, stats) {
                if (stats.isDirectory()) {
                  atom.notifications.addError("Path is directory, It cann't open.");
                  return;
                }
                atom.workspace.open(_path);
              });
            });
          }
        };
      }
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvcGF0aC1oeXBlcmNsaWNrL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O3FCQUVpQixNQUFNOzs7O2tCQUNSLElBQUk7Ozs7QUFIbkIsV0FBVyxDQUFDOztBQUtaLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixVQUFRLEVBQUEsb0JBQUc7QUFDVCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztHQUN6RDtBQUNELGFBQVcsRUFBQSx1QkFBRztBQUNaLFdBQU87QUFDTCxnQkFBVSxFQUFFLGdEQUFnRDtBQUM1RCxrQkFBWSxFQUFFLGlCQUFpQjs7Ozs7O0FBTS9CLDBCQUFvQixFQUFBLDhCQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDO0FBQzVDLFlBQUksR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUN2RSxhQUFLLEdBQUcsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5QixlQUFPO0FBQ0wsZUFBSyxFQUFMLEtBQUs7QUFDTCxrQkFBUSxFQUFBLG9CQUFHO0FBQ1QsZ0JBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUFFLHFCQUFPO2FBQUU7QUFDMUQsNEJBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFDLE1BQU0sRUFBSztBQUMzQixrQkFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLG9CQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ25ELHVCQUFPO2VBQ1I7O0FBRUQsOEJBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFDLENBQUMsRUFBRSxLQUFLLEVBQUs7QUFDNUIsb0JBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQ3ZCLHNCQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBQ2xFLHlCQUFPO2lCQUNSO0FBQ0Qsb0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2VBQzVCLENBQUMsQ0FBQzthQUNKLENBQUMsQ0FBQztXQUNKO1NBQ0YsQ0FBQztPQUNIO0tBQ0YsQ0FBQztHQUNIO0NBQ0YsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL3BhdGgtaHlwZXJjbGljay9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgcmVxdWlyZShcImF0b20tcGFja2FnZS1kZXBzXCIpLmluc3RhbGwoXCJwYXRoLWh5cGVyY2xpY2tcIik7XG4gIH0sXG4gIGdldFByb3ZpZGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICB3b3JkUmVnRXhwOiAvXFwuezAsMn1cXC9bQS1aYS16MC05XFwtX1xcLy5dW0EtWmEtejAtOVxcLV9cXC8uIF0qL2csXG4gICAgICBwcm92aWRlck5hbWU6IFwicGF0aC1oeXBlcmNsaWNrXCIsXG4gICAgICAvKipcbiAgICAgICAqIHRleHRFZGl0b3Ige2F0b20kVGV4dEVkaXRvcn1cbiAgICAgICAqIHBhdGgge3N0cmluZ31cbiAgICAgICAqIHJhbmdlIHthdG9tJFJhbmdlfVxuICAgICAgICovXG4gICAgICBnZXRTdWdnZXN0aW9uRm9yV29yZCh0ZXh0RWRpdG9yLCBfcGF0aCwgcmFuZ2Upe1xuICAgICAgICBsZXQgZGlyID0gcGF0aC5kaXJuYW1lKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRQYXRoKCkpO1xuICAgICAgICBfcGF0aCA9IHBhdGguam9pbihkaXIsIF9wYXRoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByYW5nZSxcbiAgICAgICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgIGlmIChfcGF0aCA9PT0gdW5kZWZpbmVkIHx8IF9wYXRoLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIGZzLmV4aXN0cyhfcGF0aCwgKGV4aXN0cykgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIkZpbGUgZG9lc24ndCBleGlzdHNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZnMubHN0YXQoX3BhdGgsIChfLCBzdGF0cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJQYXRoIGlzIGRpcmVjdG9yeSwgSXQgY2Fubid0IG9wZW4uXCIpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKF9wYXRoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcbiJdfQ==