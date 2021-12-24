(function() {
  var ENABLE_ENTER_KEY_DELAY, Emitter, SequentialNumberView, TemplateHelper, modalTemplate,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Emitter = require("event-kit").Emitter;

  TemplateHelper = require("./template-helper");

  ENABLE_ENTER_KEY_DELAY = 250;

  modalTemplate = "<div class=\"padded\">\n  <atom-text-editor placeholder-text=\"example) 01 + 2\" mini></atom-text-editor>\n  <div class=\"inset-panel\">\n    <div class=\"padded\">\n      <span class=\"icon icon-terminal\"></span>\n      <span id=\"sequential-number-simulator\"></span>\n    </div>\n  </div>\n</div>";

  module.exports = SequentialNumberView = (function(superClass) {
    extend(SequentialNumberView, superClass);

    function SequentialNumberView(serializedState) {
      SequentialNumberView.__super__.constructor.call(this);
      this.modalTemplate = TemplateHelper.create(modalTemplate);
      this.element = document.createElement("div");
      this.element.classList.add("sequential-number");
      this.element.appendChild(TemplateHelper.render(this.modalTemplate));
      this.textEditor = this.element.querySelector("atom-text-editor");
      this.simulator = this.element.querySelector("#sequential-number-simulator");
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.element,
        visible: false
      });
      this.handleBlur = this.handleBlur.bind(this);
      this.handleKeyup = this.handleKeyup.bind(this);
    }

    SequentialNumberView.prototype.serialize = function() {};

    SequentialNumberView.prototype.bindEvents = function() {
      this.isEnableEnterKey = false;
      this.isEnableEnterKeyTimer = setTimeout((function(_this) {
        return function() {
          return _this.isEnableEnterKey = true;
        };
      })(this), ENABLE_ENTER_KEY_DELAY);
      this.textEditor.addEventListener("blur", this.handleBlur, false);
      return this.textEditor.addEventListener("keyup", this.handleKeyup, false);
    };

    SequentialNumberView.prototype.unbindEvents = function() {
      this.isEnableEnterKey = false;
      clearTimeout(this.isEnableEnterKeyTimer);
      this.isEnableEnterKeyTimer = null;
      this.textEditor.removeEventListener("blur", this.handleBlur, false);
      return this.textEditor.removeEventListener("keyup", this.handleKeyup, false);
    };

    SequentialNumberView.prototype.handleBlur = function() {
      return this.emit("blur");
    };

    SequentialNumberView.prototype.handleKeyup = function(e) {
      var text;
      text = this.getText();
      if (this.isEnableEnterKey && e.keyCode === 13) {
        return this.emit("done", text);
      } else {
        return this.emit("change", text);
      }
    };

    SequentialNumberView.prototype.isVisible = function() {
      return this.modalPanel.isVisible();
    };

    SequentialNumberView.prototype.show = function() {
      this.modalPanel.show();
      this.textEditor.focus();
      return this.bindEvents();
    };

    SequentialNumberView.prototype.hide = function() {
      this.unbindEvents();
      this.modalPanel.hide();
      this.setText("");
      return this.setSimulatorText("");
    };

    SequentialNumberView.prototype.destroy = function() {
      this.modalPanel.destroy();
      this.modalPanel = null;
      this.element.remove();
      return this.element = null;
    };

    SequentialNumberView.prototype.setText = function(text) {
      return this.textEditor.getModel().setText(text);
    };

    SequentialNumberView.prototype.getText = function() {
      return this.textEditor.getModel().getText().trim();
    };

    SequentialNumberView.prototype.setSimulatorText = function(text) {
      return this.simulator.textContent = text;
    };

    SequentialNumberView.prototype.getSimulatorText = function() {
      return this.simulator.textContent;
    };

    return SequentialNumberView;

  })(Emitter);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL3NlcXVlbnRpYWwtbnVtYmVyL2xpYi9zZXF1ZW50aWFsLW51bWJlci12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsb0ZBQUE7SUFBQTs7O0VBQUMsVUFBVyxPQUFBLENBQVEsV0FBUjs7RUFDWixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUjs7RUFFakIsc0JBQUEsR0FBeUI7O0VBRXpCLGFBQUEsR0FBZ0I7O0VBWWhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNTLDhCQUFDLGVBQUQ7TUFDWCxvREFBQTtNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLGNBQWMsQ0FBQyxNQUFmLENBQXNCLGFBQXRCO01BRWpCLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixtQkFBdkI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsSUFBQyxDQUFBLGFBQXZCLENBQXJCO01BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBdUIsa0JBQXZCO01BQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBdUIsOEJBQXZCO01BQ2IsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7UUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BQVA7UUFBZ0IsT0FBQSxFQUFTLEtBQXpCO09BQTdCO01BRWQsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsSUFBakI7TUFDZCxJQUFDLENB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SUFESzs7OztLQTNFZTtBQWxCbkMiLCJzb3VyY2VzQ29udGVudCI6WyJ7RW1pdHRlcn0gPSByZXF1aXJlIFwiZXZlbnQta2l0XCJcblRlbXBsYXRlSGVscGVyID0gcmVxdWlyZSBcIi4vdGVtcGxhdGUtaGVscGVyXCJcblxuRU5BQkxFX0VOVEVSX0tFWV9ERUxBWSA9IDI1MFxuXG5tb2RhbFRlbXBsYXRlID0gXCJcIlwiXG48ZGl2IGNsYXNzPVwicGFkZGVkXCI+XG4gIDxhdG9tLXRleHQtZWRpdG9yIHBsYWNlaG9sZGVyLXRleHQ9XCJleGFtcGxlKSAwMSArIDJcIiBtaW5pPjwvYXRvbS10ZXh0LWVkaXRvcj5cbiAgPGRpdiBjbGFzcz1cImluc2V0LXBhbmVsXCI+XG4gICAgPGRpdiBjbGFzcz1cInBhZGRlZFwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJpY29uIGljb24tdGVybWluYWxcIj48L3NwYW4+XG4gICAgICA8c3BhbiBpZD1cInNlcXVlbnRpYWwtbnVtYmVyLXNpbXVsYXRvclwiPjwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cblwiXCJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTZXF1ZW50aWFsTnVtYmVyVmlldyBleHRlbmRzIEVtaXR0ZXJcbiAgY29uc3RydWN0b3I6IChzZXJpYWxpemVkU3RhdGUpIC0+XG4gICAgc3VwZXIoKVxuXG4gICAgQG1vZGFsVGVtcGxhdGUgPSBUZW1wbGF0ZUhlbHBlci5jcmVhdGUgbW9kYWxUZW1wbGF0ZVxuXG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiZGl2XCJcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkIFwic2VxdWVudGlhbC1udW1iZXJcIlxuICAgIEBlbGVtZW50LmFwcGVuZENoaWxkIFRlbXBsYXRlSGVscGVyLnJlbmRlciBAbW9kYWxUZW1wbGF0ZVxuXG4gICAgQHRleHRFZGl0b3IgPSBAZWxlbWVudC5xdWVyeVNlbGVjdG9yIFwiYXRvbS10ZXh0LWVkaXRvclwiXG4gICAgQHNpbXVsYXRvciA9IEBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IgXCIjc2VxdWVudGlhbC1udW1iZXItc2ltdWxhdG9yXCJcbiAgICBAbW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwgaXRlbTogQGVsZW1lbnQsIHZpc2libGU6IGZhbHNlXG5cbiAgICBAaGFuZGxlQmx1ciA9IEBoYW5kbGVCbHVyLmJpbmQgdGhpc1xuICAgIEBoYW5kbGVLZXl1cCA9IEBoYW5kbGVLZXl1cC5iaW5kIHRoaXNcblxuICBzZXJpYWxpemU6IC0+XG5cbiAgYmluZEV2ZW50czogLT5cbiAgICBAaXNFbmFibGVFbnRlcktleSA9IGZhbHNlXG4gICAgQGlzRW5hYmxlRW50ZXJLZXlUaW1lciA9IHNldFRpbWVvdXQgPT5cbiAgICAgIEBpc0VuYWJsZUVudGVyS2V5ID0gdHJ1ZVxuICAgICwgRU5BQkxFX0VOVEVSX0tFWV9ERUxBWVxuXG4gICAgQHRleHRFZGl0b3IuYWRkRXZlbnRMaXN0ZW5lciBcImJsdXJcIiwgQGhhbmRsZUJsdXIsIGZhbHNlXG4gICAgQHRleHRFZGl0b3IuYWRkRXZlbnRMaXN0ZW5lciBcImtleXVwXCIsIEBoYW5kbGVLZXl1cCwgZmFsc2VcblxuICB1bmJpbmRFdmVudHM6IC0+XG4gICAgQGlzRW5hYmxlRW50ZXJLZXkgPSBmYWxzZVxuICAgIGNsZWFyVGltZW91dCBAaXNFbmFibGVFbnRlcktleVRpbWVyXG4gICAgQGlzRW5hYmxlRW50ZXJLZXlUaW1lciA9IG51bGxcblxuICAgIEB0ZXh0RWRpdG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIgXCJibHVyXCIsIEBoYW5kbGVCbHVyLCBmYWxzZVxuICAgIEB0ZXh0RWRpdG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIgXCJrZXl1cFwiLCBAaGFuZGxlS2V5dXAsIGZhbHNlXG5cbiAgaGFuZGxlQmx1cjogLT5cbiAgICBAZW1pdCBcImJsdXJcIlxuXG4gIGhhbmRsZUtleXVwOiAoZSkgLT5cbiAgICB0ZXh0ID0gQGdldFRleHQoKVxuICAgIGlmIEBpc0VuYWJsZUVudGVyS2V5ICYmIGUua2V5Q29kZSA9PSAxM1xuICAgICAgQGVtaXQgXCJkb25lXCIsIHRleHRcbiAgICBlbHNlXG4gICAgICBAZW1pdCBcImNoYW5nZVwiLCB0ZXh0XG5cbiAgaXNWaXNpYmxlOiAtPlxuICAgIEBtb2RhbFBhbmVsLmlzVmlzaWJsZSgpXG5cbiAgc2hvdzogLT5cbiAgICBAbW9kYWxQYW5lbC5zaG93KClcbiAgICBAdGV4dEVkaXRvci5mb2N1cygpXG4gICAgQGJpbmRFdmVudHMoKVxuXG4gIGhpZGU6IC0+XG4gICAgQHVuYmluZEV2ZW50cygpXG4gICAgQG1vZGFsUGFuZWwuaGlkZSgpXG4gICAgQHNldFRleHQgXCJcIlxuICAgIEBzZXRTaW11bGF0b3JUZXh0IFwiXCJcblxuICBkZXN0cm95OiAtPlxuICAgIEBtb2RhbFBhbmVsLmRlc3Ryb3koKVxuICAgIEBtb2RhbFBhbmVsID0gbnVsbFxuICAgIEBlbGVtZW50LnJlbW92ZSgpXG4gICAgQGVsZW1lbnQgPSBudWxsXG5cbiAgc2V0VGV4dDogKHRleHQpIC0+XG4gICAgQHRleHRFZGl0b3IuZ2V0TW9kZWwoKS5zZXRUZXh0IHRleHRcblxuICBnZXRUZXh0OiAtPlxuICAgIEB0ZXh0RWRpdG9yLmdldE1vZGVsKCkuZ2V0VGV4dCgpLnRyaW0oKVxuXG4gIHNldFNpbXVsYXRvclRleHQ6ICh0ZXh0KSAtPlxuICAgIEBzaW11bGF0b3IudGV4dENvbnRlbnQgPSB0ZXh0XG5cbiAgZ2V0U2ltdWxhdG9yVGV4dDogLT5cbiAgICBAc2ltdWxhdG9yLnRleHRDb250ZW50XG4iXX0=
