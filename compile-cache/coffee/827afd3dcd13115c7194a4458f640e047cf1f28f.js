(function() {
  var COMPLETIONS, JSXATTRIBUTE, JSXENDTAGSTART, JSXREGEXP, JSXSTARTTAGEND, JSXTAG, Point, REACTURL, Range, TAGREGEXP, filter, ref, ref1, score,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require("atom"), Range = ref.Range, Point = ref.Point;

  ref1 = require("fuzzaldrin"), filter = ref1.filter, score = ref1.score;

  JSXSTARTTAGEND = 0;

  JSXENDTAGSTART = 1;

  JSXTAG = 2;

  JSXATTRIBUTE = 3;

  JSXREGEXP = /(?:(<)|(<\/))([$_A-Za-z](?:[$._:\-a-zA-Z0-9])*)|(?:(\/>)|(>))|(<\s*>)/g;

  TAGREGEXP = /<([$_a-zA-Z][$._:\-a-zA-Z0-9]*)($|\s|\/>|>)/g;

  COMPLETIONS = require("./completions-jsx");

  REACTURL = "http://facebook.github.io/react/docs/tags-and-attributes.html";

  module.exports = {
    selector: ".meta.tag.jsx",
    inclusionPriority: 10000,
    excludeLowerPriority: false,
    getSuggestions: function(opts) {
      var attribute, attributes, bufferPosition, editor, elementObj, filteredAttributes, htmlElement, htmlElements, i, j, jsxRange, jsxTag, k, len, len1, len2, prefix, ref2, scopeDescriptor, startOfJSX, suggestions, tagName, tagNameStack;
      editor = opts.editor, bufferPosition = opts.bufferPosition, scopeDescriptor = opts.scopeDescriptor, prefix = opts.prefix;
      jsxTag = this.getTriggerTag(editor, bufferPosition);
      if (jsxTag == null) {
        return;
      }
      suggestions = [];
      if (jsxTag === JSXSTARTTAGEND) {
        startOfJSX = this.getStartOfJSX(editor, bufferPosition);
        jsxRange = new Range(startOfJSX, bufferPosition);
        tagNameStack = this.buildTagStack(editor, jsxRange);
        while ((tagName = tagNameStack.pop()) != null) {
          suggestions.push({
            snippet: "$1</" + tagName + ">",
            type: "tag",
            description: "language-babel tag closer"
          });
        }
      } else if (jsxTag === JSXENDTAGSTART) {
        startOfJSX = this.getStartOfJSX(editor, bufferPosition);
        jsxRange = new Range(startOfJSX, bufferPosition);
        tagNameStack = this.buildTagStack(editor, jsxRange);
        while ((tagName = tagNameStack.pop()) != null) {
          suggestions.push({
            snippet: tagName + ">",
            type: "tag",
            description: "language-babel tag closer"
          });
        }
      } else if (jsxTag === JSXTAG) {
        if (!/^[a-z]/g.exec(prefix)) {
          return;
        }
        htmlElements = filter(COMPLETIONS.htmlElements, prefix, {
          key: "name"
        });
        for (i = 0, len = htmlElements.length; i < len; i++) {
          htmlElement = htmlElements[i];
          if (score(htmlElement.name, prefix) < 0.07) {
            continue;
          }
          suggestions.push({
            snippet: htmlElement.name,
            type: "tag",
            description: "language-babel JSX supported elements",
            descriptionMoreURL: REACTURL
          });
        }
      } else if (jsxTag === JSXATTRIBUTE) {
        tagName = this.getThisTagName(editor, bufferPosition);
        if (tagName == null) {
          return;
        }
        ref2 = COMPLETIONS.htmlElements;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          elementObj = ref2[j];
          if (elementObj.name === tagName) {
            break;
          }
        }
        attributes = elementObj.attributes.concat(COMPLETIONS.globalAttributes);
        attributes = attributes.concat(COMPLETIONS.events);
        filteredAttributes = filter(attributes, prefix, {
          key: "name"
        });
        for (k = 0, len2 = filteredAttributes.length; k < len2; k++) {
          attribute = filteredAttributes[k];
          if (score(attribute.name, prefix) < 0.07) {
            continue;
          }
          suggestions.push({
            snippet: attribute.name,
            type: "attribute",
            rightLabel: "<" + tagName + ">",
            description: "language-babel JSXsupported attributes/events",
            descriptionMoreURL: REACTURL
          });
        }
      } else {
        return;
      }
      return suggestions;
    },
    getThisTagName: function(editor, bufferPosition) {
      var column, match, matches, row, rowText, scopes;
      row = bufferPosition.row;
      column = null;
      while (row >= 0) {
        rowText = editor.lineTextForBufferRow(row);
        if (column == null) {
          rowText = rowText.substr(0, column = bufferPosition.column);
        }
        matches = [];
        while ((match = TAGREGEXP.exec(rowText)) !== null) {
          scopes = editor.scopeDescriptorForBufferPosition([row, match.index + 1]).getScopesArray();
          if (indexOf.call(scopes, "entity.name.tag.open.jsx") >= 0) {
            matches.push(match[1]);
          }
        }
        if (matches.length) {
          return matches.pop();
        } else {
          row--;
        }
      }
    },
    getTriggerTag: function(editor, bufferPosition) {
      var column, scopes;
      column = bufferPosition.column - 1;
      if (column >= 0) {
        scopes = editor.scopeDescriptorForBufferPosition([bufferPosition.row, column]).getScopesArray();
        if (indexOf.call(scopes, "entity.other.attribute-name.jsx") >= 0) {
          return JSXATTRIBUTE;
        }
        if (indexOf.call(scopes, "entity.name.tag.open.jsx") >= 0) {
          return JSXTAG;
        }
        if (indexOf.call(scopes, "JSXStartTagEnd") >= 0) {
          return JSXSTARTTAGEND;
        }
        if (indexOf.call(scopes, "JSXEndTagStart") >= 0) {
          return JSXENDTAGSTART;
        }
      }
    },
    getStartOfJSX: function(editor, bufferPosition) {
      var column, columnLen, row;
      row = bufferPosition.row;
      while (row >= 0) {
        if (indexOf.call(editor.scopeDescriptorForBufferPosition([row, 0]).getScopesArray(), "meta.tag.jsx") < 0) {
          break;
        }
        row--;
      }
      if (row < 0) {
        row = 0;
      }
      columnLen = editor.lineTextForBufferRow(row).length;
      column = 0;
      while (column < columnLen) {
        if (indexOf.call(editor.scopeDescriptorForBufferPosition([row, column]).getScopesArray(), "meta.tag.jsx") >= 0) {
          break;
        }
        column++;
      }
      if (column === columnLen) {
        row++;
        column = 0;
      }
      return new Point(row, column);
    },
    buildTagStack: function(editor, range) {
      var closedtag, line, match, matchColumn, matchPointEnd, matchPointStart, matchRange, row, scopes, tagNameStack;
      tagNameStack = [];
      row = range.start.row;
      while (row <= range.end.row) {
        line = editor.lineTextForBufferRow(row);
        if (row === range.end.row) {
          line = line.substr(0, range.end.column);
        }
        while ((match = JSXREGEXP.exec(line)) !== null) {
          matchColumn = match.index;
          matchPointStart = new Point(row, matchColumn);
          matchPointEnd = new Point(row, matchColumn + match[0].length - 1);
          matchRange = new Range(matchPointStart, matchPointEnd);
          if (range.intersectsWith(matchRange)) {
            scopes = editor.scopeDescriptorForBufferPosition([row, match.index]).getScopesArray();
            if (indexOf.call(scopes, "punctuation.definition.tag.jsx") < 0) {
              continue;
            }
            if (match[1] != null) {
              tagNameStack.push(match[3]);
            } else if (match[2] != null) {
              closedtag = tagNameStack.pop();
              if (closedtag !== match[3]) {
                tagNameStack.push(closedtag);
              }
            } else if (match[4] != null) {
              tagNameStack.pop();
            } else if (match[6] != null) {
              tagNameStack.push("");
            }
          }
        }
        row++;
      }
      return tagNameStack;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi9hdXRvLWNvbXBsZXRlLWpzeC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlJQUFBO0lBQUE7O0VBQUEsTUFBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxpQkFBRCxFQUFROztFQUNSLE9BQWtCLE9BQUEsQ0FBUSxZQUFSLENBQWxCLEVBQUMsb0JBQUQsRUFBUzs7RUFHVCxjQUFBLEdBQWlCOztFQUNqQixjQUFBLEdBQWlCOztFQUNqQixNQUFBLEdBQVM7O0VBQ1QsWUFBQSxHQUFlOztFQUVmLFNBQUEsR0FBWTs7RUFDWixTQUFBLEdBQWE7O0VBQ2IsV0FBQSxHQUFjLE9BQUEsQ0FBUSxtQkFBUjs7RUFDZCxRQUFBLEdBQVc7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxlQUFWO0lBQ0EsaUJBQUEsRUFBbUIsS0FEbkI7SUFFQSxvQkFBQSxFQUFzQixLQUZ0QjtJQUtBLGNBQUEsRUFBZ0IsU0FBQyxJQUFEO0FBQ2QsVUFBQTtNQUFDLG9CQUFELEVBQVMsb0NBQVQsRUFBeUIsc0NBQXpCLEVBQTBDO01BRTFDLE1BQUEsR0FBUyxJQUFDLENBQUEsYUFBRCxDQUFlLE1BQWYsRUFBdUIsY0FBdkI7TUFDVCxJQUFjLGNBQWQ7QUFBQSxlQUFBOztNQUdBLFdBQUEsR0FBYztNQUVkLElBQUcsTUFBQSxLQUFVLGNBQWI7UUFDRSxVQUFBLEdBQWEsSUFBQyxDQUFBLGFBQUQsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCO1FBQ2IsUUFBQSxHQUFXLElBQUksS0FBSixDQUFVLFVBQVYsRUFBc0IsY0FBdEI7UUFDWCxZQUFBLEdBQWUsSUFBQyxDQUFBLGFBQUQsQ0FBZSxNQUFmLEVBQXVCLFFBQXZCO0FBQ2YsZUFBTSxzQ0FBTjtVQUNFLFdBQVcsQ0FB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O1VBQ0UsV0FBQSxHQUFjLEtBQUssQ0FBQztVQUNwQixlQUFBLEdBQWtCLElBQUksS0FBSixDQUFVLEdBQVYsRUFBZSxXQUFmO1VBQ2xCLGFBQUEsR0FBZ0IsSUFBSSxLQUFKLENBQVUsR0FBVixFQUFlLFdBQUEsR0FBYyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBdkIsR0FBZ0MsQ0FBL0M7VUFDaEIsVUFBQSxHQUFhLElBQUksS0FBSixDQUFVLGVBQVYsRUFBMkIsYUFBM0I7VUFDYixJQUFHLEtBQUssQ0FBQyxjQUFOLENBQXFCLFVBQXJCLENBQUg7WUFDRSxNQUFBLEdBQVMsTUFBTSxDQUFDLGdDQUFQLENBQXdDLENBQUMsR0FBRCxFQUFNLEtBQUssQ0FBQyxLQUFaLENBQXhDLENBQTJELENBQUMsY0FBNUQsQ0FBQTtZQUNULElBQVksYUFBd0MsTUFBeEMsRUFBQSxnQ0FBQSxLQUFaO0FBQUEsdUJBQUE7O1lBRUEsSUFBRyxnQkFBSDtjQUNFLFlBQVksQ0FBQyxJQUFiLENBQWtCLEtBQU0sQ0FBQSxDQUFBLENBQXhCLEVBREY7YUFBQSxNQUVLLElBQUcsZ0JBQUg7Y0FDSCxTQUFBLEdBQVksWUFBWSxDQUFDLEdBQWIsQ0FBQTtjQUNaLElBQUcsU0FBQSxLQUFlLEtBQU0sQ0FBQSxDQUFBLENBQXhCO2dCQUNFLFlBQVksQ0FBQyxJQUFiLENBQWtCLFNBQWxCLEVBREY7ZUFGRzthQUFBLE1BSUEsSUFBRyxnQkFBSDtjQUNILFlBQVksQ0FBQyxHQUFiLENBQUEsRUFERzthQUFBLE1BRUEsSUFBRyxnQkFBSDtjQUNILFlBQVksQ0FBQyxJQUFiLENBQWtCLEVBQWxCLEVBREc7YUFaUDs7UUFMRjtRQW9CQSxHQUFBO01BeEJGO2FBeUJBO0lBNUJhLENBckhmOztBQWZGIiwic291cmNlc0NvbnRlbnQiOlsie1JhbmdlLCBQb2ludH0gPSByZXF1aXJlIFwiYXRvbVwiXG57ZmlsdGVyLCBzY29yZX0gPSByZXF1aXJlIFwiZnV6emFsZHJpblwiXG5cbiMgdGFncyB3ZSBhcmUgaW50ZXJlc3RlZCBpbiBhcmUgbWFya2VkIGJ5IHRoZSBncmFtbWFyXG5KU1hTVEFSVFRBR0VORCA9IDBcbkpTWEVORFRBR1NUQVJUID0gMVxuSlNYVEFHID0gMlxuSlNYQVRUUklCVVRFID0gM1xuIyByZWdleCB0byBzZWFyY2ggZm9yIHRhZyBvcGVuL2Nsb3NlIHRhZyBhbmQgY2xvc2UgdGFnXG5KU1hSRUdFWFAgPSAvKD86KDwpfCg8XFwvKSkoWyRfQS1aYS16XSg/OlskLl86XFwtYS16QS1aMC05XSkqKXwoPzooXFwvPil8KD4pKXwoPFxccyo+KS9nXG5UQUdSRUdFWFAgPSAgLzwoWyRfYS16QS1aXVskLl86XFwtYS16QS1aMC05XSopKCR8XFxzfFxcLz58PikvZ1xuQ09NUExFVElPTlMgPSByZXF1aXJlIFwiLi9jb21wbGV0aW9ucy1qc3hcIlxuUkVBQ1RVUkwgPSBcImh0dHA6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90YWdzLWFuZC1hdHRyaWJ1dGVzLmh0bWxcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHNlbGVjdG9yOiBcIi5tZXRhLnRhZy5qc3hcIlxuICBpbmNsdXNpb25Qcmlvcml0eTogMTAwMDBcbiAgZXhjbHVkZUxvd2VyUHJpb3JpdHk6IGZhbHNlXG5cblxuICBnZXRTdWdnZXN0aW9uczogKG9wdHMpIC0+XG4gICAge2VkaXRvciwgYnVmZmVyUG9zaXRpb24sIHNjb3BlRGVzY3JpcHRvciwgcHJlZml4fSA9IG9wdHNcblxuICAgIGpzeFRhZyA9IEBnZXRUcmlnZ2VyVGFnIGVkaXRvciwgYnVmZmVyUG9zaXRpb25cbiAgICByZXR1cm4gaWYgbm90IGpzeFRhZz9cblxuICAgICMgYnVpbGQgYXV0b2NvbXBsZXRlIGxpc3RcbiAgICBzdWdnZXN0aW9ucyA9IFtdXG5cbiAgICBpZiBqc3hUYWcgaXMgSlNYU1RBUlRUQUdFTkRcbiAgICAgIHN0YXJ0T2ZKU1ggPSBAZ2V0U3RhcnRPZkpTWCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uXG4gICAgICBqc3hSYW5nZSA9IG5ldyBSYW5nZShzdGFydE9mSlNYLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIHRhZ05hbWVTdGFjayA9IEBidWlsZFRhZ1N0YWNrKGVkaXRvciwganN4UmFuZ2UpXG4gICAgICB3aGlsZSAoIHRhZ05hbWUgPSB0YWdOYW1lU3RhY2sucG9wKCkpP1xuICAgICAgICBzdWdnZXN0aW9ucy5wdXNoXG4gICAgICAgICAgc25pcHBldDogXCIkMTwvI3t0YWdOYW1lfT5cIlxuICAgICAgICAgIHR5cGU6IFwidGFnXCJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJsYW5ndWFnZS1iYWJlbCB0YWcgY2xvc2VyXCJcblxuICAgIGVsc2UgaWYgIGpzeFRhZyBpcyBKU1hFTkRUQUdTVEFSVFxuICAgICAgc3RhcnRPZkpTWCA9IEBnZXRTdGFydE9mSlNYIGVkaXRvciwgYnVmZmVyUG9zaXRpb25cbiAgICAgIGpzeFJhbmdlID0gbmV3IFJhbmdlKHN0YXJ0T2ZKU1gsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgdGFnTmFtZVN0YWNrID0gQGJ1aWxkVGFnU3RhY2soZWRpdG9yLCBqc3hSYW5nZSlcbiAgICAgIHdoaWxlICggdGFnTmFtZSA9IHRhZ05hbWVTdGFjay5wb3AoKSk/XG4gICAgICAgIHN1Z2dlc3Rpb25zLnB1c2hcbiAgICAgICAgICBzbmlwcGV0OiBcIiN7dGFnTmFtZX0+XCJcbiAgICAgICAgICB0eXBlOiBcInRhZ1wiXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwibGFuZ3VhZ2UtYmFiZWwgdGFnIGNsb3NlclwiXG5cbiAgICBlbHNlIGlmIGpzeFRhZyBpcyBKU1hUQUdcbiAgICAgIHJldHVybiBpZiBub3QgL15bYS16XS9nLmV4ZWMocHJlZml4KVxuICAgICAgaHRtbEVsZW1lbnRzID0gZmlsdGVyKENPTVBMRVRJT05TLmh0bWxFbGVtZW50cywgcHJlZml4LCB7a2V5OiBcIm5hbWVcIn0pXG4gICAgICBmb3IgaHRtbEVsZW1lbnQgaW4gaHRtbEVsZW1lbnRzXG4gICAgICAgIGlmIHNjb3JlKGh0bWxFbGVtZW50Lm5hbWUsIHByZWZpeCkgPCAwLjA3IHRoZW4gY29udGludWVcbiAgICAgICAgc3VnZ2VzdGlvbnMucHVzaFxuICAgICAgICAgIHNuaXBwZXQ6IGh0bWxFbGVtZW50Lm5hbWVcbiAgICAgICAgICB0eXBlOiBcInRhZ1wiXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwibGFuZ3VhZ2UtYmFiZWwgSlNYIHN1cHBvcnRlZCBlbGVtZW50c1wiXG4gICAgICAgICAgZGVzY3JpcHRpb25Nb3JlVVJMOiBSRUFDVFVSTFxuXG4gICAgZWxzZSBpZiBqc3hUYWcgaXMgSlNYQVRUUklCVVRFXG4gICAgICB0YWdOYW1lID0gQGdldFRoaXNUYWdOYW1lIGVkaXRvciwgYnVmZmVyUG9zaXRpb25cbiAgICAgIHJldHVybiBpZiBub3QgdGFnTmFtZT9cbiAgICAgIGZvciBlbGVtZW50T2JqIGluIENPTVBMRVRJT05TLmh0bWxFbGVtZW50c1xuICAgICAgICBpZiBlbGVtZW50T2JqLm5hbWUgaXMgdGFnTmFtZSB0aGVuIGJyZWFrXG4gICAgICBhdHRyaWJ1dGVzID0gZWxlbWVudE9iai5hdHRyaWJ1dGVzLmNvbmNhdCBDT01QTEVUSU9OUy5nbG9iYWxBdHRyaWJ1dGVzXG4gICAgICBhdHRyaWJ1dGVzID0gYXR0cmlidXRlcy5jb25jYXQgQ09NUExFVElPTlMuZXZlbnRzXG4gICAgICBmaWx0ZXJlZEF0dHJpYnV0ZXMgPSBmaWx0ZXIoYXR0cmlidXRlcywgcHJlZml4LCB7a2V5OiBcIm5hbWVcIn0pXG4gICAgICBmb3IgYXR0cmlidXRlIGluIGZpbHRlcmVkQXR0cmlidXRlc1xuICAgICAgICBpZiBzY29yZShhdHRyaWJ1dGUubmFtZSwgcHJlZml4KSA8IDAuMDcgdGhlbiBjb250aW51ZVxuICAgICAgICBzdWdnZXN0aW9ucy5wdXNoXG4gICAgICAgICAgc25pcHBldDogYXR0cmlidXRlLm5hbWVcbiAgICAgICAgICB0eXBlOiBcImF0dHJpYnV0ZVwiXG4gICAgICAgICAgcmlnaHRMYWJlbDogXCI8I3t0YWdOYW1lfT5cIlxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBcImxhbmd1YWdlLWJhYmVsIEpTWHN1cHBvcnRlZCBhdHRyaWJ1dGVzL2V2ZW50c1wiXG4gICAgICAgICAgZGVzY3JpcHRpb25Nb3JlVVJMOiBSRUFDVFVSTFxuXG4gICAgZWxzZSByZXR1cm5cbiAgICBzdWdnZXN0aW9uc1xuXG4gICMgZ2V0IHRhZ25hbWUgZm9yIHRoaXMgYXR0cmlidXRlXG4gIGdldFRoaXNUYWdOYW1lOiAoIGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgcm93ID0gYnVmZmVyUG9zaXRpb24ucm93XG4gICAgY29sdW1uID0gbnVsbFxuICAgIHdoaWxlIHJvdyA+PSAwXG4gICAgICByb3dUZXh0ID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdylcbiAgICAgIGlmIG5vdCBjb2x1bW4/XG4gICAgICAgIHJvd1RleHQgPSByb3dUZXh0LnN1YnN0ciAwLCBjb2x1bW4gPSBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICAgIG1hdGNoZXMgPSBbXVxuICAgICAgd2hpbGUgKCggbWF0Y2ggPSBUQUdSRUdFWFAuZXhlYyhyb3dUZXh0KSkgaXNudCBudWxsIClcbiAgICAgICAgIyBzYXZlIHRoaXMgbWF0Y2ggaWYgaXQgYSB2YWxpZCB0YWdcbiAgICAgICAgc2NvcGVzID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFtyb3csIG1hdGNoLmluZGV4KzFdKS5nZXRTY29wZXNBcnJheSgpXG4gICAgICAgIGlmIFwiZW50aXR5Lm5hbWUudGFnLm9wZW4uanN4XCIgaW4gc2NvcGVzIHRoZW4gbWF0Y2hlcy5wdXNoIG1hdGNoWzFdXG4gICAgICAjIHJldHVybiB0aGUgdGFnIHRoYXQgaXMgdGhlIGxhc3Qgb25lIGZvdW5kXG4gICAgICBpZiBtYXRjaGVzLmxlbmd0aFxuICAgICAgICByZXR1cm4gbWF0Y2hlcy5wb3AoKVxuICAgICAgZWxzZSByb3ctLVxuXG5cbiAgZ2V0VHJpZ2dlclRhZzogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgIyBKU1ggdGFnIHNjb3BlcyB3ZSBhcmUgaW50ZXJlc3RlZCBpbiBtYXkgYWxyZWFkeSBjbG9zZWQgb25jZSB0eXBlZFxuICAgICMgc28gd2UgaGF2ZSB0byBiYWNrdHJhY2sgYnkgb25lIGNoYXIgdG8gc2VlIGlmIHRoZXkgd2VyZSB0eXBlZFxuICAgIGNvbHVtbiA9IGJ1ZmZlclBvc2l0aW9uLmNvbHVtbi0xXG4gICAgaWYgY29sdW1uID49IDBcbiAgICAgIHNjb3BlcyA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbYnVmZmVyUG9zaXRpb24ucm93LCBjb2x1bW5dKS5nZXRTY29wZXNBcnJheSgpXG4gICAgICBpZiBcImVudGl0eS5vdGhlci5hdHRyaWJ1dGUtbmFtZS5qc3hcIiBpbiBzY29wZXMgdGhlbiByZXR1cm4gSlNYQVRUUklCVVRFXG4gICAgICBpZiBcImVudGl0eS5uYW1lLnRhZy5vcGVuLmpzeFwiIGluIHNjb3BlcyB0aGVuIHJldHVybiBKU1hUQUdcbiAgICAgIGlmIFwiSlNYU3RhcnRUYWdFbmRcIiBpbiBzY29wZXMgdGhlbiByZXR1cm4gSlNYU1RBUlRUQUdFTkRcbiAgICAgIGlmIFwiSlNYRW5kVGFnU3RhcnRcIiBpbiBzY29wZXMgdGhlbiByZXR1cm4gSlNYRU5EVEFHU1RBUlRcblxuXG4gICMgZmluZCBiZWdnaW5pbmcgb2YgSlNYIGluIGJ1ZmZlciBhbmQgcmV0dXJuIFBvaW50XG4gIGdldFN0YXJ0T2ZKU1g6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIHJvdyA9IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICMgZmluZCBwcmV2aW91cyBzdGFydCBvZiByb3cgdGhhdCBoYXMgbm8ganN4IHRhZ1xuICAgIHdoaWxlIHJvdyA+PSAwXG4gICAgICBicmVhayBpZiBcIm1ldGEudGFnLmpzeFwiIG5vdCBpbiBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oW3JvdywgMF0pLmdldFNjb3Blc0FycmF5KClcbiAgICAgIHJvdy0tXG4gICAgaWYgcm93IDwgMCB0aGVuIHJvdyA9IDBcbiAgICAjIG1heWJlIGpzeCBhcHBhZWFycyBsYXRlciBpbiByb3dcbiAgICBjb2x1bW5MZW4gPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93KS5sZW5ndGhcbiAgICBjb2x1bW4gPSAwXG4gICAgd2hpbGUgY29sdW1uIDwgY29sdW1uTGVuXG4gICAgICBicmVhayBpZiBcIm1ldGEudGFnLmpzeFwiIGluIGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbcm93LCBjb2x1bW5dKS5nZXRTY29wZXNBcnJheSgpXG4gICAgICBjb2x1bW4rK1xuICAgICMgYWRqdXN0IHJvdyBjb2x1bW4gaWYganN4IG5vdCBpbiB0aGlzIHJvdyBhdCBhbGxcbiAgICBpZiBjb2x1bW4gaXMgY29sdW1uTGVuXG4gICAgICByb3crK1xuICAgICAgY29sdW1uID0gMFxuICAgIG5ldyBQb2ludChyb3csIGNvbHVtbilcblxuICAjIGJ1aWxkIHN0YWNrIG9mIHRhZ25hbWVzIG9wZW5lZCBidXQgbm90IGNsb3NlZCBpbiBSYW5nZVxuICBidWlsZFRhZ1N0YWNrOiAoZWRpdG9yLCByYW5nZSkgLT5cbiAgICB0YWdOYW1lU3RhY2sgPSBbXVxuICAgIHJvdyA9IHJhbmdlLnN0YXJ0LnJvd1xuICAgIHdoaWxlIHJvdyA8PSByYW5nZS5lbmQucm93XG4gICAgICBsaW5lID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93IHJvd1xuICAgICAgaWYgcm93IGlzIHJhbmdlLmVuZC5yb3dcbiAgICAgICAgbGluZSA9IGxpbmUuc3Vic3RyIDAsIHJhbmdlLmVuZC5jb2x1bW5cbiAgICAgIHdoaWxlICgoIG1hdGNoID0gSlNYUkVHRVhQLmV4ZWMobGluZSkpIGlzbnQgbnVsbCApXG4gICAgICAgIG1hdGNoQ29sdW1uID0gbWF0Y2guaW5kZXhcbiAgICAgICAgbWF0Y2hQb2ludFN0YXJ0ID0gbmV3IFBvaW50KHJvdywgbWF0Y2hDb2x1bW4pXG4gICAgICAgIG1hdGNoUG9pbnRFbmQgPSBuZXcgUG9pbnQocm93LCBtYXRjaENvbHVtbiArIG1hdGNoWzBdLmxlbmd0aCAtIDEpXG4gICAgICAgIG1hdGNoUmFuZ2UgPSBuZXcgUmFuZ2UobWF0Y2hQb2ludFN0YXJ0LCBtYXRjaFBvaW50RW5kKVxuICAgICAgICBpZiByYW5nZS5pbnRlcnNlY3RzV2l0aChtYXRjaFJhbmdlKVxuICAgICAgICAgIHNjb3BlcyA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbcm93LCBtYXRjaC5pbmRleF0pLmdldFNjb3Blc0FycmF5KClcbiAgICAgICAgICBjb250aW51ZSBpZiBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmpzeFwiIG5vdCBpbiBzY29wZXNcbiAgICAgICAgICAjY2hlY2sgY2FwdHVyZSBncm91cHNcbiAgICAgICAgICBpZiBtYXRjaFsxXT8gIyB0YWdzIHN0YXJ0aW5nIDx0YWdcbiAgICAgICAgICAgIHRhZ05hbWVTdGFjay5wdXNoIG1hdGNoWzNdXG4gICAgICAgICAgZWxzZSBpZiBtYXRjaFsyXT8gIyB0YWdzIGVuZGluZyA8L3RhZ1xuICAgICAgICAgICAgY2xvc2VkdGFnID0gdGFnTmFtZVN0YWNrLnBvcCgpXG4gICAgICAgICAgICBpZiBjbG9zZWR0YWcgaXNudCBtYXRjaFszXVxuICAgICAgICAgICAgICB0YWdOYW1lU3RhY2sucHVzaCBjbG9zZWR0YWdcbiAgICAgICAgICBlbHNlIGlmIG1hdGNoWzRdPyAjIHRhZ3MgYW5kIGZyYWdtZW50cyBlbmRpbmcgLz5cbiAgICAgICAgICAgIHRhZ05hbWVTdGFjay5wb3AoKVxuICAgICAgICAgIGVsc2UgaWYgbWF0Y2hbNl0/ICMgdGFnIGZyYWdtZW50IHN0YXRpbmcgPD5cbiAgICAgICAgICAgIHRhZ05hbWVTdGFjay5wdXNoIFwiXCJcblxuICAgICAgcm93KytcbiAgICB0YWdOYW1lU3RhY2tcbiJdfQ==
