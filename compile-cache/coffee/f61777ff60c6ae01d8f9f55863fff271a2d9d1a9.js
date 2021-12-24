(function() {
  var GitRun, capitalize, customCommands, git, service;

  git = require('./git');

  GitRun = require('./models/git-run');

  capitalize = function(text) {
    return text.split(' ').map(function(word) {
      return word[0].toUpperCase() + word.substring(1);
    }).join(' ');
  };

  customCommands = [];

  service = {};

  if (atom.config.get('git-plus.experimental.customCommands')) {
    service.getCustomCommands = function() {
      return customCommands;
    };
    service.getRepo = git.getRepo;
    service.registerCommand = function(element, name, fn) {
      var displayName;
      atom.commands.add(element, name, fn);
      displayName = capitalize(name.split(':')[1].replace(/-/g, ' '));
      return customCommands.push([name, displayName, fn]);
    };
    service.run = GitRun;
  }

  module.exports = Object.freeze(service);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9zZXJ2aWNlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSOztFQUNOLE1BQUEsR0FBUyxPQUFBLENBQVEsa0JBQVI7O0VBRVQsVUFBQSxHQUFhLFNBQUMsSUFBRDtXQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxDQUFlLENBQUMsR0FBaEIsQ0FBb0IsU0FBQyxJQUFEO2FBQVUsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQVIsQ0FBQSxDQUFBLEdBQXdCLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZjtJQUFsQyxDQUFwQixDQUF3RSxDQUFDLElBQXpFLENBQThFLEdBQTlFO0VBQVY7O0VBRWIsY0FBQSxHQUFpQjs7RUFFakIsT0FBQSxHQUFVOztFQUVWLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUFIO0lBQ0UsT0FBTyxDQUFDLGlCQUFSLEdBQTRCLFNBQUE7YUFBRztJQUFIO0lBQzVCLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLEdBQUcsQ0FBQztJQUN0QixPQUFPLENBQUMsZUFBUixHQUEwQixTQUFDLE9BQUQsRUFBVSxJQUFWLEVBQWdCLEVBQWhCO0FBQ3hCLFVBQUE7TUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsT0FBbEIsRUFBMkIsSUFBM0IsRUFBaUMsRUFBakM7TUFDQSxXQUFBLEdBQWMsVUFBQSxDQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxDQUFnQixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQW5CLENBQTJCLElBQTNCLEVBQWlDLEdBQWpDLENBQVg7YUFDZCxjQUFjLENBQUMsSUFBZixDQUFvQixDQUFDLElBQUQsRUFBTyxXQUFQLEVBQW9CLEVBQXBCLENBQXBCO0lBSHdCO0lBSTFCLE9BQU8sQ0FBQyxHQUFSLEdBQWMsT0FQaEI7OztFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQU0sQ0FBQyxNQUFQLENBQWMsT0FBZDtBQWxCakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuL2dpdCdcbkdpdFJ1biA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1ydW4nXG5cbmNhcGl0YWxpemUgPSAodGV4dCkgLT4gdGV4dC5zcGxpdCgnICcpLm1hcCgod29yZCkgLT4gd29yZFswXS50b1VwcGVyQ2FzZSgpICsgd29yZC5zdWJzdHJpbmcoMSkpLmpvaW4oJyAnKVxuXG5jdXN0b21Db21tYW5kcyA9IFtdXG5cbnNlcnZpY2UgPSB7fVxuXG5pZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmV4cGVyaW1lbnRhbC5jdXN0b21Db21tYW5kcycpXG4gIHNlcnZpY2UuZ2V0Q3VzdG9tQ29tbWFuZHMgPSAtPiBjdXN0b21Db21tYW5kc1xuICBzZXJ2aWNlLmdldFJlcG8gPSBnaXQuZ2V0UmVwb1xuICBzZXJ2aWNlLnJlZ2lzdGVyQ29tbWFuZCA9IChlbGVtZW50LCBuYW1lLCBmbikgLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBlbGVtZW50LCBuYW1lLCBmblxuICAgIGRpc3BsYXlOYW1lID0gY2FwaXRhbGl6ZShuYW1lLnNwbGl0KCc6JylbMV0ucmVwbGFjZSgvLS9nLCAnICcpKVxuICAgIGN1c3RvbUNvbW1hbmRzLnB1c2ggW25hbWUsIGRpc3BsYXlOYW1lLCBmbl1cbiAgc2VydmljZS5ydW4gPSBHaXRSdW5cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZnJlZXplIHNlcnZpY2VcbiJdfQ==
