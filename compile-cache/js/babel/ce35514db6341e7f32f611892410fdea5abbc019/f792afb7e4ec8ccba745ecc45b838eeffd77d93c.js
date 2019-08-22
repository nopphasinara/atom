Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = makeRequire;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var debug = (0, _debug2["default"])("js-hyperclick:require-if-trusted");

var hashFile = function hashFile(filename) {
  var hash = _crypto2["default"].createHash("sha1");
  hash.setEncoding("hex");
  hash.write(_fs2["default"].readFileSync(filename));
  hash.end();
  return String(hash.read());
};

var fileHashes = {};

var hasChanged = function hasChanged(filename, hash) {
  return fileHashes[filename] != null && fileHashes[filename] != hash;
};

var configKey = "js-hyperclick.trustedFiles";
function updateTrust(hash, trusted) {
  var trustedFiles = (atom.config.get(configKey) || []).filter(function (tmp) {
    return tmp.hash !== hash;
  });

  var newConfig = [].concat(_toConsumableArray(trustedFiles), [{ hash: hash, trusted: trusted }]);
  debug("updateTrust", newConfig);

  atom.config.set(configKey, newConfig);
}

function promptUser(_ref) {
  var path = _ref.path;
  var hash = _ref.hash;
  var lastHash = _ref.lastHash;
  var fallback = _ref.fallback;

  var message = "js-hyperclick: Trust and execute this file?";
  var detail = "filename: " + path + "\nhash: " + hash;

  if (lastHash) {
    detail += "\nprevious hash: " + lastHash;
    detail += "\nThe file has changed and atom must reload to use it.";
  }

  debug("promptUser", path);
  var options = {
    pending: atom.config.get("js-hyperclick.usePendingPanes")
  };
  var untrustedFile = atom.workspace.open(path, options);
  var notification = atom.notifications.addInfo(message, {
    detail: detail,
    dismissable: true,
    buttons: [{
      text: lastHash ? "Trust & Restart" : "Trust",
      onDidClick: function onDidClick() {
        updateTrust(hash, true);
        notification.dismiss();

        if (lastHash) {
          return atom.reload();
        }
        debug("Trust");
        fallback(true);
        untrustedFile.then(function (editor) {
          editor.destroy();
        });
      }
    }, {
      text: "Never",
      onDidClick: function onDidClick() {
        updateTrust(hash, false);
        notification.dismiss();
      }
    }]
  });
}

function makeRequire(fallback) {
  return function requireIfTrusted(path) {
    var trustedFiles = atom.config.get(configKey) || [];

    var hash = hashFile(path);
    // Originally I was going to store the filename and a hash
    // (trustedFiles[path][hash] = true), but using a config key
    // that contains a dot causes it to get broken up
    // (trustedFiles['some-path']['js'][hash] = true)

    var _ref2 = trustedFiles.find(function (tmp) {
      return tmp.hash === hash;
    }) || {};

    var trusted = _ref2.trusted;

    var changed = hasChanged(path, hash);
    var lastHash = fileHashes[path];

    if (trusted && !changed) {
      fileHashes[path] = hash;
      // $FlowExpectError
      return require(path);
    }

    if (trusted == null || changed) {
      promptUser({ path: path, hash: hash, lastHash: lastHash, fallback: fallback });
    }
    return fallback(false);
  };
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvcmVxdWlyZS1pZi10cnVzdGVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFnRndCLFdBQVc7Ozs7OztrQkEvRXBCLElBQUk7Ozs7c0JBQ0EsUUFBUTs7OztxQkFDTCxPQUFPOzs7O0FBQzdCLElBQU0sS0FBSyxHQUFHLHdCQUFVLGtDQUFrQyxDQUFDLENBQUE7O0FBRTNELElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFJLFFBQVEsRUFBcUI7QUFDN0MsTUFBTSxJQUFJLEdBQUcsb0JBQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3RDLE1BQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDdkIsTUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtBQUNyQyxNQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDVixTQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtDQUMzQixDQUFBOztBQUVELElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQTs7QUFFckIsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksUUFBUSxFQUFFLElBQUk7U0FDaEMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSTtDQUFBLENBQUE7O0FBTTlELElBQU0sU0FBUyxHQUFHLDRCQUE0QixDQUFBO0FBQzlDLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7QUFDbEMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUEsQ0FBRSxNQUFNLENBQzVELFVBQUEsR0FBRztXQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFB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akMsUUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDdkIsZ0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUE7O0FBRXZCLGFBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3JCOztBQUVELFFBQUksT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLEVBQUU7QUFDOUIsZ0JBQVUsQ0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO0tBQy9DO0FBQ0QsV0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDdkIsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvcmVxdWlyZS1pZi10cnVzdGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBmcyBmcm9tIFwiZnNcIlxuaW1wb3J0IGNyeXB0byBmcm9tIFwiY3J5cHRvXCJcbmltcG9ydCBtYWtlRGVidWcgZnJvbSBcImRlYnVnXCJcbmNvbnN0IGRlYnVnID0gbWFrZURlYnVnKFwianMtaHlwZXJjbGljazpyZXF1aXJlLWlmLXRydXN0ZWRcIilcblxuY29uc3QgaGFzaEZpbGUgPSAoZmlsZW5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaChcInNoYTFcIilcbiAgaGFzaC5zZXRFbmNvZGluZyhcImhleFwiKVxuICBoYXNoLndyaXRlKGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSkpXG4gIGhhc2guZW5kKClcbiAgcmV0dXJuIFN0cmluZyhoYXNoLnJlYWQoKSlcbn1cblxuY29uc3QgZmlsZUhhc2hlcyA9IHt9XG5cbmNvbnN0IGhhc0NoYW5nZWQgPSAoZmlsZW5hbWUsIGhhc2gpID0+XG4gIGZpbGVIYXNoZXNbZmlsZW5hbWVdICE9IG51bGwgJiYgZmlsZUhhc2hlc1tmaWxlbmFtZV0gIT0gaGFzaFxuXG5leHBvcnQgdHlwZSBGYWxsYmFjazxUPiA9ICh0cnVzdGVkOiBib29sZWFuKSA9PiBUXG5cbmV4cG9ydCB0eXBlIFJlcXVpcmU8VD4gPSAobW9kdWxlTmFtZTogc3RyaW5nKSA9PiBUXG5cbmNvbnN0IGNvbmZpZ0tleSA9IFwianMtaHlwZXJjbGljay50cnVzdGVkRmlsZXNcIlxuZnVuY3Rpb24gdXBkYXRlVHJ1c3QoaGFzaCwgdHJ1c3RlZCkge1xuICBjb25zdCB0cnVzdGVkRmlsZXMgPSAoYXRvbS5jb25maWcuZ2V0KGNvbmZpZ0tleSkgfHwgW10pLmZpbHRlcihcbiAgICB0bXAgPT4gdG1wLmhhc2ggIT09IGhhc2gsXG4gIClcblxuICBjb25zdCBuZXdDb25maWcgPSBbLi4udHJ1c3RlZEZpbGVzLCB7IGhhc2gsIHRydXN0ZWQgfV1cbiAgZGVidWcoXCJ1cGRhdGVUcnVzdFwiLCBuZXdDb25maWcpXG5cbiAgYXRvbS5jb25maWcuc2V0KGNvbmZpZ0tleSwgbmV3Q29uZmlnKVxufVxuXG5mdW5jdGlvbiBwcm9tcHRVc2VyKHsgcGF0aCwgaGFzaCwgbGFzdEhhc2gsIGZhbGxiYWNrIH0pIHtcbiAgY29uc3QgbWVzc2FnZSA9IFwianMtaHlwZXJjbGljazogVHJ1c3QgYW5kIGV4ZWN1dGUgdGhpcyBmaWxlP1wiXG4gIGxldCBkZXRhaWwgPSBgZmlsZW5hbWU6ICR7cGF0aH1cXG5oYXNoOiAke2hhc2h9YFxuXG4gIGlmIChsYXN0SGFzaCkge1xuICAgIGRldGFpbCArPSBgXFxucHJldmlvdXMgaGFzaDogJHtsYXN0SGFzaH1gXG4gICAgZGV0YWlsICs9IGBcXG5UaGUgZmlsZSBoYXMgY2hhbmdlZCBhbmQgYXRvbSBtdXN0IHJlbG9hZCB0byB1c2UgaXQuYFxuICB9XG5cbiAgZGVidWcoXCJwcm9tcHRVc2VyXCIsIHBhdGgpXG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgcGVuZGluZzogYXRvbS5jb25maWcuZ2V0KFwianMtaHlwZXJjbGljay51c2VQZW5kaW5nUGFuZXNcIiksXG4gIH1cbiAgY29uc3QgdW50cnVzdGVkRmlsZSA9IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aCwgb3B0aW9ucylcbiAgY29uc3Qgbm90aWZpY2F0aW9uID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8obWVzc2FnZSwge1xuICAgIGRldGFpbCxcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICBidXR0b25zOiBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6IGxhc3RIYXNoID8gXCJUcnVzdCAmIFJlc3RhcnRcIiA6IFwiVHJ1c3RcIixcbiAgICAgICAgb25EaWRDbGljaygpIHtcbiAgICAgICAgICB1cGRhdGVUcnVzdChoYXNoLCB0cnVlKVxuICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcblxuICAgICAgICAgIGlmIChsYXN0SGFzaCkge1xuICAgICAgICAgICAgcmV0dXJuIGF0b20ucmVsb2FkKClcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVidWcoXCJUcnVzdFwiKVxuICAgICAgICAgIGZhbGxiYWNrKHRydWUpXG4gICAgICAgICAgdW50cnVzdGVkRmlsZS50aGVuKGVkaXRvciA9PiB7XG4gICAgICAgICAgICBlZGl0b3IuZGVzdHJveSgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRleHQ6IFwiTmV2ZXJcIixcbiAgICAgICAgb25EaWRDbGljaygpIHtcbiAgICAgICAgICB1cGRhdGVUcnVzdChoYXNoLCBmYWxzZSlcbiAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VSZXF1aXJlPFQ+KGZhbGxiYWNrOiBGYWxsYmFjazxUPik6IFJlcXVpcmU8VD4ge1xuICByZXR1cm4gZnVuY3Rpb24gcmVxdWlyZUlmVHJ1c3RlZChwYXRoOiBzdHJpbmcpOiBUIHtcbiAgICBjb25zdCB0cnVzdGVkRmlsZXMgPSBhdG9tLmNvbmZpZy5nZXQoY29uZmlnS2V5KSB8fCBbXVxuXG4gICAgY29uc3QgaGFzaCA9IGhhc2hGaWxlKHBhdGgpXG4gICAgLy8gT3JpZ2luYWxseSBJIHdhcyBnb2luZyB0byBzdG9yZSB0aGUgZmlsZW5hbWUgYW5kIGEgaGFzaFxuICAgIC8vICh0cnVzdGVkRmlsZXNbcGF0aF1baGFzaF0gPSB0cnVlKSwgYnV0IHVzaW5nIGEgY29uZmlnIGtleVxuICAgIC8vIHRoYXQgY29udGFpbnMgYSBkb3QgY2F1c2VzIGl0IHRvIGdldCBicm9rZW4gdXBcbiAgICAvLyAodHJ1c3RlZEZpbGVzWydzb21lLXBhdGgnXVsnanMnXVtoYXNoXSA9IHRydWUpXG4gICAgY29uc3QgeyB0cnVzdGVkIH0gPSB0cnVzdGVkRmlsZXMuZmluZCh0bXAgPT4gdG1wLmhhc2ggPT09IGhhc2gpIHx8IHt9XG5cbiAgICBjb25zdCBjaGFuZ2VkID0gaGFzQ2hhbmdlZChwYXRoLCBoYXNoKVxuICAgIGNvbnN0IGxhc3RIYXNoID0gZmlsZUhhc2hlc1twYXRoXVxuXG4gICAgaWYgKHRydXN0ZWQgJiYgIWNoYW5nZWQpIHtcbiAgICAgIGZpbGVIYXNoZXNbcGF0aF0gPSBoYXNoXG4gICAgICAvLyAkRmxvd0V4cGVjdEVycm9yXG4gICAgICByZXR1cm4gcmVxdWlyZShwYXRoKVxuICAgIH1cblxuICAgIGlmICh0cnVzdGVkID09IG51bGwgfHwgY2hhbmdlZCkge1xuICAgICAgcHJvbXB0VXNlcih7IHBhdGgsIGhhc2gsIGxhc3RIYXNoLCBmYWxsYmFjayB9KVxuICAgIH1cbiAgICByZXR1cm4gZmFsbGJhY2soZmFsc2UpXG4gIH1cbn1cbiJdfQ==