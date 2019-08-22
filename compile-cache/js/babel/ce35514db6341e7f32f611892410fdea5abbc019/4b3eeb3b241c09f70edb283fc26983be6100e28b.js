function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*global atom */

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _atom = require("atom");

var _shell = require("shell");

var _shell2 = _interopRequireDefault(_shell);

var _makeCache = require("./make-cache");

var _makeCache2 = _interopRequireDefault(_makeCache);

var _core = require("./core");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _requireIfTrusted = require("./require-if-trusted");

var _requireIfTrusted2 = _interopRequireDefault(_requireIfTrusted);

"use babel";

var debug = (0, _debug2["default"])("js-hyperclick");

var scopes = ["source.js", "source.js.jsx", "javascript", "source.flow"];
var isJavascript = function isJavascript(textEditor) {
  var _textEditor$getGrammar = textEditor.getGrammar();

  var scopeName = _textEditor$getGrammar.scopeName;

  if (scopes.indexOf(scopeName) >= 0) {
    return true;
  }
  debug("Not Javascript", scopeName);
  return false;
};

function makeProvider(subscriptions) {
  var cache = (0, _makeCache2["default"])(subscriptions);
  var automaticJumpCounter = 0;

  var automaticJump = function automaticJump(textEditor, _ref) {
    var start = _ref.start;
    var end = _ref.end;

    if (!atom.config.get("js-hyperclick.skipIntermediate")) {
      return;
    }

    if (automaticJumpCounter++ > 10) {
      var detail = "Unable to find origin: too many jumps";
      atom.notifications.addWarning("js-hyperclick", { detail: detail });
      return;
    }

    var buffer = textEditor.getBuffer();
    var nextInfo = cache.get(textEditor);
    var range = new _atom.Range(
    // I know this works, but flow claims the type is wrong - $FlowFixMe
    buffer.positionForCharacterIndex(start).toArray(), buffer.positionForCharacterIndex(end).toArray());
    var text = buffer.getTextInRange(range);

    var options = {
      jumpToImport: atom.config.get("js-hyperclick.jumpToImport")
    };

    var nextSuggestion = (0, _core.buildSuggestion)(nextInfo, text, { start: start, end: end }, options);

    var result = undefined;
    if (nextSuggestion) {
      if (options.jumpToImport && nextSuggestion.type === "from-import") {
        return;
      }

      result = buildResult(textEditor, range, nextSuggestion, true);
    }
    if (result) {
      result.callback();
    }
  };

  var navigateToSuggestion = function navigateToSuggestion(textEditor, suggestion) {
    var info = cache.get(textEditor);
    var target = (0, _core.findDestination)(info, suggestion);

    if (target) {
      var buffer = textEditor.getBuffer();
      var position = buffer.positionForCharacterIndex(target.start);
      textEditor.setCursorBufferPosition(position);
      textEditor.scrollToCursorPosition();

      automaticJump(textEditor, target);
    }
  };

  var followSuggestionPath = function followSuggestionPath(fromFile, suggestion) {
    var blockNotFoundWarning = false;
    var requireIfTrusted = (0, _requireIfTrusted2["default"])(function (isTrusted) {
      if (isTrusted) {
        followSuggestionPath(fromFile, suggestion);
      }

      blockNotFoundWarning = true;
      return function () {
        return undefined;
      };
    });
    var resolveOptions = {
      extensions: atom.config.get("js-hyperclick.extensions"),
      requireIfTrusted: requireIfTrusted
    };
    debug("resolveOptions", resolveOptions);
    var resolved = (0, _core.resolveModule)(fromFile, suggestion, resolveOptions);

    if (blockNotFoundWarning) {
      // Do nothing
    } else if (resolved.type === "url") {
        if (atom.packages.isPackageLoaded("web-browser")) {
          atom.workspace.open(resolved.url);
        } else {
          // flow insisted resolved.url may be undefined here, so I had to
          // switch to a local variable.
          _shell2["default"].openExternal(resolved.url);
        }
      } else if (resolved.type === "file") {
        var filename = resolved.filename;

        if (filename == null) {
          var detail = "module " + suggestion.moduleName + " was not found";
          atom.notifications.addWarning("js-hyperclick", { detail: detail });
          return;
        }

        if (_fs2["default"].existsSync(filename)) {
          filename = _fs2["default"].realpathSync(filename);
        }
        var options = {
          pending: atom.config.get("js-hyperclick.usePendingPanes")
        };
        atom.workspace.open(filename, options).then(function (editor) {
          navigateToSuggestion(editor, suggestion);
        });
      } else {
        // Verify all types have been handled
        ;resolved.type;
      }
  };

  function buildResult(textEditor, range, suggestion) {
    var isAutomaticJump = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    if (!isJavascript(textEditor)) {
      return;
    }
    if (suggestion.range) {
      var buffer = textEditor.getBuffer();

      range = new _atom.Range(
      // I know this works, but flow claims the type s wrong - $FlowFixMe
      buffer.positionForCharacterIndex(suggestion.range.start).toArray(), buffer.positionForCharacterIndex(suggestion.range.end).toArray());
    }

    return {
      range: range,
      callback: function callback() {
        if (!isAutomaticJump) {
          automaticJumpCounter = 0;
        }

        if (suggestion.type === "binding") {
          navigateToSuggestion(textEditor, suggestion);
        } else {
          followSuggestionPath(textEditor.getPath(), suggestion);
        }
      }
    };
  }

  return {
    providerName: "js-hyperclick",
    wordRegExp: /[$0-9\w]+/g,
    priority: atom.config.get("js-hyperclick.priority"),
    getSuggestionForWord: function getSuggestionForWord(textEditor, text, range) {
      if (isJavascript(textEditor)) {
        var info = cache.get(textEditor);
        if (info.parseError) return;

        var buffer = textEditor.getBuffer();
        var start = buffer.characterIndexForPosition(range.start);
        var end = buffer.characterIndexForPosition(range.end);

        var options = {
          jumpToImport: atom.config.get("js-hyperclick.jumpToImport")
        };
        var suggestion = (0, _core.buildSuggestion)(info, text, { start: start, end: end }, options);
        debug(text, suggestion);
        if (suggestion) {
          return buildResult(textEditor, range, suggestion, false);
        }
      }
    }
  };
}

function migrateTrustedResolvers() {
  var key = "js-hyperclick.trustedResolvers";
  var trustedResolvers = atom.config.get(key);
  if (trustedResolvers != null) {
    atom.config.set("js-hyperclick.trustedFiles", trustedResolvers);
    atom.config.set(key, undefined);
  }
}

module.exports = {
  config: {
    extensions: {
      description: "Comma separated list of extensions to check for when a file isn't found",
      type: "array",
      // Default comes from Node's `require.extensions`
      "default": [".js", ".json", ".node"],
      items: { type: "string" }
    },
    usePendingPanes: {
      type: "boolean",
      "default": false
    },
    jumpToImport: {
      type: "boolean",
      "default": false,
      description: "\n        Jump to the import statement instead of leaving the current file.\n        You can still click the import to switch files.\n        ".trim() },
    // if the description starts with whitespace it doesn't display
    skipIntermediate: {
      type: "boolean",
      "default": true,
      title: "Jump through intermediate links",
      description: "\n        When you land at your destination, js-hyperclick checks to see if\n        that is a link and then follows it. This is mostly useful to skip\n        over files that `export ... from './otherfile'`. You will land in\n        `./otherfile` instead of at that export.\n        ".trim()
    },
    priority: {
      type: "number",
      "default": 0,
      title: "hyperclick priority",
      description: "\n        Hyperclick only returns suggestions from a single provider, so this is a\n        workaround for providers to override others. priority defaults to 0.\n        https://atom.io/packages/hyperclick\n        ".trim()
    }
  },
  // This doesn't show up in the settings. Use Edit > Config if you need to
  // change this.
  // trustedFiles: {
  //   type: "array",
  //   items: {
  //     type: "object",
  //     properties: {
  //       hash: { type: "string" },
  //       trusted: { type: "boolean" },
  //     },
  //   },
  //   default: [],
  // },
  activate: function activate() {
    // hyperclick is bundled into nuclide
    if (!atom.packages.isPackageLoaded("hyperclick")) {
      require("atom-package-deps").install("js-hyperclick");
    }
    migrateTrustedResolvers();
    debug("activate");
    this.subscriptions = new _atom.CompositeDisposable();
  },
  getProvider: function getProvider() {
    return makeProvider(this.subscriptions);
  },
  deactivate: function deactivate() {
    debug("deactivate");
    this.subscriptions.dispose();
  }
};

global.jsHyperclick = module.exports;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvanMtaHlwZXJjbGljay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3FCQUt3QixPQUFPOzs7O29CQUVLLE1BQU07O3FCQUV4QixPQUFPOzs7O3lCQUNILGNBQWM7Ozs7b0JBQzRCLFFBQVE7O2tCQUN6RCxJQUFJOzs7O2dDQUNLLHNCQUFzQjs7OztBQWI5QyxXQUFXLENBQUE7O0FBZ0JYLElBQU0sS0FBSyxHQUFHLHdCQUFZLGVBQWUsQ0FBQyxDQUFBOztBQUUxQyxJQUFNLE1BQU0sR0FBRyxDQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFBO0FBQzFFLElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLFVBQVUsRUFBaUI7K0JBQ3pCLFVBQVUsQ0FBQyxVQUFVLEVBQUU7O01BQXJDLFNBQVMsMEJBQVQsU0FBUzs7QUFFakIsTUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNsQyxXQUFPLElBQUksQ0FBQTtHQUNaO0FBQ0QsT0FBSyxDQUFDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLFNBQU8sS0FBSyxDQUFBO0NBQ2IsQ0FBQTs7QUFFRCxTQUFTLFlBQVksQ0FBQyxhQUFhLEVBQUU7QUFDbkMsTUFBTSxLQUFLLEdBQUcsNEJBQVUsYUFBYSxDQUFDLENBQUE7QUFDdEMsTUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUE7O0FBRTVCLE1BQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxVQUFVLEVBQUUsSUFBYyxFQUFZO1FBQXhCLEtBQUssR0FBUCxJQUFjLENBQVosS0FBSztRQUFFLEdBQUcsR0FBWixJQUFjLENBQUwsR0FBRzs7QUFDN0MsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLEVBQUU7QUFDdEQs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eUIsQ0FBQTtHQUMvQztBQUNELGFBQVcsRUFBQSx1QkFBRztBQUNaLFdBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtHQUN4QztBQUNELFlBQVUsRUFBQSxzQkFBRztBQUNYLFNBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNuQixRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQzdCO0NBQ0YsQ0FBQTs7QUFFRCxNQUFNLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUEiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9qcy1oeXBlcmNsaWNrL2xpYi9qcy1oeXBlcmNsaWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIlxuLypnbG9iYWwgYXRvbSAqL1xuLy8gQGZsb3dcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciB9IGZyb20gXCJhdG9tXCJcbmltcG9ydCB0eXBlIHsgUmFuZ2UsIFJlc29sdmVkIH0gZnJvbSBcIi4vdHlwZXNcIlxuaW1wb3J0IGNyZWF0ZURlYnVnIGZyb20gXCJkZWJ1Z1wiXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiXG5pbXBvcnQgeyBSYW5nZSBhcyBBdG9tUmFuZ2UgfSBmcm9tIFwiYXRvbVwiXG5pbXBvcnQgc2hlbGwgZnJvbSBcInNoZWxsXCJcbmltcG9ydCBtYWtlQ2FjaGUgZnJvbSBcIi4vbWFrZS1jYWNoZVwiXG5pbXBvcnQgeyBidWlsZFN1Z2dlc3Rpb24sIGZpbmREZXN0aW5hdGlvbiwgcmVzb2x2ZU1vZHVsZSB9IGZyb20gXCIuL2NvcmVcIlxuaW1wb3J0IGZzIGZyb20gXCJmc1wiXG5pbXBvcnQgbWFrZVJlcXVpcmUgZnJvbSBcIi4vcmVxdWlyZS1pZi10cnVzdGVkXCJcbmltcG9ydCB0eXBlIHsgUmVxdWlyZSB9IGZyb20gXCIuL3JlcXVpcmUtaWYtdHJ1c3RlZFwiXG5cbmNvbnN0IGRlYnVnID0gY3JlYXRlRGVidWcoXCJqcy1oeXBlcmNsaWNrXCIpXG5cbmNvbnN0IHNjb3BlcyA9IFtcInNvdXJjZS5qc1wiLCBcInNvdXJjZS5qcy5qc3hcIiwgXCJqYXZhc2NyaXB0XCIsIFwic291cmNlLmZsb3dcIl1cbmNvbnN0IGlzSmF2YXNjcmlwdCA9ICh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKSA9PiB7XG4gIGNvbnN0IHsgc2NvcGVOYW1lIH0gPSB0ZXh0RWRpdG9yLmdldEdyYW1tYXIoKVxuXG4gIGlmIChzY29wZXMuaW5kZXhPZihzY29wZU5hbWUpID49IDApIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGRlYnVnKFwiTm90IEphdmFzY3JpcHRcIiwgc2NvcGVOYW1lKVxuICByZXR1cm4gZmFsc2Vcbn1cblxuZnVuY3Rpb24gbWFrZVByb3ZpZGVyKHN1YnNjcmlwdGlvbnMpIHtcbiAgY29uc3QgY2FjaGUgPSBtYWtlQ2FjaGUoc3Vic2NyaXB0aW9ucylcbiAgbGV0IGF1dG9tYXRpY0p1bXBDb3VudGVyID0gMFxuXG4gIGNvbnN0IGF1dG9tYXRpY0p1bXAgPSAodGV4dEVkaXRvciwgeyBzdGFydCwgZW5kIH06IFJhbmdlKSA9PiB7XG4gICAgaWYgKCFhdG9tLmNvbmZpZy5nZXQoXCJqcy1oeXBlcmNsaWNrLnNraXBJbnRlcm1lZGlhdGVcIikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChhdXRvbWF0aWNKdW1wQ291bnRlcisrID4gMTApIHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IGBVbmFibGUgdG8gZmluZCBvcmlnaW46IHRvbyBtYW55IGp1bXBzYFxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJqcy1oeXBlcmNsaWNrXCIsIHsgZGV0YWlsIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXIgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgY29uc3QgbmV4dEluZm8gPSBjYWNoZS5nZXQodGV4dEVkaXRvcilcbiAgICBjb25zdCByYW5nZSA9IG5ldyBBdG9tUmFuZ2UoXG4gICAgICAvLyBJIGtub3cgdGhpcyB3b3JrcywgYnV0IGZsb3cgY2xhaW1zIHRoZSB0eXBlIGlzIHdyb25nIC0gJEZsb3dGaXhNZVxuICAgICAgYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoc3RhcnQpLnRvQXJyYXkoKSxcbiAgICAgIGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KGVuZCkudG9BcnJheSgpLFxuICAgIClcbiAgICBjb25zdCB0ZXh0ID0gYnVmZmVyLmdldFRleHRJblJhbmdlKHJhbmdlKVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGp1bXBUb0ltcG9ydDogYXRvbS5jb25maWcuZ2V0KFwianMtaHlwZXJjbGljay5qdW1wVG9JbXBvcnRcIiksXG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFN1Z2dlc3Rpb24gPSBidWlsZFN1Z2dlc3Rpb24oXG4gICAgICBuZXh0SW5mbyxcbiAgICAgIHRleHQsXG4gICAgICB7IHN0YXJ0LCBlbmQgfSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKVxuXG4gICAgbGV0IHJlc3VsdFxuICAgIGlmIChuZXh0U3VnZ2VzdGlvbikge1xuICAgICAgaWYgKG9wdGlvbnMuanVtcFRvSW1wb3J0ICYmIG5leHRTdWdnZXN0aW9uLnR5cGUgPT09IFwiZnJvbS1pbXBvcnRcIikge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgcmVzdWx0ID0gYnVpbGRSZXN1bHQodGV4dEVkaXRvciwgcmFuZ2UsIG5leHRTdWdnZXN0aW9uLCB0cnVlKVxuICAgIH1cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICByZXN1bHQuY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG5hdmlnYXRlVG9TdWdnZXN0aW9uID0gKHRleHRFZGl0b3IsIHN1Z2dlc3Rpb24pID0+IHtcbiAgICBjb25zdCBpbmZvID0gY2FjaGUuZ2V0KHRleHRFZGl0b3IpXG4gICAgY29uc3QgdGFyZ2V0ID0gZmluZERlc3RpbmF0aW9uKGluZm8sIHN1Z2dlc3Rpb24pXG5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICBjb25zdCBidWZmZXIgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHRhcmdldC5zdGFydClcbiAgICAgIHRleHRFZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24pXG4gICAgICB0ZXh0RWRpdG9yLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oKVxuXG4gICAgICBhdXRvbWF0aWNKdW1wKHRleHRFZGl0b3IsIHRhcmdldClcbiAgICB9XG4gIH1cblxuICBjb25zdCBmb2xsb3dTdWdnZXN0aW9uUGF0aCA9IChmcm9tRmlsZSwgc3VnZ2VzdGlvbikgPT4ge1xuICAgIGxldCBibG9ja05vdEZvdW5kV2FybmluZyA9IGZhbHNlXG4gICAgY29uc3QgcmVxdWlyZUlmVHJ1c3RlZDogUmVxdWlyZTwoKSA9PiA/UmVzb2x2ZWQ+ID0gbWFrZVJlcXVpcmUoXG4gICAgICBpc1RydXN0ZWQgPT4ge1xuICAgICAgICBpZiAoaXNUcnVzdGVkKSB7XG4gICAgICAgICAgZm9sbG93U3VnZ2VzdGlvblBhdGgoZnJvbUZpbGUsIHN1Z2dlc3Rpb24pXG4gICAgICAgIH1cblxuICAgICAgICBibG9ja05vdEZvdW5kV2FybmluZyA9IHRydWVcbiAgICAgICAgcmV0dXJuICgpID0+IHVuZGVmaW5lZFxuICAgICAgfSxcbiAgICApXG4gICAgY29uc3QgcmVzb2x2ZU9wdGlvbnMgPSB7XG4gICAgICBleHRlbnNpb25zOiBhdG9tLmNvbmZpZy5nZXQoXCJqcy1oeXBlcmNsaWNrLmV4dGVuc2lvbnNcIiksXG4gICAgICByZXF1aXJlSWZUcnVzdGVkLFxuICAgIH1cbiAgICBkZWJ1ZyhcInJlc29sdmVPcHRpb25zXCIsIHJlc29sdmVPcHRpb25zKVxuICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZU1vZHVsZShmcm9tRmlsZSwgc3VnZ2VzdGlvbiwgcmVzb2x2ZU9wdGlvbnMpXG5cbiAgICBpZiAoYmxvY2tOb3RGb3VuZFdhcm5pbmcpIHtcbiAgICAgIC8vIERvIG5vdGhpbmdcbiAgICB9IGVsc2UgaWYgKHJlc29sdmVkLnR5cGUgPT09IFwidXJsXCIpIHtcbiAgICAgIGlmIChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZChcIndlYi1icm93c2VyXCIpKSB7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ocmVzb2x2ZWQudXJsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZmxvdyBpbnNpc3RlZCByZXNvbHZlZC51cmwgbWF5IGJlIHVuZGVmaW5lZCBoZXJlLCBzbyBJIGhhZCB0b1xuICAgICAgICAvLyBzd2l0Y2ggdG8gYSBsb2NhbCB2YXJpYWJsZS5cbiAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKHJlc29sdmVkLnVybClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlc29sdmVkLnR5cGUgPT09IFwiZmlsZVwiKSB7XG4gICAgICBsZXQgZmlsZW5hbWUgPSByZXNvbHZlZC5maWxlbmFtZVxuXG4gICAgICBpZiAoZmlsZW5hbWUgPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBkZXRhaWwgPSBgbW9kdWxlICR7c3VnZ2VzdGlvbi5tb2R1bGVOYW1lfSB3YXMgbm90IGZvdW5kYFxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcImpzLWh5cGVyY2xpY2tcIiwgeyBkZXRhaWwgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVuYW1lKSkge1xuICAgICAgICBmaWxlbmFtZSA9IGZzLnJlYWxwYXRoU3luYyhmaWxlbmFtZSlcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIHBlbmRpbmc6IGF0b20uY29uZmlnLmdldChcImpzLWh5cGVyY2xpY2sudXNlUGVuZGluZ1BhbmVzXCIpLFxuICAgICAgfVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlbmFtZSwgb3B0aW9ucykudGhlbihlZGl0b3IgPT4ge1xuICAgICAgICBuYXZpZ2F0ZVRvU3VnZ2VzdGlvbihlZGl0b3IsIHN1Z2dlc3Rpb24pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBWZXJpZnkgYWxsIHR5cGVzIGhhdmUgYmVlbiBoYW5kbGVkXG4gICAgICA7KHJlc29sdmVkLnR5cGU6IGVtcHR5KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkUmVzdWx0KHRleHRFZGl0b3IsIHJhbmdlLCBzdWdnZXN0aW9uLCBpc0F1dG9tYXRpY0p1bXAgPSB0cnVlKSB7XG4gICAgaWYgKCFpc0phdmFzY3JpcHQodGV4dEVkaXRvcikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoc3VnZ2VzdGlvbi5yYW5nZSkge1xuICAgICAgY29uc3QgYnVmZmVyID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKVxuXG4gICAgICByYW5nZSA9IG5ldyBBdG9tUmFuZ2UoXG4gICAgICAgIC8vIEkga25vdyB0aGlzIHdvcmtzLCBidXQgZmxvdyBjbGFpbXMgdGhlIHR5cGUgcyB3cm9uZyAtICRGbG93Rml4TWVcbiAgICAgICAgYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoc3VnZ2VzdGlvbi5yYW5nZS5zdGFydCkudG9BcnJheSgpLFxuICAgICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChzdWdnZXN0aW9uLnJhbmdlLmVuZCkudG9BcnJheSgpLFxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICByYW5nZSxcbiAgICAgIGNhbGxiYWNrKCkge1xuICAgICAgICBpZiAoIWlzQXV0b21hdGljSnVtcCkge1xuICAgICAgICAgIGF1dG9tYXRpY0p1bXBDb3VudGVyID0gMFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN1Z2dlc3Rpb24udHlwZSA9PT0gXCJiaW5kaW5nXCIpIHtcbiAgICAgICAgICBuYXZpZ2F0ZVRvU3VnZ2VzdGlvbih0ZXh0RWRpdG9yLCBzdWdnZXN0aW9uKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvbGxvd1N1Z2dlc3Rpb25QYXRoKHRleHRFZGl0b3IuZ2V0UGF0aCgpLCBzdWdnZXN0aW9uKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcHJvdmlkZXJOYW1lOiBcImpzLWh5cGVyY2xpY2tcIixcbiAgICB3b3JkUmVnRXhwOiAvWyQwLTlcXHddKy9nLFxuICAgIHByaW9yaXR5OiBhdG9tLmNvbmZpZy5nZXQoXCJqcy1oeXBlcmNsaWNrLnByaW9yaXR5XCIpLFxuICAgIGdldFN1Z2dlc3Rpb25Gb3JXb3JkKFxuICAgICAgdGV4dEVkaXRvcjogVGV4dEVkaXRvcixcbiAgICAgIHRleHQ6IHN0cmluZyxcbiAgICAgIHJhbmdlOiBBdG9tUmFuZ2UsXG4gICAgKSB7XG4gICAgICBpZiAoaXNKYXZhc2NyaXB0KHRleHRFZGl0b3IpKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSBjYWNoZS5nZXQodGV4dEVkaXRvcilcbiAgICAgICAgaWYgKGluZm8ucGFyc2VFcnJvcikgcmV0dXJuXG5cbiAgICAgICAgY29uc3QgYnVmZmVyID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgICBjb25zdCBzdGFydCA9IGJ1ZmZlci5jaGFyYWN0ZXJJbmRleEZvclBvc2l0aW9uKHJhbmdlLnN0YXJ0KVxuICAgICAgICBjb25zdCBlbmQgPSBidWZmZXIuY2hhcmFjdGVySW5kZXhGb3JQb3NpdGlvbihyYW5nZS5lbmQpXG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICBqdW1wVG9JbXBvcnQ6IGF0b20uY29uZmlnLmdldChcImpzLWh5cGVyY2xpY2suanVtcFRvSW1wb3J0XCIpLFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1Z2dlc3Rpb24gPSBidWlsZFN1Z2dlc3Rpb24oaW5mbywgdGV4dCwgeyBzdGFydCwgZW5kIH0sIG9wdGlvbnMpXG4gICAgICAgIGRlYnVnKHRleHQsIHN1Z2dlc3Rpb24pXG4gICAgICAgIGlmIChzdWdnZXN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIGJ1aWxkUmVzdWx0KHRleHRFZGl0b3IsIHJhbmdlLCBzdWdnZXN0aW9uLCBmYWxzZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gIH1cbn1cblxuZnVuY3Rpb24gbWlncmF0ZVRydXN0ZWRSZXNvbHZlcnMoKSB7XG4gIGNvbnN0IGtleSA9IGBqcy1oeXBlcmNsaWNrLnRydXN0ZWRSZXNvbHZlcnNgXG4gIGNvbnN0IHRydXN0ZWRSZXNvbHZlcnMgPSBhdG9tLmNvbmZpZy5nZXQoa2V5KVxuICBpZiAodHJ1c3RlZFJlc29sdmVycyAhPSBudWxsKSB7XG4gICAgYXRvbS5jb25maWcuc2V0KFwianMtaHlwZXJjbGljay50cnVzdGVkRmlsZXNcIiwgdHJ1c3RlZFJlc29sdmVycylcbiAgICBhdG9tLmNvbmZpZy5zZXQoa2V5LCB1bmRlZmluZWQpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbmZpZzoge1xuICAgIGV4dGVuc2lvbnM6IHtcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIkNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIGV4dGVuc2lvbnMgdG8gY2hlY2sgZm9yIHdoZW4gYSBmaWxlIGlzbid0IGZvdW5kXCIsXG4gICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAvLyBEZWZhdWx0IGNvbWVzIGZyb20gTm9kZSdzIGByZXF1aXJlLmV4dGVuc2lvbnNgXG4gICAgICBkZWZhdWx0OiBbXCIuanNcIiwgXCIuanNvblwiLCBcIi5ub2RlXCJdLFxuICAgICAgaXRlbXM6IHsgdHlwZTogXCJzdHJpbmdcIiB9LFxuICAgIH0sXG4gICAgdXNlUGVuZGluZ1BhbmVzOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAganVtcFRvSW1wb3J0OiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246IGBcbiAgICAgICAgSnVtcCB0byB0aGUgaW1wb3J0IHN0YXRlbWVudCBpbnN0ZWFkIG9mIGxlYXZpbmcgdGhlIGN1cnJlbnQgZmlsZS5cbiAgICAgICAgWW91IGNhbiBzdGlsbCBjbGljayB0aGUgaW1wb3J0IHRvIHN3aXRjaCBmaWxlcy5cbiAgICAgICAgYC50cmltKCksIC8vIGlmIHRoZSBkZXNjcmlwdGlvbiBzdGFydHMgd2l0aCB3aGl0ZXNwYWNlIGl0IGRvZXNuJ3QgZGlzcGxheVxuICAgIH0sXG4gICAgc2tpcEludGVybWVkaWF0ZToge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgdGl0bGU6IGBKdW1wIHRocm91Z2ggaW50ZXJtZWRpYXRlIGxpbmtzYCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgXG4gICAgICAgIFdoZW4geW91IGxhbmQgYXQgeW91ciBkZXN0aW5hdGlvbiwganMtaHlwZXJjbGljayBjaGVja3MgdG8gc2VlIGlmXG4gICAgICAgIHRoYXQgaXMgYSBsaW5rIGFuZCB0aGVuIGZvbGxvd3MgaXQuIFRoaXMgaXMgbW9zdGx5IHVzZWZ1bCB0byBza2lwXG4gICAgICAgIG92ZXIgZmlsZXMgdGhhdCBcXGBleHBvcnQgLi4uIGZyb20gJy4vb3RoZXJmaWxlJ1xcYC4gWW91IHdpbGwgbGFuZCBpblxuICAgICAgICBcXGAuL290aGVyZmlsZVxcYCBpbnN0ZWFkIG9mIGF0IHRoYXQgZXhwb3J0LlxuICAgICAgICBgLnRyaW0oKSxcbiAgICB9LFxuICAgIHByaW9yaXR5OiB7XG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICAgIHRpdGxlOiBgaHlwZXJjbGljayBwcmlvcml0eWAsXG4gICAgICBkZXNjcmlwdGlvbjogYFxuICAgICAgICBIeXBlcmNsaWNrIG9ubHkgcmV0dXJucyBzdWdnZXN0aW9ucyBmcm9tIGEgc2luZ2xlIHByb3ZpZGVyLCBzbyB0aGlzIGlzIGFcbiAgICAgICAgd29ya2Fyb3VuZCBmb3IgcHJvdmlkZXJzIHRvIG92ZXJyaWRlIG90aGVycy4gcHJpb3JpdHkgZGVmYXVsdHMgdG8gMC5cbiAgICAgICAgaHR0cHM6Ly9hdG9tLmlvL3BhY2thZ2VzL2h5cGVyY2xpY2tcbiAgICAgICAgYC50cmltKCksXG4gICAgfSxcbiAgICAvLyBUaGlzIGRvZXNuJ3Qgc2hvdyB1cCBpbiB0aGUgc2V0dGluZ3MuIFVzZSBFZGl0ID4gQ29uZmlnIGlmIHlvdSBuZWVkIHRvXG4gICAgLy8gY2hhbmdlIHRoaXMuXG4gICAgLy8gdHJ1c3RlZEZpbGVzOiB7XG4gICAgLy8gICB0eXBlOiBcImFycmF5XCIsXG4gICAgLy8gICBpdGVtczoge1xuICAgIC8vICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgIC8vICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gICAgICAgaGFzaDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgLy8gICAgICAgdHJ1c3RlZDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgIC8vICAgICB9LFxuICAgIC8vICAgfSxcbiAgICAvLyAgIGRlZmF1bHQ6IFtdLFxuICAgIC8vIH0sXG4gIH0sXG4gIGFjdGl2YXRlKCkge1xuICAgIC8vIGh5cGVyY2xpY2sgaXMgYnVuZGxlZCBpbnRvIG51Y2xpZGVcbiAgICBpZiAoIWF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKFwiaHlwZXJjbGlja1wiKSkge1xuICAgICAgcmVxdWlyZShcImF0b20tcGFja2FnZS1kZXBzXCIpLmluc3RhbGwoXCJqcy1oeXBlcmNsaWNrXCIpXG4gICAgfVxuICAgIG1pZ3JhdGVUcnVzdGVkUmVzb2x2ZXJzKClcbiAgICBkZWJ1ZyhcImFjdGl2YXRlXCIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICB9LFxuICBnZXRQcm92aWRlcigpIHtcbiAgICByZXR1cm4gbWFrZVByb3ZpZGVyKHRoaXMuc3Vic2NyaXB0aW9ucylcbiAgfSxcbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBkZWJ1ZyhcImRlYWN0aXZhdGVcIilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH0sXG59XG5cbmdsb2JhbC5qc0h5cGVyY2xpY2sgPSBtb2R1bGUuZXhwb3J0c1xuIl19