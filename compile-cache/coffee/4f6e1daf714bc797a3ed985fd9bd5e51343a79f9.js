(function() {
  var provider;

  provider = require('./provider');

  module.exports = {
    config: provider.config,
    activate: function() {
      return console.log('activate aligner-css');
    },
    getProvider: function() {
      return provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hbGlnbmVyLWNzcy9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUFRLFFBQVEsQ0FBQyxNQUFqQjtJQUVBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsT0FBTyxDQUFDLEdBQVIsQ0FBWSxzQkFBWjtJQURRLENBRlY7SUFLQSxXQUFBLEVBQWEsU0FBQTthQUFHO0lBQUgsQ0FMYjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbInByb3ZpZGVyID0gcmVxdWlyZSAnLi9wcm92aWRlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6IHByb3ZpZGVyLmNvbmZpZ1xuXG4gIGFjdGl2YXRlOiAtPlxuICAgIGNvbnNvbGUubG9nICdhY3RpdmF0ZSBhbGlnbmVyLWNzcydcblxuICBnZXRQcm92aWRlcjogLT4gcHJvdmlkZXJcbiJdfQ==
