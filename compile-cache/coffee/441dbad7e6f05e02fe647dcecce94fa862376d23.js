(function() {
  var $, $$, SelectListMultipleView, SelectListView, View, fuzzyFilter, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fuzzyFilter = require('fuzzaldrin').filter;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, View = ref.View, SelectListView = ref.SelectListView;

  module.exports = SelectListMultipleView = (function(superClass) {
    extend(SelectListMultipleView, superClass);

    function SelectListMultipleView() {
      return SelectListMultipleView.__super__.constructor.apply(this, arguments);
    }

    SelectListMultipleView.prototype.initialize = function() {
      SelectListMultipleView.__super__.initialize.apply(this, arguments);
      this.selectedItems = [];
      this.list.addClass('mark-active');
      this.on('mousedown', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if (target === _this.list[0] || $(target).hasClass('btn')) {
            return false;
          }
        };
      })(this));
      this.on('keypress', (function(_this) {
        return function(arg) {
          var ctrlKey, keyCode, shiftKey;
          keyCode = arg.keyCode, ctrlKey = arg.ctrlKey, shiftKey = arg.shiftKey;
          if (keyCode === 13 && (ctrlKey || shiftKey)) {
            return _this.complete();
          }
        };
      })(this));
      return this.addButtons();
    };

    SelectListMultipleView.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-complete-button'
              }, 'Confirm');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-complete-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectListMultipleView.prototype.confirmSelection = function() {
      var item, viewItem;
      item = this.getSelectedItem();
      viewItem = this.getSelectedItemView();
      if (viewItem != null) {
        return this.confirmed(item, viewItem);
      } else {
        return this.cancel();
      }
    };

    SelectListMultipleView.prototype.confirmed = function(item, viewItem) {
      if (indexOf.call(this.selectedItems, item) >= 0) {
        this.selectedItems = this.selectedItems.filter(function(i) {
          return i !== item;
        });
        return viewItem.removeClass('active');
      } else {
        this.selectedItems.push(item);
        return viewItem.addClass('active');
      }
    };

    SelectListMultipleView.prototype.complete = function() {
      if (this.selectedItems.length > 0) {
        return this.completed(this.selectedItems);
      } else {
        return this.cancel();
      }
    };

    SelectListMultipleView.prototype.populateList = function() {
      var filterQuery, filteredItems, i, item, itemView, j, options, ref1, ref2, ref3;
      if (this.items == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      if (filterQuery.length) {
        options = {
          key: this.getFilterKey()
        };
        filteredItems = fuzzyFilter(this.items, filterQuery, options);
      } else {
        filteredItems = this.items;
      }
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = j = 0, ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
          item = (ref2 = filteredItems[i].original) != null ? ref2 : filteredItems[i];
          itemView = $(this.viewForItem(item, (ref3 = filteredItems[i].string) != null ? ref3 : null));
          itemView.data('select-list-item', item);
          if (indexOf.call(this.selectedItems, item) >= 0) {
            itemView.addClass('active');
          }
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    SelectListMultipleView.prototype.viewForItem = function(item, matchedStr) {
      throw new Error("Subclass must implement a viewForItem(item) method");
    };

    SelectListMultipleView.prototype.completed = function(items) {
      throw new Error("Subclass must implement a completed(items) method");
    };

    return SelectListMultipleView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zZWxlY3QtbGlzdC1tdWx0aXBsZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEscUVBQUE7SUFBQTs7OztFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsWUFBUixDQUFxQixDQUFDOztFQUNwQyxNQUFnQyxPQUFBLENBQVEsc0JBQVIsQ0FBaEMsRUFBQyxTQUFELEVBQUksV0FBSixFQUFRLGVBQVIsRUFBYzs7RUFpQ2QsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztxQ0FJSixVQUFBLEdBQVksU0FBQTtNQUNWLHdEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtNQUNqQixJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBZSxhQUFmO01BRUEsSUFBQyxDQUFBLEVBQUQsQ0FBSSxXQUFKLEVBQWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQ2YsY0FBQTtVQURpQixTQUFEO1VBQ2hCLElBQVMsTUFBQSxLQUFVLEtBQUMsQ0FBQSxJQUFLLENBQUEsQ0FBQSxDQUFoQixJQUFzQixDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsUUFBVixDQUFtQixLQUFuQixDQUEvQjttQkFBQSxNQUFBOztRQURlO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtNQUVBLElBQUMsQ0FBQSxFQUFELENBQUksVUFBSixFQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUFrQyxjQUFBO1VBQWhDLHVCQUFTLHVCQUFTO1VBQWMsSUFBZSxPQUFBLEtBQVcsRUFBWCxJQUFrQixDQUFDLE9BQUEsSUFBVyxRQUFaLENBQWpDO21CQUFBLEtBQUMsQ0FBQSxRQUFELENBQUEsRUFBQTs7UUFBbEM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFB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QUMsQ0FBQSxLQUFiLEVBQW9CLFdBQXBCLEVBQWlDLE9BQWpDLEVBSGxCO09BQUEsTUFBQTtRQUtFLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLE1BTG5COztNQU9BLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFBO01BQ0EsSUFBRyxhQUFhLENBQUMsTUFBakI7UUFDRSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7QUFDQSxhQUFTLDJIQUFUO1VBQ0UsSUFBQSx1REFBbUMsYUFBYyxDQUFBLENBQUE7VUFDakQsUUFBQSxHQUFXLENBQUEsQ0FBRSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQWIsb0RBQTZDLElBQTdDLENBQUY7VUFDWCxRQUFRLENBQUMsSUFBVCxDQUFjLGtCQUFkLEVBQWtDLElBQWxDO1VBQ0EsSUFBOEIsYUFBUSxJQUFDLENBQUEsYUFBVCxFQUFBLElBQUEsTUFBOUI7WUFBQSxRQUFRLENBQUMsUUFBVCxDQUFrQixRQUFsQixFQUFBOztVQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLFFBQWI7QUFMRjtlQU9BLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLFVBQVgsQ0FBaEIsRUFURjtPQUFBLE1BQUE7ZUFXRSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBeEIsRUFBZ0MsYUFBYSxDQUFDLE1BQTlDLENBQVYsRUFYRjs7SUFaWTs7cUNBb0NkLFdBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxVQUFQO0FBQ1gsWUFBTSxJQUFJLEtBQUosQ0FBVSxvREFBVjtJQURLOztxQ0FXYixTQUFBLEdBQVcsU0FBQyxLQUFEO0FBQ1QsWUFBTSxJQUFJLEtBQUosQ0FBVSxtREFBVjtJQURHOzs7O0tBM0h3QjtBQW5DckMiLCJzb3VyY2VzQ29udGVudCI6WyJmdXp6eUZpbHRlciA9IHJlcXVpcmUoJ2Z1enphbGRyaW4nKS5maWx0ZXJcbnskLCAkJCwgVmlldywgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbiMgUHVibGljOiBQcm92aWRlcyBhIHZpZXcgdGhhdCByZW5kZXJzIGEgbGlzdCBvZiBpdGVtcyB3aXRoIGFuIGVkaXRvciB0aGF0XG4jIGZpbHRlcnMgdGhlIGl0ZW1zLiBFbmFibGVzIHlvdSB0byBzZWxlY3QgbXVsdGlwbGUgaXRlbXMgYXQgb25jZS5cbiNcbiMgU3ViY2xhc3NlcyBtdXN0IGltcGxlbWVudCB0aGUgZm9sbG93aW5nIG1ldGhvZHM6XG4jXG4jICogezo6dmlld0Zvckl0ZW19XG4jICogezo6Y29tcGxldGVkfVxuI1xuIyBTdWJjbGFzc2VzIHNob3VsZCBpbXBsZW1lbnQgdGhlIGZvbGxvd2luZyBtZXRob2RzOlxuI1xuIyAqIHs6OmFkZEJ1dHRvbnN9XG4jXG4jICMjIFJlcXVpcmluZyBpbiBwYWNrYWdlc1xuI1xuIyBgYGBjb2ZmZWVcbiMge1NlbGVjdExpc3RNdWx0aXBsZVZpZXd9ID0gcmVxdWlyZSAnYXRvbSdcbiNcbiMgY2xhc3MgTXlTZWxlY3RMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RNdWx0aXBsZVZpZXdcbiMgICBpbml0aWFsaXplOiAtPlxuIyAgICAgc3VwZXJcbiMgICAgIEBhZGRDbGFzcygnb3ZlcmxheSBmcm9tLXRvcCcpXG4jICAgICBAc2V0SXRlbXMoWydIZWxsbycsICdXb3JsZCddKVxuIyAgICAgYXRvbS53b3Jrc3BhY2VWaWV3LmFwcGVuZCh0aGlzKVxuIyAgICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcbiNcbiMgICB2aWV3Rm9ySXRlbTogKGl0ZW0pIC0+XG4jICAgICBcIjxsaT4je2l0ZW19PC9saT5cIlxuI1xuIyAgIGNvbXBsZXRlZDogKGl0ZW1zKSAtPlxuIyAgICAgY29uc29sZS5sb2coXCIje2l0ZW1zfSB3ZXJlIHNlbGVjdGVkXCIpXG4jIGBgYFxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2VsZWN0TGlzdE11bHRpcGxlVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG5cbiAgIyBUaGlzIG1ldGhvZCBjYW4gYmUgb3ZlcnJpZGRlbiBieSBzdWJjbGFzc2VzIGJ1dCBgc3VwZXJgIHNob3VsZCBhbHdheXNcbiAgIyBiZSBjYWxsZWQuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgc3VwZXJcbiAgICBAc2VsZWN0ZWRJdGVtcyA9IFtdXG4gICAgQGxpc3QuYWRkQ2xhc3MoJ21hcmstYWN0aXZlJylcblxuICAgIEBvbiAnbW91c2Vkb3duJywgKHt0YXJnZXR9KSA9PlxuICAgICAgZmFsc2UgaWYgdGFyZ2V0IGlzIEBsaXN0WzBdIG9yICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuJylcbiAgICBAb24gJ2tleXByZXNzJywgKHtrZXlDb2RlLCBjdHJsS2V5LCBzaGlmdEtleX0pID0+IEBjb21wbGV0ZSgpIGlmIGtleUNvZGUgaXMgMTMgYW5kIChjdHJsS2V5IG9yIHNoaWZ0S2V5KVxuICAgIEBhZGRCdXR0b25zKClcblxuICAjIFB1YmxpYzogRnVuY3Rpb24gdG8gYWRkIGJ1dHRvbnMgdG8gdGhlIFNlbGVjdExpc3RNdWx0aXBsZVZpZXcuXG4gICNcbiAgIyBUaGlzIG1ldGhvZCBjYW4gYmUgb3ZlcnJpZGRlbiBieSBzdWJjbGFzc2VzLlxuICAjXG4gICMgIyMjIEltcG9ydGFudFxuICAjIFRoZXJlIG11c3QgYWx3YXlzIGJlIGEgYnV0dG9uIHRvIGNhbGwgdGhlIGZ1bmN0aW9uIGBAY29tcGxldGUoKWAgdG9cbiAgIyBjb25maXJtIHRoZSBzZWxlY3Rpb25zIVxuICAjXG4gICMgIyMjIyBFeGFtcGxlIChEZWZhdWx0KVxuICAjIGBgYGNvZmZlZVxuICAjIGFkZEJ1dHRvbnM6IC0+XG4gICMgICB2aWV3QnV0dG9uID0gJCQgLT5cbiAgIyAgICAgQGRpdiBjbGFzczogJ2J1dHRvbnMnLCA9PlxuICAjICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1sZWZ0JywgPT5cbiAgIyAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLWVycm9yIGlubGluZS1ibG9jay10aWdodCBidG4tY2FuY2VsLWJ1dHRvbicsICdDYW5jZWwnXG4gICMgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgIyAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLXN1Y2Nlc3MgaW5saW5lLWJsb2NrLXRpZ2h0IGJ0bi1jb21wbGV0ZS1idXR0b24nLCAnQ29uZmlybSdcbiAgIyAgIHZpZXdCdXR0b24uYXBwZW5kVG8odGhpcylcbiAgI1xuICAjICAgQG9uICdjbGljaycsICdidXR0b24nLCAoe3RhcmdldH0pID0+XG4gICMgICAgIEBjb21wbGV0ZSgpIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLWNvbXBsZXRlLWJ1dHRvbicpXG4gICMgICAgIEBjYW5jZWwoKSBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1jYW5jZWwtYnV0dG9uJylcbiAgIyBgYGBcbiAgYWRkQnV0dG9uczogLT5cbiAgICB2aWV3QnV0dG9uID0gJCQgLT5cbiAgICAgIEBkaXYgY2xhc3M6ICdidXR0b25zJywgPT5cbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLWxlZnQnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLWVycm9yIGlubGluZS1ibG9jay10aWdodCBidG4tY2FuY2VsLWJ1dHRvbicsICdDYW5jZWwnXG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tc3VjY2VzcyBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLWNvbXBsZXRlLWJ1dHRvbicsICdDb25maXJtJ1xuICAgIHZpZXdCdXR0b24uYXBwZW5kVG8odGhpcylcblxuICAgIEBvbiAnY2xpY2snLCAnYnV0dG9uJywgKHt0YXJnZXR9KSA9PlxuICAgICAgQGNvbXBsZXRlKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tY29tcGxldGUtYnV0dG9uJylcbiAgICAgIEBjYW5jZWwoKSBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1jYW5jZWwtYnV0dG9uJylcblxuICBjb25maXJtU2VsZWN0aW9uOiAtPlxuICAgIGl0ZW0gPSBAZ2V0U2VsZWN0ZWRJdGVtKClcbiAgICB2aWV3SXRlbSA9IEBnZXRTZWxlY3RlZEl0ZW1WaWV3KClcbiAgICBpZiB2aWV3SXRlbT9cbiAgICAgIEBjb25maXJtZWQoaXRlbSwgdmlld0l0ZW0pXG4gICAgZWxzZVxuICAgICAgQGNhbmNlbCgpXG5cbiAgY29uZmlybWVkOiAoaXRlbSwgdmlld0l0ZW0pIC0+XG4gICAgaWYgaXRlbSBpbiBAc2VsZWN0ZWRJdGVtc1xuICAgICAgQHNlbGVjdGVkSXRlbXMgPSBAc2VsZWN0ZWRJdGVtcy5maWx0ZXIgKGkpIC0+IGkgaXNudCBpdGVtXG4gICAgICB2aWV3SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICBlbHNlXG4gICAgICBAc2VsZWN0ZWRJdGVtcy5wdXNoIGl0ZW1cbiAgICAgIHZpZXdJdGVtLmFkZENsYXNzKCdhY3RpdmUnKVxuXG4gIGNvbXBsZXRlOiAtPlxuICAgIGlmIEBzZWxlY3RlZEl0ZW1zLmxlbmd0aCA+IDBcbiAgICAgIEBjb21wbGV0ZWQoQHNlbGVjdGVkSXRlbXMpXG4gICAgZWxzZVxuICAgICAgQGNhbmNlbCgpXG5cbiAgIyBQdWJsaWM6IFBvcHVsYXRlIHRoZSBsaXN0IHZpZXcgd2l0aCB0aGUgbW9kZWwgaXRlbXMgcHJldmlvdXNseSBzZXQgYnlcbiAgIyAgICAgICAgIGNhbGxpbmcgezo6c2V0SXRlbXN9LlxuICAjXG4gICMgU3ViY2xhc3NlcyBtYXkgb3ZlcnJpZGUgdGhpcyBtZXRob2QgYnV0IHNob3VsZCBhbHdheXMgY2FsbCBgc3VwZXJgLlxuICBwb3B1bGF0ZUxpc3Q6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAaXRlbXM/XG5cbiAgICBmaWx0ZXJRdWVyeSA9IEBnZXRGaWx0ZXJRdWVyeSgpXG4gICAgaWYgZmlsdGVyUXVlcnkubGVuZ3RoXG4gICAgICBvcHRpb25zID1cbiAgICAgICAga2V5OiBAZ2V0RmlsdGVyS2V5KClcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmdXp6eUZpbHRlcihAaXRlbXMsIGZpbHRlclF1ZXJ5LCBvcHRpb25zKVxuICAgIGVsc2VcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBAaXRlbXNcblxuICAgIEBsaXN0LmVtcHR5KClcbiAgICBpZiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aFxuICAgICAgQHNldEVycm9yKG51bGwpXG4gICAgICBmb3IgaSBpbiBbMC4uLk1hdGgubWluKGZpbHRlcmVkSXRlbXMubGVuZ3RoLCBAbWF4SXRlbXMpXVxuICAgICAgICBpdGVtID0gZmlsdGVyZWRJdGVtc1tpXS5vcmlnaW5hbCA/IGZpbHRlcmVkSXRlbXNbaV1cbiAgICAgICAgaXRlbVZpZXcgPSAkKEB2aWV3Rm9ySXRlbShpdGVtLCBmaWx0ZXJlZEl0ZW1zW2ldLnN0cmluZyA/IG51bGwpKVxuICAgICAgICBpdGVtVmlldy5kYXRhKCdzZWxlY3QtbGlzdC1pdGVtJywgaXRlbSlcbiAgICAgICAgaXRlbVZpZXcuYWRkQ2xhc3MgJ2FjdGl2ZScgaWYgaXRlbSBpbiBAc2VsZWN0ZWRJdGVtc1xuICAgICAgICBAbGlzdC5hcHBlbmQoaXRlbVZpZXcpXG5cbiAgICAgIEBzZWxlY3RJdGVtVmlldyhAbGlzdC5maW5kKCdsaTpmaXJzdCcpKVxuICAgIGVsc2VcbiAgICAgIEBzZXRFcnJvcihAZ2V0RW1wdHlNZXNzYWdlKEBpdGVtcy5sZW5ndGgsIGZpbHRlcmVkSXRlbXMubGVuZ3RoKSlcblxuICAjIFB1YmxpYzogQ3JlYXRlIGEgdmlldyBmb3IgdGhlIGdpdmVuIG1vZGVsIGl0ZW0uXG4gICNcbiAgIyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRkZW4gYnkgc3ViY2xhc3Nlcy5cbiAgI1xuICAjIFRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIGl0ZW0gaXMgYWJvdXQgdG8gYXBwZW5kZWQgdG8gdGhlIGxpc3Qgdmlldy5cbiAgI1xuICAjIGl0ZW0gICAgICAgICAgLSBUaGUgbW9kZWwgaXRlbSBiZWluZyByZW5kZXJlZC4gVGhpcyB3aWxsIGFsd2F5cyBiZSBvbmUgb2ZcbiAgIyAgICAgICAgICAgICAgICAgdGhlIGl0ZW1zIHByZXZpb3VzbHkgcGFzc2VkIHRvIHs6OnNldEl0ZW1zfS5cbiAgIyBtYXRjaGVkU3RyIC0gVGhlIGZ1enp5IGhpZ2hsaWdodGVkIHN0cmluZy5cbiAgI1xuICAjIFJldHVybnMgYSBTdHJpbmcgb2YgSFRNTCwgRE9NIGVsZW1lbnQsIGpRdWVyeSBvYmplY3QsIG9yIFZpZXcuXG4gIHZpZXdGb3JJdGVtOiAoaXRlbSwgbWF0Y2hlZFN0cikgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdWJjbGFzcyBtdXN0IGltcGxlbWVudCBhIHZpZXdGb3JJdGVtKGl0ZW0pIG1ldGhvZFwiKVxuXG4gICMgUHVibGljOiBDYWxsYmFjayBmdW5jdGlvbiBmb3Igd2hlbiB0aGUgY29tcGxldGUgYnV0dG9uIGlzIHByZXNzZWQuXG4gICNcbiAgIyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRkZW4gYnkgc3ViY2xhc3Nlcy5cbiAgI1xuICAjIGl0ZW1zIC0gQW4ge0FycmF5fSBjb250YWluaW5nIHRoZSBzZWxlY3RlZCBpdGVtcy4gVGhpcyB3aWxsIGFsd2F5cyBiZSBvbmVcbiAgIyAgICAgICAgIG9mIHRoZSBpdGVtcyBwcmV2aW91c2x5IHBhc3NlZCB0byB7OjpzZXRJdGVtc30uXG4gICNcbiAgIyBSZXR1cm5zIGEgRE9NIGVsZW1lbnQsIGpRdWVyeSBvYmplY3QsIG9yIHtWaWV3fS5cbiAgY29tcGxldGVkOiAoaXRlbXMpIC0+XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU3ViY2xhc3MgbXVzdCBpbXBsZW1lbnQgYSBjb21wbGV0ZWQoaXRlbXMpIG1ldGhvZFwiKVxuIl19
