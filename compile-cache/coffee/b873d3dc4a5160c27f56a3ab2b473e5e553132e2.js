(function() {
  var $, CompositeDisposable, ConfigView, TextEditorView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = ConfigView = (function(superClass) {
    extend(ConfigView, superClass);

    function ConfigView() {
      return ConfigView.__super__.constructor.apply(this, arguments);
    }

    ConfigView.prototype.panel = null;

    ConfigView.content = function() {
      return this.div({
        "class": 'remote-sync'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            return _this.div({
              "class": 'btn-group',
              outlet: 'transportGroup'
            }, function() {
              _this.button({
                "class": 'btn  selected',
                targetBlock: 'authenticationButtonsBlock'
              }, 'SCP/SFTP');
              return _this.button({
                "class": 'btn',
                targetBlock: 'ftpPasswordBlock'
              }, 'FTP');
            });
          });
          _this.label('Hostname');
          _this.subview('hostname', new TextEditorView({
            mini: true
          }));
          _this.label('Port');
          _this.subview('port', new TextEditorView({
            mini: true
          }));
          _this.label('Target directory');
          _this.subview('target', new TextEditorView({
            mini: true
          }));
          _this.label('Ignore Paths');
          _this.subview('ignore', new TextEditorView({
            mini: true,
            placeholderText: "Default: .remote-sync.json, .git/**"
          }));
          _this.label('Username');
          _this.subview('username', new TextEditorView({
            mini: true
          }));
          _this.div({
            "class": 'block',
            outlet: 'authenticationButtonsBlock'
          }, function() {
            _this.div({
              "class": 'btn-group'
            }, function() {
              _this.a({
                "class": 'btn  selected',
                targetBlock: 'privateKeyBlock'
              }, 'privatekey');
              _this.a({
                "class": 'btn',
                targetBlock: 'passwordBlock'
              }, 'password');
              return _this.a({
                "class": 'btn',
                outlet: 'userAgentButton'
              }, 'useAgent');
            });
            _this.div({
              "class": 'block',
              outlet: 'privateKeyBlock'
            }, function() {
              _this.label('Keyfile path');
              _this.subview('privateKeyPath', new TextEditorView({
                mini: true
              }));
              _this.label('Passphrase');
              return _this.subview('privateKeyPassphrase', new TextEditorView({
                mini: true,
                placeholderText: "leave blank if private key is unencrypted"
              }));
            });
            return _this.div({
              "class": 'block',
              outlet: 'passwordBlock',
              style: 'display:none'
            }, function() {
              _this.label('Password');
              return _this.subview('password', new TextEditorView({
                mini: true
              }));
            });
          });
          _this.div({
            "class": 'block',
            outlet: 'ftpPasswordBlock',
            style: 'display:none'
          }, function() {
            return _this.label('Password');
          });
          _this.label('Watch automatically');
          _this.subview('watch', new TextEditorView({
            mini: true,
            placeholderText: "Files that will be automatically watched on project open"
          }));
          _this.div(function() {
            return _this.label(" uploadOnSave", function() {
              return _this.input({
                type: 'checkbox',
                outlet: 'uploadOnSave'
              });
            });
          });
          _this.div(function() {
            return _this.label(" useAtomicWrites", function() {
              return _this.input({
                type: 'checkbox',
                outlet: 'useAtomicWrites'
              });
            });
          });
          _this.label(" Delete local file/folder upon remote delete", function() {
            return _this.input({
              type: 'checkbox',
              outlet: 'deleteLocal'
            });
          });
          return _this.div({
            "class": 'block pull-right'
          }, function() {
            _this.button({
              "class": 'inline-block-tight btn',
              outlet: 'cancelButton',
              click: 'close'
            }, 'Cancel');
            return _this.button({
              "class": 'inline-block-tight btn',
              outlet: 'saveButton',
              click: 'confirm'
            }, 'Save');
          });
        };
      })(this));
    };

    ConfigView.prototype.initialize = function(host) {
      this.host = host;
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-workspace', {
        'core:confirm': (function(_this) {
          return function() {
            return _this.confirm();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function(event) {
            _this.close();
            return event.stopPropagation();
          };
        })(this)
      }));
      this.transportGroup.on('click', (function(_this) {
        return function(e) {
          var btn, targetBlock;
          e.preventDefault();
          btn = $(e.target);
          targetBlock = btn.addClass('selected').siblings('.selected').removeClass('selected').attr("targetBlock");
          if (targetBlock) {
            _this[targetBlock].hide();
          }
          targetBlock = btn.attr("targetBlock");
          if (targetBlock) {
            _this[targetBlock].show();
          }
          _this.host.transport = btn.text().split("/")[0].toLowerCase();
          if (_this.host.transport === "scp") {
            return _this.passwordBlock.append(_this.password);
          } else {
            return _this.ftpPasswordBlock.append(_this.password);
          }
        };
      })(this));
      return $('.btn-group .btn', this.authenticationButtonsBlock).on('click', (function(_this) {
        return function(e) {
          var targetBlock;
          e.preventDefault();
          targetBlock = $(e.target).addClass('selected').siblings('.selected').removeClass('selected').attr("targetBlock");
          if (targetBlock) {
            _this[targetBlock].hide();
          }
          targetBlock = $(e.target).attr("targetBlock");
          if (targetBlock) {
            return _this[targetBlock].show().find(".editor").first().focus();
          }
        };
      })(this));
    };

    ConfigView.prototype.attach = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.find(".editor").each((function(_this) {
        return function(i, editor) {
          var dataName;
          dataName = $(editor).prev().text().split(" ")[0].toLowerCase();
          return $(editor).view().setText(_this.host[dataName] || "");
        };
      })(this));
      this.uploadOnSave.prop('checked', this.host.uploadOnSave);
      this.useAtomicWrites.prop('checked', this.host.useAtomicWrites);
      this.deleteLocal.prop('checked', this.host.deleteLocal);
      if (this.host.transport) {
        $(":contains('" + this.host.transport.toUpperCase() + "')", this.transportGroup).click();
      }
      if (this.host.transport === "scp") {
        return $('.btn-group .btn', this.authenticationButtonsBlock).each((function(_this) {
          return function(i, btn) {
            btn = $(btn);
            if (!_this.host[btn.text()]) {
              return;
            }
            btn.click();
            return false;
          };
        })(this));
      }
    };

    ConfigView.prototype.close = function() {
      this.detach();
      this.panel.destroy();
      this.panel = null;
      return this.disposables.dispose();
    };

    ConfigView.prototype.confirm = function() {
      this.host.uploadOnSave = this.uploadOnSave.prop('checked');
      this.host.useAtomicWrites = this.useAtomicWrites.prop('checked');
      this.host.deleteLocal = this.deleteLocal.prop('checked');
      this.find(".editor").each((function(_this) {
        return function(i, editor) {
          var dataName, val, view;
          dataName = $(editor).prev().text().split(" ")[0].toLowerCase();
          view = $(editor).view();
          val = view.getText();
          if (val === "" || view.parent().isHidden() || view.parent().parent().isHidden()) {
            val = void 0;
          }
          return _this.host[dataName] = val;
        };
      })(this));
      if ((this.host.transport === void 0 || this.host.transport === "scp") && this.userAgentButton.hasClass('selected')) {
        this.host.useAgent = true;
      } else {
        this.host.useAgent = void 0;
      }
      this.host.saveJSON();
      return this.close();
    };

    return ConfigView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtc3luYy9saWIvdmlldy9ob3N0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2REFBQTtJQUFBOzs7RUFBQSxNQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFELEVBQUksZUFBSixFQUFVOztFQUNULHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozt5QkFDSixLQUFBLEdBQU87O0lBRVAsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sYUFBUDtPQUFMLEVBQTJCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUN6QixLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTSxPQUFOO1dBQUwsRUFBb0IsU0FBQTttQkFDbEIsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDtjQUFvQixNQUFBLEVBQVEsZ0JBQTVCO2FBQUwsRUFBbUQsU0FBQTtjQUNqRCxLQUFDLENBQUEsTUFBRCxDQUFRO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZUFBUDtnQkFBd0IsV0FBQSxFQUFhLDRCQUFyQztlQUFSLEVBQTJFLFVBQTNFO3FCQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxLQUFQO2dCQUFjLFdBQUEsRUFBWSxrQkFBMUI7ZUFBUixFQUFzRCxLQUF0RDtZQUZpRCxDQUFuRDtVQURrQixDQUFwQjtVQUtBLEtBQUMsQ0FBQSxLQUFELENBQU8sVUFBUDtVQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsVUFBVCxFQUFxQixJQUFJLGNBQUosQ0FBbUI7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SUFBVixDQUFBLENBQWdCLENBQUMsSUFBakIsQ0FBQSxDQUF1QixDQUFDLEtBQXhCLENBQThCLEdBQTlCLENBQW1DLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBdEMsQ0FBQTtVQUNYLElBQUEsR0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFBO1VBQ1AsR0FBQSxHQUFNLElBQUksQ0FBQyxPQUFMLENBQUE7VUFDTixJQUFtQixHQUFBLEtBQU8sRUFBUCxJQUFhLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBYSxDQUFDLFFBQWQsQ0FBQSxDQUFiLElBQXlDLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBYSxDQUFDLE1BQWQsQ0FBQSxDQUFzQixDQUFDLFFBQXZCLENBQUEsQ0FBNUQ7WUFBQSxHQUFBLEdBQU0sT0FBTjs7aUJBQ0EsS0FBQyxDQUFBLElBQUssQ0FBQSxRQUFBLENBQU4sR0FBa0I7UUFMRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEI7TUFPQSxJQUFHLENBQUMsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEtBQW1CLE1BQW5CLElBQWdDLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixLQUFtQixLQUFwRCxDQUFBLElBQStELElBQUMsQ0FBQSxlQUFlLENBQUMsUUFBakIsQ0FBMEIsVUFBMUIsQ0FBbEU7UUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sR0FBaUIsS0FEbkI7T0FBQSxNQUFBO1FBR0UsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLEdBQWlCLE9BSG5COztNQUtBLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBQTtJQWpCTzs7OztLQXBIYztBQUp6QiIsInNvdXJjZXNDb250ZW50IjpbInskLCBWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENvbmZpZ1ZpZXcgZXh0ZW5kcyBWaWV3XG4gIHBhbmVsOiBudWxsXG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ3JlbW90ZS1zeW5jJywgPT5cbiAgICAgIEBkaXYgY2xhc3M6J2Jsb2NrJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2J0bi1ncm91cCcsIG91dGxldDogJ3RyYW5zcG9ydEdyb3VwJywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuICBzZWxlY3RlZCcsIHRhcmdldEJsb2NrOiAnYXV0aGVudGljYXRpb25CdXR0b25zQmxvY2snLCAnU0NQL1NGVFAnXG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0bicsIHRhcmdldEJsb2NrOidmdHBQYXNzd29yZEJsb2NrJywgJ0ZUUCdcblxuICAgICAgQGxhYmVsICdIb3N0bmFtZSdcbiAgICAgIEBzdWJ2aWV3ICdob3N0bmFtZScsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuXG4gICAgICBAbGFiZWwgJ1BvcnQnXG4gICAgICBAc3VidmlldyAncG9ydCcsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuXG4gICAgICBAbGFiZWwgJ1RhcmdldCBkaXJlY3RvcnknXG4gICAgICBAc3VidmlldyAndGFyZ2V0JywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG5cbiAgICAgIEBsYWJlbCAnSWdub3JlIFBhdGhzJ1xuICAgICAgQHN1YnZpZXcgJ2lnbm9yZScsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6IFwiRGVmYXVsdDogLnJlbW90ZS1zeW5jLmpzb24sIC5naXQvKipcIilcblxuICAgICAgQGxhYmVsICdVc2VybmFtZSdcbiAgICAgIEBzdWJ2aWV3ICd1c2VybmFtZScsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuXG4gICAgICBAZGl2IGNsYXNzOiAnYmxvY2snLCBvdXRsZXQ6ICdhdXRoZW50aWNhdGlvbkJ1dHRvbnNCbG9jaycsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdidG4tZ3JvdXAnLCA9PlxuICAgICAgICAgIEBhIGNsYXNzOiAnYnRuICBzZWxlY3RlZCcsIHRhcmdldEJsb2NrOiAncHJpdmF0ZUtleUJsb2NrJywgJ3ByaXZhdGVrZXknXG4gICAgICAgICAgQGEgY2xhc3M6ICdidG4nLCB0YXJnZXRCbG9jazogJ3Bhc3N3b3JkQmxvY2snLCAncGFzc3dvcmQnXG4gICAgICAgICAgQGEgY2xhc3M6ICdidG4nLCBvdXRsZXQ6ICd1c2VyQWdlbnRCdXR0b24nLCAndXNlQWdlbnQnXG5cbiAgICAgICAgQGRpdiBjbGFzczogJ2Jsb2NrJywgb3V0bGV0OiAncHJpdmF0ZUtleUJsb2NrJywgPT5cbiAgICAgICAgICBAbGFiZWwgJ0tleWZpbGUgcGF0aCdcbiAgICAgICAgICBAc3VidmlldyAncHJpdmF0ZUtleVBhdGgnLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgICBAbGFiZWwgJ1Bhc3NwaHJhc2UnXG4gICAgICAgICAgQHN1YnZpZXcgJ3ByaXZhdGVLZXlQYXNzcGhyYXNlJywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogXCJsZWF2ZSBibGFuayBpZiBwcml2YXRlIGtleSBpcyB1bmVuY3J5cHRlZFwiKVxuXG4gICAgICAgIEBkaXYgY2xhc3M6ICdibG9jaycsIG91dGxldDogJ3Bhc3N3b3JkQmxvY2snLCBzdHlsZTogJ2Rpc3BsYXk6bm9uZScsID0+XG4gICAgICAgICAgQGxhYmVsICdQYXNzd29yZCdcbiAgICAgICAgICBAc3VidmlldyAncGFzc3dvcmQnLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcblxuICAgICAgQGRpdiBjbGFzczogJ2Jsb2NrJywgb3V0bGV0OiAnZnRwUGFzc3dvcmRCbG9jaycsIHN0eWxlOiAnZGlzcGxheTpub25lJywgPT5cbiAgICAgICAgQGxhYmVsICdQYXNzd29yZCdcblxuICAgICAgQGxhYmVsICdXYXRjaCBhdXRvbWF0aWNhbGx5J1xuICAgICAgQHN1YnZpZXcgJ3dhdGNoJywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogXCJGaWxlcyB0aGF0IHdpbGwgYmUgYXV0b21hdGljYWxseSB3YXRjaGVkIG9uIHByb2plY3Qgb3BlblwiKVxuXG4gICAgICBAZGl2ID0+XG4gICAgICAgIEBsYWJlbCBcIiB1cGxvYWRPblNhdmVcIiwgPT5cbiAgICAgICAgICBAaW5wdXQgdHlwZTogJ2NoZWNrYm94Jywgb3V0bGV0OiAndXBsb2FkT25TYXZlJ1xuXG4gICAgICBAZGl2ID0+XG4gICAgICAgIEBsYWJlbCBcIiB1c2VBdG9taWNXcml0ZXNcIiwgPT5cbiAgICAgICAgICBAaW5wdXQgdHlwZTogJ2NoZWNrYm94Jywgb3V0bGV0OiAndXNlQXRvbWljV3JpdGVzJ1xuXG4gICAgICBAbGFiZWwgXCIgRGVsZXRlIGxvY2FsIGZpbGUvZm9sZGVyIHVwb24gcmVtb3RlIGRlbGV0ZVwiLCA9PlxuICAgICAgICBAaW5wdXQgdHlwZTogJ2NoZWNrYm94Jywgb3V0bGV0OiAnZGVsZXRlTG9jYWwnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdibG9jayBwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2lubGluZS1ibG9jay10aWdodCBidG4nLCBvdXRsZXQ6ICdjYW5jZWxCdXR0b24nLCBjbGljazogJ2Nsb3NlJywgJ0NhbmNlbCdcbiAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2lubGluZS1ibG9jay10aWdodCBidG4nLCBvdXRsZXQ6ICdzYXZlQnV0dG9uJywgY2xpY2s6ICdjb25maXJtJywgJ1NhdmUnXG5cbiAgaW5pdGlhbGl6ZTogKEBob3N0KSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgICAnY29yZTpjb25maXJtJzogPT4gQGNvbmZpcm0oKVxuICAgICAgICAnY29yZTpjYW5jZWwnOiAoZXZlbnQpID0+XG4gICAgICAgICAgQGNsb3NlKClcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgQHRyYW5zcG9ydEdyb3VwLm9uICdjbGljaycsIChlKT0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGJ0biA9ICQoZS50YXJnZXQpXG4gICAgICB0YXJnZXRCbG9jayA9IGJ0bi5hZGRDbGFzcygnc2VsZWN0ZWQnKS5zaWJsaW5ncygnLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJykuYXR0cihcInRhcmdldEJsb2NrXCIpXG4gICAgICB0aGlzW3RhcmdldEJsb2NrXS5oaWRlKCkgaWYgdGFyZ2V0QmxvY2tcblxuICAgICAgdGFyZ2V0QmxvY2sgPSBidG4uYXR0cihcInRhcmdldEJsb2NrXCIpXG4gICAgICB0aGlzW3RhcmdldEJsb2NrXS5zaG93KCkgaWYgdGFyZ2V0QmxvY2tcbiAgICAgIEBob3N0LnRyYW5zcG9ydCA9IGJ0bi50ZXh0KCkuc3BsaXQoXCIvXCIpWzBdLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmIEBob3N0LnRyYW5zcG9ydCA9PSBcInNjcFwiXG4gICAgICAgIEBwYXNzd29yZEJsb2NrLmFwcGVuZChAcGFzc3dvcmQpXG4gICAgICBlbHNlXG4gICAgICAgIEBmdHBQYXNzd29yZEJsb2NrLmFwcGVuZChAcGFzc3dvcmQpXG5cbiAgICAkKCcuYnRuLWdyb3VwIC5idG4nLCBAYXV0aGVudGljYXRpb25CdXR0b25zQmxvY2spLm9uICdjbGljaycsIChlKT0+XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHRhcmdldEJsb2NrID0gJChlLnRhcmdldCkuYWRkQ2xhc3MoJ3NlbGVjdGVkJykuc2libGluZ3MoJy5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpLmF0dHIoXCJ0YXJnZXRCbG9ja1wiKVxuICAgICAgdGhpc1t0YXJnZXRCbG9ja10uaGlkZSgpIGlmIHRhcmdldEJsb2NrXG5cbiAgICAgIHRhcmdldEJsb2NrID0gJChlLnRhcmdldCkuYXR0cihcInRhcmdldEJsb2NrXCIpXG4gICAgICB0aGlzW3RhcmdldEJsb2NrXS5zaG93KCkuZmluZChcIi5lZGl0b3JcIikuZmlyc3QoKS5mb2N1cygpIGlmIHRhcmdldEJsb2NrXG5cbiAgYXR0YWNoOiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsIGl0ZW06IHRoaXNcblxuICAgIEBmaW5kKFwiLmVkaXRvclwiKS5lYWNoIChpLCBlZGl0b3IpPT5cbiAgICAgIGRhdGFOYW1lID0gJChlZGl0b3IpLnByZXYoKS50ZXh0KCkuc3BsaXQoXCIgXCIpWzBdLnRvTG93ZXJDYXNlKClcbiAgICAgICQoZWRpdG9yKS52aWV3KCkuc2V0VGV4dChAaG9zdFtkYXRhTmFtZV0gb3IgXCJcIilcblxuICAgIEB1cGxvYWRPblNhdmUucHJvcCgnY2hlY2tlZCcsIEBob3N0LnVwbG9hZE9uU2F2ZSlcbiAgICBAdXNlQXRvbWljV3JpdGVzLnByb3AoJ2NoZWNrZWQnLCBAaG9zdC51c2VBdG9taWNXcml0ZXMpXG4gICAgQGRlbGV0ZUxvY2FsLnByb3AoJ2NoZWNrZWQnLCBAaG9zdC5kZWxldGVMb2NhbClcbiAgICAkKFwiOmNvbnRhaW5zKCdcIitAaG9zdC50cmFuc3BvcnQudG9VcHBlckNhc2UoKStcIicpXCIsIEB0cmFuc3BvcnRHcm91cCkuY2xpY2soKSBpZiBAaG9zdC50cmFuc3BvcnRcbiAgICBpZiBAaG9zdC50cmFuc3BvcnQgaXMgXCJzY3BcIlxuICAgICAgJCgnLmJ0bi1ncm91cCAuYnRuJywgQGF1dGhlbnRpY2F0aW9uQnV0dG9uc0Jsb2NrKS5lYWNoIChpLCBidG4pPT5cbiAgICAgICAgYnRuID0gJChidG4pXG4gICAgICAgIHJldHVybiB1bmxlc3MgQGhvc3RbYnRuLnRleHQoKV1cbiAgICAgICAgYnRuLmNsaWNrKClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgY2xvc2U6IC0+XG4gICAgQGRldGFjaCgpXG4gICAgQHBhbmVsLmRlc3Ryb3koKVxuICAgIEBwYW5lbCA9IG51bGxcbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbiAgY29uZmlybTogLT5cbiAgICBAaG9zdC51cGxvYWRPblNhdmUgPSBAdXBsb2FkT25TYXZlLnByb3AoJ2NoZWNrZWQnKVxuICAgIEBob3N0LnVzZUF0b21pY1dyaXRlcyA9IEB1c2VBdG9taWNXcml0ZXMucHJvcCgnY2hlY2tlZCcpXG4gICAgQGhvc3QuZGVsZXRlTG9jYWwgPSBAZGVsZXRlTG9jYWwucHJvcCgnY2hlY2tlZCcpXG4gICAgQGZpbmQoXCIuZWRpdG9yXCIpLmVhY2ggKGksIGVkaXRvcik9PlxuICAgICAgZGF0YU5hbWUgPSAkKGVkaXRvcikucHJldigpLnRleHQoKS5zcGxpdChcIiBcIilbMF0udG9Mb3dlckNhc2UoKVxuICAgICAgdmlldyA9ICQoZWRpdG9yKS52aWV3KClcbiAgICAgIHZhbCA9IHZpZXcuZ2V0VGV4dCgpXG4gICAgICB2YWwgPSB1bmRlZmluZWQgaWYgdmFsID09IFwiXCIgb3Igdmlldy5wYXJlbnQoKS5pc0hpZGRlbigpIG9yIHZpZXcucGFyZW50KCkucGFyZW50KCkuaXNIaWRkZW4oKVxuICAgICAgQGhvc3RbZGF0YU5hbWVdID0gdmFsXG5cbiAgICBpZiAoQGhvc3QudHJhbnNwb3J0ID09IHVuZGVmaW5lZCBvciBAaG9zdC50cmFuc3BvcnQgPT0gXCJzY3BcIikgYW5kIEB1c2VyQWdlbnRCdXR0b24uaGFzQ2xhc3MoJ3NlbGVjdGVkJylcbiAgICAgIEBob3N0LnVzZUFnZW50ID0gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIEBob3N0LnVzZUFnZW50ID0gdW5kZWZpbmVkXG5cbiAgICBAaG9zdC5zYXZlSlNPTigpXG4gICAgQGNsb3NlKClcbiJdfQ==
