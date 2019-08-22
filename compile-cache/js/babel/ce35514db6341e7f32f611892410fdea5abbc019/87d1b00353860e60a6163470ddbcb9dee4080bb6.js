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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtYmxhZGUvbGliL2xhbmd1YWdlLWJsYWRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7cUJBRUk7QUFDYix3QkFBc0IsRUFBRSxJQUFJOztBQUU1QixRQUFNLEVBQUU7QUFDTixvQkFBZ0IsRUFBRTtBQUNoQixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7QUFDYixpQkFBVyxFQUFFLDJEQUEyRDtLQUN6RTtHQUNGOztBQUVELFVBQVEsRUFBQyxvQkFBRztBQUNWLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQ0FBaUMsRUFBRSxVQUFBLE9BQU8sRUFBSTtBQUM5RixVQUFNLElBQUksR0FBRyxFQUFDLGFBQWEsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUMsQ0FBQTtBQUN0RCxVQUFJLE9BQU8sRUFBRTtBQUNYLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNyRCxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDcEQsTUFBTTtBQUNMLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzlDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO09BQzdDO0tBQ0YsQ0FBQyxDQUFBO0dBQ0g7O0FBRUQsWUFBVSxFQUFDLHNCQUFHO0FBQ1osUUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQ3RDO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1ibGFkZS9saWIvbGFuZ3VhZ2UtYmxhZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNoYW5nZVVzZUJsYWRlQ29tbWVudHM6IG51bGwsXG5cbiAgY29uZmlnOiB7XG4gICAgdXNlQmxhZGVDb21tZW50czoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVXNlIEJsYWRlIGNvbW1lbnRzIGJ5IGRlZmF1bHQgd2hlbiB0b2dnbGluZyBsaW5lIGNvbW1lbnRzJ1xuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5jaGFuZ2VVc2VCbGFkZUNvbW1lbnRzID0gYXRvbS5jb25maWcub2JzZXJ2ZSgnbGFuZ3VhZ2UtYmxhZGUudXNlQmxhZGVDb21tZW50cycsIGVuYWJsZWQgPT4ge1xuICAgICAgY29uc3Qgb3B0cyA9IHtzY29wZVNlbGVjdG9yOiBbJy50ZXh0Lmh0bWwucGhwLmJsYWRlJ119XG4gICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5jb21tZW50U3RhcnQnLCAne3stLSAnLCBvcHRzKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5jb21tZW50RW5kJywgJyAtLX19Jywgb3B0cylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0b20uY29uZmlnLnVuc2V0KCdlZGl0b3IuY29tbWVudFN0YXJ0Jywgb3B0cylcbiAgICAgICAgYXRvbS5jb25maWcudW5zZXQoJ2VkaXRvci5jb21tZW50RW5kJywgb3B0cylcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuY2hhbmdlVXNlQmxhZGVDb21tZW50cy5kaXNwb3NlKClcbiAgfVxufVxuIl19