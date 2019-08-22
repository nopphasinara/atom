Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashIsEmpty = require('lodash/isEmpty');

var _lodashIsEmpty2 = _interopRequireDefault(_lodashIsEmpty);

var _lodashTrimStart = require('lodash/trimStart');

var _lodashTrimStart2 = _interopRequireDefault(_lodashTrimStart);

var _lodashStartsWith = require('lodash/startsWith');

var _lodashStartsWith2 = _interopRequireDefault(_lodashStartsWith);

var _lodashLast = require('lodash/last');

var _lodashLast2 = _interopRequireDefault(_lodashLast);

var _lodashSortBy = require('lodash/sortBy');

var _lodashSortBy2 = _interopRequireDefault(_lodashSortBy);

var _lodashIncludes = require('lodash/includes');

var _lodashIncludes2 = _interopRequireDefault(_lodashIncludes);

var _utils = require('./utils');

var _path = require('path');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

var SLASHES = /\\|\//; // slash (/) or backslash (\)

function directoryExists(path) {
  try {
    return _fs2['default'].statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

function listPaths(dir, storageType, fileExtensions) {
  return new Promise(function (resolve, reject) {
    _fs2['default'].readdir(dir, function (error, paths) {
      if (error) {
        reject(error);
      } else {
        var fileInfos = paths.map(function (path) {
          var stats = _fs2['default'].statSync(dir + _path.sep + path); // TODO is it worth asyncing?
          return {
            name: path,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory()
          };
        }).filter(function (file) {
          switch (storageType) {
            case _utils.StorageType.FILE:
              return file.isFile && (!fileExtensions || (0, _lodashIncludes2['default'])(fileExtensions, (0, _path.extname)(file.name)));
            case _utils.StorageType.FOLDER:
              return file.isDirectory;
            default:
              {
                return file.isDirectory || !fileExtensions || (0, _lodashIncludes2['default'])(fileExtensions, (0, _path.extname)(file.name));
              }
          }
        });
        resolve(fileInfos);
      }
    });
  });
}

function containerName(root, segments) {
  // Empty prefix or segments, search in the root folder.
  if ((0, _lodashIsEmpty2['default'])(segments)) {
    return root;
  }
  // Last character is some kind of slash.
  if ((0, _lodashIsEmpty2['default'])((0, _lodashLast2['default'])(segments))) {
    // this means, the last segment was (or should be) a directory.
    var path = root + _path.sep + (0, _lodashTrimStart2['default'])(segments.join(_path.sep), '/\\');
    if (directoryExists(path)) {
      return path;
    }
  } else {
    // Last segment is not a slash, meaning we don't need, what the user typed until the last slash.
    var lastIsPartialFile = root + _path.sep + (0, _lodashTrimStart2['default'])(segments.slice(0, segments.length - 1).join(_path.sep), '/\\');
    if (directoryExists(lastIsPartialFile)) {
      return lastIsPartialFile;
    }
  }
  // User wants completions for non existing directory.
  return null;
}

function prepareFiles(files, request, basePath, segments) {
  var filteredFiles = (0, _lodashIsEmpty2['default'])((0, _lodashLast2['default'])(segments)) ? files : files.filter(function (file) {
    return (0, _lodashStartsWith2['default'])(file.name, (0, _lodashLast2['default'])(segments));
  });
  return (0, _lodashSortBy2['default'])(filteredFiles, function (f) {
    return f.isDirectory ? 0 : 1;
  });
}

function createProposal(file, request, basePath, segments) {
  var proposal = {};
  var text = (function () {
    var proposalText = file.name;
    if (segments.length === 0) {
      proposalText = file.name;
    } else if ((0, _lodashLast2['default'])(segments).length === 0) {
      proposalText = segments.join('/') + file.name;
    } else {
      var withoutPartial = segments.slice(0, segments.length - 1);
      if (withoutPartial.length === 0) {
        proposalText = file.name;
      } else {
        proposalText = segments.slice(0, segments.length - 1).join('/') + '/' + file.name;
      }
    }
    return proposalText + (file.isDirectory ? '/' : '');
  })();

  proposal.replacementPrefix = request.prefix;
  proposal.displayText = file.name;
  proposal.rightLabel = file.isDirectory ? 'folder' : 'file';
  if (request.isBetweenQuotes) {
    proposal.text = text;
  } else {
    proposal.snippet = '"' + text + '$1"';
  }
  proposal.type = proposal.rightLabel;
  return proposal;
}

var FileProposalProvider = (function () {
  function FileProposalProvider(configuration) {
    _classCallCheck(this, FileProposalProvider);

    this.configuration = configuration;
  }

  _createClass(FileProposalProvider, [{
    key: 'getProposals',
    value: function getProposals(request) {
      if (!request.isBetweenQuotes || !this.configuration.getMatcher().matches(request)) {
        return Promise.resolve([]);
      }
      var dir = request.editor.getBuffer().file.getParent().path;
      var prefix = request.prefix;

      var segments = prefix.split(SLASHES);
      var searchDir = containerName(dir, segments);

      if (searchDir === null) {
        return Promise.resolve([]);
      }

      return listPaths(searchDir, this.configuration.getStorageType(), this.configuration.getFileExtensions()).then(function (results) {
        return prepareFiles(results, request, dir, segments).map(function (file) {
          return createProposal(file, request, dir, segments);
        });
      });
    }
  }, {
    key: 'getFilePattern',
    value: function getFilePattern() {
      return this.configuration.getFilePattern();
    }
  }]);

  return FileProposalProvider;
})();

exports.FileProposalProvider = FileProposalProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzb24vc3JjL2ZpbGUtcHJvcG9zYWwtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs2QkFFb0IsZ0JBQWdCOzs7OytCQUNkLGtCQUFrQjs7OztnQ0FDakIsbUJBQW1COzs7OzBCQUN6QixhQUFhOzs7OzRCQUNYLGVBQWU7Ozs7OEJBQ2IsaUJBQWlCOzs7O3FCQUVWLFNBQVM7O29CQUNSLE1BQU07O2tCQUNwQixJQUFJOzs7O0FBWG5CLFdBQVcsQ0FBQTs7QUFhWCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUE7O0FBRXZCLFNBQVMsZUFBZSxDQUFDLElBQUksRUFBRTtBQUM3QixNQUFJO0FBQ0YsV0FBTyxnQkFBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7R0FDdkMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLFdBQU8sS0FBSyxDQUFBO0dBQ2I7Q0FDRjs7QUFFRCxTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRTtBQUNuRCxTQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxvQkFBRyxPQUFPLENBQUMsR0FBRyxFQUFFLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUNoQyxVQUFJLEtBQUssRUFBRTtBQUNULGNBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUNkLE1BQU07QUFDTCxZQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ2xDLGNBQU0sS0FBSyxHQUFHLGdCQUFHLFFBQVEsQ0FBQyxHQUFHLFlBQU0sR0FBRyxJQUFJLENBQUMsQ0FBQTtBQUMzQyxpQkFBTztBQUNMLGdCQUFJLEVBQUUsSUFBSTtBQUNWLGtCQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUN0Qix1QkFBVyxF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LFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNqRixlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDM0I7QUFDRCxVQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUE7VUFDckQsTUFBTSxHQUFJLE9BQU8sQ0FBakIsTUFBTTs7QUFDYixVQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3RDLFVBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUE7O0FBRTlDLFVBQUksU0FBUyxLQUFLLElBQUksRUFBRTtBQUN0QixlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDM0I7O0FBRUQsYUFBTyxTQUFTLENBQ2QsU0FBUyxFQUNULElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLEVBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsQ0FDdkMsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPO2VBQUksWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUM1RCxHQUFHLENBQUMsVUFBQSxJQUFJO2lCQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUM7U0FBQSxDQUFDO09BQUEsQ0FBQyxDQUFBO0tBQzlEOzs7V0FFYSwwQkFBRztBQUNmLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtLQUMzQzs7O1NBN0JVLG9CQUFvQiIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1qc29uL3NyYy9maWxlLXByb3Bvc2FsLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGlzRW1wdHkgZnJvbSAnbG9kYXNoL2lzRW1wdHknXG5pbXBvcnQgdHJpbVN0YXJ0IGZyb20gJ2xvZGFzaC90cmltU3RhcnQnXG5pbXBvcnQgc3RhcnRzV2l0aCBmcm9tICdsb2Rhc2gvc3RhcnRzV2l0aCdcbmltcG9ydCBsYXN0IGZyb20gJ2xvZGFzaC9sYXN0J1xuaW1wb3J0IHNvcnRCeSBmcm9tICdsb2Rhc2gvc29ydEJ5J1xuaW1wb3J0IGluY2x1ZGVzIGZyb20gJ2xvZGFzaC9pbmNsdWRlcydcblxuaW1wb3J0IHsgU3RvcmFnZVR5cGUgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IHsgc2VwLCBleHRuYW1lIH0gZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcblxuY29uc3QgU0xBU0hFUyA9IC9cXFxcfFxcLy8gLy8gc2xhc2ggKC8pIG9yIGJhY2tzbGFzaCAoXFwpXG5cbmZ1bmN0aW9uIGRpcmVjdG9yeUV4aXN0cyhwYXRoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZzLnN0YXRTeW5jKHBhdGgpLmlzRGlyZWN0b3J5KClcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGxpc3RQYXRocyhkaXIsIHN0b3JhZ2VUeXBlLCBmaWxlRXh0ZW5zaW9ucykge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZzLnJlYWRkaXIoZGlyLCAoZXJyb3IsIHBhdGhzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmlsZUluZm9zID0gcGF0aHMubWFwKHBhdGggPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRzID0gZnMuc3RhdFN5bmMoZGlyICsgc2VwICsgcGF0aCkgLy8gVE9ETyBpcyBpdCB3b3J0aCBhc3luY2luZz9cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogcGF0aCxcbiAgICAgICAgICAgIGlzRmlsZTogc3RhdHMuaXNGaWxlKCksXG4gICAgICAgICAgICBpc0RpcmVjdG9yeTogc3RhdHMuaXNEaXJlY3RvcnkoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmlsdGVyKGZpbGUgPT4ge1xuICAgICAgICAgIHN3aXRjaCAoc3RvcmFnZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgU3RvcmFnZVR5cGUuRklMRTpcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbGUuaXNGaWxlICYmICghZmlsZUV4dGVuc2lvbnMgfHwgaW5jbHVkZXMoZmlsZUV4dGVuc2lvbnMsIGV4dG5hbWUoZmlsZS5uYW1lKSkpXG4gICAgICAgICAgICBjYXNlIFN0b3JhZ2VUeXBlLkZPTERFUjpcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbGUuaXNEaXJlY3RvcnlcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbGUuaXNEaXJlY3RvcnkgfHwgIWZpbGVFeHRlbnNpb25zIHx8IGluY2x1ZGVzKGZpbGVFeHRlbnNpb25zLCBleHRuYW1lKGZpbGUubmFtZSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXNvbHZlKGZpbGVJbmZvcylcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBjb250YWluZXJOYW1lKHJvb3QsIHNlZ21lbnRzKSB7XG4gIC8vIEVtcHR5IHByZWZpeCBvciBzZWdtZW50cywgc2VhcmNoIGluIHRoZSByb290IGZvbGRlci5cbiAgaWYgKGlzRW1wdHkoc2VnbWVudHMpKSB7XG4gICAgcmV0dXJuIHJvb3RcbiAgfVxuICAvLyBMYXN0IGNoYXJhY3RlciBpcyBzb21lIGtpbmQgb2Ygc2xhc2guXG4gIGlmIChpc0VtcHR5KGxhc3Qoc2VnbWVudHMpKSkge1xuICAgIC8vIHRoaXMgbWVhbnMsIHRoZSBsYXN0IHNlZ21lbnQgd2FzIChvciBzaG91bGQgYmUpIGEgZGlyZWN0b3J5LlxuICAgIGNvbnN0IHBhdGggPSByb290ICsgc2VwICsgdHJpbVN0YXJ0KHNlZ21lbnRzLmpvaW4oc2VwKSwgJy9cXFxcJylcbiAgICBpZiAoZGlyZWN0b3J5RXhpc3RzKHBhdGgpKSB7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBMYXN0IHNlZ21lbnQgaXMgbm90IGEgc2xhc2gsIG1lYW5pbmcgd2UgZG9uJ3QgbmVlZCwgd2hhdCB0aGUgdXNlciB0eXBlZCB1bnRpbCB0aGUgbGFzdCBzbGFzaC5cbiAgICBjb25zdCBsYXN0SXNQYXJ0aWFsRmlsZSA9IHJvb3QgKyBzZXAgKyB0cmltU3RhcnQoc2VnbWVudHMuc2xpY2UoMCwgc2VnbWVudHMubGVuZ3RoIC0gMSkuam9pbihzZXApLCAnL1xcXFwnKVxuICAgIGlmIChkaXJlY3RvcnlFeGlzdHMobGFzdElzUGFydGlhbEZpbGUpKSB7XG4gICAgICByZXR1cm4gbGFzdElzUGFydGlhbEZpbGVcbiAgICB9XG4gIH1cbiAgLy8gVXNlciB3YW50cyBjb21wbGV0aW9ucyBmb3Igbm9uIGV4aXN0aW5nIGRpcmVjdG9yeS5cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gcHJlcGFyZUZpbGVzKGZpbGVzLCByZXF1ZXN0LCBiYXNlUGF0aCwgc2VnbWVudHMpIHtcbiAgY29uc3QgZmlsdGVyZWRGaWxlcyA9IGlzRW1wdHkobGFzdChzZWdtZW50cykpXG4gICAgPyBmaWxlc1xuICAgIDogZmlsZXMuZmlsdGVyKGZpbGUgPT4gc3RhcnRzV2l0aChmaWxlLm5hbWUsIGxhc3Qoc2VnbWVudHMpKSlcbiAgcmV0dXJuIHNvcnRCeShmaWx0ZXJlZEZpbGVzLCBmID0+IGYuaXNEaXJlY3RvcnkgPyAwIDogMSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlUHJvcG9zYWwoZmlsZSwgcmVxdWVzdCwgYmFzZVBhdGgsIHNlZ21lbnRzKSB7XG4gIGNvbnN0IHByb3Bvc2FsID0ge31cbiAgY29uc3QgdGV4dCA9ICgoKSA9PiB7XG4gICAgbGV0IHByb3Bvc2FsVGV4dCA9IGZpbGUubmFtZVxuICAgIGlmIChzZWdtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHByb3Bvc2FsVGV4dCA9IGZpbGUubmFtZVxuICAgIH0gZWxzZSBpZiAobGFzdChzZWdtZW50cykubGVuZ3RoID09PSAwKSB7XG4gICAgICBwcm9wb3NhbFRleHQgPSBzZWdtZW50cy5qb2luKCcvJykgKyBmaWxlLm5hbWVcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgd2l0aG91dFBhcnRpYWwgPSBzZWdtZW50cy5zbGljZSgwLCBzZWdtZW50cy5sZW5ndGggLSAxKVxuICAgICAgaWYgKHdpdGhvdXRQYXJ0aWFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBwcm9wb3NhbFRleHQgPSBmaWxlLm5hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb3Bvc2FsVGV4dCA9IGAke3NlZ21lbnRzLnNsaWNlKDAsIHNlZ21lbnRzLmxlbmd0aCAtIDEpLmpvaW4oJy8nKX0vJHtmaWxlLm5hbWV9YFxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcG9zYWxUZXh0ICsgKGZpbGUuaXNEaXJlY3RvcnkgPyAnLycgOiAnJylcbiAgfSkoKVxuXG4gIHByb3Bvc2FsLnJlcGxhY2VtZW50UHJlZml4ID0gcmVxdWVzdC5wcmVmaXhcbiAgcHJvcG9zYWwuZGlzcGxheVRleHQgPSBmaWxlLm5hbWVcbiAgcHJvcG9zYWwucmlnaHRMYWJlbCA9IGZpbGUuaXNEaXJlY3RvcnkgPyAnZm9sZGVyJyA6ICdmaWxlJ1xuICBpZiAocmVxdWVzdC5pc0JldHdlZW5RdW90ZXMpIHtcbiAgICBwcm9wb3NhbC50ZXh0ID0gdGV4dFxuICB9IGVsc2Uge1xuICAgIHByb3Bvc2FsLnNuaXBwZXQgPSBgXCIke3RleHR9JDFcImBcbiAgfVxuICBwcm9wb3NhbC50eXBlID0gcHJvcG9zYWwucmlnaHRMYWJlbFxuICByZXR1cm4gcHJvcG9zYWxcbn1cblxuZXhwb3J0IGNsYXNzIEZpbGVQcm9wb3NhbFByb3ZpZGVyIHtcblxuICBjb25zdHJ1Y3Rvcihjb25maWd1cmF0aW9uKSB7XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvblxuICB9XG5cbiAgZ2V0UHJvcG9zYWxzKHJlcXVlc3QpIHtcbiAgICBpZiAoIXJlcXVlc3QuaXNCZXR3ZWVuUXVvdGVzIHx8ICF0aGlzLmNvbmZpZ3VyYXRpb24uZ2V0TWF0Y2hlcigpLm1hdGNoZXMocmVxdWVzdCkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG4gICAgfVxuICAgIGNvbnN0IGRpciA9IHJlcXVlc3QuZWRpdG9yLmdldEJ1ZmZlcigpLmZpbGUuZ2V0UGFyZW50KCkucGF0aFxuICAgIGNvbnN0IHtwcmVmaXh9ID0gcmVxdWVzdFxuICAgIGNvbnN0IHNlZ21lbnRzID0gcHJlZml4LnNwbGl0KFNMQVNIRVMpXG4gICAgY29uc3Qgc2VhcmNoRGlyID0gY29udGFpbmVyTmFtZShkaXIsIHNlZ21lbnRzKVxuXG4gICAgaWYgKHNlYXJjaERpciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSlcbiAgICB9XG5cbiAgICByZXR1cm4gbGlzdFBhdGhzKFxuICAgICAgc2VhcmNoRGlyLFxuICAgICAgdGhpcy5jb25maWd1cmF0aW9uLmdldFN0b3JhZ2VUeXBlKCksXG4gICAgICB0aGlzLmNvbmZpZ3VyYXRpb24uZ2V0RmlsZUV4dGVuc2lvbnMoKVxuICAgICkudGhlbihyZXN1bHRzID0+IHByZXBhcmVGaWxlcyhyZXN1bHRzLCByZXF1ZXN0LCBkaXIsIHNlZ21lbnRzKVxuICAgICAgLm1hcChmaWxlID0+IGNyZWF0ZVByb3Bvc2FsKGZpbGUsIHJlcXVlc3QsIGRpciwgc2VnbWVudHMpKSlcbiAgfVxuXG4gIGdldEZpbGVQYXR0ZXJuKCkge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb24uZ2V0RmlsZVBhdHRlcm4oKVxuICB9XG59XG4iXX0=