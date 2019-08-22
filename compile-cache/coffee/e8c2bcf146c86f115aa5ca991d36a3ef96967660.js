(function() {
  var exec, fs, path;

  exec = require('child_process');

  fs = require('fs');

  path = require('path');

  module.exports = {
    executablePath: 'php',
    selector: '.source.php',
    disableForSelector: '.source.php .comment',
    inclusionPriority: 1,
    excludeLowerPriority: true,
    loadCompletions: function() {
      this.completions = {};
      fs.readFile(path.resolve(__dirname, '..', 'completions.json'), (function(_this) {
        return function(error, content) {
          if (error == null) {
            _this.completions = JSON.parse(content);
          }
        };
      })(this));
      this.funtions = {};
      return fs.readFile(path.resolve(__dirname, '..', 'functions.json'), (function(_this) {
        return function(error, content) {
          if (error == null) {
            _this.funtions = JSON.parse(content);
          }
        };
      })(this));
    },
    execute: function(arg, force) {
      var editor, phpEx, proc;
      editor = arg.editor;
      if (force == null) {
        force = false;
      }
      if (!force) {
        if ((this.userVars != null) && this.lastPath === editor.getPath()) {
          return;
        }
      }
      this.compileData = '';
      phpEx = 'get_user_all.php';
      proc = exec.spawn(this.executablePath, [__dirname + '/php/' + phpEx]);
      proc.stdin.write(editor.getText());
      proc.stdin.end();
      proc.stdout.on('data', (function(_this) {
        return function(data) {
          return _this.compileData = _this.compileData + data;
        };
      })(this));
      proc.stderr.on('data', function(data) {
        return console.log('err: ' + data);
      });
      return proc.on('close', (function(_this) {
        return function(code) {
          var error;
          try {
            _this.userSuggestions = JSON.parse(_this.compileData);
          } catch (error1) {
            error = error1;
          }
          return _this.lastPath = editor.getPath();
        };
      })(this));
    },
    getSuggestions: function(request) {
      return new Promise((function(_this) {
        return function(resolve) {
          var typeEx;
          typeEx = true;
          if (_this.notShowAutocomplete(request)) {
            return resolve([]);
          } else if (_this.isAll(request)) {
            _this.execute(request, typeEx);
            return resolve(_this.getAllCompletions(request));
          } else if (_this.isVariable(request)) {
            _this.execute(request, typeEx);
            return resolve(_this.getVarsCompletions(request));
          } else if (_this.isFunCon(request)) {
            _this.execute(request, typeEx);
            return resolve(_this.getCompletions(request));
          } else {
            return resolve([]);
          }
        };
      })(this));
    },
    onDidInsertSuggestion: function(arg) {
      var editor, suggestion, triggerPosition;
      editor = arg.editor, triggerPosition = arg.triggerPosition, suggestion = arg.suggestion;
    },
    dispose: function() {},
    notShowAutocomplete: function(request) {
      var scopes;
      if (request.prefix === '') {
        return true;
      }
      scopes = request.scopeDescriptor.getScopesArray();
      if (scopes.indexOf('keyword.operator.assignment.php') !== -1 || scopes.indexOf('keyword.operator.comparison.php') !== -1 || scopes.indexOf('keyword.operator.logical.php') !== -1 || scopes.indexOf('string.quoted.double.php') !== -1 || scopes.indexOf('string.quoted.single.php') !== -1) {
        return true;
      }
      if (this.isInString(request) && this.isFunCon(request)) {
        return true;
      }
    },
    isInString: function(arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('string.quoted.single.php') !== -1 || scopes.indexOf('string.quoted.double.php') !== -1) {
        return true;
      }
    },
    isAll: function(arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.length === 3 || scopes.indexOf('meta.array.php') !== -1) {
        return true;
      }
    },
    isVariable: function(arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('variable.other.php') !== -1) {
        return true;
      }
    },
    isFunCon: function(arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('constant.other.php') !== -1 || scopes.indexOf('keyword.control.php') !== -1 || scopes.indexOf('storage.type.php') !== -1 || scopes.indexOf('support.function.construct.php')) {
        return true;
      }
    },
    getAllCompletions: function(arg) {
      var completions, constants, editor, func, i, j, k, keyword, l, len, len1, len2, len3, len4, len5, lowerCasePrefix, m, n, prefix, ref, ref1, ref2, ref3, ref4, ref5, userFunc, userVar, variable;
      editor = arg.editor, prefix = arg.prefix;
      completions = [];
      lowerCasePrefix = prefix.toLowerCase();
      if (this.userSuggestions != null) {
        ref = this.userSuggestions.user_vars;
        for (i = 0, len = ref.length; i < len; i++) {
          userVar = ref[i];
          if (userVar.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userVar));
          }
        }
      }
      ref1 = this.completions.variables;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        variable = ref1[j];
        if (variable.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(variable));
        }
      }
      ref2 = this.completions.constants;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        constants = ref2[k];
        if (constants.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(constants));
        }
      }
      ref3 = this.completions.keywords;
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        keyword = ref3[l];
        if (keyword.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(keyword));
        }
      }
      if (this.userSuggestions != null) {
        ref4 = this.userSuggestions.user_functions;
        for (m = 0, len4 = ref4.length; m < len4; m++) {
          userFunc = ref4[m];
          if (userFunc.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userFunc));
          }
        }
      }
      ref5 = this.funtions.functions;
      for (n = 0, len5 = ref5.length; n < len5; n++) {
        func = ref5[n];
        if (func.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(func));
        }
      }
      return completions;
    },
    getCompletions: function(arg) {
      var completions, constants, editor, func, i, j, k, keyword, l, len, len1, len2, len3, lowerCasePrefix, prefix, ref, ref1, ref2, ref3, userFunc;
      editor = arg.editor, prefix = arg.prefix;
      completions = [];
      lowerCasePrefix = prefix.toLowerCase();
      ref = this.completions.constants;
      for (i = 0, len = ref.length; i < len; i++) {
        constants = ref[i];
        if (constants.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(constants));
        }
      }
      ref1 = this.completions.keywords;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        keyword = ref1[j];
        if (keyword.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(keyword));
        }
      }
      if (this.userSuggestions != null) {
        ref2 = this.userSuggestions.user_functions;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          userFunc = ref2[k];
          if (userFunc.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userFunc));
          }
        }
      }
      ref3 = this.funtions.functions;
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        func = ref3[l];
        if (func.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(func));
        }
      }
      return completions;
    },
    getVarsCompletions: function(arg) {
      var completions, editor, i, j, len, len1, lowerCasePrefix, prefix, ref, ref1, userVar, variable;
      editor = arg.editor, prefix = arg.prefix;
      completions = [];
      lowerCasePrefix = prefix.toLowerCase();
      if (this.userSuggestions != null) {
        ref = this.userSuggestions.user_vars;
        for (i = 0, len = ref.length; i < len; i++) {
          userVar = ref[i];
          if (userVar.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userVar));
          }
        }
      }
      ref1 = this.completions.variables;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        variable = ref1[j];
        if (variable.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(variable));
        }
      }
      return completions;
    },
    buildCompletion: function(suggestion) {
      return {
        text: suggestion.text,
        type: suggestion.type,
        displayText: suggestion.displayText != null ? suggestion.displayText : suggestion.displayText = null,
        snippet: suggestion.snippet != null ? suggestion.snippet : suggestion.snippet = null,
        leftLabel: suggestion.leftLabel != null ? suggestion.leftLabel : suggestion.leftLabel = null,
        description: suggestion.description != null ? suggestion.description : suggestion.description = "PHP <" + suggestion.text + "> " + suggestion.type,
        descriptionMoreURL: suggestion.descriptionMoreURL != null ? suggestion.descriptionMoreURL : suggestion.descriptionMoreURL = null
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGhwL2xpYi9wcm92aWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxjQUFBLEVBQWdCLEtBQWhCO0lBR0EsUUFBQSxFQUFVLGFBSFY7SUFJQSxrQkFBQSxFQUFvQixzQkFKcEI7SUFVQSxpQkFBQSxFQUFtQixDQVZuQjtJQVdBLG9CQUFBLEVBQXNCLElBWHRCO0lBY0EsZUFBQSxFQUFpQixTQUFBO01BQ2YsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLElBQXhCLEVBQThCLGtCQUE5QixDQUFaLEVBQStELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsT0FBUjtVQUM3RCxJQUEwQyxhQUExQztZQUFBLEtBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFYLEVBQWY7O1FBRDZEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvRDtNQUlBLElBQUMsQ0FBQSxRQUFELEdBQVk7YUFDWixFQUFFLENBQUMsUUFBSCxDQUFZLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixJQUF4QixFQUE4QixnQkFBOUIsQ0FBWixFQUE2RCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLE9BQVI7VUFDM0QsSUFBdUMsYUFBdkM7WUFBQSxLQUFDLENBQUEsUUFBRCxHQUFZLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWCxFQUFaOztR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QUQsQ0FBaUIsT0FBakIsQ0FBakI7O0FBREYsU0FERjs7QUFJQTtBQUFBLFdBQUEsd0NBQUE7O1lBQTRDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUFBLENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsZUFBcEMsQ0FBQSxLQUF3RDtVQUNsRyxXQUFXLENBQUMsSUFBWixDQUFpQixJQUFDLENBQUEsZUFBRCxDQUFpQixRQUFqQixDQUFqQjs7QUFERjthQUdBO0lBWGtCLENBaktwQjtJQStLQSxlQUFBLEVBQWlCLFNBQUMsVUFBRDthQUNmO1FBQUEsSUFBQSxFQUFNLFVBQVUsQ0FBQyxJQUFqQjtRQUNBLElBQUEsRUFBTSxVQUFVLENBQUMsSUFEakI7UUFFQSxXQUFBLG1DQUFhLFVBQVUsQ0FBQyxjQUFYLFVBQVUsQ0FBQyxjQUFlLElBRnZDO1FBR0EsT0FBQSwrQkFBUyxVQUFVLENBQUMsVUFBWCxVQUFVLENBQUMsVUFBVyxJQUgvQjtRQUlBLFNBQUEsaUNBQVcsVUFBVSxDQUFDLFlBQVgsVUFBVSxDQUFDLFlBQWEsSUFKbkM7UUFLQSxXQUFBLG1DQUFhLFVBQVUsQ0FBQyxjQUFYLFVBQVUsQ0FBQyxjQUFlLE9BQUEsR0FBUSxVQUFVLENBQUMsSUFBbkIsR0FBd0IsSUFBeEIsR0FBNEIsVUFBVSxDQUFDLElBTDlFO1FBTUEsa0JBQUEsMENBQW9CLFVBQVUsQ0FBQyxxQkFBWCxVQUFVLENBQUMscUJBQXNCLElBTnJEOztJQURlLENBL0tqQjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbImV4ZWMgPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xuZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGV4ZWN1dGFibGVQYXRoOiAncGhwJ1xuXG4gICMgVGhpcyB3aWxsIHdvcmsgb24gSmF2YVNjcmlwdCBhbmQgQ29mZmVlU2NyaXB0IGZpbGVzLCBidXQgbm90IGluIGpzIGNvbW1lbnRzLlxuICBzZWxlY3RvcjogJy5zb3VyY2UucGhwJ1xuICBkaXNhYmxlRm9yU2VsZWN0b3I6ICcuc291cmNlLnBocCAuY29tbWVudCdcbiAgIyBrZXl3b3JkLm9wZXJhdG9yLmNsYXNzLnBocFxuXG4gICMgVGhpcyB3aWxsIHRha2UgcHJpb3JpdHkgb3ZlciB0aGUgZGVmYXVsdCBwcm92aWRlciwgd2hpY2ggaGFzIGEgcHJpb3JpdHkgb2YgMC5cbiAgIyBgZXhjbHVkZUxvd2VyUHJpb3JpdHlgIHdpbGwgc3VwcHJlc3MgYW55IHByb3ZpZGVycyB3aXRoIGEgbG93ZXIgcHJpb3JpdHlcbiAgIyBpLmUuIFRoZSBkZWZhdWx0IHByb3ZpZGVyIHdpbGwgYmUgc3VwcHJlc3NlZFxuICBpbmNsdXNpb25Qcmlvcml0eTogMVxuICBleGNsdWRlTG93ZXJQcmlvcml0eTogdHJ1ZVxuXG4gICMgTG9hZCBDb21wbGV0aW9ucyBmcm9tIGpzb25cbiAgbG9hZENvbXBsZXRpb25zOiAtPlxuICAgIEBjb21wbGV0aW9ucyA9IHt9XG4gICAgZnMucmVhZEZpbGUgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJ2NvbXBsZXRpb25zLmpzb24nKSwgKGVycm9yLCBjb250ZW50KSA9PlxuICAgICAgQGNvbXBsZXRpb25zID0gSlNPTi5wYXJzZShjb250ZW50KSB1bmxlc3MgZXJyb3I/XG4gICAgICByZXR1cm5cblxuICAgIEBmdW50aW9ucyA9IHt9XG4gICAgZnMucmVhZEZpbGUgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJ2Z1bmN0aW9ucy5qc29uJyksIChlcnJvciwgY29udGVudCkgPT5cbiAgICAgIEBmdW50aW9ucyA9IEpTT04ucGFyc2UoY29udGVudCkgdW5sZXNzIGVycm9yP1xuICAgICAgcmV0dXJuXG5cbiAgZXhlY3V0ZTogKHtlZGl0b3J9LCBmb3JjZSA9IGZhbHNlKSAtPlxuICAgIGlmICFmb3JjZVxuICAgICAgcmV0dXJuIGlmIEB1c2VyVmFycz8gYW5kIEBsYXN0UGF0aCA9PSBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICBAY29tcGlsZURhdGEgPSAnJ1xuICAgIHBocEV4ID0gJ2dldF91c2VyX2FsbC5waHAnXG5cbiAgICBwcm9jID0gZXhlYy5zcGF3biB0aGlzLmV4ZWN1dGFibGVQYXRoLCBbX19kaXJuYW1lICsgJy9waHAvJyArIHBocEV4XVxuXG4gICAgcHJvYy5zdGRpbi53cml0ZShlZGl0b3IuZ2V0VGV4dCgpKVxuICAgIHByb2Muc3RkaW4uZW5kKClcblxuICAgIHByb2Muc3Rkb3V0Lm9uICdkYXRhJywgKGRhdGEpID0+XG4gICAgICBAY29tcGlsZURhdGEgPSBAY29tcGlsZURhdGEgKyBkYXRhXG5cbiAgICBwcm9jLnN0ZGVyci5vbiAnZGF0YScsIChkYXRhKSAtPlxuICAgICAgY29uc29sZS5sb2cgJ2VycjogJyArIGRhdGFcblxuICAgIHByb2Mub24gJ2Nsb3NlJywgKGNvZGUpID0+XG4gICAgICB0cnlcbiAgICAgICAgQHVzZXJTdWdnZXN0aW9ucyA9IEpTT04ucGFyc2UoQGNvbXBpbGVEYXRhKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgIyBjb25zb2xlLmxvZyBlcnJvclxuXG4gICAgICBAbGFzdFBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAjIEBsYXN0VGltZUV4ID0gbmV3IERhdGUoKVxuXG4gICMgUmVxdWlyZWQ6IFJldHVybiBhIHByb21pc2UsIGFuIGFycmF5IG9mIHN1Z2dlc3Rpb25zLCBvciBudWxsLlxuICAjIHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeH1cbiAgZ2V0U3VnZ2VzdGlvbnM6IChyZXF1ZXN0KSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgIyBpZiBAbGFzdFRpbWVFeD8gYW5kIE1hdGguZmxvb3IoKG5ldyBEYXRlKCkgLSBAbGFzdFRpbWVFeCkgLyA2MDAwMCkgPCAxXG4gICAgICAjICAgdHlwZUV4ID0gZmFsc2VcbiAgICAgICMgZWxzZVxuICAgICAgIyAgIHR5cGVFeCA9IHRydWVcblxuICAgICAgdHlwZUV4ID0gdHJ1ZVxuXG4gICAgICBpZiBAbm90U2hvd0F1dG9jb21wbGV0ZShyZXF1ZXN0KVxuICAgICAgICByZXNvbHZlKFtdKVxuICAgICAgZWxzZSBpZiBAaXNBbGwocmVxdWVzdClcbiAgICAgICAgQGV4ZWN1dGUocmVxdWVzdCwgdHlwZUV4KVxuICAgICAgICByZXNvbHZlKEBnZXRBbGxDb21wbGV0aW9ucyhyZXF1ZXN0KSlcbiAgICAgIGVsc2UgaWYgQGlzVmFyaWFibGUocmVxdWVzdClcbiAgICAgICAgQGV4ZWN1dGUocmVxdWVzdCwgdHlwZUV4KVxuICAgICAgICByZXNvbHZlKEBnZXRWYXJzQ29tcGxldGlvbnMocmVxdWVzdCkpXG4gICAgICBlbHNlIGlmIEBpc0Z1bkNvbihyZXF1ZXN0KVxuICAgICAgICBAZXhlY3V0ZShyZXF1ZXN0LCB0eXBlRXgpXG4gICAgICAgIHJlc29sdmUoQGdldENvbXBsZXRpb25zKHJlcXVlc3QpKVxuICAgICAgZWxzZVxuICAgICAgICByZXNvbHZlKFtdKVxuXG4gICMgKG9wdGlvbmFsKTogY2FsbGVkIF9hZnRlcl8gdGhlIHN1Z2dlc3Rpb24gYHJlcGxhY2VtZW50UHJlZml4YCBpcyByZXBsYWNlZFxuICAjIGJ5IHRoZSBzdWdnZXN0aW9uIGB0ZXh0YCBpbiB0aGUgYnVmZmVyXG4gIG9uRGlkSW5zZXJ0U3VnZ2VzdGlvbjogKHtlZGl0b3IsIHRyaWdnZXJQb3NpdGlvbiwgc3VnZ2VzdGlvbn0pIC0+XG5cbiAgIyAob3B0aW9uYWwpOiBjYWxsZWQgd2hlbiB5b3VyIHByb3ZpZGVyIG5lZWRzIHRvIGJlIGNsZWFuZWQgdXAuIFVuc3Vic2NyaWJlXG4gICMgZnJvbSB0aGluZ3MsIGtpbGwgYW55IHByb2Nlc3NlcywgZXRjLlxuICBkaXNwb3NlOiAtPlxuXG4gIG5vdFNob3dBdXRvY29tcGxldGU6IChyZXF1ZXN0KSAtPlxuICAgIHJldHVybiB0cnVlIGlmIHJlcXVlc3QucHJlZml4IGlzICcnXG4gICAgc2NvcGVzID0gcmVxdWVzdC5zY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKVxuICAgIHJldHVybiB0cnVlIGlmIHNjb3Blcy5pbmRleE9mKCdrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQucGhwJykgaXNudCAtMSBvclxuICAgICAgc2NvcGVzLmluZGV4T2YoJ2tleXdvcmQub3BlcmF0b3IuY29tcGFyaXNvbi5waHAnKSBpc250IC0xIG9yXG4gICAgICBzY29wZXMuaW5kZXhPZigna2V5d29yZC5vcGVyYXRvci5sb2dpY2FsLnBocCcpIGlzbnQgLTEgb3JcbiAgICAgIHNjb3Blcy5pbmRleE9mKCdzdHJpbmcucXVvdGVkLmRvdWJsZS5waHAnKSBpc250IC0xIG9yXG4gICAgICBzY29wZXMuaW5kZXhPZignc3RyaW5nLnF1b3RlZC5zaW5nbGUucGhwJykgaXNudCAtMVxuICAgIHJldHVybiB0cnVlIGlmIEBpc0luU3RyaW5nKHJlcXVlc3QpIGFuZCBAaXNGdW5Db24ocmVxdWVzdClcblxuICBpc0luU3RyaW5nOiAoe3Njb3BlRGVzY3JpcHRvcn0pIC0+XG4gICAgc2NvcGVzID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KClcbiAgICByZXR1cm4gdHJ1ZSBpZiBzY29wZXMuaW5kZXhPZignc3RyaW5nLnF1b3RlZC5zaW5nbGUucGhwJykgaXNudCAtMSBvclxuICAgICAgc2NvcGVzLmluZGV4T2YoJ3N0cmluZy5xdW90ZWQuZG91YmxlLnBocCcpIGlzbnQgLTFcblxuICBpc0FsbDogKHtzY29wZURlc2NyaXB0b3J9KSAtPlxuICAgIHNjb3BlcyA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG4gICAgcmV0dXJuIHRydWUgaWYgc2NvcGVzLmxlbmd0aCBpcyAzIG9yXG4gICAgICBzY29wZXMuaW5kZXhPZignbWV0YS5hcnJheS5waHAnKSBpc250IC0xXG5cbiAgaXNWYXJpYWJsZTogKHtzY29wZURlc2NyaXB0b3J9KSAtPlxuICAgIHNjb3BlcyA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG4gICAgcmV0dXJuIHRydWUgaWYgc2NvcGVzLmluZGV4T2YoJ3ZhcmlhYmxlLm90aGVyLnBocCcpIGlzbnQgLTFcblxuICBpc0Z1bkNvbjogKHtzY29wZURlc2NyaXB0b3J9KSAtPlxuICAgIHNjb3BlcyA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG4gICAgcmV0dXJuIHRydWUgaWYgc2NvcGVzLmluZGV4T2YoJ2NvbnN0YW50Lm90aGVyLnBocCcpIGlzbnQgLTEgb3JcbiAgICAgIHNjb3Blcy5pbmRleE9mKCdrZXl3b3JkLmNvbnRyb2wucGhwJykgaXNudCAtMSBvclxuICAgICAgc2NvcGVzLmluZGV4T2YoJ3N0b3JhZ2UudHlwZS5waHAnKSBpc250IC0xIG9yXG4gICAgICBzY29wZXMuaW5kZXhPZignc3VwcG9ydC5mdW5jdGlvbi5jb25zdHJ1Y3QucGhwJylcblxuICBnZXRBbGxDb21wbGV0aW9uczogKHtlZGl0b3IsIHByZWZpeH0pIC0+XG4gICAgY29tcGxldGlvbnMgPSBbXVxuICAgIGxvd2VyQ2FzZVByZWZpeCA9IHByZWZpeC50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiBAdXNlclN1Z2dlc3Rpb25zP1xuICAgICAgZm9yIHVzZXJWYXIgaW4gQHVzZXJTdWdnZXN0aW9ucy51c2VyX3ZhcnMgd2hlbiB1c2VyVmFyLnRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxvd2VyQ2FzZVByZWZpeCkgaXMgMFxuICAgICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZENvbXBsZXRpb24odXNlclZhcikpXG5cbiAgICBmb3IgdmFyaWFibGUgaW4gQGNvbXBsZXRpb25zLnZhcmlhYmxlcyB3aGVuIHZhcmlhYmxlLnRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxvd2VyQ2FzZVByZWZpeCkgaXMgMFxuICAgICAgY29tcGxldGlvbnMucHVzaChAYnVpbGRDb21wbGV0aW9uKHZhcmlhYmxlKSlcblxuICAgIGZvciBjb25zdGFudHMgaW4gQGNvbXBsZXRpb25zLmNvbnN0YW50cyB3aGVuIGNvbnN0YW50cy50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsb3dlckNhc2VQcmVmaXgpIGlzIDBcbiAgICAgIGNvbXBsZXRpb25zLnB1c2goQGJ1aWxkQ29tcGxldGlvbihjb25zdGFudHMpKVxuXG4gICAgZm9yIGtleXdvcmQgaW4gQGNvbXBsZXRpb25zLmtleXdvcmRzIHdoZW4ga2V5d29yZC50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsb3dlckNhc2VQcmVmaXgpIGlzIDBcbiAgICAgIGNvbXBsZXRpb25zLnB1c2goQGJ1aWxkQ29tcGxldGlvbihrZXl3b3JkKSlcblxuICAgIGlmIEB1c2VyU3VnZ2VzdGlvbnM/XG4gICAgICBmb3IgdXNlckZ1bmMgaW4gQHVzZXJTdWdnZXN0aW9ucy51c2VyX2Z1bmN0aW9ucyB3aGVuIHVzZXJGdW5jLnRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxvd2VyQ2FzZVByZWZpeCkgaXMgMFxuICAgICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZENvbXBsZXRpb24odXNlckZ1bmMpKVxuXG4gICAgZm9yIGZ1bmMgaW4gQGZ1bnRpb25zLmZ1bmN0aW9ucyB3aGVuIGZ1bmMudGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YobG93ZXJDYXNlUHJlZml4KSBpcyAwXG4gICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZENvbXBsZXRpb24oZnVuYykpXG5cbiAgICBjb21wbGV0aW9uc1xuXG4gIGdldENvbXBsZXRpb25zOiAoe2VkaXRvciwgcHJlZml4fSkgLT5cbiAgICBjb21wbGV0aW9ucyA9IFtdXG4gICAgbG93ZXJDYXNlUHJlZml4ID0gcHJlZml4LnRvTG93ZXJDYXNlKClcblxuICAgIGZvciBjb25zdGFudHMgaW4gQGNvbXBsZXRpb25zLmNvbnN0YW50cyB3aGVuIGNvbnN0YW50cy50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsb3dlckNhc2VQcmVmaXgpIGlzIDBcbiAgICAgIGNvbXBsZXRpb25zLnB1c2goQGJ1aWxkQ29tcGxldGlvbihjb25zdGFudHMpKVxuXG4gICAgZm9yIGtleXdvcmQgaW4gQGNvbXBsZXRpb25zLmtleXdvcmRzIHdoZW4ga2V5d29yZC50ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihsb3dlckNhc2VQcmVmaXgpIGlzIDBcbiAgICAgIGNvbXBsZXRpb25zLnB1c2goQGJ1aWxkQ29tcGxldGlvbihrZXl3b3JkKSlcblxuICAgIGlmIEB1c2VyU3VnZ2VzdGlvbnM/XG4gICAgICBmb3IgdXNlckZ1bmMgaW4gQHVzZXJTdWdnZXN0aW9ucy51c2VyX2Z1bmN0aW9ucyB3aGVuIHVzZXJGdW5jLnRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxvd2VyQ2FzZVByZWZpeCkgaXMgMFxuICAgICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZENvbXBsZXRpb24odXNlckZ1bmMpKVxuXG4gICAgZm9yIGZ1bmMgaW4gQGZ1bnRpb25zLmZ1bmN0aW9ucyB3aGVuIGZ1bmMudGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YobG93ZXJDYXNlUHJlZml4KSBpcyAwXG4gICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZENvbXBsZXRpb24oZnVuYykpXG5cbiAgICBjb21wbGV0aW9uc1xuXG4gIGdldFZhcnNDb21wbGV0aW9uczogKHtlZGl0b3IsIHByZWZpeH0pIC0+XG4gICAgY29tcGxldGlvbnMgPSBbXVxuICAgIGxvd2VyQ2FzZVByZWZpeCA9IHByZWZpeC50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiBAdXNlclN1Z2dlc3Rpb25zP1xuICAgICAgZm9yIHVzZXJWYXIgaW4gQHVzZXJTdWdnZXN0aW9ucy51c2VyX3ZhcnMgd2hlbiB1c2VyVmFyLnRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxvd2VyQ2FzZVByZWZpeCkgaXMgMFxuICAgICAgICBjb21wbGV0aW9ucy5wdXNoKEBidWlsZENvbXBsZXRpb24odXNlclZhcikpXG5cbiAgICBmb3IgdmFyaWFibGUgaW4gQGNvbXBsZXRpb25zLnZhcmlhYmxlcyB3aGVuIHZhcmlhYmxlLnRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxvd2VyQ2FzZVByZWZpeCkgaXMgMFxuICAgICAgY29tcGxldGlvbnMucHVzaChAYnVpbGRDb21wbGV0aW9uKHZhcmlhYmxlKSlcblxuICAgIGNvbXBsZXRpb25zXG5cblxuICBidWlsZENvbXBsZXRpb246IChzdWdnZXN0aW9uKSAtPlxuICAgIHRleHQ6IHN1Z2dlc3Rpb24udGV4dFxuICAgIHR5cGU6IHN1Z2dlc3Rpb24udHlwZVxuICAgIGRpc3BsYXlUZXh0OiBzdWdnZXN0aW9uLmRpc3BsYXlUZXh0ID89IG51bGxcbiAgICBzbmlwcGV0OiBzdWdnZXN0aW9uLnNuaXBwZXQgPz0gbnVsbFxuICAgIGxlZnRMYWJlbDogc3VnZ2VzdGlvbi5sZWZ0TGFiZWwgPz0gbnVsbFxuICAgIGRlc2NyaXB0aW9uOiBzdWdnZXN0aW9uLmRlc2NyaXB0aW9uID89IFwiUEhQIDwje3N1Z2dlc3Rpb24udGV4dH0+ICN7c3VnZ2VzdGlvbi50eXBlfVwiXG4gICAgZGVzY3JpcHRpb25Nb3JlVVJMOiBzdWdnZXN0aW9uLmRlc2NyaXB0aW9uTW9yZVVSTCA/PSBudWxsXG4iXX0=
