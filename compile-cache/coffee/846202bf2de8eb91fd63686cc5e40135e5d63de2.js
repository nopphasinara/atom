(function() {
  var ClassProvider, FunctionProvider, GotoManager, PropertyProvider, TextEditor, parser;

  TextEditor = require('atom').TextEditor;

  ClassProvider = require('./class-provider.coffee');

  FunctionProvider = require('./function-provider.coffee');

  PropertyProvider = require('./property-provider.coffee');

  parser = require('../services/php-file-parser.coffee');

  module.exports = GotoManager = (function() {
    function GotoManager() {}

    GotoManager.prototype.providers = [];

    GotoManager.prototype.trace = [];


    /**
     * Initialisation of all the providers and commands for goto
     */

    GotoManager.prototype.init = function() {
      var i, len, provider, ref;
      this.providers.push(new ClassProvider());
      this.providers.push(new FunctionProvider());
      this.providers.push(new PropertyProvider());
      ref = this.providers;
      for (i = 0, len = ref.length; i < len; i++) {
        provider = ref[i];
        provider.init(this);
      }
      atom.commands.add('atom-workspace', {
        'atom-autocomplete-php:goto-backtrack': (function(_this) {
          return function() {
            return _this.backTrack(atom.workspace.getActivePaneItem());
          };
        })(this)
      });
      return atom.commands.add('atom-workspace', {
        'atom-autocomplete-php:goto': (function(_this) {
          return function() {
            return _this.goto(atom.workspace.getActivePaneItem());
          };
        })(this)
      });
    };


    /**
     * Deactivates the goto functionaility
     */

    GotoManager.prototype.deactivate = function() {
      var i, len, provider, ref, results;
      ref = this.providers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        provider = ref[i];
        results.push(provider.deactivate());
      }
      return results;
    };


    /**
     * Adds a backtrack step to the stack.
     *
     * @param {string}         fileName       The file where the jump took place.
     * @param {BufferPosition} bufferPosition The buffer position the cursor was last on.
     */

    GotoManager.prototype.addBackTrack = function(fileName, bufferPosition) {
      return this.trace.push({
        file: fileName,
        position: bufferPosition
      });
    };


    /**
     * Pops one of the stored back tracks and jump the user to its position.
     *
     * @param {TextEditor} editor The current editor.
     */

    GotoManager.prototype.backTrack = function(editor) {
      var lastTrace;
      if (this.trace.length === 0) {
        return;
      }
      lastTrace = this.trace.pop();
      if (editor instanceof TextEditor && editor.getPath() === lastTrace.file) {
        editor.setCursorBufferPosition(lastTrace.position, {
          autoscroll: false
        });
        return editor.scrollToScreenPosition(editor.screenPositionForBufferPosition(lastTrace.position), {
          center: true
        });
      } else {
        return atom.workspace.open(lastTrace.file, {
          searchAllPanes: true,
          initialLine: lastTrace.position[0],
          initialColumn: lastTrace.position[1]
        });
      }
    };


    /**
     * Takes the editor and jumps using one of the providers.
     *
     * @param {TextEditor} editor Current active editor
     */

    GotoManager.prototype.goto = function(editor) {
      var fullTerm, i, len, provider, ref, results;
      fullTerm = parser.getFullWordFromBufferPosition(editor, editor.getCursorBufferPosition());
      ref = this.providers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        provider = ref[i];
        if (provider.canGoto(fullTerm)) {
          provider.gotoFromEditor(editor);
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return GotoManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL2dvdG8vZ290by1tYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsYUFBYyxPQUFBLENBQVEsTUFBUjs7RUFFZixhQUFBLEdBQWdCLE9BQUEsQ0FBUSx5QkFBUjs7RUFDaEIsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSOztFQUNuQixnQkFBQSxHQUFtQixPQUFBLENBQVEsNEJBQVI7O0VBRW5CLE1BQUEsR0FBUyxPQUFBLENBQVEsb0NBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FFTTs7OzBCQUNGLFNBQUEsR0FBVzs7MEJBQ1gsS0FBQSxHQUFPOzs7QUFFUDs7OzswQkFHQSxJQUFBLEdBQU0sU0FBQTtBQUNGLFVBQUE7TUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBSSxhQUFKLENBQUEsQ0FBaEI7TUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBSSxnQkFBSixDQUFBLENBQWhCO01BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLElBQUksZ0JBQUosQ0FBQSxDQUFoQjtBQUVBO0FBQUEsV0FBQSxxQ0FBQTs7UUFDSSxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQ7QUFESjtNQUdBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSxzQ0FBQSxFQUF3QyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUN4RSxLQUFDLENBQUEsU0FBRCxDQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFYO1VBRHdFO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QztPQUFwQzthQUdBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7UUFBQSw0QkFBQSxFQUE4QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUM5RCxLQUFDLENBQUEsSUFBRCxDQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFOO1VBRDhEO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QjtPQUFwQztJQVhFOzs7QUFjTjs7OzswQkFHQSxVQUFBLEdBQVksU0FBQTtBQUNSLFVBQUE7QUFBQTtBQUFBO1dBQUEscUNBQUE7O3FCQUNJLFFBQVEsQ0FBQyxVQUFULENBQUE7QUFESjs7SUFEUTs7O0FBSVo7Ozs7Ozs7MEJBTUEsWUFBQSxHQUFjLFNBQUMsUUFBRCxFQUFXLGNBQVg7YUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWTtRQUNSLElBQUEsRUFBTSxRQURFO1FBRVIsUUFBQSxFQUFVLGNBRkY7T0FBWjtJQURVOzs7QUFNZDs7Ozs7OzBCQUtBLFNBQUEsR0FBVyxTQUFDLE1BQUQ7QUFDUCxVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsS0FBaUIsQ0FBcEI7QUFDSSxlQURKOztNQUdBLFNBQUEsR0FBWSxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBQTtNQUVaLElBQUcsTUFBQSxZQUFrQixVQUFsQixJQUFnQyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQUEsS0FBb0IsU0FBUyxDQUFDLElBQWpFO1FBQ0ksTUFBTSxDQUFDLHVCQUFQLENBQStCLFNBQVMsQ0FBQyxRQUF6QyxFQUFtRDtVQUMvQyxVQUFBLEVBQVksS0FEbUM7U0FBbkQ7ZUFNQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsTUFBTSxDQUFDLCtCQUFQLENBQXVDLFNBQVMsQ0FBQyxRQUFqRCxDQUE5QixFQUEwRjtVQUN0RixNQUFBLEVBQVEsSUFEOEU7U0FBMUYsRUFQSjtPQUFBLE1BQUE7ZUFZSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsU0FBUyxDQUFDLElBQTlCLEVBQW9DO1VBQ2hDLGNBQUEsRUFBZ0IsSUFEZ0I7VUFFaEMsV0FBQSxFQUFhLFNBQVMsQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUZBO1VBR2hDLGFBQUEsRUFBZSxTQUFTLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FIRjtTQUFwQyxFQVpKOztJQU5POzs7QUF3Qlg7Ozs7OzswQkFLQSxJQUFBLEdBQU0sU0FBQyxNQUFEO0FBQ0YsVUFBQTtNQUFBLFFBQUEsR0FBVyxNQUFNLENBQUMsNkJBQVAsQ0FBcUMsTUFBckMsRUFBNkMsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBN0M7QUFFWDtBQUFBO1dBQUEscUNBQUE7O1FBQ0ksSUFBRyxRQUFRLENBQUMsT0FBVCxDQUFpQixRQUFqQixDQUFIO1VBQ0ksUUFBUSxDQUFDLGNBQVQsQ0FBd0IsTUFBeEI7QUFDQSxnQkFGSjtTQUFBLE1BQUE7K0JBQUE7O0FBREo7O0lBSEU7Ozs7O0FBcEZWIiwic291cmNlc0NvbnRlbnQiOlsie1RleHRFZGl0b3J9ID0gcmVxdWlyZSAnYXRvbSdcblxuQ2xhc3NQcm92aWRlciA9IHJlcXVpcmUgJy4vY2xhc3MtcHJvdmlkZXIuY29mZmVlJ1xuRnVuY3Rpb25Qcm92aWRlciA9IHJlcXVpcmUgJy4vZnVuY3Rpb24tcHJvdmlkZXIuY29mZmVlJ1xuUHJvcGVydHlQcm92aWRlciA9IHJlcXVpcmUgJy4vcHJvcGVydHktcHJvdmlkZXIuY29mZmVlJ1xuXG5wYXJzZXIgPSByZXF1aXJlICcuLi9zZXJ2aWNlcy9waHAtZmlsZS1wYXJzZXIuY29mZmVlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbmNsYXNzIEdvdG9NYW5hZ2VyXG4gICAgcHJvdmlkZXJzOiBbXVxuICAgIHRyYWNlOiBbXVxuXG4gICAgIyMjKlxuICAgICAqIEluaXRpYWxpc2F0aW9uIG9mIGFsbCB0aGUgcHJvdmlkZXJzIGFuZCBjb21tYW5kcyBmb3IgZ290b1xuICAgICMjI1xuICAgIGluaXQ6ICgpIC0+XG4gICAgICAgIEBwcm92aWRlcnMucHVzaCBuZXcgQ2xhc3NQcm92aWRlcigpXG4gICAgICAgIEBwcm92aWRlcnMucHVzaCBuZXcgRnVuY3Rpb25Qcm92aWRlcigpXG4gICAgICAgIEBwcm92aWRlcnMucHVzaCBuZXcgUHJvcGVydHlQcm92aWRlcigpXG5cbiAgICAgICAgZm9yIHByb3ZpZGVyIGluIEBwcm92aWRlcnNcbiAgICAgICAgICAgIHByb3ZpZGVyLmluaXQoQClcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnYXRvbS1hdXRvY29tcGxldGUtcGhwOmdvdG8tYmFja3RyYWNrJzogPT5cbiAgICAgICAgICAgIEBiYWNrVHJhY2soYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAnYXRvbS1hdXRvY29tcGxldGUtcGhwOmdvdG8nOiA9PlxuICAgICAgICAgICAgQGdvdG8oYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcblxuICAgICMjIypcbiAgICAgKiBEZWFjdGl2YXRlcyB0aGUgZ290byBmdW5jdGlvbmFpbGl0eVxuICAgICMjI1xuICAgIGRlYWN0aXZhdGU6ICgpIC0+XG4gICAgICAgIGZvciBwcm92aWRlciBpbiBAcHJvdmlkZXJzXG4gICAgICAgICAgICBwcm92aWRlci5kZWFjdGl2YXRlKClcblxuICAgICMjIypcbiAgICAgKiBBZGRzIGEgYmFja3RyYWNrIHN0ZXAgdG8gdGhlIHN0YWNrLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgZmlsZU5hbWUgICAgICAgVGhlIGZpbGUgd2hlcmUgdGhlIGp1bXAgdG9vayBwbGFjZS5cbiAgICAgKiBAcGFyYW0ge0J1ZmZlclBvc2l0aW9ufSBidWZmZXJQb3NpdGlvbiBUaGUgYnVmZmVyIHBvc2l0aW9uIHRoZSBjdXJzb3Igd2FzIGxhc3Qgb24uXG4gICAgIyMjXG4gICAgYWRkQmFja1RyYWNrOiAoZmlsZU5hbWUsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgICAgICBAdHJhY2UucHVzaCh7XG4gICAgICAgICAgICBmaWxlOiBmaWxlTmFtZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBidWZmZXJQb3NpdGlvblxuICAgICAgICB9KVxuXG4gICAgIyMjKlxuICAgICAqIFBvcHMgb25lIG9mIHRoZSBzdG9yZWQgYmFjayB0cmFja3MgYW5kIGp1bXAgdGhlIHVzZXIgdG8gaXRzIHBvc2l0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtUZXh0RWRpdG9yfSBlZGl0b3IgVGhlIGN1cnJlbnQgZWRpdG9yLlxuICAgICMjI1xuICAgIGJhY2tUcmFjazogKGVkaXRvcikgLT5cbiAgICAgICAgaWYgQHRyYWNlLmxlbmd0aCA9PSAwXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBsYXN0VHJhY2UgPSBAdHJhY2UucG9wKClcblxuICAgICAgICBpZiBlZGl0b3IgaW5zdGFuY2VvZiBUZXh0RWRpdG9yICYmIGVkaXRvci5nZXRQYXRoKCkgPT0gbGFzdFRyYWNlLmZpbGVcbiAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihsYXN0VHJhY2UucG9zaXRpb24sIHtcbiAgICAgICAgICAgICAgICBhdXRvc2Nyb2xsOiBmYWxzZVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgIyBTZXBhcmF0ZWQgdGhlc2UgYXMgdGhlIGF1dG9zY3JvbGwgb24gc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25cbiAgICAgICAgICAgICMgZGlkbid0IHdvcmsgYXMgd2VsbC5cbiAgICAgICAgICAgIGVkaXRvci5zY3JvbGxUb1NjcmVlblBvc2l0aW9uKGVkaXRvci5zY3JlZW5Qb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uKGxhc3RUcmFjZS5wb3NpdGlvbiksIHtcbiAgICAgICAgICAgICAgICBjZW50ZXI6IHRydWVcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihsYXN0VHJhY2UuZmlsZSwge1xuICAgICAgICAgICAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluaXRpYWxMaW5lOiBsYXN0VHJhY2UucG9zaXRpb25bMF1cbiAgICAgICAgICAgICAgICBpbml0aWFsQ29sdW1uOiBsYXN0VHJhY2UucG9zaXRpb25bMV1cbiAgICAgICAgICAgIH0pXG5cbiAgICAjIyMqXG4gICAgICogVGFrZXMgdGhlIGVkaXRvciBhbmQganVtcHMgdXNpbmcgb25lIG9mIHRoZSBwcm92aWRlcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciBDdXJyZW50IGFjdGl2ZSBlZGl0b3JcbiAgICAjIyNcbiAgICBnb3RvOiAoZWRpdG9yKSAtPlxuICAgICAgICBmdWxsVGVybSA9IHBhcnNlci5nZXRGdWxsV29yZEZyb21CdWZmZXJQb3NpdGlvbihlZGl0b3IsIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKVxuXG4gICAgICAgIGZvciBwcm92aWRlciBpbiBAcHJvdmlkZXJzXG4gICAgICAgICAgICBpZiBwcm92aWRlci5jYW5Hb3RvKGZ1bGxUZXJtKVxuICAgICAgICAgICAgICAgIHByb3ZpZGVyLmdvdG9Gcm9tRWRpdG9yKGVkaXRvcilcbiAgICAgICAgICAgICAgICBicmVha1xuIl19
