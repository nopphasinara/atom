(function() {
  var TodoRegex;

  module.exports = TodoRegex = (function() {
    function TodoRegex(regex, todoList) {
      this.regex = regex;
      this.error = false;
      this.regexp = this.createRegexp(this.regex, todoList);
    }

    TodoRegex.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, ref, ref1;
      if (regexStr == null) {
        regexStr = '';
      }
      pattern = (ref = regexStr.match(/\/(.+)\//)) != null ? ref[1] : void 0;
      flags = (ref1 = regexStr.match(/\/(\w+$)/)) != null ? ref1[1] : void 0;
      if (!pattern) {
        this.error = true;
        return false;
      }
      return new RegExp(pattern, flags);
    };

    TodoRegex.prototype.createRegexp = function(regexStr, todoList) {
      if (!(Object.prototype.toString.call(todoList) === '[object Array]' && todoList.length > 0 && regexStr)) {
        this.error = true;
        return false;
      }
      return this.makeRegexObj(regexStr.replace('${TODOS}', todoList.join('|')));
    };

    return TodoRegex;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tcmVnZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsbUJBQUMsS0FBRCxFQUFTLFFBQVQ7TUFBQyxJQUFDLENBQUEsUUFBRDtNQUNaLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLEtBQWYsRUFBc0IsUUFBdEI7SUFGQzs7d0JBSWIsWUFBQSxHQUFjLFNBQUMsUUFBRDtBQUVaLFVBQUE7O1FBRmEsV0FBVzs7TUFFeEIsT0FBQSxtREFBc0MsQ0FBQSxDQUFBO01BRXRDLEtBQUEscURBQW9DLENBQUEsQ0FBQTtNQUVwQyxJQUFBLENBQU8sT0FBUDtRQUNFLElBQUMsQ0FBQSxLQUFELEdBQVM7QUFDVCxlQUFPLE1BRlQ7O2FBR0EsSUFBSSxNQUFKLENBQVcsT0FBWCxFQUFvQixLQUFwQjtJQVRZOzt3QkFXZCxZQUFBLEdBQWMsU0FBQyxRQUFELEVBQVcsUUFBWDtNQUNaLElBQUEsQ0FBQSxDQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQTFCLENBQStCLFFBQS9CLENBQUEsS0FBNEMsZ0JBQTVDLElBQ1AsUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FEWCxJQUVQLFFBRkEsQ0FBQTtRQUdFLElBQUMsQ0FBQSxLQUFELEdBQVM7QUFDVCxlQUFPLE1BSlQ7O2FBS0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxRQUFRLENBQUMsT0FBVCxDQUFpQixVQUFqQixFQUE2QixRQUFRLENBQUMsSUFBVCxDQUFjLEdBQWQsQ0FBN0IsQ0FBZDtJQU5ZOzs7OztBQWpCaEIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUb2RvUmVnZXhcbiAgY29uc3RydWN0b3I6IChAcmVnZXgsIHRvZG9MaXN0KSAtPlxuICAgIEBlcnJvciA9IGZhbHNlXG4gICAgQHJlZ2V4cCA9IEBjcmVhdGVSZWdleHAoQHJlZ2V4LCB0b2RvTGlzdClcblxuICBtYWtlUmVnZXhPYmo6IChyZWdleFN0ciA9ICcnKSAtPlxuICAgICMgRXh0cmFjdCB0aGUgcmVnZXggcGF0dGVybiAoYW55dGhpbmcgYmV0d2VlbiB0aGUgc2xhc2hlcylcbiAgICBwYXR0ZXJuID0gcmVnZXhTdHIubWF0Y2goL1xcLyguKylcXC8vKT9bMV1cbiAgICAjIEV4dHJhY3QgdGhlIGZsYWdzIChhZnRlciBsYXN0IHNsYXNoKVxuICAgIGZsYWdzID0gcmVnZXhTdHIubWF0Y2goL1xcLyhcXHcrJCkvKT9bMV1cblxuICAgIHVubGVzcyBwYXR0ZXJuXG4gICAgICBAZXJyb3IgPSB0cnVlXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBuZXcgUmVnRXhwKHBhdHRlcm4sIGZsYWdzKVxuXG4gIGNyZWF0ZVJlZ2V4cDogKHJlZ2V4U3RyLCB0b2RvTGlzdCkgLT5cbiAgICB1bmxlc3MgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRvZG9MaXN0KSBpcyAnW29iamVjdCBBcnJheV0nIGFuZFxuICAgIHRvZG9MaXN0Lmxlbmd0aCA+IDAgYW5kXG4gICAgcmVnZXhTdHJcbiAgICAgIEBlcnJvciA9IHRydWVcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIEBtYWtlUmVnZXhPYmoocmVnZXhTdHIucmVwbGFjZSgnJHtUT0RPU30nLCB0b2RvTGlzdC5qb2luKCd8JykpKVxuIl19
