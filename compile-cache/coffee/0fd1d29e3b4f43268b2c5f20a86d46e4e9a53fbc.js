(function() {
  var CompositeDisposable, Range, SIMULATE_CURSOR_LENGTH, SequentialNumber, SequentialNumberView, ref;

  ref = require("atom"), CompositeDisposable = ref.CompositeDisposable, Range = ref.Range;

  SequentialNumberView = require("./sequential-number-view");

  SIMULATE_CURSOR_LENGTH = 3;

  module.exports = SequentialNumber = {
    activate: function() {
      this.view = new SequentialNumberView;
      this.view.on("blur", (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      this.view.on("change", (function(_this) {
        return function(value) {
          return _this.simulate(value);
        };
      })(this));
      this.view.on("done", (function(_this) {
        return function(value) {
          return _this.exec(value);
        };
      })(this));
      this.previousFocused;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        "sequential-number:open": (function(_this) {
          return function() {
            return _this.open();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "sequential-number:close": (function(_this) {
          return function() {
            return _this.close();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.view.destroy();
    },
    serialize: function() {},
    open: function() {
      if (!this.view.isVisible()) {
        return this.view.show();
      }
    },
    close: function() {
      this.view.hide();
      return atom.views.getView(atom.workspace).focus();
    },
    simulate: function(value) {
      var i, ref1, result, results, simulateList, text;
      result = this.parseValue(value);
      text = "";
      if (result !== null) {
        simulateList = (function() {
          results = [];
          for (var i = 0, ref1 = SIMULATE_CURSOR_LENGTH - 1; 0 <= ref1 ? i <= ref1 : i >= ref1; 0 <= ref1 ? i++ : i--){ results.push(i); }
          return results;
        }).apply(this).map((function(_this) {
          return function(index) {
            return _this.calculateValue(index, result);
          };
        })(this));
        simulateList.push("...");
        text = simulateList.join(", ");
      }
      return this.view.setSimulatorText(text);
    },
    exec: function(value) {
      var editor, result;
      editor = this.getEditor();
      result = this.parseValue(value);
      if (result !== null) {
        editor.transact((function(_this) {
          return function() {
            var cursors, i, index, length, range, ref1, results;
            length = editor.cursors.length;
            results = [];
            for (index = i = 0, ref1 = length; 0 <= ref1 ? i < ref1 : i > ref1; index = 0 <= ref1 ? ++i : --i) {
              cursors = editor.cursors.slice();
              cursors = cursors.map(function(cursor) {
                return cursor.selection.getBufferRange();
              });
              cursors = cursors.sort(function(a, b) {
                return a.start.row - b.start.row || a.start.column - b.start.column;
              });
              range = cursors[index];
              results.push(editor.setTextInBufferRange(new Range(range.start, range.end), _this.calculateValue(index, result)));
            }
            return results;
          };
        })(this));
      }
      return this.close();
    },
    getEditor: function() {
      return atom.workspace.getActivePane().activeItem;
    },
    parseValue: function(input) {
      var _digit, digit, isAlphaRadix, matches, operator, radix, start, step;
      matches = ("" + input).match(/^([+\-]?[\da-zA-Z]+(?:\.\d+)?)\s*([+\-]|(?:\+\+|\-\-))?\s*(\d+)?\s*(?:\:\s*(\d+))?\s*(?:\:\s*([\daA]+))?$/);
      if (matches === null) {
        return null;
      }
      radix = matches[5];
      radix = radix !== void 0 ? radix : 10;
      radix = /\d+/.test(radix) ? parseInt(radix, 10) : radix;
      isAlphaRadix = /[aA]/.test(radix);
      start = matches[1];
      if (isAlphaRadix && /\d+/.test(start)) {
        return null;
      }
      start = isAlphaRadix ? start : parseInt(start, radix);
      operator = matches[2] || "+";
      step = parseInt(matches[3], 10);
      step = isNaN(matches[3]) ? 1 : step;
      _digit = parseInt(matches[4], 10);
      digit = ("" + start) === matches[1] ? 0 : matches[1].length;
      digit = /^[+\-]/.test(matches[1]) ? Math.max(digit - 1, 0) : digit;
      digit = isNaN(_digit) ? digit : _digit;
      return {
        start: start,
        digit: digit,
        operator: operator,
        step: step,
        radix: radix,
        input: input
      };
    },
    calculateValue: function(index, args) {
      if (/[aA]/.test(args.radix)) {
        return this.calculateAlphaValue(index, args);
      } else {
        return this.calculateNumberValue(index, args);
      }
    },
    calculateNumberValue: function(index, arg) {
      var _start, digit, firstAlpha, input, operator, radix, start, step, value;
      start = arg.start, digit = arg.digit, operator = arg.operator, step = arg.step, radix = arg.radix, input = arg.input;
      _start = parseInt(start, 10);
      switch (operator) {
        case "++":
          value = _start + index;
          break;
        case "--":
          value = _start - index;
          break;
        case "+":
          value = _start + (index * step);
          break;
        case "-":
          value = _start - (index * step);
          break;
        default:
          return "";
      }
      if (isNaN(value)) {
        return "";
      }
      value = this.zeroPadding(value, digit, radix);
      firstAlpha = input.match(/([a-fA-F])/);
      if (firstAlpha) {
        value = value[firstAlpha[1] === firstAlpha[1].toLowerCase() ? "toLowerCase" : "toUpperCase"]();
      }
      return value;
    },
    calculateAlphaValue: function(index, arg) {
      var count, digit, input, operator, radix, start, step, value;
      start = arg.start, digit = arg.digit, operator = arg.operator, step = arg.step, radix = arg.radix, input = arg.input;
      switch (operator) {
        case "++":
          count = (index - 1) + step;
          break;
        case "--":
          count = (index - 1) - step;
          break;
        case "+":
          count = index * step;
          break;
        case "-":
          count = index * step * -1;
      }
      value = this.alphaSequence(start.toLowerCase(), count);
      value = this.leftPadding(value, digit, "a");
      if (/[A-Z]/.test(start) || /[A-Z]/.test(radix)) {
        value = value.toUpperCase();
      }
      return value;
    },
    alphaSequence: function(str, count) {
      var alphabet, index, last, n, next, s;
      if (count === 0) {
        return str;
      }
      alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      last = str.slice(-1);
      index = alphabet.indexOf(last);
      n = Math.floor((index + count) / alphabet.length);
      next = alphabet[(index + count) % alphabet.length];
      if (!next) {
        return "";
      }
      s = "" + (str.slice(0, str.length - 1)) + next;
      if (n > 0) {
        if (s.length === 1 && index === alphabet.length - 1) {
          s = "a" + s;
        } else {
          s = "" + (this.alphaSequence(s.slice(0, s.length - 1), n)) + next;
        }
      }
      return s;
    },
    leftPadding: function(str, digit, padString) {
      var _digit;
      _digit = Math.max(str.length, digit);
      return (Array(_digit).join(padString) + str).slice(_digit * -1);
    },
    zeroPadding: function(number, digit, radix) {
      var num, numAbs, positive;
      if (digit == null) {
        digit = 0;
      }
      if (radix == null) {
        radix = 10;
      }
      num = number.toString(radix);
      numAbs = num.replace("-", "");
      positive = num.indexOf("-") < 0;
      return (positive ? "" : "-") + this.leftPadding(numAbs, digit, "0");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3NlcXVlbnRpYWwtbnVtYmVyL2xpYi9zZXF1ZW50aWFsLW51bWJlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQStCLE9BQUEsQ0FBUSxNQUFSLENBQS9CLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3RCLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSwwQkFBUjs7RUFFdkIsc0JBQUEsR0FBeUI7O0VBRXpCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGdCQUFBLEdBQ2Y7SUFBQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSTtNQUNaLElBQUMsQ0FBQSxJQUFJLENBQUMsRUFBTixDQUFTLE1BQVQsRUFBaUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxLQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakI7TUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEVBQU4sQ0FBUyxRQUFULEVBQW1CLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUFXLEtBQUMsQ0FBQSxRQUFELENBQVUsS0FBVjtRQUFYO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQjtNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsRUFBTixDQUFTLE1BQVQsRUFBaUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7aUJBQVcsS0FBQyxDQUFBLElBQUQsQ0FBTSxLQUFOO1FBQVg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCO01BRUEsSUFBQyxDQUFBO01BRUQsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENB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RFY7U0FBQSxNQUFBO1VBR0UsQ0FBQSxHQUFJLEVBQUEsR0FBRSxDQUFDLElBQUMsQ0FBQSxhQUFELENBQWUsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxDQUFSLEVBQVcsQ0FBQyxDQUFDLE1BQUYsR0FBVyxDQUF0QixDQUFmLEVBQXlDLENBQXpDLENBQUQsQ0FBRixHQUFpRCxLQUh2RDtTQURGOztBQU1BLGFBQU87SUFuQk0sQ0E3SGY7SUFrSkEsV0FBQSxFQUFhLFNBQUMsR0FBRCxFQUFNLEtBQU4sRUFBYSxTQUFiO0FBQ1gsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQUcsQ0FBQyxNQUFiLEVBQXFCLEtBQXJCO0FBQ1QsYUFBTyxDQUFDLEtBQUEsQ0FBTSxNQUFOLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQW5CLENBQUEsR0FBZ0MsR0FBakMsQ0FBcUMsQ0FBQyxLQUF0QyxDQUE0QyxNQUFBLEdBQVMsQ0FBQyxDQUF0RDtJQUZJLENBbEpiO0lBc0pBLFdBQUEsRUFBYSxTQUFDLE1BQUQsRUFBUyxLQUFULEVBQW9CLEtBQXBCO0FBQ1gsVUFBQTs7UUFEb0IsUUFBUTs7O1FBQUcsUUFBUTs7TUFDdkMsR0FBQSxHQUFNLE1BQU0sQ0FBQyxRQUFQLENBQWdCLEtBQWhCO01BQ04sTUFBQSxHQUFTLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FBWixFQUFpQixFQUFqQjtNQUNULFFBQUEsR0FBVyxHQUFHLENBQUMsT0FBSixDQUFZLEdBQVosQ0FBQSxHQUFtQjtBQUM5QixhQUFPLENBQUksUUFBSCxHQUFpQixFQUFqQixHQUF5QixHQUExQixDQUFBLEdBQWlDLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixFQUFxQixLQUFyQixFQUE0QixHQUE1QjtJQUo3QixDQXRKYjs7QUFORiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlLCBSYW5nZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5TZXF1ZW50aWFsTnVtYmVyVmlldyA9IHJlcXVpcmUgXCIuL3NlcXVlbnRpYWwtbnVtYmVyLXZpZXdcIlxuXG5TSU1VTEFURV9DVVJTT1JfTEVOR1RIID0gM1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcXVlbnRpYWxOdW1iZXIgPVxuICBhY3RpdmF0ZTogKCkgLT5cbiAgICBAdmlldyA9IG5ldyBTZXF1ZW50aWFsTnVtYmVyVmlld1xuICAgIEB2aWV3Lm9uIFwiYmx1clwiLCA9PiBAY2xvc2UoKVxuICAgIEB2aWV3Lm9uIFwiY2hhbmdlXCIsICh2YWx1ZSkgPT4gQHNpbXVsYXRlIHZhbHVlXG4gICAgQHZpZXcub24gXCJkb25lXCIsICh2YWx1ZSkgPT4gQGV4ZWMgdmFsdWVcblxuICAgIEBwcmV2aW91c0ZvY3VzZWRcblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcInNlcXVlbnRpYWwtbnVtYmVyOm9wZW5cIjogPT4gQG9wZW4oKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20td29ya3NwYWNlXCIsIFwic2VxdWVudGlhbC1udW1iZXI6Y2xvc2VcIjogPT4gQGNsb3NlKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIEB2aWV3LmRlc3Ryb3koKVxuXG4gIHNlcmlhbGl6ZTogLT5cblxuICBvcGVuOiAtPlxuICAgIGlmICFAdmlldy5pc1Zpc2libGUoKVxuICAgICAgQHZpZXcuc2hvdygpXG5cbiAgY2xvc2U6IC0+XG4gICAgQHZpZXcuaGlkZSgpXG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKS5mb2N1cygpXG5cbiAgc2ltdWxhdGU6ICh2YWx1ZSkgLT5cbiAgICByZXN1bHQgPSBAcGFyc2VWYWx1ZSB2YWx1ZVxuICAgIHRleHQgPSBcIlwiXG5cbiAgICBpZiByZXN1bHQgIT0gbnVsbFxuICAgICAgc2ltdWxhdGVMaXN0ID0gWzAuLlNJTVVMQVRFX0NVUlNPUl9MRU5HVEggLSAxXS5tYXAgKGluZGV4KSA9PlxuICAgICAgICBAY2FsY3VsYXRlVmFsdWUgaW5kZXgsIHJlc3VsdFxuICAgICAgc2ltdWxhdGVMaXN0LnB1c2ggXCIuLi5cIlxuICAgICAgdGV4dCA9IHNpbXVsYXRlTGlzdC5qb2luIFwiLCBcIlxuXG4gICAgQHZpZXcuc2V0U2ltdWxhdG9yVGV4dCB0ZXh0XG5cbiAgZXhlYzogKHZhbHVlKSAtPlxuICAgIGVkaXRvciA9IEBnZXRFZGl0b3IoKVxuICAgIHJlc3VsdCA9IEBwYXJzZVZhbHVlIHZhbHVlXG5cbiAgICBpZiByZXN1bHQgIT0gbnVsbFxuICAgICAgZWRpdG9yLnRyYW5zYWN0KCA9PlxuICAgICAgICBsZW5ndGggPSBlZGl0b3IuY3Vyc29ycy5sZW5ndGhcbiAgICAgICAgZm9yIGluZGV4IGluIFswLi4ubGVuZ3RoXVxuICAgICAgICAgIGN1cnNvcnMgPSBlZGl0b3IuY3Vyc29ycy5zbGljZSgpXG4gICAgICAgICAgY3Vyc29ycyA9IGN1cnNvcnMubWFwIChjdXJzb3IpIC0+IGN1cnNvci5zZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgICAgIGN1cnNvcnMgPSBjdXJzb3JzLnNvcnQgKGEsIGIpIC0+IGEuc3RhcnQucm93IC0gYi5zdGFydC5yb3cgfHwgYS5zdGFydC5jb2x1bW4gLSBiLnN0YXJ0LmNvbHVtblxuICAgICAgICAgIHJhbmdlID0gY3Vyc29yc1tpbmRleF1cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UgbmV3IFJhbmdlKHJhbmdlLnN0YXJ0LCByYW5nZS5lbmQpLCBAY2FsY3VsYXRlVmFsdWUgaW5kZXgsIHJlc3VsdFxuICAgICAgKVxuXG4gICAgQGNsb3NlKClcblxuICBnZXRFZGl0b3I6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2ZUl0ZW1cblxuICBwYXJzZVZhbHVlOiAoaW5wdXQpIC0+XG4gICAgbWF0Y2hlcyA9IFwiI3tpbnB1dH1cIi5tYXRjaCAvXihbK1xcLV0/W1xcZGEtekEtWl0rKD86XFwuXFxkKyk/KVxccyooWytcXC1dfCg/OlxcK1xcK3xcXC1cXC0pKT9cXHMqKFxcZCspP1xccyooPzpcXDpcXHMqKFxcZCspKT9cXHMqKD86XFw6XFxzKihbXFxkYUFdKykpPyQvXG4gICAgcmV0dXJuIG51bGwgaWYgbWF0Y2hlcyA9PSBudWxsXG5cbiAgICByYWRpeCA9IG1hdGNoZXNbNV1cbiAgICByYWRpeCA9IGlmIHJhZGl4ICE9IHVuZGVmaW5lZCB0aGVuIHJhZGl4IGVsc2UgMTBcbiAgICByYWRpeCA9IGlmIC9cXGQrLy50ZXN0IHJhZGl4IHRoZW4gcGFyc2VJbnQgcmFkaXgsIDEwIGVsc2UgcmFkaXhcbiAgICBpc0FscGhhUmFkaXggPSAvW2FBXS8udGVzdCByYWRpeFxuXG4gICAgc3RhcnQgPSBtYXRjaGVzWzFdXG4gICAgcmV0dXJuIG51bGwgaWYgaXNBbHBoYVJhZGl4IGFuZCAvXFxkKy8udGVzdChzdGFydClcblxuICAgIHN0YXJ0ID0gaWYgaXNBbHBoYVJhZGl4IHRoZW4gc3RhcnQgZWxzZSBwYXJzZUludChzdGFydCwgcmFkaXgpXG5cbiAgICBvcGVyYXRvciA9IG1hdGNoZXNbMl0gfHwgXCIrXCJcbiAgICBzdGVwID0gcGFyc2VJbnQgbWF0Y2hlc1szXSwgMTBcbiAgICBzdGVwID0gaWYgaXNOYU4gbWF0Y2hlc1szXSB0aGVuIDEgZWxzZSBzdGVwXG5cbiAgICBfZGlnaXQgPSBwYXJzZUludCBtYXRjaGVzWzRdLCAxMFxuICAgIGRpZ2l0ID0gaWYgXCIje3N0YXJ0fVwiID09IG1hdGNoZXNbMV0gdGhlbiAwIGVsc2UgbWF0Y2hlc1sxXS5sZW5ndGhcbiAgICBkaWdpdCA9IGlmIC9eWytcXC1dLy50ZXN0IG1hdGNoZXNbMV0gdGhlbiBNYXRoLm1heChkaWdpdCAtIDEsIDApIGVsc2UgZGlnaXRcbiAgICBkaWdpdCA9IGlmIGlzTmFOIF9kaWdpdCB0aGVuIGRpZ2l0IGVsc2UgX2RpZ2l0XG5cbiAgICByZXR1cm4ge3N0YXJ0LCBkaWdpdCwgb3BlcmF0b3IsIHN0ZXAsIHJhZGl4LCBpbnB1dH1cblxuICBjYWxjdWxhdGVWYWx1ZTogKGluZGV4LCBhcmdzKSAtPlxuICAgIGlmIC9bYUFdLy50ZXN0IGFyZ3MucmFkaXhcbiAgICAgIHJldHVybiBAY2FsY3VsYXRlQWxwaGFWYWx1ZSBpbmRleCwgYXJnc1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBAY2FsY3VsYXRlTnVtYmVyVmFsdWUgaW5kZXgsIGFyZ3NcblxuICBjYWxjdWxhdGVOdW1iZXJWYWx1ZTogKGluZGV4LCB7c3RhcnQsIGRpZ2l0LCBvcGVyYXRvciwgc3RlcCwgcmFkaXgsIGlucHV0fSkgLT5cbiAgICBfc3RhcnQgPSBwYXJzZUludCBzdGFydCwgMTBcblxuICAgIHN3aXRjaCBvcGVyYXRvclxuICAgICAgd2hlbiBcIisrXCIgdGhlbiB2YWx1ZSA9IF9zdGFydCArIGluZGV4XG4gICAgICB3aGVuIFwiLS1cIiB0aGVuIHZhbHVlID0gX3N0YXJ0IC0gaW5kZXhcbiAgICAgIHdoZW4gXCIrXCIgdGhlbiB2YWx1ZSA9IF9zdGFydCArIChpbmRleCAqIHN0ZXApXG4gICAgICB3aGVuIFwiLVwiIHRoZW4gdmFsdWUgPSBfc3RhcnQgLSAoaW5kZXggKiBzdGVwKVxuICAgICAgZWxzZSByZXR1cm4gXCJcIlxuXG4gICAgaWYgaXNOYU4gdmFsdWVcbiAgICAgIHJldHVybiBcIlwiXG5cbiAgICB2YWx1ZSA9IEB6ZXJvUGFkZGluZyB2YWx1ZSwgZGlnaXQsIHJhZGl4XG4gICAgZmlyc3RBbHBoYSA9IGlucHV0Lm1hdGNoIC8oW2EtZkEtRl0pL1xuXG4gICAgaWYgZmlyc3RBbHBoYVxuICAgICAgdmFsdWUgPSB2YWx1ZVtpZiBmaXJzdEFscGhhWzFdID09IGZpcnN0QWxwaGFbMV0udG9Mb3dlckNhc2UoKSB0aGVuIFwidG9Mb3dlckNhc2VcIiBlbHNlIFwidG9VcHBlckNhc2VcIl0oKVxuXG4gICAgcmV0dXJuIHZhbHVlXG5cbiAgY2FsY3VsYXRlQWxwaGFWYWx1ZTogKGluZGV4LCB7c3RhcnQsIGRpZ2l0LCBvcGVyYXRvciwgc3RlcCwgcmFkaXgsIGlucHV0fSkgLT5cbiAgICBzd2l0Y2ggb3BlcmF0b3JcbiAgICAgIHdoZW4gXCIrK1wiIHRoZW4gY291bnQgPSAoaW5kZXggLSAxKSArIHN0ZXBcbiAgICAgIHdoZW4gXCItLVwiIHRoZW4gY291bnQgPSAoaW5kZXggLSAxKSAtIHN0ZXBcbiAgICAgIHdoZW4gXCIrXCIgdGhlbiBjb3VudCA9IGluZGV4ICogc3RlcFxuICAgICAgd2hlbiBcIi1cIiB0aGVuIGNvdW50ID0gaW5kZXggKiBzdGVwICogLTFcblxuICAgIHZhbHVlID0gQGFscGhhU2VxdWVuY2Uoc3RhcnQudG9Mb3dlckNhc2UoKSwgY291bnQpXG4gICAgdmFsdWUgPSBAbGVmdFBhZGRpbmcodmFsdWUsIGRpZ2l0LCBcImFcIilcblxuICAgIGlmIC9bQS1aXS8udGVzdChzdGFydCkgb3IgL1tBLVpdLy50ZXN0KHJhZGl4KVxuICAgICAgdmFsdWUgPSB2YWx1ZS50b1VwcGVyQ2FzZSgpXG5cbiAgICByZXR1cm4gdmFsdWVcblxuICBhbHBoYVNlcXVlbmNlOiAoc3RyLCBjb3VudCkgLT5cbiAgICByZXR1cm4gc3RyIGlmIGNvdW50ID09IDBcblxuICAgIGFscGhhYmV0ID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiLnNwbGl0IFwiXCJcbiAgICBsYXN0ID0gc3RyLnNsaWNlIC0xXG4gICAgaW5kZXggPSBhbHBoYWJldC5pbmRleE9mIGxhc3RcbiAgICBuID0gTWF0aC5mbG9vcigoaW5kZXggKyBjb3VudCkgLyBhbHBoYWJldC5sZW5ndGgpXG4gICAgbmV4dCA9IGFscGhhYmV0WyhpbmRleCArIGNvdW50KSAlIGFscGhhYmV0Lmxlbmd0aF1cblxuICAgIHJldHVybiBcIlwiIGlmICFuZXh0XG5cbiAgICBzID0gXCIje3N0ci5zbGljZSgwLCBzdHIubGVuZ3RoIC0gMSl9I3tuZXh0fVwiXG5cbiAgICBpZiBuID4gMFxuICAgICAgaWYgcy5sZW5ndGggPT0gMSBhbmQgaW5kZXggPT0gYWxwaGFiZXQubGVuZ3RoIC0gMVxuICAgICAgICBzID0gXCJhI3tzfVwiXG4gICAgICBlbHNlXG4gICAgICAgIHMgPSBcIiN7QGFscGhhU2VxdWVuY2Uocy5zbGljZSgwLCBzLmxlbmd0aCAtIDEpLCBuKX0je25leHR9XCJcblxuICAgIHJldHVybiBzXG5cbiAgbGVmdFBhZGRpbmc6IChzdHIsIGRpZ2l0LCBwYWRTdHJpbmcpIC0+XG4gICAgX2RpZ2l0ID0gTWF0aC5tYXggc3RyLmxlbmd0aCwgZGlnaXRcbiAgICByZXR1cm4gKEFycmF5KF9kaWdpdCkuam9pbihwYWRTdHJpbmcpICsgc3RyKS5zbGljZShfZGlnaXQgKiAtMSlcblxuICB6ZXJvUGFkZGluZzogKG51bWJlciwgZGlnaXQgPSAwLCByYWRpeCA9IDEwKSAtPlxuICAgIG51bSA9IG51bWJlci50b1N0cmluZyByYWRpeFxuICAgIG51bUFicyA9IG51bS5yZXBsYWNlIFwiLVwiLCBcIlwiXG4gICAgcG9zaXRpdmUgPSBudW0uaW5kZXhPZihcIi1cIikgPCAwXG4gICAgcmV0dXJuIChpZiBwb3NpdGl2ZSB0aGVuIFwiXCIgZWxzZSBcIi1cIikgKyBAbGVmdFBhZGRpbmcobnVtQWJzLCBkaWdpdCwgXCIwXCIpXG4iXX0=
