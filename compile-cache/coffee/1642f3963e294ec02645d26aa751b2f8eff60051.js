(function() {
  var $, BufferedProcess, CompositeDisposable, SplitDiff, SyncScroll, _, disposables, fs, git, notifier, path, ref, showRevision, splitDiff, updateNewTextEditor;

  _ = require('underscore-plus');

  path = require('path');

  fs = require('fs');

  git = require('../git');

  notifier = require('../notifier');

  ref = require("atom"), CompositeDisposable = ref.CompositeDisposable, BufferedProcess = ref.BufferedProcess;

  $ = require("atom-space-pen-views").$;

  disposables = new CompositeDisposable;

  SplitDiff = null;

  SyncScroll = null;

  splitDiff = function(editor, newTextEditor) {
    var editors, syncScroll;
    editors = {
      editor1: newTextEditor,
      editor2: editor
    };
    SplitDiff._setConfig('diffWords', true);
    SplitDiff._setConfig('ignoreWhitespace', true);
    SplitDiff._setConfig('syncHorizontalScroll', true);
    SplitDiff.diffPanes();
    SplitDiff.updateDiff(editors);
    syncScroll = new SyncScroll(editors.editor1, editors.editor2, true);
    return syncScroll.syncPositions();
  };

  updateNewTextEditor = function(newTextEditor, editor, gitRevision, fileContents) {
    return _.delay(function() {
      var lineEnding, ref1;
      lineEnding = ((ref1 = editor.buffer) != null ? ref1.lineEndingForRow(0) : void 0) || "\n";
      fileContents = fileContents.replace(/(\r\n|\n)/g, lineEnding);
      newTextEditor.buffer.setPreferredLineEnding(lineEnding);
      newTextEditor.setText(fileContents);
      newTextEditor.buffer.cachedDiskContents = fileContents;
      return splitDiff(editor, newTextEditor);
    }, 300);
  };

  showRevision = function(repo, filePath, editor, gitRevision, fileContents, options) {
    var outputFilePath, ref1, tempContent;
    if (options == null) {
      options = {};
    }
    gitRevision = path.basename(gitRevision);
    outputFilePath = (repo.getPath()) + "/{" + gitRevision + "} " + (path.basename(filePath));
    if (options.diff) {
      outputFilePath += ".diff";
    }
    tempContent = "Loading..." + ((ref1 = editor.buffer) != null ? ref1.lineEndingForRow(0) : void 0);
    return fs.writeFile(outputFilePath, tempContent, (function(_this) {
      return function(error) {
        if (!error) {
          return atom.workspace.open(filePath, {
            split: "left"
          }).then(function(editor) {
            return atom.workspace.open(outputFilePath, {
              split: "right"
            }).then(function(newTextEditor) {
              updateNewTextEditor(newTextEditor, editor, gitRevision, fileContents);
              try {
                return disposables.add(newTextEditor.onDidDestroy(function() {
                  return fs.unlink(outputFilePath);
                }));
              } catch (error1) {
                error = error1;
                return atom.notifications.addError("Could not remove file " + outputFilePath);
              }
            });
          });
        }
      };
    })(this));
  };

  module.exports = {
    showRevision: function(repo, editor, gitRevision) {
      var args, error, fileName, filePath, options;
      if (!SplitDiff) {
        try {
          SplitDiff = require(atom.packages.resolvePackagePath('split-diff'));
          SyncScroll = require(atom.packages.resolvePackagePath('split-diff') + '/lib/sync-scroll');
          atom.themes.requireStylesheet(atom.packages.resolvePackagePath('split-diff') + '/styles/split-diff');
        } catch (error1) {
          error = error1;
          return notifier.addInfo("Could not load 'split-diff' package to open diff view. Please install it `apm install split-diff`.");
        }
      }
      options = {
        diff: false
      };
      SplitDiff.disable(false);
      filePath = editor.getPath();
      fileName = path.basename(filePath);
      args = ["show", gitRevision + ":./" + fileName];
      return git.cmd(args, {
        cwd: path.dirname(filePath)
      }).then(function(data) {
        return showRevision(repo, filePath, editor, gitRevision, data, options);
      })["catch"](function(code) {
        return atom.notifications.addError("Git Plus: Could not retrieve revision for " + fileName + " (" + code + ")");
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9naXQtcmV2aXNpb24tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUVYLE1BQXlDLE9BQUEsQ0FBUSxNQUFSLENBQXpDLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3JCLElBQUssT0FBQSxDQUFRLHNCQUFSOztFQUVOLFdBQUEsR0FBYyxJQUFJOztFQUNsQixTQUFBLEdBQVk7O0VBQ1osVUFBQSxHQUFhOztFQUViLFNBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxhQUFUO0FBQ1YsUUFBQTtJQUFBLE9BQUEsR0FDRTtNQUFBLE9BQUEsRUFBUyxhQUFUO01BQ0EsT0FBQSxFQUFTLE1BRFQ7O0lBRUYsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsV0FBckIsRUFBa0MsSUFBbEM7SUFDQSxTQUFTLENBQUMsVUFBVixDQUFxQixrQkFBckIsRUFBeUMsSUFBekM7SUFDQSxTQUFTLENBQUMsVUFBVixDQUFxQixzQkFBckIsRUFBNkMsSUFBN0M7SUFDQSxTQUFTLENBQUMsU0FBVixDQUFBO0lBQ0EsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsT0FBckI7SUFDQSxVQUFBLEdBQWEsSUFBSSxVQUFKLENBQWUsT0FBTyxDQUFDLE9BQXZCLEVBQWdDLE9BQU8sQ0FBQyxPQUF4QyxFQUFpRCxJQUFqRDtXQUNiLFVBQVUsQ0FBQyxhQUFYLENBQUE7RUFWVTs7RUFZWixtQkFBQSxHQUFzQixTQUFDLGFBQUQsRUFBZ0Is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RUFBTSxLQUFQOztNQUVWLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQWxCO01BRUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUE7TUFDWCxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxRQUFkO01BRVgsSUFBQSxHQUFPLENBQUMsTUFBRCxFQUFZLFdBQUQsR0FBYSxLQUFiLEdBQWtCLFFBQTdCO2FBQ1AsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7UUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBQUw7T0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtlQUNKLFlBQUEsQ0FBYSxJQUFiLEVBQW1CLFFBQW5CLEVBQTZCLE1BQTdCLEVBQXFDLFdBQXJDLEVBQWtELElBQWxELEVBQXdELE9BQXhEO01BREksQ0FETixDQUdBLEVBQUMsS0FBRCxFQUhBLENBR08sU0FBQyxJQUFEO2VBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0Qiw0Q0FBQSxHQUE2QyxRQUE3QyxHQUFzRCxJQUF0RCxHQUEwRCxJQUExRCxHQUErRCxHQUEzRjtNQURLLENBSFA7SUFqQlksQ0FBZDs7QUF2REYiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblxue0NvbXBvc2l0ZURpc3Bvc2FibGUsIEJ1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlIFwiYXRvbVwiXG57JH0gPSByZXF1aXJlIFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIlxuXG5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5TcGxpdERpZmYgPSBudWxsXG5TeW5jU2Nyb2xsID0gbnVsbFxuXG5zcGxpdERpZmYgPSAoZWRpdG9yLCBuZXdUZXh0RWRpdG9yKSAtPlxuICBlZGl0b3JzID1cbiAgICBlZGl0b3IxOiBuZXdUZXh0RWRpdG9yICAgICMgdGhlIG9sZGVyIHJldmlzaW9uXG4gICAgZWRpdG9yMjogZWRpdG9yICAgICAgICAgICAjIGN1cnJlbnQgcmV2XG4gIFNwbGl0RGlmZi5fc2V0Q29uZmlnICdkaWZmV29yZHMnLCB0cnVlXG4gIFNwbGl0RGlmZi5fc2V0Q29uZmlnICdpZ25vcmVXaGl0ZXNwYWNlJywgdHJ1ZVxuICBTcGxpdERpZmYuX3NldENvbmZpZyAnc3luY0hvcml6b250YWxTY3JvbGwnLCB0cnVlXG4gIFNwbGl0RGlmZi5kaWZmUGFuZXMoKVxuICBTcGxpdERpZmYudXBkYXRlRGlmZihlZGl0b3JzKVxuICBzeW5jU2Nyb2xsID0gbmV3IFN5bmNTY3JvbGwoZWRpdG9ycy5lZGl0b3IxLCBlZGl0b3JzLmVkaXRvcjIsIHRydWUpXG4gIHN5bmNTY3JvbGwuc3luY1Bvc2l0aW9ucygpXG5cbnVwZGF0ZU5ld1RleHRFZGl0b3IgPSAobmV3VGV4dEVkaXRvciwgZWRpdG9yLCBnaXRSZXZpc2lvbiwgZmlsZUNvbnRlbnRzKSAtPlxuICBfLmRlbGF5IC0+XG4gICAgbGluZUVuZGluZyA9IGVkaXRvci5idWZmZXI/LmxpbmVFbmRpbmdGb3JSb3coMCkgfHwgXCJcXG5cIlxuICAgIGZpbGVDb250ZW50cyA9IGZpbGVDb250ZW50cy5yZXBsYWNlKC8oXFxyXFxufFxcbikvZywgbGluZUVuZGluZylcbiAgICBuZXdUZXh0RWRpdG9yLmJ1ZmZlci5zZXRQcmVmZXJyZWRMaW5lRW5kaW5nKGxpbmVFbmRpbmcpXG4gICAgbmV3VGV4dEVkaXRvci5zZXRUZXh0KGZpbGVDb250ZW50cylcbiAgICBuZXdUZXh0RWRpdG9yLmJ1ZmZlci5jYWNoZWREaXNrQ29udGVudHMgPSBmaWxlQ29udGVudHNcbiAgICBzcGxpdERpZmYoZWRpdG9yLCBuZXdUZXh0RWRpdG9yKVxuICAsIDMwMFxuXG5zaG93UmV2aXNpb24gPSAocmVwbywgZmlsZVBhdGgsIGVkaXRvciwgZ2l0UmV2aXNpb24sIGZpbGVDb250ZW50cywgb3B0aW9ucz17fSkgLT5cbiAgZ2l0UmV2aXNpb24gPSBwYXRoLmJhc2VuYW1lKGdpdFJldmlzaW9uKVxuICBvdXRwdXRGaWxlUGF0aCA9IFwiI3tyZXBvLmdldFBhdGgoKX0veyN7Z2l0UmV2aXNpb259fSAje3BhdGguYmFzZW5hbWUoZmlsZVBhdGgpfVwiXG4gIG91dHB1dEZpbGVQYXRoICs9IFwiLmRpZmZcIiBpZiBvcHRpb25zLmRpZmZcbiAgdGVtcENvbnRlbnQgPSBcIkxvYWRpbmcuLi5cIiArIGVkaXRvci5idWZmZXI/LmxpbmVFbmRpbmdGb3JSb3coMClcbiAgZnMud3JpdGVGaWxlIG91dHB1dEZpbGVQYXRoLCB0ZW1wQ29udGVudCwgKGVycm9yKSA9PlxuICAgIGlmIG5vdCBlcnJvclxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBmaWxlUGF0aCxcbiAgICAgICAgc3BsaXQ6IFwibGVmdFwiXG4gICAgICAudGhlbiAoZWRpdG9yKSA9PlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIG91dHB1dEZpbGVQYXRoLFxuICAgICAgICAgIHNwbGl0OiBcInJpZ2h0XCJcbiAgICAgICAgLnRoZW4gKG5ld1RleHRFZGl0b3IpID0+XG4gICAgICAgICAgdXBkYXRlTmV3VGV4dEVkaXRvcihuZXdUZXh0RWRpdG9yLCBlZGl0b3IsIGdpdFJldmlzaW9uLCBmaWxlQ29udGVudHMpXG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICBkaXNwb3NhYmxlcy5hZGQgbmV3VGV4dEVkaXRvci5vbkRpZERlc3Ryb3kgLT4gZnMudW5saW5rIG91dHB1dEZpbGVQYXRoXG4gICAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJDb3VsZCBub3QgcmVtb3ZlIGZpbGUgI3tvdXRwdXRGaWxlUGF0aH1cIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHNob3dSZXZpc2lvbjogKHJlcG8sIGVkaXRvciwgZ2l0UmV2aXNpb24pIC0+XG4gICAgaWYgbm90IFNwbGl0RGlmZlxuICAgICAgdHJ5XG4gICAgICAgIFNwbGl0RGlmZiA9IHJlcXVpcmUgYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ3NwbGl0LWRpZmYnKVxuICAgICAgICBTeW5jU2Nyb2xsID0gcmVxdWlyZSBhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aCgnc3BsaXQtZGlmZicpICsgJy9saWIvc3luYy1zY3JvbGwnXG4gICAgICAgIGF0b20udGhlbWVzLnJlcXVpcmVTdHlsZXNoZWV0KGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKCdzcGxpdC1kaWZmJykgKyAnL3N0eWxlcy9zcGxpdC1kaWZmJylcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIHJldHVybiBub3RpZmllci5hZGRJbmZvKFwiQ291bGQgbm90IGxvYWQgJ3NwbGl0LWRpZmYnIHBhY2thZ2UgdG8gb3BlbiBkaWZmIHZpZXcuIFBsZWFzZSBpbnN0YWxsIGl0IGBhcG0gaW5zdGFsbCBzcGxpdC1kaWZmYC5cIilcblxuICAgIG9wdGlvbnMgPSB7ZGlmZjogZmFsc2V9XG5cbiAgICBTcGxpdERpZmYuZGlzYWJsZShmYWxzZSlcblxuICAgIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGZpbGVOYW1lID0gcGF0aC5iYXNlbmFtZShmaWxlUGF0aClcblxuICAgIGFyZ3MgPSBbXCJzaG93XCIsIFwiI3tnaXRSZXZpc2lvbn06Li8je2ZpbGVOYW1lfVwiXVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgc2hvd1JldmlzaW9uKHJlcG8sIGZpbGVQYXRoLCBlZGl0b3IsIGdpdFJldmlzaW9uLCBkYXRhLCBvcHRpb25zKVxuICAgIC5jYXRjaCAoY29kZSkgLT5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIkdpdCBQbHVzOiBDb3VsZCBub3QgcmV0cmlldmUgcmV2aXNpb24gZm9yICN7ZmlsZU5hbWV9ICgje2NvZGV9KVwiKVxuIl19
