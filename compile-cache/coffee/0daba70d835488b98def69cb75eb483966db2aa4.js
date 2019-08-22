(function() {
  var AnnotationManager, AutocompletionManager, GotoManager, StatusInProgress, TooltipManager, config, parser, plugins, proxy;

  GotoManager = require("./goto/goto-manager.coffee");

  TooltipManager = require("./tooltip/tooltip-manager.coffee");

  AnnotationManager = require("./annotation/annotation-manager.coffee");

  AutocompletionManager = require("./autocompletion/autocompletion-manager.coffee");

  StatusInProgress = require("./services/status-in-progress.coffee");

  config = require('./config.coffee');

  proxy = require('./services/php-proxy.coffee');

  parser = require('./services/php-file-parser.coffee');

  plugins = require('./services/plugin-manager.coffee');

  module.exports = {
    config: {
      binComposer: {
        title: 'Command to use composer',
        description: 'This plugin depends on composer in order to work. Specify the path to your composer bin (e.g : bin/composer, composer.phar, composer)',
        type: 'string',
        "default": '/usr/local/bin/composer',
        order: 1
      },
      binPhp: {
        title: 'Command php',
        description: 'This plugin use php CLI in order to work. Please specify your php command ("php" on UNIX systems)',
        type: 'string',
        "default": 'php',
        order: 2
      },
      autoloadPaths: {
        title: 'Autoloader file',
        description: 'Relative path to the files of autoload.php from composer (or an other one). You can specify multiple paths (comma separated) if you have different paths for some projects.',
        type: 'array',
        "default": ['vendor/autoload.php', 'autoload.php'],
        order: 3
      },
      gotoKey: {
        title: 'Goto key',
        description: 'Key to use with "click" to use goto. By default "alt" (because on macOS, ctrl + click is like right click)',
        type: 'string',
        "default": 'alt',
        "enum": ['alt', 'ctrl', 'cmd'],
        order: 4
      },
      classMapFiles: {
        title: 'Classmap files',
        description: 'Relative path to the files that contains a classmap (array with "className" => "fileName"). By default on composer it\'s vendor/composer/autoload_classmap.php',
        type: 'array',
        "default": ['vendor/composer/autoload_classmap.php', 'autoload/ezp_kernel.php'],
        order: 5
      },
      insertNewlinesForUseStatements: {
        title: 'Insert newlines for use statements.',
        description: 'When enabled, the plugin will add additional newlines before or after an automatically added use statement when it can\'t add them nicely to an existing group. This results in more cleanly separated use statements but will create additional vertical whitespace.',
        type: 'boolean',
        "default": false,
        order: 6
      },
      verboseErrors: {
        title: 'Errors on file saving showed',
        description: 'When enabled, you\'ll have a notification once an error occured on autocomplete. Otherwise, the message will just be logged in developer console',
        type: 'boolean',
        "default": false,
        order: 7
      }
    },
    activate: function() {
      config.testConfig();
      config.init();
      this.autocompletionManager = new AutocompletionManager();
      this.autocompletionManager.init();
      this.gotoManager = new GotoManager();
      this.gotoManager.init();
      this.tooltipManager = new TooltipManager();
      this.tooltipManager.init();
      this.annotationManager = new AnnotationManager();
      this.annotationManager.init();
      return proxy.init();
    },
    deactivate: function() {
      this.gotoManager.deactivate();
      this.tooltipManager.deactivate();
      this.annotationManager.deactivate();
      this.autocompletionManager.deactivate();
      return proxy.deactivate();
    },
    consumeStatusBar: function(statusBar) {
      config.statusInProgress.initialize(statusBar);
      config.statusInProgress.attach();
      config.statusErrorAutocomplete.initialize(statusBar);
      return config.statusErrorAutocomplete.attach();
    },
    consumePlugin: function(plugin) {
      return plugins.plugins.push(plugin);
    },
    provideAutocompleteTools: function() {
      this.services = {
        proxy: proxy,
        parser: parser
      };
      return this.services;
    },
    getProvider: function() {
      return this.autocompletionManager.getProviders();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3BlZWttby1waHAtYXRvbS1hdXRvY29tcGxldGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLDRCQUFSOztFQUNkLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGtDQUFSOztFQUNqQixpQkFBQSxHQUFvQixPQUFBLENBQVEsd0NBQVI7O0VBQ3BCLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSxnREFBUjs7RUFDeEIsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNDQUFSOztFQUNuQixNQUFBLEdBQVMsT0FBQSxDQUFRLGlCQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsNkJBQVI7O0VBQ1IsTUFBQSxHQUFTLE9BQUEsQ0FBUSxtQ0FBUjs7RUFDVCxPQUFBLEdBQVUsT0FBQSxDQUFRLGtDQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7SUFBQSxNQUFBLEVBQ0k7TUFBQSxXQUFBLEVBQ0k7UUFBQSxLQUFBLEVBQU8seUJBQVA7UUFDQSxXQUFBLEVBQWEsdUlBRGI7UUFHQSxJQUFBLEVBQU0sUUFITjtRQUlBLENBQUEsT0FBQSxDQUFBLEVBQVMseUJBSlQ7UUFLQSxLQUFBLEVBQU8sQ0FMUDtPQURKO01BUUEsTUFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGFBQVA7UUFDQSxXQUFBLEVBQWEsbUdBRGI7UUFHQSxJQUFBLEVBQU0sUUFITjtRQUlBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FKVDtRQUtBLEtBQUEsRUFBTyxDQUxQO09BVEo7TUFnQkEsYUFBQSxFQUNJO1FBQUEsS0FBQSxFQUFPLGlCQUFQO1FBQ0EsV0FBQSxFQUFhLDZLQURiO1FBR0EsSUFBQSxFQUFNLE9BSE47UUFJQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMscUJB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Q29udGVudCI6WyJHb3RvTWFuYWdlciA9IHJlcXVpcmUgXCIuL2dvdG8vZ290by1tYW5hZ2VyLmNvZmZlZVwiXG5Ub29sdGlwTWFuYWdlciA9IHJlcXVpcmUgXCIuL3Rvb2x0aXAvdG9vbHRpcC1tYW5hZ2VyLmNvZmZlZVwiXG5Bbm5vdGF0aW9uTWFuYWdlciA9IHJlcXVpcmUgXCIuL2Fubm90YXRpb24vYW5ub3RhdGlvbi1tYW5hZ2VyLmNvZmZlZVwiXG5BdXRvY29tcGxldGlvbk1hbmFnZXIgPSByZXF1aXJlIFwiLi9hdXRvY29tcGxldGlvbi9hdXRvY29tcGxldGlvbi1tYW5hZ2VyLmNvZmZlZVwiXG5TdGF0dXNJblByb2dyZXNzID0gcmVxdWlyZSBcIi4vc2VydmljZXMvc3RhdHVzLWluLXByb2dyZXNzLmNvZmZlZVwiXG5jb25maWcgPSByZXF1aXJlICcuL2NvbmZpZy5jb2ZmZWUnXG5wcm94eSA9IHJlcXVpcmUgJy4vc2VydmljZXMvcGhwLXByb3h5LmNvZmZlZSdcbnBhcnNlciA9IHJlcXVpcmUgJy4vc2VydmljZXMvcGhwLWZpbGUtcGFyc2VyLmNvZmZlZSdcbnBsdWdpbnMgPSByZXF1aXJlICcuL3NlcnZpY2VzL3BsdWdpbi1tYW5hZ2VyLmNvZmZlZSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIGNvbmZpZzpcbiAgICAgICAgYmluQ29tcG9zZXI6XG4gICAgICAgICAgICB0aXRsZTogJ0NvbW1hbmQgdG8gdXNlIGNvbXBvc2VyJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIHBsdWdpbiBkZXBlbmRzIG9uIGNvbXBvc2VyIGluIG9yZGVyIHRvIHdvcmsuIFNwZWNpZnkgdGhlIHBhdGhcbiAgICAgICAgICAgICB0byB5b3VyIGNvbXBvc2VyIGJpbiAoZS5nIDogYmluL2NvbXBvc2VyLCBjb21wb3Nlci5waGFyLCBjb21wb3NlciknXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgZGVmYXVsdDogJy91c3IvbG9jYWwvYmluL2NvbXBvc2VyJ1xuICAgICAgICAgICAgb3JkZXI6IDFcblxuICAgICAgICBiaW5QaHA6XG4gICAgICAgICAgICB0aXRsZTogJ0NvbW1hbmQgcGhwJ1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUaGlzIHBsdWdpbiB1c2UgcGhwIENMSSBpbiBvcmRlciB0byB3b3JrLiBQbGVhc2Ugc3BlY2lmeSB5b3VyIHBocFxuICAgICAgICAgICAgIGNvbW1hbmQgKFwicGhwXCIgb24gVU5JWCBzeXN0ZW1zKSdcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiAncGhwJ1xuICAgICAgICAgICAgb3JkZXI6IDJcblxuICAgICAgICBhdXRvbG9hZFBhdGhzOlxuICAgICAgICAgICAgdGl0bGU6ICdBdXRvbG9hZGVyIGZpbGUnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1JlbGF0aXZlIHBhdGggdG8gdGhlIGZpbGVzIG9mIGF1dG9sb2FkLnBocCBmcm9tIGNvbXBvc2VyIChvciBhbiBvdGhlciBvbmUpLiBZb3UgY2FuIHNwZWNpZnkgbXVsdGlwbGVcbiAgICAgICAgICAgICBwYXRocyAoY29tbWEgc2VwYXJhdGVkKSBpZiB5b3UgaGF2ZSBkaWZmZXJlbnQgcGF0aHMgZm9yIHNvbWUgcHJvamVjdHMuJ1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgICAgICAgZGVmYXVsdDogWyd2ZW5kb3IvYXV0b2xvYWQucGhwJywgJ2F1dG9sb2FkLnBocCddXG4gICAgICAgICAgICBvcmRlcjogM1xuXG4gICAgICAgIGdvdG9LZXk6XG4gICAgICAgICAgICB0aXRsZTogJ0dvdG8ga2V5J1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdLZXkgdG8gdXNlIHdpdGggXCJjbGlja1wiIHRvIHVzZSBnb3RvLiBCeSBkZWZhdWx0IFwiYWx0XCIgKGJlY2F1c2Ugb24gbWFjT1MsIGN0cmwgKyBjbGljayBpcyBsaWtlIHJpZ2h0IGNsaWNrKSdcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICBkZWZhdWx0OiAnYWx0J1xuICAgICAgICAgICAgZW51bTogWydhbHQnLCAnY3RybCcsICdjbWQnXVxuICAgICAgICAgICAgb3JkZXI6IDRcblxuICAgICAgICBjbGFzc01hcEZpbGVzOlxuICAgICAgICAgICAgdGl0bGU6ICdDbGFzc21hcCBmaWxlcydcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUmVsYXRpdmUgcGF0aCB0byB0aGUgZmlsZXMgdGhhdCBjb250YWlucyBhIGNsYXNzbWFwIChhcnJheSB3aXRoIFwiY2xhc3NOYW1lXCIgPT4gXCJmaWxlTmFtZVwiKS4gQnkgZGVmYXVsdFxuICAgICAgICAgICAgIG9uIGNvbXBvc2VyIGl0XFwncyB2ZW5kb3IvY29tcG9zZXIvYXV0b2xvYWRfY2xhc3NtYXAucGhwJ1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgICAgICAgZGVmYXVsdDogWyd2ZW5kb3IvY29tcG9zZXIvYXV0b2xvYWRfY2xhc3NtYXAucGhwJywgJ2F1dG9sb2FkL2V6cF9rZXJuZWwucGhwJ11cbiAgICAgICAgICAgIG9yZGVyOiA1XG5cbiAgICAgICAgaW5zZXJ0TmV3bGluZXNGb3JVc2VTdGF0ZW1lbnRzOlxuICAgICAgICAgICAgdGl0bGU6ICdJbnNlcnQgbmV3bGluZXMgZm9yIHVzZSBzdGF0ZW1lbnRzLidcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBlbmFibGVkLCB0aGUgcGx1Z2luIHdpbGwgYWRkIGFkZGl0aW9uYWwgbmV3bGluZXMgYmVmb3JlIG9yIGFmdGVyIGFuIGF1dG9tYXRpY2FsbHkgYWRkZWRcbiAgICAgICAgICAgICAgICB1c2Ugc3RhdGVtZW50IHdoZW4gaXQgY2FuXFwndCBhZGQgdGhlbSBuaWNlbHkgdG8gYW4gZXhpc3RpbmcgZ3JvdXAuIFRoaXMgcmVzdWx0cyBpbiBtb3JlIGNsZWFubHlcbiAgICAgICAgICAgICAgICBzZXBhcmF0ZWQgdXNlIHN0YXRlbWVudHMgYnV0IHdpbGwgY3JlYXRlIGFkZGl0aW9uYWwgdmVydGljYWwgd2hpdGVzcGFjZS4nXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBvcmRlcjogNlxuXG4gICAgICAgIHZlcmJvc2VFcnJvcnM6XG4gICAgICAgICAgICB0aXRsZTogJ0Vycm9ycyBvbiBmaWxlIHNhdmluZyBzaG93ZWQnXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1doZW4gZW5hYmxlZCwgeW91XFwnbGwgaGF2ZSBhIG5vdGlmaWNhdGlvbiBvbmNlIGFuIGVycm9yIG9jY3VyZWQgb24gYXV0b2NvbXBsZXRlLiBPdGhlcndpc2UsIHRoZSBtZXNzYWdlIHdpbGwganVzdCBiZSBsb2dnZWQgaW4gZGV2ZWxvcGVyIGNvbnNvbGUnXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICBvcmRlcjogN1xuXG4gICAgYWN0aXZhdGU6IC0+XG4gICAgICAgIGNvbmZpZy50ZXN0Q29uZmlnKClcbiAgICAgICAgY29uZmlnLmluaXQoKVxuXG4gICAgICAgIEBhdXRvY29tcGxldGlvbk1hbmFnZXIgPSBuZXcgQXV0b2NvbXBsZXRpb25NYW5hZ2VyKClcbiAgICAgICAgQGF1dG9jb21wbGV0aW9uTWFuYWdlci5pbml0KClcblxuICAgICAgICBAZ290b01hbmFnZXIgPSBuZXcgR290b01hbmFnZXIoKVxuICAgICAgICBAZ290b01hbmFnZXIuaW5pdCgpXG5cbiAgICAgICAgQHRvb2x0aXBNYW5hZ2VyID0gbmV3IFRvb2x0aXBNYW5hZ2VyKClcbiAgICAgICAgQHRvb2x0aXBNYW5hZ2VyLmluaXQoKVxuXG4gICAgICAgIEBhbm5vdGF0aW9uTWFuYWdlciA9IG5ldyBBbm5vdGF0aW9uTWFuYWdlcigpXG4gICAgICAgIEBhbm5vdGF0aW9uTWFuYWdlci5pbml0KClcblxuICAgICAgICBwcm94eS5pbml0KClcblxuICAgIGRlYWN0aXZhdGU6IC0+XG4gICAgICAgIEBnb3RvTWFuYWdlci5kZWFjdGl2YXRlKClcbiAgICAgICAgQHRvb2x0aXBNYW5hZ2VyLmRlYWN0aXZhdGUoKVxuICAgICAgICBAYW5ub3RhdGlvbk1hbmFnZXIuZGVhY3RpdmF0ZSgpXG4gICAgICAgIEBhdXRvY29tcGxldGlvbk1hbmFnZXIuZGVhY3RpdmF0ZSgpXG4gICAgICAgIHByb3h5LmRlYWN0aXZhdGUoKVxuXG4gICAgY29uc3VtZVN0YXR1c0JhcjogKHN0YXR1c0JhcikgLT5cbiAgICAgICAgY29uZmlnLnN0YXR1c0luUHJvZ3Jlc3MuaW5pdGlhbGl6ZShzdGF0dXNCYXIpXG4gICAgICAgIGNvbmZpZy5zdGF0dXNJblByb2dyZXNzLmF0dGFjaCgpXG5cbiAgICAgICAgY29uZmlnLnN0YXR1c0Vycm9yQXV0b2NvbXBsZXRlLmluaXRpYWxpemUoc3RhdHVzQmFyKVxuICAgICAgICBjb25maWcuc3RhdHVzRXJyb3JBdXRvY29tcGxldGUuYXR0YWNoKClcblxuICAgIGNvbnN1bWVQbHVnaW46IChwbHVnaW4pIC0+XG4gICAgICAgIHBsdWdpbnMucGx1Z2lucy5wdXNoKHBsdWdpbilcblxuICAgIHByb3ZpZGVBdXRvY29tcGxldGVUb29sczogLT5cbiAgICAgICAgQHNlcnZpY2VzID1cbiAgICAgICAgICAgIHByb3h5OiBwcm94eVxuICAgICAgICAgICAgcGFyc2VyOiBwYXJzZXJcblxuICAgICAgICByZXR1cm4gQHNlcnZpY2VzXG5cbiAgICBnZXRQcm92aWRlcjogLT5cbiAgICAgICAgcmV0dXJuIEBhdXRvY29tcGxldGlvbk1hbmFnZXIuZ2V0UHJvdmlkZXJzKClcbiJdfQ==
