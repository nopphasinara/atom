(function() {
  var CompositeDisposable, actionDecorator, atomActionName, editorProxy, emmet, emmetActions, fs, getUserHome, isValidTabContext, k, loadExtensions, multiSelectionActionDecorator, path, ref, registerInteractiveActions, resources, runAction, singleSelectionActions, toggleCommentSyntaxes, v;

  path = require('path');

  fs = require('fs');

  CompositeDisposable = require('atom').CompositeDisposable;

  emmet = require('emmet');

  emmetActions = require('emmet/lib/action/main');

  resources = require('emmet/lib/assets/resources');

  editorProxy = require('./editor-proxy');

  singleSelectionActions = ['prev_edit_point', 'next_edit_point', 'merge_lines', 'reflect_css_value', 'select_next_item', 'select_previous_item', 'wrap_with_abbreviation', 'update_tag'];

  toggleCommentSyntaxes = ['html', 'css', 'less', 'scss'];

  ref = atom.config.get('emmet.stylus');
  for (k in ref) {
    v = ref[k];
    emmet.preferences.set('stylus.' + k, v);
  }

  getUserHome = function() {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE;
    }
    return process.env.HOME;
  };

  isValidTabContext = function() {
    var contains, scopes;
    if (editorProxy.getGrammar() === 'html') {
      scopes = editorProxy.getCurrentScope();
      contains = function(regexp) {
        return scopes.filter(function(s) {
          return regexp.test(s);
        }).length;
      };
      if (contains(/\.js\.embedded\./)) {
        return contains(/^string\./);
      }
    }
    return true;
  };

  actionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return runAction(action, evt);
        };
      })(this));
    };
  };

  multiSelectionActionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return editorProxy.exec(function(i) {
            runAction(action, evt);
            if (evt.keyBindingAborted) {
              return false;
            }
          });
        };
      })(this));
    };
  };

  runAction = function(action, evt) {
    var activeEditor, result, se, syntax;
    syntax = editorProxy.getSyntax();
    if (action === 'expand_abbreviation_with_tab') {
      activeEditor = editorProxy.editor;
      if (!isValidTabContext() || !activeEditor.getLastSelection().isEmpty()) {
        return evt.abortKeyBinding();
      }
      if (activeEditor.snippetExpansion) {
        se = activeEditor.snippetExpansion;
        if (se.tabStopIndex + 1 >= se.tabStopMarkers.length) {
          se.destroy();
        } else {
          return evt.abortKeyBinding();
        }
      }
    }
    if (action === 'toggle_comment' && (toggleCommentSyntaxes.indexOf(syntax) === -1 || !atom.config.get('emmet.useEmmetComments'))) {
      return evt.abortKeyBinding();
    }
    if (action === 'insert_formatted_line_break_only') {
      if (!atom.config.get('emmet.formatLineBreaks')) {
        return evt.abortKeyBinding();
      }
      result = emmet.run(action, editorProxy);
      if (!result) {
        return evt.abortKeyBinding();
      } else {
        return true;
      }
    }
    return emmet.run(action, editorProxy);
  };

  atomActionName = function(name) {
    return 'emmet:' + name.replace(/_/g, '-');
  };

  registerInteractiveActions = function(actions) {
    var j, len, name, ref1, results;
    ref1 = ['wrap_with_abbreviation', 'update_tag', 'interactive_expand_abbreviation'];
    results = [];
    for (j = 0, len = ref1.length; j < len; j++) {
      name = ref1[j];
      results.push((function(name) {
        var atomAction;
        atomAction = atomActionName(name);
        return actions[atomAction] = function(evt) {
          var interactive;
          editorProxy.setup(this.getModel());
          interactive = require('./interactive');
          return interactive.run(name, editorProxy);
        };
      })(name));
    }
    return results;
  };

  loadExtensions = function() {
    var extPath, files;
    extPath = atom.config.get('emmet.extensionsPath');
    console.log('Loading Emmet extensions from', extPath);
    if (!extPath) {
      return;
    }
    if (extPath[0] === '~') {
      extPath = getUserHome() + extPath.substr(1);
    }
    if (fs.existsSync(extPath)) {
      emmet.resetUserData();
      files = fs.readdirSync(extPath);
      files = files.map(function(item) {
        return path.join(extPath, item);
      }).filter(function(file) {
        return !fs.statSync(file).isDirectory();
      });
      return emmet.loadExtensions(files);
    } else {
      return console.warn('Emmet: no such extension folder:', extPath);
    }
  };

  module.exports = {
    config: {
      extensionsPath: {
        type: 'string',
        "default": '~/emmet'
      },
      formatLineBreaks: {
        type: 'boolean',
        "default": true
      },
      useEmmetComments: {
        type: 'boolean',
        "default": false,
        description: 'disable to use atom native commenting system'
      }
    },
    activate: function(state) {
      var action, atomAction, cmd, j, len, ref1;
      this.state = state;
      this.subscriptions = new CompositeDisposable;
      if (!this.actions) {
        this.subscriptions.add(atom.config.observe('emmet.extensionsPath', loadExtensions));
        this.actions = {};
        registerInteractiveActions(this.actions);
        ref1 = emmetActions.getList();
        for (j = 0, len = ref1.length; j < len; j++) {
          action = ref1[j];
          atomAction = atomActionName(action.name);
          if (this.actions[atomAction] != null) {
            continue;
          }
          cmd = singleSelectionActions.indexOf(action.name) !== -1 ? actionDecorator(action.name) : multiSelectionActionDecorator(action.name);
          this.actions[atomAction] = cmd;
        }
      }
      return this.subscriptions.add(atom.commands.add('atom-text-editor', this.actions));
    },
    deactivate: function() {
      return atom.config.transact((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9lbW1ldC9saWIvZW1tZXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNKLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztFQUNSLFlBQUEsR0FBZSxPQUFBLENBQVEsdUJBQVI7O0VBQ2YsU0FBQSxHQUFZLE9BQUEsQ0FBUSw0QkFBUjs7RUFFWixXQUFBLEdBQWUsT0FBQSxDQUFRLGdCQUFSOztFQUdmLHNCQUFBLEdBQXlCLENBQ3ZCLGlCQUR1QixFQUNKLGlCQURJLEVBQ2UsYUFEZixFQUV2QixtQkFGdUIsRUFFRixrQkFGRSxFQUVrQixzQkFGbEIsRUFHdkIsd0JBSHVCLEVBR0csWUFISDs7RUFNekIscUJBQUEsR0FBd0IsQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixNQUFoQixFQUF3QixNQUF4Qjs7QUFFeEI7QUFBQSxPQUFBLFFBQUE7O0lBQ0ksS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFsQixDQUFzQixTQUFBLEdBQVksQ0FBbEMsRUFBcUMsQ0FBckM7QUFESjs7RUFHQSxXQUFBLEdBQWMsU0FBQTtJQUNaLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBdkI7QUFDRSxhQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFEckI7O1dBR0EsT0FBTyxDQUFDLEdBQUcsQ0FBQztFQUpBOztFQU1kLGlCQUFBLEdBQW9CLFNBQUE7QUFDbEIsUUFBQTtJQUFBLElBQUcsV0FBVyxDQUFDLFVBQVosQ0FBQSxDQUFBLEtBQTRCLE1BQS9CO01BRUUsTUFBQSxHQUFTLFdBQVcsQ0FBQyxlQUFaLENBQUE7TUFDVCxRQUFBLEdBQVcsU0FBQyxNQUFEO2VB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QUFDLENBQUEsT0FBUSxDQUFBLFVBQUEsQ0FBVCxHQUF1QjtBQUx6QixTQUpGOzthQVdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLElBQUMsQ0FBQSxPQUF2QyxDQUFuQjtJQWJRLENBWlY7SUEyQkEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVosQ0FBcUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCO0lBRFUsQ0EzQlo7O0FBL0hGIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuZW1tZXQgPSByZXF1aXJlICdlbW1ldCdcbmVtbWV0QWN0aW9ucyA9IHJlcXVpcmUgJ2VtbWV0L2xpYi9hY3Rpb24vbWFpbidcbnJlc291cmNlcyA9IHJlcXVpcmUgJ2VtbWV0L2xpYi9hc3NldHMvcmVzb3VyY2VzJ1xuXG5lZGl0b3JQcm94eSAgPSByZXF1aXJlICcuL2VkaXRvci1wcm94eSdcbiMgaW50ZXJhY3RpdmUgID0gcmVxdWlyZSAnLi9pbnRlcmFjdGl2ZSdcblxuc2luZ2xlU2VsZWN0aW9uQWN0aW9ucyA9IFtcbiAgJ3ByZXZfZWRpdF9wb2ludCcsICduZXh0X2VkaXRfcG9pbnQnLCAnbWVyZ2VfbGluZXMnLFxuICAncmVmbGVjdF9jc3NfdmFsdWUnLCAnc2VsZWN0X25leHRfaXRlbScsICdzZWxlY3RfcHJldmlvdXNfaXRlbScsXG4gICd3cmFwX3dpdGhfYWJicmV2aWF0aW9uJywgJ3VwZGF0ZV90YWcnXG5dXG5cbnRvZ2dsZUNvbW1lbnRTeW50YXhlcyA9IFsnaHRtbCcsICdjc3MnLCAnbGVzcycsICdzY3NzJ11cblxuZm9yIGssIHYgb2YgIGF0b20uY29uZmlnLmdldCAnZW1tZXQuc3R5bHVzJ1xuICAgIGVtbWV0LnByZWZlcmVuY2VzLnNldCgnc3R5bHVzLicgKyBrLCB2KTtcblxuZ2V0VXNlckhvbWUgPSAoKSAtPlxuICBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICd3aW4zMidcbiAgICByZXR1cm4gcHJvY2Vzcy5lbnYuVVNFUlBST0ZJTEVcblxuICBwcm9jZXNzLmVudi5IT01FXG5cbmlzVmFsaWRUYWJDb250ZXh0ID0gKCkgLT5cbiAgaWYgZWRpdG9yUHJveHkuZ2V0R3JhbW1hcigpIGlzICdodG1sJ1xuICAgICMgSFRNTCBtYXkgY29udGFpbiBlbWJlZGRlZCBncmFtbWFyc1xuICAgIHNjb3BlcyA9IGVkaXRvclByb3h5LmdldEN1cnJlbnRTY29wZSgpXG4gICAgY29udGFpbnMgPSAocmVnZXhwKSAtPiBzY29wZXMuZmlsdGVyKChzKSAtPiByZWdleHAudGVzdCBzKS5sZW5ndGhcblxuICAgIGlmIGNvbnRhaW5zIC9cXC5qc1xcLmVtYmVkZGVkXFwuL1xuICAgICAgIyBpbiBKUywgYWxsb3cgVGFiIGV4cGFuZGVyIG9ubHkgaW5zaWRlIHN0cmluZ1xuICAgICAgcmV0dXJuIGNvbnRhaW5zIC9ec3RyaW5nXFwuL1xuXG4gIHJldHVybiB0cnVlXG5cblxuIyBFbW1ldCBhY3Rpb24gZGVjb3JhdG9yOiBjcmVhdGVzIGEgY29tbWFuZCBmdW5jdGlvblxuIyBmb3IgQXRvbSBhbmQgZXhlY3V0ZXMgRW1tZXQgYWN0aW9uIGFzIHNpbmdsZVxuIyB1bmRvIGNvbW1hbmRcbiMgQHBhcmFtICB7T2JqZWN0fSBhY3Rpb24gQWN0aW9uIHRvIHBlcmZvcm1cbiMgQHJldHVybiB7RnVuY3Rpb259XG5hY3Rpb25EZWNvcmF0b3IgPSAoYWN0aW9uKSAtPlxuICAoZXZ0KSAtPlxuICAgIGVkaXRvclByb3h5LnNldHVwIEBnZXRNb2RlbCgpXG4gICAgZWRpdG9yUHJveHkuZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBydW5BY3Rpb24gYWN0aW9uLCBldnRcblxuIyBTYW1lIGFzIGBhY3Rpb25EZWNvcmF0b3IoKWAgYnV0IGV4ZWN1dGVzIGFjdGlvblxuIyB3aXRoIG11bHRpcGxlIHNlbGVjdGlvbnNcbiMgQHBhcmFtICB7T2JqZWN0fSBhY3Rpb24gQWN0aW9uIHRvIHBlcmZvcm1cbiMgQHJldHVybiB7RnVuY3Rpb259XG5tdWx0aVNlbGVjdGlvbkFjdGlvbkRlY29yYXRvciA9IChhY3Rpb24pIC0+XG4gIChldnQpIC0+XG4gICAgZWRpdG9yUHJveHkuc2V0dXAoQGdldE1vZGVsKCkpXG4gICAgZWRpdG9yUHJveHkuZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBlZGl0b3JQcm94eS5leGVjIChpKSAtPlxuICAgICAgICBydW5BY3Rpb24gYWN0aW9uLCBldnRcbiAgICAgICAgcmV0dXJuIGZhbHNlIGlmIGV2dC5rZXlCaW5kaW5nQWJvcnRlZFxuXG5ydW5BY3Rpb24gPSAoYWN0aW9uLCBldnQpIC0+XG4gIHN5bnRheCA9IGVkaXRvclByb3h5LmdldFN5bnRheCgpXG4gIGlmIGFjdGlvbiBpcyAnZXhwYW5kX2FiYnJldmlhdGlvbl93aXRoX3RhYidcbiAgICAjIGRvIG5vdCBoYW5kbGUgVGFiIGtleSBpZjpcbiAgICAjIC0xLiBzeW50YXggaXMgdW5rbm93bi0gKG5vIGxvbmdlciB2YWxpZCwgZGVmaW5lZCBieSBrZXltYXAgc2VsZWN0b3IpXG4gICAgIyAyLiB0aGVyZeKAmXMgYSBzZWxlY3Rpb24gKHVzZXIgd2FudHMgdG8gaW5kZW50IGl0KVxuICAgICMgMy4gaGFzIGV4cGFuZGVkIHNuaXBwZXQgKGUuZy4gaGFzIHRhYnN0b3BzKVxuICAgIGFjdGl2ZUVkaXRvciA9IGVkaXRvclByb3h5LmVkaXRvcjtcbiAgICBpZiBub3QgaXNWYWxpZFRhYkNvbnRleHQoKSBvciBub3QgYWN0aXZlRWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5pc0VtcHR5KClcbiAgICAgIHJldHVybiBldnQuYWJvcnRLZXlCaW5kaW5nKClcbiAgICBpZiBhY3RpdmVFZGl0b3Iuc25pcHBldEV4cGFuc2lvblxuICAgICAgIyBpbiBjYXNlIG9mIHNuaXBwZXQgZXhwYW5zaW9uOiBleHBhbmQgYWJicmV2aWF0aW9uIGlmIHdlIGN1cnJlbnRseSBvbiBsYXN0XG4gICAgICAjIHRhYnN0b3BcbiAgICAgIHNlID0gYWN0aXZlRWRpdG9yLnNuaXBwZXRFeHBhbnNpb25cbiAgICAgIGlmIHNlLnRhYlN0b3BJbmRleCArIDEgPj0gc2UudGFiU3RvcE1hcmtlcnMubGVuZ3RoXG4gICAgICAgIHNlLmRlc3Ryb3koKVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gZXZ0LmFib3J0S2V5QmluZGluZygpXG5cbiAgaWYgYWN0aW9uIGlzICd0b2dnbGVfY29tbWVudCcgYW5kICh0b2dnbGVDb21tZW50U3ludGF4ZXMuaW5kZXhPZihzeW50YXgpIGlzIC0xIG9yIG5vdCBhdG9tLmNvbmZpZy5nZXQgJ2VtbWV0LnVzZUVtbWV0Q29tbWVudHMnKVxuICAgIHJldHVybiBldnQuYWJvcnRLZXlCaW5kaW5nKClcblxuICBpZiBhY3Rpb24gaXMgJ2luc2VydF9mb3JtYXR0ZWRfbGluZV9icmVha19vbmx5J1xuICAgIGlmIG5vdCBhdG9tLmNvbmZpZy5nZXQgJ2VtbWV0LmZvcm1hdExpbmVCcmVha3MnXG4gICAgICByZXR1cm4gZXZ0LmFib3J0S2V5QmluZGluZygpXG5cbiAgICByZXN1bHQgPSBlbW1ldC5ydW4gYWN0aW9uLCBlZGl0b3JQcm94eVxuICAgIHJldHVybiBpZiBub3QgcmVzdWx0IHRoZW4gZXZ0LmFib3J0S2V5QmluZGluZygpIGVsc2UgdHJ1ZVxuXG4gIGVtbWV0LnJ1biBhY3Rpb24sIGVkaXRvclByb3h5XG5cbmF0b21BY3Rpb25OYW1lID0gKG5hbWUpIC0+XG4gICdlbW1ldDonICsgbmFtZS5yZXBsYWNlKC9fL2csICctJylcblxucmVnaXN0ZXJJbnRlcmFjdGl2ZUFjdGlvbnMgPSAoYWN0aW9ucykgLT5cbiAgZm9yIG5hbWUgaW4gWyd3cmFwX3dpdGhfYWJicmV2aWF0aW9uJywgJ3VwZGF0ZV90YWcnLCAnaW50ZXJhY3RpdmVfZXhwYW5kX2FiYnJldmlhdGlvbiddXG4gICAgZG8gKG5hbWUpIC0+XG4gICAgICBhdG9tQWN0aW9uID0gYXRvbUFjdGlvbk5hbWUgbmFtZVxuICAgICAgYWN0aW9uc1thdG9tQWN0aW9uXSA9IChldnQpIC0+XG4gICAgICAgIGVkaXRvclByb3h5LnNldHVwKEBnZXRNb2RlbCgpKVxuICAgICAgICBpbnRlcmFjdGl2ZSA9IHJlcXVpcmUgJy4vaW50ZXJhY3RpdmUnXG4gICAgICAgIGludGVyYWN0aXZlLnJ1bihuYW1lLCBlZGl0b3JQcm94eSlcblxubG9hZEV4dGVuc2lvbnMgPSAoKSAtPlxuICBleHRQYXRoID0gYXRvbS5jb25maWcuZ2V0ICdlbW1ldC5leHRlbnNpb25zUGF0aCdcbiAgY29uc29sZS5sb2cgJ0xvYWRpbmcgRW1tZXQgZXh0ZW5zaW9ucyBmcm9tJywgZXh0UGF0aFxuICByZXR1cm4gdW5sZXNzIGV4dFBhdGhcblxuICBpZiBleHRQYXRoWzBdIGlzICd+J1xuICAgIGV4dFBhdGggPSBnZXRVc2VySG9tZSgpICsgZXh0UGF0aC5zdWJzdHIgMVxuXG4gIGlmIGZzLmV4aXN0c1N5bmMgZXh0UGF0aFxuICAgIGVtbWV0LnJlc2V0VXNlckRhdGEoKVxuICAgIGZpbGVzID0gZnMucmVhZGRpclN5bmMgZXh0UGF0aFxuICAgIGZpbGVzID0gZmlsZXNcbiAgICAgIC5tYXAoKGl0ZW0pIC0+IHBhdGguam9pbiBleHRQYXRoLCBpdGVtKVxuICAgICAgLmZpbHRlcigoZmlsZSkgLT4gbm90IGZzLnN0YXRTeW5jKGZpbGUpLmlzRGlyZWN0b3J5KCkpXG5cbiAgICBlbW1ldC5sb2FkRXh0ZW5zaW9ucyhmaWxlcylcbiAgZWxzZVxuICAgIGNvbnNvbGUud2FybiAnRW1tZXQ6IG5vIHN1Y2ggZXh0ZW5zaW9uIGZvbGRlcjonLCBleHRQYXRoXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGV4dGVuc2lvbnNQYXRoOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICd+L2VtbWV0J1xuICAgIGZvcm1hdExpbmVCcmVha3M6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB1c2VFbW1ldENvbW1lbnRzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246ICdkaXNhYmxlIHRvIHVzZSBhdG9tIG5hdGl2ZSBjb21tZW50aW5nIHN5c3RlbSdcblxuICBhY3RpdmF0ZTogKEBzdGF0ZSkgLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdW5sZXNzIEBhY3Rpb25zXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnZW1tZXQuZXh0ZW5zaW9uc1BhdGgnLCBsb2FkRXh0ZW5zaW9uc1xuICAgICAgQGFjdGlvbnMgPSB7fVxuICAgICAgcmVnaXN0ZXJJbnRlcmFjdGl2ZUFjdGlvbnMgQGFjdGlvbnNcbiAgICAgIGZvciBhY3Rpb24gaW4gZW1tZXRBY3Rpb25zLmdldExpc3QoKVxuICAgICAgICBhdG9tQWN0aW9uID0gYXRvbUFjdGlvbk5hbWUgYWN0aW9uLm5hbWVcbiAgICAgICAgaWYgQGFjdGlvbnNbYXRvbUFjdGlvbl0/XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgY21kID0gaWYgc2luZ2xlU2VsZWN0aW9uQWN0aW9ucy5pbmRleE9mKGFjdGlvbi5uYW1lKSBpc250IC0xIHRoZW4gYWN0aW9uRGVjb3JhdG9yKGFjdGlvbi5uYW1lKSBlbHNlIG11bHRpU2VsZWN0aW9uQWN0aW9uRGVjb3JhdG9yKGFjdGlvbi5uYW1lKVxuICAgICAgICBAYWN0aW9uc1thdG9tQWN0aW9uXSA9IGNtZFxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgQGFjdGlvbnNcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIGF0b20uY29uZmlnLnRyYW5zYWN0ID0+IEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuIl19
