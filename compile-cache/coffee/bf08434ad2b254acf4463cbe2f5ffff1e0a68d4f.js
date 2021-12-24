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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRpZmZ0b29sLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNmLFFBQUE7SUFEdUIsc0JBQUQsTUFBTzs7TUFDN0IsT0FBUSxJQUFJLENBQUMsVUFBTCwyREFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCOztJQUNSLFFBQUEsR0FBVyxFQUFFLENBQUMsZUFBSCxDQUFtQixJQUFuQjtJQUVYLElBQUcsQ0FBSSxJQUFQO0FBQ0UsYUFBTyxRQUFRLENBQUMsT0FBVCxDQUFpQixrQ0FBakIsRUFEVDs7SUFLQSxJQUFBLENBQU8sQ0FBQSxJQUFBLEdBQU8sR0FBRyxDQUFDLFNBQUosQ0FBYyxJQUFkLEVBQW9CLFdBQXBCLENBQVAsQ0FBUDthQUNFLFFBQVEsQ0FBQyxPQUFULENBQWlCLHVDQUFqQixFQURGO0tBQUEsTUFBQTthQUdFLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxZQUFELEVBQWUsTUFBZixFQUF1QixJQUF2QixDQUFSLEVBQXNDO1FBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBdEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7QUFDSixZQUFBO1FBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWDtRQUNaLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEI7UUFFcEIsSUFBRyxRQUFIO1VBQ0UsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsYUFBbkI7VUFDUCxJQUFvQixpQkFBcEI7WUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsRUFBQTs7VUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVY7VUFDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztZQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1dBQWQsQ0FDQSxFQUFDLEtBQUQsRUFEQSxDQUNPLFNBQUMsT0FBRDttQkFBYSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLHdCQUE1QixFQUFzRDtjQUFDLE1BQUEsRUFBUSxPQUFUO2FBQXREO1VBQWIsQ0FEUDtBQUVBLGlCQU5GOztRQVFBLG1CQUFBLEdBQXNCLFNBQVMsQ0FBQyxHQUFWLENBQWMsU0FBQyxJQUFELEVBQU8sQ0FBUDtBQUNsQyxjQUFBO1VBQUEsSUFBRyxDQUFBLEdBQUksQ0FBSixLQUFTLENBQVo7WUFDRSxNQUFBLEdBQVMsQ0FBSSxTQUFTLENBQUMsSUFBVixDQUFlLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFiLENBQW1CLEdBQW5CLENBQXdCLENBQUEsQ0FBQSxDQUF2QztZQUNiLElBQUEsR0FBTyxTQUFVLENBQUEsQ0FBQSxHQUFFLENBQUY7WUFDakIsSUFBUSxJQUFBLEtBQVEsSUFBUixJQUFpQixDQUFDLENBQUMsTUFBRCxJQUFXLGlCQUFaLENBQXpCO3FCQUFBLEtBQUE7YUFIRjtXQUFBLE1BQUE7bUJBS0UsT0FMRjs7UUFEa0MsQ0FBZDtRQVF0QixJQUFHOztxQkFBSDtVQUNFLElBQUEsR0FBTyxDQUFDLFVBQUQsRUFBYSxhQUFiO1VBQ1AsSUFBb0IsaUJBQXBCO1lBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLEVBQUE7O1VBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWO2lCQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO1lBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7V0FBZCxDQUNBLEVBQUMsS0FBRCxFQURBLENBQ08sU0FBQyxPQUFEO21CQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsd0JBQTVCLEVBQXNEO2NBQUMsTUFBQSxFQUFRLE9BQVQ7YUFBdEQ7VUFBYixDQURQLEVBSkY7U0FBQSxNQUFBO2lCQU9FLFFBQVEsQ0FBQyxPQUFULENBQWlCLGtCQUFqQixFQVBGOztNQXBCSSxDQUROLEVBSEY7O0VBVGU7QUFKakIiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCB7ZmlsZX09e30pIC0+XG4gIGZpbGUgPz0gcmVwby5yZWxhdGl2aXplKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpKVxuICBpc0ZvbGRlciA9IGZzLmlzRGlyZWN0b3J5U3luYyBmaWxlXG5cbiAgaWYgbm90IGZpbGVcbiAgICByZXR1cm4gbm90aWZpZXIuYWRkSW5mbyBcIk5vIG9wZW4gZmlsZS4gU2VsZWN0ICdEaWZmIEFsbCcuXCJcblxuICAjIFdlIHBhcnNlIHRoZSBvdXRwdXQgb2YgZ2l0IGRpZmYtaW5kZXggdG8gaGFuZGxlIHRoZSBjYXNlIG9mIGEgc3RhZ2VkIGZpbGVcbiAgIyB3aGVuIGdpdC1wbHVzLmRpZmZzLmluY2x1ZGVTdGFnZWREaWZmIGlzIHNldCB0byBmYWxzZS5cbiAgdW5sZXNzIHRvb2wgPSBnaXQuZ2V0Q29uZmlnKHJlcG8sICdkaWZmLnRvb2wnKVxuICAgIG5vdGlmaWVyLmFkZEluZm8gXCJZb3UgZG9uJ3QgaGF2ZSBhIGRpZmZ0b29sIGNvbmZpZ3VyZWQuXCJcbiAgZWxzZVxuICAgIGdpdC5jbWQoWydkaWZmLWluZGV4JywgJ0hFQUQnLCAnLXonXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT5cbiAgICAgIGRpZmZJbmRleCA9IGRhdGEuc3BsaXQoJ1xcMCcpXG4gICAgICBpbmNsdWRlU3RhZ2VkRGlmZiA9IGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMuZGlmZnMuaW5jbHVkZVN0YWdlZERpZmYnXG5cbiAgICAgIGlmIGlzRm9sZGVyXG4gICAgICAgIGFyZ3MgPSBbJ2RpZmZ0b29sJywgJy1kJywgJy0tbm8tcHJvbXB0J11cbiAgICAgICAgYXJncy5wdXNoICdIRUFEJyBpZiBpbmNsdWRlU3RhZ2VkRGlmZlxuICAgICAgICBhcmdzLnB1c2ggZmlsZVxuICAgICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAgIC5jYXRjaCAobWVzc2FnZSkgLT4gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdFcnJvciBvcGVuaW5nIGRpZmZ0b29sJywge2RldGFpbDogbWVzc2FnZX0pXG4gICAgICAgIHJldHVyblxuXG4gICAgICBkaWZmc0ZvckN1cnJlbnRGaWxlID0gZGlmZkluZGV4Lm1hcCAobGluZSwgaSkgLT5cbiAgICAgICAgaWYgaSAlIDIgaXMgMFxuICAgICAgICAgIHN0YWdlZCA9IG5vdCAvXjB7NDB9JC8udGVzdChkaWZmSW5kZXhbaV0uc3BsaXQoJyAnKVszXSk7XG4gICAgICAgICAgcGF0aCA9IGRpZmZJbmRleFtpKzFdXG4gICAgICAgICAgdHJ1ZSBpZiBwYXRoIGlzIGZpbGUgYW5kICghc3RhZ2VkIG9yIGluY2x1ZGVTdGFnZWREaWZmKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdW5kZWZpbmVkXG5cbiAgICAgIGlmIGRpZmZzRm9yQ3VycmVudEZpbGUuZmlsdGVyKChkaWZmKSAtPiBkaWZmPylbMF0/XG4gICAgICAgIGFyZ3MgPSBbJ2RpZmZ0b29sJywgJy0tbm8tcHJvbXB0J11cbiAgICAgICAgYXJncy5wdXNoICdIRUFEJyBpZiBpbmNsdWRlU3RhZ2VkRGlmZlxuICAgICAgICBhcmdzLnB1c2ggZmlsZVxuICAgICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAgIC5jYXRjaCAobWVzc2FnZSkgLT4gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdFcnJvciBvcGVuaW5nIGRpZmZ0b29sJywge2RldGFpbDogbWVzc2FnZX0pXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZEluZm8gJ05vdGhpbmcgdG8gc2hvdy4nXG4iXX0=
