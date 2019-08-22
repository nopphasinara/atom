(function() {
  module.exports = {
    activate: function(toolBar) {
      this.toolBar = toolBar('toolkits');
      this.toolBar.addButton({
        callback: {
          '': 'command-palette:toggle'
        },
        text: '<i class="gc"></i>',
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
      this.toolBar.addSpacer();
      this.toolBar.addButton({
        callback: {
          '': 'json-path-finder:show-result-flatten'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Show Result Flatten',
        type: 'button'
      });
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
        callback: {
          '': 'editor:toggle-soft-wrap'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Toggle Soft Wrap',
        type: 'button'
      });
      this.toolBar.addButton({
        callback: {
          '': 'markdown-preview:toggle'
        },
        text: '<i class="gc"></i>',
        html: true,
        tooltip: 'Markdown Preview',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90b29sa2l0cy9saWIvdG9vbC1iYXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFDLE9BQUQ7TUFDUixJQUFDLENBQUEsT0FBRCxHQUFXLE9BQUEsQ0FBUSxVQUFSO01BRVgsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQ0U7UUFBQSxRQUFBLEVBQ0U7VUFBQSxFQUFBLEVBQUksd0JBQUo7U0FERjtRQUVBLElBQUEsRUFBTSxxQkFGTjtRQUdBLElBQUEsRUFBTSxJQUhOO1FBSUEsT0FBQSxFQUFTLGlCQUpUO1FBS0EsSUFBQSxFQUFNLFFBTE47T0FERjtNQVFBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUNFO1FBQUEsUUFBQSxFQUFVLGtCQUFWO1FBQ0EsSUFBQSxFQUFNLHFCQUROO1FBRUEsSUFBQSxFQUFNLElBRk47UUFHQSxPQUFBLEVBQVMsV0FIVDtRQUlBLElBQUEsRUFBTSxRQUpOO09BREY7TUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBQTtNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUNFO1FBQUEsUUFBQSxFQUFVLDJCQUFWO1FBQ0EsSUFBQSxFQUFNLHFCQUROO1FBRUEsSUFBQSxFQUFNLElBRk47UUFHQSxPQUFBLEVBQVMsVUFIVDtRQUlBLElBQUEsRUFBTSxRQUpOO09BREY7TUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FDRTtRQUFBLFFBQUEsRUFDRTtVQUFBLEVBQUEsRUFBSSxpQkFBSjtVQUNBLE9BQUEsRUFBUyx5QkFEVDtVQUVBLFdBQUEsRUFBYSxvQkFGYjtTQURGO1FBSUEsSUFBQSxFQUFNLHFCQUpOO1FBS0EsSUFBQSxFQUFNLElBTE47UUFNQSxPQUFBLEVBQVMsdUNBTlQ7UUFPQSxJ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Q29udGVudCI6WyIjIEB0b29sQmFyLmFkZEJ1dHRvblxuIyAgIGNhbGxiYWNrOlxuIyAgICAgJyc6ICdlZGl0b3I6dG9nZ2xlLXNvZnQtd3JhcCdcbiMgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6ssDwvaT4nXG4jICAgaHRtbDogdHJ1ZVxuIyAgIHRvb2x0aXA6ICdUb2dnbGUgU29mdCBXcmFwJ1xuIyAgIHR5cGU6ICdidXR0b24nXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6ICh0b29sQmFyKSAtPlxuICAgIEB0b29sQmFyID0gdG9vbEJhciAndG9vbGtpdHMnXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ2NvbW1hbmQtcGFsZXR0ZTp0b2dnbGUnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu+HpTwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnQ29tbWFuZCBQYWxldHRlJ1xuICAgICAgdHlwZTogJ2J1dHRvbidcblxuICAgIEB0b29sQmFyLmFkZEJ1dHRvblxuICAgICAgY2FsbGJhY2s6ICd0b2RvLXNob3c6dG9nZ2xlJ1xuICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZ2NcIj7uqbs8L2k+J1xuICAgICAgaHRtbDogdHJ1ZVxuICAgICAgdG9vbHRpcDogJ1RvZG8gU2hvdydcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRTcGFjZXIoKVxuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazogJ2F0b20tbWluaWZ5Om1pbmlmeS1kaXJlY3QnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6npTwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnTWluaWZpZWQnXG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazpcbiAgICAgICAgJyc6ICdzb3J0LWxpbmVzOnNvcnQnXG4gICAgICAgICdzaGlmdCc6ICdzb3J0LWxpbmVzOnJldmVyc2Utc29ydCdcbiAgICAgICAgJ3NoaWZ0LWFsdCc6ICdzb3J0LWxpbmVzOnNodWZmbGUnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6slzwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnU29ydCBMaW5lcyAoU2hpZnQgY2xpY2sgcmV2ZXJzZSBzb3J0KSdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ2NoYW5nZS1jYXNlOnN3YXAnXG4gICAgICAgICdzaGlmdCc6ICdjaGFuZ2UtY2FzZTprZWJhYidcbiAgICAgICAgJ3NoaWZ0LWFsdCc6ICdjaGFuZ2UtY2FzZTpjYW1lbCdcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7qi7PC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdUZXh0IFRyYW5zZm9ybSdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRTcGFjZXIoKVxuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazogJ2dpdGh1Yjp0b2dnbGUtZ2l0LXRhYidcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7qSiPC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdHaXRodWIgVG9nZ2xlJ1xuICAgICAgdHlwZTogJ2J1dHRvbidcblxuICAgIEB0b29sQmFyLmFkZEJ1dHRvblxuICAgICAgY2FsbGJhY2s6ICdzcGxpdC1kaWZmOnRvZ2dsZSdcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7qiLPC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdTcGxpdCBEaWZmJ1xuICAgICAgdHlwZTogJ2J1dHRvbidcblxuICAgIEB0b29sQmFyLmFkZFNwYWNlcigpXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ3JlbW90ZS1zeW5jOmNvbmZpZ3VyZSdcbiAgICAgICAgJ2FsdCc6ICdyZW1vdGUtZnRwOmRpc2Nvbm5lY3QnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6ysDwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnUmVtb3RlIEZUUCdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICAjIEB0b29sQmFyLmFkZEJ1dHRvblxuICAgICMgICBjYWxsYmFjazpcbiAgICAjICAgICAnJzogJ3JlbW90ZS1zeW5jOnVwbG9hZC1maWxlJ1xuICAgICMgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6ttjwvaT4nXG4gICAgIyAgIGh0bWw6IHRydWVcbiAgICAjICAgdG9vbHRpcDogJ1VwbG9hZCBGaWxlJ1xuICAgICMgICB0eXBlOiAnYnV0dG9uJ1xuXG4gICAgIyBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAjICAgY2FsbGJhY2s6XG4gICAgIyAgICAgJyc6ICdyZW1vdGUtc3luYzpkb3dubG9hZC1maWxlJ1xuICAgICMgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6ttTwvaT4nXG4gICAgIyAgIGh0bWw6IHRydWVcbiAgICAjICAgdG9vbHRpcDogJ0Rvd25sb2FkIEZpbGUnXG4gICAgIyAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRTcGFjZXIoKVxuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazpcbiAgICAgICAgJyc6ICdqc29uLXBhdGgtZmluZGVyOnNob3ctcmVzdWx0LWZsYXR0ZW4nXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu6yjTwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnU2hvdyBSZXN1bHQgRmxhdHRlbidcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ2tleS1iaW5kaW5nLXJlc29sdmVyOnRvZ2dsZSdcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7rGKPC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdUb2dnbGUgS2V5IEJpbmRpbmcgUmVzb2x2ZXInXG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazpcbiAgICAgICAgJyc6ICdlZGl0b3I6bG9nLWN1cnNvci1zY29wZSdcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+7qywPC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdDdXJzb3IgU2NvcGUnXG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBjYWxsYmFjazpcbiAgICAgICAgJyc6ICdlZGl0b3I6dG9nZ2xlLXNvZnQtd3JhcCdcbiAgICAgIHRleHQ6ICc8aSBjbGFzcz1cImdjXCI+75a2PC9pPidcbiAgICAgIGh0bWw6IHRydWVcbiAgICAgIHRvb2x0aXA6ICdUb2dnbGUgU29mdCBXcmFwJ1xuICAgICAgdHlwZTogJ2J1dHRvbidcblxuICAgIEB0b29sQmFyLmFkZEJ1dHRvblxuICAgICAgY2FsbGJhY2s6XG4gICAgICAgICcnOiAnbWFya2Rvd24tcHJldmlldzp0b2dnbGUnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu+NmjwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnTWFya2Rvd24gUHJldmlldydcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOiAnYXV0b3ByZWZpeGVyJ1xuICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZ2NcIj7vg6E8L2k+J1xuICAgICAgaHRtbDogdHJ1ZVxuICAgICAgdG9vbHRpcDogJ0NTUyBBdXRvcHJlZml4ZXInXG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuXG4gICAgIyBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAjICAgaWNvbjogJ3RyYW5zbGF0ZSdcbiAgICAjICAgdXJsOiAnaHR0cHM6Ly90cmFuc2xhdGUuZ29vZ2xlLmNvbSdcbiAgICAjICAgdG9vbHRpcDogJ0dvb2dsZSBUcmFuc2xhdGUnXG4gICAgIyAgIGljb25zZXQ6ICdtZGknXG4gICAgIyAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ3Nhc3MtYXV0b2NvbXBpbGU6Y29tcGlsZS10by1maWxlJ1xuICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZ2NcIj7vn6s8L2k+J1xuICAgICAgaHRtbDogdHJ1ZVxuICAgICAgdG9vbHRpcDogJ0NvbXBpbGUgU0FTUydcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ3dpbmRvdzpyZWxvYWQnXG4gICAgICB0ZXh0OiAnPGkgY2xhc3M9XCJnY1wiPu+RkzwvaT4nXG4gICAgICBodG1sOiB0cnVlXG4gICAgICB0b29sdGlwOiAnUmVsb2FkIFdpbmRvdydcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGNhbGxiYWNrOlxuICAgICAgICAnJzogJ3dpbmRvdzp0b2dnbGUtZGV2LXRvb2xzJ1xuICAgICAgdGV4dDogJzxpIGNsYXNzPVwiZ2NcIj7vho08L2k+J1xuICAgICAgaHRtbDogdHJ1ZVxuICAgICAgdG9vbHRpcDogJ0RldiBUb29scydcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRTcGFjZXIoKVxuXG4gICAgQHRvb2xCYXIuYWRkQnV0dG9uXG4gICAgICBpY29uOiAnZG90cy12ZXJ0aWNhbCdcbiAgICAgIGNhbGxiYWNrOiAnd2luZG93OnRvZ2dsZS1yaWdodC1kb2NrJ1xuICAgICAgdG9vbHRpcDogJ1RvZ2dsZSBSaWdodCBEb2NrJ1xuICAgICAgaWNvbnNldDogJ21kaSdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgICBAdG9vbEJhci5hZGRCdXR0b25cbiAgICAgIGljb246ICdkb3RzLWhvcml6b250YWwnXG4gICAgICBjYWxsYmFjazogJ3dpbmRvdzp0b2dnbGUtYm90dG9tLWRvY2snXG4gICAgICB0b29sdGlwOiAnVG9nZ2xlIEJvdHRvbSBEb2NrJ1xuICAgICAgaWNvbnNldDogJ21kaSdcbiAgICAgIHR5cGU6ICdidXR0b24nXG5cbiAgZGVhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEB0b29sQmFyPy5yZW1vdmVJdGVtcygpXG4gICAgQHRvb2xiYXI/LmRlc3Ryb3koKVxuXG4gICAgQHRvb2xiYXIgPSBudWxsXG4iXX0=
