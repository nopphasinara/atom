(function() {
  var Emitter, TodoModel, _, maxLength, path;

  path = require('path');

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  maxLength = 120;

  module.exports = TodoModel = (function() {
    function TodoModel(match, arg) {
      var plain;
      plain = (arg != null ? arg : []).plain;
      if (plain) {
        return _.extend(this, match);
      }
      this.handleScanMatch(match);
    }

    TodoModel.prototype.getAllKeys = function() {
      return atom.config.get('todo-show.showInTable') || ['Text'];
    };

    TodoModel.prototype.get = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if ((value = this[key.toLowerCase()]) || value === '') {
        return value;
      }
      return this.text || 'No details';
    };

    TodoModel.prototype.getMarkdown = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if (!(value = this[key.toLowerCase()])) {
        return '';
      }
      switch (key) {
        case 'All':
        case 'Text':
          return " " + value;
        case 'Type':
        case 'Project':
          return " __" + value + "__";
        case 'Range':
        case 'Line':
          return " _:" + value + "_";
        case 'Regex':
          return " _'" + value + "'_";
        case 'Path':
        case 'File':
          return " [" + value + "](" + value + ")";
        case 'Tags':
        case 'Id':
          return " _" + value + "_";
      }
    };

    TodoModel.prototype.getMarkdownArray = function(keys) {
      var i, key, len, ref, results;
      ref = keys || this.getAllKeys();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        results.push(this.getMarkdown(key));
      }
      return results;
    };

    TodoModel.prototype.keyIsNumber = function(key) {
      return key === 'Range' || key === 'Line';
    };

    TodoModel.prototype.contains = function(string) {
      var i, item, key, len, ref;
      if (string == null) {
        string = '';
      }
      ref = this.getAllKeys();
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        if (!(item = this.get(key))) {
          break;
        }
        if (item.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
          return true;
        }
      }
      return false;
    };

    TodoModel.prototype.handleScanMatch = function(match) {
      var _matchText, loc, matchText, matches, pos, project, ref, ref1, ref2, ref3, relativePath, tag;
      matchText = match.text || match.all || '';
      if (matchText.length > ((ref = match.all) != null ? ref.length : void 0)) {
        match.all = matchText;
      }
      while ((_matchText = (ref1 = match.regexp) != null ? ref1.exec(matchText) : void 0)) {
        if (!match.type) {
          match.type = _matchText[1];
        }
        matchText = _matchText.pop();
      }
      if (matchText.indexOf('(') === 0) {
        if (matches = matchText.match(/\((.*?)\):?(.*)/)) {
          matchText = matches.pop();
          match.id = matches.pop();
        }
      }
      matchText = this.stripCommentEnd(matchText);
      match.tags = ((function() {
        var results;
        results = [];
        while ((tag = /\s*#([\w.|]+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, -tag.shift().length);
          results.push(tag.shift().trim().replace(/[\.,]\s*$/, ''));
        }
        return results;
      })()).sort().join(', ');
      if (!matchText && match.all && (pos = (ref2 = match.position) != null ? (ref3 = ref2[0]) != null ? ref3[1] : void 0 : void 0)) {
        matchText = match.all.substr(0, pos);
        matchText = this.stripCommentStart(matchText);
      }
      if (matchText.length >= maxLength) {
        matchText = (matchText.substr(0, maxLength - 3)) + "...";
      }
      if (!(match.position && match.position.length > 0)) {
        match.position = [[0, 0]];
      }
      if (match.position.serialize) {
        match.range = match.position.serialize().toString();
      } else {
        match.range = match.position.toString();
      }
      relativePath = atom.project.relativizePath(match.loc);
      if (relativePath[0] == null) {
        relativePath[0] = '';
      }
      match.path = relativePath[1] || '';
      if ((match.loc && (loc = path.basename(match.loc))) !== 'undefined') {
        match.file = loc;
      } else {
        match.file = 'untitled';
      }
      if ((project = path.basename(relativePath[0])) !== 'null') {
        match.project = project;
      } else {
        match.project = '';
      }
      match.text = matchText || "No details";
      match.line = (parseInt(match.range.split(',')[0]) + 1).toString();
      match.regex = match.regex.replace('${TODOS}', match.type);
      match.id = match.id || '';
      return _.extend(this, match);
    };

    TodoModel.prototype.stripCommentStart = function(text) {
      var startRegex;
      if (text == null) {
        text = '';
      }
      startRegex = /(\/\*|<\?|<!--|<#|{-|\[\[|\/\/|#)\s*$/;
      return text.replace(startRegex, '').trim();
    };

    TodoModel.prototype.stripCommentEnd = function(text) {
      var endRegex;
      if (text == null) {
        text = '';
      }
      endRegex = /(\*\/}?|\?>|-->|#>|-}|\]\])\s*$/;
      return text.replace(endRegex, '').trim();
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvbGliL3RvZG8tbW9kZWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRU4sVUFBVyxPQUFBLENBQVEsTUFBUjs7RUFDWixDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUVKLFNBQUEsR0FBWTs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsbUJBQUMsS0FBRCxFQUFRLEdBQVI7QUFDWCxVQUFBO01BRG9CLHVCQUFELE1BQVU7TUFDN0IsSUFBZ0MsS0FBaEM7QUFBQSxlQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEtBQWYsRUFBUDs7TUFDQSxJQUFDLENBQUEsZUFBRCxDQUFpQixLQUFqQjtJQUZXOzt3QkFJYixVQUFBLEdBQVksU0FBQTthQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBQSxJQUE0QyxDQUFDLE1BQUQ7SUFEbEM7O3dCQUdaLEdBQUEsR0FBSyxTQUFDLEdBQUQ7QUFDSCxVQUFBOztRQURJLE1BQU07O01BQ1YsSUFBZ0IsQ0FBQyxLQUFBLEdBQVEsSUFBRSxDQUFBLEdBQUcsQ0FBQyxXQUFKLENBQUEsQ0FBQSxDQUFYLENBQUEsSUFBa0MsS0FBQSxLQUFTLEVBQTNEO0FBQUEsZUFBTyxNQUFQOzthQUNBLElBQUMsQ0FBQSxJQUFELElBQVM7SUFGTjs7d0JBSUwsV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7O1FBRFksTUFBTTs7TUFDbEIsSUFBQSxDQUFpQixDQUFBLEtBQUEsR0FBUSxJQUFFLENBQUEsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQUFBLENBQVYsQ0FBakI7QUFBQSxlQUFPLEdBQVA7O0FBQ0EsY0FBTyxHQUFQO0FBQUEsYUFDTyxLQURQO0FB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XG57RW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblxubWF4TGVuZ3RoID0gMTIwXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRvZG9Nb2RlbFxuICBjb25zdHJ1Y3RvcjogKG1hdGNoLCB7cGxhaW59ID0gW10pIC0+XG4gICAgcmV0dXJuIF8uZXh0ZW5kKHRoaXMsIG1hdGNoKSBpZiBwbGFpblxuICAgIEBoYW5kbGVTY2FuTWF0Y2ggbWF0Y2hcblxuICBnZXRBbGxLZXlzOiAtPlxuICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LnNob3dJblRhYmxlJykgb3IgWydUZXh0J11cblxuICBnZXQ6IChrZXkgPSAnJykgLT5cbiAgICByZXR1cm4gdmFsdWUgaWYgKHZhbHVlID0gQFtrZXkudG9Mb3dlckNhc2UoKV0pIG9yIHZhbHVlIGlzICcnXG4gICAgQHRleHQgb3IgJ05vIGRldGFpbHMnXG5cbiAgZ2V0TWFya2Rvd246IChrZXkgPSAnJykgLT5cbiAgICByZXR1cm4gJycgdW5sZXNzIHZhbHVlID0gQFtrZXkudG9Mb3dlckNhc2UoKV1cbiAgICBzd2l0Y2gga2V5XG4gICAgICB3aGVuICdBbGwnLCAnVGV4dCcgdGhlbiBcIiAje3ZhbHVlfVwiXG4gICAgICB3aGVuICdUeXBlJywgJ1Byb2plY3QnIHRoZW4gXCIgX18je3ZhbHVlfV9fXCJcbiAgICAgIHdoZW4gJ1JhbmdlJywgJ0xpbmUnIHRoZW4gXCIgXzoje3ZhbHVlfV9cIlxuICAgICAgd2hlbiAnUmVnZXgnIHRoZW4gXCIgXycje3ZhbHVlfSdfXCJcbiAgICAgIHdoZW4gJ1BhdGgnLCAnRmlsZScgdGhlbiBcIiBbI3t2YWx1ZX1dKCN7dmFsdWV9KVwiXG4gICAgICB3aGVuICdUYWdzJywgJ0lkJyB0aGVuIFwiIF8je3ZhbHVlfV9cIlxuXG4gIGdldE1hcmtkb3duQXJyYXk6IChrZXlzKSAtPlxuICAgIGZvciBrZXkgaW4ga2V5cyBvciBAZ2V0QWxsS2V5cygpXG4gICAgICBAZ2V0TWFya2Rvd24oa2V5KVxuXG4gIGtleUlzTnVtYmVyOiAoa2V5KSAtPlxuICAgIGtleSBpbiBbJ1JhbmdlJywgJ0xpbmUnXVxuXG4gIGNvbnRhaW5zOiAoc3RyaW5nID0gJycpIC0+XG4gICAgZm9yIGtleSBpbiBAZ2V0QWxsS2V5cygpXG4gICAgICBicmVhayB1bmxlc3MgaXRlbSA9IEBnZXQoa2V5KVxuICAgICAgcmV0dXJuIHRydWUgaWYgaXRlbS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc3RyaW5nLnRvTG93ZXJDYXNlKCkpIGlzbnQgLTFcbiAgICBmYWxzZVxuXG4gIGhhbmRsZVNjYW5NYXRjaDogKG1hdGNoKSAtPlxuICAgIG1hdGNoVGV4dCA9IG1hdGNoLnRleHQgb3IgbWF0Y2guYWxsIG9yICcnXG4gICAgaWYgbWF0Y2hUZXh0Lmxlbmd0aCA+IG1hdGNoLmFsbD8ubGVuZ3RoXG4gICAgICBtYXRjaC5hbGwgPSBtYXRjaFRleHRcblxuICAgICMgU3RyaXAgb3V0IHRoZSByZWdleCB0b2tlbiBmcm9tIHRoZSBmb3VuZCBhbm5vdGF0aW9uXG4gICAgIyBub3QgYWxsIG9iamVjdHMgd2lsbCBoYXZlIGFuIGV4ZWMgbWF0Y2hcbiAgICB3aGlsZSAoX21hdGNoVGV4dCA9IG1hdGNoLnJlZ2V4cD8uZXhlYyhtYXRjaFRleHQpKVxuICAgICAgIyBGaW5kIG1hdGNoIHR5cGVcbiAgICAgIG1hdGNoLnR5cGUgPSBfbWF0Y2hUZXh0WzFdIHVubGVzcyBtYXRjaC50eXBlXG4gICAgICAjIEV4dHJhY3QgdG9kbyB0ZXh0XG4gICAgICBtYXRjaFRleHQgPSBfbWF0Y2hUZXh0LnBvcCgpXG5cbiAgICAjIEV4dHJhY3QgZ29vZ2xlIHN0eWxlIGd1aWRlIHRvZG8gaWRcbiAgICBpZiBtYXRjaFRleHQuaW5kZXhPZignKCcpIGlzIDBcbiAgICAgIGlmIG1hdGNoZXMgPSBtYXRjaFRleHQubWF0Y2goL1xcKCguKj8pXFwpOj8oLiopLylcbiAgICAgICAgbWF0Y2hUZXh0ID0gbWF0Y2hlcy5wb3AoKVxuICAgICAgICBtYXRjaC5pZCA9IG1hdGNoZXMucG9wKClcblxuICAgIG1hdGNoVGV4dCA9IEBzdHJpcENvbW1lbnRFbmQobWF0Y2hUZXh0KVxuXG4gICAgIyBFeHRyYWN0IHRvZG8gdGFnc1xuICAgIG1hdGNoLnRhZ3MgPSAod2hpbGUgKHRhZyA9IC9cXHMqIyhbXFx3LnxdKylbLC5dPyQvLmV4ZWMobWF0Y2hUZXh0KSlcbiAgICAgIGJyZWFrIGlmIHRhZy5sZW5ndGggaXNudCAyXG4gICAgICBtYXRjaFRleHQgPSBtYXRjaFRleHQuc2xpY2UoMCwgLXRhZy5zaGlmdCgpLmxlbmd0aClcbiAgICAgIHRhZy5zaGlmdCgpLnRyaW0oKS5yZXBsYWNlKC9bXFwuLF1cXHMqJC8sICcnKVxuICAgICkuc29ydCgpLmpvaW4oJywgJylcblxuICAgICMgVXNlIHRleHQgYmVmb3JlIHRvZG8gaWYgbm8gY29udGVudCBhZnRlclxuICAgIGlmIG5vdCBtYXRjaFRleHQgYW5kIG1hdGNoLmFsbCBhbmQgcG9zID0gbWF0Y2gucG9zaXRpb24/WzBdP1sxXVxuICAgICAgbWF0Y2hUZXh0ID0gbWF0Y2guYWxsLnN1YnN0cigwLCBwb3MpXG4gICAgICBtYXRjaFRleHQgPSBAc3RyaXBDb21tZW50U3RhcnQobWF0Y2hUZXh0KVxuXG4gICAgIyBUcnVuY2F0ZSBsb25nIG1hdGNoIHN0cmluZ3NcbiAgICBpZiBtYXRjaFRleHQubGVuZ3RoID49IG1heExlbmd0aFxuICAgICAgbWF0Y2hUZXh0ID0gXCIje21hdGNoVGV4dC5zdWJzdHIoMCwgbWF4TGVuZ3RoIC0gMyl9Li4uXCJcblxuICAgICMgTWFrZSBzdXJlIHJhbmdlIGlzIHNlcmlhbGl6ZWQgdG8gcHJvZHVjZSBjb3JyZWN0IHJlbmRlcmVkIGZvcm1hdFxuICAgIG1hdGNoLnBvc2l0aW9uID0gW1swLDBdXSB1bmxlc3MgbWF0Y2gucG9zaXRpb24gYW5kIG1hdGNoLnBvc2l0aW9uLmxlbmd0aCA+IDBcbiAgICBpZiBtYXRjaC5wb3NpdGlvbi5zZXJpYWxpemVcbiAgICAgIG1hdGNoLnJhbmdlID0gbWF0Y2gucG9zaXRpb24uc2VyaWFsaXplKCkudG9TdHJpbmcoKVxuICAgIGVsc2VcbiAgICAgIG1hdGNoLnJhbmdlID0gbWF0Y2gucG9zaXRpb24udG9TdHJpbmcoKVxuXG4gICAgIyBFeHRyYWN0IHBhdGhzIGFuZCBwcm9qZWN0XG4gICAgcmVsYXRpdmVQYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKG1hdGNoLmxvYylcbiAgICByZWxhdGl2ZVBhdGhbMF0gPz0gJydcbiAgICBtYXRjaC5wYXRoID0gcmVsYXRpdmVQYXRoWzFdIG9yICcnXG5cbiAgICBpZiAobWF0Y2gubG9jIGFuZCBsb2MgPSBwYXRoLmJhc2VuYW1lKG1hdGNoLmxvYykpIGlzbnQgJ3VuZGVmaW5lZCdcbiAgICAgIG1hdGNoLmZpbGUgPSBsb2NcbiAgICBlbHNlXG4gICAgICBtYXRjaC5maWxlID0gJ3VudGl0bGVkJ1xuXG4gICAgaWYgKHByb2plY3QgPSBwYXRoLmJhc2VuYW1lKHJlbGF0aXZlUGF0aFswXSkpIGlzbnQgJ251bGwnXG4gICAgICBtYXRjaC5wcm9qZWN0ID0gcHJvamVjdFxuICAgIGVsc2VcbiAgICAgIG1hdGNoLnByb2plY3QgPSAnJ1xuXG4gICAgbWF0Y2gudGV4dCA9IG1hdGNoVGV4dCBvciBcIk5vIGRldGFpbHNcIlxuICAgIG1hdGNoLmxpbmUgPSAocGFyc2VJbnQobWF0Y2gucmFuZ2Uuc3BsaXQoJywnKVswXSkgKyAxKS50b1N0cmluZygpXG4gICAgbWF0Y2gucmVnZXggPSBtYXRjaC5yZWdleC5yZXBsYWNlKCcke1RPRE9TfScsIG1hdGNoLnR5cGUpXG4gICAgbWF0Y2guaWQgPSBtYXRjaC5pZCBvciAnJ1xuXG4gICAgXy5leHRlbmQodGhpcywgbWF0Y2gpXG5cbiAgc3RyaXBDb21tZW50U3RhcnQ6ICh0ZXh0ID0gJycpIC0+XG4gICAgc3RhcnRSZWdleCA9IC8oXFwvXFwqfDxcXD98PCEtLXw8I3x7LXxcXFtcXFt8XFwvXFwvfCMpXFxzKiQvXG4gICAgdGV4dC5yZXBsYWNlKHN0YXJ0UmVnZXgsICcnKS50cmltKClcblxuICBzdHJpcENvbW1lbnRFbmQ6ICh0ZXh0ID0gJycpIC0+XG4gICAgZW5kUmVnZXggPSAvKFxcKlxcL30/fFxcPz58LS0+fCM+fC19fFxcXVxcXSlcXHMqJC9cbiAgICB0ZXh0LnJlcGxhY2UoZW5kUmVnZXgsICcnKS50cmltKClcbiJdfQ==
