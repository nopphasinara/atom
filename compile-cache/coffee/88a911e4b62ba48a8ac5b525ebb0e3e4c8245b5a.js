(function() {
  var CompositeDisposable, InputView, Os, Path, TextEditorView, View, fs, git, isEmpty, prepFile, ref, showCommitFilePath, showFile, showObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), TextEditorView = ref.TextEditorView, View = ref.View;

  git = require('../git');

  showCommitFilePath = function(objectHash) {
    return Path.join(Os.tmpDir(), objectHash + ".diff");
  };

  isEmpty = function(string) {
    return string === '';
  };

  showObject = function(repo, objectHash, file) {
    var args, showFormatOption;
    objectHash = isEmpty(objectHash) ? 'HEAD' : objectHash;
    args = ['show', '--color=never'];
    showFormatOption = atom.config.get('git-plus.general.showFormat');
    if (showFormatOption !== 'none') {
      args.push("--format=" + showFormatOption);
    }
    if (atom.config.get('git-plus.diffs.wordDiff')) {
      args.push('--word-diff');
    }
    args.push(objectHash);
    if (file != null) {
      args.push('--', file);
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      if (data.length > 0) {
        return prepFile(data, objectHash);
      }
    });
  };

  prepFile = function(text, objectHash) {
    return fs.writeFile(showCommitFilePath(objectHash), text, {
      flag: 'w+'
    }, function(err) {
      if (err) {
        return notifier.addError(err);
      } else {
        return showFile(objectHash);
      }
    });
  };

  showFile = function(objectHash) {
    var disposables, editorForDiffs, filePath, splitDirection;
    filePath = showCommitFilePath(objectHash);
    disposables = new CompositeDisposable;
    editorForDiffs = atom.workspace.getPaneItems().filter(function(item) {
      var ref1;
      return typeof item.getURI === "function" ? (ref1 = item.getURI()) != null ? ref1.includes('.diff') : void 0 : void 0;
    })[0];
    if (editorForDiffs != null) {
      return editorForDiffs.setText(fs.readFileSync(filePath, {
        encoding: 'utf-8'
      }));
    } else {
      if (atom.config.get('git-plus.general.openInPane')) {
        splitDirection = atom.config.get('git-plus.general.splitPane');
        atom.workspace.getCenter().getActivePane()["split" + splitDirection]();
      }
      return atom.workspace.open(filePath, {
        pending: true,
        activatePane: true
      }).then(function(textBuffer) {
        if (textBuffer != null) {
          return disposables.add(textBuffer.onDidDestroy(function() {
            disposables.dispose();
            try {
              return fs.unlinkSync(filePath);
            } catch (error) {}
          }));
        }
      });
    }
  };

  InputView = (function(superClass) {
    extend(InputView, superClass);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('objectHash', new TextEditorView({
            mini: true,
            placeholderText: 'Commit hash to show. (Defaults to HEAD)'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo1) {
      this.repo = repo1;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.objectHash.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            var text;
            text = _this.objectHash.getModel().getText().split(' ')[0];
            showObject(_this.repo, text);
            return _this.destroy();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      var ref1, ref2;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return (ref2 = this.panel) != null ? ref2.destroy() : void 0;
    };

    return InputView;

  })(View);

  module.exports = function(repo, objectHash, file) {
    if (objectHash == null) {
      return new InputView(repo);
    } else {
      return showObject(repo, objectHash, file);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXNob3cuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx5SUFBQTtJQUFBOzs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFSixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLG1DQUFELEVBQWlCOztFQUVqQixHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBRU4sa0JBQUEsR0FBcUIsU0FBQyxVQUFEO1dBQ25CLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBRSxDQUFDLE1BQUgsQ0FBQSxDQUFWLEVBQTBCLFVBQUQsR0FBWSxPQUFyQztFQURtQjs7RUFHckIsT0FBQSxHQUFVLFNBQUMsTUFBRDtXQUFZLE1BQUEsS0FBVTtFQUF0Qjs7RUFFVixVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sVUFBUCxFQUFtQixJQUFuQjtBQUNYLFFBQUE7SUFBQSxVQUFBLEdBQWdCLE9BQUEsQ0FBUSxVQUFSLENBQUgsR0FBMkIsTUFBM0IsR0FBdUM7SUFDcEQsSUFBQSxHQUFPLENBQUMsTUFBRCxFQUFTLGVBQVQ7SUFDUCxnQkFBQSxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCO0lBQ25CLElBQTRDLGdCQUFBLEtBQW9CLE1BQWhFO01BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFBLEdBQVksZ0JBQXRCLEVBQUE7O0lBQ0EsSUFBMkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQixDQUEzQjtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUs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QUFjLElBQWQsRUFERjtLQUFBLE1BQUE7YUFHRSxVQUFBLENBQVcsSUFBWCxFQUFpQixVQUFqQixFQUE2QixJQUE3QixFQUhGOztFQURlO0FBckVqQiIsInNvdXJjZXNDb250ZW50IjpbIk9zID0gcmVxdWlyZSAnb3MnXG5QYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbntUZXh0RWRpdG9yVmlldywgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuXG5zaG93Q29tbWl0RmlsZVBhdGggPSAob2JqZWN0SGFzaCkgLT5cbiAgUGF0aC5qb2luIE9zLnRtcERpcigpLCBcIiN7b2JqZWN0SGFzaH0uZGlmZlwiXG5cbmlzRW1wdHkgPSAoc3RyaW5nKSAtPiBzdHJpbmcgaXMgJydcblxuc2hvd09iamVjdCA9IChyZXBvLCBvYmplY3RIYXNoLCBmaWxlKSAtPlxuICBvYmplY3RIYXNoID0gaWYgaXNFbXB0eSBvYmplY3RIYXNoIHRoZW4gJ0hFQUQnIGVsc2Ugb2JqZWN0SGFzaFxuICBhcmdzID0gWydzaG93JywgJy0tY29sb3I9bmV2ZXInXVxuICBzaG93Rm9ybWF0T3B0aW9uID0gYXRvbS5jb25maWcuZ2V0ICdnaXQtcGx1cy5nZW5lcmFsLnNob3dGb3JtYXQnXG4gIGFyZ3MucHVzaCBcIi0tZm9ybWF0PSN7c2hvd0Zvcm1hdE9wdGlvbn1cIiBpZiBzaG93Rm9ybWF0T3B0aW9uICE9ICdub25lJ1xuICBhcmdzLnB1c2ggJy0td29yZC1kaWZmJyBpZiBhdG9tLmNvbmZpZy5nZXQgJ2dpdC1wbHVzLmRpZmZzLndvcmREaWZmJ1xuICBhcmdzLnB1c2ggb2JqZWN0SGFzaFxuICBhcmdzLnB1c2ggJy0tJywgZmlsZSBpZiBmaWxlP1xuXG4gIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+IHByZXBGaWxlKGRhdGEsIG9iamVjdEhhc2gpIGlmIGRhdGEubGVuZ3RoID4gMFxuXG5wcmVwRmlsZSA9ICh0ZXh0LCBvYmplY3RIYXNoKSAtPlxuICBmcy53cml0ZUZpbGUgc2hvd0NvbW1pdEZpbGVQYXRoKG9iamVjdEhhc2gpLCB0ZXh0LCBmbGFnOiAndysnLCAoZXJyKSAtPlxuICAgIGlmIGVyciB0aGVuIG5vdGlmaWVyLmFkZEVycm9yIGVyciBlbHNlIHNob3dGaWxlIG9iamVjdEhhc2hcblxuc2hvd0ZpbGUgPSAob2JqZWN0SGFzaCkgLT5cbiAgZmlsZVBhdGggPSBzaG93Q29tbWl0RmlsZVBhdGgob2JqZWN0SGFzaClcbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBlZGl0b3JGb3JEaWZmcyA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpLmZpbHRlcigoaXRlbSkgLT4gaXRlbS5nZXRVUkk/KCk/LmluY2x1ZGVzKCcuZGlmZicpKVswXVxuICBpZiBlZGl0b3JGb3JEaWZmcz9cbiAgICBlZGl0b3JGb3JEaWZmcy5zZXRUZXh0IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgZW5jb2Rpbmc6ICd1dGYtOCcpXG4gIGVsc2VcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwub3BlbkluUGFuZScpXG4gICAgICBzcGxpdERpcmVjdGlvbiA9IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5zcGxpdFBhbmUnKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpW1wic3BsaXQje3NwbGl0RGlyZWN0aW9ufVwiXSgpXG4gICAgYXRvbS53b3Jrc3BhY2VcbiAgICAgIC5vcGVuKGZpbGVQYXRoLCBwZW5kaW5nOiB0cnVlLCBhY3RpdmF0ZVBhbmU6IHRydWUpXG4gICAgICAudGhlbiAodGV4dEJ1ZmZlcikgLT5cbiAgICAgICAgaWYgdGV4dEJ1ZmZlcj9cbiAgICAgICAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEJ1ZmZlci5vbkRpZERlc3Ryb3kgLT5cbiAgICAgICAgICAgIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgICAgICAgICAgdHJ5IGZzLnVubGlua1N5bmMgZmlsZVBhdGhcblxuY2xhc3MgSW5wdXRWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2ID0+XG4gICAgICBAc3VidmlldyAnb2JqZWN0SGFzaCcsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdDb21taXQgaGFzaCB0byBzaG93LiAoRGVmYXVsdHMgdG8gSEVBRCknKVxuXG4gIGluaXRpYWxpemU6IChAcmVwbykgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBvYmplY3RIYXNoLmZvY3VzKClcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJzogPT4gQGRlc3Ryb3koKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjb25maXJtJzogPT5cbiAgICAgIHRleHQgPSBAb2JqZWN0SGFzaC5nZXRNb2RlbCgpLmdldFRleHQoKS5zcGxpdCgnICcpWzBdXG4gICAgICBzaG93T2JqZWN0KEByZXBvLCB0ZXh0KVxuICAgICAgQGRlc3Ryb3koKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICBAcGFuZWw/LmRlc3Ryb3koKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCBvYmplY3RIYXNoLCBmaWxlKSAtPlxuICBpZiBub3Qgb2JqZWN0SGFzaD9cbiAgICBuZXcgSW5wdXRWaWV3KHJlcG8pXG4gIGVsc2VcbiAgICBzaG93T2JqZWN0KHJlcG8sIG9iamVjdEhhc2gsIGZpbGUpXG4iXX0=
