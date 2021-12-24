(function() {
  var _, humanizeKeystroke;

  _ = require('underscore-plus');

  humanizeKeystroke = function(binding) {
    return _.humanizeKeystroke(binding.keystrokes);
  };

  module.exports = function(platform) {
    var cache, currentPlatformRegex, transform;
    if (platform == null) {
      platform = process.platform;
    }
    cache = {};
    currentPlatformRegex = new RegExp("\\.platform\\-" + platform + "([,:#\\s]|$)");
    transform = function(name, bindings) {
      if (bindings != null) {
        return bindings.every(function(binding) {
          if (currentPlatformRegex.test(binding.selector)) {
            return cache[name] = humanizeKeystroke(binding);
          }
        });
      }
    };
    return {
      get: function(commands) {
        var c, i, len;
        for (i = 0, len = commands.length; i < len; i++) {
          c = commands[i];
          if (!(c[0] in cache)) {
            transform(c[0], atom.keymaps.findKeyBindings({
              command: c[0]
            }));
          }
        }
        return cache;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9jb21tYW5kLWtleXN0cm9rZS1odW1hbml6ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUVKLGlCQUFBLEdBQW9CLFNBQUMsT0FBRDtXQUFhLENBQUMsQ0FBQyxpQkFBRixDQUFvQixPQUFPLENBQUMsVUFBNUI7RUFBYjs7RUFFcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxRQUFEO0FBQ2IsUUFBQTs7TUFEYyxXQUFXLE9BQU8sQ0FBQzs7SUFDakMsS0FBQSxHQUFRO0lBQ1Isb0JBQUEsR0FBdUIsSUFBSSxNQUFKLENBQVcsZ0JBQUEsR0FBa0IsUUFBbEIsR0FBNEIsY0FBdkM7SUFFdkIsU0FBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLFFBQVA7TUFDVixJQUFHLGdCQUFIO2VBQ0UsUUFBUSxDQUFDLEtBQVQsQ0FBZSxTQUFDLE9BQUQ7VUFDYixJQUE4QyxvQkFBb0IsQ0FBQyxJQUFyQixDQUEwQixPQUFPLENBQUMsUUFBbEMsQ0FBOUM7bUJBQUMsS0FBTSxDQUFBLElBQUEsQ0FBTixHQUFjLGlCQUFBLENBQWtCLE9BQWxCLEVBQWY7O1FBRGEsQ0FBZixFQURGOztJQURVO0FBS1osV0FBTztNQUNMLEdBQUEsRUFBSyxTQUFDLFFBQUQ7QUFDSCxZQUFBO0FBQUEsYUFBQSwwQ0FBQTs7VUFDRSxJQUFBLENBQUEsQ0FBTyxDQUFFLENBQUEsQ0FBQSxDQUFGLElBQVEsS0FBZixDQUFBO1lBQ0UsU0FBQSxDQUFVLENBQUUsQ0FBQSxDQUFBLENBQVosRUFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQTZCO2NBQUMsT0FBQSxFQUFTLENBQUUsQ0FBQSxDQUFBLENBQVo7YUFBN0IsQ0FBaEIsRUFERjs7QUFERjtlQUdBO01BSkcsQ0FEQTs7RUFUTTtBQUpqQiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbmh1bWFuaXplS2V5c3Ryb2tlID0gKGJpbmRpbmcpIC0+IF8uaHVtYW5pemVLZXlzdHJva2UoYmluZGluZy5rZXlzdHJva2VzKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm0pIC0+XG4gICAgY2FjaGUgPSB7fVxuICAgIGN1cnJlbnRQbGF0Zm9ybVJlZ2V4ID0gbmV3IFJlZ0V4cChcIlxcXFwucGxhdGZvcm1cXFxcLSN7IHBsYXRmb3JtIH0oWyw6I1xcXFxzXXwkKVwiKVxuXG4gICAgdHJhbnNmb3JtID0gKG5hbWUsIGJpbmRpbmdzKSAtPlxuICAgICAgaWYgYmluZGluZ3M/XG4gICAgICAgIGJpbmRpbmdzLmV2ZXJ5IChiaW5kaW5nKSAtPlxuICAgICAgICAgIChjYWNoZVtuYW1lXSA9IGh1bWFuaXplS2V5c3Ryb2tlKGJpbmRpbmcpKSBpZiBjdXJyZW50UGxhdGZvcm1SZWdleC50ZXN0KGJpbmRpbmcuc2VsZWN0b3IpXG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0OiAoY29tbWFuZHMpIC0+XG4gICAgICAgIGZvciBjIGluIGNvbW1hbmRzXG4gICAgICAgICAgdW5sZXNzIGNbMF0gb2YgY2FjaGVcbiAgICAgICAgICAgIHRyYW5zZm9ybShjWzBdLCBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzIHtjb21tYW5kOiBjWzBdfSlcbiAgICAgICAgY2FjaGVcbiAgICB9XG4iXX0=
