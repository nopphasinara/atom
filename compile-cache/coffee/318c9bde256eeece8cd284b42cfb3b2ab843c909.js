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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3Nhc3MtYXV0b2NvbXBpbGUvbGliL3Nhc3MtYXV0b2NvbXBpbGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9FQUFBO0lBQUE7Ozs7RUFBQSxNQUFnQixPQUFBLENBQVEsc0JBQVIsQ0FBaEIsRUFBQyxTQUFELEVBQUksV0FBSixFQUFROztFQUNQLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSOztFQUVQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFHTCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFFRixtQkFBQyxDQUFBLGFBQUQsR0FBaUI7O0lBQ2pCLG1CQUFDLENBQUEscUJBQUQsR0FBeUI7O0lBR3pCLG1CQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDTixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTywwQ0FBUDtPQUFMLEVBQXdELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDcEQsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sYUFBUDtXQUFMLEVBQTJCLFNBQUE7WUFDdkIsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLE1BQUEsRUFBUSxjQUFSO2NBQXdCLENBQUEsS0FBQSxDQUFBLEVBQU8seUJBQS9CO2FBQUwsRUFBK0QsU0FBQTtjQUMzRCxLQUFDLENBQUEsSUFBRCxDQUNJO2dCQUFBLE1BQUEsRUFBUSxvQkFBUjtnQkFDQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGdCQURQO2VBREo7Y0FHQSxLQUFDLENBQUEsSUFBRCxDQUNJO2dCQUFBLE1BQUEsRUFBUSx5QkFBUjtnQkFDQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDRCQURQO2dCQUVBLEtBQUEsRUFB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Q0FBQSxDQUFBLElBQUEsQ0FBeEI7UUFEcUMsQ0FBSCxDQUF0QyxFQU5KOztNQVVBLElBQUcsYUFBSDtlQUNJLElBQUMsQ0FBQSxJQUFELENBQU0sYUFBQSxHQUFjLFlBQXBCLENBQW1DLENBQUMsRUFBcEMsQ0FBdUMsT0FBdkMsRUFBZ0QsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxHQUFEO21CQUFTLGFBQUEsQ0FBYyxHQUFkO1VBQVQ7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhELEVBREo7O0lBcEJLOztrQ0F3QlQsbUJBQUEsR0FBcUIsU0FBQTthQUNqQixJQUFDLENBQUEsb0JBQW9CLENBQUMsUUFBdEIsQ0FBK0IsTUFBL0I7SUFEaUI7O2tDQUlyQixtQkFBQSxHQUFxQixTQUFBO2FBQ2pCLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxXQUF0QixDQUFrQyxNQUFsQztJQURpQjs7a0NBSXJCLFlBQUEsR0FBYyxTQUFBO2FBQ1YsSUFBQyxDQUFBLFlBQVksQ0FBQyxRQUFkLENBQXVCLE1BQXZCO0lBRFU7O2tDQUlkLFlBQUEsR0FBYyxTQUFBO2FBQ1YsSUFBQyxDQUFBLFlBQVksQ0FBQyxXQUFkLENBQTBCLE1BQTFCO0lBRFU7Ozs7S0EzVmdCO0FBVGxDIiwic291cmNlc0NvbnRlbnQiOlsieyQsICQkLCBWaWV3fSA9IHJlcXVpcmUoJ2F0b20tc3BhY2UtcGVuLXZpZXdzJylcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2F0b20nKVxuXG5GaWxlID0gcmVxdWlyZSgnLi9oZWxwZXIvZmlsZScpXG5cbmZzID0gcmVxdWlyZSgnZnMnKVxuXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNhc3NBdXRvY29tcGlsZVZpZXcgZXh0ZW5kcyBWaWV3XG5cbiAgICBAY2FwdGlvblByZWZpeCA9ICdTQVNTLUF1dG9jb21waWxlOiAnXG4gICAgQGNsaWNrYWJsZUxpbmtzQ291bnRlciA9IDBcblxuXG4gICAgQGNvbnRlbnQ6IC0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdzYXNzLWF1dG9jb21waWxlIGF0b20tcGFuZWwgcGFuZWwtYm90dG9tJywgPT5cbiAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdpbnNldC1wYW5lbCcsID0+XG4gICAgICAgICAgICAgICAgQGRpdiBvdXRsZXQ6ICdwYW5lbEhlYWRpbmcnLCBjbGFzczogJ3BhbmVsLWhlYWRpbmcgbm8tYm9yZGVyJywgPT5cbiAgICAgICAgICAgICAgICAgICAgQHNwYW5cbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxldDogJ3BhbmVsSGVhZGVyQ2FwdGlvbidcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnaGVhZGVyLWNhcHRpb24nXG4gICAgICAgICAgICAgICAgICAgIEBzcGFuXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6ICdwYW5lbE9wZW5Ob2RlU2Fzc091dHB1dCdcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnb3Blbi1ub2RlLXNhc3Mtb3V0cHV0IGhpZGUnXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGljazogJ29wZW5Ob2RlU2Fzc091dHB1dCdcbiAgICAgICAgICAgICAgICAgICAgICAgICdTaG93IGRldGFpbGVkIG91dHB1dCdcbiAgICAgICAgICAgICAgICAgICAgQHNwYW5cbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxldDogJ3BhbmVsTG9hZGluZydcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnaW5saW5lLWJsb2NrIGxvYWRpbmcgbG9hZGluZy1zcGlubmVyLXRpbnkgaGlkZSdcbiAgICAgICAgICAgICAgICAgICAgQGRpdiBvdXRsZXQ6ICdwYW5lbFJpZ2h0VG9wT3B0aW9ucycsIGNsYXNzOiAnaW5saW5lLWJsb2NrIHB1bGwtcmlnaHQgcmlnaHQtdG9wLW9wdGlvbnMnLCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgQGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dGxldDogJ3BhbmVsQ2xvc2UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdidG4gYnRuLWNsb3NlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAnaGlkZVBhbmVsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdDbG9zZSdcbiAgICAgICAgICAgICAgICBAZGl2XG4gICAgICAgICAgICAgICAgICAgIG91dGxldDogJ3BhbmVsQm9keSdcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdwYW5lbC1ib2R5IHBhZGRlZCBoaWRlJ1xuXG5cbiAgICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMsIGFyZ3MuLi4pIC0+XG4gICAgICAgIHN1cGVyKGFyZ3MpXG4gICAgICAgIEBvcHRpb25zID0gb3B0aW9uc1xuICAgICAgICBAcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbFxuICAgICAgICAgICAgaXRlbTogdGhpc1xuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcblxuXG4gICAgaW5pdGlhbGl6ZTogKHNlcmlhbGl6ZVN0YXRlKSAtPlxuXG5cbiAgICBkZXN0cm95OiAtPlxuICAgICAgICBjbGVhclRpbWVvdXQoQGF1dG9tYXRpY0hpZGVQYW5lbFRpbWVvdXQpXG4gICAgICAgIEBwYW5lbC5kZXN0cm95KClcbiAgICAgICAgQGRldGFjaCgpXG5cblxuICAgIHVwZGF0ZU9wdGlvbnM6IChvcHRpb25zKSAtPlxuICAgICAgICBAb3B0aW9ucyA9IG9wdGlvbnNcblxuXG4gICAgc3RhcnRDb21waWxhdGlvbjogKGFyZ3MpIC0+XG4gICAgICAgIEBoYXNFcnJvciA9IGZhbHNlXG4gICAgICAgIEBjbGVhck5vZGVTYXNzT3V0cHV0KClcblxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93U3RhcnRDb21waWxpbmdOb3RpZmljYXRpb25cbiAgICAgICAgICAgIGlmIGFyZ3MuaXNDb21waWxlRGlyZWN0XG4gICAgICAgICAgICAgICAgQHNob3dJbmZvTm90aWZpY2F0aW9uKCdTdGFydCBkaXJlY3QgY29tcGlsYXRpb24nKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBzaG93SW5mb05vdGlmaWNhdGlvbignU3RhcnQgY29tcGlsYXRpb24nLCBhcmdzLmlucHV0RmlsZW5hbWUpXG5cbiAgICAgICAgaWYgQG9wdGlvbnMuc2hvd1BhbmVsXG4gICAgICAgICAgICBAc2hvd1BhbmVsKHRydWUpXG4gICAgICAgICAgICBpZiBAb3B0aW9ucy5zaG93U3RhcnRDb21waWxpbmdOb3RpZmljYXRpb25cbiAgICAgICAgICAgICAgICBpZiBhcmdzLmlzQ29tcGlsZURpcmVjdFxuICAgICAgICAgICAgICAgICAgICBAYWRkVGV4dCgnU3RhcnQgZGlyZWN0IGNvbXBpbGF0aW9uJywgJ3Rlcm1pbmFsJywgJ2luZm8nLClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBhZGRUZXh0KGFyZ3MuaW5wdXRGaWxlbmFtZSwgJ3Rlcm1pbmFsJywgJ2luZm8nLCAoZXZ0KSA9PiBAb3BlbkZpbGUoYXJncy5pbnB1dEZpbGVuYW1lLCBudWxsLCBudWxsLCBldnQudGFyZ2V0KSApXG5cblxuICAgIHdhcm5pbmc6IChhcmdzKSAtPlxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93V2FybmluZ05vdGlmaWNhdGlvblxuICAgICAgICAgICAgQHNob3dXYXJuaW5nTm90aWZpY2F0aW9uKCdXYXJuaW5nJywgYXJncy5tZXNzYWdlKVxuXG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dQYW5lbFxuICAgICAgICAgICAgQHNob3dQYW5lbCgpXG4gICAgICAgICAgICBpZiBhcmdzLm91dHB1dEZpbGVuYW1lXG4gICAgICAgICAgICAgICAgQGFkZFRleHQoYXJncy5tZXNzYWdlLCAnaXNzdWUtb3BlbmVkJywgJ3dhcm5pbmcnLCAoZXZ0KSA9PiBAb3BlbkZpbGUoYXJncy5vdXRwdXRGaWxlbmFtZSwgZXZ0LnRhcmdldCkpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQGFkZFRleHQoYXJncy5tZXNzYWdlLCAnaXNzdWUtb3BlbmVkJywgJ3dhcm5pbmcnKVxuXG5cbiAgICBzdWNjZXNzZnVsbENvbXBpbGF0aW9uOiAoYXJncykgLT5cbiAgICAgICAgQGFwcGVuZE5vZGVTYXNzT3V0cHV0KGFyZ3Mubm9kZVNhc3NPdXRwdXQpXG4gICAgICAgIGZpbGVTaXplID0gRmlsZS5maWxlU2l6ZVRvUmVhZGFibGUoYXJncy5zdGF0aXN0aWNzLmFmdGVyKVxuXG4gICAgICAgICMgTm90aWZpY2F0aW9uXG4gICAgICAgIGNhcHRpb24gPSBcIlN1Y2Nlc3NmdWxseSBjb21waWxlZFwiXG4gICAgICAgIGRldGFpbHMgPSBhcmdzLm91dHB1dEZpbGVuYW1lXG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dBZGRpdGlvbmFsQ29tcGlsYXRpb25JbmZvXG4gICAgICAgICAgICBkZXRhaWxzICs9IFwiXFxuIFxcbk91dHB1dCBzdHlsZTogXCIgKyBhcmdzLm91dHB1dFN0eWxlXG4gICAgICAgICAgICBkZXRhaWxzICs9IFwiXFxuRHVyYXRpb246ICAgICBcIiArIGFyZ3Muc3RhdGlzdGljcy5kdXJhdGlvbiArIFwiIG1zXCJcbiAgICAgICAgICAgIGRldGFpbHMgKz0gXCJcXG5GaWxlIHNpemU6ICAgIFwiICsgZmlsZVNpemUuc2l6ZSArIFwiIFwiICsgZmlsZVNpemUudW5pdFxuICAgICAgICBAc2hvd1N1Y2Nlc3NOb3RpZmljYXRpb24oY2FwdGlvbiwgZGV0YWlscylcblxuICAgICAgICAjIFBhbmVsXG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dQYW5lbFxuICAgICAgICAgICAgQHNob3dQYW5lbCgpXG5cbiAgICAgICAgICAgICMgV2UgaGF2ZSB0byBzdG9yZSB0aGlzIHZhbHVlIGluIGEgbG9jYWwgdmFyaWFibGUsIGJlYWN1c2UgJCQgbWV0aG9kcyBjYW4gbm90IHNlZSBAb3B0aW9uc1xuICAgICAgICAgICAgc2hvd0FkZGl0aW9uYWxDb21waWxhdGlvbkluZm8gPSBAb3B0aW9ucy5zaG93QWRkaXRpb25hbENvbXBpbGF0aW9uSW5mb1xuXG4gICAgICAgICAgICBtZXNzYWdlID0gJCQgLT5cbiAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiAnc3VjY2Vzcy10ZXh0LXdyYXBwZXInLCA9PlxuICAgICAgICAgICAgICAgICAgICBAcCBjbGFzczogJ2ljb24gaWNvbi1jaGVjayB0ZXh0LXN1Y2Nlc3MnLCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgYXJncy5pc0NvbXBpbGVEaXJlY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJycsICdTdWNjZXNzZnVsbHkgY29tcGlsZWQhJ1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnJywgYXJncy5vdXRwdXRGaWxlbmFtZVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIHNob3dBZGRpdGlvbmFsQ29tcGlsYXRpb25JbmZvXG4gICAgICAgICAgICAgICAgICAgICAgICBAcCBjbGFzczogJ3N1Y2Nlc3MtZGV0YWlscyB0ZXh0LWluZm8nLCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnc3VjY2Vzcy1vdXRwdXQtc3R5bGUnLCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiAnT3V0cHV0IHN0eWxlOiAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAndmFsdWUnLCBhcmdzLm91dHB1dFN0eWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICdzdWNjZXNzLWR1cmF0aW9uJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gJ0R1cmF0aW9uOiAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAndmFsdWUnLCBhcmdzLnN0YXRpc3RpY3MuZHVyYXRpb24gKyAnIG1zJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnc3VjY2Vzcy1maWxlLXNpemUnLCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiAnRmlsZSBzaXplOiAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAndmFsdWUnLCBmaWxlU2l6ZS5zaXplICsgJyAnICsgZmlsZVNpemUudW5pdFxuXG4gICAgICAgICAgICBAYWRkVGV4dChtZXNzYWdlLCAnY2hlY2snLCAnc3VjY2VzcycsIChldnQpID0+IEBvcGVuRmlsZShhcmdzLm91dHB1dEZpbGVuYW1lLCBldnQudGFyZ2V0KSlcblxuXG4gICAgZXJyb25lb3VzQ29tcGlsYXRpb246IChhcmdzKSAtPlxuICAgICAgICBAaGFzRXJyb3IgPSB0cnVlXG4gICAgICAgIEBhcHBlbmROb2RlU2Fzc091dHB1dChhcmdzLm5vZGVTYXNzT3V0cHV0KVxuXG4gICAgICAgICMgTm90aWZpY2F0aW9uXG4gICAgICAgIGNhcHRpb24gPSAnQ29tcGlsYXRpb24gZXJyb3InXG4gICAgICAgIGlmIGFyZ3MubWVzc2FnZS5maWxlXG4gICAgICAgICAgICBlcnJvck5vdGlmaWNhdGlvbiA9IFwiRVJST1I6XFxuXCIgKyBhcmdzLm1lc3NhZ2UubWVzc2FnZVxuICAgICAgICAgICAgaWYgYXJncy5pc0NvbXBpbGVUb0ZpbGVcbiAgICAgICAgICAgICAgICBlcnJvck5vdGlmaWNhdGlvbiArPSBcIlxcbiBcXG5GSUxFOlxcblwiICsgYXJncy5tZXNzYWdlLmZpbGVcbiAgICAgICAgICAgIGVycm9yTm90aWZpY2F0aW9uICs9IFwiXFxuIFxcbkxJTkU6ICAgIFwiICsgYXJncy5tZXNzYWdlLmxpbmUgKyBcIlxcbkNPTFVNTjogIFwiICsgYXJncy5tZXNzYWdlLmNvbHVtblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBlcnJvck5vdGlmaWNhdGlvbiA9IGFyZ3MubWVzc2FnZVxuICAgICAgICBAc2hvd0Vycm9yTm90aWZpY2F0aW9uKGNhcHRpb24sIGVycm9yTm90aWZpY2F0aW9uKVxuXG4gICAgICAgICMgUGFuZWxcbiAgICAgICAgaWYgQG9wdGlvbnMuc2hvd1BhbmVsXG4gICAgICAgICAgICBAc2hvd1BhbmVsKClcblxuICAgICAgICAgICAgaWYgYXJncy5tZXNzYWdlLmZpbGVcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSAkJCAtPlxuICAgICAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiAnb3Blbi1lcnJvci1maWxlJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIEBwIGNsYXNzOiBcImljb24gaWNvbi1hbGVydCB0ZXh0LWVycm9yXCIsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6IFwiZXJyb3ItY2FwdGlvblwiLCAnRXJyb3I6J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiBcImVycm9yLXRleHRcIiwgYXJncy5tZXNzYWdlLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBhcmdzLmlzQ29tcGlsZURpcmVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ2Vycm9yLWxpbmUnLCBhcmdzLm1lc3NhZ2UubGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ2Vycm9yLWNvbHVtbicsIGFyZ3MubWVzc2FnZS5jb2x1bW5cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgYXJncy5pc0NvbXBpbGVUb0ZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAcCBjbGFzczogJ2Vycm9yLWRldGFpbHMgdGV4dC1lcnJvcicsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnZXJyb3ItZmlsZS13cmFwcGVyJywgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuICdpbjonXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ2Vycm9yLWZpbGUnLCBhcmdzLm1lc3NhZ2UuZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6ICdlcnJvci1saW5lJywgYXJncy5tZXNzYWdlLmxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnZXJyb3ItY29sdW1uJywgYXJncy5tZXNzYWdlLmNvbHVtblxuICAgICAgICAgICAgICAgIEBhZGRUZXh0KGVycm9yTWVzc2FnZSwgJ2FsZXJ0JywgJ2Vycm9yJywgKGV2dCkgPT4gQG9wZW5GaWxlKGFyZ3MubWVzc2FnZS5maWxlLCBhcmdzLm1lc3NhZ2UubGluZSwgYXJncy5tZXNzYWdlLmNvbHVtbiwgZXZ0LnRhcmdldCkpXG4gICAgICAgICAgICBlbHNlIGlmIGFyZ3MubWVzc2FnZS5tZXNzYWdlXG4gICAgICAgICAgICAgICAgQGFkZFRleHQoYXJncy5tZXNzYWdlLm1lc3NhZ2UsICdhbGVydCcsICdlcnJvcicsIChldnQpID0+IEBvcGVuRmlsZShhcmdzLmlucHV0RmlsZW5hbWUsIG51bGwsIG51bGwsIGV2dC50YXJnZXQpKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBhZGRUZXh0KGFyZ3MubWVzc2FnZSwgJ2FsZXJ0JywgJ2Vycm9yJywgKGV2dCkgPT4gQG9wZW5GaWxlKGFyZ3MuaW5wdXRGaWxlbmFtZSwgbnVsbCwgbnVsbCwgZXZ0LnRhcmdldCkpXG5cbiAgICAgICAgaWYgQG9wdGlvbnMuZGlyZWN0bHlKdW1wVG9FcnJvciBhbmQgYXJncy5tZXNzYWdlLmZpbGVcbiAgICAgICAgICAgIEBvcGVuRmlsZShhcmdzLm1lc3NhZ2UuZmlsZSwgYXJncy5tZXNzYWdlLmxpbmUsIGFyZ3MubWVzc2FnZS5jb2x1bW4pXG5cblxuICAgIGFwcGVuZE5vZGVTYXNzT3V0cHV0OiAob3V0cHV0KSAtPlxuICAgICAgICBpZiBAbm9kZVNhc3NPdXRwdXRcbiAgICAgICAgICAgIEBub2RlU2Fzc091dHB1dCArPSBcIlxcblxcbi0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuXFxuXCIgKyBvdXRwdXRcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG5vZGVTYXNzT3V0cHV0ID0gb3V0cHV0XG5cblxuICAgIGNsZWFyTm9kZVNhc3NPdXRwdXQ6ICgpIC0+XG4gICAgICAgIEBub2RlU2Fzc091dHB1dCA9IHVuZGVmaW5lZFxuXG5cbiAgICBmaW5pc2hlZDogKGFyZ3MpIC0+XG4gICAgICAgIGlmIEBoYXNFcnJvclxuICAgICAgICAgICAgQHNldENhcHRpb24oJ0NvbXBpbGF0aW9uIGVycm9yJylcbiAgICAgICAgICAgIGlmIEBvcHRpb25zLmF1dG9IaWRlUGFuZWxPbkVycm9yXG4gICAgICAgICAgICAgICAgQGhpZGVQYW5lbCh0cnVlKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc2V0Q2FwdGlvbignU3VjY2Vzc2Z1bGx5IGNvbXBpbGVkJylcbiAgICAgICAgICAgIGlmIEBvcHRpb25zLmF1dG9IaWRlUGFuZWxPblN1Y2Nlc3NcbiAgICAgICAgICAgICAgICBAaGlkZVBhbmVsKHRydWUpXG5cbiAgICAgICAgQGhpZGVUaHJvYmJlcigpXG4gICAgICAgIEBzaG93UmlnaHRUb3BPcHRpb25zKClcblxuICAgICAgICBpZiBAbm9kZVNhc3NPdXRwdXRcbiAgICAgICAgICAgIEBwYW5lbE9wZW5Ob2RlU2Fzc091dHB1dC5yZW1vdmVDbGFzcygnaGlkZScpXG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dOb2RlU2Fzc091dHB1dFxuICAgICAgICAgICAgQG9wZW5Ob2RlU2Fzc091dHB1dCgpXG5cblxuICAgIG9wZW5GaWxlOiAoZmlsZW5hbWUsIGxpbmUsIGNvbHVtbiwgdGFyZ2V0RWxlbWVudCA9IG51bGwpIC0+XG4gICAgICAgIGlmIHR5cGVvZiBmaWxlbmFtZSBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgZnMuZXhpc3RzIGZpbGVuYW1lLCAoZXhpc3RzKSA9PlxuICAgICAgICAgICAgICAgIGlmIGV4aXN0c1xuICAgICAgICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGVuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbExpbmU6IGlmIGxpbmUgdGhlbiBsaW5lIC0gMSBlbHNlIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsQ29sdW1uOiBpZiBjb2x1bW4gdGhlbiBjb2x1bW4gLSAxIGVsc2UgMFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgdGFyZ2V0RWxlbWVudFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSAkKHRhcmdldEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGlmIG5vdCB0YXJnZXQuaXMoJ3AuY2xpY2thYmxlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnQoKVxuXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCd0YXJnZXQtZmlsZS1kb2VzLW5vdC1leGlzdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NsaWNrYWJsZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCQoJzxzcGFuPkZpbGUgZG9lcyBub3QgZXhpc3QhPC9zcGFuPicpLmFkZENsYXNzKCdoaW50JykpXG4gICAgICAgICAgICAgICAgICAgICAgICAub2ZmKCdjbGljaycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJzpmaXJzdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0ZXh0LXN1Y2Nlc3MgdGV4dC13YXJuaW5nIHRleHQtaW5mbycpXG5cblxuICAgIG9wZW5Ob2RlU2Fzc091dHB1dDogKCkgLT5cbiAgICAgICAgaWYgQG5vZGVTYXNzT3V0cHV0XG4gICAgICAgICAgICBpZiBub3QgQG5vZGVTYXNzT3V0cHV0RWRpdG9yXG4gICAgICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpLnRoZW4gKGVkaXRvcikgPT5cbiAgICAgICAgICAgICAgICAgICAgQG5vZGVTYXNzT3V0cHV0RWRpdG9yID0gZWRpdG9yXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0KEBub2RlU2Fzc091dHB1dClcblxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yLm9uRGlkU2F2ZSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgQG5vZGVTYXNzT3V0cHV0RWRpdG9yID0gbnVsbFxuXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZERlc3Ryb3kgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIEBub2RlU2Fzc091dHB1dEVkaXRvciA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEBub2RlU2Fzc091dHB1dEVkaXRvcilcbiAgICAgICAgICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShAbm9kZVNhc3NPdXRwdXRFZGl0b3IpXG5cblxuICAgIHNob3dJbmZvTm90aWZpY2F0aW9uOiAodGl0bGUsIG1lc3NhZ2UpIC0+XG4gICAgICAgIGlmIEBvcHRpb25zLnNob3dJbmZvTm90aWZpY2F0aW9uXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyB0aXRsZSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogIUBvcHRpb25zLmF1dG9IaWRlSW5mb05vdGlmaWNhdGlvblxuXG5cbiAgICBzaG93U3VjY2Vzc05vdGlmaWNhdGlvbjogKHRpdGxlLCBtZXNzYWdlKSAtPlxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93U3VjY2Vzc05vdGlmaWNhdGlvblxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MgdGl0bGUsXG4gICAgICAgICAgICAgICAgZGV0YWlsOiBtZXNzYWdlXG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6ICFAb3B0aW9ucy5hdXRvSGlkZVN1Y2Nlc3NOb3RpZmljYXRpb25cblxuXG4gICAgc2hvd1dhcm5pbmdOb3RpZmljYXRpb246ICh0aXRsZSwgbWVzc2FnZSkgLT5cbiAgICAgICAgaWYgQG9wdGlvbnMuc2hvd1dhcm5pbmdOb3RpZmljYXRpb25cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nIHRpdGxlLFxuICAgICAgICAgICAgICAgIGRldGFpbDogbWVzc2FnZVxuICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiAhQG9wdGlvbnMuYXV0b1dhcm5pbmdJbmZvTm90aWZpY2F0aW9uXG5cblxuICAgIHNob3dFcnJvck5vdGlmaWNhdGlvbjogKHRpdGxlLCBtZXNzYWdlKSAtPlxuICAgICAgICBpZiBAb3B0aW9ucy5zaG93RXJyb3JOb3RpZmljYXRpb25cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciB0aXRsZSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogIUBvcHRpb25zLmF1dG9IaWRlRXJyb3JOb3RpZmljYXRpb25cblxuXG4gICAgcmVzZXRQYW5lbDogLT5cbiAgICAgICAgQHNldENhcHRpb24oJ1Byb2Nlc3NpbmcuLi4nKVxuICAgICAgICBAc2hvd1Rocm9iYmVyKClcbiAgICAgICAgQGhpZGVSaWdodFRvcE9wdGlvbnMoKVxuICAgICAgICBAcGFuZWxPcGVuTm9kZVNhc3NPdXRwdXQuYWRkQ2xhc3MoJ2hpZGUnKVxuICAgICAgICBAcGFuZWxCb2R5LmFkZENsYXNzKCdoaWRlJykuZW1wdHkoKVxuXG5cbiAgICBzaG93UGFuZWw6IChyZXNldCA9IGZhbHNlKSAtPlxuICAgICAgICBjbGVhclRpbWVvdXQoQGF1dG9tYXRpY0hpZGVQYW5lbFRpbWVvdXQpXG5cbiAgICAgICAgaWYgcmVzZXRcbiAgICAgICAgICAgIEByZXNldFBhbmVsKClcblxuICAgICAgICBAcGFuZWwuc2hvdygpXG5cblxuICAgIGhpZGVQYW5lbDogKHdpdGhEZWxheSA9IGZhbHNlLCByZXNldCA9IGZhbHNlKS0+XG4gICAgICAgIGNsZWFyVGltZW91dChAYXV0b21hdGljSGlkZVBhbmVsVGltZW91dClcblxuICAgICAgICAjIFdlIGhhdmUgdG8gY29tcGFyZSBpdCB0byB0cnVlIGJlY2F1c2UgaWYgY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQsIHRoZSB3aXRoRGVsYXlcbiAgICAgICAgIyBwYXJhbWV0ZXIgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGJ1dHRvblxuICAgICAgICBpZiB3aXRoRGVsYXkgPT0gdHJ1ZVxuICAgICAgICAgICAgQGF1dG9tYXRpY0hpZGVQYW5lbFRpbWVvdXQgPSBzZXRUaW1lb3V0ID0+XG4gICAgICAgICAgICAgICAgQGhpZGVUaHJvYmJlcigpXG4gICAgICAgICAgICAgICAgQHBhbmVsLmhpZGUoKVxuICAgICAgICAgICAgICAgIGlmIHJlc2V0XG4gICAgICAgICAgICAgICAgICAgIEByZXNldFBhbmVsKClcbiAgICAgICAgICAgICwgQG9wdGlvbnMuYXV0b0hpZGVQYW5lbERlbGF5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBoaWRlVGhyb2JiZXIoKVxuICAgICAgICAgICAgQHBhbmVsLmhpZGUoKVxuICAgICAgICAgICAgaWYgcmVzZXRcbiAgICAgICAgICAgICAgICBAcmVzZXRQYW5lbCgpXG5cblxuICAgIHNldENhcHRpb246ICh0ZXh0KSAtPlxuICAgICAgICBAcGFuZWxIZWFkZXJDYXB0aW9uLmh0bWwoU2Fzc0F1dG9jb21waWxlVmlldy5jYXB0aW9uUHJlZml4ICsgdGV4dClcblxuXG4gICAgYWRkVGV4dDogKHRleHQsIGljb24sIHRleHRDbGFzcywgY2xpY2tDYWxsYmFjaykgLT5cbiAgICAgICAgY2xpY2tDb3VudGVyID0gU2Fzc0F1dG9jb21waWxlVmlldy5jbGlja2FibGVMaW5rc0NvdW50ZXIrK1xuICAgICAgICB3cmFwcGVyQ2xhc3MgPSBpZiBjbGlja0NhbGxiYWNrIHRoZW4gXCJjbGlja2FibGUgY2xpY2thYmxlLSN7Y2xpY2tDb3VudGVyfVwiIGVsc2UgJydcblxuICAgICAgICBzcGFuQ2xhc3MgPSAnJ1xuICAgICAgICBpZiBpY29uXG4gICAgICAgICAgICBzcGFuQ2xhc3MgPSBzcGFuQ2xhc3MgKyAoaWYgc3BhbkNsYXNzIGlzbnQgJycgdGhlbiAnICcgZWxzZSAnJykgKyBcImljb24gaWNvbi0je2ljb259XCJcbiAgICAgICAgaWYgdGV4dENsYXNzXG4gICAgICAgICAgICBzcGFuQ2xhc3MgPSBzcGFuQ2xhc3MgKyAoaWYgc3BhbkNsYXNzIGlzbnQgJycgdGhlbiAnICcgZWxzZSAnJykgKyBcInRleHQtI3t0ZXh0Q2xhc3N9XCJcblxuICAgICAgICBpZiB0eXBlb2YgdGV4dCBpcyAnb2JqZWN0J1xuICAgICAgICAgICAgd3JhcHBlciA9ICQkIC0+XG4gICAgICAgICAgICAgICAgQGRpdiBjbGFzczogd3JhcHBlckNsYXNzXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZCh0ZXh0KVxuICAgICAgICAgICAgQHBhbmVsQm9keS5yZW1vdmVDbGFzcygnaGlkZScpLmFwcGVuZCh3cmFwcGVyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAcGFuZWxCb2R5LnJlbW92ZUNsYXNzKCdoaWRlJykuYXBwZW5kICQkIC0+XG4gICAgICAgICAgICAgICAgQHAgY2xhc3M6IHdyYXBwZXJDbGFzcywgPT5cbiAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6IHNwYW5DbGFzcywgdGV4dFxuXG4gICAgICAgIGlmIGNsaWNrQ2FsbGJhY2tcbiAgICAgICAgICAgIEBmaW5kKFwiLmNsaWNrYWJsZS0je2NsaWNrQ291bnRlcn1cIikub24gJ2NsaWNrJywgKGV2dCkgPT4gY2xpY2tDYWxsYmFjayhldnQpXG5cblxuICAgIGhpZGVSaWdodFRvcE9wdGlvbnM6IC0+XG4gICAgICAgIEBwYW5lbFJpZ2h0VG9wT3B0aW9ucy5hZGRDbGFzcygnaGlkZScpXG5cblxuICAgIHNob3dSaWdodFRvcE9wdGlvbnM6IC0+XG4gICAgICAgIEBwYW5lbFJpZ2h0VG9wT3B0aW9ucy5yZW1vdmVDbGFzcygnaGlkZScpXG5cblxuICAgIGhpZGVUaHJvYmJlcjogLT5cbiAgICAgICAgQHBhbmVsTG9hZGluZy5hZGRDbGFzcygnaGlkZScpXG5cblxuICAgIHNob3dUaHJvYmJlcjogLT5cbiAgICAgICAgQHBhbmVsTG9hZGluZy5yZW1vdmVDbGFzcygnaGlkZScpXG4iXX0=
