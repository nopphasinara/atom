(function() {
  var $$, BufferedProcess, SelectListView, TagCreateView, TagListView, TagView, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BufferedProcess = require('atom').BufferedProcess;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  TagView = require('./tag-view');

  TagCreateView = require('./tag-create-view');

  module.exports = TagListView = (function(superClass) {
    extend(TagListView, superClass);

    function TagListView() {
      return TagListView.__super__.constructor.apply(this, arguments);
    }

    TagListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data != null ? data : '';
      TagListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagListView.prototype.parseData = function() {
      var item, items, tmp;
      if (this.data.length > 0) {
        this.data = this.data.split("\n").slice(0, -1);
        items = (function() {
          var i, len, ref1, results;
          ref1 = this.data.reverse();
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            item = ref1[i];
            if (!(item !== '')) {
              continue;
            }
            tmp = item.match(/([\w\d-_\/.]+)\s(.*)/);
            results.push({
              tag: tmp != null ? tmp[1] : void 0,
              annotation: tmp != null ? tmp[2] : void 0
            });
          }
          return results;
        }).call(this);
      } else {
        items = [];
      }
      items.push({
        tag: '+ Add Tag',
        annotation: 'Add a tag referencing the current commit.'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagListView.prototype.getFilterKey = function() {
      return 'tag';
    };

    TagListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagListView.prototype.cancelled = function() {
      return this.hide();
    };

    TagListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    TagListView.prototype.viewForItem = function(arg) {
      var annotation, tag;
      tag = arg.tag, annotation = arg.annotation;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, tag);
            return _this.div({
              "class": 'text-warning'
            }, annotation);
          };
        })(this));
      });
    };

    TagListView.prototype.confirmed = function(arg) {
      var tag;
      tag = arg.tag;
      this.cancel();
      if (tag === '+ Add Tag') {
        return new TagCreateView(this.repo);
      } else {
        return new TagView(this.repo, tag);
      }
    };

    return TagListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvdGFnLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDZFQUFBO0lBQUE7OztFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUjs7RUFDcEIsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUVMLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUjs7RUFDVixhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUjs7RUFFaEIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OzswQkFFSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsSUFBUjtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLHNCQUFELE9BQU07TUFDeEIsNkNBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO0lBSFU7OzBCQUtaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLElBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLEdBQWUsQ0FBbEI7UUFDRSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLElBQVosQ0FBa0I7UUFDMUIsS0FBQTs7QUFDRTtBQUFBO2VBQUEsc0NBQUE7O2tCQUFpQyxJQUFBLEtBQVE7OztZQUN2QyxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxzQkFBWDt5QkFDTjtjQUFDLEdBQUEsZ0JBQUssR0FBSyxDQUFBLENBQUEsVUFBWDtjQUFlLFVBQUEsZ0JBQVksR0FBSyxDQUFBLENBQUEsVUFBaEM7O0FBRkY7O3NCQUhKO09BQUEsTUFBQTtRQVFFLEtBQUEsR0FBUSxHQVJWOztNQVVBLEtBQUssQ0FBQyxJQUFOLENBQVc7UUFBQyxHQUFBLEVBQUssV0FBTjtRQUFtQixVQUFBLEVBQVksMkNBQS9CO09BQVg7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVY7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQWJTOzswQkFlWCxZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7OzBCQUVkLElBQUEsR0FBTSxTQUFBOztRQUNKLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7SUFISTs7MEJBS04sU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7OzBCQUVYLElBQUEsR0FBTSxTQUFBO0FBQUcsVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQUFIOzswQkFFTixXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQURhLGVBQUs7YUFDbEIsRUFBQSxDQUFHLFNBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDRixLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxnQkFBUDthQUFMLEVBQThCLEdBQTlCO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQVA7YUFBTCxFQUE0QixVQUE1QjtVQUZFO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFKO01BREMsQ0FBSDtJQURXOzswQkFNYixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQURXLE1BQUQ7TUFDVixJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsSUFBRyxHQUFBLEtBQU8sV0FBVjtlQUNFLElBQUksYUFBSixDQUFrQixJQUFDLENBQUEsSUFBbkIsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFJLE9BQUosQ0FBWSxJQUFDLENBQUEsSUFBYixFQUFtQixHQUFuQixFQUhGOztJQUZTOzs7O0tBdkNhO0FBUDFCIiwic291cmNlc0NvbnRlbnQiOlsie0J1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xueyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuVGFnVmlldyA9IHJlcXVpcmUgJy4vdGFnLXZpZXcnXG5UYWdDcmVhdGVWaWV3ID0gcmVxdWlyZSAnLi90YWctY3JlYXRlLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRhZ0xpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcblxuICBpbml0aWFsaXplOiAoQHJlcG8sIEBkYXRhPScnKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBwYXJzZURhdGEoKVxuXG4gIHBhcnNlRGF0YTogLT5cbiAgICBpZiBAZGF0YS5sZW5ndGggPiAwXG4gICAgICBAZGF0YSA9IEBkYXRhLnNwbGl0KFwiXFxuXCIpWy4uLi0xXVxuICAgICAgaXRlbXMgPSAoXG4gICAgICAgIGZvciBpdGVtIGluIEBkYXRhLnJldmVyc2UoKSB3aGVuIGl0ZW0gIT0gJydcbiAgICAgICAgICB0bXAgPSBpdGVtLm1hdGNoIC8oW1xcd1xcZC1fLy5dKylcXHMoLiopL1xuICAgICAgICAgIHt0YWc6IHRtcD9bMV0sIGFubm90YXRpb246IHRtcD9bMl19XG4gICAgICApXG4gICAgZWxzZVxuICAgICAgaXRlbXMgPSBbXVxuXG4gICAgaXRlbXMucHVzaCB7dGFnOiAnKyBBZGQgVGFnJywgYW5ub3RhdGlvbjogJ0FkZCBhIHRhZyByZWZlcmVuY2luZyB0aGUgY3VycmVudCBjb21taXQuJ31cbiAgICBAc2V0SXRlbXMgaXRlbXNcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGdldEZpbHRlcktleTogLT4gJ3RhZydcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPiBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoe3RhZywgYW5ub3RhdGlvbn0pIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC1oaWdobGlnaHQnLCB0YWdcbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtd2FybmluZycsIGFubm90YXRpb25cblxuICBjb25maXJtZWQ6ICh7dGFnfSkgLT5cbiAgICBAY2FuY2VsKClcbiAgICBpZiB0YWcgaXMgJysgQWRkIFRhZydcbiAgICAgIG5ldyBUYWdDcmVhdGVWaWV3KEByZXBvKVxuICAgIGVsc2VcbiAgICAgIG5ldyBUYWdWaWV3KEByZXBvLCB0YWcpXG4iXX0=
