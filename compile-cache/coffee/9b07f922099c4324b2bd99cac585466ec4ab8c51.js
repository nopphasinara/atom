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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL2hlbHBlci9maWxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsY0FBQTtJQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBR1AsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBRUYsSUFBQyxFQUFBLE1BQUEsRUFBRCxHQUFTLFNBQUMsS0FBRDtBQUdMLFVBQUE7TUFBQSxJQUFHLE9BQU8sS0FBUCxLQUFnQixRQUFuQjtRQUNJLEtBQUEsR0FBUSxDQUFDLEtBQUQsRUFEWjs7TUFHQSxJQUFHLE9BQU8sS0FBUCxLQUFnQixRQUFuQjtBQUNJO2FBQUEsdUNBQUE7O1VBQ0ksSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLElBQWQsQ0FBSDtBQUNJOzJCQUNJLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBZCxHQURKO2FBQUEsYUFBQTtjQUVNLFVBRk47YUFESjtXQUFBLE1BQUE7aUNBQUE7O0FBREo7dUJBREo7O0lBTks7O0lBZVQsSUFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLFNBQUQ7QUFDVixVQUFBO01BQUEsUUFBQSxHQUFXLFNBQUMsUUFBRDtRQUNQLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQUg7QUFDSSxpQkFBTyxFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosQ0FBc0IsQ0FBQSxNQUFBLEVBRGpDO1NBQUEsTUFBQTtBQUdJLGlCQUFPLENBQUMsRUFIWjs7TUFETztNQU1YLElBQUcsT0FBTyxTQUFQLEtBQW9CLFFBQXZCO0FBQ0ksZUFBTyxRQUFBLENBQVMsU0FBVCxFQURYO09BQUEsTUFBQTtRQUdJLEtBQUEsR0FBUTtBQUNSLGFBQUEsMkNBQUE7O1VBQ0ksS0FBTSxDQUFBLFFB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QyxRQUFELEVBQVcsU0FBWDtBQUNmLFVBQUE7TUFBQSxJQUFvQixPQUFPLFFBQVAsS0FBbUIsUUFBdkM7QUFBQSxlQUFPLE1BQVA7O01BQ0EsYUFBQSxHQUFnQixJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWI7TUFDaEIsSUFBRyxPQUFPLFNBQVAsS0FBb0IsUUFBdkI7UUFDSSxTQUFBLEdBQVksQ0FBQyxTQUFELEVBRGhCOztBQUVBLG1CQUFPLGFBQWEsQ0FBQyxXQUFkLENBQUEsQ0FBQSxFQUFBLGFBQStCLFNBQS9CLEVBQUEsR0FBQTtJQUxROzs7OztBQXhHdkIiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUoJ2ZzJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBGaWxlXG5cbiAgICBAZGVsZXRlOiAoZmlsZXMpIC0+XG4gICAgICAgICMgaWYgZmlsZSBpcyBhIHNpbmdsZSBmaWxlbmFtZSB0aGVuIHdlIHdyYXAgaXQgaW50byBhbiBhcnJheSBhbmQgaW5cbiAgICAgICAgIyBuZXh0IHN0ZXAgd2UgZGVsZXRlIGFuIGFycmF5IG9mIGZpbGVcbiAgICAgICAgaWYgdHlwZW9mIGZpbGVzIGlzICdzdHJpbmcnXG4gICAgICAgICAgICBmaWxlcyA9IFtmaWxlc11cblxuICAgICAgICBpZiB0eXBlb2YgZmlsZXMgaXMgJ29iamVjdCdcbiAgICAgICAgICAgIGZvciBmaWxlIGluIGZpbGVzXG4gICAgICAgICAgICAgICAgaWYgZnMuZXhpc3RzU3luYyhmaWxlKVxuICAgICAgICAgICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICAgICAgICAgIGZzLnVubGlua1N5bmMoZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBkbyBub3RoaW5nIGhlcmUsIGlmIGFuIGVycm9yIG9jY3Vyc1xuXG5cbiAgICBAZ2V0RmlsZVNpemU6IChmaWxlbmFtZXMpIC0+XG4gICAgICAgIGZpbGVTaXplID0gKGZpbGVuYW1lKSAtPlxuICAgICAgICAgICAgaWYgZnMuZXhpc3RzU3luYyhmaWxlbmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZnMuc3RhdFN5bmMoZmlsZW5hbWUpWydzaXplJ11cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gLTFcblxuICAgICAgICBpZiB0eXBlb2YgZmlsZW5hbWVzIGlzICdzdHJpbmcnXG4gICAgICAgICAgICByZXR1cm4gZmlsZVNpemUoZmlsZW5hbWVzKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzaXplcyA9IHt9XG4gICAgICAgICAgICBmb3IgZmlsZW5hbWUgaW4gZmlsZW5hbWVzXG4gICAgICAgICAgICAgICAgc2l6ZXNbZmlsZW5hbWVdID0gZmlsZVNpemUoZmlsZW5hbWUpXG4gICAgICAgICAgICByZXR1cm4gc2l6ZXNcblxuXG4gICAgQGdldFRlbXBvcmFyeUZpbGVuYW1lOiAocHJlZml4ID0gXCJcIiwgb3V0cHV0UGF0aCA9IG51bGwsIGZpbGVFeHRlbnNpb24gPSAndG1wJykgLT5cbiAgICAgICAgb3MgPSByZXF1aXJlKCdvcycpXG4gICAgICAgIHV1aWQgPSByZXF1aXJlKCdub2RlLXV1aWQnKVxuXG4gICAgICAgIGxvb3BcbiAgICAgICAgICAgIHVuaXF1ZUlkID0gdXVpZC52NCgpXG4gICAgICAgICAgICBmaWxlbmFtZSA9IFwiI3twcmVmaXh9I3t1bmlxdWVJZH0uI3tmaWxlRXh0ZW5zaW9ufVwiXG5cbiAgICAgICAgICAgIGlmIG5vdCBvdXRwdXRQYXRoXG4gICAgICAgICAgICAgICAgb3V0cHV0UGF0aCA9IG9zLnRtcGRpcigpXG4gICAgICAgICAgICBmaWxlbmFtZSA9IHBhdGguam9pbihvdXRwdXRQYXRoLCBmaWxlbmFtZSlcblxuICAgICAgICAgICAgYnJlYWsgaWYgbm90IGZzLmV4aXN0c1N5bmMoZmlsZW5hbWUpXG5cbiAgICAgICAgcmV0dXJuIGZpbGVuYW1lXG5cblxuICAgIEBlbnN1cmVEaXJlY3RvcnlFeGlzdHM6IChwYXRocykgLT5cbiAgICAgICAgaWYgdHlwZW9mIHBhdGhzIGlzICdzdHJpbmcnXG4gICAgICAgICAgICBwYXRocyA9IFtwYXRoc11cblxuICAgICAgICBmb3IgcCBpbiBwYXRoc1xuICAgICAgICAgICAgaWYgZnMuZXhpc3RzU3luYyhwKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIHBhcnRzID0gcC5zcGxpdChwYXRoLnNlcClcblxuICAgICAgICAgICAgIyBJZiBwYXJ0WzBdIGlzIGFuIGVtcHR5IHN0cmluZywgaXQncyBEYXJ3aW4gb3IgTGludXgsIHNvIHdlIHNldCB0aGUgdG1wUGF0aCB0b1xuICAgICAgICAgICAgIyByb290IGRpcmVjdG9yeSBhcyBzdGFydGluZyBwb2ludFxuICAgICAgICAgICAgdG1wUGF0aCA9ICcnXG4gICAgICAgICAgICBpZiBwYXJ0c1swXSBpcyAnJ1xuICAgICAgICAgICAgICAgIHBhcnRzLnNoaWZ0KClcbiAgICAgICAgICAgICAgICB0bXBQYXRoID0gcGF0aC5zZXBcblxuICAgICAgICAgICAgZm9yIGZvbGRlciBpbiBwYXJ0c1xuICAgICAgICAgICAgICAgIHRtcFBhdGggKz0gKGlmIHRtcFBhdGggaW4gWycnLCBwYXRoLnNlcF0gdGhlbiAnJyBlbHNlIHBhdGguc2VwKSArIGZvbGRlclxuICAgICAgICAgICAgICAgIGlmIG5vdCBmcy5leGlzdHNTeW5jKHRtcFBhdGgpXG4gICAgICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyh0bXBQYXRoKVxuXG5cbiAgICBAZmlsZVNpemVUb1JlYWRhYmxlOiAoYnl0ZXMsIGRlY2ltYWxzID0gMikgLT5cbiAgICAgICAgaWYgdHlwZW9mIGJ5dGVzIGlzICdudW1iZXInXG4gICAgICAgICAgICBieXRlcyA9IFtieXRlc11cblxuICAgICAgICB1bml0cyA9IFsnQnl0ZXMnLCAnS0InLCAnTUInLCAnR0InLCAnVEInXVxuICAgICAgICB1bml0SW5kZXggPSAwXG4gICAgICAgIGRlY2ltYWxzID0gTWF0aC5wb3coMTAsIGRlY2ltYWxzKVxuICAgICAgICBkaXZpZGVuZCA9IGJ5dGVzWzBdXG4gICAgICAgIGRpdmlzb3IgPSAxMDI0XG5cbiAgICAgICAgd2hpbGUgZGl2aWRlbmQgPj0gZGl2aXNvclxuICAgICAgICAgICAgZGl2aXNvciA9IGRpdmlzb3IgKiAxMDI0XG4gICAgICAgICAgICB1bml0SW5kZXgrK1xuICAgICAgICBkaXZpc29yID0gZGl2aXNvciAvIDEwMjRcblxuICAgICAgICBmb3IgaSBpbiBbMC4uYnl0ZXMubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIGJ5dGVzW2ldID0gTWF0aC5yb3VuZChieXRlc1tpXSAqIGRlY2ltYWxzIC8gZGl2aXNvcikgLyBkZWNpbWFsc1xuXG4gICAgICAgIHJlYWRhYmxlID1cbiAgICAgICAgICAgIHNpemU6IGJ5dGVzXG4gICAgICAgICAgICB1bml0OiB1bml0c1t1bml0SW5kZXhdXG4gICAgICAgICAgICBkaXZpc29yOiBkaXZpc29yXG5cbiAgICAgICAgcmV0dXJuIHJlYWRhYmxlXG5cblxuICAgIEBoYXNGaWxlRXh0ZW5zaW9uOiAoZmlsZW5hbWUsIGV4dGVuc2lvbikgLT5cbiAgICAgICAgcmV0dXJuIGZhbHNlIHVubGVzcyB0eXBlb2YgZmlsZW5hbWUgPT0gJ3N0cmluZydcbiAgICAgICAgZmlsZUV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShmaWxlbmFtZSlcbiAgICAgICAgaWYgdHlwZW9mIGV4dGVuc2lvbiBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgZXh0ZW5zaW9uID0gW2V4dGVuc2lvbl1cbiAgICAgICAgcmV0dXJuIGZpbGVFeHRlbnNpb24udG9Mb3dlckNhc2UoKSBpbiBleHRlbnNpb25cbiJdfQ==
