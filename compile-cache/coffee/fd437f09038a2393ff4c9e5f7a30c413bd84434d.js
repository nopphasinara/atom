(function() {
  var AutoIndent, CompositeDisposable, INTERFILESAVETIME, LB, autoCompeteEmmetCSS, autoCompleteJSX, autoCompleteStyledComponents, observeStatusBarGrammarNameTimer, observeStatusBarGrammarNameTimerCalled, ttlGrammar;

  CompositeDisposable = require('atom').CompositeDisposable;

  autoCompleteJSX = require('./auto-complete-jsx');

  autoCompleteStyledComponents = require('./auto-complete-styled-components');

  autoCompeteEmmetCSS = require('./auto-complete-emmet-css');

  AutoIndent = require('./auto-indent');

  ttlGrammar = require('./create-ttl-grammar');

  INTERFILESAVETIME = 1000;

  LB = 'language-babel';

  observeStatusBarGrammarNameTimer = null;

  observeStatusBarGrammarNameTimerCalled = 0;

  module.exports = {
    activate: function(state) {
      observeStatusBarGrammarNameTimer = setInterval(this.observeStatusBarGrammarName.bind(this), 1000);
      autoCompleteStyledComponents.loadProperties();
      if (this.transpiler == null) {
        this.transpiler = new (require('./transpiler'));
      }
      this.ttlGrammar = new ttlGrammar(true);
      this.disposable = new CompositeDisposable;
      this.textEditors = {};
      this.fileSaveTimes = {};
      this.disposable.add(atom.packages.onDidActivatePackage(this.isPackageCompatible));
      this.disposable.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.transpiler.stopUnusedTasks();
        };
      })(this)));
      return this.disposable.add(atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          _this.textEditors[textEditor.id] = new CompositeDisposable;
          _this.textEditors[textEditor.id].add(textEditor.observeGrammar(function(grammar) {
            var ref, ref1, ref2, ref3;
            if (textEditor.getGrammar().packageName === LB) {
              return (ref = _this.textEditors[textEditor.id]) != null ? ref.autoIndent = new AutoIndent(textEditor) : void 0;
            } else {
              if ((ref1 = _this.textEditors[textEditor.id]) != null) {
                if ((ref2 = ref1.autoIndent) != null) {
                  ref2.destroy();
                }
              }
              return delete (((ref3 = _this.textEditors[textEditor.id]) != null ? ref3.autoIndent : void 0) != null);
            }
          }));
          _this.textEditors[textEditor.id].add(textEditor.onDidSave(function(event) {
            var filePath, lastSaveTime, ref;
            if (textEditor.getGrammar().packageName === LB) {
              filePath = textEditor.getPath();
              lastSaveTime = (ref = _this.fileSaveTimes[filePath]) != null ? ref : 0;
              _this.fileSaveTimes[filePath] = Date.now();
              if (lastSaveTime < (_this.fileSaveTimes[filePath] - INTERFILESAVETIME)) {
                return _this.transpiler.transpile(filePath, textEditor);
              }
            }
          }));
          return _this.textEditors[textEditor.id].add(textEditor.onDidDestroy(function() {
            var filePath, ref, ref1, ref2;
            if ((ref = _this.textEditors[textEditor.id]) != null) {
              if ((ref1 = ref.autoIndent) != null) {
                ref1.destroy();
              }
            }
            delete (((ref2 = _this.textEditors[textEditor.id]) != null ? ref2.autoIndent : void 0) != null);
            filePath = textEditor.getPath();
            if (_this.fileSaveTimes[filePath] != null) {
              delete _this.fileSaveTimes[filePath];
            }
            _this.textEditors[textEditor.id].dispose();
            return delete _this.textEditors[textEditor.id];
          }));
        };
      })(this)));
    },
    deactivate: function() {
      var disposeable, id, ref, ref1;
      this.disposable.dispose();
      ref = this.textEditors;
      for (id in ref) {
        disposeable = ref[id];
        if (this.textEditors[id].autoIndent != null) {
          this.textEditors[id].autoIndent.destroy();
          delete this.textEditors[id].autoIndent;
        }
        disposeable.dispose();
      }
      this.transpiler.stopAllTranspilerTask();
      this.transpiler.disposables.dispose();
      this.ttlGrammar.destroy();
      return (ref1 = this.mutateStatusGrammarNameObserver) != null ? ref1.disconnet() : void 0;
    },
    isPackageCompatible: function(activatedPackage) {
      var incompatiblePackage, incompatiblePackages, reason, results;
      incompatiblePackages = {
        'source-preview-babel': "Both vie to preview the same file.",
        'source-preview-react': "Both vie to preview the same file.",
        'react': "The Atom community package 'react' (not to be confused \nwith Facebook React) monkey patches the atom methods \nthat provide autoindent features for JSX. \nAs it detects JSX scopes without regard to the grammar being used, \nit tries to auto indent JSX that is highlighted by language-babel. \nAs language-babel also attempts to do auto indentation using \nstandard atom API's, this creates a potential conflict."
      };
      results = [];
      for (incompatiblePackage in incompatiblePackages) {
        reason = incompatiblePackages[incompatiblePackage];
        if (activatedPackage.name === incompatiblePackage) {
          results.push(atom.notifications.addInfo('Incompatible Package Detected', {
            dismissable: true,
            detail: "language-babel has detected the presence of an incompatible Atom package named '" + activatedPackage.name + "'. \n \nIt is recommended that you disable either '" + activatedPackage.name + "' or language-babel \n \nReason:\n \n" + reason
          }));
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    autoCompleteProvider: function() {
      return [autoCompleteJSX, autoCompleteStyledComponents, autoCompeteEmmetCSS];
    },
    provide: function() {
      return this.transpiler;
    },
    observeStatusBarGrammarName: function() {
      var config, mutateStatusGrammarNameObserver, ref, target;
      target = document.getElementsByTagName('grammar-selector-status');
      if (++observeStatusBarGrammarNameTimerCalled > 60) {
        clearInterval(observeStatusBarGrammarNameTimer);
        observeStatusBarGrammarNameTimerCalled = 0;
      }
      if (target.length === 1) {
        target = (ref = target[0].childNodes) != null ? ref[0] : void 0;
        if (target) {
          clearInterval(observeStatusBarGrammarNameTimer);
          this.mutateStatusBarGrammarName(target);
          mutateStatusGrammarNameObserver = new MutationObserver((function(_this) {
            return function(mutations) {
              return mutations.forEach(function(mutation) {
                return _this.mutateStatusBarGrammarName(mutation.target);
              });
            };
          })(this));
          config = {
            attributes: true,
            childList: false,
            characterData: false
          };
          return mutateStatusGrammarNameObserver.observe(target, config);
        }
      }
    },
    mutateStatusBarGrammarName: function(elem) {
      if ((elem != null ? elem.innerHTML : void 0) === 'Babel ES6 JavaScript') {
        return elem.innerHTML = 'Babel';
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUjs7RUFDbEIsNEJBQUEsR0FBK0IsT0FBQSxDQUFRLG1DQUFSOztFQUMvQixtQkFBQSxHQUFzQixPQUFBLENBQVEsMkJBQVI7O0VBQ3RCLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFDYixVQUFBLEdBQWEsT0FBQSxDQUFRLHNCQUFSOztFQUViLGlCQUFBLEdBQW9COztFQUNwQixFQUFBLEdBQUs7O0VBQ0wsZ0NBQUEsR0FBbUM7O0VBQ25DLHNDQUFBLEdBQXlDOztFQUV6QyxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLGdDQUFBLEdBQW1DLFdBQUEsQ0FBWSxJQUFDLENBQUEsMkJBQTJCLENBQUMsSUFBN0IsQ0FBa0MsSUFBbEMsQ0FBWixFQUFrRCxJQUFsRDtNQUNuQyw0QkFBNEIsQ0FBQyxjQUE3QixDQUFBOztRQUNBLElBQUMsQ0FBQSxhQUFjLElBQUksQ0FBQyxPQUFBLENBQVEsY0FBUixDQUFEOztNQUNuQixJQUFDLENBQUEsVUFBRCxHQUFjLElBQUksVUFBSixDQUFlLElBQWY7TUFFZCxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUk7TUFDbEIsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxhQUFELEdBQWlCO01BRWpCLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFkLENBQW1DLElBQUMsQ0FBQSxtQkFBcEMsQ0FBaEI7TUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FB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S0FBQTttQkFBQSxTQUFDLFNBQUQ7cUJBQ3JELFNBQVMsQ0FBQyxPQUFWLENBQW1CLFNBQUMsUUFBRDt1QkFDZixLQUFDLENBQUEsMEJBQUQsQ0FBNEIsUUFBUSxDQUFDLE1BQXJDO2NBRGUsQ0FBbkI7WUFEcUQ7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCO1VBS2xDLE1BQUEsR0FBUztZQUFFLFVBQUEsRUFBWSxJQUFkO1lBQW9CLFNBQUEsRUFBVyxLQUEvQjtZQUFzQyxhQUFBLEVBQWUsS0FBckQ7O2lCQUdULCtCQUErQixDQUFDLE9BQWhDLENBQXdDLE1BQXhDLEVBQWdELE1BQWhELEVBZkY7U0FIRjs7SUFWMkIsQ0E3RjdCO0lBNkhBLDBCQUFBLEVBQTRCLFNBQUMsSUFBRDtNQUMxQixvQkFBRyxJQUFJLENBQUUsbUJBQU4sS0FBbUIsc0JBQXRCO2VBQ0UsSUFBSSxDQUFDLFNBQUwsR0FBaUIsUUFEbkI7O0lBRDBCLENBN0g1Qjs7QUFiRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5hdXRvQ29tcGxldGVKU1ggPSByZXF1aXJlICcuL2F1dG8tY29tcGxldGUtanN4J1xuYXV0b0NvbXBsZXRlU3R5bGVkQ29tcG9uZW50cyA9IHJlcXVpcmUgJy4vYXV0by1jb21wbGV0ZS1zdHlsZWQtY29tcG9uZW50cydcbmF1dG9Db21wZXRlRW1tZXRDU1MgPSByZXF1aXJlICcuL2F1dG8tY29tcGxldGUtZW1tZXQtY3NzJ1xuQXV0b0luZGVudCA9IHJlcXVpcmUgJy4vYXV0by1pbmRlbnQnXG50dGxHcmFtbWFyID0gcmVxdWlyZSAnLi9jcmVhdGUtdHRsLWdyYW1tYXInXG5cbklOVEVSRklMRVNBVkVUSU1FID0gMTAwMFxuTEIgPSAnbGFuZ3VhZ2UtYmFiZWwnXG5vYnNlcnZlU3RhdHVzQmFyR3JhbW1hck5hbWVUaW1lciA9IG51bGxcbm9ic2VydmVTdGF0dXNCYXJHcmFtbWFyTmFtZVRpbWVyQ2FsbGVkID0gMFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgIyBydW4gb2JzZXJ2ZVN0YXR1c0JhckdyYW1tYXJOYW1lIHVudGlsIEF0b20gaGFzIGNyZWF0ZWQgdGhlIFN0YXR1cyBCYXIgR3JhbW1hciBOYW1lIERPTSBub2RlXG4gICAgb2JzZXJ2ZVN0YXR1c0JhckdyYW1tYXJOYW1lVGltZXIgPSBzZXRJbnRlcnZhbChAb2JzZXJ2ZVN0YXR1c0JhckdyYW1tYXJOYW1lLmJpbmQoQCksIDEwMDApXG4gICAgYXV0b0NvbXBsZXRlU3R5bGVkQ29tcG9uZW50cy5sb2FkUHJvcGVydGllcygpXG4gICAgQHRyYW5zcGlsZXIgPz0gbmV3IChyZXF1aXJlICcuL3RyYW5zcGlsZXInKVxuICAgIEB0dGxHcmFtbWFyID0gbmV3IHR0bEdyYW1tYXIodHJ1ZSlcbiAgICAjIHRyYWNrIGFueSBmaWxlIHNhdmUgZXZlbnRzIGFuZCB0cmFuc3BpbGUgaWYgYmFiZWxcbiAgICBAZGlzcG9zYWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHRleHRFZGl0b3JzID0ge31cbiAgICBAZmlsZVNhdmVUaW1lcyA9IHt9XG5cbiAgICBAZGlzcG9zYWJsZS5hZGQgYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZSBAaXNQYWNrYWdlQ29tcGF0aWJsZVxuXG4gICAgQGRpc3Bvc2FibGUuYWRkIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzID0+XG4gICAgICBAdHJhbnNwaWxlci5zdG9wVW51c2VkVGFza3MoKVxuXG4gICAgQGRpc3Bvc2FibGUuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAodGV4dEVkaXRvcikgPT5cbiAgICAgIEB0ZXh0RWRpdG9yc1t0ZXh0RWRpdG9yLmlkXSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAgIEB0ZXh0RWRpdG9yc1t0ZXh0RWRpdG9yLmlkXS5hZGQgdGV4dEVkaXRvci5vYnNlcnZlR3JhbW1hciAoZ3JhbW1hcikgPT5cbiAgICAgICAgIyBJbnN0YW50aWF0ZSBpbmRlbnRvciBmb3IgbGFuZ3VhZ2UtYmFiZWwgZmlsZXNcbiAgICAgICAgaWYgdGV4dEVkaXRvci5nZXRHcmFtbWFyKCkucGFja2FnZU5hbWUgaXMgTEJcbiAgICAgICAgICBAdGV4dEVkaXRvcnNbdGV4dEVkaXRvci5pZF0/LmF1dG9JbmRlbnQgPSBuZXcgQXV0b0luZGVudCh0ZXh0RWRpdG9yKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHRleHRFZGl0b3JzW3RleHRFZGl0b3IuaWRdPy5hdXRvSW5kZW50Py5kZXN0cm95KClcbiAgICAgICAgICBkZWxldGUgQHRleHRFZGl0b3JzW3RleHRFZGl0b3IuaWRdPy5hdXRvSW5kZW50P1xuXG4gICAgICBAdGV4dEVkaXRvcnNbdGV4dEVkaXRvci5pZF0uYWRkIHRleHRFZGl0b3Iub25EaWRTYXZlIChldmVudCkgPT5cbiAgICAgICAgaWYgdGV4dEVkaXRvci5nZXRHcmFtbWFyKCkucGFja2FnZU5hbWUgaXMgTEJcbiAgICAgICAgICBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgbGFzdFNhdmVUaW1lID0gQGZpbGVTYXZlVGltZXNbZmlsZVBhdGhdID8gMFxuICAgICAgICAgIEBmaWxlU2F2ZVRpbWVzW2ZpbGVQYXRoXSA9IERhdGUubm93KClcbiAgICAgICAgICBpZiAgKGxhc3RTYXZlVGltZSA8IChAZmlsZVNhdmVUaW1lc1tmaWxlUGF0aF0gLSBJTlRFUkZJTEVTQVZFVElNRSkpXG4gICAgICAgICAgICBAdHJhbnNwaWxlci50cmFuc3BpbGUoZmlsZVBhdGgsIHRleHRFZGl0b3IpXG5cbiAgICAgIEB0ZXh0RWRpdG9yc1t0ZXh0RWRpdG9yLmlkXS5hZGQgdGV4dEVkaXRvci5vbkRpZERlc3Ryb3kgKCkgPT5cbiAgICAgICAgQHRleHRFZGl0b3JzW3RleHRFZGl0b3IuaWRdPy5hdXRvSW5kZW50Py5kZXN0cm95KClcbiAgICAgICAgZGVsZXRlIEB0ZXh0RWRpdG9yc1t0ZXh0RWRpdG9yLmlkXT8uYXV0b0luZGVudD9cbiAgICAgICAgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBpZiBAZmlsZVNhdmVUaW1lc1tmaWxlUGF0aF0/IHRoZW4gZGVsZXRlIEBmaWxlU2F2ZVRpbWVzW2ZpbGVQYXRoXVxuICAgICAgICBAdGV4dEVkaXRvcnNbdGV4dEVkaXRvci5pZF0uZGlzcG9zZSgpXG4gICAgICAgIGRlbGV0ZSBAdGV4dEVkaXRvcnNbdGV4dEVkaXRvci5pZF1cblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgIGZvciBpZCwgZGlzcG9zZWFibGUgb2YgQHRleHRFZGl0b3JzXG4gICAgICBpZiBAdGV4dEVkaXRvcnNbaWRdLmF1dG9JbmRlbnQ/XG4gICAgICAgIEB0ZXh0RWRpdG9yc1tpZF0uYXV0b0luZGVudC5kZXN0cm95KClcbiAgICAgICAgZGVsZXRlIEB0ZXh0RWRpdG9yc1tpZF0uYXV0b0luZGVudFxuICAgICAgZGlzcG9zZWFibGUuZGlzcG9zZSgpXG4gICAgQHRyYW5zcGlsZXIuc3RvcEFsbFRyYW5zcGlsZXJUYXNrKClcbiAgICBAdHJhbnNwaWxlci5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBAdHRsR3JhbW1hci5kZXN0cm95KClcbiAgICBAbXV0YXRlU3RhdHVzR3JhbW1hck5hbWVPYnNlcnZlcj8uZGlzY29ubmV0KClcblxuICAjIHdhcm5zIGlmIGFuIGFjdGl2YXRlZCBwYWNrYWdlIGlzIG9uIHRoZSBpbmNvbXBhdGlibGUgbGlzdFxuICBpc1BhY2thZ2VDb21wYXRpYmxlOiAoYWN0aXZhdGVkUGFja2FnZSkgLT5cbiAgICBpbmNvbXBhdGlibGVQYWNrYWdlcyA9IHtcbiAgICAgICdzb3VyY2UtcHJldmlldy1iYWJlbCc6XG4gICAgICAgIFwiQm90aCB2aWUgdG8gcHJldmlldyB0aGUgc2FtZSBmaWxlLlwiXG4gICAgICAnc291cmNlLXByZXZpZXctcmVhY3QnOlxuICAgICAgICBcIkJvdGggdmllIHRvIHByZXZpZXcgdGhlIHNhbWUgZmlsZS5cIlxuICAgICAgJ3JlYWN0JzpcbiAgICAgICAgXCJUaGUgQXRvbSBjb21tdW5pdHkgcGFja2FnZSAncmVhY3QnIChub3QgdG8gYmUgY29uZnVzZWRcbiAgICAgICAgXFxud2l0aCBGYWNlYm9vayBSZWFjdCkgbW9ua2V5IHBhdGNoZXMgdGhlIGF0b20gbWV0aG9kc1xuICAgICAgICBcXG50aGF0IHByb3ZpZGUgYXV0b2luZGVudCBmZWF0dXJlcyBmb3IgSlNYLlxuICAgICAgICBcXG5BcyBpdCBkZXRlY3RzIEpTWCBzY29wZXMgd2l0aG91dCByZWdhcmQgdG8gdGhlIGdyYW1tYXIgYmVpbmcgdXNlZCxcbiAgICAgICAgXFxuaXQgdHJpZXMgdG8gYXV0byBpbmRlbnQgSlNYIHRoYXQgaXMgaGlnaGxpZ2h0ZWQgYnkgbGFuZ3VhZ2UtYmFiZWwuXG4gICAgICAgIFxcbkFzIGxhbmd1YWdlLWJhYmVsIGFsc28gYXR0ZW1wdHMgdG8gZG8gYXV0byBpbmRlbnRhdGlvbiB1c2luZ1xuICAgICAgICBcXG5zdGFuZGFyZCBhdG9tIEFQSSdzLCB0aGlzIGNyZWF0ZXMgYSBwb3RlbnRpYWwgY29uZmxpY3QuXCJcbiAgICB9XG5cbiAgICBmb3IgaW5jb21wYXRpYmxlUGFja2FnZSwgcmVhc29uIG9mIGluY29tcGF0aWJsZVBhY2thZ2VzXG4gICAgICBpZiBhY3RpdmF0ZWRQYWNrYWdlLm5hbWUgaXMgaW5jb21wYXRpYmxlUGFja2FnZVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyAnSW5jb21wYXRpYmxlIFBhY2thZ2UgRGV0ZWN0ZWQnLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgZGV0YWlsOiBcImxhbmd1YWdlLWJhYmVsIGhhcyBkZXRlY3RlZCB0aGUgcHJlc2VuY2Ugb2YgYW5cbiAgICAgICAgICAgICAgICAgIGluY29tcGF0aWJsZSBBdG9tIHBhY2thZ2UgbmFtZWQgJyN7YWN0aXZhdGVkUGFja2FnZS5uYW1lfScuXG4gICAgICAgICAgICAgICAgICBcXG4gXFxuSXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3UgZGlzYWJsZSBlaXRoZXIgJyN7YWN0aXZhdGVkUGFja2FnZS5uYW1lfScgb3IgbGFuZ3VhZ2UtYmFiZWxcbiAgICAgICAgICAgICAgICAgIFxcbiBcXG5SZWFzb246XFxuIFxcbiN7cmVhc29ufVwiXG5cbiAgIyBhdXRvY29tcGxldGUtcGx1cyBwcm92aWRlcnNcbiAgYXV0b0NvbXBsZXRlUHJvdmlkZXI6IC0+XG4gICAgW2F1dG9Db21wbGV0ZUpTWCwgYXV0b0NvbXBsZXRlU3R5bGVkQ29tcG9uZW50cywgYXV0b0NvbXBldGVFbW1ldENTU11cblxuICAjIHByZXZpZXcgdHJhbnBpbGUgcHJvdmlkZXJcbiAgcHJvdmlkZTotPlxuICAgIEB0cmFuc3BpbGVyXG5cblxuICAjIEtsdWRnZSB0byBjaGFuZ2UgdGhlIGdyYW1tYXIgbmFtZSBpbiB0aGUgc3RhdHVzIGJhciBmcm9tIEJhYmVsIEVTNiBKYXZhU2NpcHQgdG8gQmFiZWxcbiAgIyBUaGUgZ3JhbW1hciBuYW1lIHN0aWxsIHJlbWFpbnMgdGhlIHNhbWUgZm9yIGNvbXBhdGliaWx0eSB3aXRoIG90aGVyIHBhY2thZ2VzIHN1Y2ggYXMgYXRvbS1iZWF1dGlmeVxuICAjIGJ1dCBpcyBtb3JlIG1lYW5pbmdmdWwgYW5kIHNob3J0ZXIgb24gdGhlIHN0YXR1cyBiYXIuXG4gIG9ic2VydmVTdGF0dXNCYXJHcmFtbWFyTmFtZTogLT5cbiAgICAjIHNlbGVjdCB0aGUgdGFyZ2V0IG5vZGVcbiAgICB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZ3JhbW1hci1zZWxlY3Rvci1zdGF0dXMnKTtcblxuICAgICMgb25seSBydW4gdGhpcyBmb3Igc28gbWFueSBjeWNsZXMgd2l0aG91dCBnZXR0aW5nIGEgdmFsaWQgZG9tIG5vZGVcbiAgICBpZiArK29ic2VydmVTdGF0dXNCYXJHcmFtbWFyTmFtZVRpbWVyQ2FsbGVkID4gNjBcbiAgICAgIGNsZWFySW50ZXJ2YWwob2JzZXJ2ZVN0YXR1c0JhckdyYW1tYXJOYW1lVGltZXIpXG4gICAgICBvYnNlcnZlU3RhdHVzQmFyR3JhbW1hck5hbWVUaW1lckNhbGxlZCA9IDBcblxuICAgICMgb25seSBleHBlY3QgYSBzaW5nbGUgY2hpbGQgKGdyYW1tYXIgbmFtZSkgZm9yIHRoaXMgRE9NIE5vZGVcbiAgICBpZiB0YXJnZXQubGVuZ3RoIGlzIDFcbiAgICAgIHRhcmdldCA9IHRhcmdldFswXS5jaGlsZE5vZGVzP1swXVxuXG4gICAgICBpZiB0YXJnZXRcbiAgICAgICAgIyBkb24ndCBydW4gYWdhaW4gYXMgd2UgYXJlIG5vdyBvYnNlcnZpbmdcbiAgICAgICAgY2xlYXJJbnRlcnZhbChvYnNlcnZlU3RhdHVzQmFyR3JhbW1hck5hbWVUaW1lcilcblxuICAgICAgICBAbXV0YXRlU3RhdHVzQmFyR3JhbW1hck5hbWUodGFyZ2V0KVxuXG4gICAgICAgICMgY3JlYXRlIGFuIG9ic2VydmVyIGluc3RhbmNlXG4gICAgICAgIG11dGF0ZVN0YXR1c0dyYW1tYXJOYW1lT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlciAobXV0YXRpb25zKSA9PlxuICAgICAgICAgIG11dGF0aW9ucy5mb3JFYWNoICAobXV0YXRpb24pID0+XG4gICAgICAgICAgICAgIEBtdXRhdGVTdGF0dXNCYXJHcmFtbWFyTmFtZShtdXRhdGlvbi50YXJnZXQpXG5cbiAgICAgICAgIyBjb25maWd1cmF0aW9uIG9mIHRoZSBvYnNlcnZlcjpcbiAgICAgICAgY29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IGZhbHNlLCBjaGFyYWN0ZXJEYXRhOiBmYWxzZSB9XG5cbiAgICAgICAgIyBwYXNzIGluIHRoZSB0YXJnZXQgbm9kZSwgYXMgd2VsbCBhcyB0aGUgb2JzZXJ2ZXIgb3B0aW9uc1xuICAgICAgICBtdXRhdGVTdGF0dXNHcmFtbWFyTmFtZU9ic2VydmVyLm9ic2VydmUodGFyZ2V0LCBjb25maWcpO1xuXG5cbiAgIyBjaGFuZ2UgbmFtZSBpbiBzdGF0dXMgYmFyXG4gIG11dGF0ZVN0YXR1c0JhckdyYW1tYXJOYW1lOiAoZWxlbSkgLT5cbiAgICBpZiBlbGVtPy5pbm5lckhUTUwgaXMgJ0JhYmVsIEVTNiBKYXZhU2NyaXB0J1xuICAgICAgZWxlbS5pbm5lckhUTUwgPSAnQmFiZWwnXG4iXX0=
