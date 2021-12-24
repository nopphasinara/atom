Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _awesomeEditorView = require('./awesome-editor-view');

var _awesomeEditorView2 = _interopRequireDefault(_awesomeEditorView);

var _atom = require('atom');

'use babel';

exports['default'] = {

  awesomeEditorView: null,
  modalPanel: null,
  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    this.awesomeEditorView = new _awesomeEditorView2['default'](state.awesomeEditorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.awesomeEditorView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'awesome-editor:toggle': function awesomeEditorToggle() {
        return _this.toggle();
      }
    }));
  },

  deactivate: function deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.awesomeEditorView.destroy();
  },

  serialize: function serialize() {
    return {
      awesomeEditorViewState: this.awesomeEditorView.serialize()
    };
  },

  toggle: function toggle() {
    console.log('AwesomeEditor was toggled!');
    return this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show();
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvZ2l0aHViL2F3ZXNvbWUtZWRpdG9yL2xpYi9hd2Vzb21lLWVkaXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7aUNBRThCLHVCQUF1Qjs7OztvQkFDakIsTUFBTTs7QUFIMUMsV0FBVyxDQUFDOztxQkFLRzs7QUFFYixtQkFBaUIsRUFBRSxJQUFJO0FBQ3ZCLFlBQVUsRUFBRSxJQUFJO0FBQ2hCLGVBQWEsRUFBRSxJQUFJOztBQUVuQixVQUFRLEVBQUEsa0JBQUMsS0FBSyxFQUFFOzs7QUFDZCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsbUNBQXNCLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzdFLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFDN0MsVUFBSSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUU7QUFDekMsYUFBTyxFQUFFLEtBQUs7S0FDZixDQUFDLENBQUM7OztBQUdILFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7OztBQUcvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCw2QkFBdUIsRUFBRTtlQUFNLE1BQUssTUFBTSxFQUFFO09BQUE7S0FDN0MsQ0FBQyxDQUFDLENBQUM7R0FDTDs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsUUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ2xDOztBQUVELFdBQVMsRUFBQSxxQkFBRztBQUNWLFdBQU87QUFDTCw0QkFBc0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFO0tBQzNELENBQUM7R0FDSDs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7QUFDUCxXQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDMUMsV0FDRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUN0QjtHQUNIOztDQUVGIiwiZmlsZSI6Ii9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvZ2l0aHViL2F3ZXNvbWUtZWRpdG9yL2xpYi9hd2Vzb21lLWVkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgQXdlc29tZUVkaXRvclZpZXcgZnJvbSAnLi9hd2Vzb21lLWVkaXRvci12aWV3JztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGF3ZXNvbWVFZGl0b3JWaWV3OiBudWxsLFxuICBtb2RhbFBhbmVsOiBudWxsLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5hd2Vzb21lRWRpdG9yVmlldyA9IG5ldyBBd2Vzb21lRWRpdG9yVmlldyhzdGF0ZS5hd2Vzb21lRWRpdG9yVmlld1N0YXRlKTtcbiAgICB0aGlzLm1vZGFsUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtcbiAgICAgIGl0ZW06IHRoaXMuYXdlc29tZUVkaXRvclZpZXcuZ2V0RWxlbWVudCgpLFxuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KTtcblxuICAgIC8vIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIC8vIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2F3ZXNvbWUtZWRpdG9yOnRvZ2dsZSc6ICgpID0+IHRoaXMudG9nZ2xlKClcbiAgICB9KSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLm1vZGFsUGFuZWwuZGVzdHJveSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5hd2Vzb21lRWRpdG9yVmlldy5kZXN0cm95KCk7XG4gIH0sXG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhd2Vzb21lRWRpdG9yVmlld1N0YXRlOiB0aGlzLmF3ZXNvbWVFZGl0b3JWaWV3LnNlcmlhbGl6ZSgpXG4gICAgfTtcbiAgfSxcblxuICB0b2dnbGUoKSB7XG4gICAgY29uc29sZS5sb2coJ0F3ZXNvbWVFZGl0b3Igd2FzIHRvZ2dsZWQhJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMubW9kYWxQYW5lbC5pc1Zpc2libGUoKSA/XG4gICAgICB0aGlzLm1vZGFsUGFuZWwuaGlkZSgpIDpcbiAgICAgIHRoaXMubW9kYWxQYW5lbC5zaG93KClcbiAgICApO1xuICB9XG5cbn07XG4iXX0=