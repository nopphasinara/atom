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
      fileExtension = path.extname(filename);
      if (typeof extension === 'string') {
        extension = [extension];
      }
      return ref = fileExtension.toLowerCase(), indexOf.call(extension, ref) >= 0;
    };

    return File;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2F0b20tbWluaWZ5L2xpYi9oZWxwZXIvZmlsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGNBQUE7SUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUdQLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUVGLElBQUMsRUFBQSxNQUFBLEVBQUQsR0FBUyxTQUFDLEtBQUQ7QUFHTCxVQUFBO01BQUEsSUFBRyxPQUFPLEtBQVAsS0FBZ0IsUUFBbkI7UUFDSSxLQUFBLEdBQVEsQ0FBQyxLQUFELEVBRFo7O01BR0EsSUFBRyxPQUFPLEtBQVAsS0FBZ0IsUUFBbkI7QUFDSTthQUFBLHVDQUFBOztVQUNJLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFkLENBQUg7QUFDSTsyQkFDSSxFQUFFLENBQUMsVUFBSCxDQUFjLElBQWQsR0FESjthQUFBLGFBQUE7Y0FFTSxVQUZOO2FBREo7V0FBQSxNQUFBO2lDQUFBOztBQURKO3VCQURKOztJQU5LOztJQWVULElBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxTQUFEO0FBQ1YsVUFBQTtNQUFBLFFBQUEsR0FBVyxTQUFDLFFBQUQ7UUFDUCxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUFIO0FBQ0ksaUJBQU8sRUFBRSxDQUFDLFFBQUgsQ0FBWSxRQUFaLENBQXNCLENBQUEsTUFBQSxFQURqQztTQUFBLE1BQUE7QUFHSSxpQkFBTyxDQUFDLEVBSFo7O01BRE87TUFNWCxJQUFHLE9BQU8sU0FBUCxLQUFvQixRQUF2QjtBQUNJLGVBQU8sUUFBQSxDQUFTLFNBQVQsRUFEWDtPQUFBLE1BQUE7UUFHSSxLQUFBLEdBQVE7QUFDUixhQUFBLDJDQUFBOztVQUNJLEtBQU0sQ0FBQSxRQUFBLENB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RCxFQUFXLFNBQVg7QUFDZixVQUFBO01BQUEsYUFBQSxHQUFnQixJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWI7TUFDaEIsSUFBRyxPQUFPLFNBQVAsS0FBb0IsUUFBdkI7UUFDSSxTQUFBLEdBQVksQ0FBQyxTQUFELEVBRGhCOztBQUVBLG1CQUFPLGFBQWEsQ0FBQyxXQUFkLENBQUEsQ0FBQSxFQUFBLGFBQStCLFNBQS9CLEVBQUEsR0FBQTtJQUpROzs7OztBQXhHdkIiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUoJ2ZzJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBGaWxlXG5cbiAgICBAZGVsZXRlOiAoZmlsZXMpIC0+XG4gICAgICAgICMgaWYgZmlsZSBpcyBhIHNpbmdsZSBmaWxlbmFtZSB0aGVuIHdlIHdyYXAgaXQgaW50byBhbiBhcnJheSBhbmQgaW5cbiAgICAgICAgIyBuZXh0IHN0ZXAgd2UgZGVsZXRlIGFuIGFycmF5IG9mIGZpbGVcbiAgICAgICAgaWYgdHlwZW9mIGZpbGVzIGlzICdzdHJpbmcnXG4gICAgICAgICAgICBmaWxlcyA9IFtmaWxlc11cblxuICAgICAgICBpZiB0eXBlb2YgZmlsZXMgaXMgJ29iamVjdCdcbiAgICAgICAgICAgIGZvciBmaWxlIGluIGZpbGVzXG4gICAgICAgICAgICAgICAgaWYgZnMuZXhpc3RzU3luYyhmaWxlKVxuICAgICAgICAgICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLnVubGlua1N5bmMoZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBkbyBub3RoaW5nIGhlcmUsIGlmIGFuIGVycm9yIG9jY3Vyc1xuXG5cbiAgICBAZ2V0RmlsZVNpemU6IChmaWxlbmFtZXMpIC0+XG4gICAgICAgIGZpbGVTaXplID0gKGZpbGVuYW1lKSAtPlxuICAgICAgICAgICAgaWYgZnMuZXhpc3RzU3luYyhmaWxlbmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZnMuc3RhdFN5bmMoZmlsZW5hbWUpWydzaXplJ11cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gLTFcblxuICAgICAgICBpZiB0eXBlb2YgZmlsZW5hbWVzIGlzICdzdHJpbmcnXG4gICAgICAgICAgICByZXR1cm4gZmlsZVNpemUoZmlsZW5hbWVzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzaXplcyA9IHt9XG4gICAgICAgICAgICBmb3IgZmlsZW5hbWUgaW4gZmlsZW5hbWVzXG4gICAgICAgICAgICAgICAgc2l6ZXNbZmlsZW5hbWVdID0gZmlsZVNpemUoZmlsZW5hbWUpXG4gICAgICAgICAgICByZXR1cm4gc2l6ZXNcblxuXG4gICAgQGdldFRlbXBvcmFyeUZpbGVuYW1lOiAocHJlZml4ID0gXCJcIiwgb3V0cHV0UGF0aCA9IG51bGwsIGZpbGVFeHRlbnNpb24gPSAndG1wJykgLT5cbiAgICAgICAgb3MgPSByZXF1aXJlKCdvcycpXG4gICAgICAgIHV1aWQgPSByZXF1aXJlKCdub2RlLXV1aWQnKVxuXG4gICAgICAgIGxvb3BcbiAgICAgICAgICAgIHVuaXF1ZUlkID0gdXVpZC52NCgpXG4gICAgICAgICAgICBmaWxlbmFtZSA9IFwiI3twcmVmaXh9I3t1bmlxdWVJZH0uI3tmaWxlRXh0ZW5zaW9ufVwiXG5cbiAgICAgICAgICAgIGlmIG5vdCBvdXRwdXRQYXRoXG4gICAgICAgICAgICAgICAgb3V0cHV0UGF0aCA9IG9zLnRtcGRpcigpXG4gICAgICAgICAgICBmaWxlbmFtZSA9IHBhdGguam9pbihvdXRwdXRQYXRoLCBmaWxlbmFtZSlcblxuICAgICAgICAgICAgYnJlYWsgaWYgbm90IGZzLmV4aXN0c1N5bmMoZmlsZW5hbWUpXG5cbiAgICAgICAgcmV0dXJuIGZpbGVuYW1lXG5cblxuICAgIEBlbnN1cmVEaXJlY3RvcnlFeGlzdHM6IChwYXRocykgLT5cbiAgICAgICAgaWYgdHlwZW9mIHBhdGhzIGlzICdzdHJpbmcnXG4gICAgICAgICAgICBwYXRocyA9IFtwYXRoc11cblxuICAgICAgICBmb3IgcCBpbiBwYXRoc1xuICAgICAgICAgICAgaWYgZnMuZXhpc3RzU3luYyhwKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIHBhcnRzID0gcC5zcGxpdChwYXRoLnNlcClcblxuICAgICAgICAgICAgIyBJZiBwYXJ0WzBdIGlzIGFuIGVtcHR5IHN0cmluZywgaXQncyBEYXJ3aW4gb3IgTGludXgsIHNvIHdlIHNldCB0aGUgdG1wUGF0aCB0b1xuICAgICAgICAgICAgIyByb290IGRpcmVjdG9yeSBhcyBzdGFydGluZyBwb2ludFxuICAgICAgICAgICAgdG1wUGF0aCA9ICcnXG4gICAgICAgICAgICBpZiBwYXJ0c1swXSBpcyAnJ1xuICAgICAgICAgICAgICAgIHBhcnRzLnNoaWZ0KClcbiAgICAgICAgICAgICAgICB0bXBQYXRoID0gcGF0aC5zZXBcblxuICAgICAgICAgICAgZm9yIGZvbGRlciBpbiBwYXJ0c1xuICAgICAgICAgICAgICAgIHRtcFBhdGggKz0gKGlmIHRtcFBhdGggaW4gWycnLCBwYXRoLnNlcF0gdGhlbiAnJyBlbHNlIHBhdGguc2VwKSArIGZvbGRlclxuICAgICAgICAgICAgICAgIGlmIG5vdCBmcy5leGlzdHNTeW5jKHRtcFBhdGgpXG4gICAgICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyh0bXBQYXRoKVxuXG5cbiAgICBAZmlsZVNpemVUb1JlYWRhYmxlOiAoYnl0ZXMsIGRlY2ltYWxzID0gMikgLT5cbiAgICAgICAgaWYgdHlwZW9mIGJ5dGVzIGlzICdudW1iZXInXG4gICAgICAgICAgICBieXRlcyA9IFtieXRlc11cblxuICAgICAgICB1bml0cyA9IFsnQnl0ZXMnLCAnS0InLCAnTUInLCAnR0InLCAnVEInXVxuICAgICAgICB1bml0SW5kZXggPSAwXG4gICAgICAgIGRlY2ltYWxzID0gTWF0aC5wb3coMTAsIGRlY2ltYWxzKVxuICAgICAgICBkaXZpZGVuZCA9IGJ5dGVzWzBdXG4gICAgICAgIGRpdmlzb3IgPSAxMDI0XG5cbiAgICAgICAgd2hpbGUgZGl2aWRlbmQgPj0gZGl2aXNvclxuICAgICAgICAgICAgZGl2aXNvciA9IGRpdmlzb3IgKiAxMDI0XG4gICAgICAgICAgICB1bml0SW5kZXgrK1xuICAgICAgICBkaXZpc29yID0gZGl2aXNvciAvIDEwMjRcblxuICAgICAgICBmb3IgaSBpbiBbMC4uYnl0ZXMubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIGJ5dGVzW2ldID0gTWF0aC5yb3VuZChieXRlc1tpXSAqIGRlY2ltYWxzIC8gZGl2aXNvcikgLyBkZWNpbWFsc1xuXG4gICAgICAgIHJlYWRhYmxlID1cbiAgICAgICAgICAgIHNpemU6IGJ5dGVzXG4gICAgICAgICAgICB1bml0OiB1bml0c1t1bml0SW5kZXhdXG4gICAgICAgICAgICBkaXZpc29yOiBkaXZpc29yXG5cbiAgICAgICAgcmV0dXJuIHJlYWRhYmxlXG5cblxuICAgIEBoYXNGaWxlRXh0ZW5zaW9uOiAoZmlsZW5hbWUsIGV4dGVuc2lvbikgLT5cbiAgICAgICAgZmlsZUV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShmaWxlbmFtZSlcbiAgICAgICAgaWYgdHlwZW9mIGV4dGVuc2lvbiBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgZXh0ZW5zaW9uID0gW2V4dGVuc2lvbl1cbiAgICAgICAgcmV0dXJuIGZpbGVFeHRlbnNpb24udG9Mb3dlckNhc2UoKSBpbiBleHRlbnNpb25cbiJdfQ==
