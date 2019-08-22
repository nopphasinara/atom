'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('atom');

var CompositeDisposable = _require.CompositeDisposable;

var SyncScroll = (function () {
  function SyncScroll(editor1, editor2, syncHorizontalScroll) {
    var _this = this;

    _classCallCheck(this, SyncScroll);

    this._syncHorizontalScroll = syncHorizontalScroll;
    this._subscriptions = new CompositeDisposable();
    this._syncInfo = [{
      editor: editor1,
      editorView: atom.views.getView(editor1),
      scrolling: false
    }, {
      editor: editor2,
      editorView: atom.views.getView(editor2),
      scrolling: false
    }];

    this._syncInfo.forEach(function (editorInfo, i) {
      // Note that 'onDidChangeScrollTop' isn't technically in the public API.
      _this._subscriptions.add(editorInfo.editorView.onDidChangeScrollTop(function () {
        return _this._scrollPositionChanged(i);
      }));
      // Note that 'onDidChangeScrollLeft' isn't technically in the public API.
      if (_this._syncHorizontalScroll) {
        _this._subscriptions.add(editorInfo.editorView.onDidChangeScrollLeft(function () {
          return _this._scrollPositionChanged(i);
        }));
      }
      // bind this so that the editors line up on start of package
      _this._subscriptions.add(editorInfo.editor.emitter.on('did-change-scroll-top', function () {
        return _this._scrollPositionChanged(i);
      }));
    });
  }

  _createClass(SyncScroll, [{
    key: '_scrollPositionChanged',
    value: function _scrollPositionChanged(changeScrollIndex) {
      var thisInfo = this._syncInfo[changeScrollIndex];
      var otherInfo = this._syncInfo[1 - changeScrollIndex];

      if (thisInfo.scrolling) {
        return;
      }
      otherInfo.scrolling = true;
      try {
        otherInfo.editorView.setScrollTop(thisInfo.editorView.getScrollTop());
        if (this._syncHorizontalScroll) {
          otherInfo.editorView.setScrollLeft(thisInfo.editorView.getScrollLeft());
        }
      } catch (e) {
        //console.log(e);
      }
      otherInfo.scrolling = false;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._subscriptions) {
        this._subscriptions.dispose();
        this._subscriptions = null;
      }
    }
  }, {
    key: 'syncPositions',
    value: function syncPositions() {
      var activeTextEditor = atom.workspace.getActiveTextEditor();
      this._syncInfo.forEach(function (editorInfo) {
        if (editorInfo.editor == activeTextEditor) {
          editorInfo.editor.emitter.emit('did-change-scroll-top', editorInfo.editorView.getScrollTop());
        }
      });
    }
  }]);

  return SyncScroll;
})();

module.exports = SyncScroll;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvc3luYy1zY3JvbGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7ZUFFZ0IsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBdEMsbUJBQW1CLFlBQW5CLG1CQUFtQjs7SUFFbEIsVUFBVTtBQUVILFdBRlAsVUFBVSxDQUVGLE9BQW1CLEVBQUUsT0FBbUIsRUFBRSxvQkFBNkIsRUFBRTs7OzBCQUZqRixVQUFVOztBQUdaLFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztBQUNsRCxRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztBQUNoRCxRQUFJLENBQUMsU0FBUyxHQUFHLENBQUM7QUFDaEIsWUFBTSxFQUFFLE9BQU87QUFDZixnQkFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUN2QyxlQUFTLEVBQUUsS0FBSztLQUNqQixFQUFFO0FBQ0QsWUFBTSxFQUFFLE9BQU87QUFDZixnQkFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUN2QyxlQUFTLEVBQUUsS0FBSztLQUNqQixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVLEVBQUUsQ0FBQyxFQUFLOztBQUV4QyxZQUFLLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQztlQUFNLE1BQUssc0JBQXNCLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDLENBQUM7O0FBRTFHLFVBQUcsTUFBSyxxQkFBcUIsRUFBRTtBQUM3QixjQUFLLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQztpQkFBTSxNQUFLLHNCQUFzQixDQUFDLENBQUMsQ0FBQztTQUFBLENBQUMsQ0FBQyxDQUFDO09BQzVHOztBQUVELFlBQUssY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsdUJBQXVCLEVBQUU7ZUFBTSxNQUFLLHNCQUFzQixDQUFDLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQyxDQUFDO0tBQ3RILENBQUMsQ0FBQztHQUNKOztlQXpCRyxVQUFVOztXQTJCUSxnQ0FBQyxpQkFBeUIsRUFBUTtBQUN0RCxVQUFJLFFBQVEsR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbEQsVUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsQ0FBQzs7QUFFdEQsVUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO0FBQ3RCLGVBQU87T0FDUjtBQUNELGVBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFVBQUk7QUFDRixpQkFBUyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ3RFLFlBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFO0FBQzdCLG1CQUFTLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7U0FDekU7T0FDRixDQUFDLE9BQU8sQ0FBQyxFQUFFOztPQUVYO0FBQ0QsZUFBUyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDN0I7OztXQUVNLG1CQUFTO0FBQ2QsVUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDOUIsWUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7T0FDNUI7S0FDRjs7O1dBRVkseUJBQVM7QUFDcEIsVUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDNUQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVLEVBQUs7QUFDckMsWUFBRyxVQUFVLENBQUMsTUFBTSxJQUFJLGdCQUFnQixFQUFFO0FBQ3hDLG9CQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQy9GO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztTQTVERyxVQUFVOzs7QUErRGhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvc3luYy1zY3JvbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxudmFyIHtDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUoJ2F0b20nKTtcblxuY2xhc3MgU3luY1Njcm9sbCB7XG5cbiAgY29uc3RydWN0b3IoZWRpdG9yMTogVGV4dEVkaXRvciwgZWRpdG9yMjogVGV4dEVkaXRvciwgc3luY0hvcml6b250YWxTY3JvbGw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zeW5jSG9yaXpvbnRhbFNjcm9sbCA9IHN5bmNIb3Jpem9udGFsU2Nyb2xsO1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuX3N5bmNJbmZvID0gW3tcbiAgICAgIGVkaXRvcjogZWRpdG9yMSxcbiAgICAgIGVkaXRvclZpZXc6IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IxKSxcbiAgICAgIHNjcm9sbGluZzogZmFsc2UsXG4gICAgfSwge1xuICAgICAgZWRpdG9yOiBlZGl0b3IyLFxuICAgICAgZWRpdG9yVmlldzogYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcjIpLFxuICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcbiAgICB9XTtcblxuICAgIHRoaXMuX3N5bmNJbmZvLmZvckVhY2goKGVkaXRvckluZm8sIGkpID0+IHtcbiAgICAgIC8vIE5vdGUgdGhhdCAnb25EaWRDaGFuZ2VTY3JvbGxUb3AnIGlzbid0IHRlY2huaWNhbGx5IGluIHRoZSBwdWJsaWMgQVBJLlxuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9ySW5mby5lZGl0b3JWaWV3Lm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKCgpID0+IHRoaXMuX3Njcm9sbFBvc2l0aW9uQ2hhbmdlZChpKSkpO1xuICAgICAgLy8gTm90ZSB0aGF0ICdvbkRpZENoYW5nZVNjcm9sbExlZnQnIGlzbid0IHRlY2huaWNhbGx5IGluIHRoZSBwdWJsaWMgQVBJLlxuICAgICAgaWYodGhpcy5fc3luY0hvcml6b250YWxTY3JvbGwpIHtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9ySW5mby5lZGl0b3JWaWV3Lm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCgoKSA9PiB0aGlzLl9zY3JvbGxQb3NpdGlvbkNoYW5nZWQoaSkpKTtcbiAgICAgIH1cbiAgICAgIC8vIGJpbmQgdGhpcyBzbyB0aGF0IHRoZSBlZGl0b3JzIGxpbmUgdXAgb24gc3RhcnQgb2YgcGFja2FnZVxuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9ySW5mby5lZGl0b3IuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgKCkgPT4gdGhpcy5fc2Nyb2xsUG9zaXRpb25DaGFuZ2VkKGkpKSk7XG4gICAgfSk7XG4gIH1cblxuICBfc2Nyb2xsUG9zaXRpb25DaGFuZ2VkKGNoYW5nZVNjcm9sbEluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICB2YXIgdGhpc0luZm8gID0gdGhpcy5fc3luY0luZm9bY2hhbmdlU2Nyb2xsSW5kZXhdO1xuICAgIHZhciBvdGhlckluZm8gPSB0aGlzLl9zeW5jSW5mb1sxIC0gY2hhbmdlU2Nyb2xsSW5kZXhdO1xuXG4gICAgaWYgKHRoaXNJbmZvLnNjcm9sbGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvdGhlckluZm8uc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgb3RoZXJJbmZvLmVkaXRvclZpZXcuc2V0U2Nyb2xsVG9wKHRoaXNJbmZvLmVkaXRvclZpZXcuZ2V0U2Nyb2xsVG9wKCkpO1xuICAgICAgaWYodGhpcy5fc3luY0hvcml6b250YWxTY3JvbGwpIHtcbiAgICAgICAgb3RoZXJJbmZvLmVkaXRvclZpZXcuc2V0U2Nyb2xsTGVmdCh0aGlzSW5mby5lZGl0b3JWaWV3LmdldFNjcm9sbExlZnQoKSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy9jb25zb2xlLmxvZyhlKTtcbiAgICB9XG4gICAgb3RoZXJJbmZvLnNjcm9sbGluZyA9IGZhbHNlO1xuICB9XG5cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzeW5jUG9zaXRpb25zKCk6IHZvaWQge1xuICAgIHZhciBhY3RpdmVUZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIHRoaXMuX3N5bmNJbmZvLmZvckVhY2goKGVkaXRvckluZm8pID0+IHtcbiAgICAgIGlmKGVkaXRvckluZm8uZWRpdG9yID09IGFjdGl2ZVRleHRFZGl0b3IpIHtcbiAgICAgICAgZWRpdG9ySW5mby5lZGl0b3IuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNjcm9sbC10b3AnLCBlZGl0b3JJbmZvLmVkaXRvclZpZXcuZ2V0U2Nyb2xsVG9wKCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3luY1Njcm9sbDtcbiJdfQ==