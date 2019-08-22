Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Editor = require('./Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _atom = require('atom');

'use babel';
exports['default'] = {

  jsConsoleView: null,
  modalPanel: null,
  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    this.editor = new _Editor2['default']();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'js-console:toggle': function jsConsoleToggle() {
        return _this.run();
      }
    }));
  },

  // "mousedown": () => this.hide()
  deactivate: function deactivate() {
    this.subscriptions.dispose();
    this.editor.destroy();
  },

  serialize: function serialize() {
    return {
      // jsConsoleViewState: this.jsConsoleView.serialize()
    };
  },

  run: function run() {
    var selectedText = atom.workspace.getActiveTextEditor().getSelectedText();
    this.editor.show(selectedText);
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXRvbS1qcy1jb25zb2xlL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztzQkFDbUIsVUFBVTs7OztvQkFDTyxNQUFNOztBQUYxQyxXQUFXLENBQUE7cUJBSUk7O0FBRWIsZUFBYSxFQUFFLElBQUk7QUFDbkIsWUFBVSxFQUFFLElBQUk7QUFDaEIsZUFBYSxFQUFFLElBQUk7O0FBRW5CLFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7OztBQUNkLFFBQUksQ0FBQyxNQUFNLEdBQUcseUJBQVksQ0FBQTs7O0FBRzFCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7OztBQUc5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCx5QkFBbUIsRUFBRTtlQUFNLE1BQUssR0FBRyxFQUFFO09BQUE7S0FFdEMsQ0FBQyxDQUFDLENBQUE7R0FDSjs7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixRQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQ3RCOztBQUVELFdBQVMsRUFBQSxxQkFBRztBQUNWLFdBQU87O0tBRU4sQ0FBQTtHQUNGOztBQUVELEtBQUcsRUFBQSxlQUFHO0FBQ0osUUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQzNFLFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0dBQy9COztDQUVGIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXRvbS1qcy1jb25zb2xlL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbmltcG9ydCBFZGl0b3IgZnJvbSAnLi9FZGl0b3InXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGpzQ29uc29sZVZpZXc6IG51bGwsXG4gIG1vZGFsUGFuZWw6IG51bGwsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG5cbiAgYWN0aXZhdGUoc3RhdGUpIHtcbiAgICB0aGlzLmVkaXRvciA9IG5ldyBFZGl0b3IoKVxuXG4gICAgLy8gRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAvLyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdqcy1jb25zb2xlOnRvZ2dsZSc6ICgpID0+IHRoaXMucnVuKCksXG4gICAgICAvLyBcIm1vdXNlZG93blwiOiAoKSA9PiB0aGlzLmhpZGUoKVxuICAgIH0pKVxuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuZWRpdG9yLmRlc3Ryb3koKVxuICB9LFxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8ganNDb25zb2xlVmlld1N0YXRlOiB0aGlzLmpzQ29uc29sZVZpZXcuc2VyaWFsaXplKClcbiAgICB9XG4gIH0sXG5cbiAgcnVuKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkVGV4dCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRTZWxlY3RlZFRleHQoKVxuICAgIHRoaXMuZWRpdG9yLnNob3coc2VsZWN0ZWRUZXh0KVxuICB9XG5cbn1cbiJdfQ==