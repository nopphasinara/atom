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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvbG9nLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDBHQUFBO0lBQUE7OztFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVI7O0VBQ2Qsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSOztFQUNwQixNQUFpQixPQUFBLENBQVEsc0JBQVIsQ0FBakIsRUFBQyxTQUFELEVBQUksYUFBSixFQUFTOztFQUNULENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osS0FBQSxHQUFRLE9BQUEsQ0FBUSxZQUFSOztFQUNSLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSOztFQUVWLHFCQUFBLEdBQXdCLFNBQUE7V0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUNBQWhCO0VBQUg7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxjQUFQO1FBQXVCLFFBQUEsRUFBVSxDQUFDLENBQWxDO09BQUwsRUFBMEMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3hDLEtBQUMsQ0FBQSxLQUFELENBQU87WUFBQSxFQUFBLEVBQUksa0JBQUo7WUFBd0IsTUFBQSxFQUFRLGlCQUFoQztXQUFQO2lCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFdBQVA7V0FBTCxFQUF5QixTQUFBO21CQUN2QixLQUFDLENBQUEsQ0FBRCxDQUFHO2NBQUEsRUFBQSxFQUFJLFdBQUo7YUFBSCxFQUFvQixXQUFwQjtVQUR1QixDQUF6QjtRQUZ3QztNQUFB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QUFjLE9BQU8sQ0FBRSxnQkFBdkI7QUFBQSxlQUFBOztNQUNBLEdBQUEsR0FBTSxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUEsR0FBZSxPQUFPLENBQUMsTUFBUixDQUFBLENBQWdCLENBQUMsR0FBaEMsR0FBc0MsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUM7TUFDdEQsTUFBQSxHQUFTLEdBQUEsR0FBTSxPQUFPLENBQUMsV0FBUixDQUFBO01BRWYsSUFBeUIsTUFBQSxHQUFTLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBbEM7UUFBQSxJQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFBQTs7TUFDQSxJQUFtQixHQUFBLEdBQU0sSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUF6QjtlQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsR0FBWCxFQUFBOztJQU5ROzs7O0tBekpjO0FBWDFCIiwic291cmNlc0NvbnRlbnQiOlsie0Rpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbntCdWZmZXJlZFByb2Nlc3N9ID0gcmVxdWlyZSAnYXRvbSdcbnskLCAkJCQsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuZW1vamkgPSByZXF1aXJlICdub2RlLWVtb2ppJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuR2l0U2hvdyA9IHJlcXVpcmUgJy4uL21vZGVscy9naXQtc2hvdydcblxubnVtYmVyT2ZDb21taXRzVG9TaG93ID0gLT4gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5sb2dzLm51bWJlck9mQ29tbWl0c1RvU2hvdycpXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIExvZ0xpc3RWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiAnZ2l0LXBsdXMtbG9nJywgdGFiaW5kZXg6IC0xLCA9PlxuICAgICAgQHRhYmxlIGlkOiAnZ2l0LXBsdXMtY29tbWl0cycsIG91dGxldDogJ2NvbW1pdHNMaXN0VmlldydcbiAgICAgIEBkaXYgY2xhc3M6ICdzaG93LW1vcmUnLCA9PlxuICAgICAgICBAYSBpZDogJ3Nob3ctbW9yZScsICdTaG93IE1vcmUnXG5cbiAgZ2V0VVJJOiAtPiAnYXRvbTovL2dpdC1wbHVzOmxvZydcblxuICBnZXRUaXRsZTogLT4gJ2dpdC1wbHVzOiBMb2cnXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBAc2tpcENvbW1pdHMgPSAwXG4gICAgQGZpbmlzaGVkID0gZmFsc2VcbiAgICBsb2FkTW9yZSA9IF8uZGVib3VuY2UoID0+XG4gICAgICBAZ2V0TG9nKCkgaWYgQHByb3AoJ3Njcm9sbEhlaWdodCcpIC0gQHNjcm9sbFRvcCgpIC0gQGhlaWdodCgpIDwgMjBcbiAgICAsIDUwKVxuICAgIEBvbiAnY2xpY2snLCAnLmNvbW1pdC1yb3cnLCAoe2N1cnJlbnRUYXJnZXR9KSA9PlxuICAgICAgQHNob3dDb21taXRMb2cgY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hhc2gnKVxuICAgIEBvbiAnY2xpY2snLCAnI3Nob3ctbW9yZScsIGxvYWRNb3JlXG4gICAgQHNjcm9sbChsb2FkTW9yZSlcblxuICBhdHRhY2hlZDogLT5cbiAgICBAY29tbWFuZFN1YnNjcmlwdGlvbiA9IGF0b20uY29tbWFuZHMuYWRkIEBlbGVtZW50LFxuICAgICAgJ2NvcmU6bW92ZS1kb3duJzogPT4gQHNlbGVjdE5leHRSZXN1bHQoKVxuICAgICAgJ2NvcmU6bW92ZS11cCc6ID0+IEBzZWxlY3RQcmV2aW91c1Jlc3VsdCgpXG4gICAgICAnY29yZTpwYWdlLXVwJzogPT4gQHNlbGVjdFByZXZpb3VzUmVzdWx0KDEwKVxuICAgICAgJ2NvcmU6cGFnZS1kb3duJzogPT4gQHNlbGVjdE5leHRSZXN1bHQoMTApXG4gICAgICAnY29yZTptb3ZlLXRvLXRvcCc6ID0+XG4gICAgICAgIEBzZWxlY3RGaXJzdFJlc3VsdCgpXG4gICAgICAnY29yZTptb3ZlLXRvLWJvdHRvbSc6ID0+XG4gICAgICAgIEBzZWxlY3RMYXN0UmVzdWx0KClcbiAgICAgICdjb3JlOmNvbmZpcm0nOiA9PlxuICAgICAgICBoYXNoID0gQGZpbmQoJy5zZWxlY3RlZCcpLmF0dHIoJ2hhc2gnKVxuICAgICAgICBAc2hvd0NvbW1pdExvZyBoYXNoIGlmIGhhc2hcbiAgICAgICAgZmFsc2VcblxuICBkZXRhY2hlZDogLT5cbiAgICBAY29tbWFuZFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBAY29tbWFuZFN1YnNjcmlwdGlvbiA9IG51bGxcblxuICBwYXJzZURhdGE6IChkYXRhKSAtPlxuICAgIGlmIGRhdGEubGVuZ3RoIDwgMVxuICAgICAgQGZpbmlzaGVkID0gdHJ1ZVxuICAgICAgcmV0dXJuXG5cbiAgICBzZXBhcmF0b3IgPSAnO3wnXG4gICAgbmV3bGluZSA9ICdfLjsuXydcbiAgICBkYXRhID0gZGF0YS5zdWJzdHJpbmcoMCwgZGF0YS5sZW5ndGggLSBuZXdsaW5lLmxlbmd0aCAtIDEpXG5cbiAgICBjb21taXRzID0gZGF0YS5zcGxpdChuZXdsaW5lKS5tYXAgKGxpbmUpIC0+XG4gICAgICBpZiBsaW5lLnRyaW0oKSBpc250ICcnXG4gICAgICAgIHRtcERhdGEgPSBsaW5lLnRyaW0oKS5zcGxpdChzZXBhcmF0b3IpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaGFzaFNob3J0OiB0bXBEYXRhWzBdXG4gICAgICAgICAgaGFzaDogdG1wRGF0YVsxXVxuICAgICAgICAgIGF1dGhvcjogdG1wRGF0YVsyXVxuICAgICAgICAgIGVtYWlsOiB0bXBEYXRhWzNdXG4gICAgICAgICAgbWVzc2FnZTogdG1wRGF0YVs0XVxuICAgICAgICAgIGRhdGU6IHRtcERhdGFbNV1cbiAgICAgICAgfVxuXG4gICAgQHJlbmRlckxvZyBjb21taXRzXG5cbiAgcmVuZGVySGVhZGVyOiAtPlxuICAgIGhlYWRlclJvdyA9ICQkJCAtPlxuICAgICAgQHRyIGNsYXNzOiAnY29tbWl0LWhlYWRlcicsID0+XG4gICAgICAgIEB0ZCAnRGF0ZSdcbiAgICAgICAgQHRkICdNZXNzYWdlJ1xuICAgICAgICBAdGQgY2xhc3M6ICdoYXNoU2hvcnQnLCAnU2hvcnQgSGFzaCdcblxuICAgIEBjb21taXRzTGlzdFZpZXcuYXBwZW5kKGhlYWRlclJvdylcblxuICByZW5kZXJMb2c6IChjb21taXRzKSAtPlxuICAgIGNvbW1pdHMuZm9yRWFjaCAoY29tbWl0KSA9PiBAcmVuZGVyQ29tbWl0IGNvbW1pdFxuICAgIEBza2lwQ29tbWl0cyArPSBudW1iZXJPZkNvbW1pdHNUb1Nob3coKVxuXG4gIHJlbmRlckNvbW1pdDogKGNvbW1pdCkgLT5cbiAgICBjb21taXRSb3cgPSAkJCQgLT5cbiAgICAgIEB0ciBjbGFzczogJ2NvbW1pdC1yb3cnLCBoYXNoOiBcIiN7Y29tbWl0Lmhhc2h9XCIsID0+XG4gICAgICAgIEB0ZCBjbGFzczogJ2RhdGUnLCBcIiN7Y29tbWl0LmRhdGV9IGJ5ICN7Y29tbWl0LmF1dGhvcn1cIlxuICAgICAgICBAdGQgY2xhc3M6ICdtZXNzYWdlJywgXCIje2Vtb2ppLmVtb2ppZnkgY29tbWl0Lm1lc3NhZ2V9XCJcbiAgICAgICAgQHRkIGNsYXNzOiAnaGFzaFNob3J0JywgXCIje2NvbW1pdC5oYXNoU2hvcnR9XCJcblxuICAgIEBjb21taXRzTGlzdFZpZXcuYXBwZW5kKGNvbW1pdFJvdylcblxuICBzaG93Q29tbWl0TG9nOiAoaGFzaCkgLT5cbiAgICBHaXRTaG93KEByZXBvLCBoYXNoLCBAY3VycmVudEZpbGUgaWYgQG9ubHlDdXJyZW50RmlsZSlcblxuICBicmFuY2hMb2c6IChAcmVwbykgLT5cbiAgICBAc2tpcENvbW1pdHMgPSAwXG4gICAgQGNvbW1pdHNMaXN0Vmlldy5lbXB0eSgpXG4gICAgQG9ubHlDdXJyZW50RmlsZSA9IGZhbHNlXG4gICAgQGN1cnJlbnRGaWxlID0gbnVsbFxuICAgIEByZW5kZXJIZWFkZXIoKVxuICAgIEBnZXRMb2coKVxuXG4gIGN1cnJlbnRGaWxlTG9nOiAoQHJlcG8sIEBjdXJyZW50RmlsZSkgLT5cbiAgICBAb25seUN1cnJlbnRGaWxlID0gdHJ1ZVxuICAgIEBza2lwQ29tbWl0cyA9IDBcbiAgICBAY29tbWl0c0xpc3RWaWV3LmVtcHR5KClcbiAgICBAcmVuZGVySGVhZGVyKClcbiAgICBAZ2V0TG9nKClcblxuICBnZXRMb2c6IC0+XG4gICAgcmV0dXJuIGlmIEBmaW5pc2hlZFxuXG4gICAgYXJncyA9IFsnbG9nJywgXCItLXByZXR0eT0laDt8JUg7fCVhTjt8JWFFO3wlczt8JWFpXy47Ll9cIiwgXCItI3tudW1iZXJPZkNvbW1pdHNUb1Nob3coKX1cIiwgJy0tc2tpcD0nICsgQHNraXBDb21taXRzXVxuICAgIGFyZ3MucHVzaCBAY3VycmVudEZpbGUgaWYgQG9ubHlDdXJyZW50RmlsZSBhbmQgQGN1cnJlbnRGaWxlP1xuICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpID0+IEBwYXJzZURhdGEgZGF0YVxuXG4gIHNlbGVjdEZpcnN0UmVzdWx0OiAtPlxuICAgIEBzZWxlY3RSZXN1bHQoQGZpbmQoJy5jb21taXQtcm93OmZpcnN0JykpXG4gICAgQHNjcm9sbFRvVG9wKClcblxuICBzZWxlY3RMYXN0UmVzdWx0OiAtPlxuICAgIEBzZWxlY3RSZXN1bHQoQGZpbmQoJy5jb21taXQtcm93Omxhc3QnKSlcbiAgICBAc2Nyb2xsVG9Cb3R0b20oKVxuXG4gIHNlbGVjdE5leHRSZXN1bHQ6IChza2lwID0gMSkgLT5cbiAgICBzZWxlY3RlZFZpZXcgPSBAZmluZCgnLnNlbGVjdGVkJylcbiAgICByZXR1cm4gQHNlbGVjdEZpcnN0UmVzdWx0KCkgaWYgc2VsZWN0ZWRWaWV3Lmxlbmd0aCA8IDFcbiAgICBuZXh0VmlldyA9IEBnZXROZXh0UmVzdWx0KHNlbGVjdGVkVmlldywgc2tpcClcblxuICAgIEBzZWxlY3RSZXN1bHQobmV4dFZpZXcpXG4gICAgQHNjcm9sbFRvKG5leHRWaWV3KVxuXG4gIHNlbGVjdFByZXZpb3VzUmVzdWx0OiAoc2tpcCA9IDEpIC0+XG4gICAgc2VsZWN0ZWRWaWV3ID0gQGZpbmQoJy5zZWxlY3RlZCcpXG4gICAgcmV0dXJuIEBzZWxlY3RGaXJzdFJlc3VsdCgpIGlmIHNlbGVjdGVkVmlldy5sZW5ndGggPCAxXG4gICAgcHJldlZpZXcgPSBAZ2V0UHJldmlvdXNSZXN1bHQoc2VsZWN0ZWRWaWV3LCBza2lwKVxuXG4gICAgQHNlbGVjdFJlc3VsdChwcmV2VmlldylcbiAgICBAc2Nyb2xsVG8ocHJldlZpZXcpXG5cbiAgZ2V0TmV4dFJlc3VsdDogKGVsZW1lbnQsIHNraXApIC0+XG4gICAgcmV0dXJuIHVubGVzcyBlbGVtZW50Py5sZW5ndGhcbiAgICBpdGVtcyA9IEBmaW5kKCcuY29tbWl0LXJvdycpXG4gICAgaXRlbUluZGV4ID0gaXRlbXMuaW5kZXgoZWxlbWVudClcbiAgICAkKGl0ZW1zW01hdGgubWluKGl0ZW1JbmRleCArIHNraXAsIGl0ZW1zLmxlbmd0aCAtIDEpXSlcblxuICBnZXRQcmV2aW91c1Jlc3VsdDogKGVsZW1lbnQsIHNraXApIC0+XG4gICAgcmV0dXJuIHVubGVzcyBlbGVtZW50Py5sZW5ndGhcbiAgICBpdGVtcyA9IEBmaW5kKCcuY29tbWl0LXJvdycpXG4gICAgaXRlbUluZGV4ID0gaXRlbXMuaW5kZXgoZWxlbWVudClcbiAgICAkKGl0ZW1zW01hdGgubWF4KGl0ZW1JbmRleCAtIHNraXAsIDApXSlcblxuICBzZWxlY3RSZXN1bHQ6IChyZXN1bHRWaWV3KSAtPlxuICAgIHJldHVybiB1bmxlc3MgcmVzdWx0Vmlldz8ubGVuZ3RoXG4gICAgQGZpbmQoJy5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpXG4gICAgcmVzdWx0Vmlldy5hZGRDbGFzcygnc2VsZWN0ZWQnKVxuXG4gIHNjcm9sbFRvOiAoZWxlbWVudCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIGVsZW1lbnQ/Lmxlbmd0aFxuICAgIHRvcCA9IEBzY3JvbGxUb3AoKSArIGVsZW1lbnQub2Zmc2V0KCkudG9wIC0gQG9mZnNldCgpLnRvcFxuICAgIGJvdHRvbSA9IHRvcCArIGVsZW1lbnQub3V0ZXJIZWlnaHQoKVxuXG4gICAgQHNjcm9sbEJvdHRvbShib3R0b20pIGlmIGJvdHRvbSA+IEBzY3JvbGxCb3R0b20oKVxuICAgIEBzY3JvbGxUb3AodG9wKSBpZiB0b3AgPCBAc2Nyb2xsVG9wKClcbiJdfQ==
