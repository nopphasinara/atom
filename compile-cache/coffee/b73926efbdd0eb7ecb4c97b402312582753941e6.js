(function() {
  var AtomMinifyMinifierOptionsParser,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = AtomMinifyMinifierOptionsParser = (function() {
    function AtomMinifyMinifierOptionsParser() {
      this.getMinifierOptionsFromInlineParameter = bind(this.getMinifierOptionsFromInlineParameter, this);
      this.getGlobalMinifierOptions = bind(this.getGlobalMinifierOptions, this);
    }

    AtomMinifyMinifierOptionsParser.prototype.parse = function(contentType, options, inlineParameters) {
      var key, match, optionsStr, regex, value;
      this.contentType = contentType;
      this.options = options;
      this.inlineParameters = inlineParameters;
      optionsStr = this.getMinifierOptionsStr();
      regex = /(?:([\w-\.]+)(?:\s*=\s*(?:(?:'(.*?)')|(?:"(.*?)")|([^ ]+)))?)*/g;
      options = [];
      while ((match = regex.exec(optionsStr)) !== null) {
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (match[1] !== void 0) {
          key = match[1].trim();
          value = match[2] ? match[2] : match[3] ? match[3] : match[4];
          options[key] = this.parseValue(value);
        }
      }
      return options;
    };

    AtomMinifyMinifierOptionsParser.prototype.getMinifierOptionsStr = function() {
      var inlineParameterOptionsStr, options;
      options = this.getGlobalMinifierOptions();
      inlineParameterOptionsStr = this.getMinifierOptionsFromInlineParameter();
      if (typeof inlineParameterOptionsStr === 'string' && inlineParameterOptionsStr.length > 0) {
        if (inlineParameterOptionsStr[0] === '+') {
          options += inlineParameterOptionsStr.substr(1);
        } else {
          options = inlineParameterOptionsStr;
        }
      }
      return options;
    };

    AtomMinifyMinifierOptionsParser.prototype.getGlobalMinifierOptions = function() {
      var key;
      switch (this.contentType) {
        case 'css':
          switch (this.options.cssMinifier) {
            case 'clean-css':
              key = 'cssParametersForCleanCSS';
              break;
            case 'csso':
              key = 'cssParametersForCSSO';
              break;
            case 'sqwish':
              key = 'cssParametersForSqwish';
              break;
            case 'yui-css':
              key = 'cssParametersForYUI';
          }
          break;
        case 'js':
          switch (this.options.jsMinifier) {
            case 'gcc':
              key = 'jsParametersForGCC';
              break;
            case 'uglify-js':
              key = 'jsParametersForUglifyJS2';
              break;
            case 'yui-js':
              key = 'jsParametersForYUI';
          }
      }
      return this.options[key];
    };

    AtomMinifyMinifierOptionsParser.prototype.getMinifierOptionsFromInlineParameter = function() {
      var options;
      options = void 0;
      if (typeof this.inlineParameters.minifierOptions === 'string' && this.inlineParameters.minifierOptions.length > 0) {
        options = this.inlineParameters.minifierOptions;
      } else if (typeof this.inlineParameters.options === 'string' && this.inlineParameters.options.length > 0) {
        options = this.inlineParameters.options;
      }
      return options;
    };

    AtomMinifyMinifierOptionsParser.prototype.parseValue = function(value) {
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

    return AtomMinifyMinifierOptionsParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2F0b20tbWluaWZ5L2xpYi9taW5pZmllci1vcHRpb25zLXBhcnNlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OzhDQUVGLEtBQUEsR0FBTyxTQUFDLFdBQUQsRUFBYyxPQUFkLEVBQXVCLGdCQUF2QjtBQUNILFVBQUE7TUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUNYLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtNQUVwQixVQUFBLEdBQWEsSUFBQyxDQUFBLHFCQUFELENBQUE7TUFDYixLQUFBLEdBQVE7TUFDUixPQUFBLEdBQVU7QUFDVixhQUFNLENBQUMsS0FBQSxHQUFRLEtBQUssQ0FBQyxJQUFOLENBQVcsVUFBWCxDQUFULENBQUEsS0FBb0MsSUFBMUM7UUFDSSxJQUFHLEtBQUssQ0FBQyxLQUFOLEtBQWUsS0FBSyxDQUFDLFNBQXhCO1VBQ0ksS0FBSyxDQUFDLFNBQU4sR0FESjs7UUFHQSxJQUFHLEtBQU0sQ0FBQSxDQUFBLENBQU4sS0FBWSxNQUFmO1VBQ0ksR0FBQSxHQUFNLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFULENBQUE7VUFDTixLQUFBLEdBQVcsS0FBTSxDQUFBLENBQUEsQ0FBVCxHQUFpQixLQUFNLENBQUEsQ0FBQSxDQUF2QixHQUFrQyxLQUFNLENBQUEsQ0FBQSxDQUFULEdBQWlCLEtBQU0sQ0FBQSxDQUFBLENBQXZCLEdBQStCLEtBQU0sQ0FBQSxDQUFBO1VBQzVFLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FBZSxJQUFDLENBQUEsVUFBRCxDQUFZLEtBQVosRUFIbkI7O01BSko7QUFTQSxhQUFPO0lBakJKOzs4Q0FvQlAscUJBQUEsR0FBdUIsU0FBQTtBQUNuQixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSx3QkFBRCxDQUFBO01BRVYseUJBQUEsR0FBNEIsSUFBQyxDQUFBLHFDQUFELENBQUE7TUFDNUIsSUFBRyxPQUFPLHlCQUFQLEtBQW9DLFFBQXBDLElBQWlELHlCQUF5QixDQUFDLE1BQTFCLEdBQW1DLENBQXZGO1FBR0ksSUFBRyx5QkFBMEIsQ0FBQSxDQUFBLENBQTFCLEtBQWdDLEdBQW5DO1VBQ0ksT0FBQSxJQUFXLHlCQUF5QixDQUFDLE1BQTFCLENBQWlDLENBQWpDLEVBRGY7U0FBQSxNQUFBO1VBS0ksT0FBQSxHQUFVLDBCQUxkO1NBSEo7O0FBVUEsYUFBTztJQWRZOzs4Q0FpQnZCLHdCQUFBLEdBQTBCLFNBQUE7QUFDdEIsVUFBQTtBQUFBLGNBQU8sSUFBQyxDQUFBLFdBQVI7QUFBQSxhQUNTLEtBRFQ7QUFFUSxrQkFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQWhCO0FBQUEsaUJBQ1MsV0FEVDtjQUMwQixHQUFBLEdBQU07QUFBdkI7QUFEVCxpQkFFUyxNQUZUO2NBRXFCLEdBQUEsR0FBTTtBQUFsQjtBQUZULGlCQUdTLFFBSFQ7Y0FHdUIsR0FBQSxHQUFNO0FBQXBCO0FBSFQsaUJBSVMsU0FKVDtjQUl3QixHQUFBLEdBQU07QUFKOUI7QUFEQztBQURULGFBUVMsSUFSVDtBQVNRLGtCQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBaEI7QUFBQSxpQkFDUyxLQURUO2NBQ29CLEdBQUEsR0FBTTtBQUFqQjtBQURULGlCQUVTLFdBRlQ7Y0FFMEIsR0FBQSxHQUFNO0FBQXZCO0FBRlQsaUJBR1MsUUFIVDtjQUd1QixHQUFBLEdBQU07QUFIN0I7QUFUUjtBQWNBLGFBQU8sSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBO0lBZk07OzhDQWtCMUIscUNBQUEsR0FBdUMsU0FBQTtBQUNuQyxVQUFBO01BQUEsT0FBQSxHQUFVO01BQ1YsSUFBRyxPQUFPLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxlQUF6QixLQUE0QyxRQUE1QyxJQUF5RCxJQUFDLENBQUEsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLE1BQWxDLEdBQTJDLENBQXZHO1FBQ0ksT0FBQSxHQUFVLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxnQkFEaEM7T0FBQSxNQUVLLElBQUcsT0FBTyxJQUFDLENBQUEsZ0JBQWdCLENBQUMsT0FBekIsS0FBb0MsUUFBcEMsSUFBaUQsSUFBQyxDQUFBLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUExQixHQUFtQyxDQUF2RjtRQUNELE9BQUEsR0FBVSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsUUFEM0I7O0FBRUwsYUFBTztJQU40Qjs7OENBU3ZDLFVBQUEsR0FBWSxTQUFDLEtBQUQ7TUFFUixJQUFHLEtBQUEsS0FBUyxNQUFaO0FBQ0ksZUFBTyxLQURYOztNQUdBLEtBQUEsR0FBUSxLQUFLLENBQUMsSUFBTixDQUFBO01BRVIsSUFBRyxLQUFBLEtBQVUsSUFBVixJQUFBLEtBQUEsS0FBZ0IsTUFBaEIsSUFBQSxLQUFBLEtBQXdCLEtBQTNCO0FBQ0ksZUFBTyxLQURYOztNQUdBLElBQUcsS0FBQSxLQUFVLEtBQVYsSUFBQSxLQUFBLEtBQWlCLE9BQWpCLElBQUEsS0FBQSxLQUEwQixJQUE3QjtBQUNJLGVBQU8sTUFEWDs7TUFHQSxJQUFHLFFBQUEsQ0FBUyxLQUFULENBQUg7UUFDSSxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUFBLEdBQXFCLENBQUMsQ0FBekI7QUFDSSxpQkFBTyxVQUFBLENBQVcsS0FBWCxFQURYO1NBQUEsTUFBQTtBQUdJLGlCQUFPLFFBQUEsQ0FBUyxLQUFULEVBSFg7U0FESjs7QUFRQSxhQUFPO0lBckJDOzs7OztBQW5FaEIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBBdG9tTWluaWZ5TWluaWZpZXJPcHRpb25zUGFyc2VyXG5cbiAgICBwYXJzZTogKGNvbnRlbnRUeXBlLCBvcHRpb25zLCBpbmxpbmVQYXJhbWV0ZXJzKSAtPlxuICAgICAgICBAY29udGVudFR5cGUgPSBjb250ZW50VHlwZVxuICAgICAgICBAb3B0aW9ucyA9IG9wdGlvbnNcbiAgICAgICAgQGlubGluZVBhcmFtZXRlcnMgPSBpbmxpbmVQYXJhbWV0ZXJzXG5cbiAgICAgICAgb3B0aW9uc1N0ciA9IEBnZXRNaW5pZmllck9wdGlvbnNTdHIoKVxuICAgICAgICByZWdleCA9IC8oPzooW1xcdy1cXC5dKykoPzpcXHMqPVxccyooPzooPzonKC4qPyknKXwoPzpcIiguKj8pXCIpfChbXiBdKykpKT8pKi9nXG4gICAgICAgIG9wdGlvbnMgPSBbXVxuICAgICAgICB3aGlsZSAobWF0Y2ggPSByZWdleC5leGVjKG9wdGlvbnNTdHIpKSAhPSBudWxsXG4gICAgICAgICAgICBpZiBtYXRjaC5pbmRleCA9PSByZWdleC5sYXN0SW5kZXhcbiAgICAgICAgICAgICAgICByZWdleC5sYXN0SW5kZXgrK1xuXG4gICAgICAgICAgICBpZiBtYXRjaFsxXSAhPSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICBrZXkgPSBtYXRjaFsxXS50cmltKClcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGlmIG1hdGNoWzJdIHRoZW4gbWF0Y2hbMl0gZWxzZSBpZiBtYXRjaFszXSB0aGVuIG1hdGNoWzNdIGVsc2UgbWF0Y2hbNF1cbiAgICAgICAgICAgICAgICBvcHRpb25zW2tleV0gPSBAcGFyc2VWYWx1ZSh2YWx1ZSlcblxuICAgICAgICByZXR1cm4gb3B0aW9uc1xuXG5cbiAgICBnZXRNaW5pZmllck9wdGlvbnNTdHI6ICgpIC0+XG4gICAgICAgIG9wdGlvbnMgPSBAZ2V0R2xvYmFsTWluaWZpZXJPcHRpb25zKClcblxuICAgICAgICBpbmxpbmVQYXJhbWV0ZXJPcHRpb25zU3RyID0gQGdldE1pbmlmaWVyT3B0aW9uc0Zyb21JbmxpbmVQYXJhbWV0ZXIoKVxuICAgICAgICBpZiB0eXBlb2YgaW5saW5lUGFyYW1ldGVyT3B0aW9uc1N0ciBpcyAnc3RyaW5nJyBhbmQgaW5saW5lUGFyYW1ldGVyT3B0aW9uc1N0ci5sZW5ndGggPiAwXG4gICAgICAgICAgICAjIENoZWNrIGlmIGZpcnN0IGNoYXJhY3RlciBpcyBhIHBsdXMgKFwiK1wiKSwgc28gaXQgbWVhbnMgdGhhdCBwYXJhbWV0ZXJzIGZvciBtaW5pZmllclxuICAgICAgICAgICAgIyBoYXMgdG8gYmUgY29tYmluZWRcbiAgICAgICAgICAgIGlmIGlubGluZVBhcmFtZXRlck9wdGlvbnNTdHJbMF0gaXMgJysnXG4gICAgICAgICAgICAgICAgb3B0aW9ucyArPSBpbmxpbmVQYXJhbWV0ZXJPcHRpb25zU3RyLnN1YnN0cigxKVxuXG4gICAgICAgICAgICAjIC4uLiBlbHNlIHdlIHJlcGxhY2UgdGhlIGdsb2JhbCBtaW5pZmllciBvcHRpb25zXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IGlubGluZVBhcmFtZXRlck9wdGlvbnNTdHJcblxuICAgICAgICByZXR1cm4gb3B0aW9uc1xuXG5cbiAgICBnZXRHbG9iYWxNaW5pZmllck9wdGlvbnM6ICgpID0+XG4gICAgICAgIHN3aXRjaCBAY29udGVudFR5cGVcbiAgICAgICAgICAgIHdoZW4gJ2NzcydcbiAgICAgICAgICAgICAgICBzd2l0Y2ggQG9wdGlvbnMuY3NzTWluaWZpZXJcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAnY2xlYW4tY3NzJyB0aGVuIGtleSA9ICdjc3NQYXJhbWV0ZXJzRm9yQ2xlYW5DU1MnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gJ2Nzc28nIHRoZW4ga2V5ID0gJ2Nzc1BhcmFtZXRlcnNGb3JDU1NPJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuICdzcXdpc2gnIHRoZW4ga2V5ID0gJ2Nzc1BhcmFtZXRlcnNGb3JTcXdpc2gnXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gJ3l1aS1jc3MnIHRoZW4ga2V5ID0gJ2Nzc1BhcmFtZXRlcnNGb3JZVUknXG5cbiAgICAgICAgICAgIHdoZW4gJ2pzJ1xuICAgICAgICAgICAgICAgIHN3aXRjaCBAb3B0aW9ucy5qc01pbmlmaWVyXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gJ2djYycgdGhlbiBrZXkgPSAnanNQYXJhbWV0ZXJzRm9yR0NDJ1xuICAgICAgICAgICAgICAgICAgICB3aGVuICd1Z2xpZnktanMnIHRoZW4ga2V5ID0gJ2pzUGFyYW1ldGVyc0ZvclVnbGlmeUpTMidcbiAgICAgICAgICAgICAgICAgICAgd2hlbiAneXVpLWpzJyB0aGVuIGtleSA9ICdqc1BhcmFtZXRlcnNGb3JZVUknXG5cbiAgICAgICAgcmV0dXJuIEBvcHRpb25zW2tleV1cblxuXG4gICAgZ2V0TWluaWZpZXJPcHRpb25zRnJvbUlubGluZVBhcmFtZXRlcjogKCk9PlxuICAgICAgICBvcHRpb25zID0gdW5kZWZpbmVkXG4gICAgICAgIGlmIHR5cGVvZiBAaW5saW5lUGFyYW1ldGVycy5taW5pZmllck9wdGlvbnMgaXMgJ3N0cmluZycgYW5kIEBpbmxpbmVQYXJhbWV0ZXJzLm1pbmlmaWVyT3B0aW9ucy5sZW5ndGggPiAwXG4gICAgICAgICAgICBvcHRpb25zID0gQGlubGluZVBhcmFtZXRlcnMubWluaWZpZXJPcHRpb25zXG4gICAgICAgIGVsc2UgaWYgdHlwZW9mIEBpbmxpbmVQYXJhbWV0ZXJzLm9wdGlvbnMgaXMgJ3N0cmluZycgYW5kIEBpbmxpbmVQYXJhbWV0ZXJzLm9wdGlvbnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgb3B0aW9ucyA9IEBpbmxpbmVQYXJhbWV0ZXJzLm9wdGlvbnNcbiAgICAgICAgcmV0dXJuIG9wdGlvbnNcblxuXG4gICAgcGFyc2VWYWx1ZTogKHZhbHVlKSAtPlxuICAgICAgICAjIHVuZGVmaW5lZCBpcyBhIHNwZWNpYWwgdmFsdWUgdGhhdCBtZWFucywgdGhhdCB0aGUga2V5IGlzIGRlZmluZWQsIGJ1dCBubyB2YWx1ZVxuICAgICAgICBpZiB2YWx1ZSBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKClcblxuICAgICAgICBpZiB2YWx1ZSBpbiBbdHJ1ZSwgJ3RydWUnLCAneWVzJ11cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgaWYgdmFsdWUgaW4gW2ZhbHNlLCAnZmFsc2UnLCAnbm8nXVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgaWYgaXNGaW5pdGUodmFsdWUpXG4gICAgICAgICAgICBpZiB2YWx1ZS5pbmRleE9mKCcuJykgPiAtMVxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSlcblxuICAgICAgICAjIFRPRE86IEV4dGVuZCBmb3IgYXJyYXkgYW5kIG9iamVjdHM/XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlXG4iXX0=
