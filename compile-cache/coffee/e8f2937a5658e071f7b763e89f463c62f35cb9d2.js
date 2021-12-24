(function() {
  var CompositeDisposable, DuplicateRemoval;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = DuplicateRemoval = {
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'duplicate-removal:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    serialize: function() {},
    remove_dup: function(str) {
      var dict, i, len, line, new_str, ref;
      dict = [];
      new_str = "";
      ref = str.split("\n");
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        if (!dict[line] && line !== "") {
          new_str += line + "\n";
        }
        dict[line] = line;
      }
      return new_str;
    },
    toggle: function() {
      var buf, editor;
      editor = atom.workspace.getActiveTextEditor();
      buf = editor.getBuffer();
      return buf.setText(this.remove_dup(buf.getText()));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2R1cGxpY2F0ZS1yZW1vdmFsL2xpYi9kdXBsaWNhdGUtcmVtb3ZhbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsZ0JBQUEsR0FDZjtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUVSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFHckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSwwQkFBQSxFQUE0QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUI7T0FBcEMsQ0FBbkI7SUFMUSxDQUZWO0lBU0EsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQURVLENBVFo7SUFZQSxTQUFBLEVBQVcsU0FBQSxHQUFBLENBWlg7SUFlQSxVQUFBLEVBQVksU0FBQyxHQUFEO0FBQ1YsVUFBQTtNQUFBLElBQUEsR0FBTztNQUNQLE9BQUEsR0FBVTtBQUVWO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxJQUEwQixDQUFJLElBQUssQ0FBQSxJQUFBLENBQVQsSUFBbUIsSUFBQSxLQUFVLEVBQXZEO1VBQUEsT0FBQSxJQUFXLElBQUEsR0FBTyxLQUFsQjs7UUFDQSxJQUFLLENBQUEsSUFBQSxDQUFMLEdBQWE7QUFGZjtBQUlBLGFBQU87SUFSRyxDQWZaO0lBeUJBLE1BQUEsRUFBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxHQUFBLEdBQU0sTUFBTSxDQUFDLFNBQVAsQ0FBQTthQUNOLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBQyxDQUFBLFVBQUQsQ0FBWSxHQUFHLENBQUMsT0FBSixDQUFBLENBQVosQ0FBWjtJQUhNLENBekJSOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBEdXBsaWNhdGVSZW1vdmFsID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgIyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICMgUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdkdXBsaWNhdGUtcmVtb3ZhbDp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICAjIHBhc3NcblxuICByZW1vdmVfZHVwOiAoc3RyKSAtPlxuICAgIGRpY3QgPSBbXVxuICAgIG5ld19zdHIgPSBcIlwiXG5cbiAgICBmb3IgbGluZSBpbiBzdHIuc3BsaXQoXCJcXG5cIilcbiAgICAgIG5ld19zdHIgKz0gbGluZSArIFwiXFxuXCIgaWYgbm90IGRpY3RbbGluZV0gYW5kIGxpbmUgaXNudCBcIlwiXG4gICAgICBkaWN0W2xpbmVdID0gbGluZVxuXG4gICAgcmV0dXJuIG5ld19zdHJcblxuICB0b2dnbGU6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYnVmID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgYnVmLnNldFRleHQoQHJlbW92ZV9kdXAgYnVmLmdldFRleHQoKSlcbiJdfQ==
