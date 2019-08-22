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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9kdXBsaWNhdGUtcmVtb3ZhbC9saWIvZHVwbGljYXRlLXJlbW92YWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGdCQUFBLEdBQ2Y7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFFUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO2FBR3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO1FBQUEsMEJBQUEsRUFBNEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCO09BQXBDLENBQW5CO0lBTFEsQ0FGVjtJQVNBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFEVSxDQVRaO0lBWUEsU0FBQSxFQUFXLFNBQUEsR0FBQSxDQVpYO0lBZUEsVUFBQSxFQUFZLFNBQUMsR0FBRDtBQUNWLFVBQUE7TUFBQSxJQUFBLEdBQU87TUFDUCxPQUFBLEdBQVU7QUFFVjtBQUFBLFdBQUEscUNBQUE7O1FBQ0UsSUFBMEIsQ0FBSSxJQUFLLENBQUEsSUFBQSxDQUFULElBQW1CLElBQUEsS0FBVSxFQUF2RDtVQUFBLE9BQUEsSUFBVyxJQUFBLEdBQU8sS0FBbEI7O1FBQ0EsSUFBSyxDQUFBLElBQUEsQ0FBTCxHQUFhO0FBRmY7QUFJQSxhQUFPO0lBUkcsQ0FmWjtJQXlCQSxNQUFBLEVBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsR0FBQSxHQUFNLE1BQU0sQ0FBQyxTQUFQLENBQUE7YUFDTixHQUFHLENBQUMsT0FBSixDQUFZLElBQUMsQ0FBQSxVQUFELENBQVksR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFaLENBQVo7SUFITSxDQXpCUjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID0gRHVwbGljYXRlUmVtb3ZhbCA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnZHVwbGljYXRlLXJlbW92YWw6dG9nZ2xlJzogPT4gQHRvZ2dsZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICBzZXJpYWxpemU6IC0+XG4gICAgIyBwYXNzXG5cbiAgcmVtb3ZlX2R1cDogKHN0cikgLT5cbiAgICBkaWN0ID0gW11cbiAgICBuZXdfc3RyID0gXCJcIlxuXG4gICAgZm9yIGxpbmUgaW4gc3RyLnNwbGl0KFwiXFxuXCIpXG4gICAgICBuZXdfc3RyICs9IGxpbmUgKyBcIlxcblwiIGlmIG5vdCBkaWN0W2xpbmVdIGFuZCBsaW5lIGlzbnQgXCJcIlxuICAgICAgZGljdFtsaW5lXSA9IGxpbmVcblxuICAgIHJldHVybiBuZXdfc3RyXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGJ1ZiA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGJ1Zi5zZXRUZXh0KEByZW1vdmVfZHVwIGJ1Zi5nZXRUZXh0KCkpXG4iXX0=
