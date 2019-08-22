(function() {
  var AttachedPopover, Popover,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Popover = require('./popover');

  module.exports = AttachedPopover = (function(superClass) {
    extend(AttachedPopover, superClass);


    /*
        NOTE: The reason we do not use Atom's native tooltip is because it is attached to an element, which caused
        strange problems such as tickets #107 and #72. This implementation uses the same CSS classes and transitions but
        handles the displaying manually as we don't want to attach/detach, we only want to temporarily display a popover
        on mouseover.
     */

    AttachedPopover.prototype.timeoutId = null;

    AttachedPopover.prototype.elementToAttachTo = null;


    /**
     * Constructor.
     *
     * @param {HTMLElement} elementToAttachTo The element to show the popover over.
     * @param {int}         delay             How long the mouse has to hover over the elment before the popover shows
     *                                        up (in miliiseconds).
     */

    function AttachedPopover(elementToAttachTo, delay) {
      this.elementToAttachTo = elementToAttachTo;
      if (delay == null) {
        delay = 500;
      }
      AttachedPopover.__super__.constructor.call(this);
    }


    /**
     * Destructor.
     *
     */

    AttachedPopover.prototype.destructor = function() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      return AttachedPopover.__super__.destructor.call(this);
    };


    /**
     * Shows the popover with the specified text.
     *
     * @param {int} fadeInTime The amount of time to take to fade in the tooltip.
     */

    AttachedPopover.prototype.show = function(fadeInTime) {
      var centerOffset, coordinates, x, y;
      if (fadeInTime == null) {
        fadeInTime = 100;
      }
      coordinates = this.elementToAttachTo.getBoundingClientRect();
      centerOffset = (coordinates.right - coordinates.left) / 2;
      x = coordinates.left - (this.$(this.getElement()).width() / 2) + centerOffset;
      y = coordinates.bottom;
      return AttachedPopover.__super__.show.call(this, x, y, fadeInTime);
    };


    /**
     * Shows the popover with the specified text after the specified delay (in miliiseconds). Calling this method
     * multiple times will cancel previous show requests and restart.
     *
     * @param {int}    delay      The delay before the tooltip shows up (in milliseconds).
     * @param {int}    fadeInTime The amount of time to take to fade in the tooltip.
     */

    AttachedPopover.prototype.showAfter = function(delay, fadeInTime) {
      if (fadeInTime == null) {
        fadeInTime = 100;
      }
      return this.timeoutId = setTimeout((function(_this) {
        return function() {
          return _this.show(fadeInTime);
        };
      })(this), delay);
    };

    return AttachedPopover;

  })(Popover);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3NlcnZpY2VzL2F0dGFjaGVkLXBvcG92ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBOzs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FFTTs7OztBQUNGOzs7Ozs7OzhCQU1BLFNBQUEsR0FBVzs7OEJBQ1gsaUJBQUEsR0FBbUI7OztBQUVuQjs7Ozs7Ozs7SUFPYSx5QkFBQyxpQkFBRCxFQUFxQixLQUFyQjtNQUFDLElBQUMsQ0FBQSxvQkFBRDs7UUFBb0IsUUFBUTs7TUFDdEMsK0NBQUE7SUFEUzs7O0FBR2I7Ozs7OzhCQUlBLFVBQUEsR0FBWSxTQUFBO01BQ1IsSUFBRyxJQUFDLENBQUEsU0FBSjtRQUNJLFlBQUEsQ0FBYSxJQUFDLENBQUEsU0FBZDtRQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FGakI7O2FBSUEsOENBQUE7SUFMUTs7O0FBT1o7Ozs7Ozs4QkFLQSxJQUFBLEdBQU0sU0FBQyxVQUFEO0FBQ0YsVUFBQTs7UUFERyxhQUFhOztNQUNoQixXQUFBLEdBQWMsSUFBQyxDQUFBLGlCQUFpQixDQUFDLHFCQUFuQixDQUFBO01BRWQsWUFBQSxHQUFnQixDQUFDLFdBQVcsQ0FBQyxLQUFaLEdBQW9CLFdBQVcsQ0FBQyxJQUFqQyxDQUFBLEdBQXlDO01BRXpELENBQUEsR0FBSSxXQUFXLENBQUMsSUFBWixHQUFtQixDQUFDLElBQUMsQ0FBQSxDQUFELENBQUcsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFILENBQWlCLENBQUMsS0FBbEIsQ0FBQSxDQUFBLEdBQTRCLENBQTdCLENBQW5CLEdBQXFEO01BQ3pELENBQUEsR0FBSSxXQUFXLENBQUM7YUFFaEIsMENBQU0sQ0FBTixFQUFTLENBQVQsRUFBWSxVQUFaO0lBUkU7OztBQVVOOzs7Ozs7Ozs4QkFPQSxTQUFBLEdBQVcsU0FBQyxLQUFELEVBQVEsVUFBUjs7UUFBUSxhQUFhOzthQUM1QixJQUFDLENBQUEsU0FBRCxHQUFhLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3BCLEtBQUMsQ0FBQSxJQUFELENBQU0sVUFBTjtRQURvQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUVYLEtBRlc7SUFETjs7OztLQXJEZTtBQUo5QiIsInNvdXJjZXNDb250ZW50IjpbIlBvcG92ZXIgPSByZXF1aXJlICcuL3BvcG92ZXInXG5cbm1vZHVsZS5leHBvcnRzID1cblxuY2xhc3MgQXR0YWNoZWRQb3BvdmVyIGV4dGVuZHMgUG9wb3ZlclxuICAgICMjI1xuICAgICAgICBOT1RFOiBUaGUgcmVhc29uIHdlIGRvIG5vdCB1c2UgQXRvbSdzIG5hdGl2ZSB0b29sdGlwIGlzIGJlY2F1c2UgaXQgaXMgYXR0YWNoZWQgdG8gYW4gZWxlbWVudCwgd2hpY2ggY2F1c2VkXG4gICAgICAgIHN0cmFuZ2UgcHJvYmxlbXMgc3VjaCBhcyB0aWNrZXRzICMxMDcgYW5kICM3Mi4gVGhpcyBpbXBsZW1lbnRhdGlvbiB1c2VzIHRoZSBzYW1lIENTUyBjbGFzc2VzIGFuZCB0cmFuc2l0aW9ucyBidXRcbiAgICAgICAgaGFuZGxlcyB0aGUgZGlzcGxheWluZyBtYW51YWxseSBhcyB3ZSBkb24ndCB3YW50IHRvIGF0dGFjaC9kZXRhY2gsIHdlIG9ubHkgd2FudCB0byB0ZW1wb3JhcmlseSBkaXNwbGF5IGEgcG9wb3ZlclxuICAgICAgICBvbiBtb3VzZW92ZXIuXG4gICAgIyMjXG4gICAgdGltZW91dElkOiBudWxsXG4gICAgZWxlbWVudFRvQXR0YWNoVG86IG51bGxcblxuICAgICMjIypcbiAgICAgKiBDb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRUb0F0dGFjaFRvIFRoZSBlbGVtZW50IHRvIHNob3cgdGhlIHBvcG92ZXIgb3Zlci5cbiAgICAgKiBAcGFyYW0ge2ludH0gICAgICAgICBkZWxheSAgICAgICAgICAgICBIb3cgbG9uZyB0aGUgbW91c2UgaGFzIHRvIGhvdmVyIG92ZXIgdGhlIGVsbWVudCBiZWZvcmUgdGhlIHBvcG92ZXIgc2hvd3NcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cCAoaW4gbWlsaWlzZWNvbmRzKS5cbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKEBlbGVtZW50VG9BdHRhY2hUbywgZGVsYXkgPSA1MDApIC0+XG4gICAgICAgIHN1cGVyKClcblxuICAgICMjIypcbiAgICAgKiBEZXN0cnVjdG9yLlxuICAgICAqXG4gICAgIyMjXG4gICAgZGVzdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgaWYgQHRpbWVvdXRJZFxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KEB0aW1lb3V0SWQpXG4gICAgICAgICAgICBAdGltZW91dElkID0gbnVsbFxuXG4gICAgICAgIHN1cGVyKClcblxuICAgICMjIypcbiAgICAgKiBTaG93cyB0aGUgcG9wb3ZlciB3aXRoIHRoZSBzcGVjaWZpZWQgdGV4dC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7aW50fSBmYWRlSW5UaW1lIFRoZSBhbW91bnQgb2YgdGltZSB0byB0YWtlIHRvIGZhZGUgaW4gdGhlIHRvb2x0aXAuXG4gICAgIyMjXG4gICAgc2hvdzogKGZhZGVJblRpbWUgPSAxMDApIC0+XG4gICAgICAgIGNvb3JkaW5hdGVzID0gQGVsZW1lbnRUb0F0dGFjaFRvLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIGNlbnRlck9mZnNldCA9ICgoY29vcmRpbmF0ZXMucmlnaHQgLSBjb29yZGluYXRlcy5sZWZ0KSAvIDIpXG5cbiAgICAgICAgeCA9IGNvb3JkaW5hdGVzLmxlZnQgLSAoQCQoQGdldEVsZW1lbnQoKSkud2lkdGgoKSAvIDIpICsgY2VudGVyT2Zmc2V0XG4gICAgICAgIHkgPSBjb29yZGluYXRlcy5ib3R0b21cblxuICAgICAgICBzdXBlcih4LCB5LCBmYWRlSW5UaW1lKVxuXG4gICAgIyMjKlxuICAgICAqIFNob3dzIHRoZSBwb3BvdmVyIHdpdGggdGhlIHNwZWNpZmllZCB0ZXh0IGFmdGVyIHRoZSBzcGVjaWZpZWQgZGVsYXkgKGluIG1pbGlpc2Vjb25kcykuIENhbGxpbmcgdGhpcyBtZXRob2RcbiAgICAgKiBtdWx0aXBsZSB0aW1lcyB3aWxsIGNhbmNlbCBwcmV2aW91cyBzaG93IHJlcXVlc3RzIGFuZCByZXN0YXJ0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtpbnR9ICAgIGRlbGF5ICAgICAgVGhlIGRlbGF5IGJlZm9yZSB0aGUgdG9vbHRpcCBzaG93cyB1cCAoaW4gbWlsbGlzZWNvbmRzKS5cbiAgICAgKiBAcGFyYW0ge2ludH0gICAgZmFkZUluVGltZSBUaGUgYW1vdW50IG9mIHRpbWUgdG8gdGFrZSB0byBmYWRlIGluIHRoZSB0b29sdGlwLlxuICAgICMjI1xuICAgIHNob3dBZnRlcjogKGRlbGF5LCBmYWRlSW5UaW1lID0gMTAwKSAtPlxuICAgICAgICBAdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgQHNob3coZmFkZUluVGltZSlcbiAgICAgICAgLCBkZWxheSlcbiJdfQ==
