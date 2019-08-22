(function() {
  var $, $$, AutocompleteView, CompositeDisposable, Range, SelectListView, _, ref, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable;

  ref1 = require('atom-space-pen-views'), $ = ref1.$, $$ = ref1.$$, SelectListView = ref1.SelectListView;

  module.exports = AutocompleteView = (function(superClass) {
    extend(AutocompleteView, superClass);

    function AutocompleteView() {
      return AutocompleteView.__super__.constructor.apply(this, arguments);
    }

    AutocompleteView.prototype.currentBuffer = null;

    AutocompleteView.prototype.checkpoint = null;

    AutocompleteView.prototype.wordList = null;

    AutocompleteView.prototype.wordRegex = /\w+/g;

    AutocompleteView.prototype.originalSelectionBufferRanges = null;

    AutocompleteView.prototype.originalCursorPosition = null;

    AutocompleteView.prototype.aboveCursor = false;

    AutocompleteView.prototype.initialize = function(editor) {
      this.editor = editor;
      AutocompleteView.__super__.initialize.apply(this, arguments);
      this.addClass('autocomplete popover-list');
      this.handleEvents();
      return this.setCurrentBuffer(this.editor.getBuffer());
    };

    AutocompleteView.prototype.getFilterKey = function() {
      return 'word';
    };

    AutocompleteView.prototype.viewForItem = function(arg) {
      var word;
      word = arg.word;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            return _this.span(word);
          };
        })(this));
      });
    };

    AutocompleteView.prototype.handleEvents = function() {
      this.list.on('mousewheel', function(event) {
        return event.stopPropagation();
      });
      this.editor.onDidChangePath((function(_this) {
        return function() {
          return _this.setCurrentBuffer(_this.editor.getBuffer());
        };
      })(this));
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this)));
      return this.filterEditorView.getModel().onWillInsertText((function(_this) {
        return function(arg) {
          var cancel, text;
          cancel = arg.cancel, text = arg.text;
          if (!text.match(_this.wordRegex)) {
            _this.confirmSelection();
            _this.editor.insertText(text);
            return cancel();
          }
        };
      })(this));
    };

    AutocompleteView.prototype.setCurrentBuffer = function(currentBuffer) {
      this.currentBuffer = currentBuffer;
    };

    AutocompleteView.prototype.selectItemView = function(item) {
      var match;
      AutocompleteView.__super__.selectItemView.apply(this, arguments);
      if (match = this.getSelectedItem()) {
        return this.replaceSelectedTextWithMatch(match);
      }
    };

    AutocompleteView.prototype.selectNextItemView = function() {
      AutocompleteView.__super__.selectNextItemView.apply(this, arguments);
      return false;
    };

    AutocompleteView.prototype.selectPreviousItemView = function() {
      AutocompleteView.__super__.selectPreviousItemView.apply(this, arguments);
      return false;
    };

    AutocompleteView.prototype.getCompletionsForCursorScope = function() {
      var completions, scope;
      scope = this.editor.scopeDescriptorForBufferPosition(this.editor.getCursorBufferPosition());
      completions = atom.config.getAll('editor.completions', {
        scope: scope
      });
      return _.uniq(_.flatten(_.pluck(completions, 'value')));
    };

    AutocompleteView.prototype.buildWordList = function() {
      var buffer, buffers, j, k, l, len, len1, len2, matches, ref2, ref3, word, wordHash;
      wordHash = {};
      if (atom.config.get('autocomplete.includeCompletionsFromAllBuffers')) {
        buffers = atom.project.getBuffers();
      } else {
        buffers = [this.currentBuffer];
      }
      matches = [];
      for (j = 0, len = buffers.length; j < len; j++) {
        buffer = buffers[j];
        matches.push(buffer.getText().match(this.wordRegex));
      }
      ref2 = _.flatten(matches);
      for (k = 0, len1 = ref2.length; k < len1; k++) {
        word = ref2[k];
        if (word) {
          if (wordHash[word] == null) {
            wordHash[word] = true;
          }
        }
      }
      ref3 = this.getCompletionsForCursorScope();
      for (l = 0, len2 = ref3.length; l < len2; l++) {
        word = ref3[l];
        if (word) {
          if (wordHash[word] == null) {
            wordHash[word] = true;
          }
        }
      }
      return this.wordList = Object.keys(wordHash).sort(function(word1, word2) {
        return word1.toLowerCase().localeCompare(word2.toLowerCase());
      });
    };

    AutocompleteView.prototype.confirmed = function(match) {
      this.editor.getSelections().forEach(function(selection) {
        return selection.clear();
      });
      this.cancel();
      if (!match) {
        return;
      }
      this.replaceSelectedTextWithMatch(match);
      return this.editor.getCursors().forEach(function(cursor) {
        var position;
        position = cursor.getBufferPosition();
        return cursor.setBufferPosition([position.row, position.column + match.suffix.length]);
      });
    };

    AutocompleteView.prototype.cancelled = function() {
      var ref2;
      if ((ref2 = this.overlayDecoration) != null) {
        ref2.destroy();
      }
      if (!this.editor.isDestroyed()) {
        this.editor.revertToCheckpoint(this.checkpoint);
        this.editor.setSelectedBufferRanges(this.originalSelectionBufferRanges);
        return atom.workspace.getActivePane().activate();
      }
    };

    AutocompleteView.prototype.attach = function() {
      var cursorMarker, matches;
      this.checkpoint = this.editor.createCheckpoint();
      this.aboveCursor = false;
      this.originalSelectionBufferRanges = this.editor.getSelections().map(function(selection) {
        return selection.getBufferRange();
      });
      this.originalCursorPosition = this.editor.getCursorScreenPosition();
      if (!this.allPrefixAndSuffixOfSelectionsMatch()) {
        return this.cancel();
      }
      this.buildWordList();
      matches = this.findMatchesForCurrentSelection();
      this.setItems(matches);
      if (matches.length === 1) {
        return this.confirmSelection();
      } else {
        cursorMarker = this.editor.getLastCursor().getMarker();
        return this.overlayDecoration = this.editor.decorateMarker(cursorMarker, {
          type: 'overlay',
          position: 'tail',
          item: this
        });
      }
    };

    AutocompleteView.prototype.destroy = function() {
      var ref2;
      return (ref2 = this.overlayDecoration) != null ? ref2.destroy() : void 0;
    };

    AutocompleteView.prototype.toggle = function() {
      if (this.isVisible()) {
        return this.cancel();
      } else {
        return this.attach();
      }
    };

    AutocompleteView.prototype.findMatchesForCurrentSelection = function() {
      var currentWord, j, k, len, len1, prefix, ref2, ref3, ref4, regex, results, results1, selection, suffix, word;
      selection = this.editor.getLastSelection();
      ref2 = this.prefixAndSuffixOfSelection(selection), prefix = ref2.prefix, suffix = ref2.suffix;
      if ((prefix.length + suffix.length) > 0) {
        regex = new RegExp("^" + prefix + ".+" + suffix + "$", "i");
        currentWord = prefix + this.editor.getSelectedText() + suffix;
        ref3 = this.wordList;
        results = [];
        for (j = 0, len = ref3.length; j < len; j++) {
          word = ref3[j];
          if (regex.test(word) && word !== currentWord) {
            results.push({
              prefix: prefix,
              suffix: suffix,
              word: word
            });
          }
        }
        return results;
      } else {
        ref4 = this.wordList;
        results1 = [];
        for (k = 0, len1 = ref4.length; k < len1; k++) {
          word = ref4[k];
          results1.push({
            word: word,
            prefix: prefix,
            suffix: suffix
          });
        }
        return results1;
      }
    };

    AutocompleteView.prototype.replaceSelectedTextWithMatch = function(match) {
      var newSelectedBufferRanges;
      newSelectedBufferRanges = [];
      return this.editor.transact((function(_this) {
        return function() {
          var selections;
          selections = _this.editor.getSelections();
          selections.forEach(function(selection, i) {
            var buffer, cursorPosition, infixLength, startPosition;
            startPosition = selection.getBufferRange().start;
            buffer = _this.editor.getBuffer();
            selection.deleteSelectedText();
            cursorPosition = _this.editor.getCursors()[i].getBufferPosition();
            buffer["delete"](Range.fromPointWithDelta(cursorPosition, 0, match.suffix.length));
            buffer["delete"](Range.fromPointWithDelta(cursorPosition, 0, -match.prefix.length));
            infixLength = match.word.length - match.prefix.length - match.suffix.length;
            return newSelectedBufferRanges.push([startPosition, [startPosition.row, startPosition.column + infixLength]]);
          });
          _this.editor.insertText(match.word);
          return _this.editor.setSelectedBufferRanges(newSelectedBufferRanges);
        };
      })(this));
    };

    AutocompleteView.prototype.prefixAndSuffixOfSelection = function(selection) {
      var lineRange, prefix, ref2, selectionRange, suffix;
      selectionRange = selection.getBufferRange();
      lineRange = [[selectionRange.start.row, 0], [selectionRange.end.row, this.editor.lineTextForBufferRow(selectionRange.end.row).length]];
      ref2 = ["", ""], prefix = ref2[0], suffix = ref2[1];
      this.currentBuffer.scanInRange(this.wordRegex, lineRange, function(arg) {
        var match, prefixOffset, range, stop, suffixOffset;
        match = arg.match, range = arg.range, stop = arg.stop;
        if (range.start.isGreaterThan(selectionRange.end)) {
          stop();
        }
        if (range.intersectsWith(selectionRange)) {
          prefixOffset = selectionRange.start.column - range.start.column;
          suffixOffset = selectionRange.end.column - range.end.column;
          if (range.start.isLessThan(selectionRange.start)) {
            prefix = match[0].slice(0, prefixOffset);
          }
          if (range.end.isGreaterThan(selectionRange.end)) {
            return suffix = match[0].slice(suffixOffset);
          }
        }
      });
      return {
        prefix: prefix,
        suffix: suffix
      };
    };

    AutocompleteView.prototype.allPrefixAndSuffixOfSelectionsMatch = function() {
      var prefix, ref2, suffix;
      ref2 = {}, prefix = ref2.prefix, suffix = ref2.suffix;
      return this.editor.getSelections().every((function(_this) {
        return function(selection) {
          var previousPrefix, previousSuffix, ref3, ref4;
          ref3 = [prefix, suffix], previousPrefix = ref3[0], previousSuffix = ref3[1];
          ref4 = _this.prefixAndSuffixOfSelection(selection), prefix = ref4.prefix, suffix = ref4.suffix;
          if (!((previousPrefix != null) && (previousSuffix != null))) {
            return true;
          }
          return prefix === previousPrefix && suffix === previousSuffix;
        };
      })(this));
    };

    AutocompleteView.prototype.attached = function() {
      var widestCompletion;
      this.focusFilterEditor();
      widestCompletion = parseInt(this.css('min-width')) || 0;
      this.list.find('span').each(function() {
        return widestCompletion = Math.max(widestCompletion, $(this).outerWidth());
      });
      this.list.width(widestCompletion);
      return this.width(this.list.outerWidth());
    };

    AutocompleteView.prototype.detached = function() {};

    AutocompleteView.prototype.populateList = function() {
      return AutocompleteView.__super__.populateList.apply(this, arguments);
    };

    return AutocompleteView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUvbGliL2F1dG9jb21wbGV0ZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsaUZBQUE7SUFBQTs7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixNQUFnQyxPQUFBLENBQVEsTUFBUixDQUFoQyxFQUFDLGlCQUFELEVBQVE7O0VBQ1IsT0FBMkIsT0FBQSxDQUFRLHNCQUFSLENBQTNCLEVBQUMsVUFBRCxFQUFJLFlBQUosRUFBUTs7RUFFUixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OytCQUNKLGFBQUEsR0FBZTs7K0JBQ2YsVUFBQSxHQUFZOzsrQkFDWixRQUFBLEdBQVU7OytCQUNWLFNBQUEsR0FBVzs7K0JBQ1gsNkJBQUEsR0FBK0I7OytCQUMvQixzQkFBQSxHQUF3Qjs7K0JBQ3hCLFdBQUEsR0FBYTs7K0JBRWIsVUFBQSxHQUFZLFNBQUMsTUFBRDtNQUFDLElBQUMsQ0FBQSxTQUFEO01BQ1gsa0RBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsMkJBQVY7TUFDQSxJQUFDLENBQUEsWUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQWxCO0lBSlU7OytCQU1aLFlBQUEsR0FBYyxTQUFBO2FBQ1o7SUFEWTs7K0JBR2QsV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxPQUFEO2FBQ1osRUFBQSxDQUFHLFNBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ0YsS0FBQyxDQUFBLElBQUQsQ0FBTSxJQUFOO1VBREU7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUo7TUFEQyxDQUFIO0lBRFc7OytCQUtiLFlB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QUE7SUFEWTs7OztLQTdMZTtBQUwvQiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG57UmFuZ2UsIENvbXBvc2l0ZURpc3Bvc2FibGV9ICA9IHJlcXVpcmUgJ2F0b20nXG57JCwgJCQsIFNlbGVjdExpc3RWaWV3fSAgPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQXV0b2NvbXBsZXRlVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGN1cnJlbnRCdWZmZXI6IG51bGxcbiAgY2hlY2twb2ludDogbnVsbFxuICB3b3JkTGlzdDogbnVsbFxuICB3b3JkUmVnZXg6IC9cXHcrL2dcbiAgb3JpZ2luYWxTZWxlY3Rpb25CdWZmZXJSYW5nZXM6IG51bGxcbiAgb3JpZ2luYWxDdXJzb3JQb3NpdGlvbjogbnVsbFxuICBhYm92ZUN1cnNvcjogZmFsc2VcblxuICBpbml0aWFsaXplOiAoQGVkaXRvcikgLT5cbiAgICBzdXBlclxuICAgIEBhZGRDbGFzcygnYXV0b2NvbXBsZXRlIHBvcG92ZXItbGlzdCcpXG4gICAgQGhhbmRsZUV2ZW50cygpXG4gICAgQHNldEN1cnJlbnRCdWZmZXIoQGVkaXRvci5nZXRCdWZmZXIoKSlcblxuICBnZXRGaWx0ZXJLZXk6IC0+XG4gICAgJ3dvcmQnXG5cbiAgdmlld0Zvckl0ZW06ICh7d29yZH0pIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSA9PlxuICAgICAgICBAc3BhbiB3b3JkXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIEBsaXN0Lm9uICdtb3VzZXdoZWVsJywgKGV2ZW50KSAtPiBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgQGVkaXRvci5vbkRpZENoYW5nZVBhdGggPT4gQHNldEN1cnJlbnRCdWZmZXIoQGVkaXRvci5nZXRCdWZmZXIoKSlcblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZERlc3Ryb3kgPT4gQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgICBAZmlsdGVyRWRpdG9yVmlldy5nZXRNb2RlbCgpLm9uV2lsbEluc2VydFRleHQgKHtjYW5jZWwsIHRleHR9KSA9PlxuICAgICAgdW5sZXNzIHRleHQubWF0Y2goQHdvcmRSZWdleClcbiAgICAgICAgQGNvbmZpcm1TZWxlY3Rpb24oKVxuICAgICAgICBAZWRpdG9yLmluc2VydFRleHQodGV4dClcbiAgICAgICAgY2FuY2VsKClcblxuICBzZXRDdXJyZW50QnVmZmVyOiAoQGN1cnJlbnRCdWZmZXIpIC0+XG5cbiAgc2VsZWN0SXRlbVZpZXc6IChpdGVtKSAtPlxuICAgIHN1cGVyXG4gICAgaWYgbWF0Y2ggPSBAZ2V0U2VsZWN0ZWRJdGVtKClcbiAgICAgIEByZXBsYWNlU2VsZWN0ZWRUZXh0V2l0aE1hdGNoKG1hdGNoKVxuXG4gIHNlbGVjdE5leHRJdGVtVmlldzogLT5cbiAgICBzdXBlclxuICAgIGZhbHNlXG5cbiAgc2VsZWN0UHJldmlvdXNJdGVtVmlldzogLT5cbiAgICBzdXBlclxuICAgIGZhbHNlXG5cbiAgZ2V0Q29tcGxldGlvbnNGb3JDdXJzb3JTY29wZTogLT5cbiAgICBzY29wZSA9IEBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oQGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKVxuICAgIGNvbXBsZXRpb25zID0gYXRvbS5jb25maWcuZ2V0QWxsKCdlZGl0b3IuY29tcGxldGlvbnMnLCB7c2NvcGV9KVxuICAgIF8udW5pcShfLmZsYXR0ZW4oXy5wbHVjayhjb21wbGV0aW9ucywgJ3ZhbHVlJykpKVxuXG4gIGJ1aWxkV29yZExpc3Q6IC0+XG4gICAgd29yZEhhc2ggPSB7fVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLmluY2x1ZGVDb21wbGV0aW9uc0Zyb21BbGxCdWZmZXJzJylcbiAgICAgIGJ1ZmZlcnMgPSBhdG9tLnByb2plY3QuZ2V0QnVmZmVycygpXG4gICAgZWxzZVxuICAgICAgYnVmZmVycyA9IFtAY3VycmVudEJ1ZmZlcl1cbiAgICBtYXRjaGVzID0gW11cbiAgICBtYXRjaGVzLnB1c2goYnVmZmVyLmdldFRleHQoKS5tYXRjaChAd29yZFJlZ2V4KSkgZm9yIGJ1ZmZlciBpbiBidWZmZXJzXG4gICAgd29yZEhhc2hbd29yZF0gPz0gdHJ1ZSBmb3Igd29yZCBpbiBfLmZsYXR0ZW4obWF0Y2hlcykgd2hlbiB3b3JkXG4gICAgd29yZEhhc2hbd29yZF0gPz0gdHJ1ZSBmb3Igd29yZCBpbiBAZ2V0Q29tcGxldGlvbnNGb3JDdXJzb3JTY29wZSgpIHdoZW4gd29yZFxuXG4gICAgQHdvcmRMaXN0ID0gT2JqZWN0LmtleXMod29yZEhhc2gpLnNvcnQgKHdvcmQxLCB3b3JkMikgLT5cbiAgICAgIHdvcmQxLnRvTG93ZXJDYXNlKCkubG9jYWxlQ29tcGFyZSh3b3JkMi50b0xvd2VyQ2FzZSgpKVxuXG4gIGNvbmZpcm1lZDogKG1hdGNoKSAtPlxuICAgIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpLmZvckVhY2ggKHNlbGVjdGlvbikgLT4gc2VsZWN0aW9uLmNsZWFyKClcbiAgICBAY2FuY2VsKClcbiAgICByZXR1cm4gdW5sZXNzIG1hdGNoXG4gICAgQHJlcGxhY2VTZWxlY3RlZFRleHRXaXRoTWF0Y2gobWF0Y2gpXG4gICAgQGVkaXRvci5nZXRDdXJzb3JzKCkuZm9yRWFjaCAoY3Vyc29yKSAtPlxuICAgICAgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKFtwb3NpdGlvbi5yb3csIHBvc2l0aW9uLmNvbHVtbiArIG1hdGNoLnN1ZmZpeC5sZW5ndGhdKVxuXG4gIGNhbmNlbGxlZDogLT5cbiAgICBAb3ZlcmxheURlY29yYXRpb24/LmRlc3Ryb3koKVxuXG4gICAgdW5sZXNzIEBlZGl0b3IuaXNEZXN0cm95ZWQoKVxuICAgICAgQGVkaXRvci5yZXZlcnRUb0NoZWNrcG9pbnQoQGNoZWNrcG9pbnQpXG5cbiAgICAgIEBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoQG9yaWdpbmFsU2VsZWN0aW9uQnVmZmVyUmFuZ2VzKVxuXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKVxuXG4gIGF0dGFjaDogLT5cbiAgICBAY2hlY2twb2ludCA9IEBlZGl0b3IuY3JlYXRlQ2hlY2twb2ludCgpXG5cbiAgICBAYWJvdmVDdXJzb3IgPSBmYWxzZVxuICAgIEBvcmlnaW5hbFNlbGVjdGlvbkJ1ZmZlclJhbmdlcyA9IEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpLm1hcCAoc2VsZWN0aW9uKSAtPiBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgIEBvcmlnaW5hbEN1cnNvclBvc2l0aW9uID0gQGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpXG5cbiAgICByZXR1cm4gQGNhbmNlbCgpIHVubGVzcyBAYWxsUHJlZml4QW5kU3VmZml4T2ZTZWxlY3Rpb25zTWF0Y2goKVxuXG4gICAgQGJ1aWxkV29yZExpc3QoKVxuICAgIG1hdGNoZXMgPSBAZmluZE1hdGNoZXNGb3JDdXJyZW50U2VsZWN0aW9uKClcbiAgICBAc2V0SXRlbXMobWF0Y2hlcylcblxuICAgIGlmIG1hdGNoZXMubGVuZ3RoIGlzIDFcbiAgICAgIEBjb25maXJtU2VsZWN0aW9uKClcbiAgICBlbHNlXG4gICAgICBjdXJzb3JNYXJrZXIgPSBAZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRNYXJrZXIoKVxuICAgICAgQG92ZXJsYXlEZWNvcmF0aW9uID0gQGVkaXRvci5kZWNvcmF0ZU1hcmtlcihjdXJzb3JNYXJrZXIsIHR5cGU6ICdvdmVybGF5JywgcG9zaXRpb246ICd0YWlsJywgaXRlbTogdGhpcylcblxuICBkZXN0cm95OiAtPlxuICAgIEBvdmVybGF5RGVjb3JhdGlvbj8uZGVzdHJveSgpXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGlmIEBpc1Zpc2libGUoKVxuICAgICAgQGNhbmNlbCgpXG4gICAgZWxzZVxuICAgICAgQGF0dGFjaCgpXG5cbiAgZmluZE1hdGNoZXNGb3JDdXJyZW50U2VsZWN0aW9uOiAtPlxuICAgIHNlbGVjdGlvbiA9IEBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpXG4gICAge3ByZWZpeCwgc3VmZml4fSA9IEBwcmVmaXhBbmRTdWZmaXhPZlNlbGVjdGlvbihzZWxlY3Rpb24pXG5cbiAgICBpZiAocHJlZml4Lmxlbmd0aCArIHN1ZmZpeC5sZW5ndGgpID4gMFxuICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKFwiXiN7cHJlZml4fS4rI3tzdWZmaXh9JFwiLCBcImlcIilcbiAgICAgIGN1cnJlbnRXb3JkID0gcHJlZml4ICsgQGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSArIHN1ZmZpeFxuICAgICAgZm9yIHdvcmQgaW4gQHdvcmRMaXN0IHdoZW4gcmVnZXgudGVzdCh3b3JkKSBhbmQgd29yZCAhPSBjdXJyZW50V29yZFxuICAgICAgICB7cHJlZml4LCBzdWZmaXgsIHdvcmR9XG4gICAgZWxzZVxuICAgICAge3dvcmQsIHByZWZpeCwgc3VmZml4fSBmb3Igd29yZCBpbiBAd29yZExpc3RcblxuICByZXBsYWNlU2VsZWN0ZWRUZXh0V2l0aE1hdGNoOiAobWF0Y2gpIC0+XG4gICAgbmV3U2VsZWN0ZWRCdWZmZXJSYW5nZXMgPSBbXVxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIHNlbGVjdGlvbnMgPSBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKVxuICAgICAgc2VsZWN0aW9ucy5mb3JFYWNoIChzZWxlY3Rpb24sIGkpID0+XG4gICAgICAgIHN0YXJ0UG9zaXRpb24gPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5zdGFydFxuICAgICAgICBidWZmZXIgPSBAZWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICAgICAgc2VsZWN0aW9uLmRlbGV0ZVNlbGVjdGVkVGV4dCgpXG4gICAgICAgIGN1cnNvclBvc2l0aW9uID0gQGVkaXRvci5nZXRDdXJzb3JzKClbaV0uZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgICBidWZmZXIuZGVsZXRlKFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShjdXJzb3JQb3NpdGlvbiwgMCwgbWF0Y2guc3VmZml4Lmxlbmd0aCkpXG4gICAgICAgIGJ1ZmZlci5kZWxldGUoUmFuZ2UuZnJvbVBvaW50V2l0aERlbHRhKGN1cnNvclBvc2l0aW9uLCAwLCAtbWF0Y2gucHJlZml4Lmxlbmd0aCkpXG5cbiAgICAgICAgaW5maXhMZW5ndGggPSBtYXRjaC53b3JkLmxlbmd0aCAtIG1hdGNoLnByZWZpeC5sZW5ndGggLSBtYXRjaC5zdWZmaXgubGVuZ3RoXG5cbiAgICAgICAgbmV3U2VsZWN0ZWRCdWZmZXJSYW5nZXMucHVzaChbc3RhcnRQb3NpdGlvbiwgW3N0YXJ0UG9zaXRpb24ucm93LCBzdGFydFBvc2l0aW9uLmNvbHVtbiArIGluZml4TGVuZ3RoXV0pXG5cbiAgICAgIEBlZGl0b3IuaW5zZXJ0VGV4dChtYXRjaC53b3JkKVxuICAgICAgQGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhuZXdTZWxlY3RlZEJ1ZmZlclJhbmdlcylcblxuICBwcmVmaXhBbmRTdWZmaXhPZlNlbGVjdGlvbjogKHNlbGVjdGlvbikgLT5cbiAgICBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgbGluZVJhbmdlID0gW1tzZWxlY3Rpb25SYW5nZS5zdGFydC5yb3csIDBdLCBbc2VsZWN0aW9uUmFuZ2UuZW5kLnJvdywgQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhzZWxlY3Rpb25SYW5nZS5lbmQucm93KS5sZW5ndGhdXVxuICAgIFtwcmVmaXgsIHN1ZmZpeF0gPSBbXCJcIiwgXCJcIl1cblxuICAgIEBjdXJyZW50QnVmZmVyLnNjYW5JblJhbmdlIEB3b3JkUmVnZXgsIGxpbmVSYW5nZSwgKHttYXRjaCwgcmFuZ2UsIHN0b3B9KSAtPlxuICAgICAgc3RvcCgpIGlmIHJhbmdlLnN0YXJ0LmlzR3JlYXRlclRoYW4oc2VsZWN0aW9uUmFuZ2UuZW5kKVxuXG4gICAgICBpZiByYW5nZS5pbnRlcnNlY3RzV2l0aChzZWxlY3Rpb25SYW5nZSlcbiAgICAgICAgcHJlZml4T2Zmc2V0ID0gc2VsZWN0aW9uUmFuZ2Uuc3RhcnQuY29sdW1uIC0gcmFuZ2Uuc3RhcnQuY29sdW1uXG4gICAgICAgIHN1ZmZpeE9mZnNldCA9IHNlbGVjdGlvblJhbmdlLmVuZC5jb2x1bW4gLSByYW5nZS5lbmQuY29sdW1uXG5cbiAgICAgICAgcHJlZml4ID0gbWF0Y2hbMF1bMC4uLnByZWZpeE9mZnNldF0gaWYgcmFuZ2Uuc3RhcnQuaXNMZXNzVGhhbihzZWxlY3Rpb25SYW5nZS5zdGFydClcbiAgICAgICAgc3VmZml4ID0gbWF0Y2hbMF1bc3VmZml4T2Zmc2V0Li5dIGlmIHJhbmdlLmVuZC5pc0dyZWF0ZXJUaGFuKHNlbGVjdGlvblJhbmdlLmVuZClcblxuICAgIHtwcmVmaXgsIHN1ZmZpeH1cblxuICBhbGxQcmVmaXhBbmRTdWZmaXhPZlNlbGVjdGlvbnNNYXRjaDogLT5cbiAgICB7cHJlZml4LCBzdWZmaXh9ID0ge31cblxuICAgIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpLmV2ZXJ5IChzZWxlY3Rpb24pID0+XG4gICAgICBbcHJldmlvdXNQcmVmaXgsIHByZXZpb3VzU3VmZml4XSA9IFtwcmVmaXgsIHN1ZmZpeF1cblxuICAgICAge3ByZWZpeCwgc3VmZml4fSA9IEBwcmVmaXhBbmRTdWZmaXhPZlNlbGVjdGlvbihzZWxlY3Rpb24pXG5cbiAgICAgIHJldHVybiB0cnVlIHVubGVzcyBwcmV2aW91c1ByZWZpeD8gYW5kIHByZXZpb3VzU3VmZml4P1xuICAgICAgcHJlZml4IGlzIHByZXZpb3VzUHJlZml4IGFuZCBzdWZmaXggaXMgcHJldmlvdXNTdWZmaXhcblxuICBhdHRhY2hlZDogLT5cbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gICAgd2lkZXN0Q29tcGxldGlvbiA9IHBhcnNlSW50KEBjc3MoJ21pbi13aWR0aCcpKSBvciAwXG4gICAgQGxpc3QuZmluZCgnc3BhbicpLmVhY2ggLT5cbiAgICAgIHdpZGVzdENvbXBsZXRpb24gPSBNYXRoLm1heCh3aWRlc3RDb21wbGV0aW9uLCAkKHRoaXMpLm91dGVyV2lkdGgoKSlcbiAgICBAbGlzdC53aWR0aCh3aWRlc3RDb21wbGV0aW9uKVxuICAgIEB3aWR0aChAbGlzdC5vdXRlcldpZHRoKCkpXG5cbiAgZGV0YWNoZWQ6IC0+XG5cbiAgcG9wdWxhdGVMaXN0OiAtPlxuICAgIHN1cGVyXG4iXX0=
