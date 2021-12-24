'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  changeUseBladeComments: null,

  config: {
    useBladeComments: {
      type: 'boolean',
      'default': true,
      description: 'Use Blade comments by default when toggling line comments'
    }
  },

  activate: function activate() {
    this.changeUseBladeComments = atom.config.observe('language-blade.useBladeComments', function (enabled) {
      var opts = { scopeSelector: ['.text.html.php.blade'] };
      if (enabled) {
        atom.config.set('editor.commentStart', '{{-- ', opts);
        atom.config.set('editor.commentEnd', ' --}}', opts);
      } else {
        atom.config.unset('editor.commentStart', opts);
        atom.config.unset('editor.commentEnd', opts);
      }
    });
  },

  deactivate: function deactivate() {
    this.changeUseBladeComments.dispose();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1ibGFkZS9saWIvbGFuZ3VhZ2UtYmxhZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7OztxQkFFSTtBQUNiLHdCQUFzQixFQUFFLElBQUk7O0FBRTVCLFFBQU0sRUFBRTtBQUNOLG9CQUFnQixFQUFFO0FBQ2hCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsSUFBSTtBQUNiLGlCQUFXLEVBQUUsMkRBQTJEO0tBQ3pFO0dBQ0Y7O0FBRUQsVUFBUSxFQUFDLG9CQUFHO0FBQ1YsUUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxFQUFFLFVBQUEsT0FBTyxFQUFJO0FBQzlGLFVBQU0sSUFBSSxHQUFHLEVBQUMsYUFBYSxFQUFFLENBQUMsc0JBQXNCLENBQUMsRUFBQyxDQUFBO0FBQ3RELFVBQUksT0FBTyxFQUFFO0FBQ1gsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3JELFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUNwRCxNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDOUMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDN0M7S0FDRixDQUFDLENBQUE7R0FDSDs7QUFFRCxZQUFVLEVBQUMsc0JBQUc7QUFDWixRQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDdEM7Q0FDRiIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmxhZGUvbGliL2xhbmd1YWdlLWJsYWRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjaGFuZ2VVc2VCbGFkZUNvbW1lbnRzOiBudWxsLFxuXG4gIGNvbmZpZzoge1xuICAgIHVzZUJsYWRlQ29tbWVudHM6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VzZSBCbGFkZSBjb21tZW50cyBieSBkZWZhdWx0IHdoZW4gdG9nZ2xpbmcgbGluZSBjb21tZW50cydcbiAgICB9XG4gIH0sXG5cbiAgYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuY2hhbmdlVXNlQmxhZGVDb21tZW50cyA9IGF0b20uY29uZmlnLm9ic2VydmUoJ2xhbmd1YWdlLWJsYWRlLnVzZUJsYWRlQ29tbWVudHMnLCBlbmFibGVkID0+IHtcbiAgICAgIGNvbnN0IG9wdHMgPSB7c2NvcGVTZWxlY3RvcjogWycudGV4dC5odG1sLnBocC5ibGFkZSddfVxuICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3IuY29tbWVudFN0YXJ0JywgJ3t7LS0gJywgb3B0cylcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3IuY29tbWVudEVuZCcsICcgLS19fScsIG9wdHMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLmNvbmZpZy51bnNldCgnZWRpdG9yLmNvbW1lbnRTdGFydCcsIG9wdHMpXG4gICAgICAgIGF0b20uY29uZmlnLnVuc2V0KCdlZGl0b3IuY29tbWVudEVuZCcsIG9wdHMpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICB0aGlzLmNoYW5nZVVzZUJsYWRlQ29tbWVudHMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==