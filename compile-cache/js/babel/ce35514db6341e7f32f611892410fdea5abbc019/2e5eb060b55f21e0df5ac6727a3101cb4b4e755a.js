Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashIncludes = require('lodash/includes');

var _lodashIncludes2 = _interopRequireDefault(_lodashIncludes);

var _lodashTrimStart = require('lodash/trimStart');

var _lodashTrimStart2 = _interopRequireDefault(_lodashTrimStart);

var _tokenizer = require('./tokenizer');

var _structureProvider = require('./structure-provider');

var _utils = require('./utils');

'use babel';

var STRING = _tokenizer.TokenType.STRING;
var END_OBJECT = _tokenizer.TokenType.END_OBJECT;
var END_ARRAY = _tokenizer.TokenType.END_ARRAY;
var COMMA = _tokenizer.TokenType.COMMA;

var RootProvider = (function () {
  function RootProvider() {
    var providers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, RootProvider);

    this.selector = '.source.json';
    this.inclusionPriority = 1;
    this.providers = providers;
  }

  _createClass(RootProvider, [{
    key: 'getSuggestions',
    value: function getSuggestions(originalRequest) {
      var _this = this;

      var editor = originalRequest.editor;
      var bufferPosition = originalRequest.bufferPosition;
      var activatedManually = originalRequest.activatedManually;

      if (!this.checkRequest(originalRequest)) {
        return Promise.resolve([]);
      }

      if (editor.lineTextForBufferRow(bufferPosition.row).charAt(bufferPosition.column - 1) === ',' && !activatedManually) {
        return Promise.resolve([]); // hack, to prevent activation right after inserting a comma
      }

      var providers = this.getMatchingProviders(editor.buffer.file);
      if (providers.length === 0) {
        return Promise.resolve([]); // no provider no proposals
      }
      return (0, _tokenizer.tokenize)(editor.getText()).then(function (tokens) {
        return (0, _structureProvider.provideStructure)(tokens, bufferPosition);
      }).then(function (structure) {
        var request = _this.buildRequest(structure, originalRequest);
        return Promise.all(providers.map(function (provider) {
          return provider.getProposals(request);
        })).then(function (proposals) {
          return Array.prototype.concat.apply([], proposals);
        });
      });
    }
  }, {
    key: 'checkRequest',
    value: function checkRequest(request) {
      var editor = request.editor;
      var bufferPosition = request.bufferPosition;

      return Boolean(editor && editor.buffer && editor.buffer.file && editor.buffer.file.getBaseName && editor.lineTextForBufferRow && editor.getText && bufferPosition);
    }
  }, {
    key: 'buildRequest',
    value: function buildRequest(structure, originalRequest) {
      var contents = structure.contents;
      var positionInfo = structure.positionInfo;
      var tokens = structure.tokens;
      var editor = originalRequest.editor;
      var bufferPosition = originalRequest.bufferPosition;

      var shouldAddComma = function shouldAddComma(info) {
        if (!info || !info.nextToken || !tokens || tokens.length === 0) {
          return false;
        }
        if (info.nextToken && (0, _lodashIncludes2['default'])([END_ARRAY, END_OBJECT], info.nextToken.type)) {
          return false;
        }
        return !(info.nextToken && (0, _lodashIncludes2['default'])([END_ARRAY, END_OBJECT], info.nextToken.type)) && info.nextToken.type !== COMMA;
      };

      var prefix = function prefix(info) {
        if (!info || !info.editedToken) {
          return '';
        }
        var length = bufferPosition.column - info.editedToken.col + 1;
        return (0, _lodashTrimStart2['default'])(info.editedToken.src.substr(0, length), '"');
      };

      return {
        contents: contents,
        prefix: prefix(positionInfo),
        segments: positionInfo ? positionInfo.segments : null,
        token: positionInfo ? positionInfo.editedToken ? positionInfo.editedToken.src : null : null,
        isKeyPosition: Boolean(positionInfo && positionInfo.keyPosition),
        isValuePosition: Boolean(positionInfo && positionInfo.valuePosition),
        isBetweenQuotes: Boolean(positionInfo && positionInfo.editedToken && positionInfo.editedToken.type === STRING),
        shouldAddComma: Boolean(shouldAddComma(positionInfo)),
        isFileEmpty: tokens.length === 0,
        editor: editor
      };
    }
  }, {
    key: 'getMatchingProviders',
    value: function getMatchingProviders(file) {
      return this.providers.filter(function (p) {
        return (0, _utils.matches)(file, p.getFilePattern()) || p.getFilePattern() === '*';
      });
    }
  }, {
    key: 'onDidInsertSuggestion',
    value: function onDidInsertSuggestion() {
      // noop for now
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      // noop for now
    }
  }]);

  return RootProvider;
})();

exports['default'] = RootProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL3Jvb3QtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFcUIsaUJBQWlCOzs7OytCQUNoQixrQkFBa0I7Ozs7eUJBRUosYUFBYTs7aUNBQ2hCLHNCQUFzQjs7cUJBQy9CLFNBQVM7O0FBUGpDLFdBQVcsQ0FBQTs7SUFTSCxNQUFNLHdCQUFOLE1BQU07SUFBRSxVQUFVLHdCQUFWLFVBQVU7SUFBRSxTQUFTLHdCQUFULFNBQVM7SUFBRSxLQUFLLHdCQUFMLEtBQUs7O0lBRXZCLFlBQVk7QUFFcEIsV0FGUSxZQUFZLEdBRUg7UUFBaEIsU0FBUyx5REFBRyxFQUFFOzswQkFGUCxZQUFZOztBQUc3QixRQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQTtBQUM5QixRQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFBO0FBQzFCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0dBQzNCOztlQU5rQixZQUFZOztXQVFqQix3QkFBQyxlQUFlLEVBQUU7OztVQUN2QixNQUFNLEdBQXVDLGVBQWUsQ0FBNUQsTUFBTTtVQUFFLGNBQWMsR0FBdUIsZUFBZSxDQUFwRCxjQUFjO1VBQUUsaUJBQWlCLEdBQUksZUFBZSxDQUFwQyxpQkFBaUI7O0FBRWhELFVBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxFQUFFO0FBQ3ZDLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtPQUMzQjs7QUFFRCxVQUFJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7QUFDbkgsZUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FB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bS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanNvbi9zcmMvcm9vdC1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBpbmNsdWRlcyBmcm9tICdsb2Rhc2gvaW5jbHVkZXMnXG5pbXBvcnQgdHJpbVN0YXJ0IGZyb20gJ2xvZGFzaC90cmltU3RhcnQnXG5cbmltcG9ydCB7IHRva2VuaXplLCBUb2tlblR5cGUgfSBmcm9tICcuL3Rva2VuaXplcidcbmltcG9ydCB7IHByb3ZpZGVTdHJ1Y3R1cmUgfSBmcm9tICcuL3N0cnVjdHVyZS1wcm92aWRlcidcbmltcG9ydCB7IG1hdGNoZXMgfSBmcm9tICcuL3V0aWxzJ1xuXG5jb25zdCB7IFNUUklORywgRU5EX09CSkVDVCwgRU5EX0FSUkFZLCBDT01NQSB9ID0gVG9rZW5UeXBlXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvb3RQcm92aWRlciB7XG5cbiAgY29uc3RydWN0b3IocHJvdmlkZXJzID0gW10pIHtcbiAgICB0aGlzLnNlbGVjdG9yID0gJy5zb3VyY2UuanNvbidcbiAgICB0aGlzLmluY2x1c2lvblByaW9yaXR5ID0gMVxuICAgIHRoaXMucHJvdmlkZXJzID0gcHJvdmlkZXJzXG4gIH1cblxuICBnZXRTdWdnZXN0aW9ucyhvcmlnaW5hbFJlcXVlc3QpIHtcbiAgICBjb25zdCB7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgYWN0aXZhdGVkTWFudWFsbHl9ID0gb3JpZ2luYWxSZXF1ZXN0XG5cbiAgICBpZiAoIXRoaXMuY2hlY2tSZXF1ZXN0KG9yaWdpbmFsUmVxdWVzdCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG4gICAgfVxuXG4gICAgaWYgKGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhidWZmZXJQb3NpdGlvbi5yb3cpLmNoYXJBdChidWZmZXJQb3NpdGlvbi5jb2x1bW4gLSAxKSA9PT0gJywnICYmICFhY3RpdmF0ZWRNYW51YWxseSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSkgLy8gaGFjaywgdG8gcHJldmVudCBhY3RpdmF0aW9uIHJpZ2h0IGFmdGVyIGluc2VydGluZyBhIGNvbW1hXG4gICAgfVxuXG4gICAgY29uc3QgcHJvdmlkZXJzID0gdGhpcy5nZXRNYXRjaGluZ1Byb3ZpZGVycyhlZGl0b3IuYnVmZmVyLmZpbGUpXG4gICAgaWYgKHByb3ZpZGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pIC8vIG5vIHByb3ZpZGVyIG5vIHByb3Bvc2Fsc1xuICAgIH1cbiAgICByZXR1cm4gdG9rZW5pemUoZWRpdG9yLmdldFRleHQoKSlcbiAgICAgIC50aGVuKHRva2VucyA9PiBwcm92aWRlU3RydWN0dXJlKHRva2VucywgYnVmZmVyUG9zaXRpb24pKVxuICAgICAgLnRoZW4oc3RydWN0dXJlID0+IHtcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuYnVpbGRSZXF1ZXN0KHN0cnVjdHVyZSwgb3JpZ2luYWxSZXF1ZXN0KVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvdmlkZXJzLm1hcChwcm92aWRlciA9PiBwcm92aWRlci5nZXRQcm9wb3NhbHMocmVxdWVzdCkpKVxuICAgICAgICAgIC50aGVuKHByb3Bvc2FscyA9PiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBwcm9wb3NhbHMpKVxuICAgICAgfSlcbiAgfVxuXG4gIGNoZWNrUmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgY29uc3Qge2VkaXRvciwgYnVmZmVyUG9zaXRpb259ID0gcmVxdWVzdFxuICAgIHJldHVybiBCb29sZWFuKGVkaXRvclxuICAgICAgJiYgZWRpdG9yLmJ1ZmZlclxuICAgICAgJiYgZWRpdG9yLmJ1ZmZlci5maWxlXG4gICAgICAmJiBlZGl0b3IuYnVmZmVyLmZpbGUuZ2V0QmFzZU5hbWVcbiAgICAgICYmIGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvd1xuICAgICAgJiYgZWRpdG9yLmdldFRleHRcbiAgICAgICYmIGJ1ZmZlclBvc2l0aW9uKVxuICB9XG5cblxuICBidWlsZFJlcXVlc3Qoc3RydWN0dXJlLCBvcmlnaW5hbFJlcXVlc3QpIHtcbiAgICBjb25zdCB7Y29udGVudHMsIHBvc2l0aW9uSW5mbywgdG9rZW5zfSA9IHN0cnVjdHVyZVxuICAgIGNvbnN0IHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9ufSA9IG9yaWdpbmFsUmVxdWVzdFxuXG4gICAgY29uc3Qgc2hvdWxkQWRkQ29tbWEgPSBpbmZvID0+IHtcbiAgICAgIGlmICghaW5mbyB8fCAhaW5mby5uZXh0VG9rZW4gfHwgIXRva2VucyB8fCB0b2tlbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgaWYgKGluZm8ubmV4dFRva2VuICYmIGluY2x1ZGVzKFtFTkRfQVJSQVksIEVORF9PQkpFQ1RdLCBpbmZvLm5leHRUb2tlbi50eXBlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiAhKGluZm8ubmV4dFRva2VuICYmIGluY2x1ZGVzKFtFTkRfQVJSQVksIEVORF9PQkpFQ1RdLCBpbmZvLm5leHRUb2tlbi50eXBlKSkgJiYgaW5mby5uZXh0VG9rZW4udHlwZSAhPT0gQ09NTUFcbiAgICB9XG5cbiAgICBjb25zdCBwcmVmaXggPSBpbmZvID0+IHtcbiAgICAgIGlmICghaW5mbyB8fCAhaW5mby5lZGl0ZWRUb2tlbikge1xuICAgICAgICByZXR1cm4gJydcbiAgICAgIH1cbiAgICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiAtIGluZm8uZWRpdGVkVG9rZW4uY29sICsgMVxuICAgICAgcmV0dXJuIHRyaW1TdGFydChpbmZvLmVkaXRlZFRva2VuLnNyYy5zdWJzdHIoMCwgbGVuZ3RoKSwgJ1wiJylcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudHMsXG4gICAgICBwcmVmaXg6IHByZWZpeChwb3NpdGlvbkluZm8pLFxuICAgICAgc2VnbWVudHM6IHBvc2l0aW9uSW5mbyA/IHBvc2l0aW9uSW5mby5zZWdtZW50cyA6IG51bGwsXG4gICAgICB0b2tlbjogcG9zaXRpb25JbmZvID8gKHBvc2l0aW9uSW5mby5lZGl0ZWRUb2tlbikgPyBwb3NpdGlvbkluZm8uZWRpdGVkVG9rZW4uc3JjIDogbnVsbCA6IG51bGwsXG4gICAgICBpc0tleVBvc2l0aW9uOiBCb29sZWFuKHBvc2l0aW9uSW5mbyAmJiBwb3NpdGlvbkluZm8ua2V5UG9zaXRpb24pLFxuICAgICAgaXNWYWx1ZVBvc2l0aW9uOiBCb29sZWFuKHBvc2l0aW9uSW5mbyAmJiBwb3NpdGlvbkluZm8udmFsdWVQb3NpdGlvbiksXG4gICAgICBpc0JldHdlZW5RdW90ZXM6IEJvb2xlYW4ocG9zaXRpb25JbmZvICYmIHBvc2l0aW9uSW5mby5lZGl0ZWRUb2tlbiAmJiBwb3NpdGlvbkluZm8uZWRpdGVkVG9rZW4udHlwZSA9PT0gU1RSSU5HKSxcbiAgICAgIHNob3VsZEFkZENvbW1hOiBCb29sZWFuKHNob3VsZEFkZENvbW1hKHBvc2l0aW9uSW5mbykpLFxuICAgICAgaXNGaWxlRW1wdHk6IHRva2Vucy5sZW5ndGggPT09IDAsXG4gICAgICBlZGl0b3JcbiAgICB9XG4gIH1cblxuICBnZXRNYXRjaGluZ1Byb3ZpZGVycyhmaWxlKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmZpbHRlcihwID0+IG1hdGNoZXMoZmlsZSwgcC5nZXRGaWxlUGF0dGVybigpKSB8fCBwLmdldEZpbGVQYXR0ZXJuKCkgPT09ICcqJylcbiAgfVxuXG4gIG9uRGlkSW5zZXJ0U3VnZ2VzdGlvbigpIHtcbiAgICAvLyBub29wIGZvciBub3dcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgLy8gbm9vcCBmb3Igbm93XG4gIH1cbn1cbiJdfQ==