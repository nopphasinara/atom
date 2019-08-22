(function() {
  module.exports = {
    activate: function(toolBar) {
      this.toolBar = toolBar('toolkits');
      this.toolBar.addButton({
        callback: 'command-palette:toggle',
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Command Palette',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: 'todo-show:toggle',
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Todo Show',
        type: 'button'
      });
      this.toolBar.addSpacer();
      this.toolBar.addButton({
        callback: 'atom-minify:minify-direct',
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Minified',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: {
          '': 'sort-lines:sort',
          'shift': 'sort-lines:reverse-sort',
          'shift-alt': 'sort-lines:shuffle'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Sort Lines (Shift click reverse sort)',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: {
          '': 'change-case:swap',
          'shift': 'change-case:kebab',
          'shift-alt': 'change-case:camel'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Text Transform',
        type: 'button'
      });
      this.toolBar.addSpacer();
      this.toolBar.addButton({
        callback: 'github:toggle-git-tab',
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Github Toggle',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: 'split-diff:toggle',
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Split Diff',
        type: 'button'
      });
      this.toolBar.addSpacer();
      this.toolBar.addButton({
        callback: {
          '': 'remote-sync:configure',
          'alt': 'remote-ftp:disconnect'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Remote FTP',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: {
          '': 'remote-sync:upload-file'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Upload File',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: {
          '': 'remote-sync:download-file'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Download File',
        type: 'button'
      });
      this.toolBar.addSpacer();
      this.toolBar.addButton({
        callback: {
          '': 'key-binding-resolver:toggle'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Toggle Key Binding Resolver',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: {
          '': 'editor:log-cursor-scope'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Cursor Scope',
        type: 'button'
      });
      this.toolBar.addButton({
        icon: 'wrap',
        callback: 'editor:toggle-soft-wrap',
        tooltip: 'Toggle Soft Wrap',
        iconset: 'mdi',
        type: 'button'
      });
      this.toolBar.addButton({
        icon: 'eye',
        callback: 'markdown-preview:toggle',
        tooltip: 'Markdown Preview',
        iconset: 'mdi',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: 'autoprefixer',
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'CSS Autoprefixer',
        type: 'button'
      });
      this.toolBar.addButton({
        icon: 'translate',
        url: 'https://translate.google.com',
        tooltip: 'Google Translate',
        iconset: 'mdi',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: {
          '': 'sass-autocompile:compile-to-file'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Compile SASS',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: {
          '': 'window:reload'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Reload Window',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: {
          '': 'window:toggle-dev-tools'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Dev Tools',
        type: 'button'
      });
      this.toolBar.addSpacer();
      this.toolBar.addButton({
        icon: 'dots-vertical',
        callback: 'window:toggle-right-dock',
        tooltip: 'Toggle Right Dock',
        iconset: 'mdi',
        type: 'button'
      });
      return this.toolBar.addButton({
        icon: 'dots-horizontal',
        callback: 'window:toggle-bottom-dock',
        tooltip: 'Toggle Bottom Dock',
        iconset: 'mdi',
        type: 'button'
      });
    },
    deactivate: function(state) {
      var ref, ref1;
      if ((ref = this.toolBar) != null) {
        ref.removeItems();
      }
      if ((ref1 = this.toolbar) != null) {
        ref1.destroy();
      }
      return this.toolbar = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90b29sa2l0cy9saWIvdG9vbC1iYXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFDLE9BQUQ7TUFDUixJQUFDLENBQUEsT0FBRCxHQUFXLE9BQUEsQ0FBUSxVQUFSO01BRVgsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQ0U7UUFBQSxRQUFBLEVBQVUsd0JBQVY7UUFDQSxJQUFBLEVBQU0scUJBRE47UUFFQSxJQUFBLEVBQU0sSUFGTjtRQUdBLE9BQUEsRUFBUyxpQkFIVDtRQUlBLElBQUEsRUFBTSxRQUpOO09BREY7TUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FDRTtRQUFBLFFBQUEsRUFBVSxrQkFBVjtRQUNBLElBQUEsRUFBTSxxQkFETjtRQUVBLElBQUEsRUFBTSxJQUZOO1FBR0EsT0FBQSxFQUFTLFdBSFQ7UUFJQSxJQUFBLEVBQU0sUUFKTjtPQURGO01BT0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQUE7TUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FDRTtRQUFBLFFBQUEsRUFBVSwyQkFBVjtRQUNBLElBQUEsRUFBTSxxQkFETjtRQUVBLElBQUEsRUFBTSxJQUZOO1FBR0EsT0FBQSxFQUFTLFVBSFQ7UUFJQSxJQUFBLEVBQU0sUUFKTjtPQURGO01BT0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQ0U7UUFBQSxRQUFBLEVBQ0U7VUFBQSxFQUFBLEVBQUksaUJBQUo7VUFDQSxPQUFBLEVBQVMseUJBRFQ7VUFFQSxXQUFBLEVBQWEsb0JBRmI7U0FERjtRQUlBLElBQUEsRUFBTSxxQkFKTjtRQUtBLElBQUEsRUFBTSxJQUxOO1FBTUEsT0FBQSxFQUFTLHVDQU5UO1FBT0EsSUFBQSxFQUFNLFFBUE47T0FERjtN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RUFBTSxpQkFBTjtRQUNBLFFBQUEsRUFBVSwyQkFEVjtRQUVBLE9BQUEsRUFBUyxvQkFGVDtRQUdBLE9BQUEsRUFBUyxLQUhUO1FBSUEsSUFBQSxFQUFNLFFBSk47T0FERjtJQXhLUSxDQUFWO0lBK0tBLFVBQUEsRUFBWSxTQUFDLEtBQUQ7QUFDVixVQUFBOztXQUFRLENBQUUsV0FBVixDQUFBOzs7WUFDUSxDQUFFLE9BQVYsQ0FBQTs7YUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBSkQsQ0EvS1o7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAodG9vbEJhcikgLT5cbiAgICBAdG9vbEJhciA9IHRvb2xCYXIgJ3Rvb2xraXRzJ1xuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazogJ2NvbW1hbmQtcGFsZXR0ZTp0b2dnbGUnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6qkjwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnQ29tbWFuZCBQYWxldHRlJ1xuICAgICAgdHlwZTogJ2J1dHRvbidcblxuICAgIEB0b29sQmFyLmFkZEJ1dHRvblxuICAgICAgY2FsbGJhY2s6ICd0b2RvLXNob3c6dG9nZ2xlJ1xuICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZ2NcIj7uqbs8L2k+J1xuICAgICAgaHRtbDogdHJ1ZVxuICAgICAgdG9vbHRpcDogJ1RvZG8gU2hvdydcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRTcGFjZXIoKVxuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazogJ2F0b20tbWluaWZ5Om1pbmlmeS1kaXJlY3QnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6npTwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnTWluaWZpZWQnXG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazpcbiAgICAgICAgJyc6ICdzb3J0LWxpbmVzOnNvcnQnXG4gICAgICAgICdzaGlmdCc6ICdzb3J0LWxpbmVzOnJldmVyc2Utc29ydCdcbiAgICAgICAgJ3NoaWZ0LWFsdCc6ICdzb3J0LWxpbmVzOnNodWZmbGUnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6slzwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnU29ydCBMaW5lcyAoU2hpZnQgY2xpY2sgcmV2ZXJzZSBzb3J0KSdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ2NoYW5nZS1jYXNlOnN3YXAnXG4gICAgICAgICdzaGlmdCc6ICdjaGFuZ2UtY2FzZTprZWJhYidcbiAgICAgICAgJ3NoaWZ0LWFsdCc6ICdjaGFuZ2UtY2FzZTpjYW1lbCdcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7qi7PC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdUZXh0IFRyYW5zZm9ybSdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRTcGFjZXIoKVxuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazogJ2dpdGh1Yjp0b2dnbGUtZ2l0LXRhYidcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7qSiPC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdHaXRodWIgVG9nZ2xlJ1xuICAgICAgdHlwZTogJ2J1dHRvbidcblxuICAgIEB0b29sQmFyLmFkZEJ1dHRvblxuICAgICAgY2FsbGJhY2s6ICdzcGxpdC1kaWZmOnRvZ2dsZSdcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7qiLPC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdTcGxpdCBEaWZmJ1xuICAgICAgdHlwZTogJ2J1dHRvbidcblxuICAgIEB0b29sQmFyLmFkZFNwYWNlcigpXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ3JlbW90ZS1zeW5jOmNvbmZpZ3VyZSdcbiAgICAgICAgJ2FsdCc6ICdyZW1vdGUtZnRwOmRpc2Nvbm5lY3QnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6ysDwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnUmVtb3RlIEZUUCdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ3JlbW90ZS1zeW5jOnVwbG9hZC1maWxlJ1xuICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZ2NcIj7urbY8L2k+J1xuICAgICAgaHRtbDogdHJ1ZVxuICAgICAgdG9vbHRpcDogJ1VwbG9hZCBGaWxlJ1xuICAgICAgdHlwZTogJ2J1dHRvbidcblxuICAgIEB0b29sQmFyLmFkZEJ1dHRvblxuICAgICAgY2FsbGJhY2s6XG4gICAgICAgICcnOiAncmVtb3RlLXN5bmM6ZG93bmxvYWQtZmlsZSdcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7q21PC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdEb3dubG9hZCBGaWxlJ1xuICAgICAgdHlwZTogJ2J1dHRvbidcblxuICAgIEB0b29sQmFyLmFkZFNwYWNlcigpXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ2tleS1iaW5kaW5nLXJlc29sdmVyOnRvZ2dsZSdcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7rGKPC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdUb2dnbGUgS2V5IEJpbmRpbmcgUmVzb2x2ZXInXG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazpcbiAgICAgICAgJyc6ICdlZGl0b3I6bG9nLWN1cnNvci1zY29wZSdcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7qywPC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdDdXJzb3IgU2NvcGUnXG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBpY29uOiAnd3JhcCdcbiAgICAgIGNhbGxiYWNrOiAnZWRpdG9yOnRvZ2dsZS1zb2Z0LXdyYXAnXG4gICAgICB0b29sdGlwOiAnVG9nZ2xlIFNvZnQgV3JhcCdcbiAgICAgIGljb25zZXQ6ICdtZGknXG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBpY29uOiAnZXllJ1xuICAgICAgY2FsbGJhY2s6ICdtYXJrZG93bi1wcmV2aWV3OnRvZ2dsZSdcbiAgICAgIHRvb2x0aXA6ICdNYXJrZG93biBQcmV2aWV3J1xuICAgICAgaWNvbnNldDogJ21kaSdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOiAnYXV0b3ByZWZpeGVyJ1xuICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZ2NcIj7vg6E8L2k+J1xuICAgICAgaHRtbDogdHJ1ZVxuICAgICAgdG9vbHRpcDogJ0NTUyBBdXRvcHJlZml4ZXInXG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBpY29uOiAndHJhbnNsYXRlJ1xuICAgICAgdXJsOiAnaHR0cHM6Ly90cmFuc2xhdGUuZ29vZ2xlLmNvbSdcbiAgICAgIHRvb2x0aXA6ICdHb29nbGUgVHJhbnNsYXRlJ1xuICAgICAgaWNvbnNldDogJ21kaSdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ3Nhc3MtYXV0b2NvbXBpbGU6Y29tcGlsZS10by1maWxlJ1xuICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZ2NcIj7vn6s8L2k+J1xuICAgICAgaHRtbDogdHJ1ZVxuICAgICAgdG9vbHRpcDogJ0NvbXBpbGUgU0FTUydcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ3dpbmRvdzpyZWxvYWQnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu+RkzwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnUmVsb2FkIFdpbmRvdydcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ3dpbmRvdzp0b2dnbGUtZGV2LXRvb2xzJ1xuICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZ2NcIj7vho08L2k+J1xuICAgICAgaHRtbDogdHJ1ZVxuICAgICAgdG9vbHRpcDogJ0RldiBUb29scydcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRTcGFjZXIoKVxuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBpY29uOiAnZG90cy12ZXJ0aWNhbCdcbiAgICAgIGNhbGxiYWNrOiAnd2luZG93OnRvZ2dsZS1yaWdodC1kb2NrJ1xuICAgICAgdG9vbHRpcDogJ1RvZ2dsZSBSaWdodCBEb2NrJ1xuICAgICAgaWNvbnNldDogJ21kaSdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGljb246ICdkb3RzLWhvcml6b250YWwnXG4gICAgICBjYWxsYmFjazogJ3dpbmRvdzp0b2dnbGUtYm90dG9tLWRvY2snXG4gICAgICB0b29sdGlwOiAnVG9nZ2xlIEJvdHRvbSBEb2NrJ1xuICAgICAgaWNvbnNldDogJ21kaSdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgZGVhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEB0b29sQmFyPy5yZW1vdmVJdGVtcygpXG4gICAgQHRvb2xiYXI/LmRlc3Ryb3koKVxuXG4gICAgQHRvb2xiYXIgPSBudWxsXG4iXX0=
