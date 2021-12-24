
/*
Requires [black](https://github.com/ambv/black)
 */

(function() {
  "use strict";
  var Beautifier, Black, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  module.exports = Black = (function(superClass) {
    extend(Black, superClass);

    function Black() {
      return Black.__super__.constructor.apply(this, arguments);
    }

    Black.prototype.name = "black";

    Black.prototype.link = "https://github.com/ambv/black";

    Black.prototype.executables = [
      {
        name: "black",
        cmd: "black",
        homepage: "https://github.com/ambv/black",
        installation: "https://github.com/ambv/black#installation",
        version: {
          parse: function(text) {
            try {
              return text.match(/black, version (\d+\.\d+)/)[1] + "." + text.match(/b(\d+)$/)[1];
            } catch (error) {
              return text.match(/black, version (\d+\.\d+)/)[1] + ".0";
            }
          }
        }
      }
    ];

    Black.prototype.options = {
      Python: false
    };

    Black.prototype.beautify = function(text, language, options, context) {
      var cwd;
      cwd = context.filePath && path.dirname(context.filePath);
      return this.exe("black").run(["-"], {
        cwd: cwd,
        onStdin: function(stdin) {
          return stdin.end(text);
        }
      });
    };

    return Black;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2JsYWNrLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBO0FBSEEsTUFBQSx1QkFBQTtJQUFBOzs7RUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O29CQUNyQixJQUFBLEdBQU07O29CQUNOLElBQUEsR0FBTTs7b0JBQ04sV0FBQSxHQUFhO01BQ1g7UUFDRSxJQUFBLEVBQU0sT0FEUjtRQUVFLEdBQUEsRUFBSyxPQUZQO1FBR0UsUUFBQSxFQUFVLCtCQUhaO1FBSUUsWUFBQSxFQUFjLDRDQUpoQjtRQUtFLE9BQUEsRUFBUztVQUNQLEtBQUEsRUFBTyxTQUFDLElBQUQ7QUFFTDtxQkFDRSxJQUFJLENBQUMsS0FBTCxDQUFXLDJCQUFYLENBQXdDLENBQUEsQ0FBQSxDQUF4QyxHQUE2QyxHQUE3QyxHQUFtRCxJQUFJLENBQUMsS0FBTCxDQUFXLFNBQVgsQ0FBc0IsQ0FBQSxDQUFBLEVBRDNFO2FBQUEsYUFBQTtxQkFHRSxJQUFJLENBQUMsS0FBTCxDQUFXLDJCQUFYLENBQXdDLENBQUEsQ0FBQSxDQUF4QyxHQUE2QyxLQUgvQzs7VUFGSyxDQURBO1NBTFg7T0FEVzs7O29CQWlCYixPQUFBLEdBQVM7TUFDUCxNQUFBLEVBQVEsS0FERDs7O29CQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEVBQTBCLE9BQTFCO0FBQ1IsVUFBQTtNQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsUUFBUixJQUFxQixJQUFJLENBQUMsT0FBTCxDQUFhLE9BQU8sQ0FBQyxRQUFyQjthQUUzQixJQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsQ0FBYSxDQUFDLEdBQWQsQ0FBa0IsQ0FBQyxHQUFELENBQWxCLEVBQXlCO1FBQ3ZCLEdBQUEsRUFBSyxHQURrQjtRQUV2QixPQUFBLEVBQVMsU0FBQyxLQUFEO2lCQUNQLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVjtRQURPLENBRmM7T0FBekI7SUFIUTs7OztLQXhCeUI7QUFQckMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIFtibGFja10oaHR0cHM6Ly9naXRodWIuY29tL2FtYnYvYmxhY2spXG4jIyNcblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCbGFjayBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJibGFja1wiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2FtYnYvYmxhY2tcIlxuICBleGVjdXRhYmxlczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwiYmxhY2tcIlxuICAgICAgY21kOiBcImJsYWNrXCJcbiAgICAgIGhvbWVwYWdlOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9hbWJ2L2JsYWNrXCJcbiAgICAgIGluc3RhbGxhdGlvbjogXCJodHRwczovL2dpdGh1Yi5jb20vYW1idi9ibGFjayNpbnN0YWxsYXRpb25cIlxuICAgICAgdmVyc2lvbjoge1xuICAgICAgICBwYXJzZTogKHRleHQpIC0+XG4gICAgICAgICAgIyBUcnkgdG8gcmVhZCBiZXRhIHZhbHVlcywgZWcgXCJibGFjaywgdmVyc2lvbiAxOC42YjRcIiAtPiAxOC42LjRcbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIHRleHQubWF0Y2goL2JsYWNrLCB2ZXJzaW9uIChcXGQrXFwuXFxkKykvKVsxXSArIFwiLlwiICsgdGV4dC5tYXRjaCgvYihcXGQrKSQvKVsxXVxuICAgICAgICAgIGNhdGNoXG4gICAgICAgICAgICB0ZXh0Lm1hdGNoKC9ibGFjaywgdmVyc2lvbiAoXFxkK1xcLlxcZCspLylbMV0gKyBcIi4wXCJcbiAgICAgIH1cbiAgICB9XG4gIF1cblxuICBvcHRpb25zOiB7XG4gICAgUHl0aG9uOiBmYWxzZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucywgY29udGV4dCkgLT5cbiAgICBjd2QgPSBjb250ZXh0LmZpbGVQYXRoIGFuZCBwYXRoLmRpcm5hbWUgY29udGV4dC5maWxlUGF0aFxuICAgICMgYC1gIGFzIGZpbGVuYW1lIHJlYWRzIGZyb20gc3RkaW5cbiAgICBAZXhlKFwiYmxhY2tcIikucnVuKFtcIi1cIl0sIHtcbiAgICAgIGN3ZDogY3dkXG4gICAgICBvblN0ZGluOiAoc3RkaW4pIC0+XG4gICAgICAgIHN0ZGluLmVuZCB0ZXh0XG4gICAgfSlcbiJdfQ==
