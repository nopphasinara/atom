
/**
 * PHP files namespace management
 */

(function() {
  module.exports = {

    /**
     * Add the good namespace to the given file
     * @param {TextEditor} editor
     */
    createNamespace: function(editor) {
      var autoload, autoloaders, composer, directory, element, elements, i, index, j, k, len, len1, len2, line, lines, name, namespace, path, proxy, psr, ref, ref1, ref2, src, text;
      proxy = require('./php-proxy.coffee');
      composer = proxy.composer();
      autoloaders = [];
      if (!composer) {
        return;
      }
      ref = composer.autoload;
      for (psr in ref) {
        autoload = ref[psr];
        for (namespace in autoload) {
          src = autoload[namespace];
          if (namespace.endsWith("\\")) {
            namespace = namespace.substr(0, namespace.length - 1);
          }
          autoloaders[src] = namespace;
        }
      }
      if (composer["autoload-dev"]) {
        ref1 = composer["autoload-dev"];
        for (psr in ref1) {
          autoload = ref1[psr];
          for (namespace in autoload) {
            src = autoload[namespace];
            if (namespace.endsWith("\\")) {
              namespace = namespace.substr(0, namespace.length - 1);
            }
            autoloaders[src] = namespace;
          }
        }
      }
      path = editor.getPath();
      ref2 = atom.project.getDirectories();
      for (i = 0, len = ref2.length; i < len; i++) {
        directory = ref2[i];
        if (path.indexOf(directory.path) === 0) {
          path = path.substr(directory.path.length + 1);
          break;
        }
      }
      path = path.replace(/\\/g, '/');
      namespace = null;
      for (src in autoloaders) {
        name = autoloaders[src];
        if (path.indexOf(src) === 0) {
          path = path.substr(src.length);
          namespace = name;
          break;
        }
      }
      if (namespace === null) {
        return;
      }
      if (path.indexOf("/") === 0) {
        path = path.substr(1);
      }
      elements = path.split('/');
      index = 1;
      for (j = 0, len1 = elements.length; j < len1; j++) {
        element = elements[j];
        if (element === "" || index === elements.length) {
          continue;
        }
        namespace = namespace === "" ? element : namespace + "\\" + element;
        index++;
      }
      text = editor.getText();
      index = 0;
      lines = text.split('\n');
      for (k = 0, len2 = lines.length; k < len2; k++) {
        line = lines[k];
        line = line.trim();
        if (line.indexOf('namespace ') === 0) {
          editor.setTextInBufferRange([[index, 0], [index + 1, 0]], "namespace " + namespace + ";\n");
          return;
        } else if (line.trim() !== "" && line.trim().indexOf("<?") !== 0) {
          editor.setTextInBufferRange([[index, 0], [index, 0]], "namespace " + namespace + ";\n\n");
          return;
        }
        index += 1;
      }
      return editor.setTextInBufferRange([[2, 0], [2, 0]], "namespace " + namespace + ";\n\n");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3NlcnZpY2VzL25hbWVzcGFjZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQSxNQUFNLENBQUMsT0FBUCxHQUVJOztBQUFBOzs7O0lBSUEsZUFBQSxFQUFpQixTQUFDLE1BQUQ7QUFDYixVQUFBO01BQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxvQkFBUjtNQUVSLFFBQUEsR0FBYyxLQUFLLENBQUMsUUFBTixDQUFBO01BQ2QsV0FBQSxHQUFjO01BRWQsSUFBRyxDQUFJLFFBQVA7QUFDSSxlQURKOztBQUlBO0FBQUEsV0FBQSxVQUFBOztBQUNJLGFBQUEscUJBQUE7O1VBQ0ksSUFBRyxTQUFTLENBQUMsUUFBVixDQUFtQixJQUFuQixDQUFIO1lBQ0ksU0FBQSxHQUFZLFNBQVMsQ0FBQyxNQUFWLENBQWlCLENBQWpCLEVBQW9CLFNBQVMsQ0FBQyxNQUFWLEdBQWlCLENBQXJDLEVBRGhCOztVQUdBLFdBQVksQ0FBQSxHQUFBLENBQVosR0FBbUI7QUFKdkI7QUFESjtNQU9BLElBQUcsUUFBUyxDQUFBLGNBQUEsQ0FBWjtBQUNJO0FBQUEsYUFBQSxXQUFBOztBQUNJLGVBQUEscUJBQUE7O1lBQ0ksSUFBRyxTQUFTLENBQUMsUUFBVixDQUFtQixJQUFuQixDQUFIO2NBQ0ksU0FBQSxHQUFZLFNBQVMsQ0FBQyxNQUFWLENBQWlCLENBQWpCLEVBQW9CLFNBQVMsQ0FBQyxNQUFWLEdBQWlCLENBQXJDLEVBRGhCOztZQUdBLFdBQVksQ0FBQSxHQUFBLENBQVosR0FBbUI7QUFKdkI7QUFESixTQURKOztNQVNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBO0FBQ1A7QUFBQSxXQUFBLHNDQUFBOztRQUNJLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFTLENBQUMsSUFBdkIsQ0FBQSxLQUFnQyxDQUFuQztVQUNJLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBZixHQUFzQixDQUFsQztBQUNQLGdCQUZKOztBQURKO01BTUEsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFvQixHQUFwQjtNQUdQLFNBQUEsR0FBWTtBQUNaLFdBQUEsa0JBQUE7O1FBQ0ksSUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBQSxLQUFxQixDQUF4QjtVQUNJLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLEdBQUcsQ0FBQyxNQUFoQjtVQUNQLFNBQUEsR0FBWTtBQUNaLGdCQUhKOztBQURKO01BT0EsSUFBRyxTQUFBLEtBQWEsSUFBaEI7QUFDSSxlQURKOztNQUlBLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQUEsS0FBcUIsQ0FBeEI7UUFDSSxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQUwsQ0FBWSxDQUFaLEVBRFg7O01BR0EsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWDtNQUdYLEtBQUEsR0FBUTtBQUNSLFdBQUEsNENBQUE7O1FBQ0ksSUFBRyxPQUFBLEtBQVcsRUFBWCxJQUFpQixLQUFBLEtBQVMsUUFBUSxDQUFDLE1BQXRDO0FBQ0ksbUJBREo7O1FBR0EsU0FBQSxHQUFlLFNBQUEsS0FBYSxFQUFoQixHQUF3QixPQUF4QixHQUFxQyxTQUFBLEdBQVksSUFBWixHQUFtQjtRQUNwRSxLQUFBO0FBTEo7TUFPQSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQUNQLEtBQUEsR0FBUTtNQUdSLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVg7QUFDUixXQUFBLHlDQUFBOztRQUNJLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxDQUFBO1FBR1AsSUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLFlBQWIsQ0FBQSxLQUE4QixDQUFqQztVQUNJLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUFDLENBQUMsS0FBRCxFQUFPLENBQVAsQ0FBRCxFQUFZLENBQUMsS0FBQSxHQUFNLENBQVAsRUFBVSxDQUFWLENBQVosQ0FBNUIsRUFBdUQsWUFBQSxHQUFhLFNBQWIsR0FBdUIsS0FBOUU7QUFDQSxpQkFGSjtTQUFBLE1BR0ssSUFBRyxJQUFJLENBQUMsSUFBTCxDQUFBLENBQUEsS0FBZSxFQUFmLElBQXNCLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBVyxDQUFDLE9BQVosQ0FBb0IsSUFBcEIsQ0FBQSxLQUE2QixDQUF0RDtVQUNELE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUFDLENBQUMsS0FBRCxFQUFPLENBQVAsQ0FBRCxFQUFZLENBQUMsS0FBRCxFQUFRLENBQVIsQ0FBWixDQUE1QixFQUFxRCxZQUFBLEdBQWEsU0FBYixHQUF1QixPQUE1RTtBQUNBLGlCQUZDOztRQUlMLEtBQUEsSUFBUztBQVhiO2FBYUEsTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQTVCLEVBQThDLFlBQUEsR0FBYSxTQUFiLEdBQXVCLE9BQXJFO0lBaEZhLENBSmpCOztBQU5KIiwic291cmNlc0NvbnRlbnQiOlsiIyMjKlxuICogUEhQIGZpbGVzIG5hbWVzcGFjZSBtYW5hZ2VtZW50XG4jIyNcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gICAgIyMjKlxuICAgICAqIEFkZCB0aGUgZ29vZCBuYW1lc3BhY2UgdG8gdGhlIGdpdmVuIGZpbGVcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvclxuICAgICMjI1xuICAgIGNyZWF0ZU5hbWVzcGFjZTogKGVkaXRvcikgLT5cbiAgICAgICAgcHJveHkgPSByZXF1aXJlICcuL3BocC1wcm94eS5jb2ZmZWUnXG5cbiAgICAgICAgY29tcG9zZXIgICAgPSBwcm94eS5jb21wb3NlcigpXG4gICAgICAgIGF1dG9sb2FkZXJzID0gW11cblxuICAgICAgICBpZiBub3QgY29tcG9zZXJcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgR2V0IGVsZW1lbnRzIGZyb20gY29tcG9zZXIuanNvblxuICAgICAgICBmb3IgcHNyLCBhdXRvbG9hZCBvZiBjb21wb3Nlci5hdXRvbG9hZFxuICAgICAgICAgICAgZm9yIG5hbWVzcGFjZSwgc3JjIG9mIGF1dG9sb2FkXG4gICAgICAgICAgICAgICAgaWYgbmFtZXNwYWNlLmVuZHNXaXRoKFwiXFxcXFwiKVxuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBuYW1lc3BhY2Uuc3Vic3RyKDAsIG5hbWVzcGFjZS5sZW5ndGgtMSlcblxuICAgICAgICAgICAgICAgIGF1dG9sb2FkZXJzW3NyY10gPSBuYW1lc3BhY2VcblxuICAgICAgICBpZiBjb21wb3NlcltcImF1dG9sb2FkLWRldlwiXVxuICAgICAgICAgICAgZm9yIHBzciwgYXV0b2xvYWQgb2YgY29tcG9zZXJbXCJhdXRvbG9hZC1kZXZcIl1cbiAgICAgICAgICAgICAgICBmb3IgbmFtZXNwYWNlLCBzcmMgb2YgYXV0b2xvYWRcbiAgICAgICAgICAgICAgICAgICAgaWYgbmFtZXNwYWNlLmVuZHNXaXRoKFwiXFxcXFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gbmFtZXNwYWNlLnN1YnN0cigwLCBuYW1lc3BhY2UubGVuZ3RoLTEpXG5cbiAgICAgICAgICAgICAgICAgICAgYXV0b2xvYWRlcnNbc3JjXSA9IG5hbWVzcGFjZVxuXG4gICAgICAgICMgR2V0IHRoZSBjdXJyZW50IHBhdGggb2YgdGhlIGZpbGVcbiAgICAgICAgcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgZm9yIGRpcmVjdG9yeSBpbiBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVxuICAgICAgICAgICAgaWYgcGF0aC5pbmRleE9mKGRpcmVjdG9yeS5wYXRoKSA9PSAwXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKGRpcmVjdG9yeS5wYXRoLmxlbmd0aCsxKVxuICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgIyBQYXRoIHdpdGggXFwgcmVwbGFjZWQgYnkgLyB0byBiZSBvayB3aXRoIGNvbXBvc2VyLmpzb25cbiAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpXG5cbiAgICAgICAgIyBHZXQgdGhlIHJvb3QgbmFtZXNwYWNlXG4gICAgICAgIG5hbWVzcGFjZSA9IG51bGxcbiAgICAgICAgZm9yIHNyYywgbmFtZSBvZiBhdXRvbG9hZGVyc1xuICAgICAgICAgICAgaWYgcGF0aC5pbmRleE9mKHNyYykgPT0gMFxuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cihzcmMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZSA9IG5hbWVcbiAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICMgTm8gbmFtZXNwYWNlIGZvdW5kID8gTGV0J3MgbGVhdmVcbiAgICAgICAgaWYgbmFtZXNwYWNlID09IG51bGxcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMgSWYgdGhlIHBhdGggc3RhcnRzIHdpdGggXCIvXCIsIHdlIHJlbW92ZSBpdFxuICAgICAgICBpZiBwYXRoLmluZGV4T2YoXCIvXCIpID09IDBcbiAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKVxuXG4gICAgICAgIGVsZW1lbnRzID0gcGF0aC5zcGxpdCgnLycpXG5cbiAgICAgICAgIyBCdWlsZCB0aGUgbmFtZXNwYWNlXG4gICAgICAgIGluZGV4ID0gMVxuICAgICAgICBmb3IgZWxlbWVudCBpbiBlbGVtZW50c1xuICAgICAgICAgICAgaWYgZWxlbWVudCA9PSBcIlwiIG9yIGluZGV4ID09IGVsZW1lbnRzLmxlbmd0aFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIG5hbWVzcGFjZSA9IGlmIG5hbWVzcGFjZSA9PSBcIlwiIHRoZW4gZWxlbWVudCBlbHNlIG5hbWVzcGFjZSArIFwiXFxcXFwiICsgZWxlbWVudFxuICAgICAgICAgICAgaW5kZXgrK1xuXG4gICAgICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICAgIGluZGV4ID0gMFxuXG4gICAgICAgICMgU2VhcmNoIGZvciB0aGUgZ29vZCBwbGFjZSB0byB3cml0ZSB0aGUgbmFtZXNwYWNlXG4gICAgICAgIGxpbmVzID0gdGV4dC5zcGxpdCgnXFxuJylcbiAgICAgICAgZm9yIGxpbmUgaW4gbGluZXNcbiAgICAgICAgICAgIGxpbmUgPSBsaW5lLnRyaW0oKVxuXG4gICAgICAgICAgICAjIElmIHdlIGZvdW5kIGNsYXNzIGtleXdvcmQsIHdlIGFyZSBub3QgaW4gbmFtZXNwYWNlIHNwYWNlLCBzbyByZXR1cm5cbiAgICAgICAgICAgIGlmIGxpbmUuaW5kZXhPZignbmFtZXNwYWNlICcpID09IDBcbiAgICAgICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoW1tpbmRleCwwXSwgW2luZGV4KzEsIDBdXSwgXCJuYW1lc3BhY2UgI3tuYW1lc3BhY2V9O1xcblwiKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgZWxzZSBpZiBsaW5lLnRyaW0oKSAhPSBcIlwiIGFuZCBsaW5lLnRyaW0oKS5pbmRleE9mKFwiPD9cIikgIT0gMFxuICAgICAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShbW2luZGV4LDBdLCBbaW5kZXgsIDBdXSwgXCJuYW1lc3BhY2UgI3tuYW1lc3BhY2V9O1xcblxcblwiKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBpbmRleCArPSAxXG5cbiAgICAgICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFtbMiAsMF0sIFsyLCAwXV0sIFwibmFtZXNwYWNlICN7bmFtZXNwYWNlfTtcXG5cXG5cIilcbiJdfQ==
