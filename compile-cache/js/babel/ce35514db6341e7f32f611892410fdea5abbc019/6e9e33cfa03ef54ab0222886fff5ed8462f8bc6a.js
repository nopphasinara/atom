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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvanMtaHlwZXJjbGljay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3FCQUt3QixPQUFPOzs7O29CQUVLLE1BQU07O3FCQUV4QixPQUFPOzs7O3lCQUNILGNBQWM7Ozs7b0JBQzRCLFFBQVE7O2tCQUN6RCxJQUFJOzs7O2dDQUNLLHNCQUFzQjs7OztBQWI5QyxXQUFXLENBQUE7O0FBZ0JYLElBQU0sS0FBSyxHQUFHLHdCQUFZLGVBQWUsQ0FBQyxDQUFBOztBQUUxQyxJQUFNLE1BQU0sR0FBRyxDQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFBO0FBQzFFLElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLFVBQVUsRUFBaUI7K0JBQ3pCLFVBQVUsQ0FBQyxVQUFVLEVBQUU7O01BQXJDLFNBQVMsMEJBQVQsU0FBUzs7QUFFakIsTUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUNsQyxXQUFPLElBQUksQ0FBQTtHQUNaO0FBQ0QsT0FBSyxDQUFDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLFNBQU8sS0FBSyxDQUFBO0NBQ2IsQ0FBQTs7QUFFRCxTQUFTLFlBQVksQ0FBQyxhQUFhLEVBQUU7QUFDbkMsTUFBTSxLQUFLLEdBQUcsNEJBQVUsYUFBYSxDQUFDLENBQUE7QUFDdEMsTUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUE7O0FBRTVCLE1BQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxVQUFVLEVBQUUsSUFBYyxFQUFZO1FBQXhCLEtBQUssR0FBUCxJQUFjLENBQVosS0FBSztRQUFFLEdBQUcsR0FBWixJQUFjLENBQUwsR0FBRzs7QUFDN0MsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLEVBQUU7QUFDdEQsYUFBTTtLQUNQOztBQUVELFFBQUksb0JBQW9CLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDL0IsVUFBTSxNQUFNLDBDQUEwQyxDQUFBO0FBQ3RELFVBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQzFELGFBQU07S0FDUDs7QUFFRCxRQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDckMsUUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUN0QyxRQUFNLEtBQUssR0FBRzs7QUFFWixVQUFNLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQ2pELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FDaEQsQ0FBQTtBQUNELFFBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7O0FBRXpDLFFBQU0sT0FBTyxHQUFHO0FBQ2Qsa0JBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQztLQUM1RCxDQUFBOztBQUVELFFBQU0sY0FBYyxHQUFHLDJCQUNyQixRQUFRLEVBQ1IsSUFBSSxFQUNKLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLEVBQ2QsT0FBTyxDQUNSLENBQUE7O0FBRUQsUUFBSSxNQUFNLFlBQUEsQ0FBQTtBQUNWLFFBQUksY0FBYyxFQUFFO0FBQ2xCLFVBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxjQUFjLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBRTtBQUNqRSxlQUFNO09BQ1A7O0FBRUQsWUFBTSxHQUFHLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUM5RDtBQUNELFFBQUksTUFBTSxFQUFFO0FBQ1YsWUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBO0tBQ2xCO0dBQ0YsQ0FBQTs7QUFFRCxNQUFNLG9CQUFvQixHQUFHLFNBQXZCLG9CQUFvQixDQUFJLFVBQVUsRUFBRSxVQUFVLEVBQUs7QUFDdkQsUUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNsQyxRQUFNLE1BQU0sR0FBRywyQkFBZ0IsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFBOztBQUVoRCxRQUFJLE1BQU0sRUFBRTtBQUNWLFVBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUNyQyxVQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQy9ELGdCQUFVLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDNUMsZ0JBQVUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFBOztBQUVuQyxtQkFBYSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtLQUNsQztHQUNGLENBQUE7O0FBRUQsTUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBb0IsQ0FBSSxRQUFRLEVBQUUsVUFBVSxFQUFLO0FBQ3JELFFBQUksb0JBQW9CLEdBQUcsS0FBSyxDQUFBO0FBQ2hDLFFBQU0sZ0JBQTBDLEdBQUcsbUNBQ2pELFVBQUEsU0FBUyxFQUFJO0FBQ1gsVUFBSSxTQUFTLEVBQUU7QUFDYiw0QkFBb0IsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUE7T0FDM0M7O0FBRUQsMEJBQW9CLEdBQUcsSUFBSSxDQUFBO0FBQzNCLGFBQU87ZUFBTSxTQUFTO09BQUEsQ0FBQTtLQUN2QixDQUNGLENBQUE7QUFDRCxRQUFNLGNBQWMsR0FBRztBQUNyQixnQkFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDO0FBQ3ZELHNCQUFnQixFQUFoQixnQkFBZ0I7S0FDakIsQ0FBQTtBQUNELFNBQUssQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsQ0FBQTtBQUN2QyxRQUFNLFFBQVEsR0FBRyx5QkFBYyxRQUFRLEVBQUUsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFBOztBQUVwRSxRQUFJLG9CQUFvQixFQUFFOztLQUV6QixNQUFNLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7QUFDbEMsWUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUNoRCxjQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDbEMsTUFBTTs7O0FBR0wsNkJBQU0sWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUNqQztPQUNGLE1BQU0sSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtBQUNuQyxZQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFBOztBQUVoQyxZQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7QUFDcEIsY0FBTSxNQUFNLGVBQWEsVUFBVSxDQUFDLFVBQVUsbUJBQWdCLENBQUE7QUFDOUQsY0FBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDMUQsaUJBQU07U0FDUDs7QUFFRCxZQUFJLGdCQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMzQixrQkFBUSxHQUFHLGdCQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUNyQztBQUNELFlBQU0sT0FBTyxHQUFHO0FBQ2QsaUJBQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQztTQUMxRCxDQUFBO0FBQ0QsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUNwRCw4QkFBb0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUE7U0FDekMsQ0FBQyxDQUFBO09BQ0gsTUFBTTs7QUFFTCxTQUFDLEFBQUMsUUFBUSxDQUFDLElBQUksQ0FBUTtPQUN4QjtHQUNGLENBQUE7O0FBRUQsV0FBUyxXQUFXLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQTBCO1FBQXhCLGVBQWUseURBQUcsSUFBSTs7QUFDeEUsUUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUM3QixhQUFNO0tBQ1A7QUFDRCxRQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDcEIsVUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFBOztBQUVyQyxXQUFLLEdBQUc7O0FBRU4sWUFBTSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQ2xFLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUNqRSxDQUFBO0tBQ0Y7O0FBRUQsV0FBTztBQUNMLFdBQUssRUFBTCxLQUFLO0FBQ0wsY0FBUSxFQUFBLG9CQUFHO0FBQ1QsWUFBSSxDQUFDLGVBQWUsRUFBRTtBQUNwQiw4QkFBb0IsR0FBRyxDQUFDLENBQUE7U0FDekI7O0FBRUQsWUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUNqQyw4QkFBb0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUE7U0FDN0MsTUFBTTtBQUNMLDhCQUFvQixDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQTtTQUN2RDtPQUNGO0tBQ0YsQ0FBQTtHQUNGOztBQUVELFNBQU87QUFDTCxnQkFBWSxFQUFFLGVBQWU7QUFDN0IsY0FBVSxFQUFFLFlBQVk7QUFDeEIsd0JBQW9CLEVBQUEsOEJBQ2xCLFVBQXNCLEVBQ3RCLElBQVksRUFDWixLQUFnQixFQUNoQjtBQUNBLFVBQUksWUFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQzVCLFlBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDbEMsWUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU07O0FBRTNCLFlBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUNyQyxZQUFNLEtBQUssR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzNELFlBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRXZELFlBQU0sT0FBTyxHQUFHO0FBQ2Qsc0JBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQztTQUM1RCxDQUFBO0FBQ0QsWUFBTSxVQUFVLEdBQUcsMkJBQWdCLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN2RSxhQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQ3ZCLFlBQUksVUFBVSxFQUFFO0FBQ2QsaUJBQU8sV0FBVyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFBO1NBQ3pEO09BQ0Y7S0FDRjtHQUNGLENBQUE7Q0FDRjs7QUFFRCxTQUFTLHVCQUF1QixHQUFHO0FBQ2pDLE1BQU0sR0FBRyxtQ0FBbUMsQ0FBQTtBQUM1QyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzdDLE1BQUksZ0JBQWdCLElBQUksSUFBSSxFQUFFO0FBQzVCLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLGdCQUFnQixDQUFDLENBQUE7QUFDL0QsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFBO0dBQ2hDO0NBQ0Y7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFFBQU0sRUFBRTtBQUNOLGNBQVUsRUFBRTtBQUNWLGlCQUFXLEVBQ1QseUVBQXlFO0FBQzNFLFVBQUksRUFBRSxPQUFPOztBQUViLGlCQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7QUFDbEMsV0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtLQUMxQjtBQUNELG1CQUFlLEVBQUU7QUFDZixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7S0FDZjtBQUNELGdCQUFZLEVBQUU7QUFDWixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7QUFDZCxpQkFBVyxFQUFFLGlKQUdULElBQUksRUFBRSxFQUNYOztBQUNELG9CQUFnQixFQUFFO0FBQ2hCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsSUFBSTtBQUNiLFdBQUssbUNBQW1DO0FBQ3hDLGlCQUFXLEVBQUUsZ1NBS1QsSUFBSSxFQUFFO0tBQ1g7R0FjRjs7Ozs7Ozs7Ozs7Ozs7QUFDRCxVQUFRLEVBQUEsb0JBQUc7O0FBRVQsUUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQ2hELGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTtLQUN0RDtBQUNELDJCQUF1QixFQUFFLENBQUE7QUFDekIsU0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ2pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7R0FDL0M7QUFDRCxhQUFXLEVBQUEsdUJBQUc7QUFDWixXQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7R0FDeEM7QUFDRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxTQUFLLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDbkIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUM3QjtDQUNGLENBQUE7O0FBRUQsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvanMtaHlwZXJjbGljay5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCJcbi8qZ2xvYmFsIGF0b20gKi9cbi8vIEBmbG93XG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IgfSBmcm9tIFwiYXRvbVwiXG5pbXBvcnQgdHlwZSB7IFJhbmdlLCBSZXNvbHZlZCB9IGZyb20gXCIuL3R5cGVzXCJcbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tIFwiZGVidWdcIlxuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIlxuaW1wb3J0IHsgUmFuZ2UgYXMgQXRvbVJhbmdlIH0gZnJvbSBcImF0b21cIlxuaW1wb3J0IHNoZWxsIGZyb20gXCJzaGVsbFwiXG5pbXBvcnQgbWFrZUNhY2hlIGZyb20gXCIuL21ha2UtY2FjaGVcIlxuaW1wb3J0IHsgYnVpbGRTdWdnZXN0aW9uLCBmaW5kRGVzdGluYXRpb24sIHJlc29sdmVNb2R1bGUgfSBmcm9tIFwiLi9jb3JlXCJcbmltcG9ydCBmcyBmcm9tIFwiZnNcIlxuaW1wb3J0IG1ha2VSZXF1aXJlIGZyb20gXCIuL3JlcXVpcmUtaWYtdHJ1c3RlZFwiXG5pbXBvcnQgdHlwZSB7IFJlcXVpcmUgfSBmcm9tIFwiLi9yZXF1aXJlLWlmLXRydXN0ZWRcIlxuXG5jb25zdCBkZWJ1ZyA9IGNyZWF0ZURlYnVnKFwianMtaHlwZXJjbGlja1wiKVxuXG5jb25zdCBzY29wZXMgPSBbXCJzb3VyY2UuanNcIiwgXCJzb3VyY2UuanMuanN4XCIsIFwiamF2YXNjcmlwdFwiLCBcInNvdXJjZS5mbG93XCJdXG5jb25zdCBpc0phdmFzY3JpcHQgPSAodGV4dEVkaXRvcjogVGV4dEVkaXRvcikgPT4ge1xuICBjb25zdCB7IHNjb3BlTmFtZSB9ID0gdGV4dEVkaXRvci5nZXRHcmFtbWFyKClcblxuICBpZiAoc2NvcGVzLmluZGV4T2Yoc2NvcGVOYW1lKSA+PSAwKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBkZWJ1ZyhcIk5vdCBKYXZhc2NyaXB0XCIsIHNjb3BlTmFtZSlcbiAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIG1ha2VQcm92aWRlcihzdWJzY3JpcHRpb25zKSB7XG4gIGNvbnN0IGNhY2hlID0gbWFrZUNhY2hlKHN1YnNjcmlwdGlvbnMpXG4gIGxldCBhdXRvbWF0aWNKdW1wQ291bnRlciA9IDBcblxuICBjb25zdCBhdXRvbWF0aWNKdW1wID0gKHRleHRFZGl0b3IsIHsgc3RhcnQsIGVuZCB9OiBSYW5nZSkgPT4ge1xuICAgIGlmICghYXRvbS5jb25maWcuZ2V0KFwianMtaHlwZXJjbGljay5za2lwSW50ZXJtZWRpYXRlXCIpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoYXV0b21hdGljSnVtcENvdW50ZXIrKyA+IDEwKSB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBgVW5hYmxlIHRvIGZpbmQgb3JpZ2luOiB0b28gbWFueSBqdW1wc2BcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFwianMtaHlwZXJjbGlja1wiLCB7IGRldGFpbCB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGNvbnN0IG5leHRJbmZvID0gY2FjaGUuZ2V0KHRleHRFZGl0b3IpXG4gICAgY29uc3QgcmFuZ2UgPSBuZXcgQXRvbVJhbmdlKFxuICAgICAgLy8gSSBrbm93IHRoaXMgd29ya3MsIGJ1dCBmbG93IGNsYWltcyB0aGUgdHlwZSBpcyB3cm9uZyAtICRGbG93Rml4TWVcbiAgICAgIGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHN0YXJ0KS50b0FycmF5KCksXG4gICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChlbmQpLnRvQXJyYXkoKSxcbiAgICApXG4gICAgY29uc3QgdGV4dCA9IGJ1ZmZlci5nZXRUZXh0SW5SYW5nZShyYW5nZSlcblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBqdW1wVG9JbXBvcnQ6IGF0b20uY29uZmlnLmdldChcImpzLWh5cGVyY2xpY2suanVtcFRvSW1wb3J0XCIpLFxuICAgIH1cblxuICAgIGNvbnN0IG5leHRTdWdnZXN0aW9uID0gYnVpbGRTdWdnZXN0aW9uKFxuICAgICAgbmV4dEluZm8sXG4gICAgICB0ZXh0LFxuICAgICAgeyBzdGFydCwgZW5kIH0sXG4gICAgICBvcHRpb25zLFxuICAgIClcblxuICAgIGxldCByZXN1bHRcbiAgICBpZiAobmV4dFN1Z2dlc3Rpb24pIHtcbiAgICAgIGlmIChvcHRpb25zLmp1bXBUb0ltcG9ydCAmJiBuZXh0U3VnZ2VzdGlvbi50eXBlID09PSBcImZyb20taW1wb3J0XCIpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdCA9IGJ1aWxkUmVzdWx0KHRleHRFZGl0b3IsIHJhbmdlLCBuZXh0U3VnZ2VzdGlvbiwgdHJ1ZSlcbiAgICB9XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgcmVzdWx0LmNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICBjb25zdCBuYXZpZ2F0ZVRvU3VnZ2VzdGlvbiA9ICh0ZXh0RWRpdG9yLCBzdWdnZXN0aW9uKSA9PiB7XG4gICAgY29uc3QgaW5mbyA9IGNhY2hlLmdldCh0ZXh0RWRpdG9yKVxuICAgIGNvbnN0IHRhcmdldCA9IGZpbmREZXN0aW5hdGlvbihpbmZvLCBzdWdnZXN0aW9uKVxuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgY29uc3QgYnVmZmVyID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgY29uc3QgcG9zaXRpb24gPSBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleCh0YXJnZXQuc3RhcnQpXG4gICAgICB0ZXh0RWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgdGV4dEVkaXRvci5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKClcblxuICAgICAgYXV0b21hdGljSnVtcCh0ZXh0RWRpdG9yLCB0YXJnZXQpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgZm9sbG93U3VnZ2VzdGlvblBhdGggPSAoZnJvbUZpbGUsIHN1Z2dlc3Rpb24pID0+IHtcbiAgICBsZXQgYmxvY2tOb3RGb3VuZFdhcm5pbmcgPSBmYWxzZVxuICAgIGNvbnN0IHJlcXVpcmVJZlRydXN0ZWQ6IFJlcXVpcmU8KCkgPT4gP1Jlc29sdmVkPiA9IG1ha2VSZXF1aXJlKFxuICAgICAgaXNUcnVzdGVkID0+IHtcbiAgICAgICAgaWYgKGlzVHJ1c3RlZCkge1xuICAgICAgICAgIGZvbGxvd1N1Z2dlc3Rpb25QYXRoKGZyb21GaWxlLCBzdWdnZXN0aW9uKVxuICAgICAgICB9XG5cbiAgICAgICAgYmxvY2tOb3RGb3VuZFdhcm5pbmcgPSB0cnVlXG4gICAgICAgIHJldHVybiAoKSA9PiB1bmRlZmluZWRcbiAgICAgIH0sXG4gICAgKVxuICAgIGNvbnN0IHJlc29sdmVPcHRpb25zID0ge1xuICAgICAgZXh0ZW5zaW9uczogYXRvbS5jb25maWcuZ2V0KFwianMtaHlwZXJjbGljay5leHRlbnNpb25zXCIpLFxuICAgICAgcmVxdWlyZUlmVHJ1c3RlZCxcbiAgICB9XG4gICAgZGVidWcoXCJyZXNvbHZlT3B0aW9uc1wiLCByZXNvbHZlT3B0aW9ucylcbiAgICBjb25zdCByZXNvbHZlZCA9IHJlc29sdmVNb2R1bGUoZnJvbUZpbGUsIHN1Z2dlc3Rpb24sIHJlc29sdmVPcHRpb25zKVxuXG4gICAgaWYgKGJsb2NrTm90Rm91bmRXYXJuaW5nKSB7XG4gICAgICAvLyBEbyBub3RoaW5nXG4gICAgfSBlbHNlIGlmIChyZXNvbHZlZC50eXBlID09PSBcInVybFwiKSB7XG4gICAgICBpZiAoYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoXCJ3ZWItYnJvd3NlclwiKSkge1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHJlc29sdmVkLnVybClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGZsb3cgaW5zaXN0ZWQgcmVzb2x2ZWQudXJsIG1heSBiZSB1bmRlZmluZWQgaGVyZSwgc28gSSBoYWQgdG9cbiAgICAgICAgLy8gc3dpdGNoIHRvIGEgbG9jYWwgdmFyaWFibGUuXG4gICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbChyZXNvbHZlZC51cmwpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZXNvbHZlZC50eXBlID09PSBcImZpbGVcIikge1xuICAgICAgbGV0IGZpbGVuYW1lID0gcmVzb2x2ZWQuZmlsZW5hbWVcblxuICAgICAgaWYgKGZpbGVuYW1lID09IG51bGwpIHtcbiAgICAgICAgY29uc3QgZGV0YWlsID0gYG1vZHVsZSAke3N1Z2dlc3Rpb24ubW9kdWxlTmFtZX0gd2FzIG5vdCBmb3VuZGBcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJqcy1oeXBlcmNsaWNrXCIsIHsgZGV0YWlsIH0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlbmFtZSkpIHtcbiAgICAgICAgZmlsZW5hbWUgPSBmcy5yZWFscGF0aFN5bmMoZmlsZW5hbWUpXG4gICAgICB9XG4gICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICBwZW5kaW5nOiBhdG9tLmNvbmZpZy5nZXQoXCJqcy1oeXBlcmNsaWNrLnVzZVBlbmRpbmdQYW5lc1wiKSxcbiAgICAgIH1cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZW5hbWUsIG9wdGlvbnMpLnRoZW4oZWRpdG9yID0+IHtcbiAgICAgICAgbmF2aWdhdGVUb1N1Z2dlc3Rpb24oZWRpdG9yLCBzdWdnZXN0aW9uKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVmVyaWZ5IGFsbCB0eXBlcyBoYXZlIGJlZW4gaGFuZGxlZFxuICAgICAgOyhyZXNvbHZlZC50eXBlOiBlbXB0eSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFJlc3VsdCh0ZXh0RWRpdG9yLCByYW5nZSwgc3VnZ2VzdGlvbiwgaXNBdXRvbWF0aWNKdW1wID0gdHJ1ZSkge1xuICAgIGlmICghaXNKYXZhc2NyaXB0KHRleHRFZGl0b3IpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHN1Z2dlc3Rpb24ucmFuZ2UpIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKClcblxuICAgICAgcmFuZ2UgPSBuZXcgQXRvbVJhbmdlKFxuICAgICAgICAvLyBJIGtub3cgdGhpcyB3b3JrcywgYnV0IGZsb3cgY2xhaW1zIHRoZSB0eXBlIHMgd3JvbmcgLSAkRmxvd0ZpeE1lXG4gICAgICAgIGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHN1Z2dlc3Rpb24ucmFuZ2Uuc3RhcnQpLnRvQXJyYXkoKSxcbiAgICAgICAgYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoc3VnZ2VzdGlvbi5yYW5nZS5lbmQpLnRvQXJyYXkoKSxcbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmFuZ2UsXG4gICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgaWYgKCFpc0F1dG9tYXRpY0p1bXApIHtcbiAgICAgICAgICBhdXRvbWF0aWNKdW1wQ291bnRlciA9IDBcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdWdnZXN0aW9uLnR5cGUgPT09IFwiYmluZGluZ1wiKSB7XG4gICAgICAgICAgbmF2aWdhdGVUb1N1Z2dlc3Rpb24odGV4dEVkaXRvciwgc3VnZ2VzdGlvbilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb2xsb3dTdWdnZXN0aW9uUGF0aCh0ZXh0RWRpdG9yLmdldFBhdGgoKSwgc3VnZ2VzdGlvbilcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHByb3ZpZGVyTmFtZTogXCJqcy1oeXBlcmNsaWNrXCIsXG4gICAgd29yZFJlZ0V4cDogL1skMC05XFx3XSsvZyxcbiAgICBnZXRTdWdnZXN0aW9uRm9yV29yZChcbiAgICAgIHRleHRFZGl0b3I6IFRleHRFZGl0b3IsXG4gICAgICB0ZXh0OiBzdHJpbmcsXG4gICAgICByYW5nZTogQXRvbVJhbmdlLFxuICAgICkge1xuICAgICAgaWYgKGlzSmF2YXNjcmlwdCh0ZXh0RWRpdG9yKSkge1xuICAgICAgICBjb25zdCBpbmZvID0gY2FjaGUuZ2V0KHRleHRFZGl0b3IpXG4gICAgICAgIGlmIChpbmZvLnBhcnNlRXJyb3IpIHJldHVyblxuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBidWZmZXIuY2hhcmFjdGVySW5kZXhGb3JQb3NpdGlvbihyYW5nZS5zdGFydClcbiAgICAgICAgY29uc3QgZW5kID0gYnVmZmVyLmNoYXJhY3RlckluZGV4Rm9yUG9zaXRpb24ocmFuZ2UuZW5kKVxuXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAganVtcFRvSW1wb3J0OiBhdG9tLmNvbmZpZy5nZXQoXCJqcy1oeXBlcmNsaWNrLmp1bXBUb0ltcG9ydFwiKSxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdWdnZXN0aW9uID0gYnVpbGRTdWdnZXN0aW9uKGluZm8sIHRleHQsIHsgc3RhcnQsIGVuZCB9LCBvcHRpb25zKVxuICAgICAgICBkZWJ1Zyh0ZXh0LCBzdWdnZXN0aW9uKVxuICAgICAgICBpZiAoc3VnZ2VzdGlvbikge1xuICAgICAgICAgIHJldHVybiBidWlsZFJlc3VsdCh0ZXh0RWRpdG9yLCByYW5nZSwgc3VnZ2VzdGlvbiwgZmFsc2UpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICB9XG59XG5cbmZ1bmN0aW9uIG1pZ3JhdGVUcnVzdGVkUmVzb2x2ZXJzKCkge1xuICBjb25zdCBrZXkgPSBganMtaHlwZXJjbGljay50cnVzdGVkUmVzb2x2ZXJzYFxuICBjb25zdCB0cnVzdGVkUmVzb2x2ZXJzID0gYXRvbS5jb25maWcuZ2V0KGtleSlcbiAgaWYgKHRydXN0ZWRSZXNvbHZlcnMgIT0gbnVsbCkge1xuICAgIGF0b20uY29uZmlnLnNldChcImpzLWh5cGVyY2xpY2sudHJ1c3RlZEZpbGVzXCIsIHRydXN0ZWRSZXNvbHZlcnMpXG4gICAgYXRvbS5jb25maWcuc2V0KGtleSwgdW5kZWZpbmVkKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb25maWc6IHtcbiAgICBleHRlbnNpb25zOiB7XG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgXCJDb21tYSBzZXBhcmF0ZWQgbGlzdCBvZiBleHRlbnNpb25zIHRvIGNoZWNrIGZvciB3aGVuIGEgZmlsZSBpc24ndCBmb3VuZFwiLFxuICAgICAgdHlwZTogXCJhcnJheVwiLFxuICAgICAgLy8gRGVmYXVsdCBjb21lcyBmcm9tIE5vZGUncyBgcmVxdWlyZS5leHRlbnNpb25zYFxuICAgICAgZGVmYXVsdDogW1wiLmpzXCIsIFwiLmpzb25cIiwgXCIubm9kZVwiXSxcbiAgICAgIGl0ZW1zOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICB9LFxuICAgIHVzZVBlbmRpbmdQYW5lczoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGp1bXBUb0ltcG9ydDoge1xuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBgXG4gICAgICAgIEp1bXAgdG8gdGhlIGltcG9ydCBzdGF0ZW1lbnQgaW5zdGVhZCBvZiBsZWF2aW5nIHRoZSBjdXJyZW50IGZpbGUuXG4gICAgICAgIFlvdSBjYW4gc3RpbGwgY2xpY2sgdGhlIGltcG9ydCB0byBzd2l0Y2ggZmlsZXMuXG4gICAgICAgIGAudHJpbSgpLCAvLyBpZiB0aGUgZGVzY3JpcHRpb24gc3RhcnRzIHdpdGggd2hpdGVzcGFjZSBpdCBkb2Vzbid0IGRpc3BsYXlcbiAgICB9LFxuICAgIHNraXBJbnRlcm1lZGlhdGU6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIHRpdGxlOiBgSnVtcCB0aHJvdWdoIGludGVybWVkaWF0ZSBsaW5rc2AsXG4gICAgICBkZXNjcmlwdGlvbjogYFxuICAgICAgICBXaGVuIHlvdSBsYW5kIGF0IHlvdXIgZGVzdGluYXRpb24sIGpzLWh5cGVyY2xpY2sgY2hlY2tzIHRvIHNlZSBpZlxuICAgICAgICB0aGF0IGlzIGEgbGluayBhbmQgdGhlbiBmb2xsb3dzIGl0LiBUaGlzIGlzIG1vc3RseSB1c2VmdWwgdG8gc2tpcFxuICAgICAgICBvdmVyIGZpbGVzIHRoYXQgXFxgZXhwb3J0IC4uLiBmcm9tICcuL290aGVyZmlsZSdcXGAuIFlvdSB3aWxsIGxhbmQgaW5cbiAgICAgICAgXFxgLi9vdGhlcmZpbGVcXGAgaW5zdGVhZCBvZiBhdCB0aGF0IGV4cG9ydC5cbiAgICAgICAgYC50cmltKCksXG4gICAgfSxcbiAgICAvLyBUaGlzIGRvZXNuJ3Qgc2hvdyB1cCBpbiB0aGUgc2V0dGluZ3MuIFVzZSBFZGl0ID4gQ29uZmlnIGlmIHlvdSBuZWVkIHRvXG4gICAgLy8gY2hhbmdlIHRoaXMuXG4gICAgLy8gdHJ1c3RlZEZpbGVzOiB7XG4gICAgLy8gICB0eXBlOiBcImFycmF5XCIsXG4gICAgLy8gICBpdGVtczoge1xuICAgIC8vICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgIC8vICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gICAgICAgaGFzaDogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgLy8gICAgICAgdHJ1c3RlZDogeyB0eXBlOiBcImJvb2xlYW5cIiB9LFxuICAgIC8vICAgICB9LFxuICAgIC8vICAgfSxcbiAgICAvLyAgIGRlZmF1bHQ6IFtdLFxuICAgIC8vIH0sXG4gIH0sXG4gIGFjdGl2YXRlKCkge1xuICAgIC8vIGh5cGVyY2xpY2sgaXMgYnVuZGxlZCBpbnRvIG51Y2xpZGVcbiAgICBpZiAoIWF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKFwiaHlwZXJjbGlja1wiKSkge1xuICAgICAgcmVxdWlyZShcImF0b20tcGFja2FnZS1kZXBzXCIpLmluc3RhbGwoXCJqcy1oeXBlcmNsaWNrXCIpXG4gICAgfVxuICAgIG1pZ3JhdGVUcnVzdGVkUmVzb2x2ZXJzKClcbiAgICBkZWJ1ZyhcImFjdGl2YXRlXCIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICB9LFxuICBnZXRQcm92aWRlcigpIHtcbiAgICByZXR1cm4gbWFrZVByb3ZpZGVyKHRoaXMuc3Vic2NyaXB0aW9ucylcbiAgfSxcbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBkZWJ1ZyhcImRlYWN0aXZhdGVcIilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH0sXG59XG5cbmdsb2JhbC5qc0h5cGVyY2xpY2sgPSBtb2R1bGUuZXhwb3J0c1xuIl19