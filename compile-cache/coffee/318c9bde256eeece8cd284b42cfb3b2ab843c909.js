(function() {
  var $, $$, CompositeDisposable, File, SassAutocompileView, View, fs, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, View = ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  File = require('./helper/file');

  fs = require('fs');

  module.exports = SassAutocompileView = (function(superClass) {
    extend(SassAutocompileView, superClass);

    SassAutocompileView.captionPrefix = 'SASS-Autocompile: ';

    SassAutocompileView.clickableLinksCounter = 0;

    SassAutocompileView.content = function() {
      return this.div({
        "class": 'sass-autocompile atom-panel panel-bottom'
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
                outlet: 'panelOpenNodeSassOutput',
                "class": 'open-node-sass-output hide',
                click: 'openNodeSassOutput'
              }, 'Show detailed output');
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

    function SassAutocompileView() {
      var args, options;
      options = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      SassAutocompileView.__super__.constructor.call(this, args);
      this.options = options;
      this.panel = atom.workspace.addBottomPanel({
        item: this,
        visible: false
      });
    }

    SassAutocompileView.prototype.initialize = function(serializeState) {};

    SassAutocompileView.prototype.destroy = function() {
      clearTimeout(this.automaticHidePanelTimeout);
      this.panel.destroy();
      return this.detach();
    };

    SassAutocompileView.prototype.updateOptions = function(options) {
      return this.options = options;
    };

    SassAutocompileView.prototype.startCompilation = function(args) {
      this.hasError = false;
      this.clearNodeSassOutput();
      if (this.options.showStartCompilingNotification) {
        if (args.isCompileDirect) {
          this.showInfoNotification('Start direct compilation');
        } else {
          this.showInfoNotification('Start compilation', args.inputFilename);
        }
      }
      if (this.options.showPanel) {
        this.showPanel(true);
        if (this.options.showStartCompilingNotification) {
          if (args.isCompileDirect) {
            return this.addText('Start direct compilation', 'terminal', 'info');
          } else {
            return this.addText(args.inputFilename, 'terminal', 'info', (function(_this) {
              return function(evt) {
                return _this.openFile(args.inputFilename, null, null, evt.target);
              };
            })(this));
          }
        }
      }
    };

    SassAutocompileView.prototype.warning = function(args) {
      if (this.options.showWarningNotification) {
        this.showWarningNotification('Warning', args.message);
      }
      if (this.options.showPanel) {
        this.showPanel();
        if (args.outputFilename) {
          return this.addText(args.message, 'issue-opened', 'warning', (function(_this) {
            return function(evt) {
              return _this.openFile(args.outputFilename, evt.target);
            };
          })(this));
        } else {
          return this.addText(args.message, 'issue-opened', 'warning');
        }
      }
    };

    SassAutocompileView.prototype.successfullCompilation = function(args) {
      var caption, details, fileSize, message, showAdditionalCompilationInfo;
      this.appendNodeSassOutput(args.nodeSassOutput);
      fileSize = File.fileSizeToReadable(args.statistics.after);
      caption = "Successfully compiled";
      details = args.outputFilename;
      if (this.options.showAdditionalCompilationInfo) {
        details += "\n \nOutput style: " + args.outputStyle;
        details += "\nDuration:     " + args.statistics.duration + " ms";
        details += "\nFile size:    " + fileSize.size + " " + fileSize.unit;
      }
      this.showSuccessNotification(caption, details);
      if (this.options.showPanel) {
        this.showPanel();
        showAdditionalCompilationInfo = this.options.showAdditionalCompilationInfo;
        message = $$(function() {
          return this.div({
            "class": 'success-text-wrapper'
          }, (function(_this) {
            return function() {
              _this.p({
                "class": 'icon icon-check text-success'
              }, function() {
                if (args.isCompileDirect) {
                  return _this.span({
                    "class": ''
                  }, 'Successfully compiled!');
                } else {
                  return _this.span({
                    "class": ''
                  }, args.outputFilename);
                }
              });
              if (showAdditionalCompilationInfo) {
                return _this.p({
                  "class": 'success-details text-info'
                }, function() {
                  _this.span({
                    "class": 'success-output-style'
                  }, function() {
                    _this.span('Output style: ');
                    return _this.span({
                      "class": 'value'
                    }, args.outputStyle);
                  });
                  _this.span({
                    "class": 'success-duration'
                  }, function() {
                    _this.span('Duration: ');
                    return _this.span({
                      "class": 'value'
                    }, args.statistics.duration + ' ms');
                  });
                  return _this.span({
                    "class": 'success-file-size'
                  }, function() {
                    _this.span('File size: ');
                    return _this.span({
                      "class": 'value'
                    }, fileSize.size + ' ' + fileSize.unit);
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

    SassAutocompileView.prototype.erroneousCompilation = function(args) {
      var caption, errorMessage, errorNotification;
      this.hasError = true;
      this.appendNodeSassOutput(args.nodeSassOutput);
      caption = 'Compilation error';
      if (args.message.file) {
        errorNotification = "ERROR:\n" + args.message.message;
        if (args.isCompileToFile) {
          errorNotification += "\n \nFILE:\n" + args.message.file;
        }
        errorNotification += "\n \nLINE:    " + args.message.line + "\nCOLUMN:  " + args.message.column;
      } else {
        errorNotification = args.message;
      }
      this.showErrorNotification(caption, errorNotification);
      if (this.options.showPanel) {
        this.showPanel();
        if (args.message.file) {
          errorMessage = $$(function() {
            return this.div({
              "class": 'open-error-file'
            }, (function(_this) {
              return function() {
                _this.p({
                  "class": "icon icon-alert text-error"
                }, function() {
                  _this.span({
                    "class": "error-caption"
                  }, 'Error:');
                  _this.span({
                    "class": "error-text"
                  }, args.message.message);
                  if (args.isCompileDirect) {
                    _this.span({
                      "class": 'error-line'
                    }, args.message.line);
                    return _this.span({
                      "class": 'error-column'
                    }, args.message.column);
                  }
                });
                if (args.isCompileToFile) {
                  return _this.p({
                    "class": 'error-details text-error'
                  }, function() {
                    return _this.span({
                      "class": 'error-file-wrapper'
                    }, function() {
                      _this.span('in:');
                      _this.span({
                        "class": 'error-file'
                      }, args.message.file);
                      _this.span({
                        "class": 'error-line'
                      }, args.message.line);
                      return _this.span({
                        "class": 'error-column'
                      }, args.message.column);
                    });
                  });
                }
              };
            })(this));
          });
          this.addText(errorMessage, 'alert', 'error', (function(_this) {
            return function(evt) {
              return _this.openFile(args.message.file, args.message.line, args.message.column, evt.target);
            };
          })(this));
        } else if (args.message.message) {
          this.addText(args.message.message, 'alert', 'error', (function(_this) {
            return function(evt) {
              return _this.openFile(args.inputFilename, null, null, evt.target);
            };
          })(this));
        } else {
          this.addText(args.message, 'alert', 'error', (function(_this) {
            return function(evt) {
              return _this.openFile(args.inputFilename, null, null, evt.target);
            };
          })(this));
        }
      }
      if (this.options.directlyJumpToError && args.message.file) {
        return this.openFile(args.message.file, args.message.line, args.message.column);
      }
    };

    SassAutocompileView.prototype.appendNodeSassOutput = function(output) {
      if (this.nodeSassOutput) {
        return this.nodeSassOutput += "\n\n--------------------\n\n" + output;
      } else {
        return this.nodeSassOutput = output;
      }
    };

    SassAutocompileView.prototype.clearNodeSassOutput = function() {
      return this.nodeSassOutput = void 0;
    };

    SassAutocompileView.prototype.finished = function(args) {
      if (this.hasError) {
        this.setCaption('Compilation error');
        if (this.options.autoHidePanelOnError) {
          this.hidePanel(true);
        }
      } else {
        this.setCaption('Successfully compiled');
        if (this.options.autoHidePanelOnSuccess) {
          this.hidePanel(true);
        }
      }
      this.hideThrobber();
      this.showRightTopOptions();
      if (this.nodeSassOutput) {
        this.panelOpenNodeSassOutput.removeClass('hide');
      }
      if (this.options.showNodeSassOutput) {
        return this.openNodeSassOutput();
      }
    };

    SassAutocompileView.prototype.openFile = function(filename, line, column, targetElement) {
      if (targetElement == null) {
        targetElement = null;
      }
      if (typeof filename === 'string') {
        return fs.exists(filename, (function(_this) {
          return function(exists) {
            var target;
            if (exists) {
              return atom.workspace.open(filename, {
                initialLine: line ? line - 1 : 0,
                initialColumn: column ? column - 1 : 0
              });
            } else if (targetElement) {
              target = $(targetElement);
              if (!target.is('p.clickable')) {
                target = target.parent();
              }
              return target.addClass('target-file-does-not-exist').removeClass('clickable').append($('<span>File does not exist!</span>').addClass('hint')).off('click').children(':first').removeClass('text-success text-warning text-info');
            }
          };
        })(this));
      }
    };

    SassAutocompileView.prototype.openNodeSassOutput = function() {
      var pane;
      if (this.nodeSassOutput) {
        if (!this.nodeSassOutputEditor) {
          return atom.workspace.open().then((function(_this) {
            return function(editor) {
              var subscriptions;
              _this.nodeSassOutputEditor = editor;
              editor.setText(_this.nodeSassOutput);
              subscriptions = new CompositeDisposable;
              subscriptions.add(editor.onDidSave(function() {
                return _this.nodeSassOutputEditor = null;
              }));
              return subscriptions.add(editor.onDidDestroy(function() {
                _this.nodeSassOutputEditor = null;
                return subscriptions.dispose();
              }));
            };
          })(this));
        } else {
          pane = atom.workspace.paneForItem(this.nodeSassOutputEditor);
          return pane.activateItem(this.nodeSassOutputEditor);
        }
      }
    };

    SassAutocompileView.prototype.showInfoNotification = function(title, message) {
      if (this.options.showInfoNotification) {
        return atom.notifications.addInfo(title, {
          detail: message,
          dismissable: !this.options.autoHideInfoNotification
        });
      }
    };

    SassAutocompileView.prototype.showSuccessNotification = function(title, message) {
      if (this.options.showSuccessNotification) {
        return atom.notifications.addSuccess(title, {
          detail: message,
          dismissable: !this.options.autoHideSuccessNotification
        });
      }
    };

    SassAutocompileView.prototype.showWarningNotification = function(title, message) {
      if (this.options.showWarningNotification) {
        return atom.notifications.addWarning(title, {
          detail: message,
          dismissable: !this.options.autoWarningInfoNotification
        });
      }
    };

    SassAutocompileView.prototype.showErrorNotification = function(title, message) {
      if (this.options.showErrorNotification) {
        return atom.notifications.addError(title, {
          detail: message,
          dismissable: !this.options.autoHideErrorNotification
        });
      }
    };

    SassAutocompileView.prototype.resetPanel = function() {
      this.setCaption('Processing...');
      this.showThrobber();
      this.hideRightTopOptions();
      this.panelOpenNodeSassOutput.addClass('hide');
      return this.panelBody.addClass('hide').empty();
    };

    SassAutocompileView.prototype.showPanel = function(reset) {
      if (reset == null) {
        reset = false;
      }
      clearTimeout(this.automaticHidePanelTimeout);
      if (reset) {
        this.resetPanel();
      }
      return this.panel.show();
    };

    SassAutocompileView.prototype.hidePanel = function(withDelay, reset) {
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

    SassAutocompileView.prototype.setCaption = function(text) {
      return this.panelHeaderCaption.html(SassAutocompileView.captionPrefix + text);
    };

    SassAutocompileView.prototype.addText = function(text, icon, textClass, clickCallback) {
      var clickCounter, spanClass, wrapper, wrapperClass;
      clickCounter = SassAutocompileView.clickableLinksCounter++;
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

    SassAutocompileView.prototype.hideRightTopOptions = function() {
      return this.panelRightTopOptions.addClass('hide');
    };

    SassAutocompileView.prototype.showRightTopOptions = function() {
      return this.panelRightTopOptions.removeClass('hide');
    };

    SassAutocompileView.prototype.hideThrobber = function() {
      return this.panelLoading.addClass('hide');
    };

    SassAutocompileView.prototype.showThrobber = function() {
      return this.panelLoading.removeClass('hide');
    };

    return SassAutocompileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9zYXNzLWF1dG9jb21waWxlL2xpYi9zYXNzLWF1dG9jb21waWxlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxvRUFBQTtJQUFBOzs7O0VBQUEsTUFBZ0IsT0FBQSxDQUFRLHNCQUFSLENBQWhCLEVBQUMsU0FBRCxFQUFJLFdBQUosRUFBUTs7RUFDUCxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUjs7RUFFUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBR0wsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBRUYsbUJBQUMsQ0FBQSxhQUFELEdBQWlCOztJQUNqQixtQkFBQyxDQUFBLHFCQUFELEdBQXlCOztJQUd6QixtQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ04sSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sMENBQVA7T0FBTCxFQUF3RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3BELEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGFBQVA7V0FBTCxFQUEyQixTQUFBO1lBQ3ZCLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxNQUFBLEVBQVEsY0FBUjtjQUF3QixDQUFBLEtBQUEsQ0FBQSxFQUFPLHlCQUEvQjthQUFMLEVBQStELFNBQUE7Y0FDM0QsS0FBQyxDQUFBLElBQUQsQ0FDSTtnQkFBQSxNQUFBLEVBQVEsb0JBQVI7Z0JBQ0EsQ0FBQSxLQUFBLENBQUEsRUFBTyxnQkFEUDtlQURKO2NBR0EsS0FBQyxDQUFBLElBQUQsQ0FDSTtnQkFBQSxNQUFBLEVBQVEseUJBQVI7Z0JBQ0EsQ0FBQSxLQUFBLENBQUEsRUFBTyw0QkFEUDtnQkFFQSxLQUFBLEVBQU8sb0JBRlA7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QSxJQUFBLENBQXhCO1FBRHFDLENBQUgsQ0FBdEMsRUFOSjs7TUFVQSxJQUFHLGFBQUg7ZUFDSSxJQUFDLENBQUEsSUFBRCxDQUFNLGFBQUEsR0FBYyxZQUFwQixDQUFtQyxDQUFDLEVBQXBDLENBQXVDLE9BQXZDLEVBQWdELENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsR0FBRDttQkFBUyxhQUFBLENBQWMsR0FBZDtVQUFUO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxFQURKOztJQXBCSzs7a0NBd0JULG1CQUFBLEdBQXFCLFNBQUE7YUFDakIsSUFBQyxDQUFBLG9CQUFvQixDQUFDLFFBQXRCLENBQStCLE1BQS9CO0lBRGlCOztrQ0FJckIsbUJBQUEsR0FBcUIsU0FBQTthQUNqQixJQUFDLENBQUEsb0JBQW9CLENBQUMsV0FBdEIsQ0FBa0MsTUFBbEM7SUFEaUI7O2tDQUlyQixZQUFBLEdBQWMsU0FBQTthQUNWLElBQUMsQ0FBQSxZQUFZLENBQUMsUUFBZCxDQUF1QixNQUF2QjtJQURVOztrQ0FJZCxZQUFBLEdBQWMsU0FBQTthQUNWLElBQUMsQ0FBQSxZQUFZLENBQUMsV0FBZCxDQUEwQixNQUExQjtJQURVOzs7O0tBM1ZnQjtBQVRsQyIsInNvdXJjZXNDb250ZW50IjpbInskLCAkJCwgVmlld30gPSByZXF1aXJlKCdhdG9tLXNwYWNlLXBlbi12aWV3cycpXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlKCdhdG9tJylcblxuRmlsZSA9IHJlcXVpcmUoJy4vaGVscGVyL2ZpbGUnKVxuXG5mcyA9IHJlcXVpcmUoJ2ZzJylcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTYXNzQXV0b2NvbXBpbGVWaWV3IGV4dGVuZHMgVmlld1xuXG4gICAgQGNhcHRpb25QcmVmaXggPSAnU0FTUy1BdXRvY29tcGlsZTogJ1xuICAgIEBjbGlja2FibGVMaW5rc0NvdW50ZXIgPSAwXG5cblxuICAgIEBjb250ZW50OiAtPlxuICAgICAgICBAZGl2IGNsYXNzOiAnc2Fzcy1hdXRvY29tcGlsZSBhdG9tLXBhbmVsIHBhbmVsLWJvdHRvbScsID0+XG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnaW5zZXQtcGFuZWwnLCA9PlxuICAgICAgICAgICAgICAgIEBkaXYgb3V0bGV0OiAncGFuZWxIZWFkaW5nJywgY2xhc3M6ICdwYW5lbC1oZWFkaW5nIG5vLWJvcmRlcicsID0+XG4gICAgICAgICAgICAgICAgICAgIEBzcGFuXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6ICdwYW5lbEhlYWRlckNhcHRpb24nXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2hlYWRlci1jYXB0aW9uJ1xuICAgICAgICAgICAgICAgICAgICBAc3BhblxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0bGV0OiAncGFuZWxPcGVuTm9kZVNhc3NPdXRwdXQnXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ29wZW4tbm9kZS1zYXNzLW91dHB1dCBoaWRlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICdvcGVuTm9kZVNhc3NPdXRwdXQnXG4gICAgICAgICAgICAgICAgICAgICAgICAnU2hvdyBkZXRhaWxlZCBvdXRwdXQnXG4gICAgICAgICAgICAgICAgICAgIEBzcGFuXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6ICdwYW5lbExvYWRpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2lubGluZS1ibG9jayBsb2FkaW5nIGxvYWRpbmctc3Bpbm5lci10aW55IGhpZGUnXG4gICAgICAgICAgICAgICAgICAgIEBkaXYgb3V0bGV0OiAncGFuZWxSaWdodFRvcE9wdGlvbnMnLCBjbGFzczogJ2lubGluZS1ibG9jayBwdWxsLXJpZ2h0IHJpZ2h0LXRvcC1vcHRpb25zJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIEBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6ICdwYW5lbENsb3NlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnYnRuIGJ0bi1jbG9zZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogJ2hpZGVQYW5lbCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQ2xvc2UnXG4gICAgICAgICAgICAgICAgQGRpdlxuICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6ICdwYW5lbEJvZHknXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAncGFuZWwtYm9keSBwYWRkZWQgaGlkZSdcblxuXG4gICAgY29uc3RydWN0b3I6IChvcHRpb25zLCBhcmdzLi4uKSAtPlxuICAgICAgICBzdXBlcihhcmdzKVxuICAgICAgICBAb3B0aW9ucyA9IG9wdGlvbnNcbiAgICAgICAgQHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWxcbiAgICAgICAgICAgIGl0ZW06IHRoaXNcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG5cblxuICAgIGluaXRpYWxpemU6IChzZXJpYWxpemVTdGF0ZSkgLT5cblxuXG4gICAgZGVzdHJveTogLT5cbiAgICAgICAgY2xlYXJUaW1lb3V0KEBhdXRvbWF0aWNIaWRlUGFuZWxUaW1lb3V0KVxuICAgICAgICBAcGFuZWwuZGVzdHJveSgpXG4gICAgICAgIEBkZXRhY2goKVxuXG5cbiAgICB1cGRhdGVPcHRpb25zOiAob3B0aW9ucykgLT5cbiAgICAgICAgQG9wdGlvbnMgPSBvcHRpb25zXG5cblxuICAgIHN0YXJ0Q29tcGlsYXRpb246IChhcmdzKSAtPlxuICAgICAgICBAaGFzRXJyb3IgPSBmYWxzZVxuICAgICAgICBAY2xlYXJOb2RlU2Fzc091dHB1dCgpXG5cbiAgICAgICAgaWYgQG9wdGlvbnMuc2hvd1N0YXJ0Q29tcGlsaW5nTm90aWZpY2F0aW9uXG4gICAgICAgICAgICBpZiBhcmdzLmlzQ29tcGlsZURpcmVjdFxuICAgICAgICAgICAgICAgIEBzaG93SW5mb05vdGlmaWNhdGlvbignU3RhcnQgZGlyZWN0IGNvbXBpbGF0aW9uJylcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAc2hvd0luZm9Ob3RpZmljYXRpb24oJ1N0YXJ0IGNvbXBpbGF0aW9uJywgYXJncy5pbnB1dEZpbGVuYW1lKVxuXG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dQYW5lbFxuICAgICAgICAgICAgQHNob3dQYW5lbCh0cnVlKVxuICAgICAgICAgICAgaWYgQG9wdGlvbnMuc2hvd1N0YXJ0Q29tcGlsaW5nTm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgaWYgYXJncy5pc0NvbXBpbGVEaXJlY3RcbiAgICAgICAgICAgICAgICAgICAgQGFkZFRleHQoJ1N0YXJ0IGRpcmVjdCBjb21waWxhdGlvbicsICd0ZXJtaW5hbCcsICdpbmZvJywpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAYWRkVGV4dChhcmdzLmlucHV0RmlsZW5hbWUsICd0ZXJtaW5hbCcsICdpbmZvJywgKGV2dCkgPT4gQG9wZW5GaWxlKGFyZ3MuaW5wdXRGaWxlbmFtZSwgbnVsbCwgbnVsbCwgZXZ0LnRhcmdldCkgKVxuXG5cbiAgICB3YXJuaW5nOiAoYXJncykgLT5cbiAgICAgICAgaWYgQG9wdGlvbnMuc2hvd1dhcm5pbmdOb3RpZmljYXRpb25cbiAgICAgICAgICAgIEBzaG93V2FybmluZ05vdGlmaWNhdGlvbignV2FybmluZycsIGFyZ3MubWVzc2FnZSlcblxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93UGFuZWxcbiAgICAgICAgICAgIEBzaG93UGFuZWwoKVxuICAgICAgICAgICAgaWYgYXJncy5vdXRwdXRGaWxlbmFtZVxuICAgICAgICAgICAgICAgIEBhZGRUZXh0KGFyZ3MubWVzc2FnZSwgJ2lzc3VlLW9wZW5lZCcsICd3YXJuaW5nJywgKGV2dCkgPT4gQG9wZW5GaWxlKGFyZ3Mub3V0cHV0RmlsZW5hbWUsIGV2dC50YXJnZXQpKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBhZGRUZXh0KGFyZ3MubWVzc2FnZSwgJ2lzc3VlLW9wZW5lZCcsICd3YXJuaW5nJylcblxuXG4gICAgc3VjY2Vzc2Z1bGxDb21waWxhdGlvbjogKGFyZ3MpIC0+XG4gICAgICAgIEBhcHBlbmROb2RlU2Fzc091dHB1dChhcmdzLm5vZGVTYXNzT3V0cHV0KVxuICAgICAgICBmaWxlU2l6ZSA9IEZpbGUuZmlsZVNpemVUb1JlYWRhYmxlKGFyZ3Muc3RhdGlzdGljcy5hZnRlcilcblxuICAgICAgICAjIE5vdGlmaWNhdGlvblxuICAgICAgICBjYXB0aW9uID0gXCJTdWNjZXNzZnVsbHkgY29tcGlsZWRcIlxuICAgICAgICBkZXRhaWxzID0gYXJncy5vdXRwdXRGaWxlbmFtZVxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93QWRkaXRpb25hbENvbXBpbGF0aW9uSW5mb1xuICAgICAgICAgICAgZGV0YWlscyArPSBcIlxcbiBcXG5PdXRwdXQgc3R5bGU6IFwiICsgYXJncy5vdXRwdXRTdHlsZVxuICAgICAgICAgICAgZGV0YWlscyArPSBcIlxcbkR1cmF0aW9uOiAgICAgXCIgKyBhcmdzLnN0YXRpc3RpY3MuZHVyYXRpb24gKyBcIiBtc1wiXG4gICAgICAgICAgICBkZXRhaWxzICs9IFwiXFxuRmlsZSBzaXplOiAgICBcIiArIGZpbGVTaXplLnNpemUgKyBcIiBcIiArIGZpbGVTaXplLnVuaXRcbiAgICAgICAgQHNob3dTdWNjZXNzTm90aWZpY2F0aW9uKGNhcHRpb24sIGRldGFpbHMpXG5cbiAgICAgICAgIyBQYW5lbFxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93UGFuZWxcbiAgICAgICAgICAgIEBzaG93UGFuZWwoKVxuXG4gICAgICAgICAgICAjIFdlIGhhdmUgdG8gc3RvcmUgdGhpcyB2YWx1ZSBpbiBhIGxvY2FsIHZhcmlhYmxlLCBiZWFjdXNlICQkIG1ldGhvZHMgY2FuIG5vdCBzZWUgQG9wdGlvbnNcbiAgICAgICAgICAgIHNob3dBZGRpdGlvbmFsQ29tcGlsYXRpb25JbmZvID0gQG9wdGlvbnMuc2hvd0FkZGl0aW9uYWxDb21waWxhdGlvbkluZm9cblxuICAgICAgICAgICAgbWVzc2FnZSA9ICQkIC0+XG4gICAgICAgICAgICAgICAgQGRpdiBjbGFzczogJ3N1Y2Nlc3MtdGV4dC13cmFwcGVyJywgPT5cbiAgICAgICAgICAgICAgICAgICAgQHAgY2xhc3M6ICdpY29uIGljb24tY2hlY2sgdGV4dC1zdWNjZXNzJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGFyZ3MuaXNDb21waWxlRGlyZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICcnLCAnU3VjY2Vzc2Z1bGx5IGNvbXBpbGVkISdcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJycsIGFyZ3Mub3V0cHV0RmlsZW5hbWVcblxuICAgICAgICAgICAgICAgICAgICBpZiBzaG93QWRkaXRpb25hbENvbXBpbGF0aW9uSW5mb1xuICAgICAgICAgICAgICAgICAgICAgICAgQHAgY2xhc3M6ICdzdWNjZXNzLWRldGFpbHMgdGV4dC1pbmZvJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3N1Y2Nlc3Mtb3V0cHV0LXN0eWxlJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gJ091dHB1dCBzdHlsZTogJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3ZhbHVlJywgYXJncy5vdXRwdXRTdHlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnc3VjY2Vzcy1kdXJhdGlvbicsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuICdEdXJhdGlvbjogJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3ZhbHVlJywgYXJncy5zdGF0aXN0aWNzLmR1cmF0aW9uICsgJyBtcydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3N1Y2Nlc3MtZmlsZS1zaXplJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gJ0ZpbGUgc2l6ZTogJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3ZhbHVlJywgZmlsZVNpemUuc2l6ZSArICcgJyArIGZpbGVTaXplLnVuaXRcblxuICAgICAgICAgICAgQGFkZFRleHQobWVzc2FnZSwgJ2NoZWNrJywgJ3N1Y2Nlc3MnLCAoZXZ0KSA9PiBAb3BlbkZpbGUoYXJncy5vdXRwdXRGaWxlbmFtZSwgZXZ0LnRhcmdldCkpXG5cblxuICAgIGVycm9uZW91c0NvbXBpbGF0aW9uOiAoYXJncykgLT5cbiAgICAgICAgQGhhc0Vycm9yID0gdHJ1ZVxuICAgICAgICBAYXBwZW5kTm9kZVNhc3NPdXRwdXQoYXJncy5ub2RlU2Fzc091dHB1dClcblxuICAgICAgICAjIE5vdGlmaWNhdGlvblxuICAgICAgICBjYXB0aW9uID0gJ0NvbXBpbGF0aW9uIGVycm9yJ1xuICAgICAgICBpZiBhcmdzLm1lc3NhZ2UuZmlsZVxuICAgICAgICAgICAgZXJyb3JOb3RpZmljYXRpb24gPSBcIkVSUk9SOlxcblwiICsgYXJncy5tZXNzYWdlLm1lc3NhZ2VcbiAgICAgICAgICAgIGlmIGFyZ3MuaXNDb21waWxlVG9GaWxlXG4gICAgICAgICAgICAgICAgZXJyb3JOb3RpZmljYXRpb24gKz0gXCJcXG4gXFxuRklMRTpcXG5cIiArIGFyZ3MubWVzc2FnZS5maWxlXG4gICAgICAgICAgICBlcnJvck5vdGlmaWNhdGlvbiArPSBcIlxcbiBcXG5MSU5FOiAgICBcIiArIGFyZ3MubWVzc2FnZS5saW5lICsgXCJcXG5DT0xVTU46ICBcIiArIGFyZ3MubWVzc2FnZS5jb2x1bW5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZXJyb3JOb3RpZmljYXRpb24gPSBhcmdzLm1lc3NhZ2VcbiAgICAgICAgQHNob3dFcnJvck5vdGlmaWNhdGlvbihjYXB0aW9uLCBlcnJvck5vdGlmaWNhdGlvbilcblxuICAgICAgICAjIFBhbmVsXG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dQYW5lbFxuICAgICAgICAgICAgQHNob3dQYW5lbCgpXG5cbiAgICAgICAgICAgIGlmIGFyZ3MubWVzc2FnZS5maWxlXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gJCQgLT5cbiAgICAgICAgICAgICAgICAgICAgQGRpdiBjbGFzczogJ29wZW4tZXJyb3ItZmlsZScsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBAcCBjbGFzczogXCJpY29uIGljb24tYWxlcnQgdGV4dC1lcnJvclwiLCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiBcImVycm9yLWNhcHRpb25cIiwgJ0Vycm9yOidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogXCJlcnJvci10ZXh0XCIsIGFyZ3MubWVzc2FnZS5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgYXJncy5pc0NvbXBpbGVEaXJlY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICdlcnJvci1saW5lJywgYXJncy5tZXNzYWdlLmxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICdlcnJvci1jb2x1bW4nLCBhcmdzLm1lc3NhZ2UuY29sdW1uXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGFyZ3MuaXNDb21waWxlVG9GaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQHAgY2xhc3M6ICdlcnJvci1kZXRhaWxzIHRleHQtZXJyb3InLCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ2Vycm9yLWZpbGUtd3JhcHBlcicsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiAnaW46J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICdlcnJvci1maWxlJywgYXJncy5tZXNzYWdlLmZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnZXJyb3ItbGluZScsIGFyZ3MubWVzc2FnZS5saW5lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ2Vycm9yLWNvbHVtbicsIGFyZ3MubWVzc2FnZS5jb2x1bW5cbiAgICAgICAgICAgICAgICBAYWRkVGV4dChlcnJvck1lc3NhZ2UsICdhbGVydCcsICdlcnJvcicsIChldnQpID0+IEBvcGVuRmlsZShhcmdzLm1lc3NhZ2UuZmlsZSwgYXJncy5tZXNzYWdlLmxpbmUsIGFyZ3MubWVzc2FnZS5jb2x1bW4sIGV2dC50YXJnZXQpKVxuICAgICAgICAgICAgZWxzZSBpZiBhcmdzLm1lc3NhZ2UubWVzc2FnZVxuICAgICAgICAgICAgICAgIEBhZGRUZXh0KGFyZ3MubWVzc2FnZS5tZXNzYWdlLCAnYWxlcnQnLCAnZXJyb3InLCAoZXZ0KSA9PiBAb3BlbkZpbGUoYXJncy5pbnB1dEZpbGVuYW1lLCBudWxsLCBudWxsLCBldnQudGFyZ2V0KSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAYWRkVGV4dChhcmdzLm1lc3NhZ2UsICdhbGVydCcsICdlcnJvcicsIChldnQpID0+IEBvcGVuRmlsZShhcmdzLmlucHV0RmlsZW5hbWUsIG51bGwsIG51bGwsIGV2dC50YXJnZXQpKVxuXG4gICAgICAgIGlmIEBvcHRpb25zLmRpcmVjdGx5SnVtcFRvRXJyb3IgYW5kIGFyZ3MubWVzc2FnZS5maWxlXG4gICAgICAgICAgICBAb3BlbkZpbGUoYXJncy5tZXNzYWdlLmZpbGUsIGFyZ3MubWVzc2FnZS5saW5lLCBhcmdzLm1lc3NhZ2UuY29sdW1uKVxuXG5cbiAgICBhcHBlbmROb2RlU2Fzc091dHB1dDogKG91dHB1dCkgLT5cbiAgICAgICAgaWYgQG5vZGVTYXNzT3V0cHV0XG4gICAgICAgICAgICBAbm9kZVNhc3NPdXRwdXQgKz0gXCJcXG5cXG4tLS0tLS0tLS0tLS0tLS0tLS0tLVxcblxcblwiICsgb3V0cHV0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBub2RlU2Fzc091dHB1dCA9IG91dHB1dFxuXG5cbiAgICBjbGVhck5vZGVTYXNzT3V0cHV0OiAoKSAtPlxuICAgICAgICBAbm9kZVNhc3NPdXRwdXQgPSB1bmRlZmluZWRcblxuXG4gICAgZmluaXNoZWQ6IChhcmdzKSAtPlxuICAgICAgICBpZiBAaGFzRXJyb3JcbiAgICAgICAgICAgIEBzZXRDYXB0aW9uKCdDb21waWxhdGlvbiBlcnJvcicpXG4gICAgICAgICAgICBpZiBAb3B0aW9ucy5hdXRvSGlkZVBhbmVsT25FcnJvclxuICAgICAgICAgICAgICAgIEBoaWRlUGFuZWwodHJ1ZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHNldENhcHRpb24oJ1N1Y2Nlc3NmdWxseSBjb21waWxlZCcpXG4gICAgICAgICAgICBpZiBAb3B0aW9ucy5hdXRvSGlkZVBhbmVsT25TdWNjZXNzXG4gICAgICAgICAgICAgICAgQGhpZGVQYW5lbCh0cnVlKVxuXG4gICAgICAgIEBoaWRlVGhyb2JiZXIoKVxuICAgICAgICBAc2hvd1JpZ2h0VG9wT3B0aW9ucygpXG5cbiAgICAgICAgaWYgQG5vZGVTYXNzT3V0cHV0XG4gICAgICAgICAgICBAcGFuZWxPcGVuTm9kZVNhc3NPdXRwdXQucmVtb3ZlQ2xhc3MoJ2hpZGUnKVxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93Tm9kZVNhc3NPdXRwdXRcbiAgICAgICAgICAgIEBvcGVuTm9kZVNhc3NPdXRwdXQoKVxuXG5cbiAgICBvcGVuRmlsZTogKGZpbGVuYW1lLCBsaW5lLCBjb2x1bW4sIHRhcmdldEVsZW1lbnQgPSBudWxsKSAtPlxuICAgICAgICBpZiB0eXBlb2YgZmlsZW5hbWUgaXMgJ3N0cmluZydcbiAgICAgICAgICAgIGZzLmV4aXN0cyBmaWxlbmFtZSwgKGV4aXN0cykgPT5cbiAgICAgICAgICAgICAgICBpZiBleGlzdHNcbiAgICAgICAgICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxMaW5lOiBpZiBsaW5lIHRoZW4gbGluZSAtIDEgZWxzZSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbENvbHVtbjogaWYgY29sdW1uIHRoZW4gY29sdW1uIC0gMSBlbHNlIDBcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHRhcmdldEVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gJCh0YXJnZXRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICBpZiBub3QgdGFyZ2V0LmlzKCdwLmNsaWNrYWJsZScpXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50KClcblxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygndGFyZ2V0LWZpbGUtZG9lcy1ub3QtZXhpc3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjbGlja2FibGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkKCc8c3Bhbj5GaWxlIGRvZXMgbm90IGV4aXN0ITwvc3Bhbj4nKS5hZGRDbGFzcygnaGludCcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9mZignY2xpY2snKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKCc6Zmlyc3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygndGV4dC1zdWNjZXNzIHRleHQtd2FybmluZyB0ZXh0LWluZm8nKVxuXG5cbiAgICBvcGVuTm9kZVNhc3NPdXRwdXQ6ICgpIC0+XG4gICAgICAgIGlmIEBub2RlU2Fzc091dHB1dFxuICAgICAgICAgICAgaWYgbm90IEBub2RlU2Fzc091dHB1dEVkaXRvclxuICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oKS50aGVuIChlZGl0b3IpID0+XG4gICAgICAgICAgICAgICAgICAgIEBub2RlU2Fzc091dHB1dEVkaXRvciA9IGVkaXRvclxuICAgICAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChAbm9kZVNhc3NPdXRwdXQpXG5cbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZFNhdmUgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIEBub2RlU2Fzc091dHB1dEVkaXRvciA9IG51bGxcblxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25zLmFkZCBlZGl0b3Iub25EaWREZXN0cm95ID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBAbm9kZVNhc3NPdXRwdXRFZGl0b3IgPSBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShAbm9kZVNhc3NPdXRwdXRFZGl0b3IpXG4gICAgICAgICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oQG5vZGVTYXNzT3V0cHV0RWRpdG9yKVxuXG5cbiAgICBzaG93SW5mb05vdGlmaWNhdGlvbjogKHRpdGxlLCBtZXNzYWdlKSAtPlxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93SW5mb05vdGlmaWNhdGlvblxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8gdGl0bGUsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiBtZXNzYWdlXG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6ICFAb3B0aW9ucy5hdXRvSGlkZUluZm9Ob3RpZmljYXRpb25cblxuXG4gICAgc2hvd1N1Y2Nlc3NOb3RpZmljYXRpb246ICh0aXRsZSwgbWVzc2FnZSkgLT5cbiAgICAgICAgaWYgQG9wdGlvbnMuc2hvd1N1Y2Nlc3NOb3RpZmljYXRpb25cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzIHRpdGxlLFxuICAgICAgICAgICAgICAgIGRldGFpbDogbWVzc2FnZVxuICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiAhQG9wdGlvbnMuYXV0b0hpZGVTdWNjZXNzTm90aWZpY2F0aW9uXG5cblxuICAgIHNob3dXYXJuaW5nTm90aWZpY2F0aW9uOiAodGl0bGUsIG1lc3NhZ2UpIC0+XG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dXYXJuaW5nTm90aWZpY2F0aW9uXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyB0aXRsZSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogIUBvcHRpb25zLmF1dG9XYXJuaW5nSW5mb05vdGlmaWNhdGlvblxuXG5cbiAgICBzaG93RXJyb3JOb3RpZmljYXRpb246ICh0aXRsZSwgbWVzc2FnZSkgLT5cbiAgICAgICAgaWYgQG9wdGlvbnMuc2hvd0Vycm9yTm90aWZpY2F0aW9uXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgdGl0bGUsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiBtZXNzYWdlXG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6ICFAb3B0aW9ucy5hdXRvSGlkZUVycm9yTm90aWZpY2F0aW9uXG5cblxuICAgIHJlc2V0UGFuZWw6IC0+XG4gICAgICAgIEBzZXRDYXB0aW9uKCdQcm9jZXNzaW5nLi4uJylcbiAgICAgICAgQHNob3dUaHJvYmJlcigpXG4gICAgICAgIEBoaWRlUmlnaHRUb3BPcHRpb25zKClcbiAgICAgICAgQHBhbmVsT3Blbk5vZGVTYXNzT3V0cHV0LmFkZENsYXNzKCdoaWRlJylcbiAgICAgICAgQHBhbmVsQm9keS5hZGRDbGFzcygnaGlkZScpLmVtcHR5KClcblxuXG4gICAgc2hvd1BhbmVsOiAocmVzZXQgPSBmYWxzZSkgLT5cbiAgICAgICAgY2xlYXJUaW1lb3V0KEBhdXRvbWF0aWNIaWRlUGFuZWxUaW1lb3V0KVxuXG4gICAgICAgIGlmIHJlc2V0XG4gICAgICAgICAgICBAcmVzZXRQYW5lbCgpXG5cbiAgICAgICAgQHBhbmVsLnNob3coKVxuXG5cbiAgICBoaWRlUGFuZWw6ICh3aXRoRGVsYXkgPSBmYWxzZSwgcmVzZXQgPSBmYWxzZSktPlxuICAgICAgICBjbGVhclRpbWVvdXQoQGF1dG9tYXRpY0hpZGVQYW5lbFRpbWVvdXQpXG5cbiAgICAgICAgIyBXZSBoYXZlIHRvIGNvbXBhcmUgaXQgdG8gdHJ1ZSBiZWNhdXNlIGlmIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkLCB0aGUgd2l0aERlbGF5XG4gICAgICAgICMgcGFyYW1ldGVyIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBidXR0b25cbiAgICAgICAgaWYgd2l0aERlbGF5ID09IHRydWVcbiAgICAgICAgICAgIEBhdXRvbWF0aWNIaWRlUGFuZWxUaW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgICAgICAgICAgIEBoaWRlVGhyb2JiZXIoKVxuICAgICAgICAgICAgICAgIEBwYW5lbC5oaWRlKClcbiAgICAgICAgICAgICAgICBpZiByZXNldFxuICAgICAgICAgICAgICAgICAgICBAcmVzZXRQYW5lbCgpXG4gICAgICAgICAgICAsIEBvcHRpb25zLmF1dG9IaWRlUGFuZWxEZWxheVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAaGlkZVRocm9iYmVyKClcbiAgICAgICAgICAgIEBwYW5lbC5oaWRlKClcbiAgICAgICAgICAgIGlmIHJlc2V0XG4gICAgICAgICAgICAgICAgQHJlc2V0UGFuZWwoKVxuXG5cbiAgICBzZXRDYXB0aW9uOiAodGV4dCkgLT5cbiAgICAgICAgQHBhbmVsSGVhZGVyQ2FwdGlvbi5odG1sKFNhc3NBdXRvY29tcGlsZVZpZXcuY2FwdGlvblByZWZpeCArIHRleHQpXG5cblxuICAgIGFkZFRleHQ6ICh0ZXh0LCBpY29uLCB0ZXh0Q2xhc3MsIGNsaWNrQ2FsbGJhY2spIC0+XG4gICAgICAgIGNsaWNrQ291bnRlciA9IFNhc3NBdXRvY29tcGlsZVZpZXcuY2xpY2thYmxlTGlua3NDb3VudGVyKytcbiAgICAgICAgd3JhcHBlckNsYXNzID0gaWYgY2xpY2tDYWxsYmFjayB0aGVuIFwiY2xpY2thYmxlIGNsaWNrYWJsZS0je2NsaWNrQ291bnRlcn1cIiBlbHNlICcnXG5cbiAgICAgICAgc3BhbkNsYXNzID0gJydcbiAgICAgICAgaWYgaWNvblxuICAgICAgICAgICAgc3BhbkNsYXNzID0gc3BhbkNsYXNzICsgKGlmIHNwYW5DbGFzcyBpc250ICcnIHRoZW4gJyAnIGVsc2UgJycpICsgXCJpY29uIGljb24tI3tpY29ufVwiXG4gICAgICAgIGlmIHRleHRDbGFzc1xuICAgICAgICAgICAgc3BhbkNsYXNzID0gc3BhbkNsYXNzICsgKGlmIHNwYW5DbGFzcyBpc250ICcnIHRoZW4gJyAnIGVsc2UgJycpICsgXCJ0ZXh0LSN7dGV4dENsYXNzfVwiXG5cbiAgICAgICAgaWYgdHlwZW9mIHRleHQgaXMgJ29iamVjdCdcbiAgICAgICAgICAgIHdyYXBwZXIgPSAkJCAtPlxuICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6IHdyYXBwZXJDbGFzc1xuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmQodGV4dClcbiAgICAgICAgICAgIEBwYW5lbEJvZHkucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5hcHBlbmQod3JhcHBlcilcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHBhbmVsQm9keS5yZW1vdmVDbGFzcygnaGlkZScpLmFwcGVuZCAkJCAtPlxuICAgICAgICAgICAgICAgIEBwIGNsYXNzOiB3cmFwcGVyQ2xhc3MsID0+XG4gICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiBzcGFuQ2xhc3MsIHRleHRcblxuICAgICAgICBpZiBjbGlja0NhbGxiYWNrXG4gICAgICAgICAgICBAZmluZChcIi5jbGlja2FibGUtI3tjbGlja0NvdW50ZXJ9XCIpLm9uICdjbGljaycsIChldnQpID0+IGNsaWNrQ2FsbGJhY2soZXZ0KVxuXG5cbiAgICBoaWRlUmlnaHRUb3BPcHRpb25zOiAtPlxuICAgICAgICBAcGFuZWxSaWdodFRvcE9wdGlvbnMuYWRkQ2xhc3MoJ2hpZGUnKVxuXG5cbiAgICBzaG93UmlnaHRUb3BPcHRpb25zOiAtPlxuICAgICAgICBAcGFuZWxSaWdodFRvcE9wdGlvbnMucmVtb3ZlQ2xhc3MoJ2hpZGUnKVxuXG5cbiAgICBoaWRlVGhyb2JiZXI6IC0+XG4gICAgICAgIEBwYW5lbExvYWRpbmcuYWRkQ2xhc3MoJ2hpZGUnKVxuXG5cbiAgICBzaG93VGhyb2JiZXI6IC0+XG4gICAgICAgIEBwYW5lbExvYWRpbmcucmVtb3ZlQ2xhc3MoJ2hpZGUnKVxuIl19
