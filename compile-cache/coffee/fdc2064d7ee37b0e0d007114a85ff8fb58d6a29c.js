(function() {
  var ArgumentParser, InlineParameterParser, fs, path;

  path = require('path');

  fs = require('fs');

  ArgumentParser = require('./argument-parser');

  module.exports = InlineParameterParser = (function() {
    function InlineParameterParser() {}

    InlineParameterParser.prototype.parse = function(target, callback) {
      var firstLine, indexOfNewLine, text;
      if (typeof target === 'object' && target.constructor.name === 'TextEditor') {
        this.targetFilename = target.getURI();
        text = target.getText();
        indexOfNewLine = text.indexOf("\n");
        firstLine = text.substr(0, indexOfNewLine > -1 ? indexOfNewLine : void 0);
        return this.parseFirstLineParameter(firstLine, callback);
      } else if (typeof target === 'string') {
        this.targetFilename = target;
        return this.readFirstLine(this.targetFilename, (function(_this) {
          return function(firstLine, error) {
            if (error) {
              return callback(void 0, error);
            } else {
              return _this.parseFirstLineParameter(firstLine, callback);
            }
          };
        })(this));
      } else {
        return callback(false, 'Invalid parser call');
      }
    };

    InlineParameterParser.prototype.readFirstLine = function(filename, callback) {
      var called, line, reader;
      if (!fs.existsSync(filename)) {
        callback(null, "File does not exist: " + filename);
        return;
      }
      line = '';
      called = false;
      return reader = fs.createReadStream(filename).on('data', (function(_this) {
        return function(data) {
          var indexOfNewLine;
          line += data.toString();
          indexOfNewLine = line.indexOf("\n");
          if (indexOfNewLine > -1) {
            line = line.substr(0, indexOfNewLine);
            called = true;
            reader.close();
            return callback(line);
          }
        };
      })(this)).on('end', (function(_this) {
        return function() {
          if (!called) {
            return callback(line);
          }
        };
      })(this)).on('error', (function(_this) {
        return function(error) {
          return callback(null, error);
        };
      })(this));
    };

    InlineParameterParser.prototype.parseFirstLineParameter = function(line, callback) {
      var params;
      params = this.parseParameters(line);
      if (typeof params === 'object') {
        if (typeof params.main === 'string') {
          if (this.targetFilename && !path.isAbsolute(params.main)) {
            params.main = path.resolve(path.dirname(this.targetFilename), params.main);
          }
          return callback(params);
        } else {
          return callback(params);
        }
      } else {
        return callback(false);
      }
    };

    InlineParameterParser.prototype.parseParameters = function(str) {
      var argumentParser, i, j, key, match, params, regex, value;
      regex = /^\s*(?:(?:\/\*\s*(.*?)\s*\*\/)|(?:\/\/\s*(.*)))/m;
      if ((match = regex.exec(str)) !== null) {
        str = match[2] ? match[2] : match[1];
      } else {
        return false;
      }
      argumentParser = new ArgumentParser();
      regex = /(?:(\!?[\w-\.]+)(?:\s*:\s*(?:(\[.*\])|({.*})|(?:'(.*?)')|(?:"(.*?)")|([^,;]+)))?)*/g;
      params = [];
      while ((match = regex.exec(str)) !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (match[1] !== void 0) {
          key = match[1].trim();
          for (i = j = 2; j <= 6; i = ++j) {
            if (match[i]) {
              value = match[i];
              break;
            }
          }
          if (key[0] === '!') {
            key = key.substr(1);
            if (value === void 0) {
              value = 'false';
            }
          }
          params[key] = argumentParser.parseValue(value);
        }
      }
      return params;
    };

    return InlineParameterParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL2hlbHBlci9pbmxpbmUtcGFyYW1ldGVycy1wYXJzZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSOztFQUdqQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7b0NBRUYsS0FBQSxHQUFPLFNBQUMsTUFBRCxFQUFTLFFBQVQ7QUFDSCxVQUFBO01BQUEsSUFBRyxPQUFPLE1BQVAsS0FBaUIsUUFBakIsSUFBOEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFuQixLQUEyQixZQUE1RDtRQUNJLElBQUMsQ0FBQSxjQUFELEdBQWtCLE1BQU0sQ0FBQyxNQUFQLENBQUE7UUFHbEIsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7UUFDUCxjQUFBLEdBQWlCLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYjtRQUNqQixTQUFBLEdBQVksSUFBSSxDQUFDLE1BQUwsQ0FBWSxDQUFaLEVBQWtCLGNBQUEsR0FBaUIsQ0FBQyxDQUFyQixHQUE0QixjQUE1QixHQUFnRCxNQUEvRDtlQUNaLElBQUMsQ0FBQSx1QkFBRCxDQUF5QixTQUF6QixFQUFvQyxRQUFwQyxFQVBKO09BQUEsTUFTSyxJQUFHLE9BQU8sTUFBUCxLQUFpQixRQUFwQjtRQUNELElBQUMsQ0FBQSxjQUFELEdBQWtCO2VBQ2xCLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBQyxDQUFBLGNBQWhCLEVBQWdDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsU0FBRCxFQUFZLEtBQVo7WUFDNUIsSUFBRyxLQUFIO3FCQUNJLFFBQUEsQ0FBUyxNQUFULEVBQW9CLEtB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QVcsR0FBWCxDQUFULENBQUEsS0FBK0IsSUFBckM7UUFDSSxJQUFHLEtBQUssQ0FBQyxLQUFOLEtBQWUsS0FBSyxDQUFDLFNBQXhCO1VBQ0ksS0FBSyxDQUFDLFNBQU4sR0FESjs7UUFHQSxJQUFHLEtBQU0sQ0FBQSxDQUFBLENBQU4sS0FBWSxNQUFmO1VBQ0ksR0FBQSxHQUFNLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFULENBQUE7QUFDTixlQUFTLDBCQUFUO1lBQ0ksSUFBRyxLQUFNLENBQUEsQ0FBQSxDQUFUO2NBQ0ksS0FBQSxHQUFRLEtBQU0sQ0FBQSxDQUFBO0FBQ2Qsb0JBRko7O0FBREo7VUFJQSxJQUFHLEdBQUksQ0FBQSxDQUFBLENBQUosS0FBVSxHQUFiO1lBQ0ksR0FBQSxHQUFNLEdBQUcsQ0FBQyxNQUFKLENBQVcsQ0FBWDtZQUNOLElBQUcsS0FBQSxLQUFTLE1BQVo7Y0FDSSxLQUFBLEdBQVEsUUFEWjthQUZKOztVQUlBLE1BQU8sQ0FBQSxHQUFBLENBQVAsR0FBYyxjQUFjLENBQUMsVUFBZixDQUEwQixLQUExQixFQVZsQjs7TUFKSjtBQWdCQSxhQUFPO0lBaENNOzs7OztBQXhFckIiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5mcyA9IHJlcXVpcmUoJ2ZzJylcblxuQXJndW1lbnRQYXJzZXIgPSByZXF1aXJlKCcuL2FyZ3VtZW50LXBhcnNlcicpXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgSW5saW5lUGFyYW1ldGVyUGFyc2VyXG5cbiAgICBwYXJzZTogKHRhcmdldCwgY2FsbGJhY2spIC0+XG4gICAgICAgIGlmIHR5cGVvZiB0YXJnZXQgaXMgJ29iamVjdCcgYW5kIHRhcmdldC5jb25zdHJ1Y3Rvci5uYW1lIGlzICdUZXh0RWRpdG9yJ1xuICAgICAgICAgICAgQHRhcmdldEZpbGVuYW1lID0gdGFyZ2V0LmdldFVSSSgpXG5cbiAgICAgICAgICAgICMgRXh0cmFjdCBmaXJzdCBsaW5lIGZyb20gYWN0aXZlIHRleHQgZWRpdG9yXG4gICAgICAgICAgICB0ZXh0ID0gdGFyZ2V0LmdldFRleHQoKVxuICAgICAgICAgICAgaW5kZXhPZk5ld0xpbmUgPSB0ZXh0LmluZGV4T2YoXCJcXG5cIilcbiAgICAgICAgICAgIGZpcnN0TGluZSA9IHRleHQuc3Vic3RyKDAsIGlmIGluZGV4T2ZOZXdMaW5lID4gLTEgdGhlbiBpbmRleE9mTmV3TGluZSBlbHNlIHVuZGVmaW5lZClcbiAgICAgICAgICAgIEBwYXJzZUZpcnN0TGluZVBhcmFtZXRlcihmaXJzdExpbmUsIGNhbGxiYWNrKVxuXG4gICAgICAgIGVsc2UgaWYgdHlwZW9mIHRhcmdldCBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgQHRhcmdldEZpbGVuYW1lID0gdGFyZ2V0XG4gICAgICAgICAgICBAcmVhZEZpcnN0TGluZSBAdGFyZ2V0RmlsZW5hbWUsIChmaXJzdExpbmUsIGVycm9yKSA9PlxuICAgICAgICAgICAgICAgIGlmIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgZXJyb3IpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAcGFyc2VGaXJzdExpbmVQYXJhbWV0ZXIoZmlyc3RMaW5lLCBjYWxsYmFjaylcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgJ0ludmFsaWQgcGFyc2VyIGNhbGwnKVxuXG5cbiAgICByZWFkRmlyc3RMaW5lOiAoZmlsZW5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBpZiAhZnMuZXhpc3RzU3luYyhmaWxlbmFtZSlcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIFwiRmlsZSBkb2VzIG5vdCBleGlzdDogI3tmaWxlbmFtZX1cIilcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgY3JlYXRlUmVhZFN0cmVhbXMgcmVhZHMgNjVLQiBibG9ja3MgYW5kIGZvciBlYWNoIGJsb2NrIGRhdGEgZXZlbnQgaXMgdHJpZ2dlcmVkLFxuICAgICAgICAjIHNvIGlmIGxhcmdlIGZpbGVzIHNob3VsZCBiZSByZWFkLCB3ZSBzdG9wIGFmdGVyIHRoZSBmaXJzdCA2NUtCIGJsb2NrIGNvbnRhaW5pbmdcbiAgICAgICAgIyB0aGUgbmV3bGluZSBjaGFyYWN0ZXJcbiAgICAgICAgbGluZSA9ICcnXG4gICAgICAgIGNhbGxlZCA9IGZhbHNlXG4gICAgICAgIHJlYWRlciA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZW5hbWUpXG4gICAgICAgIFx0Lm9uICdkYXRhJywgKGRhdGEpID0+XG4gICAgICAgICAgICAgICAgbGluZSArPSBkYXRhLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICBpbmRleE9mTmV3TGluZSA9IGxpbmUuaW5kZXhPZihcIlxcblwiKVxuICAgICAgICAgICAgICAgIGlmIGluZGV4T2ZOZXdMaW5lID4gLTFcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUuc3Vic3RyKDAsIGluZGV4T2ZOZXdMaW5lKVxuICAgICAgICAgICAgICAgICAgICBjYWxsZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIHJlYWRlci5jbG9zZSgpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGxpbmUpXG5cbiAgICAgICAgICAgIC5vbiAnZW5kJywgKCkgPT5cbiAgICAgICAgICAgICAgICBpZiBub3QgY2FsbGVkXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGxpbmUpXG5cbiAgICAgICAgICAgIC5vbiAnZXJyb3InLCAoZXJyb3IpID0+XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZXJyb3IpXG5cblxuICAgIHBhcnNlRmlyc3RMaW5lUGFyYW1ldGVyOiAobGluZSwgY2FsbGJhY2spIC0+XG4gICAgICAgIHBhcmFtcyA9IEBwYXJzZVBhcmFtZXRlcnMobGluZSlcbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcyBpcyAnb2JqZWN0J1xuICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5tYWluIGlzICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgaWYgQHRhcmdldEZpbGVuYW1lIGFuZCBub3QgcGF0aC5pc0Fic29sdXRlKHBhcmFtcy5tYWluKVxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMubWFpbiA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoQHRhcmdldEZpbGVuYW1lKSwgcGFyYW1zLm1haW4pXG4gICAgICAgICAgICAgICAgY2FsbGJhY2socGFyYW1zKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHBhcmFtcylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpXG5cblxuICAgIHBhcnNlUGFyYW1ldGVyczogKHN0cikgLT5cbiAgICAgICAgIyBFeHRyYWN0IGNvbW1lbnQgYmxvY2ssIGlmIGNvbW1lbnQgaXMgcHV0IGludG8gLyogLi4uICovIG9yIGFmdGVyIC8vXG4gICAgICAgIHJlZ2V4ID0gL15cXHMqKD86KD86XFwvXFwqXFxzKiguKj8pXFxzKlxcKlxcLyl8KD86XFwvXFwvXFxzKiguKikpKS9tXG4gICAgICAgIGlmIChtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyKSkgIT0gbnVsbFxuICAgICAgICAgICAgc3RyID0gaWYgbWF0Y2hbMl0gdGhlbiBtYXRjaFsyXSBlbHNlIG1hdGNoWzFdXG5cbiAgICAgICAgIyAuLi4gdGhlcmUgaXMgbm8gY29tbWVudCBhdCBhbGxcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgYXJndW1lbnRQYXJzZXIgPSBuZXcgQXJndW1lbnRQYXJzZXIoKVxuXG4gICAgICAgICMgRXh0cmFjdCBrZXlzIGFuZCB2YWx1ZXNcbiAgICAgICAgcmVnZXggPSAvKD86KFxcIT9bXFx3LVxcLl0rKSg/Olxccyo6XFxzKig/OihcXFsuKlxcXSl8KHsuKn0pfCg/OicoLio/KScpfCg/OlwiKC4qPylcIil8KFteLDtdKykpKT8pKi9nXG5cbiAgICAgICAgcGFyYW1zID0gW11cbiAgICAgICAgd2hpbGUgKG1hdGNoID0gcmVnZXguZXhlYyhzdHIpKSBpc250IG51bGxcbiAgICAgICAgICAgIGlmIG1hdGNoLmluZGV4ID09IHJlZ2V4Lmxhc3RJbmRleFxuICAgICAgICAgICAgICAgIHJlZ2V4Lmxhc3RJbmRleCsrXG5cbiAgICAgICAgICAgIGlmIG1hdGNoWzFdICE9IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIGtleSA9IG1hdGNoWzFdLnRyaW0oKVxuICAgICAgICAgICAgICAgIGZvciBpIGluIFsyLi42XVxuICAgICAgICAgICAgICAgICAgICBpZiBtYXRjaFtpXVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaFtpXVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBpZiBrZXlbMF0gaXMgJyEnXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGtleS5zdWJzdHIoMSlcbiAgICAgICAgICAgICAgICAgICAgaWYgdmFsdWUgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9ICdmYWxzZSdcbiAgICAgICAgICAgICAgICBwYXJhbXNba2V5XSA9IGFyZ3VtZW50UGFyc2VyLnBhcnNlVmFsdWUodmFsdWUpXG5cbiAgICAgICAgcmV0dXJuIHBhcmFtc1xuIl19
