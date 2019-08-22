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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9zYXNzLWF1dG9jb21waWxlL2xpYi9oZWxwZXIvaW5saW5lLXBhcmFtZXRlcnMtcGFyc2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUjs7RUFHakIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O29DQUVGLEtBQUEsR0FBTyxTQUFDLE1BQUQsRUFBUyxRQUFUO0FBQ0gsVUFBQTtNQUFBLElBQUcsT0FBTyxNQUFQLEtBQWlCLFFBQWpCLElBQThCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBbkIsS0FBMkIsWUFBNUQ7UUFDSSxJQUFDLENBQUEsY0FBRCxHQUFrQixNQUFNLENBQUMsTUFBUCxDQUFBO1FBR2xCLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBO1FBQ1AsY0FBQSxHQUFpQixJQUFJLENBQUMsT0FBTCxDQUFhLElBQWI7UUFDakIsU0FBQSxHQUFZLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBWixFQUFrQixjQUFBLEdBQWlCLENBQUMsQ0FBckIsR0FBNEIsY0FBNUIsR0FBZ0QsTUFBL0Q7ZUFDWixJQUFDLENBQUEsdUJBQUQsQ0FBeUIsU0FBekIsRUFBb0MsUUFBcEMsRUFQSjtPQUFBLE1BU0ssSUFBRyxPQUFPLE1BQVAsS0FBaUIsUUFBcEI7UUFDRCxJQUFDLENBQUEsY0FBRCxHQUFrQjtlQUNsQixJQUFDLENBQUEsYUFBRCxDQUFlLElBQUMsQ0FBQSxjQUFoQixFQUFnQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLFNBQUQsRUFBWSxLQUFaO1lBQzVCLElBQUcsS0FBSDtxQkFDSSxRQUFBLENBQVMsTUFBVCxFQUFvQixLQUFwQixFQURK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Q0FBVCxDQUFBLEtBQStCLElBQXJDO1FBQ0ksSUFBRyxLQUFLLENBQUMsS0FBTixLQUFlLEtBQUssQ0FBQyxTQUF4QjtVQUNJLEtBQUssQ0FBQyxTQUFOLEdBREo7O1FBR0EsSUFBRyxLQUFNLENBQUEsQ0FBQSxDQUFOLEtBQVksTUFBZjtVQUNJLEdBQUEsR0FBTSxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBVCxDQUFBO0FBQ04sZUFBUywwQkFBVDtZQUNJLElBQUcsS0FBTSxDQUFBLENBQUEsQ0FBVDtjQUNJLEtBQUEsR0FBUSxLQUFNLENBQUEsQ0FBQTtBQUNkLG9CQUZKOztBQURKO1VBSUEsSUFBRyxHQUFJLENBQUEsQ0FBQSxDQUFKLEtBQVUsR0FBYjtZQUNJLEdBQUEsR0FBTSxHQUFHLENBQUMsTUFBSixDQUFXLENBQVg7WUFDTixJQUFHLEtBQUEsS0FBUyxNQUFaO2NBQ0ksS0FBQSxHQUFRLFFBRFo7YUFGSjs7VUFJQSxNQUFPLENBQUEsR0FBQSxDQUFQLEdBQWMsY0FBYyxDQUFDLFVBQWYsQ0FBMEIsS0FBMUIsRUFWbEI7O01BSko7QUFnQkEsYUFBTztJQWhDTTs7Ozs7QUF4RXJCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuZnMgPSByZXF1aXJlKCdmcycpXG5cbkFyZ3VtZW50UGFyc2VyID0gcmVxdWlyZSgnLi9hcmd1bWVudC1wYXJzZXInKVxuXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIElubGluZVBhcmFtZXRlclBhcnNlclxuXG4gICAgcGFyc2U6ICh0YXJnZXQsIGNhbGxiYWNrKSAtPlxuICAgICAgICBpZiB0eXBlb2YgdGFyZ2V0IGlzICdvYmplY3QnIGFuZCB0YXJnZXQuY29uc3RydWN0b3IubmFtZSBpcyAnVGV4dEVkaXRvcidcbiAgICAgICAgICAgIEB0YXJnZXRGaWxlbmFtZSA9IHRhcmdldC5nZXRVUkkoKVxuXG4gICAgICAgICAgICAjIEV4dHJhY3QgZmlyc3QgbGluZSBmcm9tIGFjdGl2ZSB0ZXh0IGVkaXRvclxuICAgICAgICAgICAgdGV4dCA9IHRhcmdldC5nZXRUZXh0KClcbiAgICAgICAgICAgIGluZGV4T2ZOZXdMaW5lID0gdGV4dC5pbmRleE9mKFwiXFxuXCIpXG4gICAgICAgICAgICBmaXJzdExpbmUgPSB0ZXh0LnN1YnN0cigwLCBpZiBpbmRleE9mTmV3TGluZSA+IC0xIHRoZW4gaW5kZXhPZk5ld0xpbmUgZWxzZSB1bmRlZmluZWQpXG4gICAgICAgICAgICBAcGFyc2VGaXJzdExpbmVQYXJhbWV0ZXIoZmlyc3RMaW5lLCBjYWxsYmFjaylcblxuICAgICAgICBlbHNlIGlmIHR5cGVvZiB0YXJnZXQgaXMgJ3N0cmluZydcbiAgICAgICAgICAgIEB0YXJnZXRGaWxlbmFtZSA9IHRhcmdldFxuICAgICAgICAgICAgQHJlYWRGaXJzdExpbmUgQHRhcmdldEZpbGVuYW1lLCAoZmlyc3RMaW5lLCBlcnJvcikgPT5cbiAgICAgICAgICAgICAgICBpZiBlcnJvclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh1bmRlZmluZWQsIGVycm9yKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQHBhcnNlRmlyc3RMaW5lUGFyYW1ldGVyKGZpcnN0TGluZSwgY2FsbGJhY2spXG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsICdJbnZhbGlkIHBhcnNlciBjYWxsJylcblxuXG4gICAgcmVhZEZpcnN0TGluZTogKGZpbGVuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAgICAgaWYgIWZzLmV4aXN0c1N5bmMoZmlsZW5hbWUpXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBcIkZpbGUgZG9lcyBub3QgZXhpc3Q6ICN7ZmlsZW5hbWV9XCIpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAjIGNyZWF0ZVJlYWRTdHJlYW1zIHJlYWRzIDY1S0IgYmxvY2tzIGFuZCBmb3IgZWFjaCBibG9jayBkYXRhIGV2ZW50IGlzIHRyaWdnZXJlZCxcbiAgICAgICAgIyBzbyBpZiBsYXJnZSBmaWxlcyBzaG91bGQgYmUgcmVhZCwgd2Ugc3RvcCBhZnRlciB0aGUgZmlyc3QgNjVLQiBibG9jayBjb250YWluaW5nXG4gICAgICAgICMgdGhlIG5ld2xpbmUgY2hhcmFjdGVyXG4gICAgICAgIGxpbmUgPSAnJ1xuICAgICAgICBjYWxsZWQgPSBmYWxzZVxuICAgICAgICByZWFkZXIgPSBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVuYW1lKVxuICAgICAgICBcdC5vbiAnZGF0YScsIChkYXRhKSA9PlxuICAgICAgICAgICAgICAgIGxpbmUgKz0gZGF0YS50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgaW5kZXhPZk5ld0xpbmUgPSBsaW5lLmluZGV4T2YoXCJcXG5cIilcbiAgICAgICAgICAgICAgICBpZiBpbmRleE9mTmV3TGluZSA+IC0xXG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lLnN1YnN0cigwLCBpbmRleE9mTmV3TGluZSlcbiAgICAgICAgICAgICAgICAgICAgY2FsbGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICByZWFkZXIuY2xvc2UoKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhsaW5lKVxuXG4gICAgICAgICAgICAub24gJ2VuZCcsICgpID0+XG4gICAgICAgICAgICAgICAgaWYgbm90IGNhbGxlZFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhsaW5lKVxuXG4gICAgICAgICAgICAub24gJ2Vycm9yJywgKGVycm9yKSA9PlxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGVycm9yKVxuXG5cbiAgICBwYXJzZUZpcnN0TGluZVBhcmFtZXRlcjogKGxpbmUsIGNhbGxiYWNrKSAtPlxuICAgICAgICBwYXJhbXMgPSBAcGFyc2VQYXJhbWV0ZXJzKGxpbmUpXG4gICAgICAgIGlmIHR5cGVvZiBwYXJhbXMgaXMgJ29iamVjdCdcbiAgICAgICAgICAgIGlmIHR5cGVvZiBwYXJhbXMubWFpbiBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgIGlmIEB0YXJnZXRGaWxlbmFtZSBhbmQgbm90IHBhdGguaXNBYnNvbHV0ZShwYXJhbXMubWFpbilcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLm1haW4gPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKEB0YXJnZXRGaWxlbmFtZSksIHBhcmFtcy5tYWluKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHBhcmFtcylcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhwYXJhbXMpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKVxuXG5cbiAgICBwYXJzZVBhcmFtZXRlcnM6IChzdHIpIC0+XG4gICAgICAgICMgRXh0cmFjdCBjb21tZW50IGJsb2NrLCBpZiBjb21tZW50IGlzIHB1dCBpbnRvIC8qIC4uLiAqLyBvciBhZnRlciAvL1xuICAgICAgICByZWdleCA9IC9eXFxzKig/Oig/OlxcL1xcKlxccyooLio/KVxccypcXCpcXC8pfCg/OlxcL1xcL1xccyooLiopKSkvbVxuICAgICAgICBpZiAobWF0Y2ggPSByZWdleC5leGVjKHN0cikpICE9IG51bGxcbiAgICAgICAgICAgIHN0ciA9IGlmIG1hdGNoWzJdIHRoZW4gbWF0Y2hbMl0gZWxzZSBtYXRjaFsxXVxuXG4gICAgICAgICMgLi4uIHRoZXJlIGlzIG5vIGNvbW1lbnQgYXQgYWxsXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgIGFyZ3VtZW50UGFyc2VyID0gbmV3IEFyZ3VtZW50UGFyc2VyKClcblxuICAgICAgICAjIEV4dHJhY3Qga2V5cyBhbmQgdmFsdWVzXG4gICAgICAgIHJlZ2V4ID0gLyg/OihcXCE/W1xcdy1cXC5dKykoPzpcXHMqOlxccyooPzooXFxbLipcXF0pfCh7Lip9KXwoPzonKC4qPyknKXwoPzpcIiguKj8pXCIpfChbXiw7XSspKSk/KSovZ1xuXG4gICAgICAgIHBhcmFtcyA9IFtdXG4gICAgICAgIHdoaWxlIChtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyKSkgaXNudCBudWxsXG4gICAgICAgICAgICBpZiBtYXRjaC5pbmRleCA9PSByZWdleC5sYXN0SW5kZXhcbiAgICAgICAgICAgICAgICByZWdleC5sYXN0SW5kZXgrK1xuXG4gICAgICAgICAgICBpZiBtYXRjaFsxXSAhPSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICBrZXkgPSBtYXRjaFsxXS50cmltKClcbiAgICAgICAgICAgICAgICBmb3IgaSBpbiBbMi4uNl1cbiAgICAgICAgICAgICAgICAgICAgaWYgbWF0Y2hbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbWF0Y2hbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgaWYga2V5WzBdIGlzICchJ1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBrZXkuc3Vic3RyKDEpXG4gICAgICAgICAgICAgICAgICAgIGlmIHZhbHVlIGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAnZmFsc2UnXG4gICAgICAgICAgICAgICAgcGFyYW1zW2tleV0gPSBhcmd1bWVudFBhcnNlci5wYXJzZVZhbHVlKHZhbHVlKVxuXG4gICAgICAgIHJldHVybiBwYXJhbXNcbiJdfQ==
