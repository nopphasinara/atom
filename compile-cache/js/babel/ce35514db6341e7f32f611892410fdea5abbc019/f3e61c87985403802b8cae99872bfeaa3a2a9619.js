'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var cleanJsonString = function cleanJsonString(jsonstring) {
  // http://stackoverflow.com/questions/14432165/uncaught-syntaxerror-unexpected-token-with-json-parse

  if (jsonstring === null) return '';

  // preserve newlines, etc - use valid JSON
  jsonstring = jsonstring.replace(/\\n/g, "\\n").replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, "\\&").replace(/\\r/g, "\\r").replace(/\\t/g, "\\t").replace(/\\b/g, "\\b").replace(/\\f/g, "\\f");
  // remove non-printable and other non-valid JSON chars
  jsonstring = jsonstring.replace(/[\u0000-\u001F]+/g, '');

  return jsonstring;
};

exports.cleanJsonString = cleanJsonString;
var basename = function basename(path) {
  var sep = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

  return trailingslashit(path, sep).split(sep).pop();
};

exports.basename = basename;
var dirname = function dirname(path) {
  var sep = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

  var arrPath = trailingslashit(path, sep).split(sep);
  arrPath.pop();
  return untrailingslashit(arrPath.join(sep), sep);
};

exports.dirname = dirname;
var trailingslashit = function trailingslashit(path) {
  var sep = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

  if (sep == '/') {
    if (path == '/') return path;
    return path.replace(/\/$/, '');
  } else {
    if (path == '\\') return path;
    return path.replace(/\\$/, '');
  }
};

exports.trailingslashit = trailingslashit;
var untrailingslashit = function untrailingslashit(path) {
  var sep = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

  path = trailingslashit(path, sep);
  return path + sep;
};

exports.untrailingslashit = untrailingslashit;
var leadingslashit = function leadingslashit(path) {
  var sep = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

  if (sep == '/') {
    if (path == '/') return path;
    return path.replace(/^\/+/, '');
  } else {
    if (path == '\\') return path;
    return path.replace(/^\\/, '');
  }
};

exports.leadingslashit = leadingslashit;
var unleadingslashit = function unleadingslashit(path) {
  var sep = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

  path = leadingslashit(path, sep);
  return sep + path;
};

exports.unleadingslashit = unleadingslashit;
var normalize = function normalize(path) {
  var sep = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];

  if (!path) return '';
  path = path.trim();

  if (sep == '/') {
    if (path == '/') return path;
    return path.replace(/\\+/g, "/").replace(/\/+/g, "/").split('/').map(function (item) {
      return item.trim();
    }).join('/');
  } else {
    if (path == '\\') return path;
    return path.replace(/\/+/g, "\\").replace(/\\+/g, "\\").split('\\').map(function (item) {
      return item.trim();
    }).join('\\');
  }
};

exports.normalize = normalize;
var formatNumber = function formatNumber(num) {
  return String(num).replace(/(.)(?=(\d{3})+$)/g, '$1.');
};
exports.formatNumber = formatNumber;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi9oZWxwZXIvZm9ybWF0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7QUFFTCxJQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUksVUFBVSxFQUFLOzs7QUFHN0MsTUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDOzs7QUFHbkMsWUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUMzQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUN0QixPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUN0QixPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUN0QixPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUN0QixPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUN0QixPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUN0QixPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUUxQixZQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFekQsU0FBTyxVQUFVLENBQUM7Q0FDbkIsQ0FBQTs7O0FBRU0sSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksSUFBSSxFQUFnQjtNQUFkLEdBQUcseURBQUcsR0FBRzs7QUFDdEMsU0FBTyxlQUFlLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUNwRCxDQUFBOzs7QUFFTSxJQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxJQUFJLEVBQWdCO01BQWQsR0FBRyx5REFBRyxHQUFHOztBQUNyQyxNQUFJLE9BQU8sR0FB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QyxVQUFDLElBQUksRUFBSztBQUNoRixhQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNwQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ2Y7Q0FDRixDQUFBOzs7QUFFTSxJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxHQUFHLEVBQUs7QUFDbkMsU0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFDO0NBQ3hELENBQUEiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL2hlbHBlci9mb3JtYXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGNvbnN0IGNsZWFuSnNvblN0cmluZyA9IChqc29uc3RyaW5nKSA9PiB7XG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTQ0MzIxNjUvdW5jYXVnaHQtc3ludGF4ZXJyb3ItdW5leHBlY3RlZC10b2tlbi13aXRoLWpzb24tcGFyc2VcblxuICBpZiAoanNvbnN0cmluZyA9PT0gbnVsbCkgcmV0dXJuICcnO1xuXG4gIC8vIHByZXNlcnZlIG5ld2xpbmVzLCBldGMgLSB1c2UgdmFsaWQgSlNPTlxuICBqc29uc3RyaW5nID0ganNvbnN0cmluZy5yZXBsYWNlKC9cXFxcbi9nLCBcIlxcXFxuXCIpXG4gICAgLnJlcGxhY2UoL1xcXFwnL2csIFwiXFxcXCdcIilcbiAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcXFxcXCInKVxuICAgIC5yZXBsYWNlKC9cXFxcJi9nLCBcIlxcXFwmXCIpXG4gICAgLnJlcGxhY2UoL1xcXFxyL2csIFwiXFxcXHJcIilcbiAgICAucmVwbGFjZSgvXFxcXHQvZywgXCJcXFxcdFwiKVxuICAgIC5yZXBsYWNlKC9cXFxcYi9nLCBcIlxcXFxiXCIpXG4gICAgLnJlcGxhY2UoL1xcXFxmL2csIFwiXFxcXGZcIik7XG4gIC8vIHJlbW92ZSBub24tcHJpbnRhYmxlIGFuZCBvdGhlciBub24tdmFsaWQgSlNPTiBjaGFyc1xuICBqc29uc3RyaW5nID0ganNvbnN0cmluZy5yZXBsYWNlKC9bXFx1MDAwMC1cXHUwMDFGXSsvZywgJycpO1xuXG4gIHJldHVybiBqc29uc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgYmFzZW5hbWUgPSAocGF0aCwgc2VwID0gJy8nKSA9PiB7XG4gIHJldHVybiB0cmFpbGluZ3NsYXNoaXQocGF0aCwgc2VwKS5zcGxpdChzZXApLnBvcCgpO1xufVxuXG5leHBvcnQgY29uc3QgZGlybmFtZSA9IChwYXRoLCBzZXAgPSAnLycpID0+IHtcbiAgbGV0IGFyclBhdGggPSB0cmFpbGluZ3NsYXNoaXQocGF0aCwgc2VwKS5zcGxpdChzZXApO1xuICBhcnJQYXRoLnBvcCgpO1xuICByZXR1cm4gdW50cmFpbGluZ3NsYXNoaXQoYXJyUGF0aC5qb2luKHNlcCksIHNlcCk7XG59XG5cbmV4cG9ydCBjb25zdCB0cmFpbGluZ3NsYXNoaXQgPSAocGF0aCwgc2VwID0gJy8nKSA9PiB7XG4gIGlmIChzZXAgPT0gJy8nKSB7XG4gICAgaWYgKHBhdGggPT0gJy8nKSByZXR1cm4gcGF0aDtcbiAgICByZXR1cm4gcGF0aC5yZXBsYWNlKC9cXC8kLywgJycpO1xuICB9IGVsc2Uge1xuICAgIGlmIChwYXRoID09ICdcXFxcJykgcmV0dXJuIHBhdGg7XG4gICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXCQvLCAnJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVudHJhaWxpbmdzbGFzaGl0ID0gKHBhdGgsIHNlcCA9ICcvJykgPT4ge1xuICBwYXRoID0gdHJhaWxpbmdzbGFzaGl0KHBhdGgsIHNlcCk7XG4gIHJldHVybiBwYXRoICsgc2VwO1xufVxuXG5leHBvcnQgY29uc3QgbGVhZGluZ3NsYXNoaXQgPSAocGF0aCwgc2VwID0gJy8nKSA9PiB7XG4gIGlmIChzZXAgPT0gJy8nKSB7XG4gICAgaWYgKHBhdGggPT0gJy8nKSByZXR1cm4gcGF0aDtcbiAgICByZXR1cm4gcGF0aC5yZXBsYWNlKC9eXFwvKy8sICcnKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAocGF0aCA9PSAnXFxcXCcpIHJldHVybiBwYXRoO1xuICAgIHJldHVybiBwYXRoLnJlcGxhY2UoL15cXFxcLywgJycpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1bmxlYWRpbmdzbGFzaGl0ID0gKHBhdGgsIHNlcCA9ICcvJykgPT4ge1xuICBwYXRoID0gbGVhZGluZ3NsYXNoaXQocGF0aCwgc2VwKTtcbiAgcmV0dXJuIHNlcCArIHBhdGg7XG59XG5cbmV4cG9ydCBjb25zdCBub3JtYWxpemUgPSAocGF0aCwgc2VwID0gJy8nKSA9PiB7XG4gIGlmICghcGF0aCkgcmV0dXJuICcnO1xuICBwYXRoID0gcGF0aC50cmltKCk7XG4gIFxuICBpZiAoc2VwID09ICcvJykge1xuICAgIGlmIChwYXRoID09ICcvJykgcmV0dXJuIHBhdGg7XG4gICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXCsvZywgXCIvXCIpLnJlcGxhY2UoL1xcLysvZywgXCIvXCIpLnNwbGl0KCcvJykubWFwKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gaXRlbS50cmltKCk7XG4gICAgfSkuam9pbignLycpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHBhdGggPT0gJ1xcXFwnKSByZXR1cm4gcGF0aDtcbiAgICByZXR1cm4gcGF0aC5yZXBsYWNlKC9cXC8rL2csIFwiXFxcXFwiKS5yZXBsYWNlKC9cXFxcKy9nLCBcIlxcXFxcIikuc3BsaXQoJ1xcXFwnKS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBpdGVtLnRyaW0oKTtcbiAgICB9KS5qb2luKCdcXFxcJyk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGZvcm1hdE51bWJlciA9IChudW0pID0+IHtcbiAgcmV0dXJuIFN0cmluZyhudW0pLnJlcGxhY2UoLyguKSg/PShcXGR7M30pKyQpL2csICckMS4nKTtcbn1cbiJdfQ==