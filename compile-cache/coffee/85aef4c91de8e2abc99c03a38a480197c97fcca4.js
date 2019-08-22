(function() {
  var PhpHyperclickPackageView, child_process, fs, path,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  path = require("path");

  fs = require("fs");

  child_process = require("child_process");

  module.exports = PhpHyperclickPackageView = (function() {
    function PhpHyperclickPackageView(serializedState) {
      this.singleSuggestionProvider = bind(this.singleSuggestionProvider, this);
      var message;
      this.element = document.createElement('div');
      this.element.classList.add('php-hperclick-package');
      message = document.createElement('div');
      message.textContent = "The PhpHyperclickPackage package is Alive! It's ALIVE!";
      message.classList.add('message');
      this.element.appendChild(message);
    }

    PhpHyperclickPackageView.prototype.serialize = function() {};

    PhpHyperclickPackageView.prototype.singleSuggestionProvider = function() {
      return {
        providerName: 'php-hyperclick',
        getSuggestionForWord: function(textEditor, text, range) {
          return {
            range: range,
            callback: function() {
              var args, error, projectPath, ref1, ref2, relativePath;
              args = void 0;
              ref1 = void 0;
              ref2 = void 0;
              relativePath = void 0;
              projectPath = void 0;
              ref2 = atom.project.relativizePath(textEditor.getPath());
              projectPath = ref2[0];
              args = [path.resolve(__dirname, '../php/getfilepath.php'), text, textEditor.getPath(), projectPath];
              openFilePath = child_process.spawnSync('php', args).output[1].toString('ascii');
              try {
                if (fs.lstatSync(openFilePath).isFile()) {
                  atom.workspace.open(openFilePath);
                }
              } catch (error1) {
                error = error1;
                atom.notifications.addError('Error : ' + openFilePath);
              }
            }
          };
        }
      };
    };

    PhpHyperclickPackageView.prototype.destroy = function() {
      return this.element.remove();
    };

    PhpHyperclickPackageView.prototype.getElement = function() {
      return this.element;
    };

    return PhpHyperclickPackageView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9waHAtaHlwZXJjbGljay9saWIvcGhwLWh5cGVyY2xpY2stcGFja2FnZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsaURBQUE7SUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGVBQVI7O0VBRWhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxrQ0FBQyxlQUFEOztBQUVYLFVBQUE7TUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsdUJBQXZCO01BR0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1YsT0FBTyxDQUFDLFdBQVIsR0FBc0I7TUFDdEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixTQUF0QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixPQUFyQjtJQVRXOzt1Q0FZYixTQUFBLEdBQVcsU0FBQSxHQUFBOzt1Q0FFWCx3QkFBQSxHQUEwQixTQUFBO2FBQ3RCO1FBQUEsWUFBQSxFQUFjLGdCQUFkO1FBQ0Esb0JBQUEsRUFBc0IsU0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixLQUFuQjtpQkFDcEI7WUFDRSxLQUFBLEVBQU8sS0FEVDtZQUVFLFFBQUEsRUFBVSxTQUFBO0FBQ1Isa0JBQUE7Y0FBQSxJQUFBLEdBQU87Y0FDUCxJQUFBLEdBQU87Y0FDUCxJQUFBLEdBQU87Y0FDUCxZQUFBLEdBQWU7Y0FDZixXQUFBLEdBQWM7Y0FHZCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBNUI7Y0FDUCxXQUFBLEdBQWMsSUFBSyxDQUFBLENBQUE7Y0FDbkIsSUFBQSxHQUFPLENBQ0wsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLHdCQUF4QixDQURLLEVBRUwsSUFGSyxFQUdMLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FISyxFQUlMLFdBSks7Y0FNUDtBQUVBO2dCQUNFLElBQUcsRUFBRSxDQUFDLFNBQUgsQ0FBYSxZQUFiLENBQTBCLENBQUMsTUFBM0IsQ0FBQSxDQUFIO2tCQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQixFQURGO2lCQURGO2VBQUEsY0FBQTtnQkFHTTtnQkFDSixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLFVBQUEsR0FBYSxZQUF6QyxFQUpGOztZQWxCUSxDQUZaOztRQURvQixDQUR0Qjs7SUFEc0I7O3VDQWdDMUIsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQTtJQURPOzt1Q0FHVCxVQUFBLEdBQVksU0FBQTthQUNWLElBQUMsQ0FBQTtJQURTOzs7OztBQXZEZCIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlIFwicGF0aFwiXG5mcyA9IHJlcXVpcmUgXCJmc1wiXG5jaGlsZF9wcm9jZXNzID0gcmVxdWlyZSBcImNoaWxkX3Byb2Nlc3NcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBQaHBIeXBlcmNsaWNrUGFja2FnZVZpZXdcbiAgY29uc3RydWN0b3I6IChzZXJpYWxpemVkU3RhdGUpIC0+XG4gICAgIyBDcmVhdGUgcm9vdCBlbGVtZW50XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BocC1ocGVyY2xpY2stcGFja2FnZScpXG5cbiAgICAjIENyZWF0ZSBtZXNzYWdlIGVsZW1lbnRcbiAgICBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gXCJUaGUgUGhwSHlwZXJjbGlja1BhY2thZ2UgcGFja2FnZSBpcyBBbGl2ZSEgSXQncyBBTElWRSFcIlxuICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpXG4gICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQobWVzc2FnZSlcblxuICAjIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHJldHJpZXZlZCB3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkXG4gIHNlcmlhbGl6ZTogLT5cblxuICBzaW5nbGVTdWdnZXN0aW9uUHJvdmlkZXI6ID0+XG4gICAgICBwcm92aWRlck5hbWU6ICdwaHAtaHlwZXJjbGljaydcbiAgICAgIGdldFN1Z2dlc3Rpb25Gb3JXb3JkOiAodGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpIC0+XG4gICAgICAgIHtcbiAgICAgICAgICByYW5nZTogcmFuZ2VcbiAgICAgICAgICBjYWxsYmFjazogLT5cbiAgICAgICAgICAgIGFyZ3MgPSB1bmRlZmluZWRcbiAgICAgICAgICAgIHJlZjEgPSB1bmRlZmluZWRcbiAgICAgICAgICAgIHJlZjIgPSB1bmRlZmluZWRcbiAgICAgICAgICAgIHJlbGF0aXZlUGF0aCA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgcHJvamVjdFBhdGggPSB1bmRlZmluZWRcbiAgICAgICAgICAgICMgR2V0IHRoZSBjdXJyZW50IHByb2plY3QgcGF0aCBvZiB0aGUgb3BlbmVkIGZpbGUuIFRoYW5rIHlvdSBEeWxhbiBSLiBFLiBNb29uZmlyZVxuICAgICAgICAgICAgIyBodHRwczovL2Rpc2N1c3MuYXRvbS5pby90L3Byb2plY3QtZm9sZGVyLXBhdGgtb2Ytb3BlbmVkLWZpbGUvMjQ4NDYvMTQ/dT1oYXJpa3RcbiAgICAgICAgICAgIHJlZjIgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgodGV4dEVkaXRvci5nZXRQYXRoKCkpXG4gICAgICAgICAgICBwcm9qZWN0UGF0aCA9IHJlZjJbMF1cbiAgICAgICAgICAgIGFyZ3MgPSBbXG4gICAgICAgICAgICAgIHBhdGgucmVzb2x2ZSBfX2Rpcm5hbWUsICcuLi9waHAvZ2V0ZmlsZXBhdGgucGhwJ1xuICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgIHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgICAgIHByb2plY3RQYXRoXG4gICAgICAgICAgICBdXG4gICAgICAgICAgICBgb3BlbkZpbGVQYXRoID0gY2hpbGRfcHJvY2Vzcy5zcGF3blN5bmMoJ3BocCcsIGFyZ3MpLm91dHB1dFsxXS50b1N0cmluZygnYXNjaWknKWBcblxuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgIGlmIGZzLmxzdGF0U3luYyhvcGVuRmlsZVBhdGgpLmlzRmlsZSgpXG4gICAgICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBvcGVuRmlsZVBhdGhcbiAgICAgICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciAnRXJyb3IgOiAnICsgb3BlbkZpbGVQYXRoXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICMgVGVhciBkb3duIGFueSBzdGF0ZSBhbmQgZGV0YWNoXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGVsZW1lbnQucmVtb3ZlKClcblxuICBnZXRFbGVtZW50OiAtPlxuICAgIEBlbGVtZW50XG4iXX0=
