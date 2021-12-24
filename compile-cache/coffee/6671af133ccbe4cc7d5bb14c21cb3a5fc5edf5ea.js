
/*
Requires https://github.com/ocaml-ppx/ocamlformat
 */

(function() {
  "use strict";
  var Beautifier, OCamlFormat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = OCamlFormat = (function(superClass) {
    extend(OCamlFormat, superClass);

    function OCamlFormat() {
      return OCamlFormat.__super__.constructor.apply(this, arguments);
    }

    OCamlFormat.prototype.name = "ocamlformat";

    OCamlFormat.prototype.link = "https://github.com/ocaml-ppx/ocamlformat";

    OCamlFormat.prototype.executables = [
      {
        name: "ocamlformat",
        cmd: "ocamlformat",
        homepage: "https://github.com/ocaml-ppx/ocamlformat",
        installation: "https://github.com/ocaml-ppx/ocamlformat#installation",
        version: {
          parse: function(text) {
            try {
              return text.match(/(\d+\.\d+\.\d+)/)[1];
            } catch (error) {
              return text.match(/(\d+\.\d+)/)[1] + ".0";
            }
          }
        }
      }
    ];

    OCamlFormat.prototype.options = {
      OCaml: true
    };

    OCamlFormat.prototype.beautify = function(text, language, options) {
      return this.run("ocamlformat", [this.tempFile("input", text)], {
        help: {
          link: "https://github.com/ocaml-ppx/ocamlformat"
        }
      });
    };

    return OCamlFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL29jYW1sZm9ybWF0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSx1QkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7MEJBQ3JCLElBQUEsR0FBTTs7MEJBQ04sSUFBQSxHQUFNOzswQkFDTixXQUFBLEdBQWE7TUFDWDtRQUNFLElBQUEsRUFBTSxhQURSO1FBRUUsR0FBQSxFQUFLLGFBRlA7UUFHRSxRQUFBLEVBQVUsMENBSFo7UUFJRSxZQUFBLEVBQWMsdURBSmhCO1FBS0UsT0FBQSxFQUFTO1VBQ1AsS0FBQSxFQUFPLFNBQUMsSUFBRDtBQUNMO3FCQUNFLElBQUksQ0FBQyxLQUFMLENBQVcsaUJBQVgsQ0FBOEIsQ0FBQSxDQUFBLEVBRGhDO2FBQUEsYUFBQTtxQkFHRSxJQUFJLENBQUMsS0FBTCxDQUFXLFlBQVgsQ0FBeUIsQ0FBQSxDQUFBLENBQXpCLEdBQThCLEtBSGhDOztVQURLLENBREE7U0FMWDtPQURXOzs7MEJBZ0JiLE9BQUEsR0FBUztNQUNQLEtBQUEsRUFBTyxJQURBOzs7MEJBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLGFBQUwsRUFBb0IsQ0FDbEIsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRGtCLENBQXBCLEVBRUs7UUFDRCxJQUFBLEVBQU07VUFDSixJQUFBLEVBQU0sMENBREY7U0FETDtPQUZMO0lBRFE7Ozs7S0F2QitCO0FBUDNDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vb2NhbWwtcHB4L29jYW1sZm9ybWF0XG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIE9DYW1sRm9ybWF0IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIm9jYW1sZm9ybWF0XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vb2NhbWwtcHB4L29jYW1sZm9ybWF0XCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIm9jYW1sZm9ybWF0XCJcbiAgICAgIGNtZDogXCJvY2FtbGZvcm1hdFwiXG4gICAgICBob21lcGFnZTogXCJodHRwczovL2dpdGh1Yi5jb20vb2NhbWwtcHB4L29jYW1sZm9ybWF0XCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL2dpdGh1Yi5jb20vb2NhbWwtcHB4L29jYW1sZm9ybWF0I2luc3RhbGxhdGlvblwiXG4gICAgICB2ZXJzaW9uOiB7XG4gICAgICAgIHBhcnNlOiAodGV4dCkgLT5cbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIHRleHQubWF0Y2goLyhcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgICAgICBjYXRjaFxuICAgICAgICAgICAgdGV4dC5tYXRjaCgvKFxcZCtcXC5cXGQrKS8pWzFdICsgXCIuMFwiXG4gICAgICB9XG4gICAgfVxuICBdXG5cbiAgb3B0aW9uczoge1xuICAgIE9DYW1sOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJvY2FtbGZvcm1hdFwiLCBbXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwge1xuICAgICAgICBoZWxwOiB7XG4gICAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vb2NhbWwtcHB4L29jYW1sZm9ybWF0XCJcbiAgICAgICAgfVxuICAgICAgfSlcbiJdfQ==
