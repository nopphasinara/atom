(function() {
  var File, fs, path,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  path = require('path');

  module.exports = File = (function() {
    function File() {}

    File["delete"] = function(files) {
      var e, file, j, len, results;
      if (typeof files === 'string') {
        files = [files];
      }
      if (typeof files === 'object') {
        results = [];
        for (j = 0, len = files.length; j < len; j++) {
          file = files[j];
          if (fs.existsSync(file)) {
            try {
              results.push(fs.unlinkSync(file));
            } catch (error) {
              e = error;
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    File.getFileSize = function(filenames) {
      var fileSize, filename, j, len, sizes;
      fileSize = function(filename) {
        if (fs.existsSync(filename)) {
          return fs.statSync(filename)['size'];
        } else {
          return -1;
        }
      };
      if (typeof filenames === 'string') {
        return fileSize(filenames);
      } else {
        sizes = {};
        for (j = 0, len = filenames.length; j < len; j++) {
          filename = filenames[j];
          sizes[filename] = fileSize(filename);
        }
        return sizes;
      }
    };

    File.getTemporaryFilename = function(prefix, outputPath, fileExtension) {
      var filename, os, uniqueId, uuid;
      if (prefix == null) {
        prefix = "";
      }
      if (outputPath == null) {
        outputPath = null;
      }
      if (fileExtension == null) {
        fileExtension = 'tmp';
      }
      os = require('os');
      uuid = require('node-uuid');
      while (true) {
        uniqueId = uuid.v4();
        filename = "" + prefix + uniqueId + "." + fileExtension;
        if (!outputPath) {
          outputPath = os.tmpdir();
        }
        filename = path.join(outputPath, filename);
        if (!fs.existsSync(filename)) {
          break;
        }
      }
      return filename;
    };

    File.ensureDirectoryExists = function(paths) {
      var folder, j, len, p, parts, results, tmpPath;
      if (typeof paths === 'string') {
        paths = [paths];
      }
      results = [];
      for (j = 0, len = paths.length; j < len; j++) {
        p = paths[j];
        if (fs.existsSync(p)) {
          continue;
        }
        parts = p.split(path.sep);
        tmpPath = '';
        if (parts[0] === '') {
          parts.shift();
          tmpPath = path.sep;
        }
        results.push((function() {
          var k, len1, results1;
          results1 = [];
          for (k = 0, len1 = parts.length; k < len1; k++) {
            folder = parts[k];
            tmpPath += (tmpPath === '' || tmpPath === path.sep ? '' : path.sep) + folder;
            if (!fs.existsSync(tmpPath)) {
              results1.push(fs.mkdirSync(tmpPath));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })());
      }
      return results;
    };

    File.fileSizeToReadable = function(bytes, decimals) {
      var dividend, divisor, i, j, readable, ref, unitIndex, units;
      if (decimals == null) {
        decimals = 2;
      }
      if (typeof bytes === 'number') {
        bytes = [bytes];
      }
      units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      unitIndex = 0;
      decimals = Math.pow(10, decimals);
      dividend = bytes[0];
      divisor = 1024;
      while (dividend >= divisor) {
        divisor = divisor * 1024;
        unitIndex++;
      }
      divisor = divisor / 1024;
      for (i = j = 0, ref = bytes.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        bytes[i] = Math.round(bytes[i] * decimals / divisor) / decimals;
      }
      readable = {
        size: bytes,
        unit: units[unitIndex],
        divisor: divisor
      };
      return readable;
    };

    File.hasFileExtension = function(filename, extension) {
      var fileExtension, ref;
      if (typeof filename !== 'string') {
        return false;
      }
      fileExtension = path.extname(filename);
      if (typeof extension === 'string') {
        extension = [extension];
      }
      return ref = fileExtension.toLowerCase(), indexOf.call(extension, ref) >= 0;
    };

    return File;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9zYXNzLWF1dG9jb21waWxlL2xpYi9oZWxwZXIvZmlsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGNBQUE7SUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUdQLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUVGLElBQUMsRUFBQSxNQUFBLEVBQUQsR0FBUyxTQUFDLEtBQUQ7QUFHTCxVQUFBO01BQUEsSUFBRyxPQUFPLEtBQVAsS0FBZ0IsUUFBbkI7UUFDSSxLQUFBLEdBQVEsQ0FBQyxLQUFELEVBRFo7O01BR0EsSUFBRyxPQUFPLEtBQVAsS0FBZ0IsUUFBbkI7QUFDSTthQUFBLHVDQUFBOztVQUNJLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFkLENBQUg7QUFDSTsyQkFDSSxFQUFFLENBQUMsVUFBSCxDQUFjLElBQWQsR0FESjthQUFBLGFBQUE7Y0FFTSxVQUZOO2FBREo7V0FBQSxNQUFBO2lDQUFBOztBQURKO3VCQURKOztJQU5LOztJQWVULElBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxTQUFEO0FBQ1YsVUFBQTtNQUFBLFFBQUEsR0FBVyxTQUFDLFFBQUQ7UUFDUCxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUFIO0FBQ0ksaUJBQU8sRUFBRSxDQUFDLFFBQUgsQ0FBWSxRQUFaLENBQXNCLENBQUEsTUFBQSxFQURqQztTQUFBLE1BQUE7QUFHSSxpQkFBTyxDQUFDLEVBSFo7O01BRE87TUFNWCxJQUFHLE9BQU8sU0FBUCxLQUFvQixRQUF2QjtBQUNJLGVBQU8sUUFBQSxDQUFTLFNBQVQsRUFEWDtPQUFBLE1BQUE7UUFHSSxLQUFBLEdBQVE7QUFDUixhQUFBLDJDQUFBOztVQUNJLEtBQU0sQ0FBQSxRQUFBLENBQU4s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QUFXLFNBQVg7QUFDZixVQUFBO01BQUEsSUFBb0IsT0FBTyxRQUFQLEtBQW1CLFFBQXZDO0FBQUEsZUFBTyxNQUFQOztNQUNBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiO01BQ2hCLElBQUcsT0FBTyxTQUFQLEtBQW9CLFFBQXZCO1FBQ0ksU0FBQSxHQUFZLENBQUMsU0FBRCxFQURoQjs7QUFFQSxtQkFBTyxhQUFhLENBQUMsV0FBZCxDQUFBLENBQUEsRUFBQSxhQUErQixTQUEvQixFQUFBLEdBQUE7SUFMUTs7Ozs7QUF4R3ZCIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlKCdmcycpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRmlsZVxuXG4gICAgQGRlbGV0ZTogKGZpbGVzKSAtPlxuICAgICAgICAjIGlmIGZpbGUgaXMgYSBzaW5nbGUgZmlsZW5hbWUgdGhlbiB3ZSB3cmFwIGl0IGludG8gYW4gYXJyYXkgYW5kIGluXG4gICAgICAgICMgbmV4dCBzdGVwIHdlIGRlbGV0ZSBhbiBhcnJheSBvZiBmaWxlXG4gICAgICAgIGlmIHR5cGVvZiBmaWxlcyBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgZmlsZXMgPSBbZmlsZXNdXG5cbiAgICAgICAgaWYgdHlwZW9mIGZpbGVzIGlzICdvYmplY3QnXG4gICAgICAgICAgICBmb3IgZmlsZSBpbiBmaWxlc1xuICAgICAgICAgICAgICAgIGlmIGZzLmV4aXN0c1N5bmMoZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgICAgICAgICBmcy51bmxpbmtTeW5jKGZpbGUpXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICAgICAgICAgICMgZG8gbm90aGluZyBoZXJlLCBpZiBhbiBlcnJvciBvY2N1cnNcblxuXG4gICAgQGdldEZpbGVTaXplOiAoZmlsZW5hbWVzKSAtPlxuICAgICAgICBmaWxlU2l6ZSA9IChmaWxlbmFtZSkgLT5cbiAgICAgICAgICAgIGlmIGZzLmV4aXN0c1N5bmMoZmlsZW5hbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZzLnN0YXRTeW5jKGZpbGVuYW1lKVsnc2l6ZSddXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xXG5cbiAgICAgICAgaWYgdHlwZW9mIGZpbGVuYW1lcyBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgcmV0dXJuIGZpbGVTaXplKGZpbGVuYW1lcylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2l6ZXMgPSB7fVxuICAgICAgICAgICAgZm9yIGZpbGVuYW1lIGluIGZpbGVuYW1lc1xuICAgICAgICAgICAgICAgIHNpemVzW2ZpbGVuYW1lXSA9IGZpbGVTaXplKGZpbGVuYW1lKVxuICAgICAgICAgICAgcmV0dXJuIHNpemVzXG5cblxuICAgIEBnZXRUZW1wb3JhcnlGaWxlbmFtZTogKHByZWZpeCA9IFwiXCIsIG91dHB1dFBhdGggPSBudWxsLCBmaWxlRXh0ZW5zaW9uID0gJ3RtcCcpIC0+XG4gICAgICAgIG9zID0gcmVxdWlyZSgnb3MnKVxuICAgICAgICB1dWlkID0gcmVxdWlyZSgnbm9kZS11dWlkJylcblxuICAgICAgICBsb29wXG4gICAgICAgICAgICB1bmlxdWVJZCA9IHV1aWQudjQoKVxuICAgICAgICAgICAgZmlsZW5hbWUgPSBcIiN7cHJlZml4fSN7dW5pcXVlSWR9LiN7ZmlsZUV4dGVuc2lvbn1cIlxuXG4gICAgICAgICAgICBpZiBub3Qgb3V0cHV0UGF0aFxuICAgICAgICAgICAgICAgIG91dHB1dFBhdGggPSBvcy50bXBkaXIoKVxuICAgICAgICAgICAgZmlsZW5hbWUgPSBwYXRoLmpvaW4ob3V0cHV0UGF0aCwgZmlsZW5hbWUpXG5cbiAgICAgICAgICAgIGJyZWFrIGlmIG5vdCBmcy5leGlzdHNTeW5jKGZpbGVuYW1lKVxuXG4gICAgICAgIHJldHVybiBmaWxlbmFtZVxuXG5cbiAgICBAZW5zdXJlRGlyZWN0b3J5RXhpc3RzOiAocGF0aHMpIC0+XG4gICAgICAgIGlmIHR5cGVvZiBwYXRocyBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgcGF0aHMgPSBbcGF0aHNdXG5cbiAgICAgICAgZm9yIHAgaW4gcGF0aHNcbiAgICAgICAgICAgIGlmIGZzLmV4aXN0c1N5bmMocClcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgICAgICBwYXJ0cyA9IHAuc3BsaXQocGF0aC5zZXApXG5cbiAgICAgICAgICAgICMgSWYgcGFydFswXSBpcyBhbiBlbXB0eSBzdHJpbmcsIGl0J3MgRGFyd2luIG9yIExpbnV4LCBzbyB3ZSBzZXQgdGhlIHRtcFBhdGggdG9cbiAgICAgICAgICAgICMgcm9vdCBkaXJlY3RvcnkgYXMgc3RhcnRpbmcgcG9pbnRcbiAgICAgICAgICAgIHRtcFBhdGggPSAnJ1xuICAgICAgICAgICAgaWYgcGFydHNbMF0gaXMgJydcbiAgICAgICAgICAgICAgICBwYXJ0cy5zaGlmdCgpXG4gICAgICAgICAgICAgICAgdG1wUGF0aCA9IHBhdGguc2VwXG5cbiAgICAgICAgICAgIGZvciBmb2xkZXIgaW4gcGFydHNcbiAgICAgICAgICAgICAgICB0bXBQYXRoICs9IChpZiB0bXBQYXRoIGluIFsnJywgcGF0aC5zZXBdIHRoZW4gJycgZWxzZSBwYXRoLnNlcCkgKyBmb2xkZXJcbiAgICAgICAgICAgICAgICBpZiBub3QgZnMuZXhpc3RzU3luYyh0bXBQYXRoKVxuICAgICAgICAgICAgICAgICAgICBmcy5ta2RpclN5bmModG1wUGF0aClcblxuXG4gICAgQGZpbGVTaXplVG9SZWFkYWJsZTogKGJ5dGVzLCBkZWNpbWFscyA9IDIpIC0+XG4gICAgICAgIGlmIHR5cGVvZiBieXRlcyBpcyAnbnVtYmVyJ1xuICAgICAgICAgICAgYnl0ZXMgPSBbYnl0ZXNdXG5cbiAgICAgICAgdW5pdHMgPSBbJ0J5dGVzJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJ11cbiAgICAgICAgdW5pdEluZGV4ID0gMFxuICAgICAgICBkZWNpbWFscyA9IE1hdGgucG93KDEwLCBkZWNpbWFscylcbiAgICAgICAgZGl2aWRlbmQgPSBieXRlc1swXVxuICAgICAgICBkaXZpc29yID0gMTAyNFxuXG4gICAgICAgIHdoaWxlIGRpdmlkZW5kID49IGRpdmlzb3JcbiAgICAgICAgICAgIGRpdmlzb3IgPSBkaXZpc29yICogMTAyNFxuICAgICAgICAgICAgdW5pdEluZGV4KytcbiAgICAgICAgZGl2aXNvciA9IGRpdmlzb3IgLyAxMDI0XG5cbiAgICAgICAgZm9yIGkgaW4gWzAuLmJ5dGVzLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBieXRlc1tpXSA9IE1hdGgucm91bmQoYnl0ZXNbaV0gKiBkZWNpbWFscyAvIGRpdmlzb3IpIC8gZGVjaW1hbHNcblxuICAgICAgICByZWFkYWJsZSA9XG4gICAgICAgICAgICBzaXplOiBieXRlc1xuICAgICAgICAgICAgdW5pdDogdW5pdHNbdW5pdEluZGV4XVxuICAgICAgICAgICAgZGl2aXNvcjogZGl2aXNvclxuXG4gICAgICAgIHJldHVybiByZWFkYWJsZVxuXG5cbiAgICBAaGFzRmlsZUV4dGVuc2lvbjogKGZpbGVuYW1lLCBleHRlbnNpb24pIC0+XG4gICAgICAgIHJldHVybiBmYWxzZSB1bmxlc3MgdHlwZW9mIGZpbGVuYW1lID09ICdzdHJpbmcnXG4gICAgICAgIGZpbGVFeHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoZmlsZW5hbWUpXG4gICAgICAgIGlmIHR5cGVvZiBleHRlbnNpb24gaXMgJ3N0cmluZydcbiAgICAgICAgICAgIGV4dGVuc2lvbiA9IFtleHRlbnNpb25dXG4gICAgICAgIHJldHVybiBmaWxlRXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCkgaW4gZXh0ZW5zaW9uXG4iXX0=
