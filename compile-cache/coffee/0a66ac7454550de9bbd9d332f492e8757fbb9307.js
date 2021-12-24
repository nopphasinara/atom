(function() {
  var $, $$$, BufferedProcess, Disposable, GitShow, LogListView, View, _, emoji, git, numberOfCommitsToShow, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  BufferedProcess = require('atom').BufferedProcess;

  ref = require('atom-space-pen-views'), $ = ref.$, $$$ = ref.$$$, View = ref.View;

  _ = require('underscore-plus');

  emoji = require('node-emoji');

  git = require('../git');

  GitShow = require('../models/git-show');

  numberOfCommitsToShow = function() {
    return atom.config.get('git-plus.logs.numberOfCommitsToShow');
  };

  module.exports = LogListView = (function(superClass) {
    extend(LogListView, superClass);

    function LogListView() {
      return LogListView.__super__.constructor.apply(this, arguments);
    }

    LogListView.content = function() {
      return this.div({
        "class": 'git-plus-log',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.table({
            id: 'git-plus-commits',
            outlet: 'commitsListView'
          });
          return _this.div({
            "class": 'show-more'
          }, function() {
            return _this.a({
              id: 'show-more'
            }, 'Show More');
          });
        };
      })(this));
    };

    LogListView.prototype.getURI = function() {
      return 'atom://git-plus:log';
    };

    LogListView.prototype.getTitle = function() {
      return 'git-plus: Log';
    };

    LogListView.prototype.initialize = function() {
      var loadMore;
      this.skipCommits = 0;
      this.finished = false;
      loadMore = _.debounce((function(_this) {
        return function() {
          if (_this.prop('scrollHeight') - _this.scrollTop() - _this.height() < 20) {
            return _this.getLog();
          }
        };
      })(this), 50);
      this.on('click', '.commit-row', (function(_this) {
        return function(arg) {
          var currentTarget;
          currentTarget = arg.currentTarget;
          return _this.showCommitLog(currentTarget.getAttribute('hash'));
        };
      })(this));
      this.on('click', '#show-more', loadMore);
      return this.scroll(loadMore);
    };

    LogListView.prototype.attached = function() {
      return this.commandSubscription = atom.commands.add(this.element, {
        'core:move-down': (function(_this) {
          return function() {
            return _this.selectNextResult();
          };
        })(this),
        'core:move-up': (function(_this) {
          return function() {
            return _this.selectPreviousResult();
          };
        })(this),
        'core:page-up': (function(_this) {
          return function() {
            return _this.selectPreviousResult(10);
          };
        })(this),
        'core:page-down': (function(_this) {
          return function() {
            return _this.selectNextResult(10);
          };
        })(this),
        'core:move-to-top': (function(_this) {
          return function() {
            return _this.selectFirstResult();
          };
        })(this),
        'core:move-to-bottom': (function(_this) {
          return function() {
            return _this.selectLastResult();
          };
        })(this),
        'core:confirm': (function(_this) {
          return function() {
            var hash;
            hash = _this.find('.selected').attr('hash');
            if (hash) {
              _this.showCommitLog(hash);
            }
            return false;
          };
        })(this)
      });
    };

    LogListView.prototype.detached = function() {
      this.commandSubscription.dispose();
      return this.commandSubscription = null;
    };

    LogListView.prototype.parseData = function(data) {
      var commits, newline, separator;
      if (data.length < 1) {
        this.finished = true;
        return;
      }
      separator = ';|';
      newline = '_.;._';
      data = data.substring(0, data.length - newline.length - 1);
      commits = data.split(newline).map(function(line) {
        var tmpData;
        if (line.trim() !== '') {
          tmpData = line.trim().split(separator);
          return {
            hashShort: tmpData[0],
            hash: tmpData[1],
            author: tmpData[2],
            email: tmpData[3],
            message: tmpData[4],
            date: tmpData[5]
          };
        }
      });
      return this.renderLog(commits);
    };

    LogListView.prototype.renderHeader = function() {
      var headerRow;
      headerRow = $$$(function() {
        return this.tr({
          "class": 'commit-header'
        }, (function(_this) {
          return function() {
            _this.td('Date');
            _this.td('Message');
            return _this.td({
              "class": 'hashShort'
            }, 'Short Hash');
          };
        })(this));
      });
      return this.commitsListView.append(headerRow);
    };

    LogListView.prototype.renderLog = function(commits) {
      commits.forEach((function(_this) {
        return function(commit) {
          return _this.renderCommit(commit);
        };
      })(this));
      return this.skipCommits += numberOfCommitsToShow();
    };

    LogListView.prototype.renderCommit = function(commit) {
      var commitRow;
      commitRow = $$$(function() {
        return this.tr({
          "class": 'commit-row',
          hash: "" + commit.hash
        }, (function(_this) {
          return function() {
            _this.td({
              "class": 'date'
            }, commit.date + " by " + commit.author);
            _this.td({
              "class": 'message'
            }, "" + (emoji.emojify(commit.message)));
            return _this.td({
              "class": 'hashShort'
            }, "" + commit.hashShort);
          };
        })(this));
      });
      return this.commitsListView.append(commitRow);
    };

    LogListView.prototype.showCommitLog = function(hash) {
      return GitShow(this.repo, hash, this.onlyCurrentFile ? this.currentFile : void 0);
    };

    LogListView.prototype.branchLog = function(repo) {
      this.repo = repo;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.onlyCurrentFile = false;
      this.currentFile = null;
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.currentFileLog = function(repo, currentFile) {
      this.repo = repo;
      this.currentFile = currentFile;
      this.onlyCurrentFile = true;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.getLog = function() {
      var args;
      if (this.finished) {
        return;
      }
      args = ['log', "--pretty=%h;|%H;|%aN;|%aE;|%s;|%ai_.;._", "-" + (numberOfCommitsToShow()), '--skip=' + this.skipCommits];
      if (this.onlyCurrentFile && (this.currentFile != null)) {
        args.push(this.currentFile);
      }
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(data) {
          return _this.parseData(data);
        };
      })(this));
    };

    LogListView.prototype.selectFirstResult = function() {
      this.selectResult(this.find('.commit-row:first'));
      return this.scrollToTop();
    };

    LogListView.prototype.selectLastResult = function() {
      this.selectResult(this.find('.commit-row:last'));
      return this.scrollToBottom();
    };

    LogListView.prototype.selectNextResult = function(skip) {
      var nextView, selectedView;
      if (skip == null) {
        skip = 1;
      }
      selectedView = this.find('.selected');
      if (selectedView.length < 1) {
        return this.selectFirstResult();
      }
      nextView = this.getNextResult(selectedView, skip);
      this.selectResult(nextView);
      return this.scrollTo(nextView);
    };

    LogListView.prototype.selectPreviousResult = function(skip) {
      var prevView, selectedView;
      if (skip == null) {
        skip = 1;
      }
      selectedView = this.find('.selected');
      if (selectedView.length < 1) {
        return this.selectFirstResult();
      }
      prevView = this.getPreviousResult(selectedView, skip);
      this.selectResult(prevView);
      return this.scrollTo(prevView);
    };

    LogListView.prototype.getNextResult = function(element, skip) {
      var itemIndex, items;
      if (!(element != null ? element.length : void 0)) {
        return;
      }
      items = this.find('.commit-row');
      itemIndex = items.index(element);
      return $(items[Math.min(itemIndex + skip, items.length - 1)]);
    };

    LogListView.prototype.getPreviousResult = function(element, skip) {
      var itemIndex, items;
      if (!(element != null ? element.length : void 0)) {
        return;
      }
      items = this.find('.commit-row');
      itemIndex = items.index(element);
      return $(items[Math.max(itemIndex - skip, 0)]);
    };

    LogListView.prototype.selectResult = function(resultView) {
      if (!(resultView != null ? resultView.length : void 0)) {
        return;
      }
      this.find('.selected').removeClass('selected');
      return resultView.addClass('selected');
    };

    LogListView.prototype.scrollTo = function(element) {
      var bottom, top;
      if (!(element != null ? element.length : void 0)) {
        return;
      }
      top = this.scrollTop() + element.offset().top - this.offset().top;
      bottom = top + element.outerHeight();
      if (bottom > this.scrollBottom()) {
        this.scrollBottom(bottom);
      }
      if (top < this.scrollTop()) {
        return this.scrollTop(top);
      }
    };

    return LogListView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9sb2ctbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMEdBQUE7SUFBQTs7O0VBQUMsYUFBYyxPQUFBLENBQVEsTUFBUjs7RUFDZCxrQkFBbUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3BCLE1BQWlCLE9BQUEsQ0FBUSxzQkFBUixDQUFqQixFQUFDLFNBQUQsRUFBSSxhQUFKLEVBQVM7O0VBQ1QsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixLQUFBLEdBQVEsT0FBQSxDQUFRLFlBQVI7O0VBQ1IsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVI7O0VBRVYscUJBQUEsR0FBd0IsU0FBQTtXQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQ0FBaEI7RUFBSDs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQVA7UUFBdUIsUUFBQSxFQUFVLENBQUMsQ0FBbEM7T0FBTCxFQUEwQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDeEMsS0FBQyxDQUFBLEtBQUQsQ0FBTztZQUFBLEVBQUEsRUFBSSxrQkFBSjtZQUF3QixNQUFBLEVBQVEsaUJBQWhDO1dBQVA7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDtXQUFMLEVBQXlCLFNBQUE7bUJBQ3ZCLEtBQUMsQ0FBQSxDQUFELENBQUc7Y0FBQSxFQUFBLEVBQUksV0FBSjthQUFILEVBQW9CLFdBQXBCO1VBRHVCLENBQXpCO1FBRndDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQztJQURROzswQkFNVixNQUFBLEdBQVEsU0FBQTthQUFHO0lBQUg7OzBCQUVSLFFBQUEsR0FBVSxTQUFBO2FBQUc7SUFBSDs7MEJBRVYsVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxRQUFELEdBQVk7TUFDWixRQUFBLEdBQVcsQ0FBQyxDQUFDLFFBQUYsQ0FBWSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDckIsSUFBYSxLQUFDLENBQUEsSUFBRCxDQUFNLGNBQU4sQ0FBQSxHQUF3QixLQUFDLENBQUEsU0FBRCxDQUFBLENBQXhCLEdBQXVDLEtBQUMsQ0FBQSxNQUFELENBQUEsQ0FBdkMsR0FBbUQsRUFBaEU7bUJBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBOztRQURxQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWixFQUVULEVBRlM7TUFHWCxJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxhQUFiLEVBQTRCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQzFCLGNBQUE7VUFENEIsZ0JBQUQ7aUJBQzNCLEtBQUMsQ0FBQSxhQUFELENBQWUsYUFBYSxDQUFDLFlBQWQsQ0FBMkIsTUFBM0IsQ0FBZjtRQUQwQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUI7TUFFQSxJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxZQUFiLEVBQTJCLFFBQTNCO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxRQUFSO0lBVFU7OzBCQVdaLFFBQUEsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFDckI7UUFBQSxnQkFBQSxFQUFrQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxnQkFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO1FBQ0EsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxvQkFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGhCO1FBRUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxvQkFBRCxDQUFzQixFQUF0QjtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZoQjtRQUdBLGdCQUFBLEVBQWtCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGdCQUFELENBQWtCLEVBQWxCO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSGxCO1FBSUEsa0JBQUEsRUFBb0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDbEIsS0FBQyxDQUFBLGlCQUFELENBQUE7VUFEa0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSnBCO1FBTUEscUJBQUEsRUFBdUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDckIsS0FBQyxDQUFBLGdCQUFELENBQUE7VUFEcUI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTnZCO1FBUUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQ2QsZ0JBQUE7WUFBQSxJQUFBLEdBQU8sS0FBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsTUFBeEI7WUFDUCxJQUF1QixJQUF2QjtjQUFBLEtBQUMsQ0FBQSxhQUFELENBQWUsSUFBZixFQUFBOzttQkFDQTtVQUhjO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVJoQjtPQURxQjtJQURmOzswQkFlVixRQUFBLEdBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxPQUFyQixDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELEdBQXVCO0lBRmY7OzBCQUlWLFNBQUEsR0FBVyxTQUFDLElBQUQ7QUFDVCxVQUFBO01BQUEsSUFBRyxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWpCO1FBQ0UsSUFBQyxDQUFBLFFBQUQsR0FBWTtBQUNaLGVBRkY7O01BSUEsU0FBQSxHQUFZO01BQ1osT0FBQSxHQUFVO01BQ1YsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZixFQUFrQixJQUFJLENBQUMsTUFBTCxHQUFjLE9BQU8sQ0FBQyxNQUF0QixHQUErQixDQUFqRDtNQUVQLE9BQUEsR0FBVSxJQUFJLENBQUMsS0FBTCxDQUFXLE9BQVgsQ0FBbUIsQ0FBQyxHQUFwQixDQUF3QixTQUFDLElBQUQ7QUFDaEMsWUFBQTtRQUFBLElBQUcsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFBLEtBQWlCLEVBQXBCO1VBQ0UsT0FBQSxHQUFVLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBVyxDQUFDLEtBQVosQ0FBa0IsU0FBbEI7QUFDVixpQkFBTztZQUNMLFNBQUEsRUFBVyxPQUFRLENBQUEsQ0FBQSxDQURkO1lBRUwsSUFBQSxFQUFNLE9BQVEsQ0FBQSxDQUFBLENBRlQ7WUFHTCxNQUFBLEVBQVEsT0FBUSxDQUFBLENBQUEsQ0FIWDtZQUlMLEtBQUEsRUFBTyxPQUFRLENBQUEsQ0FBQSxDQUpWO1lBS0wsT0FBQSxFQUFTLE9BQVEsQ0FBQSxDQUFBLENBTFo7WUFNTCxJQUFBLEVBQU0sT0FBUSxDQUFBLENBQUEsQ0FOVDtZQUZUOztNQURnQyxDQUF4QjthQVlWLElBQUMsQ0FBQSxTQUFELENBQVcsT0FBWDtJQXJCUzs7MEJBdUJYLFlBQUEsR0FBYyxTQUFBO0FBQ1osVUFBQTtNQUFBLFNBQUEsR0FBWSxHQUFBLENBQUksU0FBQTtlQUNkLElBQUMsQ0FBQSxFQUFELENBQUk7VUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQVA7U0FBSixFQUE0QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO1lBQzFCLEtBQUMsQ0FBQSxFQUFELENBQUksTUFBSjtZQUNBLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBSjttQkFDQSxLQUFDLENBQUEsRUFBRCxDQUFJO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO2FBQUosRUFBd0IsWUFBeEI7VUFIMEI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCO01BRGMsQ0FBSjthQU1aLElBQUMsQ0FBQSxlQUFlLENBQUMsTUFBakIsQ0FBd0IsU0FBeEI7SUFQWTs7MEJBU2QsU0FBQSxHQUFXLFNBQUMsT0FBRDtNQUNULE9BQU8sQ0FBQyxPQUFSLENBQWdCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO2lCQUFZLEtBQUMsQ0FBQSxZQUFELENBQWMsTUFBZDtRQUFaO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjthQUNBLElBQUMsQ0FBQSxXQUFELElBQWdCLHFCQUFBLENBQUE7SUFGUDs7MEJBSVgsWUFBQSxHQUFjLFNBQUMsTUFBRDtBQUNaLFVBQUE7TUFBQSxTQUFBLEdBQVksR0FBQSxDQUFJLFNBQUE7ZUFDZCxJQUFDLENBQUEsRUFBRCxDQUFJO1VBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUFQO1VBQXFCLElBQUEsRUFBTSxFQUFBLEdBQUcsTUFBTSxDQUFDLElBQXJDO1NBQUosRUFBaUQsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUMvQyxLQUFDLENBQUEsRUFBRCxDQUFJO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxNQUFQO2FBQUosRUFBc0IsTUFBTSxDQUFDLElBQVIsR0FBYSxNQUFiLEdBQW1CLE1BQU0sQ0FBQyxNQUEvQztZQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQVA7YUFBSixFQUFzQixFQUFBLEdBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTixDQUFjLE1BQU0sQ0FBQyxPQUFyQixDQUFELENBQXhCO21CQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFdBQVA7YUFBSixFQUF3QixFQUFBLEdBQUcsTUFBTSxDQUFDLFNBQWxDO1VBSCtDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRDtNQURjLENBQUo7YUFNWixJQUFDLENBQUEsZUFBZSxDQUFDLE1BQWpCLENBQXdCLFNBQXhCO0lBUFk7OzBCQVNkLGFBQUEsR0FBZSxTQUFDLElBQUQ7YUFDYixPQUFBLENBQVEsSUFBQyxDQUFBLElBQVQsRUFBZSxJQUFmLEVBQXFDLElBQUMsQ0FBQSxlQUFqQixHQUFBLElBQUMsQ0FBQSxXQUFELEdBQUEsTUFBckI7SUFEYTs7MEJBR2YsU0FBQSxHQUFXLFNBQUMsSUFBRDtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQ1YsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxlQUFlLENBQUMsS0FBakIsQ0FBQTtNQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CO01BQ25CLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFDLENBQUEsWUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQU5TOzswQkFRWCxjQUFBLEdBQWdCLFNBQUMsSUFBRCxFQUFRLFdBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxjQUFEO01BQ3RCLElBQUMsQ0FBQSxlQUFELEdBQW1CO01BQ25CLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFDLENBQUEsZUFBZSxDQUFDLEtBQWpCLENBQUE7TUFDQSxJQUFDLENBQUEsWUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUxjOzswQkFPaEIsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsSUFBVSxJQUFDLENBQUEsUUFBWDtBQUFBLGVBQUE7O01BRUEsSUFBQSxHQUFPLENBQUMsS0FBRCxFQUFRLHlDQUFSLEVBQW1ELEdBQUEsR0FBRyxDQUFDLHFCQUFBLENBQUEsQ0FBRCxDQUF0RCxFQUFrRixTQUFBLEdBQVksSUFBQyxDQUFBLFdBQS9GO01BQ1AsSUFBMEIsSUFBQyxDQUFBLGVBQUQsSUFBcUIsMEJBQS9DO1FBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsV0FBWCxFQUFBOzthQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO1FBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFMO09BQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtpQkFBVSxLQUFDLENBQUEsU0FBRCxDQUFXLElBQVg7UUFBVjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETjtJQUxNOzswQkFRUixpQkFBQSxHQUFtQixTQUFBO01BQ2pCLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLElBQUQsQ0FBTSxtQkFBTixDQUFkO2FBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtJQUZpQjs7MEJBSW5CLGdCQUFBLEdBQWtCLFNBQUE7TUFDaEIsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsSUFBRCxDQUFNLGtCQUFOLENBQWQ7YUFDQSxJQUFDLENBQUEsY0FBRCxDQUFBO0lBRmdCOzswQkFJbEIsZ0JBQUEsR0FBa0IsU0FBQyxJQUFEO0FBQ2hCLFVBQUE7O1FBRGlCLE9BQU87O01BQ3hCLFlBQUEsR0FBZSxJQUFDLENBQUEsSUFBRCxDQUFNLFdBQU47TUFDZixJQUErQixZQUFZLENBQUMsTUFBYixHQUFzQixDQUFyRDtBQUFBLGVBQU8sSUFBQyxDQUFBLGlCQUFELENBQUEsRUFBUDs7TUFDQSxRQUFBLEdBQVcsSUFBQyxDQUFBLGFBQUQsQ0FBZSxZQUFmLEVBQTZCLElBQTdCO01BRVgsSUFBQyxDQUFBLFlBQUQsQ0FBYyxRQUFkO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO0lBTmdCOzswQkFRbEIsb0JBQUEsR0FBc0IsU0FBQyxJQUFEO0FBQ3BCLFVBQUE7O1FBRHFCLE9BQU87O01BQzVCLFlBQUEsR0FBZSxJQUFDLENBQUEsSUFBRCxDQUFNLFdBQU47TUFDZixJQUErQixZQUFZLENBQUMsTUFBYixHQUFzQixDQUFyRDtBQUFBLGVBQU8sSUFBQyxDQUFBLGlCQUFELENBQUEsRUFBUDs7TUFDQSxRQUFBLEdBQVcsSUFBQyxDQUFBLGlCQUFELENBQW1CLFlBQW5CLEVBQWlDLElBQWpDO01BRVgsSUFBQyxDQUFBLFlBQUQsQ0FBYyxRQUFkO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO0lBTm9COzswQkFRdEIsYUFBQSxHQUFlLFNBQUMsT0FBRCxFQUFVLElBQVY7QUFDYixVQUFBO01BQUEsSUFBQSxvQkFBYyxPQUFPLENBQUUsZ0JBQXZCO0FBQUEsZUFBQTs7TUFDQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUQsQ0FBTSxhQUFOO01BQ1IsU0FBQSxHQUFZLEtBQUssQ0FBQyxLQUFOLENBQVksT0FBWjthQUNaLENBQUEsQ0FBRSxLQUFNLENBQUEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxTQUFBLEdBQVksSUFBckIsRUFBMkIsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUExQyxDQUFBLENBQVI7SUFKYTs7MEJBTWYsaUJBQUEsR0FBbUIsU0FBQyxPQUFELEVBQVUsSUFBVjtBQUNqQixVQUFBO01BQUEsSUFBQSxvQkFBYyxPQUFPLENBQUUsZ0JBQXZCO0FBQUEsZUFBQTs7TUFDQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUQsQ0FBTSxhQUFOO01BQ1IsU0FBQSxHQUFZLEtBQUssQ0FBQyxLQUFOLENBQVksT0FBWjthQUNaLENBQUEsQ0FBRSxLQUFNLENBQUEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxTQUFBLEdBQVksSUFBckIsRUFBMkIsQ0FBM0IsQ0FBQSxDQUFSO0lBSmlCOzswQkFNbkIsWUFBQSxHQUFjLFNBQUMsVUFBRDtNQUNaLElBQUEsdUJBQWMsVUFBVSxDQUFFLGdCQUExQjtBQUFBLGVBQUE7O01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLENBQWtCLENBQUMsV0FBbkIsQ0FBK0IsVUFBL0I7YUFDQSxVQUFVLENBQUMsUUFBWCxDQUFvQixVQUFwQjtJQUhZOzswQkFLZCxRQUFBLEdBQVUsU0FBQyxPQUFEO0FBQ1IsVUFBQTtNQUFBLElBQUEsb0JBQWMsT0FBTyxDQUFFLGdCQUF2QjtBQUFBLGVBQUE7O01BQ0EsR0FBQSxHQUFNLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBQSxHQUFlLE9BQU8sQ0FBQyxNQUFSLENBQUEsQ0FBZ0IsQ0FBQyxHQUFoQyxHQUFzQyxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQztNQUN0RCxNQUFBLEdBQVMsR0FBQSxHQUFNLE9BQU8sQ0FBQyxXQUFSLENBQUE7TUFFZixJQUF5QixNQUFBLEdBQVMsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFsQztRQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxFQUFBOztNQUNBLElBQW1CLEdBQUEsR0FBTSxJQUFDLENBQUEsU0FBRCxDQUFBLENBQXpCO2VBQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxHQUFYLEVBQUE7O0lBTlE7Ozs7S0F6SmM7QUFYMUIiLCJzb3VyY2VzQ29udGVudCI6WyJ7RGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue0J1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xueyQsICQkJCwgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5lbW9qaSA9IHJlcXVpcmUgJ25vZGUtZW1vamknXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5HaXRTaG93ID0gcmVxdWlyZSAnLi4vbW9kZWxzL2dpdC1zaG93J1xuXG5udW1iZXJPZkNvbW1pdHNUb1Nob3cgPSAtPiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmxvZ3MubnVtYmVyT2ZDb21taXRzVG9TaG93JylcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTG9nTGlzdFZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICdnaXQtcGx1cy1sb2cnLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBAdGFibGUgaWQ6ICdnaXQtcGx1cy1jb21taXRzJywgb3V0bGV0OiAnY29tbWl0c0xpc3RWaWV3J1xuICAgICAgQGRpdiBjbGFzczogJ3Nob3ctbW9yZScsID0+XG4gICAgICAgIEBhIGlkOiAnc2hvdy1tb3JlJywgJ1Nob3cgTW9yZSdcblxuICBnZXRVUkk6IC0+ICdhdG9tOi8vZ2l0LXBsdXM6bG9nJ1xuXG4gIGdldFRpdGxlOiAtPiAnZ2l0LXBsdXM6IExvZydcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBza2lwQ29tbWl0cyA9IDBcbiAgICBAZmluaXNoZWQgPSBmYWxzZVxuICAgIGxvYWRNb3JlID0gXy5kZWJvdW5jZSggPT5cbiAgICAgIEBnZXRMb2coKSBpZiBAcHJvcCgnc2Nyb2xsSGVpZ2h0JykgLSBAc2Nyb2xsVG9wKCkgLSBAaGVpZ2h0KCkgPCAyMFxuICAgICwgNTApXG4gICAgQG9uICdjbGljaycsICcuY29tbWl0LXJvdycsICh7Y3VycmVudFRhcmdldH0pID0+XG4gICAgICBAc2hvd0NvbW1pdExvZyBjdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnaGFzaCcpXG4gICAgQG9uICdjbGljaycsICcjc2hvdy1tb3JlJywgbG9hZE1vcmVcbiAgICBAc2Nyb2xsKGxvYWRNb3JlKVxuXG4gIGF0dGFjaGVkOiAtPlxuICAgIEBjb21tYW5kU3Vic2NyaXB0aW9uID0gYXRvbS5jb21tYW5kcy5hZGQgQGVsZW1lbnQsXG4gICAgICAnY29yZTptb3ZlLWRvd24nOiA9PiBAc2VsZWN0TmV4dFJlc3VsdCgpXG4gICAgICAnY29yZTptb3ZlLXVwJzogPT4gQHNlbGVjdFByZXZpb3VzUmVzdWx0KClcbiAgICAgICdjb3JlOnBhZ2UtdXAnOiA9PiBAc2VsZWN0UHJldmlvdXNSZXN1bHQoMTApXG4gICAgICAnY29yZTpwYWdlLWRvd24nOiA9PiBAc2VsZWN0TmV4dFJlc3VsdCgxMClcbiAgICAgICdjb3JlOm1vdmUtdG8tdG9wJzogPT5cbiAgICAgICAgQHNlbGVjdEZpcnN0UmVzdWx0KClcbiAgICAgICdjb3JlOm1vdmUtdG8tYm90dG9tJzogPT5cbiAgICAgICAgQHNlbGVjdExhc3RSZXN1bHQoKVxuICAgICAgJ2NvcmU6Y29uZmlybSc6ID0+XG4gICAgICAgIGhhc2ggPSBAZmluZCgnLnNlbGVjdGVkJykuYXR0cignaGFzaCcpXG4gICAgICAgIEBzaG93Q29tbWl0TG9nIGhhc2ggaWYgaGFzaFxuICAgICAgICBmYWxzZVxuXG4gIGRldGFjaGVkOiAtPlxuICAgIEBjb21tYW5kU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIEBjb21tYW5kU3Vic2NyaXB0aW9uID0gbnVsbFxuXG4gIHBhcnNlRGF0YTogKGRhdGEpIC0+XG4gICAgaWYgZGF0YS5sZW5ndGggPCAxXG4gICAgICBAZmluaXNoZWQgPSB0cnVlXG4gICAgICByZXR1cm5cblxuICAgIHNlcGFyYXRvciA9ICc7fCdcbiAgICBuZXdsaW5lID0gJ18uOy5fJ1xuICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZygwLCBkYXRhLmxlbmd0aCAtIG5ld2xpbmUubGVuZ3RoIC0gMSlcblxuICAgIGNvbW1pdHMgPSBkYXRhLnNwbGl0KG5ld2xpbmUpLm1hcCAobGluZSkgLT5cbiAgICAgIGlmIGxpbmUudHJpbSgpIGlzbnQgJydcbiAgICAgICAgdG1wRGF0YSA9IGxpbmUudHJpbSgpLnNwbGl0KHNlcGFyYXRvcilcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoYXNoU2hvcnQ6IHRtcERhdGFbMF1cbiAgICAgICAgICBoYXNoOiB0bXBEYXRhWzFdXG4gICAgICAgICAgYXV0aG9yOiB0bXBEYXRhWzJdXG4gICAgICAgICAgZW1haWw6IHRtcERhdGFbM11cbiAgICAgICAgICBtZXNzYWdlOiB0bXBEYXRhWzRdXG4gICAgICAgICAgZGF0ZTogdG1wRGF0YVs1XVxuICAgICAgICB9XG5cbiAgICBAcmVuZGVyTG9nIGNvbW1pdHNcblxuICByZW5kZXJIZWFkZXI6IC0+XG4gICAgaGVhZGVyUm93ID0gJCQkIC0+XG4gICAgICBAdHIgY2xhc3M6ICdjb21taXQtaGVhZGVyJywgPT5cbiAgICAgICAgQHRkICdEYXRlJ1xuICAgICAgICBAdGQgJ01lc3NhZ2UnXG4gICAgICAgIEB0ZCBjbGFzczogJ2hhc2hTaG9ydCcsICdTaG9ydCBIYXNoJ1xuXG4gICAgQGNvbW1pdHNMaXN0Vmlldy5hcHBlbmQoaGVhZGVyUm93KVxuXG4gIHJlbmRlckxvZzogKGNvbW1pdHMpIC0+XG4gICAgY29tbWl0cy5mb3JFYWNoIChjb21taXQpID0+IEByZW5kZXJDb21taXQgY29tbWl0XG4gICAgQHNraXBDb21taXRzICs9IG51bWJlck9mQ29tbWl0c1RvU2hvdygpXG5cbiAgcmVuZGVyQ29tbWl0OiAoY29tbWl0KSAtPlxuICAgIGNvbW1pdFJvdyA9ICQkJCAtPlxuICAgICAgQHRyIGNsYXNzOiAnY29tbWl0LXJvdycsIGhhc2g6IFwiI3tjb21taXQuaGFzaH1cIiwgPT5cbiAgICAgICAgQHRkIGNsYXNzOiAnZGF0ZScsIFwiI3tjb21taXQuZGF0ZX0gYnkgI3tjb21taXQuYXV0aG9yfVwiXG4gICAgICAgIEB0ZCBjbGFzczogJ21lc3NhZ2UnLCBcIiN7ZW1vamkuZW1vamlmeSBjb21taXQubWVzc2FnZX1cIlxuICAgICAgICBAdGQgY2xhc3M6ICdoYXNoU2hvcnQnLCBcIiN7Y29tbWl0Lmhhc2hTaG9ydH1cIlxuXG4gICAgQGNvbW1pdHNMaXN0Vmlldy5hcHBlbmQoY29tbWl0Um93KVxuXG4gIHNob3dDb21taXRMb2c6IChoYXNoKSAtPlxuICAgIEdpdFNob3coQHJlcG8sIGhhc2gsIEBjdXJyZW50RmlsZSBpZiBAb25seUN1cnJlbnRGaWxlKVxuXG4gIGJyYW5jaExvZzogKEByZXBvKSAtPlxuICAgIEBza2lwQ29tbWl0cyA9IDBcbiAgICBAY29tbWl0c0xpc3RWaWV3LmVtcHR5KClcbiAgICBAb25seUN1cnJlbnRGaWxlID0gZmFsc2VcbiAgICBAY3VycmVudEZpbGUgPSBudWxsXG4gICAgQHJlbmRlckhlYWRlcigpXG4gICAgQGdldExvZygpXG5cbiAgY3VycmVudEZpbGVMb2c6IChAcmVwbywgQGN1cnJlbnRGaWxlKSAtPlxuICAgIEBvbmx5Q3VycmVudEZpbGUgPSB0cnVlXG4gICAgQHNraXBDb21taXRzID0gMFxuICAgIEBjb21taXRzTGlzdFZpZXcuZW1wdHkoKVxuICAgIEByZW5kZXJIZWFkZXIoKVxuICAgIEBnZXRMb2coKVxuXG4gIGdldExvZzogLT5cbiAgICByZXR1cm4gaWYgQGZpbmlzaGVkXG5cbiAgICBhcmdzID0gWydsb2cnLCBcIi0tcHJldHR5PSVoO3wlSDt8JWFOO3wlYUU7fCVzO3wlYWlfLjsuX1wiLCBcIi0je251bWJlck9mQ29tbWl0c1RvU2hvdygpfVwiLCAnLS1za2lwPScgKyBAc2tpcENvbW1pdHNdXG4gICAgYXJncy5wdXNoIEBjdXJyZW50RmlsZSBpZiBAb25seUN1cnJlbnRGaWxlIGFuZCBAY3VycmVudEZpbGU/XG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgPT4gQHBhcnNlRGF0YSBkYXRhXG5cbiAgc2VsZWN0Rmlyc3RSZXN1bHQ6IC0+XG4gICAgQHNlbGVjdFJlc3VsdChAZmluZCgnLmNvbW1pdC1yb3c6Zmlyc3QnKSlcbiAgICBAc2Nyb2xsVG9Ub3AoKVxuXG4gIHNlbGVjdExhc3RSZXN1bHQ6IC0+XG4gICAgQHNlbGVjdFJlc3VsdChAZmluZCgnLmNvbW1pdC1yb3c6bGFzdCcpKVxuICAgIEBzY3JvbGxUb0JvdHRvbSgpXG5cbiAgc2VsZWN0TmV4dFJlc3VsdDogKHNraXAgPSAxKSAtPlxuICAgIHNlbGVjdGVkVmlldyA9IEBmaW5kKCcuc2VsZWN0ZWQnKVxuICAgIHJldHVybiBAc2VsZWN0Rmlyc3RSZXN1bHQoKSBpZiBzZWxlY3RlZFZpZXcubGVuZ3RoIDwgMVxuICAgIG5leHRWaWV3ID0gQGdldE5leHRSZXN1bHQoc2VsZWN0ZWRWaWV3LCBza2lwKVxuXG4gICAgQHNlbGVjdFJlc3VsdChuZXh0VmlldylcbiAgICBAc2Nyb2xsVG8obmV4dFZpZXcpXG5cbiAgc2VsZWN0UHJldmlvdXNSZXN1bHQ6IChza2lwID0gMSkgLT5cbiAgICBzZWxlY3RlZFZpZXcgPSBAZmluZCgnLnNlbGVjdGVkJylcbiAgICByZXR1cm4gQHNlbGVjdEZpcnN0UmVzdWx0KCkgaWYgc2VsZWN0ZWRWaWV3Lmxlbmd0aCA8IDFcbiAgICBwcmV2VmlldyA9IEBnZXRQcmV2aW91c1Jlc3VsdChzZWxlY3RlZFZpZXcsIHNraXApXG5cbiAgICBAc2VsZWN0UmVzdWx0KHByZXZWaWV3KVxuICAgIEBzY3JvbGxUbyhwcmV2VmlldylcblxuICBnZXROZXh0UmVzdWx0OiAoZWxlbWVudCwgc2tpcCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIGVsZW1lbnQ/Lmxlbmd0aFxuICAgIGl0ZW1zID0gQGZpbmQoJy5jb21taXQtcm93JylcbiAgICBpdGVtSW5kZXggPSBpdGVtcy5pbmRleChlbGVtZW50KVxuICAgICQoaXRlbXNbTWF0aC5taW4oaXRlbUluZGV4ICsgc2tpcCwgaXRlbXMubGVuZ3RoIC0gMSldKVxuXG4gIGdldFByZXZpb3VzUmVzdWx0OiAoZWxlbWVudCwgc2tpcCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIGVsZW1lbnQ/Lmxlbmd0aFxuICAgIGl0ZW1zID0gQGZpbmQoJy5jb21taXQtcm93JylcbiAgICBpdGVtSW5kZXggPSBpdGVtcy5pbmRleChlbGVtZW50KVxuICAgICQoaXRlbXNbTWF0aC5tYXgoaXRlbUluZGV4IC0gc2tpcCwgMCldKVxuXG4gIHNlbGVjdFJlc3VsdDogKHJlc3VsdFZpZXcpIC0+XG4gICAgcmV0dXJuIHVubGVzcyByZXN1bHRWaWV3Py5sZW5ndGhcbiAgICBAZmluZCgnLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJylcbiAgICByZXN1bHRWaWV3LmFkZENsYXNzKCdzZWxlY3RlZCcpXG5cbiAgc2Nyb2xsVG86IChlbGVtZW50KSAtPlxuICAgIHJldHVybiB1bmxlc3MgZWxlbWVudD8ubGVuZ3RoXG4gICAgdG9wID0gQHNjcm9sbFRvcCgpICsgZWxlbWVudC5vZmZzZXQoKS50b3AgLSBAb2Zmc2V0KCkudG9wXG4gICAgYm90dG9tID0gdG9wICsgZWxlbWVudC5vdXRlckhlaWdodCgpXG5cbiAgICBAc2Nyb2xsQm90dG9tKGJvdHRvbSkgaWYgYm90dG9tID4gQHNjcm9sbEJvdHRvbSgpXG4gICAgQHNjcm9sbFRvcCh0b3ApIGlmIHRvcCA8IEBzY3JvbGxUb3AoKVxuIl19
