(function() {
  var fs, git, notifier;

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  module.exports = function(repo, arg) {
    var file, isFolder, ref, tool;
    file = (arg != null ? arg : {}).file;
    if (file == null) {
      file = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
    }
    isFolder = fs.isDirectorySync(file);
    if (!file) {
      return notifier.addInfo("No open file. Select 'Diff All'.");
    }
    if (!(tool = git.getConfig(repo, 'diff.tool'))) {
      return notifier.addInfo("You don't have a difftool configured.");
    } else {
      return git.cmd(['diff-index', 'HEAD', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        var args, diffIndex, diffsForCurrentFile, includeStagedDiff;
        diffIndex = data.split('\0');
        includeStagedDiff = atom.config.get('git-plus.diffs.includeStagedDiff');
        if (isFolder) {
          args = ['difftool', '-d', '--no-prompt'];
          if (includeStagedDiff) {
            args.push('HEAD');
          }
          args.push(file);
          git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          })["catch"](function(message) {
            return atom.notifications.addError('Error opening difftool', {
              detail: message
            });
          });
          return;
        }
        diffsForCurrentFile = diffIndex.map(function(line, i) {
          var path, staged;
          if (i % 2 === 0) {
            staged = !/^0{40}$/.test(diffIndex[i].split(' ')[3]);
            path = diffIndex[i + 1];
            if (path === file && (!staged || includeStagedDiff)) {
              return true;
            }
          } else {
            return void 0;
          }
        });
        if (diffsForCurrentFile.filter(function(diff) {
          return diff != null;
        })[0] != null) {
          args = ['difftool', '--no-prompt'];
          if (includeStagedDiff) {
            args.push('HEAD');
          }
          args.push(file);
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          })["catch"](function(message) {
            return atom.notifications.addError('Error opening difftool', {
              detail: message
            });
          });
        } else {
          return notifier.addInfo('Nothing to show.');
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmdG9vbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDZixRQUFBO0lBRHVCLHNCQUFELE1BQU87O01BQzdCLE9BQVEsSUFBSSxDQUFDLFVBQUwsMkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQjs7SUFDUixRQUFBLEdBQVcsRUFBRSxDQUFDLGVBQUgsQ0FBbUIsSUFBbkI7SUFFWCxJQUFHLENBQUksSUFBUDtBQUNFLGFBQU8sUUFBUSxDQUFDLE9BQVQsQ0FBaUIsa0NBQWpCLEVBRFQ7O0lBS0EsSUFBQSxDQUFPLENBQUEsSUFBQSxHQUFPLEdBQUcsQ0FBQyxTQUFKLENBQWMsSUFBZCxFQUFvQixXQUFwQixDQUFQLENBQVA7YUFDRSxRQUFRLENBQUMsT0FBVCxDQUFpQix1Q0FBakIsRUFERjtLQUFBLE1BQUE7YUFHRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsWUFBRCxFQUFlLE1BQWYsRUFBdUIsSUFBdkIsQ0FBUixFQUFzQztRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQXRDLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO0FBQ0osWUFBQTtRQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVg7UUFDWixpQkFBQSxHQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCO1FBRXBCLElBQUcsUUFBSDtVQUNFLElBQUEsR0FBTyxDQUFDLFVBQUQsRUFBYSxJQUFiLEVBQW1CLGFBQW5CO1VBQ1AsSUFBb0IsaUJBQXBCO1lBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLEVBQUE7O1VBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWO1VBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7WUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtXQUFkLENBQ0EsRUFBQyxLQUFELEVBREEsQ0FDTyxTQUFDLE9BQUQ7bUJBQWEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0Qix3QkFBNUIsRUFBc0Q7Y0FBQyxNQUFBLEVBQVEsT0FBVDthQUF0RDtVQUFiLENBRFA7QUFFQSxpQkFORjs7UUFRQSxtQkFBQSxHQUFzQixTQUFTLENBQUMsR0FBVixDQUFjLFNBQUMsSUFBRCxFQUFPLENBQVA7QUFDbEMsY0FBQTtVQUFBLElBQUcsQ0FBQSxHQUFJLENBQUosS0FBUyxDQUFaO1lBQ0UsTUFBQSxHQUFTLENBQUksU0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBYixDQUFtQixHQUFuQixDQUF3QixDQUFBLENBQUEsQ0FBdkM7WUFDYixJQUFBLEdBQU8sU0FBVSxDQUFBLENBQUEsR0FBRSxDQUFGO1lBQ2pCLElBQVEsSUFBQSxLQUFRLElBQVIsSUFBaUIsQ0FBQyxDQUFDLE1BQUQsSUFBVyxpQkFBWixDQUF6QjtxQkFBQSxLQUFBO2FBSEY7V0FBQSxNQUFBO21CQUtFLE9BTEY7O1FBRGtDLENBQWQ7UUFRdEIsSUFBRzs7cUJBQUg7VUFDRSxJQUFBLEdBQU8sQ0FBQyxVQUFELEVBQWEsYUFBYjtVQUNQLElBQW9CLGlCQUFwQjtZQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixFQUFBOztVQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVjtpQkFDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztZQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1dBQWQsQ0FDQSxFQUFDLEtBQUQsRUFEQSxDQUNPLFNBQUMsT0FBRDttQkFBYSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLHdCQUE1QixFQUFzRDtjQUFDLE1BQUEsRUFBUSxPQUFUO2FBQXREO1VBQWIsQ0FEUCxFQUpGO1NBQUEsTUFBQTtpQkFPRSxRQUFRLENBQUMsT0FBVCxDQUFpQixrQkFBakIsRUFQRjs7TUFwQkksQ0FETixFQUhGOztFQVRlO0FBSmpCIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge2ZpbGV9PXt9KSAtPlxuICBmaWxlID89IHJlcG8ucmVsYXRpdml6ZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKSlcbiAgaXNGb2xkZXIgPSBmcy5pc0RpcmVjdG9yeVN5bmMgZmlsZVxuXG4gIGlmIG5vdCBmaWxlXG4gICAgcmV0dXJuIG5vdGlmaWVyLmFkZEluZm8gXCJObyBvcGVuIGZpbGUuIFNlbGVjdCAnRGlmZiBBbGwnLlwiXG5cbiAgIyBXZSBwYXJzZSB0aGUgb3V0cHV0IG9mIGdpdCBkaWZmLWluZGV4IHRvIGhhbmRsZSB0aGUgY2FzZSBvZiBhIHN0YWdlZCBmaWxlXG4gICMgd2hlbiBnaXQtcGx1cy5kaWZmcy5pbmNsdWRlU3RhZ2VkRGlmZiBpcyBzZXQgdG8gZmFsc2UuXG4gIHVubGVzcyB0b29sID0gZ2l0LmdldENvbmZpZyhyZXBvLCAnZGlmZi50b29sJylcbiAgICBub3RpZmllci5hZGRJbmZvIFwiWW91IGRvbid0IGhhdmUgYSBkaWZmdG9vbCBjb25maWd1cmVkLlwiXG4gIGVsc2VcbiAgICBnaXQuY21kKFsnZGlmZi1pbmRleCcsICdIRUFEJywgJy16J10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBkaWZmSW5kZXggPSBkYXRhLnNwbGl0KCdcXDAnKVxuICAgICAgaW5jbHVkZVN0YWdlZERpZmYgPSBhdG9tLmNvbmZpZy5nZXQgJ2dpdC1wbHVzLmRpZmZzLmluY2x1ZGVTdGFnZWREaWZmJ1xuXG4gICAgICBpZiBpc0ZvbGRlclxuICAgICAgICBhcmdzID0gWydkaWZmdG9vbCcsICctZCcsICctLW5vLXByb21wdCddXG4gICAgICAgIGFyZ3MucHVzaCAnSEVBRCcgaWYgaW5jbHVkZVN0YWdlZERpZmZcbiAgICAgICAgYXJncy5wdXNoIGZpbGVcbiAgICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgICAuY2F0Y2ggKG1lc3NhZ2UpIC0+IGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignRXJyb3Igb3BlbmluZyBkaWZmdG9vbCcsIHtkZXRhaWw6IG1lc3NhZ2V9KVxuICAgICAgICByZXR1cm5cblxuICAgICAgZGlmZnNGb3JDdXJyZW50RmlsZSA9IGRpZmZJbmRleC5tYXAgKGxpbmUsIGkpIC0+XG4gICAgICAgIGlmIGkgJSAyIGlzIDBcbiAgICAgICAgICBzdGFnZWQgPSBub3QgL14wezQwfSQvLnRlc3QoZGlmZkluZGV4W2ldLnNwbGl0KCcgJylbM10pO1xuICAgICAgICAgIHBhdGggPSBkaWZmSW5kZXhbaSsxXVxuICAgICAgICAgIHRydWUgaWYgcGF0aCBpcyBmaWxlIGFuZCAoIXN0YWdlZCBvciBpbmNsdWRlU3RhZ2VkRGlmZilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHVuZGVmaW5lZFxuXG4gICAgICBpZiBkaWZmc0ZvckN1cnJlbnRGaWxlLmZpbHRlcigoZGlmZikgLT4gZGlmZj8pWzBdP1xuICAgICAgICBhcmdzID0gWydkaWZmdG9vbCcsICctLW5vLXByb21wdCddXG4gICAgICAgIGFyZ3MucHVzaCAnSEVBRCcgaWYgaW5jbHVkZVN0YWdlZERpZmZcbiAgICAgICAgYXJncy5wdXNoIGZpbGVcbiAgICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgICAuY2F0Y2ggKG1lc3NhZ2UpIC0+IGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignRXJyb3Igb3BlbmluZyBkaWZmdG9vbCcsIHtkZXRhaWw6IG1lc3NhZ2V9KVxuICAgICAgZWxzZVxuICAgICAgICBub3RpZmllci5hZGRJbmZvICdOb3RoaW5nIHRvIHNob3cuJ1xuIl19
