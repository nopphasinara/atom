(function() {
  var Entities, entities;

  Entities = require('html-entities').AllHtmlEntities;

  entities = new Entities();

  module.exports = {
    activate: function() {
      atom.commands.add("atom-workspace", {
        "escape-utils:url-encode": (function(_this) {
          return function() {
            return _this.transfromSel(encodeURIComponent);
          };
        })(this)
      });
      atom.commands.add("atom-workspace", {
        "escape-utils:url-decode": (function(_this) {
          return function() {
            return _this.transfromSel(decodeURIComponent);
          };
        })(this)
      });
      atom.commands.add("atom-workspace", {
        "escape-utils:base64-encode": (function(_this) {
          return function() {
            return _this.transfromSel(_this.encodeBase64);
          };
        })(this)
      });
      atom.commands.add("atom-workspace", {
        "escape-utils:base64-decode": (function(_this) {
          return function() {
            return _this.transfromSel(_this.decodeBase64);
          };
        })(this)
      });
      atom.commands.add("atom-workspace", {
        "escape-utils:html-encode": (function(_this) {
          return function() {
            return _this.transfromSel(entities.encodeNonUTF);
          };
        })(this)
      });
      atom.commands.add("atom-workspace", {
        "escape-utils:html-encode-maintain-lines": (function(_this) {
          return function() {
            return _this.transfromSel(_this.encodeHtmlMaintainingLines);
          };
        })(this)
      });
      return atom.commands.add("atom-workspace", {
        "escape-utils:html-decode": (function(_this) {
          return function() {
            return _this.transfromSel(entities.decode);
          };
        })(this)
      });
    },
    transfromSel: function(t) {
      var editor, i, len, results, sel, selections;
      editor = atom.workspace.getActiveTextEditor();
      if ((editor != null)) {
        selections = editor.getSelections();
        results = [];
        for (i = 0, len = selections.length; i < len; i++) {
          sel = selections[i];
          results.push(sel.insertText(t(sel.getText()), {
            "select": true,
            "normalizeLineEndings": true
          }));
        }
        return results;
      }
    },
    encodeBase64: function(text) {
      return new Buffer(text).toString("base64");
    },
    decodeBase64: function(text) {
      if (/^[A-Za-z0-9+\/=]+$/.test(text)) {
        return new Buffer(text, "base64").toString("utf8");
      } else {
        return text;
      }
    },
    encodeHtmlMaintainingLines: function(text) {
      return text.split(/[\n\r]{1,2}/).map(entities.encodeNonUTF).join('\n');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9lc2NhcGUtdXRpbHMvbGliL2VzY2FwZS11dGlscy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDOztFQUNwQyxRQUFBLEdBQVcsSUFBSSxRQUFKLENBQUE7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLHlCQUFBLEVBQTJCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBYyxrQkFBZDtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQjtPQUFwQztNQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSx5QkFBQSxFQUEyQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxZQUFELENBQWMsa0JBQWQ7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0I7T0FBcEM7TUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsNEJBQUEsRUFBOEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsWUFBRCxDQUFjLEtBQUMsQ0FBQSxZQUFmO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCO09BQXBDO01BQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLDRCQUFBLEVBQThCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBYyxLQUFDLENBQUEsWUFBZjtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QjtPQUFwQztNQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSwwQkFBQSxFQUE0QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxZQUFELENBQWMsUUFBUSxDQUFDLFlBQXZCO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCO09BQXBDO01BQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLHlDQUFBLEVBQTJDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBYyxLQUFDLENBQUEsMEJBQWY7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0M7T0FBcEM7YUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsMEJBQUEsRUFBNEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsWUFBRCxDQUFjLFFBQVEsQ0FBQyxNQUF2QjtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QjtPQUFwQztJQVBRLENBQVY7SUFVQSxZQUFBLEVBQWMsU0FBQyxDQUFEO0FBRVosVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxJQUFHLENBQUMsY0FBRCxDQUFIO1FBQ0UsVUFBQSxHQUFhLE1BQU0sQ0FBQyxhQUFQLENBQUE7QUFDYjthQUFBLDRDQUFBOzt1QkFBQSxHQUFHLENBQUMsVUFBSixDQUFlLENBQUEsQ0FBRSxHQUFHLENBQUMsT0FBSixDQUFBLENBQUYsQ0FBZixFQUFpQztZQUFFLFFBQUEsRUFBVSxJQUFaO1lBQWtCLHNCQUFBLEVBQXdCLElBQTFDO1dBQWpDO0FBQUE7dUJBRkY7O0lBSFksQ0FWZDtJQWlCQSxZQUFBLEVBQWMsU0FBQyxJQUFEO2FBQ1osSUFBSSxNQUFKLENBQVcsSUFBWCxDQUFnQixDQUFDLFFBQWpCLENBQTBCLFFBQTFCO0lBRFksQ0FqQmQ7SUFvQkEsWUFBQSxFQUFjLFNBQUMsSUFBRDtNQUNaLElBQUcsb0JBQW1CLENBQUMsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBSDtlQUNFLElBQUksTUFBSixDQUFXLElBQVgsRUFBaUIsUUFBakIsQ0FBMEIsQ0FBQyxRQUEzQixDQUFvQyxNQUFwQyxFQURGO09BQUEsTUFBQTtlQUlFLEtBSkY7O0lBRFksQ0FwQmQ7SUEyQkEsMEJBQUEsRUFBNEIsU0FBQyxJQUFEO2FBQzFCLElBQUksQ0FBQyxLQUFMLENBQVcsYUFBWCxDQUF5QixDQUFDLEdBQTFCLENBQThCLFFBQVEsQ0FBQyxZQUF2QyxDQUFvRCxDQUFDLElBQXJELENBQTBELElBQTFEO0lBRDBCLENBM0I1Qjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIkVudGl0aWVzID0gcmVxdWlyZSgnaHRtbC1lbnRpdGllcycpLkFsbEh0bWxFbnRpdGllc1xuZW50aXRpZXMgPSBuZXcgRW50aXRpZXMoKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAtPlxuICAgIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJlc2NhcGUtdXRpbHM6dXJsLWVuY29kZVwiOiA9PiBAdHJhbnNmcm9tU2VsIGVuY29kZVVSSUNvbXBvbmVudFxuICAgIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJlc2NhcGUtdXRpbHM6dXJsLWRlY29kZVwiOiA9PiBAdHJhbnNmcm9tU2VsIGRlY29kZVVSSUNvbXBvbmVudFxuICAgIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJlc2NhcGUtdXRpbHM6YmFzZTY0LWVuY29kZVwiOiA9PiBAdHJhbnNmcm9tU2VsIEBlbmNvZGVCYXNlNjRcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIFwiZXNjYXBlLXV0aWxzOmJhc2U2NC1kZWNvZGVcIjogPT4gQHRyYW5zZnJvbVNlbCBAZGVjb2RlQmFzZTY0XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImVzY2FwZS11dGlsczpodG1sLWVuY29kZVwiOiA9PiBAdHJhbnNmcm9tU2VsIGVudGl0aWVzLmVuY29kZU5vblVURlxuICAgIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJlc2NhcGUtdXRpbHM6aHRtbC1lbmNvZGUtbWFpbnRhaW4tbGluZXNcIjogPT4gQHRyYW5zZnJvbVNlbCBAZW5jb2RlSHRtbE1haW50YWluaW5nTGluZXNcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIFwiZXNjYXBlLXV0aWxzOmh0bWwtZGVjb2RlXCI6ID0+IEB0cmFuc2Zyb21TZWwgZW50aXRpZXMuZGVjb2RlXG5cblxuICB0cmFuc2Zyb21TZWw6ICh0KSAtPlxuICAgICMgVGhpcyBhc3N1bWVzIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGlzIGFuIGVkaXRvclxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIChlZGl0b3I/KVxuICAgICAgc2VsZWN0aW9ucyA9IGVkaXRvci5nZXRTZWxlY3Rpb25zKClcbiAgICAgIHNlbC5pbnNlcnRUZXh0KHQoc2VsLmdldFRleHQoKSksIHsgXCJzZWxlY3RcIjogdHJ1ZSwgXCJub3JtYWxpemVMaW5lRW5kaW5nc1wiOiB0cnVlIH0pIGZvciBzZWwgaW4gc2VsZWN0aW9uc1xuXG4gIGVuY29kZUJhc2U2NDogKHRleHQpIC0+XG4gICAgbmV3IEJ1ZmZlcih0ZXh0KS50b1N0cmluZyhcImJhc2U2NFwiKVxuXG4gIGRlY29kZUJhc2U2NDogKHRleHQpIC0+XG4gICAgaWYgL15bQS1aYS16MC05Ky89XSskLy50ZXN0KHRleHQpXG4gICAgICBuZXcgQnVmZmVyKHRleHQsIFwiYmFzZTY0XCIpLnRvU3RyaW5nKFwidXRmOFwiKVxuICAgIGVsc2VcbiAgICAgICNjb25zb2xlLmRlYnVnKFwiSWdub3JpbmcgdGV4dCBhcyBpdCBjb250YWlucyBpbGxlZ2FsIGNoYXJhY2Vyc1wiLCB0ZXh0KVxuICAgICAgdGV4dFxuXG4gIGVuY29kZUh0bWxNYWludGFpbmluZ0xpbmVzOiAodGV4dCkgLT5cbiAgICB0ZXh0LnNwbGl0KC9bXFxuXFxyXXsxLDJ9LykubWFwKGVudGl0aWVzLmVuY29kZU5vblVURikuam9pbignXFxuJylcbiJdfQ==
