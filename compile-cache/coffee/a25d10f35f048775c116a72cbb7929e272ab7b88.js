(function() {
  var ApiPath, AtomJsonEditor, AtomJsonEditorView, CompositeDisposable, Directory, File, JSONEditor, defaultSchemesDir, ref;

  AtomJsonEditorView = require('./atom-json-editor-view');

  JSONEditor = require('./deps/jsoneditor.min.js');

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, File = ref.File, Directory = ref.Directory;

  ApiPath = require('path');

  defaultSchemesDir = 'Package Schemes';

  module.exports = AtomJsonEditor = {
    config: {
      schemesDir: {
        title: 'Schemes Directory',
        type: 'string',
        description: 'Path to a directory containing JSON schemes',
        "default": defaultSchemesDir
      }
    },
    atomJsonEditorView: null,
    modalPanel: null,
    editor: null,
    activate: function(state) {
      this.atomJsonEditorView = new AtomJsonEditorView(state.atomJsonEditorViewState);
      this.modalPanel = atom.workspace.addRightPanel({
        item: this.atomJsonEditorView.getElement(),
        visible: false
      });
      this.checkActiveFile();
      return atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.checkActiveFile();
        };
      })(this));
    },
    deactivate: function() {
      this.modalPanel.destroy();
      this.subscriptions.dispose();
      return this.atomJsonEditorView.destroy();
    },
    serialize: function() {
      return {
        atomJsonEditorViewState: this.atomJsonEditorView.serialize()
      };
    },
    toggle: function() {
      if (this.modalPanel.isVisible()) {
        this.modalPanel.hide();
        this.save();
        return this.end();
      } else {
        this.modalPanel.show();
        return this.start();
      }
    },
    checkActiveFile: function() {
      var error, match, path, regex;
      this.end();
      try {
        path = atom.workspace.getActiveTextEditor().getPath();
        regex = /([\-\_a-z0-9]*).json$/i;
        match = regex.exec(path);
        if (match != null) {
          return this.startForSchemaWithName(ApiPath.dirname(path), match[1]);
        }
      } catch (error1) {
        error = error1;
      }
    },
    startForSchemaWithName: function(path, name) {
      var dir, directory, localSchema, localSchemaPath, packageSchemaPath, schemaFilename;
      schemaFilename = name + '.schema.json';
      packageSchemaPath = __dirname + '/schemes/' + schemaFilename;
      localSchemaPath = ApiPath.join(path, schemaFilename);
      localSchema = new File(localSchemaPath);
      if (localSchema.existsSync()) {
        return this.startForSchemaAtPath(localSchemaPath);
      } else {
        dir = atom.config.get('atom-json-editor.schemesDir');
        if (dir === defaultSchemesDir) {
          return this.startForSchemaAtPath(packageSchemaPath);
        } else {
          directory = new Directory(dir);
          if (directory.existsSync()) {
            return this.startForSchemaAtPath(dir + '/' + schemaFilename, packageSchemaPath);
          } else {
            return atom.notifications.addError(dir + 'does not exist', {
              detail: 'Invalid schemes directory'
            });
          }
        }
      }
    },
    startForSchemaAtPath: function(path, fallback) {
      var file;
      file = new File(path);
      if (file.existsSync()) {
        return (file.read(true)).then((function(_this) {
          return function(schemaString) {
            var error;
            try {
              return _this.start(JSON.parse(schemaString));
            } catch (error1) {
              error = error1;
              return atom.notifications.addError("Schema at " + path + " contains invalid JSON", {
                detail: error
              });
            }
          };
        })(this));
      } else {
        if (fallback != null) {
          return this.startForSchemaAtPath(fallback);
        }
      }
    },
    save: function() {
      var editor, indent, value;
      editor = atom.workspace.getActiveTextEditor();
      value = this.editor.getValue();
      indent = editor.getSoftTabs() ? ' '.repeat(editor.getTabLength()) : '\t';
      editor.setText(JSON.stringify(value, null, indent));
      return editor.save();
    },
    start: function(schema) {
      var error, startval, text;
      text = atom.workspace.getActiveTextEditor().getText();
      startval = null;
      if (text) {
        try {
          startval = JSON.parse(text);
        } catch (error1) {
          error = error1;
          atom.notifications.addWarning('File contains no valid JSON. Initilized with empty object value', {
            detail: error
          });
        }
      }
      this.editor = new JSONEditor(this.atomJsonEditorView.editorContainer, {
        theme: 'bootstrap2',
        iconlib: 'bootstrap2',
        disable_edit_json: true,
        remove_empty_properties: true,
        show_errors: "always",
        schema: schema,
        startval: startval
      });
      this.editor.on('change', (function(_this) {
        return function() {
          return _this.save();
        };
      })(this));
      return this.modalPanel.show();
    },
    end: function() {
      var ref1;
      this.modalPanel.hide();
      return (ref1 = this.editor) != null ? ref1.destroy() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWpzb24tZWRpdG9yL2xpYi9hdG9tLWpzb24tZWRpdG9yLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHlCQUFSOztFQUNyQixVQUFBLEdBQWEsT0FBQSxDQUFRLDBCQUFSOztFQUNiLE1BQXlDLE9BQUEsQ0FBUSxNQUFSLENBQXpDLEVBQUMsNkNBQUQsRUFBc0IsZUFBdEIsRUFBNEI7O0VBQzVCLE9BQUEsR0FBVSxPQUFBLENBQVEsTUFBUjs7RUFHVixpQkFBQSxHQUFvQjs7RUFFcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FBQSxHQUNmO0lBQUEsTUFBQSxFQUNFO01BQUEsVUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLG1CQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxXQUFBLEVBQWEsNkNBRmI7UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGlCQUhUO09BREY7S0FERjtJQVFBLGtCQUFBLEVBQW9CLElBUnBCO0lBU0EsVUFBQSxFQUFZLElBVFo7SUFVQSxNQUFBLEVBQVEsSUFWUjtJQVlBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBSSxrQkFBSixDQUF1QixLQUFLLENBQUMsdUJBQTdCO01BQ3RCLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1FBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxVQUFwQixDQUFBLENBQU47UUFBd0MsT0FBQSxFQUFTLEtBQWpEO09BQTdCO01BR2QsSUFBQyxDQUFBLGVBQUQsQ0FBQTthQUNBLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFNLEtB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O1dBREYsRUFIRjtTQURGOztNQVFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxVQUFKLENBQWUsSUFBQyxDQUFBLGtCQUFrQixDQUFDLGVBQW5DLEVBQ1I7UUFBQSxLQUFBLEVBQU8sWUFBUDtRQUNBLE9BQUEsRUFBUyxZQURUO1FBRUEsaUJBQUEsRUFBbUIsSUFGbkI7UUFJQSx1QkFBQSxFQUF5QixJQUp6QjtRQU1BLFdBQUEsRUFBYSxRQU5iO1FBT0EsTUFBQSxFQUFRLE1BUFI7UUFRQSxRQUFBLEVBQVUsUUFSVjtPQURRO01BV1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsUUFBWCxFQUFxQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQU0sS0FBQyxDQUFBLElBQUQsQ0FBQTtRQUFOO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjthQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFBO0lBekJLLENBaEdQO0lBMkhBLEdBQUEsRUFBSyxTQUFBO0FBQ0gsVUFBQTtNQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFBO2dEQUNPLENBQUUsT0FBVCxDQUFBO0lBRkcsQ0EzSEw7O0FBVEYiLCJzb3VyY2VzQ29udGVudCI6WyJBdG9tSnNvbkVkaXRvclZpZXcgPSByZXF1aXJlICcuL2F0b20tanNvbi1lZGl0b3ItdmlldydcbkpTT05FZGl0b3IgPSByZXF1aXJlICcuL2RlcHMvanNvbmVkaXRvci5taW4uanMnXG57Q29tcG9zaXRlRGlzcG9zYWJsZSwgRmlsZSwgRGlyZWN0b3J5fSA9IHJlcXVpcmUgJ2F0b20nXG5BcGlQYXRoID0gcmVxdWlyZSAncGF0aCdcblxuIyBDb25zdGFudHNcbmRlZmF1bHRTY2hlbWVzRGlyID0gJ1BhY2thZ2UgU2NoZW1lcydcblxubW9kdWxlLmV4cG9ydHMgPSBBdG9tSnNvbkVkaXRvciA9XG4gIGNvbmZpZzpcbiAgICBzY2hlbWVzRGlyOlxuICAgICAgdGl0bGU6ICdTY2hlbWVzIERpcmVjdG9yeSdcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZXNjcmlwdGlvbjogJ1BhdGggdG8gYSBkaXJlY3RvcnkgY29udGFpbmluZyBKU09OIHNjaGVtZXMnXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0U2NoZW1lc0RpclxuXG5cbiAgYXRvbUpzb25FZGl0b3JWaWV3OiBudWxsXG4gIG1vZGFsUGFuZWw6IG51bGxcbiAgZWRpdG9yOiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAYXRvbUpzb25FZGl0b3JWaWV3ID0gbmV3IEF0b21Kc29uRWRpdG9yVmlldyhzdGF0ZS5hdG9tSnNvbkVkaXRvclZpZXdTdGF0ZSlcbiAgICBAbW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZFJpZ2h0UGFuZWwoaXRlbTogQGF0b21Kc29uRWRpdG9yVmlldy5nZXRFbGVtZW50KCksIHZpc2libGU6IGZhbHNlKVxuXG4gICAgIyBjaGVjayBhY3RpdmUgZmlsZSBub3cgYW5kIG9uIGFueSBuZXcgb3BlbmVkIGZpbGVcbiAgICBAY2hlY2tBY3RpdmVGaWxlKCk7XG4gICAgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoKSA9PiBAY2hlY2tBY3RpdmVGaWxlKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBtb2RhbFBhbmVsLmRlc3Ryb3koKVxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIEBhdG9tSnNvbkVkaXRvclZpZXcuZGVzdHJveSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIGF0b21Kc29uRWRpdG9yVmlld1N0YXRlOiBAYXRvbUpzb25FZGl0b3JWaWV3LnNlcmlhbGl6ZSgpXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGlmIEBtb2RhbFBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICBAbW9kYWxQYW5lbC5oaWRlKClcbiAgICAgIEBzYXZlKClcbiAgICAgIEBlbmQoKVxuICAgIGVsc2VcbiAgICAgIEBtb2RhbFBhbmVsLnNob3coKVxuICAgICAgQHN0YXJ0KClcblxuICAjIEVkaXRvciBtZXRob2RzXG4gIGNoZWNrQWN0aXZlRmlsZTogLT5cbiAgICBAZW5kKClcblxuICAgIHRyeVxuICAgICAgcGF0aCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRQYXRoKClcbiAgICAgIHJlZ2V4ID0gLyhbXFwtXFxfYS16MC05XSopLmpzb24kL2lcbiAgICAgIG1hdGNoID0gcmVnZXguZXhlYyBwYXRoXG5cbiAgICAgIGlmIG1hdGNoP1xuICAgICAgICBAc3RhcnRGb3JTY2hlbWFXaXRoTmFtZSBBcGlQYXRoLmRpcm5hbWUocGF0aCksIG1hdGNoWzFdXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgICMgQ291bGQgbm90IGdldCBmaWxlcGF0aC5cbiAgICAgICMgUHJvYmFibHkgU2V0dGluZ3MgaXMgb3BlblxuXG4gIHN0YXJ0Rm9yU2NoZW1hV2l0aE5hbWU6IChwYXRoLCBuYW1lKSAtPlxuICAgIHNjaGVtYUZpbGVuYW1lID0gbmFtZSArICcuc2NoZW1hLmpzb24nXG4gICAgcGFja2FnZVNjaGVtYVBhdGggPSBfX2Rpcm5hbWUgKyAnL3NjaGVtZXMvJyArIHNjaGVtYUZpbGVuYW1lXG4gICAgbG9jYWxTY2hlbWFQYXRoID0gQXBpUGF0aC5qb2luKHBhdGgsIHNjaGVtYUZpbGVuYW1lKVxuXG4gICAgbG9jYWxTY2hlbWEgPSBuZXcgRmlsZSBsb2NhbFNjaGVtYVBhdGhcbiAgICBpZiBsb2NhbFNjaGVtYS5leGlzdHNTeW5jKClcbiAgICAgIEBzdGFydEZvclNjaGVtYUF0UGF0aCBsb2NhbFNjaGVtYVBhdGhcbiAgICBlbHNlXG4gICAgICBkaXIgPSBhdG9tLmNvbmZpZy5nZXQgJ2F0b20tanNvbi1lZGl0b3Iuc2NoZW1lc0RpcidcbiAgICAgIGlmIGRpciA9PSBkZWZhdWx0U2NoZW1lc0RpclxuICAgICAgICAjIFRyeSBpbiBwYWNrYWdlIHNjaGVtZSBkaXJcbiAgICAgICAgQHN0YXJ0Rm9yU2NoZW1hQXRQYXRoIHBhY2thZ2VTY2hlbWFQYXRoXG4gICAgICBlbHNlICMgQ2hlY2sgaWYgZGlyZWN0b3J5IHNwZWNpZmllZCBpbiBjb25maWcgZXhpc3RzXG4gICAgICAgIGRpcmVjdG9yeSA9IG5ldyBEaXJlY3RvcnkgZGlyXG4gICAgICAgIGlmIGRpcmVjdG9yeS5leGlzdHNTeW5jKClcbiAgICAgICAgICAjIFRyeSBpbiBjb25maWcgZGlyXG4gICAgICAgICAgQHN0YXJ0Rm9yU2NoZW1hQXRQYXRoIGRpciArICcvJyArIHNjaGVtYUZpbGVuYW1lLCBwYWNrYWdlU2NoZW1hUGF0aFxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIGRpciArICdkb2VzIG5vdCBleGlzdCcsXG4gICAgICAgICAgICBkZXRhaWw6ICdJbnZhbGlkIHNjaGVtZXMgZGlyZWN0b3J5J1xuXG4gIHN0YXJ0Rm9yU2NoZW1hQXRQYXRoOiAocGF0aCwgZmFsbGJhY2spIC0+XG4gICAgZmlsZSA9IG5ldyBGaWxlIHBhdGhcblxuICAgIGlmIGZpbGUuZXhpc3RzU3luYygpXG4gICAgICAoZmlsZS5yZWFkIHRydWUpLnRoZW4gKHNjaGVtYVN0cmluZykgPT5cbiAgICAgICAgdHJ5XG4gICAgICAgICAgQHN0YXJ0IEpTT04ucGFyc2Ugc2NoZW1hU3RyaW5nXG4gICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwiU2NoZW1hIGF0ICN7cGF0aH0gY29udGFpbnMgaW52YWxpZCBKU09OXCIsXG4gICAgICAgICAgICBkZXRhaWw6IGVycm9yXG4gICAgZWxzZVxuICAgICAgIyBGYWlsZWQgd2l0aCB0aGUgZ2l2ZW4gcGF0aCwgdHJ5IHdpdGggZmFsbGJhY2sgaWYgc2V0XG4gICAgICBAc3RhcnRGb3JTY2hlbWFBdFBhdGggZmFsbGJhY2sgaWYgZmFsbGJhY2s/XG5cbiAgc2F2ZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICB2YWx1ZSA9IEBlZGl0b3IuZ2V0VmFsdWUoKVxuXG4gICAgaW5kZW50ID0gaWYgZWRpdG9yLmdldFNvZnRUYWJzKCkgdGhlbiAnICcucmVwZWF0IGVkaXRvci5nZXRUYWJMZW5ndGgoKSBlbHNlICdcXHQnXG4gICAgZWRpdG9yLnNldFRleHQgSlNPTi5zdHJpbmdpZnkgdmFsdWUsIG51bGwsIGluZGVudFxuICAgIGVkaXRvci5zYXZlKClcblxuICBzdGFydDogKHNjaGVtYSkgLT5cbiAgICB0ZXh0ID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFRleHQoKVxuICAgIHN0YXJ0dmFsID0gbnVsbFxuXG4gICAgaWYgdGV4dFxuICAgICAgdHJ5XG4gICAgICAgIHN0YXJ0dmFsID0gSlNPTi5wYXJzZSB0ZXh0XG4gICAgICBjYXRjaCBlcnJvclxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyAnRmlsZSBjb250YWlucyBubyB2YWxpZCBKU09OLiBJbml0aWxpemVkIHdpdGggZW1wdHkgb2JqZWN0IHZhbHVlJyxcbiAgICAgICAgICBkZXRhaWw6IGVycm9yXG5cblxuICAgIEBlZGl0b3IgPSBuZXcgSlNPTkVkaXRvciBAYXRvbUpzb25FZGl0b3JWaWV3LmVkaXRvckNvbnRhaW5lcixcbiAgICAgIHRoZW1lOiAnYm9vdHN0cmFwMidcbiAgICAgIGljb25saWI6ICdib290c3RyYXAyJ1xuICAgICAgZGlzYWJsZV9lZGl0X2pzb246IHRydWVcbiMgICAgICBkaXNhYmxlX3Byb3BlcnRpZXM6IHRydWVcbiAgICAgIHJlbW92ZV9lbXB0eV9wcm9wZXJ0aWVzOiB0cnVlXG4jICAgICAgbm9fYWRkaXRpb25hbF9wcm9wZXJ0aWVzOiB0cnVlXG4gICAgICBzaG93X2Vycm9yczogXCJhbHdheXNcIlxuICAgICAgc2NoZW1hOiBzY2hlbWFcbiAgICAgIHN0YXJ0dmFsOiBzdGFydHZhbFxuXG4gICAgQGVkaXRvci5vbiAnY2hhbmdlJywgKCkgPT4gQHNhdmUoKVxuXG4gICAgQG1vZGFsUGFuZWwuc2hvdygpXG5cbiAgZW5kOiAtPlxuICAgIEBtb2RhbFBhbmVsLmhpZGUoKVxuICAgIEBlZGl0b3I/LmRlc3Ryb3koKVxuIl19
