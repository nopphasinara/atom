(function() {
  var $, $$, SelectListMultipleView, SelectStageHunks, fs, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs-plus');

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageHunks = (function(superClass) {
    extend(SelectStageHunks, superClass);

    function SelectStageHunks() {
      return SelectStageHunks.__super__.constructor.apply(this, arguments);
    }

    SelectStageHunks.prototype.initialize = function(repo, data) {
      this.repo = repo;
      SelectStageHunks.__super__.initialize.apply(this, arguments);
      this.patch_header = data[0];
      if (data.length === 2) {
        return this.completed(this._generateObjects(data.slice(1)));
      }
      this.show();
      this.setItems(this._generateObjects(data.slice(1)));
      return this.focusFilterEditor();
    };

    SelectStageHunks.prototype.getFilterKey = function() {
      return 'pos';
    };

    SelectStageHunks.prototype.addButtons = function() {
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
                "class": 'btn btn-success inline-block-tight btn-stage-button'
              }, 'Stage');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-stage-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageHunks.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageHunks.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageHunks.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    SelectStageHunks.prototype.viewForItem = function(item, matchedStr) {
      var viewItem;
      return viewItem = $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'inline-block highlight'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.pos);
              }
            });
            return _this.div({
              "class": 'text-warning gp-item-diff',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, item.diff);
          };
        })(this));
      });
    };

    SelectStageHunks.prototype.completed = function(items) {
      var patchPath, patch_full;
      this.cancel();
      if (items.length < 1) {
        return;
      }
      patch_full = this.patch_header;
      items.forEach(function(item) {
        return patch_full += (item != null ? item.patch : void 0);
      });
      patchPath = this.repo.getWorkingDirectory() + '/GITPLUS_PATCH';
      return fs.writeFile(patchPath, patch_full, {
        flag: 'w+'
      }, (function(_this) {
        return function(err) {
          if (!err) {
            return git.cmd(['apply', '--cached', '--', patchPath], {
              cwd: _this.repo.getWorkingDirectory()
            }).then(function(data) {
              data = (data != null) && data !== '' ? data : 'Hunk has been staged!';
              notifier.addSuccess(data);
              try {
                return fs.unlink(patchPath);
              } catch (error) {}
            });
          } else {
            return notifier.addError(err);
          }
        };
      })(this));
    };

    SelectStageHunks.prototype._generateObjects = function(data) {
      var hunk, hunkSplit, i, len, results;
      results = [];
      for (i = 0, len = data.length; i < len; i++) {
        hunk = data[i];
        if (!(hunk !== '')) {
          continue;
        }
        hunkSplit = hunk.match(/(@@[ \-\+\,0-9]*@@.*)\n([\s\S]*)/);
        results.push({
          pos: hunkSplit[1],
          diff: hunkSplit[2],
          patch: hunk
        });
      }
      return results;
    };

    return SelectStageHunks;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zZWxlY3Qtc3RhZ2UtaHVua3Mtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHVFQUFBO0lBQUE7OztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxNQUFVLE9BQUEsQ0FBUSxzQkFBUixDQUFWLEVBQUMsU0FBRCxFQUFJOztFQUVKLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLDZCQUFSOztFQUV6QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OytCQUNKLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxJQUFSO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFDWCxrREFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBSyxDQUFBLENBQUE7TUFDckIsSUFBa0QsSUFBSSxDQUFDLE1BQUwsS0FBZSxDQUFqRTtBQUFBLGVBQU8sSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFBSyxTQUF2QixDQUFYLEVBQVA7O01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUssU0FBdkIsQ0FBVjthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBTlU7OytCQVFaLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7K0JBRWQsVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsVUFBQSxHQUFhLEVBQUEsQ0FBRyxTQUFBO2VBQ2QsSUFBQyxDQUFBLEdBQUQsQ0FBSztVQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDtTQUFMLEVB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SCxDQUFhLFNBQWIsRUFBd0IsVUFBeEIsRUFBb0M7UUFBQSxJQUFBLEVBQU0sSUFBTjtPQUFwQyxFQUFnRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtVQUM5QyxJQUFBLENBQU8sR0FBUDttQkFDRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsT0FBRCxFQUFVLFVBQVYsRUFBc0IsSUFBdEIsRUFBNEIsU0FBNUIsQ0FBUixFQUFnRDtjQUFBLEdBQUEsRUFBSyxLQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDthQUFoRCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtjQUNKLElBQUEsR0FBVSxjQUFBLElBQVUsSUFBQSxLQUFVLEVBQXZCLEdBQStCLElBQS9CLEdBQXlDO2NBQ2hELFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCO0FBQ0E7dUJBQUksRUFBRSxDQUFDLE1BQUgsQ0FBVSxTQUFWLEVBQUo7ZUFBQTtZQUhJLENBRE4sRUFERjtXQUFBLE1BQUE7bUJBT0UsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsR0FBbEIsRUFQRjs7UUFEOEM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhEO0lBVFM7OytCQW1CWCxnQkFBQSxHQUFrQixTQUFDLElBQUQ7QUFDaEIsVUFBQTtBQUFBO1dBQUEsc0NBQUE7O2NBQXNCLElBQUEsS0FBVTs7O1FBQzlCLFNBQUEsR0FBWSxJQUFJLENBQUMsS0FBTCxDQUFXLGtDQUFYO3FCQUNaO1VBQ0UsR0FBQSxFQUFLLFNBQVUsQ0FBQSxDQUFBLENBRGpCO1VBRUUsSUFBQSxFQUFNLFNBQVUsQ0FBQSxDQUFBLENBRmxCO1VBR0UsS0FBQSxFQUFPLElBSFQ7O0FBRkY7O0lBRGdCOzs7O0tBM0RXO0FBUi9CIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xueyQsICQkfSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuU2VsZWN0TGlzdE11bHRpcGxlVmlldyA9IHJlcXVpcmUgJy4vc2VsZWN0LWxpc3QtbXVsdGlwbGUtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2VsZWN0U3RhZ2VIdW5rcyBleHRlbmRzIFNlbGVjdExpc3RNdWx0aXBsZVZpZXdcbiAgaW5pdGlhbGl6ZTogKEByZXBvLCBkYXRhKSAtPlxuICAgIHN1cGVyXG4gICAgQHBhdGNoX2hlYWRlciA9IGRhdGFbMF1cbiAgICByZXR1cm4gQGNvbXBsZXRlZCBAX2dlbmVyYXRlT2JqZWN0cyhkYXRhWzEuLl0pIGlmIGRhdGEubGVuZ3RoIGlzIDJcbiAgICBAc2hvdygpXG4gICAgQHNldEl0ZW1zIEBfZ2VuZXJhdGVPYmplY3RzKGRhdGFbMS4uXSlcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGdldEZpbHRlcktleTogLT4gJ3BvcydcblxuICBhZGRCdXR0b25zOiAtPlxuICAgIHZpZXdCdXR0b24gPSAkJCAtPlxuICAgICAgQGRpdiBjbGFzczogJ2J1dHRvbnMnLCA9PlxuICAgICAgICBAc3BhbiBjbGFzczogJ3B1bGwtbGVmdCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tZXJyb3IgaW5saW5lLWJsb2NrLXRpZ2h0IGJ0bi1jYW5jZWwtYnV0dG9uJywgJ0NhbmNlbCdcbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1zdWNjZXNzIGlubGluZS1ibG9jay10aWdodCBidG4tc3RhZ2UtYnV0dG9uJywgJ1N0YWdlJ1xuICAgIHZpZXdCdXR0b24uYXBwZW5kVG8odGhpcylcblxuICAgIEBvbiAnY2xpY2snLCAnYnV0dG9uJywgKHt0YXJnZXR9KSA9PlxuICAgICAgQGNvbXBsZXRlKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tc3RhZ2UtYnV0dG9uJylcbiAgICAgIEBjYW5jZWwoKSBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1jYW5jZWwtYnV0dG9uJylcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPiBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoaXRlbSwgbWF0Y2hlZFN0cikgLT5cbiAgICB2aWV3SXRlbSA9ICQkIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2lubGluZS1ibG9jayBoaWdobGlnaHQnLCA9PlxuICAgICAgICAgIGlmIG1hdGNoZWRTdHI/IHRoZW4gQHJhdyhtYXRjaGVkU3RyKSBlbHNlIEBzcGFuIGl0ZW0ucG9zXG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LXdhcm5pbmcgZ3AtaXRlbS1kaWZmJywgc3R5bGU6ICd3aGl0ZS1zcGFjZTogcHJlLXdyYXA7IGZvbnQtZmFtaWx5OiBtb25vc3BhY2UnLCBpdGVtLmRpZmZcblxuICBjb21wbGV0ZWQ6IChpdGVtcykgLT5cbiAgICBAY2FuY2VsKClcbiAgICByZXR1cm4gaWYgaXRlbXMubGVuZ3RoIDwgMVxuXG4gICAgcGF0Y2hfZnVsbCA9IEBwYXRjaF9oZWFkZXJcbiAgICBpdGVtcy5mb3JFYWNoIChpdGVtKSAtPlxuICAgICAgcGF0Y2hfZnVsbCArPSAoaXRlbT8ucGF0Y2gpXG5cbiAgICBwYXRjaFBhdGggPSBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkgKyAnL0dJVFBMVVNfUEFUQ0gnXG4gICAgZnMud3JpdGVGaWxlIHBhdGNoUGF0aCwgcGF0Y2hfZnVsbCwgZmxhZzogJ3crJywgKGVycikgPT5cbiAgICAgIHVubGVzcyBlcnJcbiAgICAgICAgZ2l0LmNtZChbJ2FwcGx5JywgJy0tY2FjaGVkJywgJy0tJywgcGF0Y2hQYXRoXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICAgIGRhdGEgPSBpZiBkYXRhPyBhbmQgZGF0YSBpc250ICcnIHRoZW4gZGF0YSBlbHNlICdIdW5rIGhhcyBiZWVuIHN0YWdlZCEnXG4gICAgICAgICAgbm90aWZpZXIuYWRkU3VjY2VzcyhkYXRhKVxuICAgICAgICAgIHRyeSBmcy51bmxpbmsgcGF0Y2hQYXRoXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZEVycm9yIGVyclxuXG4gIF9nZW5lcmF0ZU9iamVjdHM6IChkYXRhKSAtPlxuICAgIGZvciBodW5rIGluIGRhdGEgd2hlbiBodW5rIGlzbnQgJydcbiAgICAgIGh1bmtTcGxpdCA9IGh1bmsubWF0Y2ggLyhAQFsgXFwtXFwrXFwsMC05XSpAQC4qKVxcbihbXFxzXFxTXSopL1xuICAgICAge1xuICAgICAgICBwb3M6IGh1bmtTcGxpdFsxXVxuICAgICAgICBkaWZmOiBodW5rU3BsaXRbMl1cbiAgICAgICAgcGF0Y2g6IGh1bmtcbiAgICAgIH1cbiJdfQ==
