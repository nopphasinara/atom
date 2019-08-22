Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = config;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

"use babel";

var DEFAULT_EXTS = 'html css js png gif jpg php php5 py rb erb coffee'.split(' ');
var DEFAULT_EXCLUSIONS = '.DS_Store .gitignore .git/ .svn/ .hg/'.split(' ');

function config() {
  var custom = {
    // port number
    port: atom.config.get('livereload.port'),

    // use HTTPS
    https: atom.config.get('livereload.useHTTPS') ? {} : null,

    // applyCSSLive
    applyCSSLive: atom.config.get('livereload.applyCSSLive') || true,

    // applyImageLive
    applyImageLive: atom.config.get('livereload.applyImageLive') || false,

    // delay for update
    delayForUpdate: atom.config.get('livereload.delayForUpdate'),

    // auto start
    autoStart: !!atom.config.get('livereload.autoStart'),

    // exts
    exts: atom.config.get('livereload.exts').split(','),

    // exclusions
    exclusions: atom.config.get('livereload.exclusions').split(',')
  };

  // exts
  custom.exts = _lodash2['default'].chain(custom.exts).map(function (ext) {
    return ext.trim();
  }).concat(DEFAULT_EXTS).uniq().value();

  // exclusions
  custom.exclusions = _lodash2['default'].chain(custom.exclusions).map(function (ex) {
    return ex.trim();
  }).concat(DEFAULT_EXCLUSIONS).uniq().map(function (pattern) {
    return new RegExp(pattern.replace(/([.\\\/])/g, '\\$1'));
  }).value();

  return custom;
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvbGl2ZXJlbG9hZC9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFPd0IsTUFBTTs7OztzQkFMaEIsUUFBUTs7OztBQUZ0QixXQUFXLENBQUM7O0FBSVosSUFBTSxZQUFZLEdBQUcsbURBQW1ELENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BGLElBQU0sa0JBQWtCLEdBQUcsdUNBQXVDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUvRCxTQUFTLE1BQU0sR0FBRztBQUMvQixNQUFJLE1BQU0sR0FBRzs7QUFFWCxRQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7OztBQUd4QyxTQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSTs7O0FBR3pELGdCQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsSUFBSSxJQUFJOzs7QUFHaEUsa0JBQWMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLEtBQUs7OztBQUdyRSxrQkFBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDOzs7QUFHNUQsYUFBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQzs7O0FBR3BELFFBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7OztBQUduRCxjQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0dBQ2hFLENBQUM7OztBQUdGLFFBQU0sQ0FBQyxJQUFJLEdBQUcsb0JBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUUsVUFBQSxHQUFHO1dBQUksR0FBRyxDQUFDLElBQUksRUFBRTtHQUFBLENBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7OztBQUdoRyxRQUFNLENBQUMsVUFBVSxHQUFHLG9CQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFFLFVBQUEsRUFBRTtXQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUU7R0FBQSxDQUFFLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFFLFVBQUEsT0FBTyxFQUFJO0FBQUUsV0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUUsQ0FBQyxDQUFBO0dBQUUsQ0FBRSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVoTSxTQUFPLE1BQU0sQ0FBQztDQUNmIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvbGl2ZXJlbG9hZC9saWIvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuY29uc3QgREVGQVVMVF9FWFRTID0gJ2h0bWwgY3NzIGpzIHBuZyBnaWYganBnIHBocCBwaHA1IHB5IHJiIGVyYiBjb2ZmZWUnLnNwbGl0KCcgJyk7XG5jb25zdCBERUZBVUxUX0VYQ0xVU0lPTlMgPSAnLkRTX1N0b3JlIC5naXRpZ25vcmUgLmdpdC8gLnN2bi8gLmhnLycuc3BsaXQoJyAnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29uZmlnKCkge1xuICB2YXIgY3VzdG9tID0ge1xuICAgIC8vIHBvcnQgbnVtYmVyXG4gICAgcG9ydDogYXRvbS5jb25maWcuZ2V0KCdsaXZlcmVsb2FkLnBvcnQnKSxcblxuICAgIC8vIHVzZSBIVFRQU1xuICAgIGh0dHBzOiBhdG9tLmNvbmZpZy5nZXQoJ2xpdmVyZWxvYWQudXNlSFRUUFMnKSA/IHt9IDogbnVsbCxcblxuICAgIC8vIGFwcGx5Q1NTTGl2ZVxuICAgIGFwcGx5Q1NTTGl2ZTogYXRvbS5jb25maWcuZ2V0KCdsaXZlcmVsb2FkLmFwcGx5Q1NTTGl2ZScpIHx8IHRydWUsXG5cbiAgICAvLyBhcHBseUltYWdlTGl2ZVxuICAgIGFwcGx5SW1hZ2VMaXZlOiBhdG9tLmNvbmZpZy5nZXQoJ2xpdmVyZWxvYWQuYXBwbHlJbWFnZUxpdmUnKSB8fCBmYWxzZSxcblxuICAgIC8vIGRlbGF5IGZvciB1cGRhdGVcbiAgICBkZWxheUZvclVwZGF0ZTogYXRvbS5jb25maWcuZ2V0KCdsaXZlcmVsb2FkLmRlbGF5Rm9yVXBkYXRlJyksXG5cbiAgICAvLyBhdXRvIHN0YXJ0XG4gICAgYXV0b1N0YXJ0OiAhIWF0b20uY29uZmlnLmdldCgnbGl2ZXJlbG9hZC5hdXRvU3RhcnQnKSxcblxuICAgIC8vIGV4dHNcbiAgICBleHRzOiBhdG9tLmNvbmZpZy5nZXQoJ2xpdmVyZWxvYWQuZXh0cycpLnNwbGl0KCcsJyksXG5cbiAgICAvLyBleGNsdXNpb25zXG4gICAgZXhjbHVzaW9uczogYXRvbS5jb25maWcuZ2V0KCdsaXZlcmVsb2FkLmV4Y2x1c2lvbnMnKS5zcGxpdCgnLCcpXG4gIH07XG5cbiAgLy8gZXh0c1xuICBjdXN0b20uZXh0cyA9IF8uY2hhaW4oY3VzdG9tLmV4dHMpLm1hcCggZXh0ID0+IGV4dC50cmltKCkgKS5jb25jYXQoREVGQVVMVF9FWFRTKS51bmlxKCkudmFsdWUoKTtcblxuICAvLyBleGNsdXNpb25zXG4gIGN1c3RvbS5leGNsdXNpb25zID0gXy5jaGFpbihjdXN0b20uZXhjbHVzaW9ucykubWFwKCBleCA9PiBleC50cmltKCkgKS5jb25jYXQoREVGQVVMVF9FWENMVVNJT05TKS51bmlxKCkubWFwKCBwYXR0ZXJuID0+IHsgcmV0dXJuIG5ldyBSZWdFeHAocGF0dGVybi5yZXBsYWNlKC8oWy5cXFxcXFwvXSkvZywgJ1xcXFwkMScgKSkgfSApLnZhbHVlKCk7XG5cbiAgcmV0dXJuIGN1c3RvbTtcbn1cbiJdfQ==