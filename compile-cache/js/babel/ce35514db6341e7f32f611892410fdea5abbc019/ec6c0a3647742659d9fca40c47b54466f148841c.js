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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9zcGxpdC1kaWZmL2xpYi9zeW5jLXNjcm9sbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7OztlQUVnQixPQUFPLENBQUMsTUFBTSxDQUFDOztJQUF0QyxtQkFBbUIsWUFBbkIsbUJBQW1COztJQUVsQixVQUFVO0FBRUgsV0FGUCxVQUFVLENBRUYsT0FBbUIsRUFBRSxPQUFtQixFQUFFLG9CQUE2QixFQUFFOzs7MEJBRmpGLFVBQVU7O0FBR1osUUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO0FBQ2xELFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0FBQ2hELFFBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQztBQUNoQixZQUFNLEVBQUUsT0FBTztBQUNmLGdCQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3ZDLGVBQVMsRUFBRSxLQUFLO0tBQ2pCLEVBQUU7QUFDRCxZQUFNLEVBQUUsT0FBTztBQUNmLGdCQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3ZDLGVBQVMsRUFBRSxLQUFLO0tBQ2pCLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUs7O0FBRXhDLFlBQUssY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDO2VBQU0sTUFBSyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUMsQ0FBQzs7QUFFMUcsVUFBRyxNQUFLLHFCQUFxQixFQUFFO0FBQzdCLGNBQUssY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDO2lCQUFNLE1BQUssc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1NBQUEsQ0FBQyxDQUFDLENBQUM7T0FDNUc7O0FBRUQsWUFBSyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRTtlQUFNLE1BQUssc0JBQXNCLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDLENBQUM7S0FDdEgsQ0FBQyxDQUFDO0dBQ0o7O2VBekJHLFVBQVU7O1dBMkJRLGdDQUFDLGlCQUF5QixFQUFRO0FBQ3RELFVBQUksUUFBUSxHQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNsRCxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDOztBQUV0RCxVQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7QUFDdEIsZUFBTztPQUNSO0FBQ0QsZUFBUyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDM0IsVUFBSTtBQUNGLGlCQUFTLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7QUFDdEUsWUFBRyxJQUFJLENBQUMscUJBQXFCLEVBQUU7QUFDN0IsbUJBQVMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztTQUN6RTtPQUNGLENBQUMsT0FBTyxDQUFDLEVBQUU7O09BRVg7QUFDRCxlQUFTLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUM3Qjs7O1dBRU0sbUJBQVM7QUFDZCxVQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDdkIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QixZQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztPQUM1QjtLQUNGOzs7V0FFWSx5QkFBUztBQUNwQixVQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUM1RCxVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVUsRUFBSztBQUNyQyxZQUFHLFVBQVUsQ0FBQyxNQUFNLElBQUksZ0JBQWdCLEVBQUU7QUFDeEMsb0JBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDL0Y7T0FDRixDQUFDLENBQUM7S0FDSjs7O1NBNURHLFVBQVU7OztBQStEaEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3NwbGl0LWRpZmYvbGliL3N5bmMtc2Nyb2xsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbnZhciB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlKCdhdG9tJyk7XG5cbmNsYXNzIFN5bmNTY3JvbGwge1xuXG4gIGNvbnN0cnVjdG9yKGVkaXRvcjE6IFRleHRFZGl0b3IsIGVkaXRvcjI6IFRleHRFZGl0b3IsIHN5bmNIb3Jpem9udGFsU2Nyb2xsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc3luY0hvcml6b250YWxTY3JvbGwgPSBzeW5jSG9yaXpvbnRhbFNjcm9sbDtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLl9zeW5jSW5mbyA9IFt7XG4gICAgICBlZGl0b3I6IGVkaXRvcjEsXG4gICAgICBlZGl0b3JWaWV3OiBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yMSksXG4gICAgICBzY3JvbGxpbmc6IGZhbHNlLFxuICAgIH0sIHtcbiAgICAgIGVkaXRvcjogZWRpdG9yMixcbiAgICAgIGVkaXRvclZpZXc6IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IyKSxcbiAgICAgIHNjcm9sbGluZzogZmFsc2UsXG4gICAgfV07XG5cbiAgICB0aGlzLl9zeW5jSW5mby5mb3JFYWNoKChlZGl0b3JJbmZvLCBpKSA9PiB7XG4gICAgICAvLyBOb3RlIHRoYXQgJ29uRGlkQ2hhbmdlU2Nyb2xsVG9wJyBpc24ndCB0ZWNobmljYWxseSBpbiB0aGUgcHVibGljIEFQSS5cbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuYWRkKGVkaXRvckluZm8uZWRpdG9yVmlldy5vbkRpZENoYW5nZVNjcm9sbFRvcCgoKSA9PiB0aGlzLl9zY3JvbGxQb3NpdGlvbkNoYW5nZWQoaSkpKTtcbiAgICAgIC8vIE5vdGUgdGhhdCAnb25EaWRDaGFuZ2VTY3JvbGxMZWZ0JyBpc24ndCB0ZWNobmljYWxseSBpbiB0aGUgcHVibGljIEFQSS5cbiAgICAgIGlmKHRoaXMuX3N5bmNIb3Jpem9udGFsU2Nyb2xsKSB7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuYWRkKGVkaXRvckluZm8uZWRpdG9yVmlldy5vbkRpZENoYW5nZVNjcm9sbExlZnQoKCkgPT4gdGhpcy5fc2Nyb2xsUG9zaXRpb25DaGFuZ2VkKGkpKSk7XG4gICAgICB9XG4gICAgICAvLyBiaW5kIHRoaXMgc28gdGhhdCB0aGUgZWRpdG9ycyBsaW5lIHVwIG9uIHN0YXJ0IG9mIHBhY2thZ2VcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuYWRkKGVkaXRvckluZm8uZWRpdG9yLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utc2Nyb2xsLXRvcCcsICgpID0+IHRoaXMuX3Njcm9sbFBvc2l0aW9uQ2hhbmdlZChpKSkpO1xuICAgIH0pO1xuICB9XG5cbiAgX3Njcm9sbFBvc2l0aW9uQ2hhbmdlZChjaGFuZ2VTY3JvbGxJbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdmFyIHRoaXNJbmZvICA9IHRoaXMuX3N5bmNJbmZvW2NoYW5nZVNjcm9sbEluZGV4XTtcbiAgICB2YXIgb3RoZXJJbmZvID0gdGhpcy5fc3luY0luZm9bMSAtIGNoYW5nZVNjcm9sbEluZGV4XTtcblxuICAgIGlmICh0aGlzSW5mby5zY3JvbGxpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb3RoZXJJbmZvLnNjcm9sbGluZyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIG90aGVySW5mby5lZGl0b3JWaWV3LnNldFNjcm9sbFRvcCh0aGlzSW5mby5lZGl0b3JWaWV3LmdldFNjcm9sbFRvcCgpKTtcbiAgICAgIGlmKHRoaXMuX3N5bmNIb3Jpem9udGFsU2Nyb2xsKSB7XG4gICAgICAgIG90aGVySW5mby5lZGl0b3JWaWV3LnNldFNjcm9sbExlZnQodGhpc0luZm8uZWRpdG9yVmlldy5nZXRTY3JvbGxMZWZ0KCkpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vY29uc29sZS5sb2coZSk7XG4gICAgfVxuICAgIG90aGVySW5mby5zY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGRpc3Bvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3N1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3luY1Bvc2l0aW9ucygpOiB2b2lkIHtcbiAgICB2YXIgYWN0aXZlVGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICB0aGlzLl9zeW5jSW5mby5mb3JFYWNoKChlZGl0b3JJbmZvKSA9PiB7XG4gICAgICBpZihlZGl0b3JJbmZvLmVkaXRvciA9PSBhY3RpdmVUZXh0RWRpdG9yKSB7XG4gICAgICAgIGVkaXRvckluZm8uZWRpdG9yLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgZWRpdG9ySW5mby5lZGl0b3JWaWV3LmdldFNjcm9sbFRvcCgpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bmNTY3JvbGw7XG4iXX0=