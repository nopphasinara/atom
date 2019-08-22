(function() {
  var $, $$, ActivityLogger, EditorView, Repository, SelectListMultipleView, SelectStageFilesView, git, prettify, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, EditorView = ref.EditorView;

  git = require('../git');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  SelectListMultipleView = require('./select-list-multiple-view');

  prettify = function(data) {
    var file, i, j, len, result, results;
    result = data.match(/rm ('.*')/g);
    if ((result != null ? result.length : void 0) >= 1) {
      results = [];
      for (i = j = 0, len = result.length; j < len; i = ++j) {
        file = result[i];
        results.push(result[i] = ' ' + file.match(/rm '(.*)'/)[1]);
      }
      return results;
    }
  };

  module.exports = SelectStageFilesView = (function(superClass) {
    extend(SelectStageFilesView, superClass);

    function SelectStageFilesView() {
      return SelectStageFilesView.__super__.constructor.apply(this, arguments);
    }

    SelectStageFilesView.prototype.initialize = function(repo, items) {
      this.repo = repo;
      SelectStageFilesView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    SelectStageFilesView.prototype.addButtons = function() {
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
                "class": 'btn btn-success inline-block-tight btn-remove-button'
              }, 'Remove');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-remove-button')) {
            if (window.confirm('Are you sure?')) {
              _this.complete();
            }
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageFilesView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageFilesView.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageFilesView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    SelectStageFilesView.prototype.viewForItem = function(item, matchedStr) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(item);
            }
          };
        })(this));
      });
    };

    SelectStageFilesView.prototype.completed = function(items) {
      var currentFile, editor, files, item, ref1, repoName;
      files = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = items.length; j < len; j++) {
          item = items[j];
          if (item !== '') {
            results.push(item);
          }
        }
        return results;
      })();
      this.cancel();
      currentFile = this.repo.relativize((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0);
      editor = atom.workspace.getActiveTextEditor();
      if (indexOf.call(files, currentFile) >= 0) {
        atom.views.getView(editor).remove();
      }
      repoName = new Repository(this.repo).getName();
      return git.cmd(['rm', '-f'].concat(files), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        return ActivityLogger.record({
          repoName: repoName,
          message: "Remove '" + (prettify(data)) + "'",
          output: data
        });
      })["catch"](function(data) {
        return ActivityLogger.record({
          repoName: repoName,
          message: "Remove '" + (prettify(data)) + "'",
          output: data,
          failed: true
        });
      });
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmVtb3ZlLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLCtHQUFBO0lBQUE7Ozs7RUFBQSxNQUFzQixPQUFBLENBQVEsc0JBQVIsQ0FBdEIsRUFBQyxTQUFELEVBQUksV0FBSixFQUFROztFQUVSLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBQ3JDLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSw2QkFBUjs7RUFFekIsUUFBQSxHQUFXLFNBQUMsSUFBRDtBQUNULFFBQUE7SUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFYO0lBQ1Qsc0JBQUcsTUFBTSxDQUFFLGdCQUFSLElBQWtCLENBQXJCO0FBQ0U7V0FBQSxnREFBQTs7cUJBQ0UsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFZLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLFdBQVgsQ0FBd0IsQ0FBQSxDQUFBO0FBRDVDO3FCQURGOztFQUZTOztFQU1YLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7bUNBRUosVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLEtBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUNYLHNEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFKVTs7bUNBTVosVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsVUFBQSxHQUFhLEVBQUEsQ0FBRyxTQUFBO2VBQ2QsSUFBQyxDQUFB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LENBQUMsR0FBSixDQUFRLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FBWSxDQUFDLE1BQWIsQ0FBb0IsS0FBcEIsQ0FBUixFQUFvQztRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUFwQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtlQUNKLGNBQWMsQ0FBQyxNQUFmLENBQXNCO1VBQUMsVUFBQSxRQUFEO1VBQVcsT0FBQSxFQUFTLFVBQUEsR0FBVSxDQUFDLFFBQUEsQ0FBUyxJQUFULENBQUQsQ0FBVixHQUEwQixHQUE5QztVQUFrRCxNQUFBLEVBQVEsSUFBMUQ7U0FBdEI7TUFESSxDQUROLENBR0EsRUFBQyxLQUFELEVBSEEsQ0FHTyxTQUFDLElBQUQ7ZUFDTCxjQUFjLENBQUMsTUFBZixDQUFzQjtVQUFDLFVBQUEsUUFBRDtVQUFXLE9BQUEsRUFBUyxVQUFBLEdBQVUsQ0FBQyxRQUFBLENBQVMsSUFBVCxDQUFELENBQVYsR0FBMEIsR0FBOUM7VUFBa0QsTUFBQSxFQUFRLElBQTFEO1VBQWdFLE1BQUEsRUFBUSxJQUF4RTtTQUF0QjtNQURLLENBSFA7SUFSUzs7OztLQXRDc0I7QUFkbkMiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCwgJCQsIEVkaXRvclZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5TZWxlY3RMaXN0TXVsdGlwbGVWaWV3ID0gcmVxdWlyZSAnLi9zZWxlY3QtbGlzdC1tdWx0aXBsZS12aWV3J1xuXG5wcmV0dGlmeSA9IChkYXRhKSAtPlxuICByZXN1bHQgPSBkYXRhLm1hdGNoKC9ybSAoJy4qJykvZylcbiAgaWYgcmVzdWx0Py5sZW5ndGggPj0gMVxuICAgIGZvciBmaWxlLCBpIGluIHJlc3VsdFxuICAgICAgcmVzdWx0W2ldID0gJyAnICsgZmlsZS5tYXRjaCgvcm0gJyguKiknLylbMV1cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2VsZWN0U3RhZ2VGaWxlc1ZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0TXVsdGlwbGVWaWV3XG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvLCBpdGVtcykgLT5cbiAgICBzdXBlclxuICAgIEBzaG93KClcbiAgICBAc2V0SXRlbXMgaXRlbXNcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGFkZEJ1dHRvbnM6IC0+XG4gICAgdmlld0J1dHRvbiA9ICQkIC0+XG4gICAgICBAZGl2IGNsYXNzOiAnYnV0dG9ucycsID0+XG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1sZWZ0JywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1lcnJvciBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLWNhbmNlbC1idXR0b24nLCAnQ2FuY2VsJ1xuICAgICAgICBAc3BhbiBjbGFzczogJ3B1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLXN1Y2Nlc3MgaW5saW5lLWJsb2NrLXRpZ2h0IGJ0bi1yZW1vdmUtYnV0dG9uJywgJ1JlbW92ZSdcbiAgICB2aWV3QnV0dG9uLmFwcGVuZFRvKHRoaXMpXG5cbiAgICBAb24gJ2NsaWNrJywgJ2J1dHRvbicsICh7dGFyZ2V0fSkgPT5cbiAgICAgIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLXJlbW92ZS1idXR0b24nKVxuICAgICAgICBAY29tcGxldGUoKSBpZiB3aW5kb3cuY29uZmlybSAnQXJlIHlvdSBzdXJlPydcbiAgICAgIEBjYW5jZWwoKSBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1jYW5jZWwtYnV0dG9uJylcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+XG4gICAgQGhpZGUoKVxuXG4gIGhpZGU6IC0+XG4gICAgQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKGl0ZW0sIG1hdGNoZWRTdHIpIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSA9PlxuICAgICAgICBpZiBtYXRjaGVkU3RyPyB0aGVuIEByYXcobWF0Y2hlZFN0cikgZWxzZSBAc3BhbiBpdGVtXG5cbiAgY29tcGxldGVkOiAoaXRlbXMpIC0+XG4gICAgZmlsZXMgPSAoaXRlbSBmb3IgaXRlbSBpbiBpdGVtcyB3aGVuIGl0ZW0gaXNudCAnJylcbiAgICBAY2FuY2VsKClcbiAgICBjdXJyZW50RmlsZSA9IEByZXBvLnJlbGF0aXZpemUgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKClcblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLnJlbW92ZSgpIGlmIGN1cnJlbnRGaWxlIGluIGZpbGVzXG4gICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShAcmVwbykuZ2V0TmFtZSgpXG4gICAgZ2l0LmNtZChbJ3JtJywgJy1mJ10uY29uY2F0KGZpbGVzKSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBcIlJlbW92ZSAnI3twcmV0dGlmeShkYXRhKX0nXCIsIG91dHB1dDogZGF0YX0pXG4gICAgLmNhdGNoIChkYXRhKSAtPlxuICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogXCJSZW1vdmUgJyN7cHJldHRpZnkoZGF0YSl9J1wiLCBvdXRwdXQ6IGRhdGEsIGZhaWxlZDogdHJ1ZX0pXG4iXX0=
