(function() {
  var InlineParameterParser, fs, path;

  path = require('path');

  fs = require('fs');

  module.exports = InlineParameterParser = (function() {
    function InlineParameterParser() {}

    InlineParameterParser.prototype.parse = function(target, callback) {
      var firstLine, indexOfNewLine, text;
      if (typeof target === 'object' && target.constructor.name === 'TextEditor') {
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
      var params, parentFilename;
      params = this.parseParameters(line);
      if (typeof params === 'object') {
        if (typeof params.main === 'string') {
          parentFilename = path.resolve(path.dirname(this.targetFilename), params.main);
          return callback(parentFilename);
        } else {
          return callback(params);
        }
      } else {
        return callback(false);
      }
    };

    InlineParameterParser.prototype.parseParameters = function(str) {
      var key, match, params, regex, value;
      regex = /^\s*(?:(?:\/\*\s*(.*?)\s*\*\/)|(?:(?:\/\/|#|--|%)\s*(.*)))/m;
      if ((match = regex.exec(str)) !== null) {
        str = match[2] ? match[2] : match[1];
      } else {
        return false;
      }
      regex = /(?:(\!?[\w-\.]+)(?:\s*:\s*(?:(?:'(.*?)')|(?:"(.*?)")|([^,;]+)))?)*/g;
      params = [];
      while ((match = regex.exec(str)) !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (match[1] !== void 0) {
          key = match[1].trim();
          value = match[2] ? match[2] : match[3] ? match[3] : match[4];
          if (key[0] === '!') {
            key = key.substr(1);
            if (value === void 0) {
              value = 'false';
            }
          }
          params[key] = this.parseValue(value);
        }
      }
      return params;
    };

    InlineParameterParser.prototype.parseValue = function(value) {
      if (value === void 0) {
        return true;
      }
      value = value.trim();
      if (value === true || value === 'true' || value === 'yes') {
        return true;
      }
      if (value === false || value === 'false' || value === 'no') {
        return false;
      }
      if (isFinite(value)) {
        if (value.indexOf('.') > -1) {
          return parseFloat(value);
        } else {
          return parseInt(value);
        }
      }
      return value;
    };

    return InlineParameterParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2F0b20tbWluaWZ5L2xpYi9oZWxwZXIvaW5saW5lLXBhcmFtZXRlci1wYXJzZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUdMLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztvQ0FFRixLQUFBLEdBQU8sU0FBQyxNQUFELEVBQVMsUUFBVDtBQUNILFVBQUE7TUFBQSxJQUFHLE9BQU8sTUFBUCxLQUFpQixRQUFqQixJQUE4QixNQUFNLENBQUMsV0FBVyxDQUFDLElBQW5CLEtBQTJCLFlBQTVEO1FBRUksSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUE7UUFDUCxjQUFBLEdBQWlCLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYjtRQUNqQixTQUFBLEdBQVksSUFBSSxDQUFDLE1BQUwsQ0FBWSxDQUFaLEVBQWtCLGNBQUEsR0FBaUIsQ0FBQyxDQUFyQixHQUE0QixjQUE1QixHQUFnRCxNQUEvRDtlQUNaLElBQUMsQ0FBQSx1QkFBRCxDQUF5QixTQUF6QixFQUFvQyxRQUFwQyxFQUxKO09BQUEsTUFPSyxJQUFHLE9BQU8sTUFBUCxLQUFpQixRQUFwQjtRQUNELElBQUMsQ0FBQSxjQUFELEdBQWtCO2VBQ2xCLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBQyxDQUFBLGNBQWhCLEVBQWdDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsU0FBRCxFQUFZLEtBQVo7WUFDNUIsSUFBRyxLQUFIO3FCQUNJLFFBQUEsQ0FBUyxNQUFULEVBQW9CLEtBQXBCLEVBREo7YUFBQSxNQUFBO3FCQUdJLEtBQUMsQ0FBQSx1QkFBRCxDQUF5QixTQUF6QixFQUFvQyxRQUFwQyxFQUhKOztVQUQ0QjtRQUFBLENBQUEs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QUFBLENBQUEsQ0FBVCxHQUFpQixLQUFNLENBQUEsQ0FBQSxDQUF2QixHQUFrQyxLQUFNLENBQUEsQ0FBQSxDQUFULEdBQWlCLEtBQU0sQ0FBQSxDQUFBLENBQXZCLEdBQStCLEtBQU0sQ0FBQSxDQUFBO1VBQzVFLElBQUcsR0FBSSxDQUFBLENBQUEsQ0FBSixLQUFVLEdBQWI7WUFDSSxHQUFBLEdBQU0sR0FBRyxDQUFDLE1BQUosQ0FBVyxDQUFYO1lBQ04sSUFBRyxLQUFBLEtBQVMsTUFBWjtjQUNJLEtBQUEsR0FBUSxRQURaO2FBRko7O1VBSUEsTUFBTyxDQUFBLEdBQUEsQ0FBUCxHQUFjLElBQUMsQ0FBQSxVQUFELENBQVksS0FBWixFQVBsQjs7TUFKSjtBQWFBLGFBQU87SUExQk07O29DQTZCakIsVUFBQSxHQUFZLFNBQUMsS0FBRDtNQUVSLElBQUcsS0FBQSxLQUFTLE1BQVo7QUFDSSxlQUFPLEtBRFg7O01BR0EsS0FBQSxHQUFRLEtBQUssQ0FBQyxJQUFOLENBQUE7TUFFUixJQUFHLEtBQUEsS0FBVSxJQUFWLElBQUEsS0FBQSxLQUFnQixNQUFoQixJQUFBLEtBQUEsS0FBd0IsS0FBM0I7QUFDSSxlQUFPLEtBRFg7O01BR0EsSUFBRyxLQUFBLEtBQVUsS0FBVixJQUFBLEtBQUEsS0FBaUIsT0FBakIsSUFBQSxLQUFBLEtBQTBCLElBQTdCO0FBQ0ksZUFBTyxNQURYOztNQUdBLElBQUcsUUFBQSxDQUFTLEtBQVQsQ0FBSDtRQUNJLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFkLENBQUEsR0FBcUIsQ0FBQyxDQUF6QjtBQUNJLGlCQUFPLFVBQUEsQ0FBVyxLQUFYLEVBRFg7U0FBQSxNQUFBO0FBR0ksaUJBQU8sUUFBQSxDQUFTLEtBQVQsRUFIWDtTQURKOztBQVFBLGFBQU87SUFyQkM7Ozs7O0FBaEdoQiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlKCdwYXRoJylcbmZzID0gcmVxdWlyZSgnZnMnKVxuXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIElubGluZVBhcmFtZXRlclBhcnNlclxuXG4gICAgcGFyc2U6ICh0YXJnZXQsIGNhbGxiYWNrKSAtPlxuICAgICAgICBpZiB0eXBlb2YgdGFyZ2V0IGlzICdvYmplY3QnIGFuZCB0YXJnZXQuY29uc3RydWN0b3IubmFtZSBpcyAnVGV4dEVkaXRvcidcbiAgICAgICAgICAgICMgRXh0cmFjdCBmaXJzdCBsaW5lIGZyb20gYWN0aXZlIHRleHQgZWRpdG9yXG4gICAgICAgICAgICB0ZXh0ID0gdGFyZ2V0LmdldFRleHQoKVxuICAgICAgICAgICAgaW5kZXhPZk5ld0xpbmUgPSB0ZXh0LmluZGV4T2YoXCJcXG5cIilcbiAgICAgICAgICAgIGZpcnN0TGluZSA9IHRleHQuc3Vic3RyKDAsIGlmIGluZGV4T2ZOZXdMaW5lID4gLTEgdGhlbiBpbmRleE9mTmV3TGluZSBlbHNlIHVuZGVmaW5lZClcbiAgICAgICAgICAgIEBwYXJzZUZpcnN0TGluZVBhcmFtZXRlcihmaXJzdExpbmUsIGNhbGxiYWNrKVxuXG4gICAgICAgIGVsc2UgaWYgdHlwZW9mIHRhcmdldCBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgQHRhcmdldEZpbGVuYW1lID0gdGFyZ2V0XG4gICAgICAgICAgICBAcmVhZEZpcnN0TGluZSBAdGFyZ2V0RmlsZW5hbWUsIChmaXJzdExpbmUsIGVycm9yKSA9PlxuICAgICAgICAgICAgICAgIGlmIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgZXJyb3IpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAcGFyc2VGaXJzdExpbmVQYXJhbWV0ZXIoZmlyc3RMaW5lLCBjYWxsYmFjaylcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgJ0ludmFsaWQgcGFyc2VyIGNhbGwnKVxuXG5cbiAgICByZWFkRmlyc3RMaW5lOiAoZmlsZW5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBpZiAhZnMuZXhpc3RzU3luYyhmaWxlbmFtZSlcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIFwiRmlsZSBkb2VzIG5vdCBleGlzdDogI3tmaWxlbmFtZX1cIilcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgY3JlYXRlUmVhZFN0cmVhbXMgcmVhZHMgNjVLQiBibG9ja3MgYW5kIGZvciBlYWNoIGJsb2NrIGRhdGEgZXZlbnQgaXMgdHJpZ2dlcmVkLFxuICAgICAgICAjIHNvIGlmIGxhcmdlIGZpbGVzIHNob3VsZCBiZSByZWFkLCB3ZSBzdG9wIGFmdGVyIHRoZSBmaXJzdCA2NUtCIGJsb2NrIGNvbnRhaW5pbmdcbiAgICAgICAgIyB0aGUgbmV3bGluZSBjaGFyYWN0ZXJcbiAgICAgICAgbGluZSA9ICcnXG4gICAgICAgIGNhbGxlZCA9IGZhbHNlXG4gICAgICAgIHJlYWRlciA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZW5hbWUpXG4gICAgICAgIFx0Lm9uICdkYXRhJywgKGRhdGEpID0+XG4gICAgICAgICAgICAgICAgbGluZSArPSBkYXRhLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICBpbmRleE9mTmV3TGluZSA9IGxpbmUuaW5kZXhPZihcIlxcblwiKVxuICAgICAgICAgICAgICAgIGlmIGluZGV4T2ZOZXdMaW5lID4gLTFcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUuc3Vic3RyKDAsIGluZGV4T2ZOZXdMaW5lKVxuICAgICAgICAgICAgICAgICAgICBjYWxsZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIHJlYWRlci5jbG9zZSgpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGxpbmUpXG5cbiAgICAgICAgICAgIC5vbiAnZW5kJywgKCkgPT5cbiAgICAgICAgICAgICAgICBpZiBub3QgY2FsbGVkXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGxpbmUpXG5cbiAgICAgICAgICAgIC5vbiAnZXJyb3InLCAoZXJyb3IpID0+XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZXJyb3IpXG5cblxuICAgIHBhcnNlRmlyc3RMaW5lUGFyYW1ldGVyOiAobGluZSwgY2FsbGJhY2spIC0+XG4gICAgICAgIHBhcmFtcyA9IEBwYXJzZVBhcmFtZXRlcnMobGluZSlcbiAgICAgICAgaWYgdHlwZW9mIHBhcmFtcyBpcyAnb2JqZWN0J1xuICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtcy5tYWluIGlzICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgcGFyZW50RmlsZW5hbWUgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKEB0YXJnZXRGaWxlbmFtZSksIHBhcmFtcy5tYWluKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHBhcmVudEZpbGVuYW1lKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHBhcmFtcylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpXG5cblxuICAgIHBhcnNlUGFyYW1ldGVyczogKHN0cikgLT5cbiAgICAgICAgIyBFeHRyYWN0IGNvbW1lbnQgYmxvY2ssIGlmIGNvbW1lbnQgaXMgcHV0IGludG8gLyogLi4uICovIG9yIGFmdGVyIC8vLCAjLCAtLSBvciAmXG4gICAgICAgIHJlZ2V4ID0gL15cXHMqKD86KD86XFwvXFwqXFxzKiguKj8pXFxzKlxcKlxcLyl8KD86KD86XFwvXFwvfCN8LS18JSlcXHMqKC4qKSkpL21cbiAgICAgICAgaWYgKG1hdGNoID0gcmVnZXguZXhlYyhzdHIpKSAhPSBudWxsXG4gICAgICAgICAgICBzdHIgPSBpZiBtYXRjaFsyXSB0aGVuIG1hdGNoWzJdIGVsc2UgbWF0Y2hbMV1cblxuICAgICAgICAjIC4uLiB0aGVyZSBpcyBubyBjb21tZW50IGF0IGFsbFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgICAjIEV4dHJhY3Qga2V5cyBhbmQgdmFsdWVzXG4gICAgICAgIHJlZ2V4ID0gLyg/OihcXCE/W1xcdy1cXC5dKykoPzpcXHMqOlxccyooPzooPzonKC4qPyknKXwoPzpcIiguKj8pXCIpfChbXiw7XSspKSk/KSovZ1xuICAgICAgICBwYXJhbXMgPSBbXVxuICAgICAgICB3aGlsZSAobWF0Y2ggPSByZWdleC5leGVjKHN0cikpIGlzbnQgbnVsbFxuICAgICAgICAgICAgaWYgbWF0Y2guaW5kZXggPT0gcmVnZXgubGFzdEluZGV4XG4gICAgICAgICAgICAgICAgcmVnZXgubGFzdEluZGV4KytcblxuICAgICAgICAgICAgaWYgbWF0Y2hbMV0gIT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAga2V5ID0gbWF0Y2hbMV0udHJpbSgpXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBpZiBtYXRjaFsyXSB0aGVuIG1hdGNoWzJdIGVsc2UgaWYgbWF0Y2hbM10gdGhlbiBtYXRjaFszXSBlbHNlIG1hdGNoWzRdXG4gICAgICAgICAgICAgICAgaWYga2V5WzBdIGlzICchJ1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBrZXkuc3Vic3RyKDEpXG4gICAgICAgICAgICAgICAgICAgIGlmIHZhbHVlIGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAnZmFsc2UnXG4gICAgICAgICAgICAgICAgcGFyYW1zW2tleV0gPSBAcGFyc2VWYWx1ZSh2YWx1ZSlcblxuICAgICAgICByZXR1cm4gcGFyYW1zXG5cblxuICAgIHBhcnNlVmFsdWU6ICh2YWx1ZSkgLT5cbiAgICAgICAgIyB1bmRlZmluZWQgaXMgYSBzcGVjaWFsIHZhbHVlIHRoYXQgbWVhbnMsIHRoYXQgdGhlIGtleSBpcyBkZWZpbmVkLCBidXQgbm8gdmFsdWVcbiAgICAgICAgaWYgdmFsdWUgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpXG5cbiAgICAgICAgaWYgdmFsdWUgaW4gW3RydWUsICd0cnVlJywgJ3llcyddXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICAgIGlmIHZhbHVlIGluIFtmYWxzZSwgJ2ZhbHNlJywgJ25vJ11cbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgIGlmIGlzRmluaXRlKHZhbHVlKVxuICAgICAgICAgICAgaWYgdmFsdWUuaW5kZXhPZignLicpID4gLTFcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpXG5cbiAgICAgICAgIyBUT0RPOiBFeHRlbmQgZm9yIGFycmF5IGFuZCBvYmplY3RzP1xuXG4gICAgICAgIHJldHVybiB2YWx1ZVxuIl19
