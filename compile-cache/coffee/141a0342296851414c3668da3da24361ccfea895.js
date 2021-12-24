(function() {
  var CherryPickSelectBranch, git, gitCherryPick;

  git = require('../git');

  CherryPickSelectBranch = require('../views/cherry-pick-select-branch-view');

  gitCherryPick = function(repo) {
    var currentHead, head, heads, i, j, len;
    heads = repo.getReferences().heads;
    currentHead = repo.getShortHead();
    for (i = j = 0, len = heads.length; j < len; i = ++j) {
      head = heads[i];
      heads[i] = head.replace('refs/heads/', '');
    }
    heads = heads.filter(function(head) {
      return head !== currentHead;
    });
    return new CherryPickSelectBranch(repo, heads, currentHead);
  };

  module.exports = gitCherryPick;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNoZXJyeS1waWNrLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSx5Q0FBUjs7RUFFekIsYUFBQSxHQUFnQixTQUFDLElBQUQ7QUFDZCxRQUFBO0lBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBb0IsQ0FBQztJQUM3QixXQUFBLEdBQWMsSUFBSSxDQUFDLFlBQUwsQ0FBQTtBQUVkLFNBQUEsK0NBQUE7O01BQ0UsS0FBTSxDQUFBLENBQUEsQ0FBTixHQUFXLElBQUksQ0FBQyxPQUFMLENBQWEsYUFBYixFQUE0QixFQUE1QjtBQURiO0lBR0EsS0FBQSxHQUFRLEtBQUssQ0FBQyxNQUFOLENBQWEsU0FBQyxJQUFEO2FBQVUsSUFBQSxLQUFVO0lBQXBCLENBQWI7V0FDUixJQUFJLHNCQUFKLENBQTJCLElBQTNCLEVBQWlDLEtBQWpDLEVBQXdDLFdBQXhDO0VBUmM7O0VBVWhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBYmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuQ2hlcnJ5UGlja1NlbGVjdEJyYW5jaCA9IHJlcXVpcmUgJy4uL3ZpZXdzL2NoZXJyeS1waWNrLXNlbGVjdC1icmFuY2gtdmlldydcblxuZ2l0Q2hlcnJ5UGljayA9IChyZXBvKSAtPlxuICBoZWFkcyA9IHJlcG8uZ2V0UmVmZXJlbmNlcygpLmhlYWRzXG4gIGN1cnJlbnRIZWFkID0gcmVwby5nZXRTaG9ydEhlYWQoKVxuXG4gIGZvciBoZWFkLCBpIGluIGhlYWRzXG4gICAgaGVhZHNbaV0gPSBoZWFkLnJlcGxhY2UoJ3JlZnMvaGVhZHMvJywgJycpXG5cbiAgaGVhZHMgPSBoZWFkcy5maWx0ZXIgKGhlYWQpIC0+IGhlYWQgaXNudCBjdXJyZW50SGVhZFxuICBuZXcgQ2hlcnJ5UGlja1NlbGVjdEJyYW5jaChyZXBvLCBoZWFkcywgY3VycmVudEhlYWQpXG5cbm1vZHVsZS5leHBvcnRzID0gZ2l0Q2hlcnJ5UGlja1xuIl19
