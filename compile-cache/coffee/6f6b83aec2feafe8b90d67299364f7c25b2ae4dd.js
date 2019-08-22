(function() {
  var FindPathListView, Os, Path, SelectListView, flatten, fs, tempFilePath, unflatten,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  unflatten = require('flat').unflatten;

  flatten = require('flat');

  SelectListView = require('atom-space-pen-views').SelectListView;

  tempFilePath = Path.join(Os.tmpdir(), "find-json-view.json");

  module.exports = FindPathListView = (function(superClass) {
    extend(FindPathListView, superClass);

    function FindPathListView() {
      return FindPathListView.__super__.constructor.apply(this, arguments);
    }

    FindPathListView.prototype.initialize = function(objct, isResultFlatten) {
      this.isResultFlatten = isResultFlatten;
      FindPathListView.__super__.initialize.apply(this, arguments);
      if (this.isFlatten == null) {
        this.isFlatten = true;
      }
      this.flattenJson = this.makeFlattenJson(objct);
      this.setItems(this.makeItems(this.flattenJson));
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    FindPathListView.prototype.viewForItem = function(pathName) {
      return "<li>" + pathName + "</li>";
    };

    FindPathListView.prototype.hide = function() {
      var ref;
      return (ref = this.panel) != null ? ref.hide() : void 0;
    };

    FindPathListView.prototype.confirmed = function(pathName) {
      this.showResult(this.filterItems(pathName));
      return this.hide();
    };

    FindPathListView.prototype.cancelled = function() {
      return this.hide();
    };

    FindPathListView.prototype.makeFlattenJson = function(objct) {
      var flattenJson, maxDepth, options;
      maxDepth = atom.config.get("json-path-finder.maxDepth");
      options = {};
      if (maxDepth !== -1) {
        options.maxDepth = maxDepth;
      }
      flattenJson = flatten(objct, options);
      return flattenJson;
    };

    FindPathListView.prototype.makeItems = function(flattenJson) {
      var i, items, len, pathName, ref;
      Array.prototype.unique = function() {
        var i, key, output, ref, results, value;
        output = {};
        for (key = i = 0, ref = this.length; 0 <= ref ? i < ref : i > ref; key = 0 <= ref ? ++i : --i) {
          output[this[key]] = this[key];
        }
        results = [];
        for (key in output) {
          value = output[key];
          results.push(value);
        }
        return results;
      };
      items = [];
      ref = Object.keys(flattenJson);
      for (i = 0, len = ref.length; i < len; i++) {
        pathName = ref[i];
        pathName = pathName.replace(/\.[0-9]+/g, "[]");
        items.push(pathName);
      }
      items.sort();
      items = items.unique();
      return items;
    };

    FindPathListView.prototype.filterItems = function(pathName) {
      var items, key, ref, value;
      items = {};
      ref = this.flattenJson;
      for (key in ref) {
        value = ref[key];
        if (pathName === key.replace(/\.[0-9]+/g, "[]")) {
          items[key] = value;
        }
      }
      return items;
    };

    FindPathListView.prototype.showResult = function(items) {
      var flattenFunc, text;
      flattenFunc = this.isResultFlatten ? flatten : unflatten;
      text = JSON.stringify(flattenFunc(items), null, 2);
      fs.writeFileSync(tempFilePath, text, {
        flag: 'w+'
      });
      return atom.workspace.open(tempFilePath, {
        split: 'right',
        activatePane: true
      });
    };

    return FindPathListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9qc29uLXBhdGgtZmluZGVyL2xpYi9maW5kLXBhdGgtbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsZ0ZBQUE7SUFBQTs7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsU0FBQSxHQUFZLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQzs7RUFDNUIsT0FBQSxHQUFVLE9BQUEsQ0FBUSxNQUFSOztFQUNULGlCQUFrQixPQUFBLENBQVEsc0JBQVI7O0VBRW5CLFlBQUEsR0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBVixFQUF1QixxQkFBdkI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OzsrQkFDSixVQUFBLEdBQVksU0FBQyxLQUFELEVBQVEsZUFBUjtNQUFRLElBQUMsQ0FBQSxrQkFBRDtNQUNsQixrREFBQSxTQUFBOztRQUNBLElBQUMsQ0FBQSxZQUFhOztNQUNkLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsS0FBakI7TUFDZixJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLFdBQVosQ0FBVjs7UUFDQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBUFU7OytCQVNaLFdBQUEsR0FBYSxTQUFDLFFBQUQ7YUFDWCxNQUFBLEdBQU8sUUFBUCxHQUFnQjtJQURMOzsrQkFHYixJQUFBLEdBQU0sU0FBQTtBQUFHLFVBQUE7NkNBQU0sQ0FBRSxJQUFSLENBQUE7SUFBSDs7K0JBRU4sU0FBQSxHQUFXLFNBQUMsUUFBRDtNQUNULElBQUMsQ0FBQSxVQUFELENBQVksSUFBQyxDQUFBLFdBQUQsQ0FBYSxRQUFiLENBQVo7YUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO0lBRlM7OytCQUlYLFNBQUEsR0FBVyxTQUFBO2FBQ1QsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQURTOzsrQkFLWCxlQUFBLEdBQWlCLFNBQUMsS0FBRDtBQUNmLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQjtNQUNYLE9BQUEsR0FBVTtNQUNWLElBQUcsUUFBQSxLQUFZLENBQUMsQ0FBaEI7UUFDRSxPQUFPLENBQUMsUUFBUixHQUFtQixTQURyQjs7TUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLEtBQVIsRUFBZSxPQUFmO0FBQ2QsYUFBTztJQU5ROzsrQkFRakIsU0FBQSxHQUFXLFNBQUMsV0FBRDtBQUNULFVBQUE7TUFBQSxLQUFLLENBQUEsU0FBRSxDQUFBLE1BQVAsR0FBZ0IsU0FBQTtBQUNkLFlBQUE7UUFBQSxNQUFBLEdBQVM7QUFDVCxhQUFtQyx3RkFBbkM7VUFBQSxNQUFPLENBQUEsSUFBRSxDQUFBLEdBQUEsQ0FBRixDQUFQLEdBQWlCLElBQUUsQ0FBQSxHQUFBO0FBQW5CO0FBQ0E7YUFBQSxhQUFBOzt1QkFBQTtBQUFBOztNQUhjO01BS2hCLEtBQUEsR0FBUTtBQUNSO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxRQUFBLEdBQVcsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsV0FBakIsRUFBOEIsSUFBOUI7UUFDWCxLQUFLLENBQUMsSUFBTixDQUFXLFFBQVg7QUFGRjtNQUdBLEtBQUssQ0FBQyxJQUFOLENBQUE7TUFDQSxLQUFBLEdBQVEsS0FBSyxDQUFDLE1BQU4sQ0FBQTtBQUNSLGFBQU87SUFaRTs7K0JBY1gsV0FBQSxHQUFhLFNBQUMsUUFBRDtBQUNYLFVBQUE7TUFBQSxLQUFBLEdBQVE7QUFDUjtBQUFBLFdBQUEsVUFBQTs7UUFDRSxJQUFHLFFBQUEsS0FBWSxHQUFHLENBQUMsT0FBSixDQUFZLFdBQVosRUFBeUIsSUFBekIsQ0FBZjtVQUNFLEtBQU0sQ0FBQSxHQUFBLENBQU4sR0FBYSxNQURmOztBQURGO0FBR0EsYUFBTztJQUxJOzsrQkFPYixVQUFBLEdBQVksU0FBQyxLQUFEO0FBQ1YsVUFBQTtNQUFBLFdBQUEsR0FBaUIsSUFBQyxDQUFBLGVBQUosR0FBeUIsT0FBekIsR0FBc0M7TUFDcEQsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsV0FBQSxDQUFZLEtBQVosQ0FBZixFQUFtQyxJQUFuQyxFQUF5QyxDQUF6QztNQUNQLEVBQUUsQ0FBQyxhQUFILENBQWlCLFlBQWpCLEVBQStCLElBQS9CLEVBQXFDO1FBQUEsSUFBQSxFQUFNLElBQU47T0FBckM7YUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFBa0M7UUFBQSxLQUFBLEVBQU8sT0FBUDtRQUFnQixZQUFBLEVBQWMsSUFBOUI7T0FBbEM7SUFKVTs7OztLQXJEaUI7QUFWL0IiLCJzb3VyY2VzQ29udGVudCI6WyJPcyA9IHJlcXVpcmUgJ29zJ1xuUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG51bmZsYXR0ZW4gPSByZXF1aXJlKCdmbGF0JykudW5mbGF0dGVuXG5mbGF0dGVuID0gcmVxdWlyZSAnZmxhdCdcbntTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxudGVtcEZpbGVQYXRoID0gUGF0aC5qb2luIE9zLnRtcGRpcigpLCBcImZpbmQtanNvbi12aWV3Lmpzb25cIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBGaW5kUGF0aExpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgaW5pdGlhbGl6ZTogKG9iamN0LCBAaXNSZXN1bHRGbGF0dGVuKSAtPlxuICAgIHN1cGVyXG4gICAgQGlzRmxhdHRlbiA/PSB0cnVlXG4gICAgQGZsYXR0ZW5Kc29uID0gQG1ha2VGbGF0dGVuSnNvbihvYmpjdClcbiAgICBAc2V0SXRlbXMoQG1ha2VJdGVtcyhAZmxhdHRlbkpzb24pKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgdmlld0Zvckl0ZW06IChwYXRoTmFtZSkgLT5cbiAgICBcIjxsaT4je3BhdGhOYW1lfTwvbGk+XCJcblxuICBoaWRlOiAtPiBAcGFuZWw/LmhpZGUoKVxuXG4gIGNvbmZpcm1lZDogKHBhdGhOYW1lKSAtPlxuICAgIEBzaG93UmVzdWx0KEBmaWx0ZXJJdGVtcyhwYXRoTmFtZSkpXG4gICAgQGhpZGUoKVxuXG4gIGNhbmNlbGxlZDogLT5cbiAgICBAaGlkZSgpXG5cbiAgIyBwcml2YXRlIC4uLlxuXG4gIG1ha2VGbGF0dGVuSnNvbjogKG9iamN0KSAtPlxuICAgIG1heERlcHRoID0gYXRvbS5jb25maWcuZ2V0KFwianNvbi1wYXRoLWZpbmRlci5tYXhEZXB0aFwiKVxuICAgIG9wdGlvbnMgPSB7fVxuICAgIGlmIG1heERlcHRoICE9IC0xXG4gICAgICBvcHRpb25zLm1heERlcHRoID0gbWF4RGVwdGhcbiAgICBmbGF0dGVuSnNvbiA9IGZsYXR0ZW4ob2JqY3QsIG9wdGlvbnMpXG4gICAgcmV0dXJuIGZsYXR0ZW5Kc29uXG5cbiAgbWFrZUl0ZW1zOiAoZmxhdHRlbkpzb24pIC0+XG4gICAgQXJyYXk6OnVuaXF1ZSA9IC0+XG4gICAgICBvdXRwdXQgPSB7fVxuICAgICAgb3V0cHV0W0Bba2V5XV0gPSBAW2tleV0gZm9yIGtleSBpbiBbMC4uLkBsZW5ndGhdXG4gICAgICB2YWx1ZSBmb3Iga2V5LCB2YWx1ZSBvZiBvdXRwdXRcblxuICAgIGl0ZW1zID0gW11cbiAgICBmb3IgcGF0aE5hbWUgaW4gT2JqZWN0LmtleXMoZmxhdHRlbkpzb24pXG4gICAgICBwYXRoTmFtZSA9IHBhdGhOYW1lLnJlcGxhY2UoL1xcLlswLTldKy9nLCBcIltdXCIpXG4gICAgICBpdGVtcy5wdXNoKHBhdGhOYW1lKVxuICAgIGl0ZW1zLnNvcnQoKVxuICAgIGl0ZW1zID0gaXRlbXMudW5pcXVlKClcbiAgICByZXR1cm4gaXRlbXNcblxuICBmaWx0ZXJJdGVtczogKHBhdGhOYW1lKSAtPlxuICAgIGl0ZW1zID0ge31cbiAgICBmb3Iga2V5LCB2YWx1ZSBvZiBAZmxhdHRlbkpzb25cbiAgICAgIGlmIHBhdGhOYW1lID09IGtleS5yZXBsYWNlKC9cXC5bMC05XSsvZywgXCJbXVwiKVxuICAgICAgICBpdGVtc1trZXldID0gdmFsdWVcbiAgICByZXR1cm4gaXRlbXNcblxuICBzaG93UmVzdWx0OiAoaXRlbXMpIC0+XG4gICAgZmxhdHRlbkZ1bmMgPSBpZiBAaXNSZXN1bHRGbGF0dGVuIHRoZW4gZmxhdHRlbiBlbHNlIHVuZmxhdHRlblxuICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShmbGF0dGVuRnVuYyhpdGVtcyksIG51bGwsIDIpXG4gICAgZnMud3JpdGVGaWxlU3luYyh0ZW1wRmlsZVBhdGgsIHRleHQsIGZsYWc6ICd3KycpXG4gICAgYXRvbS53b3Jrc3BhY2Uub3Blbih0ZW1wRmlsZVBhdGgsIHNwbGl0OiAncmlnaHQnLCBhY3RpdmF0ZVBhbmU6IHRydWUpXG4iXX0=
