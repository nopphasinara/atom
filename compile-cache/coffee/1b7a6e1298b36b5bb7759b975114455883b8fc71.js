(function() {
  var Point, Range, actionUtils, editorUtils, emmet, insertSnippet, normalize, path, preprocessSnippet, ref, resources, tabStops, utils, visualize;

  ref = require('atom'), Point = ref.Point, Range = ref.Range;

  path = require('path');

  emmet = require('emmet');

  utils = require('emmet/lib/utils/common');

  tabStops = require('emmet/lib/assets/tabStops');

  resources = require('emmet/lib/assets/resources');

  editorUtils = require('emmet/lib/utils/editor');

  actionUtils = require('emmet/lib/utils/action');

  insertSnippet = function(snippet, editor) {
    var ref1, ref2, ref3, ref4;
    if ((ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
      if ((ref2 = ref1.mainModule) != null) {
        ref2.insert(snippet, editor);
      }
    }
    return editor.snippetExpansion = (ref3 = atom.packages.getLoadedPackage('snippets')) != null ? (ref4 = ref3.mainModule) != null ? ref4.getExpansions(editor)[0] : void 0 : void 0;
  };

  visualize = function(str) {
    return str.replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\s/g, '\\s');
  };

  normalize = function(text, editor) {
    return editorUtils.normalize(text, {
      indentation: editor.getTabText(),
      newline: '\n'
    });
  };

  preprocessSnippet = function(value) {
    var order, tabstopOptions;
    order = [];
    tabstopOptions = {
      tabstop: function(data) {
        var group, placeholder;
        group = parseInt(data.group, 10);
        if (group === 0) {
          order.push(-1);
          group = order.length;
        } else {
          if (order.indexOf(group) === -1) {
            order.push(group);
          }
          group = order.indexOf(group) + 1;
        }
        placeholder = data.placeholder || '';
        if (placeholder) {
          placeholder = tabStops.processText(placeholder, tabstopOptions);
        }
        if (placeholder) {
          return "${" + group + ":" + placeholder + "}";
        } else {
          return "${" + group + "}";
        }
      },
      escape: function(ch) {
        if (ch === '$') {
          return '\\$';
        } else {
          return ch;
        }
      }
    };
    return tabStops.processText(value, tabstopOptions);
  };

  module.exports = {
    setup: function(editor1, selectionIndex) {
      var buf, bufRanges;
      this.editor = editor1;
      this.selectionIndex = selectionIndex != null ? selectionIndex : 0;
      buf = this.editor.getBuffer();
      bufRanges = this.editor.getSelectedBufferRanges();
      return this._selection = {
        index: 0,
        saved: new Array(bufRanges.length),
        bufferRanges: bufRanges,
        indexRanges: bufRanges.map(function(range) {
          return {
            start: buf.characterIndexForPosition(range.start),
            end: buf.characterIndexForPosition(range.end)
          };
        })
      };
    },
    exec: function(fn) {
      var ix, success;
      ix = this._selection.bufferRanges.length - 1;
      this._selection.saved = [];
      success = true;
      while (ix >= 0) {
        this._selection.index = ix;
        if (fn(this._selection.index) === false) {
          success = false;
          break;
        }
        ix--;
      }
      if (success && this._selection.saved.length > 1) {
        return this._setSelectedBufferRanges(this._selection.saved);
      }
    },
    _setSelectedBufferRanges: function(sels) {
      var filteredSels;
      filteredSels = sels.filter(function(s) {
        return !!s;
      });
      if (filteredSels.length) {
        return this.editor.setSelectedBufferRanges(filteredSels);
      }
    },
    _saveSelection: function(delta) {
      var i, range, results;
      this._selection.saved[this._selection.index] = this.editor.getSelectedBufferRange();
      if (delta) {
        i = this._selection.index;
        delta = Point.fromObject([delta, 0]);
        results = [];
        while (++i < this._selection.saved.length) {
          range = this._selection.saved[i];
          if (range) {
            results.push(this._selection.saved[i] = new Range(range.start.translate(delta), range.end.translate(delta)));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    },
    selectionList: function() {
      return this._selection.indexRanges;
    },
    getCaretPos: function() {
      return this.getSelectionRange().start;
    },
    setCaretPos: function(pos) {
      return this.createSelection(pos);
    },
    getSelectionRange: function() {
      return this._selection.indexRanges[this._selection.index];
    },
    getSelectionBufferRange: function() {
      return this._selection.bufferRanges[this._selection.index];
    },
    createSelection: function(start, end) {
      var buf, sels;
      if (end == null) {
        end = start;
      }
      sels = this._selection.bufferRanges;
      buf = this.editor.getBuffer();
      sels[this._selection.index] = new Range(buf.positionForCharacterIndex(start), buf.positionForCharacterIndex(end));
      return this._setSelectedBufferRanges(sels);
    },
    getSelection: function() {
      return this.editor.getTextInBufferRange(this.getSelectionBufferRange());
    },
    getCurrentLineRange: function() {
      var index, lineLength, row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      lineLength = this.editor.lineTextForBufferRow(row).length;
      index = this.editor.getBuffer().characterIndexForPosition({
        row: row,
        column: 0
      });
      return {
        start: index,
        end: index + lineLength
      };
    },
    getCurrentLine: function() {
      var row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      return this.editor.lineTextForBufferRow(row);
    },
    getContent: function() {
      return this.editor.getText();
    },
    replaceContent: function(value, start, end, noIndent) {
      var buf, caret, changeRange, oldValue;
      if (end == null) {
        end = start == null ? this.getContent().length : start;
      }
      if (start == null) {
        start = 0;
      }
      value = normalize(value, this.editor);
      buf = this.editor.getBuffer();
      changeRange = new Range(Point.fromObject(buf.positionForCharacterIndex(start)), Point.fromObject(buf.positionForCharacterIndex(end)));
      oldValue = this.editor.getTextInBufferRange(changeRange);
      buf.setTextInRange(changeRange, '');
      caret = buf.positionForCharacterIndex(start);
      this.editor.setSelectedBufferRange(new Range(caret, caret));
      insertSnippet(preprocessSnippet(value), this.editor);
      this._saveSelection(utils.splitByLines(value).length - utils.splitByLines(oldValue).length);
      return value;
    },
    getGrammar: function() {
      return this.editor.getGrammar().scopeName.toLowerCase();
    },
    getSyntax: function() {
      var m, ref1, scope, sourceSyntax, syntax;
      scope = this.getCurrentScope().join(' ');
      if (~scope.indexOf('xsl')) {
        return 'xsl';
      }
      if (!/\bstring\b/.test(scope) && /\bsource\.(js|ts)x?\b/.test(scope)) {
        return 'jsx';
      }
      sourceSyntax = (ref1 = scope.match(/\bsource\.([\w\-]+)/)) != null ? ref1[0] : void 0;
      if (!/\bstring\b/.test(scope) && sourceSyntax && resources.hasSyntax(sourceSyntax)) {
        syntax = sourceSyntax;
      } else {
        m = scope.match(/\b(source|text)\.[\w\-\.]+/);
        syntax = m != null ? m[0].split('.').reduceRight(function(result, token) {
          return result || (resources.hasSyntax(token) ? token : void 0);
        }, null) : void 0;
      }
      return actionUtils.detectSyntax(this, syntax || 'html');
    },
    getCurrentScope: function() {
      var range;
      range = this._selection.bufferRanges[this._selection.index];
      return this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
    },
    getProfileName: function() {
      if (this.getCurrentScope().some(function(scope) {
        return /\bstring\.quoted\b/.test(scope);
      })) {
        return 'line';
      } else {
        return actionUtils.detectProfile(this);
      }
    },
    getFilePath: function() {
      return this.editor.buffer.file.path;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9lbW1ldC9saWIvZWRpdG9yLXByb3h5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxpQkFBRCxFQUFROztFQUNSLElBQUEsR0FBaUIsT0FBQSxDQUFRLE1BQVI7O0VBRWpCLEtBQUEsR0FBYyxPQUFBLENBQVEsT0FBUjs7RUFDZCxLQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSOztFQUNkLFFBQUEsR0FBYyxPQUFBLENBQVEsMkJBQVI7O0VBQ2QsU0FBQSxHQUFjLE9BQUEsQ0FBUSw0QkFBUjs7RUFDZCxXQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSOztFQUNkLFdBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVI7O0VBRWQsYUFBQSxHQUFnQixTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2QsUUFBQTs7O1lBQXNELENBQUUsTUFBeEQsQ0FBK0QsT0FBL0QsRUFBd0UsTUFBeEU7OztXQUdBLE1BQU0sQ0FBQyxnQkFBUCx3R0FBZ0YsQ0FBRSxhQUF4RCxDQUFzRSxNQUF0RSxDQUE4RSxDQUFBLENBQUE7RUFKMUY7O0VBTWhCLFNBQUEsR0FBWSxTQUFDLEdBQUQ7V0FDVixHQUNFLENBQUMsT0FESCxDQUNXLEtBRFgsRUFDa0IsS0FEbEIsQ0FFRSxDQUFDLE9BRkgsQ0FFVyxLQUZYLEVBRWtCLEtBRmxCLENBR0UsQ0FBQyxPQUhILENBR1csS0FIWCxFQUdrQixLQUhsQjtFQURVOztFQVdaLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxNQUFQO1dBQ1YsV0FBVyxDQUFDLFNBQVosQ0FBc0IsSUFBdEIsRUFDRTtNQUFBLFdBQUEsRUFBYSxNQUFNLENBQUMsVUFBUCxDQUFBLENBQWI7TUFDQSxPQUFBLEVBQVMsSUFEVDtLQURGO0VBRFU7O0VBUVosaUJBQUEsR0FBb0Is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QUNKLE1BQUEsZUFBUyxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBZ0IsQ0FBQyxXQUFqQixDQUE2QixTQUFDLE1BQUQsRUFBUyxLQUFUO2lCQUNsQyxNQUFBLElBQVUsQ0FBVSxTQUFTLENBQUMsU0FBVixDQUFvQixLQUFwQixDQUFULEdBQUEsS0FBQSxHQUFBLE1BQUQ7UUFEd0IsQ0FBN0IsRUFFTCxJQUZLLFdBTFg7O2FBU0EsV0FBVyxDQUFDLFlBQVosQ0FBeUIsSUFBekIsRUFBNEIsTUFBQSxJQUFVLE1BQXRDO0lBaEJTLENBakpYO0lBbUtBLGVBQUEsRUFBaUIsU0FBQTtBQUNmLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFhLENBQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaO2FBQ2pDLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0NBQVIsQ0FBeUMsS0FBSyxDQUFDLEtBQS9DLENBQXFELENBQUMsY0FBdEQsQ0FBQTtJQUZlLENBbktqQjtJQTBLQSxjQUFBLEVBQWdCLFNBQUE7TUFDUCxJQUFHLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixTQUFDLEtBQUQ7ZUFBVyxvQkFBb0IsQ0FBQyxJQUFyQixDQUEwQixLQUExQjtNQUFYLENBQXhCLENBQUg7ZUFBNEUsT0FBNUU7T0FBQSxNQUFBO2VBQXdGLFdBQVcsQ0FBQyxhQUFaLENBQTBCLElBQTFCLEVBQXhGOztJQURPLENBMUtoQjtJQThLQSxXQUFBLEVBQWEsU0FBQTthQUVYLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUZULENBOUtiOztBQTdERiIsInNvdXJjZXNDb250ZW50IjpbIntQb2ludCwgUmFuZ2V9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggICAgICAgICAgID0gcmVxdWlyZSAncGF0aCdcblxuZW1tZXQgICAgICAgPSByZXF1aXJlICdlbW1ldCdcbnV0aWxzICAgICAgID0gcmVxdWlyZSAnZW1tZXQvbGliL3V0aWxzL2NvbW1vbidcbnRhYlN0b3BzICAgID0gcmVxdWlyZSAnZW1tZXQvbGliL2Fzc2V0cy90YWJTdG9wcydcbnJlc291cmNlcyAgID0gcmVxdWlyZSAnZW1tZXQvbGliL2Fzc2V0cy9yZXNvdXJjZXMnXG5lZGl0b3JVdGlscyA9IHJlcXVpcmUgJ2VtbWV0L2xpYi91dGlscy9lZGl0b3InXG5hY3Rpb25VdGlscyA9IHJlcXVpcmUgJ2VtbWV0L2xpYi91dGlscy9hY3Rpb24nXG5cbmluc2VydFNuaXBwZXQgPSAoc25pcHBldCwgZWRpdG9yKSAtPlxuICBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ3NuaXBwZXRzJyk/Lm1haW5Nb2R1bGU/Lmluc2VydChzbmlwcGV0LCBlZGl0b3IpXG5cbiAgIyBGZXRjaCBleHBhbnNpb25zIGFuZCBhc3NpZ24gdG8gZWRpdG9yXG4gIGVkaXRvci5zbmlwcGV0RXhwYW5zaW9uID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdzbmlwcGV0cycpPy5tYWluTW9kdWxlPy5nZXRFeHBhbnNpb25zKGVkaXRvcilbMF1cblxudmlzdWFsaXplID0gKHN0cikgLT5cbiAgc3RyXG4gICAgLnJlcGxhY2UoL1xcdC9nLCAnXFxcXHQnKVxuICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcbiAgICAucmVwbGFjZSgvXFxzL2csICdcXFxccycpXG5cbiMgTm9ybWFsaXplcyB0ZXh0IGJlZm9yZSBpdCBnb2VzIHRvIGVkaXRvcjogcmVwbGFjZXMgaW5kZW50YXRpb25cbiMgYW5kIG5ld2xpbmVzIHdpdGggb25lcyB1c2VkIGluIGVkaXRvclxuIyBAcGFyYW0gIHtTdHJpbmd9IHRleHQgICBUZXh0IHRvIG5vcm1hbGl6ZVxuIyBAcGFyYW0gIHtFZGl0b3J9IGVkaXRvciBCcmFja2V0cyBlZGl0b3IgaW5zdGFuY2VcbiMgQHJldHVybiB7U3RyaW5nfVxubm9ybWFsaXplID0gKHRleHQsIGVkaXRvcikgLT5cbiAgZWRpdG9yVXRpbHMubm9ybWFsaXplIHRleHQsXG4gICAgaW5kZW50YXRpb246IGVkaXRvci5nZXRUYWJUZXh0KCksXG4gICAgbmV3bGluZTogJ1xcbidcblxuIyBQcm9wcm9jZXNzIHRleHQgZGF0YSB0aGF0IHNob3VsZCBiZSB1c2VkIGFzIHNuaXBwZXQgY29udGVudFxuIyBDdXJyZW50bHksIEF0b23igJlzIHNuaXBwZXRzIGltcGxlbWVudGF0aW9uIGhhcyB0aGUgZm9sbG93aW5nIGlzc3VlczpcbiMgKiBtdWx0aXBsZSAkMCBhcmUgbm90IHRyZWF0ZWQgYXMgZGlzdGluY3QgZmluYWwgdGFic3RvcHNcbnByZXByb2Nlc3NTbmlwcGV0ID0gKHZhbHVlKSAtPlxuICBvcmRlciA9IFtdXG5cbiAgdGFic3RvcE9wdGlvbnMgPVxuICAgIHRhYnN0b3A6IChkYXRhKSAtPlxuICAgICAgZ3JvdXAgPSBwYXJzZUludChkYXRhLmdyb3VwLCAxMClcbiAgICAgIGlmIGdyb3VwIGlzIDBcbiAgICAgICAgb3JkZXIucHVzaCgtMSlcbiAgICAgICAgZ3JvdXAgPSBvcmRlci5sZW5ndGhcbiAgICAgIGVsc2VcbiAgICAgICAgb3JkZXIucHVzaChncm91cCkgaWYgb3JkZXIuaW5kZXhPZihncm91cCkgaXMgLTFcbiAgICAgICAgZ3JvdXAgPSBvcmRlci5pbmRleE9mKGdyb3VwKSArIDFcblxuICAgICAgcGxhY2Vob2xkZXIgPSBkYXRhLnBsYWNlaG9sZGVyIG9yICcnXG4gICAgICBpZiBwbGFjZWhvbGRlclxuICAgICAgICAjIHJlY3Vyc2l2ZWx5IHVwZGF0ZSBuZXN0ZWQgdGFic3RvcHNcbiAgICAgICAgcGxhY2Vob2xkZXIgPSB0YWJTdG9wcy5wcm9jZXNzVGV4dChwbGFjZWhvbGRlciwgdGFic3RvcE9wdGlvbnMpXG5cbiAgICAgIGlmIHBsYWNlaG9sZGVyIHRoZW4gXCIkeyN7Z3JvdXB9OiN7cGxhY2Vob2xkZXJ9fVwiIGVsc2UgXCIkeyN7Z3JvdXB9fVwiXG5cbiAgICBlc2NhcGU6IChjaCkgLT5cbiAgICAgIGlmIGNoID09ICckJyB0aGVuICdcXFxcJCcgZWxzZSBjaFxuXG4gIHRhYlN0b3BzLnByb2Nlc3NUZXh0KHZhbHVlLCB0YWJzdG9wT3B0aW9ucylcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzZXR1cDogKEBlZGl0b3IsIEBzZWxlY3Rpb25JbmRleD0wKSAtPlxuICAgIGJ1ZiA9IEBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBidWZSYW5nZXMgPSBAZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKClcbiAgICBAX3NlbGVjdGlvbiA9XG4gICAgICBpbmRleDogMFxuICAgICAgc2F2ZWQ6IG5ldyBBcnJheShidWZSYW5nZXMubGVuZ3RoKVxuICAgICAgYnVmZmVyUmFuZ2VzOiBidWZSYW5nZXNcbiAgICAgIGluZGV4UmFuZ2VzOiBidWZSYW5nZXMubWFwIChyYW5nZSkgLT5cbiAgICAgICAgICBzdGFydDogYnVmLmNoYXJhY3RlckluZGV4Rm9yUG9zaXRpb24ocmFuZ2Uuc3RhcnQpXG4gICAgICAgICAgZW5kOiAgIGJ1Zi5jaGFyYWN0ZXJJbmRleEZvclBvc2l0aW9uKHJhbmdlLmVuZClcblxuICAjIEV4ZWN1dGVzIGdpdmVuIGZ1bmN0aW9uIGZvciBldmVyeSBzZWxlY3Rpb25cbiAgZXhlYzogKGZuKSAtPlxuICAgIGl4ID0gQF9zZWxlY3Rpb24uYnVmZmVyUmFuZ2VzLmxlbmd0aCAtIDFcbiAgICBAX3NlbGVjdGlvbi5zYXZlZCA9IFtdXG4gICAgc3VjY2VzcyA9IHRydWVcbiAgICB3aGlsZSBpeCA+PSAwXG4gICAgICBAX3NlbGVjdGlvbi5pbmRleCA9IGl4XG4gICAgICBpZiBmbihAX3NlbGVjdGlvbi5pbmRleCkgaXMgZmFsc2VcbiAgICAgICAgc3VjY2VzcyA9IGZhbHNlXG4gICAgICAgIGJyZWFrXG4gICAgICBpeC0tXG5cbiAgICBpZiBzdWNjZXNzIGFuZCBAX3NlbGVjdGlvbi5zYXZlZC5sZW5ndGggPiAxXG4gICAgICBAX3NldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKEBfc2VsZWN0aW9uLnNhdmVkKVxuXG4gIF9zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlczogKHNlbHMpIC0+XG4gICAgZmlsdGVyZWRTZWxzID0gc2Vscy5maWx0ZXIgKHMpIC0+ICEhc1xuICAgIGlmIGZpbHRlcmVkU2Vscy5sZW5ndGhcbiAgICAgIEBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoZmlsdGVyZWRTZWxzKVxuXG4gIF9zYXZlU2VsZWN0aW9uOiAoZGVsdGEpIC0+XG4gICAgQF9zZWxlY3Rpb24uc2F2ZWRbQF9zZWxlY3Rpb24uaW5kZXhdID0gQGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKClcbiAgICBpZiBkZWx0YVxuICAgICAgaSA9IEBfc2VsZWN0aW9uLmluZGV4XG4gICAgICBkZWx0YSA9IFBvaW50LmZyb21PYmplY3QoW2RlbHRhLCAwXSlcbiAgICAgIHdoaWxlICsraSA8IEBfc2VsZWN0aW9uLnNhdmVkLmxlbmd0aFxuICAgICAgICByYW5nZSA9IEBfc2VsZWN0aW9uLnNhdmVkW2ldXG4gICAgICAgIGlmIHJhbmdlXG4gICAgICAgICAgQF9zZWxlY3Rpb24uc2F2ZWRbaV0gPSBuZXcgUmFuZ2UocmFuZ2Uuc3RhcnQudHJhbnNsYXRlKGRlbHRhKSwgcmFuZ2UuZW5kLnRyYW5zbGF0ZShkZWx0YSkpXG5cbiAgc2VsZWN0aW9uTGlzdDogLT5cbiAgICBAX3NlbGVjdGlvbi5pbmRleFJhbmdlc1xuXG4gICMgUmV0dXJucyB0aGUgY3VycmVudCBjYXJldCBwb3NpdGlvbi5cbiAgZ2V0Q2FyZXRQb3M6IC0+XG4gICAgQGdldFNlbGVjdGlvblJhbmdlKCkuc3RhcnRcblxuICAjIFNldHMgdGhlIGN1cnJlbnQgY2FyZXQgcG9zaXRpb24uXG4gIHNldENhcmV0UG9zOiAocG9zKSAtPlxuICAgIEBjcmVhdGVTZWxlY3Rpb24ocG9zKVxuXG4gICMgRmV0Y2hlcyB0aGUgY2hhcmFjdGVyIGluZGV4ZXMgb2YgdGhlIHNlbGVjdGVkIHRleHQuXG4gICMgUmV0dXJucyBhbiB7T2JqZWN0fSB3aXRoIGBzdGFydGAgYW5kIGBlbmRgIHByb3BlcnRpZXMuXG4gIGdldFNlbGVjdGlvblJhbmdlOiAtPlxuICAgIEBfc2VsZWN0aW9uLmluZGV4UmFuZ2VzW0Bfc2VsZWN0aW9uLmluZGV4XVxuXG4gIGdldFNlbGVjdGlvbkJ1ZmZlclJhbmdlOiAtPlxuICAgIEBfc2VsZWN0aW9uLmJ1ZmZlclJhbmdlc1tAX3NlbGVjdGlvbi5pbmRleF1cblxuICAjIENyZWF0ZXMgYSBzZWxlY3Rpb24gZnJvbSB0aGUgYHN0YXJ0YCB0byBgZW5kYCBjaGFyYWN0ZXIgaW5kZXhlcy5cbiAgI1xuICAjIElmIGBlbmRgIGlzIG9tbWl0ZWQsIHRoaXMgbWV0aG9kIHNob3VsZCBwbGFjZSBhIGNhcmV0IGF0IHRoZSBgc3RhcnRgIGluZGV4LlxuICAjXG4gICMgc3RhcnQgLSBBIHtOdW1iZXJ9IHJlcHJlc2VudGluZyB0aGUgc3RhcnRpbmcgY2hhcmFjdGVyIGluZGV4XG4gICMgZW5kIC0gQSB7TnVtYmVyfSByZXByZXNlbnRpbmcgdGhlIGVuZGluZyBjaGFyYWN0ZXIgaW5kZXhcbiAgY3JlYXRlU2VsZWN0aW9uOiAoc3RhcnQsIGVuZD1zdGFydCkgLT5cbiAgICBzZWxzID0gQF9zZWxlY3Rpb24uYnVmZmVyUmFuZ2VzXG4gICAgYnVmID0gQGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIHNlbHNbQF9zZWxlY3Rpb24uaW5kZXhdID0gbmV3IFJhbmdlKGJ1Zi5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHN0YXJ0KSwgYnVmLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoZW5kKSlcbiAgICBAX3NldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKHNlbHMpXG5cbiAgIyBSZXR1cm5zIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgdGV4dC5cbiAgZ2V0U2VsZWN0aW9uOiAtPlxuICAgIEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoQGdldFNlbGVjdGlvbkJ1ZmZlclJhbmdlKCkpXG5cbiAgIyBGZXRjaGVzIHRoZSBjdXJyZW50IGxpbmUncyBzdGFydCBhbmQgZW5kIGluZGV4ZXMuXG4gICNcbiAgIyBSZXR1cm5zIGFuIHtPYmplY3R9IHdpdGggYHN0YXJ0YCBhbmQgYGVuZGAgcHJvcGVydGllc1xuICBnZXRDdXJyZW50TGluZVJhbmdlOiAtPlxuICAgIHNlbCA9IEBnZXRTZWxlY3Rpb25CdWZmZXJSYW5nZSgpXG4gICAgcm93ID0gc2VsLmdldFJvd3MoKVswXVxuICAgIGxpbmVMZW5ndGggPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdykubGVuZ3RoXG4gICAgaW5kZXggPSBAZWRpdG9yLmdldEJ1ZmZlcigpLmNoYXJhY3RlckluZGV4Rm9yUG9zaXRpb24oe3Jvdzogcm93LCBjb2x1bW46IDB9KVxuICAgIHJldHVybiB7XG4gICAgICBzdGFydDogaW5kZXhcbiAgICAgIGVuZDogaW5kZXggKyBsaW5lTGVuZ3RoXG4gICAgfVxuXG4gICMgUmV0dXJucyB0aGUgY3VycmVudCBsaW5lLlxuICBnZXRDdXJyZW50TGluZTogLT5cbiAgICBzZWwgPSBAZ2V0U2VsZWN0aW9uQnVmZmVyUmFuZ2UoKVxuICAgIHJvdyA9IHNlbC5nZXRSb3dzKClbMF1cbiAgICByZXR1cm4gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpXG5cbiAgIyBSZXR1cm5zIHRoZSBlZGl0b3IgY29udGVudC5cbiAgZ2V0Q29udGVudDogLT5cbiAgICByZXR1cm4gQGVkaXRvci5nZXRUZXh0KClcblxuICAjIFJlcGxhY2UgdGhlIGVkaXRvcidzIGNvbnRlbnQgKG9yIHBhcnQgb2YgaXQsIGlmIHVzaW5nIGBzdGFydGAgdG9cbiAgIyBgZW5kYCBpbmRleCkuXG4gICNcbiAgIyBJZiBgdmFsdWVgIGNvbnRhaW5zIGBjYXJldF9wbGFjZWhvbGRlcmAsIHRoZSBlZGl0b3IgcHV0cyBhIGNhcmV0IGludG9cbiAgIyB0aGlzIHBvc2l0aW9uLiBJZiB5b3Ugc2tpcCB0aGUgYHN0YXJ0YCBhbmQgYGVuZGAgYXJndW1lbnRzLCB0aGUgd2hvbGUgdGFyZ2V0J3NcbiAgIyBjb250ZW50IGlzIHJlcGxhY2VkIHdpdGggYHZhbHVlYC5cbiAgI1xuICAjIElmIHlvdSBwYXNzIGp1c3QgdGhlIGBzdGFydGAgYXJndW1lbnQsIHRoZSBgdmFsdWVgIGlzIHBsYWNlZCBhdCB0aGUgYHN0YXJ0YCBzdHJpbmdcbiAgIyBpbmRleCBvZiB0aHIgY3VycmVudCBjb250ZW50LlxuICAjXG4gICMgSWYgeW91IHBhc3MgYm90aCBgc3RhcnRgIGFuZCBgZW5kYCBhcmd1bWVudHMsIHRoZSBjb3JyZXNwb25kaW5nIHN1YnN0cmluZyBvZlxuICAjIHRoZSBjdXJyZW50IHRhcmdldCdzIGNvbnRlbnQgaXMgcmVwbGFjZWQgd2l0aCBgdmFsdWVgLlxuICAjXG4gICMgdmFsdWUgLSBBIHtTdHJpbmd9IG9mIGNvbnRlbnQgeW91IHdhbnQgdG8gcGFzdGVcbiAgIyBzdGFydCAtIFRoZSBvcHRpb25hbCBzdGFydCBpbmRleCB7TnVtYmVyfSBvZiB0aGUgZWRpdG9yJ3MgY29udGVudFxuICAjIGVuZCAtIFRoZSBvcHRpb25hbCBlbmQgaW5kZXgge051bWJlcn0gb2YgdGhlIGVkaXRvcidzIGNvbnRlbnRcbiAgIyBub0lkZW50IC0gQW4gb3B0aW9uYWwge0Jvb2xlYW59IHdoaWNoLCBpZiBgdHJ1ZWAsIGRvZXMgbm90IGF0dGVtcHQgdG8gYXV0byBpbmRlbnQgYHZhbHVlYFxuICByZXBsYWNlQ29udGVudDogKHZhbHVlLCBzdGFydCwgZW5kLCBub0luZGVudCkgLT5cbiAgICB1bmxlc3MgZW5kP1xuICAgICAgZW5kID0gdW5sZXNzIHN0YXJ0PyB0aGVuIEBnZXRDb250ZW50KCkubGVuZ3RoIGVsc2Ugc3RhcnRcbiAgICBzdGFydCA9IDAgdW5sZXNzIHN0YXJ0P1xuXG4gICAgdmFsdWUgPSBub3JtYWxpemUodmFsdWUsIEBlZGl0b3IpXG4gICAgYnVmID0gQGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGNoYW5nZVJhbmdlID0gbmV3IFJhbmdlKFxuICAgICAgUG9pbnQuZnJvbU9iamVjdChidWYucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChzdGFydCkpLFxuICAgICAgUG9pbnQuZnJvbU9iamVjdChidWYucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChlbmQpKVxuICAgIClcblxuICAgIG9sZFZhbHVlID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShjaGFuZ2VSYW5nZSlcbiAgICBidWYuc2V0VGV4dEluUmFuZ2UoY2hhbmdlUmFuZ2UsICcnKVxuICAgICMgQmVmb3JlIGluc2VydGluZyBzbmlwcGV0IHdlIGhhdmUgdG8gcmVzZXQgYWxsIGF2YWlsYWJsZSBzZWxlY3Rpb25zXG4gICAgIyB0byBpbnNlcnQgc25pcHBlbnQgcmlnaHQgaW4gcmVxdWlyZWQgcGxhY2UuIE90aGVyd2lzZSBzbmlwcGV0XG4gICAgIyB3aWxsIGJlIGluc2VydGVkIGZvciBlYWNoIHNlbGVjdGlvbiBpbiBlZGl0b3JcblxuICAgICMgUmlnaHQgYWZ0ZXIgdGhhdCB3ZSBzaG91bGQgc2F2ZSBmaXJzdCBhdmFpbGFibGUgc2VsZWN0aW9uIGFzIGJ1ZmZlciByYW5nZVxuICAgIGNhcmV0ID0gYnVmLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoc3RhcnQpXG4gICAgQGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKG5ldyBSYW5nZShjYXJldCwgY2FyZXQpKVxuICAgIGluc2VydFNuaXBwZXQgcHJlcHJvY2Vzc1NuaXBwZXQodmFsdWUpLCBAZWRpdG9yXG4gICAgQF9zYXZlU2VsZWN0aW9uKHV0aWxzLnNwbGl0QnlMaW5lcyh2YWx1ZSkubGVuZ3RoIC0gdXRpbHMuc3BsaXRCeUxpbmVzKG9sZFZhbHVlKS5sZW5ndGgpXG4gICAgdmFsdWVcblxuICBnZXRHcmFtbWFyOiAtPlxuICAgIEBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgIyBSZXR1cm5zIHRoZSBlZGl0b3IncyBzeW50YXggbW9kZS5cbiAgZ2V0U3ludGF4OiAtPlxuICAgIHNjb3BlID0gQGdldEN1cnJlbnRTY29wZSgpLmpvaW4oJyAnKVxuICAgIHJldHVybiAneHNsJyBpZiB+c2NvcGUuaW5kZXhPZigneHNsJylcbiAgICByZXR1cm4gJ2pzeCcgaWYgbm90IC9cXGJzdHJpbmdcXGIvLnRlc3Qoc2NvcGUpICYmIC9cXGJzb3VyY2VcXC4oanN8dHMpeD9cXGIvLnRlc3Qoc2NvcGUpXG5cbiAgICBzb3VyY2VTeW50YXggPSBzY29wZS5tYXRjaCgvXFxic291cmNlXFwuKFtcXHdcXC1dKykvKT9bMF1cblxuICAgIGlmIG5vdCAvXFxic3RyaW5nXFxiLy50ZXN0KHNjb3BlKSAmJiBzb3VyY2VTeW50YXggJiYgcmVzb3VyY2VzLmhhc1N5bnRheChzb3VyY2VTeW50YXgpXG4gICAgICBzeW50YXggPSBzb3VyY2VTeW50YXg7XG4gICAgZWxzZVxuICAgICAgIyBwcm9iZSBzeW50YXggYmFzZWQgb24gY3VycmVudCBzZWxlY3RvclxuICAgICAgbSA9IHNjb3BlLm1hdGNoKC9cXGIoc291cmNlfHRleHQpXFwuW1xcd1xcLVxcLl0rLylcbiAgICAgIHN5bnRheCA9IG0/WzBdLnNwbGl0KCcuJykucmVkdWNlUmlnaHQgKHJlc3VsdCwgdG9rZW4pIC0+XG4gICAgICAgICAgcmVzdWx0IG9yICh0b2tlbiBpZiByZXNvdXJjZXMuaGFzU3ludGF4IHRva2VuKVxuICAgICAgICAsIG51bGxcblxuICAgIGFjdGlvblV0aWxzLmRldGVjdFN5bnRheChALCBzeW50YXggb3IgJ2h0bWwnKVxuXG4gIGdldEN1cnJlbnRTY29wZTogLT5cbiAgICByYW5nZSA9IEBfc2VsZWN0aW9uLmJ1ZmZlclJhbmdlc1tAX3NlbGVjdGlvbi5pbmRleF1cbiAgICBAZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKHJhbmdlLnN0YXJ0KS5nZXRTY29wZXNBcnJheSgpXG5cbiAgIyBSZXR1cm5zIHRoZSBjdXJyZW50IG91dHB1dCBwcm9maWxlIG5hbWVcbiAgI1xuICAjIFNlZSBlbW1ldC5zZXR1cFByb2ZpbGUgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIGdldFByb2ZpbGVOYW1lOiAtPlxuICAgIHJldHVybiBpZiBAZ2V0Q3VycmVudFNjb3BlKCkuc29tZSgoc2NvcGUpIC0+IC9cXGJzdHJpbmdcXC5xdW90ZWRcXGIvLnRlc3Qgc2NvcGUpIHRoZW4gJ2xpbmUnIGVsc2UgYWN0aW9uVXRpbHMuZGV0ZWN0UHJvZmlsZShAKVxuXG4gICMgUmV0dXJucyB0aGUgY3VycmVudCBlZGl0b3IncyBmaWxlIHBhdGhcbiAgZ2V0RmlsZVBhdGg6IC0+XG4gICAgIyBpcyB0aGVyZSBhIGJldHRlciB3YXkgdG8gZ2V0IHRoaXM/XG4gICAgQGVkaXRvci5idWZmZXIuZmlsZS5wYXRoXG4iXX0=
