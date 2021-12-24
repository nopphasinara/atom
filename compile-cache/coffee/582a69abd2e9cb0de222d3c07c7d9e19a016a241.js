(function() {
  var $, $$, AtomMinifyView, File, View, fs, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, View = ref.View;

  File = require('./helper/file');

  fs = require('fs');

  module.exports = AtomMinifyView = (function(superClass) {
    extend(AtomMinifyView, superClass);

    AtomMinifyView.captionPrefix = 'Minify: ';

    AtomMinifyView.clickableLinksCounter = 0;

    AtomMinifyView.content = function() {
      return this.div({
        "class": 'atom-minify atom-panel panel-bottom'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'inset-panel'
          }, function() {
            _this.div({
              outlet: 'panelHeading',
              "class": 'panel-heading no-border'
            }, function() {
              _this.span({
                outlet: 'panelHeaderCaption',
                "class": 'header-caption'
              });
              _this.span({
                outlet: 'panelLoading',
                "class": 'inline-block loading loading-spinner-tiny hide'
              });
              return _this.div({
                outlet: 'panelRightTopOptions',
                "class": 'inline-block pull-right right-top-options'
              }, function() {
                return _this.button({
                  outlet: 'panelClose',
                  "class": 'btn btn-close',
                  click: 'hidePanel'
                }, 'Close');
              });
            });
            return _this.div({
              outlet: 'panelBody',
              "class": 'panel-body padded hide'
            });
          });
        };
      })(this));
    };

    function AtomMinifyView() {
      var args, options;
      options = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      AtomMinifyView.__super__.constructor.call(this, args);
      this.options = options;
      this.panel = atom.workspace.addBottomPanel({
        item: this,
        visible: false
      });
    }

    AtomMinifyView.prototype.initialize = function(serializeState) {};

    AtomMinifyView.prototype.destroy = function() {
      clearTimeout(this.automaticHidePanelTimeout);
      this.panel.destroy();
      return this.detach();
    };

    AtomMinifyView.prototype.updateOptions = function(options) {
      return this.options = options;
    };

    AtomMinifyView.prototype.startMinification = function(args) {
      this.hasError = false;
      if (this.options.showStartMinificationNotification) {
        if (args.isMinifyDirect) {
          this.showInfoNotification('Direct minification started');
        } else {
          this.showInfoNotification('Minification started', args.inputFilename);
        }
      }
      if (this.options.showPanel) {
        this.showPanel();
        if (this.options.showStartMinificationNotification) {
          if (args.isMinifyToFile) {
            return this.addText(args.inputFilename, 'terminal', 'info', (function(_this) {
              return function(evt) {
                return _this.openFile(args.inputFilename, evt.target);
              };
            })(this));
          } else {
            return this.addText('Direct minification started', 'terminal', 'info');
          }
        }
      }
    };

    AtomMinifyView.prototype.warning = function(args) {
      if (this.options.showWarningNotification) {
        this.showWarningNotification('Warning', args.message);
      }
      if (this.options.showPanel) {
        this.showPanel();
        if (args.inputFilename) {
          return this.addText(args.message, 'issue-opened', 'warning', (function(_this) {
            return function(evt) {
              return _this.openFile(args.inputFilename, evt.target);
            };
          })(this));
        } else {
          return this.addText(args.message, 'issue-opened', 'warning');
        }
      }
    };

    AtomMinifyView.prototype.successfullMinification = function(args) {
      var details, message, saving, showSavingInfo, successMessage;
      saving = this.obtainSaving(args);
      successMessage = "Successfully minified";
      if (this.options.showSavingInfo) {
        successMessage = "Minification saved <strong>" + saving.percentage + "%</strong> in " + args.statistics.duration + "ms";
        successMessage += " / before: " + saving.before + " " + saving.unit;
        successMessage += ", after:  " + saving.after + " " + saving.unit;
      }
      if (args.isMinifyDirect) {
        details = "Compressor: " + args.minifierName;
      } else {
        details = args.outputFilename + ("\n(Compressor: " + args.minifierName + ")");
      }
      this.showSuccessNotification(successMessage, details);
      if (this.options.showPanel) {
        this.showPanel();
        showSavingInfo = this.options.showSavingInfo;
        message = $$(function() {
          return this.div({
            "class": 'success-text-wrapper'
          }, (function(_this) {
            return function() {
              _this.p({
                "class": 'icon icon-check text-success'
              }, function() {
                if (args.isMinifyToFile) {
                  return _this.span({
                    "class": ''
                  }, args.outputFilename);
                } else {
                  return _this.span({
                    "class": ''
                  }, 'Successfully minified!');
                }
              });
              if (showSavingInfo) {
                return _this.p({
                  "class": 'success-details text-info'
                }, function() {
                  _this.span({
                    "class": 'success-saved-percentage'
                  }, function() {
                    _this.span('Saved: ');
                    return _this.span({
                      "class": 'value'
                    }, saving.percentage + '%');
                  });
                  _this.span({
                    "class": 'success-duration'
                  }, function() {
                    _this.span('Duration: ');
                    return _this.span({
                      "class": 'value'
                    }, args.statistics.duration + ' ms');
                  });
                  _this.span({
                    "class": 'success-size-before'
                  }, function() {
                    _this.span('Size before: ');
                    return _this.span({
                      "class": 'value'
                    }, saving.before + ' ' + saving.unit);
                  });
                  _this.span({
                    "class": 'success-size-after'
                  }, function() {
                    _this.span('Size after: ');
                    return _this.span({
                      "class": 'value'
                    }, saving.after + ' ' + saving.unit);
                  });
                  return _this.span({
                    "class": 'success-minifier'
                  }, function() {
                    _this.span('Minifier: ');
                    return _this.span({
                      "class": 'value'
                    }, args.minifierName);
                  });
                });
              }
            };
          })(this));
        });
        return this.addText(message, 'check', 'success', (function(_this) {
          return function(evt) {
            return _this.openFile(args.outputFilename, evt.target);
          };
        })(this));
      }
    };

    AtomMinifyView.prototype.erroneousMinification = function(args) {
      var caption;
      this.hasError = true;
      caption = 'Minification error' + (args.minifierName ? ' — ' + args.minifierName : '');
      this.showErrorNotification(caption, args.message);
      if (this.options.showPanel) {
        this.showPanel();
        return this.addText(args.message, 'alert', 'error');
      }
    };

    AtomMinifyView.prototype.obtainSaving = function(args) {
      var saving, tmpSaving;
      saving = {
        percentage: Math.round((args.statistics.before - args.statistics.after) / args.statistics.before * 100),
        before: args.statistics.before,
        after: args.statistics.after,
        unit: args.isMinifyToFile ? 'Byte' : 'chars'
      };
      if (args.isMinifyToFile) {
        tmpSaving = File.fileSizeToReadable([saving.before, saving.after]);
        saving.before = tmpSaving.size[0];
        saving.after = tmpSaving.size[1];
        saving.unit = tmpSaving.unit;
      }
      return saving;
    };

    AtomMinifyView.prototype.finished = function(args) {
      if (this.hasError) {
        this.setCaption('Minification error');
        if (this.options.autoHidePanelOnError) {
          this.hidePanel(true);
        }
      } else {
        this.setCaption('Successfully minified');
        if (this.options.autoHidePanelOnSuccess) {
          this.hidePanel(true);
        }
      }
      this.hideThrobber();
      return this.showRightTopOptions();
    };

    AtomMinifyView.prototype.openFile = function(filename, targetElement) {
      if (targetElement == null) {
        targetElement = null;
      }
      return fs.exists(filename, (function(_this) {
        return function(exists) {
          var target;
          if (exists) {
            return atom.workspace.open(filename);
          } else if (targetElement) {
            target = $(targetElement);
            if (!target.is('p.clickable')) {
              target = target.parent();
            }
            return target.addClass('target-file-does-not-exist').removeClass('clickable').append($('<span>File does not exist!</span>').addClass('hint')).off('click').children(':first').removeClass('text-success text-warning text-info');
          }
        };
      })(this));
    };

    AtomMinifyView.prototype.showInfoNotification = function(title, message) {
      if (this.options.showInfoNotification) {
        return atom.notifications.addInfo(title, {
          detail: message,
          dismissable: !this.options.autoHideInfoNotification
        });
      }
    };

    AtomMinifyView.prototype.showSuccessNotification = function(title, message) {
      if (this.options.showSuccessNotification) {
        return atom.notifications.addSuccess(title, {
          detail: message,
          dismissable: !this.options.autoHideSuccessNotification
        });
      }
    };

    AtomMinifyView.prototype.showWarningNotification = function(title, message) {
      if (this.options.showWarningNotification) {
        return atom.notifications.addWarning(title, {
          detail: message,
          dismissable: !this.options.autoWarningInfoNotification
        });
      }
    };

    AtomMinifyView.prototype.showErrorNotification = function(title, message) {
      if (this.options.showErrorNotification) {
        return atom.notifications.addError(title, {
          detail: message,
          dismissable: !this.options.autoHideErrorNotification
        });
      }
    };

    AtomMinifyView.prototype.resetPanel = function() {
      this.setCaption('Processing...');
      this.showThrobber();
      this.hideRightTopOptions();
      return this.panelBody.addClass('hide').empty();
    };

    AtomMinifyView.prototype.showPanel = function(reset) {
      if (reset == null) {
        reset = false;
      }
      clearTimeout(this.automaticHidePanelTimeout);
      if (reset) {
        this.resetPanel();
      }
      return this.panel.show();
    };

    AtomMinifyView.prototype.hidePanel = function(withDelay, reset) {
      if (withDelay == null) {
        withDelay = false;
      }
      if (reset == null) {
        reset = false;
      }
      clearTimeout(this.automaticHidePanelTimeout);
      if (withDelay === true) {
        return this.automaticHidePanelTimeout = setTimeout((function(_this) {
          return function() {
            _this.hideThrobber();
            _this.panel.hide();
            if (reset) {
              return _this.resetPanel();
            }
          };
        })(this), this.options.autoHidePanelDelay);
      } else {
        this.hideThrobber();
        this.panel.hide();
        if (reset) {
          return this.resetPanel();
        }
      }
    };

    AtomMinifyView.prototype.setCaption = function(text) {
      return this.panelHeaderCaption.html(AtomMinifyView.captionPrefix + text);
    };

    AtomMinifyView.prototype.addText = function(text, icon, textClass, clickCallback) {
      var clickCounter, spanClass, wrapper, wrapperClass;
      clickCounter = AtomMinifyView.clickableLinksCounter++;
      wrapperClass = clickCallback ? "clickable clickable-" + clickCounter : '';
      spanClass = '';
      if (icon) {
        spanClass = spanClass + (spanClass !== '' ? ' ' : '') + ("icon icon-" + icon);
      }
      if (textClass) {
        spanClass = spanClass + (spanClass !== '' ? ' ' : '') + ("text-" + textClass);
      }
      if (typeof text === 'object') {
        wrapper = $$(function() {
          return this.div({
            "class": wrapperClass
          });
        });
        wrapper.append(text);
        this.panelBody.removeClass('hide').append(wrapper);
      } else {
        this.panelBody.removeClass('hide').append($$(function() {
          return this.p({
            "class": wrapperClass
          }, (function(_this) {
            return function() {
              return _this.span({
                "class": spanClass
              }, text);
            };
          })(this));
        }));
      }
      if (clickCallback) {
        return this.find(".clickable-" + clickCounter).on('click', (function(_this) {
          return function(evt) {
            return clickCallback(evt);
          };
        })(this));
      }
    };

    AtomMinifyView.prototype.hideRightTopOptions = function() {
      return this.panelRightTopOptions.addClass('hide');
    };

    AtomMinifyView.prototype.showRightTopOptions = function() {
      return this.panelRightTopOptions.removeClass('hide');
    };

    AtomMinifyView.prototype.hideThrobber = function() {
      return this.panelLoading.addClass('hide');
    };

    AtomMinifyView.prototype.showThrobber = function() {
      return this.panelLoading.removeClass('hide');
    };

    return AtomMinifyView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2F0b20tbWluaWZ5L2xpYi9hdG9tLW1pbmlmeS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMENBQUE7SUFBQTs7OztFQUFBLE1BQWdCLE9BQUEsQ0FBUSxzQkFBUixDQUFoQixFQUFDLFNBQUQsRUFBSSxXQUFKLEVBQVE7O0VBRVIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSOztFQUVQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFHTCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFFRixjQUFDLENBQUEsYUFBRCxHQUFpQjs7SUFDakIsY0FBQyxDQUFBLHFCQUFELEdBQXlCOztJQUd6QixjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDTixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxxQ0FBUDtPQUFMLEVBQW1ELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDL0MsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sYUFBUDtXQUFMLEVBQTJCLFNBQUE7WUFDdkIsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLE1BQUEsRUFBUSxjQUFSO2NBQXdCLENBQUEsS0FBQSxDQUFBLEVBQU8seUJBQS9CO2FBQUwsRUFBK0QsU0FBQTtjQUMzRCxLQUFDLENBQUEsSUFBRCxDQUNJO2dCQUFBLE1BQUEsRUFBUSxvQkFBUjtnQkFDQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGdCQURQO2VBREo7Y0FHQSxLQUFDLENBQUEsSUFBRCxDQUNJO2dCQUFBLE1BQUEsRUFBUSxjQUFSO2dCQUNBLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0RBRFA7ZUFESjtxQkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO2dCQUFBLE1BQUEsRUFBUSxzQkFBUjtnQkFB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O1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtRQURxQyxDQUFILENBQXRDLEVBTko7O01BVUEsSUFBRyxhQUFIO2VBQ0ksSUFBQyxDQUFBLElBQUQsQ0FBTSxhQUFBLEdBQWMsWUFBcEIsQ0FBbUMsQ0FBQyxFQUFwQyxDQUF1QyxPQUF2QyxFQUFnRCxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEdBQUQ7bUJBQVMsYUFBQSxDQUFjLEdBQWQ7VUFBVDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsRUFESjs7SUFwQks7OzZCQXdCVCxtQkFBQSxHQUFxQixTQUFBO2FBQ2pCLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxRQUF0QixDQUErQixNQUEvQjtJQURpQjs7NkJBSXJCLG1CQUFBLEdBQXFCLFNBQUE7YUFDakIsSUFBQyxDQUFBLG9CQUFvQixDQUFDLFdBQXRCLENBQWtDLE1BQWxDO0lBRGlCOzs2QkFJckIsWUFBQSxHQUFjLFNBQUE7YUFDVixJQUFDLENBQUEsWUFBWSxDQUFDLFFBQWQsQ0FBdUIsTUFBdkI7SUFEVTs7NkJBSWQsWUFBQSxHQUFjLFNBQUE7YUFDVixJQUFDLENBQUEsWUFBWSxDQUFDLFdBQWQsQ0FBMEIsTUFBMUI7SUFEVTs7OztLQWxTVztBQVI3QiIsInNvdXJjZXNDb250ZW50IjpbInskLCAkJCwgVmlld30gPSByZXF1aXJlKCdhdG9tLXNwYWNlLXBlbi12aWV3cycpXG5cbkZpbGUgPSByZXF1aXJlKCcuL2hlbHBlci9maWxlJylcblxuZnMgPSByZXF1aXJlKCdmcycpXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQXRvbU1pbmlmeVZpZXcgZXh0ZW5kcyBWaWV3XG5cbiAgICBAY2FwdGlvblByZWZpeCA9ICdNaW5pZnk6ICdcbiAgICBAY2xpY2thYmxlTGlua3NDb3VudGVyID0gMFxuXG5cbiAgICBAY29udGVudDogLT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2F0b20tbWluaWZ5IGF0b20tcGFuZWwgcGFuZWwtYm90dG9tJywgPT5cbiAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdpbnNldC1wYW5lbCcsID0+XG4gICAgICAgICAgICAgICAgQGRpdiBvdXRsZXQ6ICdwYW5lbEhlYWRpbmcnLCBjbGFzczogJ3BhbmVsLWhlYWRpbmcgbm8tYm9yZGVyJywgPT5cbiAgICAgICAgICAgICAgICAgICAgQHNwYW5cbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxldDogJ3BhbmVsSGVhZGVyQ2FwdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnaGVhZGVyLWNhcHRpb24nXG4gICAgICAgICAgICAgICAgICAgIEBzcGFuXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6ICdwYW5lbExvYWRpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2lubGluZS1ibG9jayBsb2FkaW5nIGxvYWRpbmctc3Bpbm5lci10aW55IGhpZGUnXG4gICAgICAgICAgICAgICAgICAgIEBkaXYgb3V0bGV0OiAncGFuZWxSaWdodFRvcE9wdGlvbnMnLCBjbGFzczogJ2lubGluZS1ibG9jayBwdWxsLXJpZ2h0IHJpZ2h0LXRvcC1vcHRpb25zJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIEBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6ICdwYW5lbENsb3NlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnYnRuIGJ0bi1jbG9zZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogJ2hpZGVQYW5lbCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQ2xvc2UnXG4gICAgICAgICAgICAgICAgQGRpdlxuICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6ICdwYW5lbEJvZHknXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAncGFuZWwtYm9keSBwYWRkZWQgaGlkZSdcblxuXG4gICAgY29uc3RydWN0b3I6IChvcHRpb25zLCBhcmdzLi4uKSAtPlxuICAgICAgICBzdXBlcihhcmdzKVxuICAgICAgICBAb3B0aW9ucyA9IG9wdGlvbnNcbiAgICAgICAgQHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWxcbiAgICAgICAgICAgIGl0ZW06IHRoaXNcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG5cblxuICAgIGluaXRpYWxpemU6IChzZXJpYWxpemVTdGF0ZSkgLT5cblxuXG4gICAgZGVzdHJveTogLT5cbiAgICAgICAgY2xlYXJUaW1lb3V0KEBhdXRvbWF0aWNIaWRlUGFuZWxUaW1lb3V0KVxuICAgICAgICBAcGFuZWwuZGVzdHJveSgpXG4gICAgICAgIEBkZXRhY2goKVxuXG5cbiAgICB1cGRhdGVPcHRpb25zOiAob3B0aW9ucykgLT5cbiAgICAgICAgQG9wdGlvbnMgPSBvcHRpb25zXG5cblxuICAgIHN0YXJ0TWluaWZpY2F0aW9uOiAoYXJncykgLT5cbiAgICAgICAgQGhhc0Vycm9yID0gZmFsc2VcblxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93U3RhcnRNaW5pZmljYXRpb25Ob3RpZmljYXRpb25cbiAgICAgICAgICAgIGlmIGFyZ3MuaXNNaW5pZnlEaXJlY3RcbiAgICAgICAgICAgICAgICBAc2hvd0luZm9Ob3RpZmljYXRpb24oJ0RpcmVjdCBtaW5pZmljYXRpb24gc3RhcnRlZCcpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQHNob3dJbmZvTm90aWZpY2F0aW9uKCdNaW5pZmljYXRpb24gc3RhcnRlZCcsIGFyZ3MuaW5wdXRGaWxlbmFtZSlcblxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93UGFuZWxcbiAgICAgICAgICAgIEBzaG93UGFuZWwoKVxuICAgICAgICAgICAgaWYgQG9wdGlvbnMuc2hvd1N0YXJ0TWluaWZpY2F0aW9uTm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgaWYgYXJncy5pc01pbmlmeVRvRmlsZVxuICAgICAgICAgICAgICAgICAgICBAYWRkVGV4dChhcmdzLmlucHV0RmlsZW5hbWUsICd0ZXJtaW5hbCcsICdpbmZvJywgKGV2dCkgPT4gQG9wZW5GaWxlKGFyZ3MuaW5wdXRGaWxlbmFtZSwgZXZ0LnRhcmdldCkgKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGFkZFRleHQoJ0RpcmVjdCBtaW5pZmljYXRpb24gc3RhcnRlZCcsICd0ZXJtaW5hbCcsICdpbmZvJywpXG5cblxuICAgIHdhcm5pbmc6IChhcmdzKSAtPlxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93V2FybmluZ05vdGlmaWNhdGlvblxuICAgICAgICAgICAgQHNob3dXYXJuaW5nTm90aWZpY2F0aW9uKCdXYXJuaW5nJywgYXJncy5tZXNzYWdlKVxuXG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dQYW5lbFxuICAgICAgICAgICAgQHNob3dQYW5lbCgpXG4gICAgICAgICAgICBpZiBhcmdzLmlucHV0RmlsZW5hbWVcbiAgICAgICAgICAgICAgICBAYWRkVGV4dChhcmdzLm1lc3NhZ2UsICdpc3N1ZS1vcGVuZWQnLCAnd2FybmluZycsIChldnQpID0+IEBvcGVuRmlsZShhcmdzLmlucHV0RmlsZW5hbWUsIGV2dC50YXJnZXQpKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBhZGRUZXh0KGFyZ3MubWVzc2FnZSwgJ2lzc3VlLW9wZW5lZCcsICd3YXJuaW5nJylcblxuXG4gICAgc3VjY2Vzc2Z1bGxNaW5pZmljYXRpb246IChhcmdzKSAtPlxuICAgICAgICBzYXZpbmcgPSBAb2J0YWluU2F2aW5nKGFyZ3MpXG5cbiAgICAgICAgc3VjY2Vzc01lc3NhZ2UgPSBcIlN1Y2Nlc3NmdWxseSBtaW5pZmllZFwiXG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dTYXZpbmdJbmZvXG4gICAgICAgICAgICBzdWNjZXNzTWVzc2FnZSA9IFwiTWluaWZpY2F0aW9uIHNhdmVkIDxzdHJvbmc+I3tzYXZpbmcucGVyY2VudGFnZX0lPC9zdHJvbmc+IGluICN7YXJncy5zdGF0aXN0aWNzLmR1cmF0aW9ufW1zXCJcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlICs9IFwiIC8gYmVmb3JlOiAje3NhdmluZy5iZWZvcmV9ICN7c2F2aW5nLnVuaXR9XCJcbiAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlICs9IFwiLCBhZnRlcjogICN7c2F2aW5nLmFmdGVyfSAje3NhdmluZy51bml0fVwiXG4gICAgICAgIGlmIGFyZ3MuaXNNaW5pZnlEaXJlY3RcbiAgICAgICAgICAgIGRldGFpbHMgPSBcIkNvbXByZXNzb3I6ICN7YXJncy5taW5pZmllck5hbWV9XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGV0YWlscyA9IGFyZ3Mub3V0cHV0RmlsZW5hbWUgKyBcIlxcbihDb21wcmVzc29yOiAje2FyZ3MubWluaWZpZXJOYW1lfSlcIlxuICAgICAgICBAc2hvd1N1Y2Nlc3NOb3RpZmljYXRpb24oc3VjY2Vzc01lc3NhZ2UsIGRldGFpbHMpXG5cbiAgICAgICAgaWYgQG9wdGlvbnMuc2hvd1BhbmVsXG4gICAgICAgICAgICBAc2hvd1BhbmVsKClcblxuICAgICAgICAgICAgIyBXZSBoYXZlIHRvIHN0b3JlIHRoaXMgdmFsdWUgaW4gYSBsb2NhbCB2YXJpYWJsZSwgYmVhY3VzZSAkJCBtZXRob2RzIGNhbiBub3Qgc2VlIEBvcHRpb25zXG4gICAgICAgICAgICBzaG93U2F2aW5nSW5mbyA9IEBvcHRpb25zLnNob3dTYXZpbmdJbmZvXG5cbiAgICAgICAgICAgIG1lc3NhZ2UgPSAkJCAtPlxuICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzdWNjZXNzLXRleHQtd3JhcHBlcicsID0+XG4gICAgICAgICAgICAgICAgICAgIEBwIGNsYXNzOiAnaWNvbiBpY29uLWNoZWNrIHRleHQtc3VjY2VzcycsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBhcmdzLmlzTWluaWZ5VG9GaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICcnLCBhcmdzLm91dHB1dEZpbGVuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICcnLCAnU3VjY2Vzc2Z1bGx5IG1pbmlmaWVkISdcblxuICAgICAgICAgICAgICAgICAgICBpZiBzaG93U2F2aW5nSW5mb1xuICAgICAgICAgICAgICAgICAgICAgICAgQHAgY2xhc3M6ICdzdWNjZXNzLWRldGFpbHMgdGV4dC1pbmZvJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3N1Y2Nlc3Mtc2F2ZWQtcGVyY2VudGFnZScsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuICdTYXZlZDogJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3ZhbHVlJywgc2F2aW5nLnBlcmNlbnRhZ2UgKyAnJSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3N1Y2Nlc3MtZHVyYXRpb24nLCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiAnRHVyYXRpb246ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICd2YWx1ZScsIGFyZ3Muc3RhdGlzdGljcy5kdXJhdGlvbiArICcgbXMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICdzdWNjZXNzLXNpemUtYmVmb3JlJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gJ1NpemUgYmVmb3JlOiAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAndmFsdWUnLCBzYXZpbmcuYmVmb3JlICsgJyAnICsgc2F2aW5nLnVuaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3N1Y2Nlc3Mtc2l6ZS1hZnRlcicsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuICdTaXplIGFmdGVyOiAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAndmFsdWUnLCBzYXZpbmcuYWZ0ZXIgKyAnICcgKyBzYXZpbmcudW5pdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnc3VjY2Vzcy1taW5pZmllcicsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuICdNaW5pZmllcjogJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3ZhbHVlJywgYXJncy5taW5pZmllck5hbWVcblxuICAgICAgICAgICAgQGFkZFRleHQobWVzc2FnZSwgJ2NoZWNrJywgJ3N1Y2Nlc3MnLCAoZXZ0KSA9PiBAb3BlbkZpbGUoYXJncy5vdXRwdXRGaWxlbmFtZSwgZXZ0LnRhcmdldCkpXG5cblxuICAgIGVycm9uZW91c01pbmlmaWNhdGlvbjogKGFyZ3MpIC0+XG4gICAgICAgIEBoYXNFcnJvciA9IHRydWVcbiAgICAgICAgY2FwdGlvbiA9ICdNaW5pZmljYXRpb24gZXJyb3InICsgaWYgYXJncy5taW5pZmllck5hbWUgdGhlbiAnIOKAlCAnICsgYXJncy5taW5pZmllck5hbWUgZWxzZSAnJ1xuICAgICAgICBAc2hvd0Vycm9yTm90aWZpY2F0aW9uKGNhcHRpb24sIGFyZ3MubWVzc2FnZSlcblxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93UGFuZWxcbiAgICAgICAgICAgIEBzaG93UGFuZWwoKVxuXG4gICAgICAgICAgICBAYWRkVGV4dChhcmdzLm1lc3NhZ2UsICdhbGVydCcsICdlcnJvcicpXG5cblxuICAgIG9idGFpblNhdmluZzogKGFyZ3MpIC0+XG4gICAgICAgIHNhdmluZyA9XG4gICAgICAgICAgICBwZXJjZW50YWdlOiBNYXRoLnJvdW5kKChhcmdzLnN0YXRpc3RpY3MuYmVmb3JlIC0gYXJncy5zdGF0aXN0aWNzLmFmdGVyKSAvIGFyZ3Muc3RhdGlzdGljcy5iZWZvcmUgKiAxMDApXG4gICAgICAgICAgICBiZWZvcmU6IGFyZ3Muc3RhdGlzdGljcy5iZWZvcmVcbiAgICAgICAgICAgIGFmdGVyOiBhcmdzLnN0YXRpc3RpY3MuYWZ0ZXJcbiAgICAgICAgICAgIHVuaXQ6IGlmIGFyZ3MuaXNNaW5pZnlUb0ZpbGUgdGhlbiAnQnl0ZScgZWxzZSAnY2hhcnMnXG5cbiAgICAgICAgIyBJZiBtaW5pZmllZCB0byBhIGZpbGUgd2UgY2FuIHJlZHVjZSB1c2VkIHNwYWNlLCByb3VuZGVkIHRvIHR3byBkZWNpbWFsc1xuICAgICAgICBpZiBhcmdzLmlzTWluaWZ5VG9GaWxlXG4gICAgICAgICAgICB0bXBTYXZpbmcgPSBGaWxlLmZpbGVTaXplVG9SZWFkYWJsZShbc2F2aW5nLmJlZm9yZSwgc2F2aW5nLmFmdGVyXSlcbiAgICAgICAgICAgIHNhdmluZy5iZWZvcmUgPSB0bXBTYXZpbmcuc2l6ZVswXVxuICAgICAgICAgICAgc2F2aW5nLmFmdGVyID0gdG1wU2F2aW5nLnNpemVbMV1cbiAgICAgICAgICAgIHNhdmluZy51bml0ID0gdG1wU2F2aW5nLnVuaXRcblxuICAgICAgICByZXR1cm4gc2F2aW5nXG5cblxuICAgIGZpbmlzaGVkOiAoYXJncykgLT5cbiAgICAgICAgaWYgQGhhc0Vycm9yXG4gICAgICAgICAgICBAc2V0Q2FwdGlvbignTWluaWZpY2F0aW9uIGVycm9yJylcbiAgICAgICAgICAgIGlmIEBvcHRpb25zLmF1dG9IaWRlUGFuZWxPbkVycm9yXG4gICAgICAgICAgICAgICAgQGhpZGVQYW5lbCh0cnVlKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc2V0Q2FwdGlvbignU3VjY2Vzc2Z1bGx5IG1pbmlmaWVkJylcbiAgICAgICAgICAgIGlmIEBvcHRpb25zLmF1dG9IaWRlUGFuZWxPblN1Y2Nlc3NcbiAgICAgICAgICAgICAgICBAaGlkZVBhbmVsKHRydWUpXG5cbiAgICAgICAgQGhpZGVUaHJvYmJlcigpXG4gICAgICAgIEBzaG93UmlnaHRUb3BPcHRpb25zKClcblxuXG4gICAgb3BlbkZpbGU6IChmaWxlbmFtZSwgdGFyZ2V0RWxlbWVudCA9IG51bGwpIC0+XG4gICAgICAgIGZzLmV4aXN0cyBmaWxlbmFtZSwgKGV4aXN0cykgPT5cbiAgICAgICAgICAgIGlmIGV4aXN0c1xuICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gZmlsZW5hbWVcbiAgICAgICAgICAgIGVsc2UgaWYgdGFyZ2V0RWxlbWVudFxuICAgICAgICAgICAgICAgIHRhcmdldCA9ICQodGFyZ2V0RWxlbWVudClcbiAgICAgICAgICAgICAgICBpZiBub3QgdGFyZ2V0LmlzKCdwLmNsaWNrYWJsZScpXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnQoKVxuXG4gICAgICAgICAgICAgICAgdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygndGFyZ2V0LWZpbGUtZG9lcy1ub3QtZXhpc3QnKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NsaWNrYWJsZScpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJCgnPHNwYW4+RmlsZSBkb2VzIG5vdCBleGlzdCE8L3NwYW4+JykuYWRkQ2xhc3MoJ2hpbnQnKSlcbiAgICAgICAgICAgICAgICAgICAgLm9mZignY2xpY2snKVxuICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJzpmaXJzdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3RleHQtc3VjY2VzcyB0ZXh0LXdhcm5pbmcgdGV4dC1pbmZvJylcblxuXG4gICAgc2hvd0luZm9Ob3RpZmljYXRpb246ICh0aXRsZSwgbWVzc2FnZSkgLT5cbiAgICAgICAgaWYgQG9wdGlvbnMuc2hvd0luZm9Ob3RpZmljYXRpb25cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvIHRpdGxlLFxuICAgICAgICAgICAgICAgIGRldGFpbDogbWVzc2FnZVxuICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiAhQG9wdGlvbnMuYXV0b0hpZGVJbmZvTm90aWZpY2F0aW9uXG5cblxuICAgIHNob3dTdWNjZXNzTm90aWZpY2F0aW9uOiAodGl0bGUsIG1lc3NhZ2UpIC0+XG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dTdWNjZXNzTm90aWZpY2F0aW9uXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyB0aXRsZSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogIUBvcHRpb25zLmF1dG9IaWRlU3VjY2Vzc05vdGlmaWNhdGlvblxuXG5cbiAgICBzaG93V2FybmluZ05vdGlmaWNhdGlvbjogKHRpdGxlLCBtZXNzYWdlKSAtPlxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93V2FybmluZ05vdGlmaWNhdGlvblxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcgdGl0bGUsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiBtZXNzYWdlXG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6ICFAb3B0aW9ucy5hdXRvV2FybmluZ0luZm9Ob3RpZmljYXRpb25cblxuXG4gICAgc2hvd0Vycm9yTm90aWZpY2F0aW9uOiAodGl0bGUsIG1lc3NhZ2UpIC0+XG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dFcnJvck5vdGlmaWNhdGlvblxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIHRpdGxlLFxuICAgICAgICAgICAgICAgIGRldGFpbDogbWVzc2FnZVxuICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiAhQG9wdGlvbnMuYXV0b0hpZGVFcnJvck5vdGlmaWNhdGlvblxuXG5cbiAgICByZXNldFBhbmVsOiAtPlxuICAgICAgICBAc2V0Q2FwdGlvbignUHJvY2Vzc2luZy4uLicpXG4gICAgICAgIEBzaG93VGhyb2JiZXIoKVxuICAgICAgICBAaGlkZVJpZ2h0VG9wT3B0aW9ucygpXG4gICAgICAgIEBwYW5lbEJvZHkuYWRkQ2xhc3MoJ2hpZGUnKS5lbXB0eSgpXG5cblxuICAgIHNob3dQYW5lbDogKHJlc2V0ID0gZmFsc2UpIC0+XG4gICAgICAgIGNsZWFyVGltZW91dChAYXV0b21hdGljSGlkZVBhbmVsVGltZW91dClcblxuICAgICAgICBpZiByZXNldFxuICAgICAgICAgICAgQHJlc2V0UGFuZWwoKVxuXG4gICAgICAgIEBwYW5lbC5zaG93KClcblxuXG4gICAgaGlkZVBhbmVsOiAod2l0aERlbGF5ID0gZmFsc2UsIHJlc2V0ID0gZmFsc2UpLT5cbiAgICAgICAgY2xlYXJUaW1lb3V0KEBhdXRvbWF0aWNIaWRlUGFuZWxUaW1lb3V0KVxuXG4gICAgICAgICMgV2UgaGF2ZSB0byBjb21wYXJlIGl0IHRvIHRydWUgYmVjYXVzZSBpZiBjbG9zZSBidXR0b24gaXMgY2xpY2tlZCwgdGhlIHdpdGhEZWxheVxuICAgICAgICAjIHBhcmFtZXRlciBpcyBhIHJlZmVyZW5jZSB0byB0aGUgYnV0dG9uXG4gICAgICAgIGlmIHdpdGhEZWxheSA9PSB0cnVlXG4gICAgICAgICAgICBAYXV0b21hdGljSGlkZVBhbmVsVGltZW91dCA9IHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgICAgICBAaGlkZVRocm9iYmVyKClcbiAgICAgICAgICAgICAgICBAcGFuZWwuaGlkZSgpXG4gICAgICAgICAgICAgICAgaWYgcmVzZXRcbiAgICAgICAgICAgICAgICAgICAgQHJlc2V0UGFuZWwoKVxuICAgICAgICAgICAgLCBAb3B0aW9ucy5hdXRvSGlkZVBhbmVsRGVsYXlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGhpZGVUaHJvYmJlcigpXG4gICAgICAgICAgICBAcGFuZWwuaGlkZSgpXG4gICAgICAgICAgICBpZiByZXNldFxuICAgICAgICAgICAgICAgIEByZXNldFBhbmVsKClcblxuXG4gICAgc2V0Q2FwdGlvbjogKHRleHQpIC0+XG4gICAgICAgIEBwYW5lbEhlYWRlckNhcHRpb24uaHRtbChBdG9tTWluaWZ5Vmlldy5jYXB0aW9uUHJlZml4ICsgdGV4dClcblxuXG4gICAgYWRkVGV4dDogKHRleHQsIGljb24sIHRleHRDbGFzcywgY2xpY2tDYWxsYmFjaykgLT5cbiAgICAgICAgY2xpY2tDb3VudGVyID0gQXRvbU1pbmlmeVZpZXcuY2xpY2thYmxlTGlua3NDb3VudGVyKytcbiAgICAgICAgd3JhcHBlckNsYXNzID0gaWYgY2xpY2tDYWxsYmFjayB0aGVuIFwiY2xpY2thYmxlIGNsaWNrYWJsZS0je2NsaWNrQ291bnRlcn1cIiBlbHNlICcnXG5cbiAgICAgICAgc3BhbkNsYXNzID0gJydcbiAgICAgICAgaWYgaWNvblxuICAgICAgICAgICAgc3BhbkNsYXNzID0gc3BhbkNsYXNzICsgKGlmIHNwYW5DbGFzcyBpc250ICcnIHRoZW4gJyAnIGVsc2UgJycpICsgXCJpY29uIGljb24tI3tpY29ufVwiXG4gICAgICAgIGlmIHRleHRDbGFzc1xuICAgICAgICAgICAgc3BhbkNsYXNzID0gc3BhbkNsYXNzICsgKGlmIHNwYW5DbGFzcyBpc250ICcnIHRoZW4gJyAnIGVsc2UgJycpICsgXCJ0ZXh0LSN7dGV4dENsYXNzfVwiXG5cbiAgICAgICAgaWYgdHlwZW9mIHRleHQgaXMgJ29iamVjdCdcbiAgICAgICAgICAgIHdyYXBwZXIgPSAkJCAtPlxuICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6IHdyYXBwZXJDbGFzc1xuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmQodGV4dClcbiAgICAgICAgICAgIEBwYW5lbEJvZHkucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5hcHBlbmQod3JhcHBlcilcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBhbmVsQm9keS5yZW1vdmVDbGFzcygnaGlkZScpLmFwcGVuZCAkJCAtPlxuICAgICAgICAgICAgICAgIEBwIGNsYXNzOiB3cmFwcGVyQ2xhc3MsID0+XG4gICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiBzcGFuQ2xhc3MsIHRleHRcblxuICAgICAgICBpZiBjbGlja0NhbGxiYWNrXG4gICAgICAgICAgICBAZmluZChcIi5jbGlja2FibGUtI3tjbGlja0NvdW50ZXJ9XCIpLm9uICdjbGljaycsIChldnQpID0+IGNsaWNrQ2FsbGJhY2soZXZ0KVxuXG5cbiAgICBoaWRlUmlnaHRUb3BPcHRpb25zOiAtPlxuICAgICAgICBAcGFuZWxSaWdodFRvcE9wdGlvbnMuYWRkQ2xhc3MoJ2hpZGUnKVxuXG5cbiAgICBzaG93UmlnaHRUb3BPcHRpb25zOiAtPlxuICAgICAgICBAcGFuZWxSaWdodFRvcE9wdGlvbnMucmVtb3ZlQ2xhc3MoJ2hpZGUnKVxuXG5cbiAgICBoaWRlVGhyb2JiZXI6IC0+XG4gICAgICAgIEBwYW5lbExvYWRpbmcuYWRkQ2xhc3MoJ2hpZGUnKVxuXG5cbiAgICBzaG93VGhyb2JiZXI6IC0+XG4gICAgICAgIEBwYW5lbExvYWRpbmcucmVtb3ZlQ2xhc3MoJ2hpZGUnKVxuIl19
