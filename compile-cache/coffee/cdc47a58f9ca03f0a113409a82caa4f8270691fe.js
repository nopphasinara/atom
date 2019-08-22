(function() {
  var Disposable, Popover,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Disposable = require('atom').Disposable;

  module.exports = Popover = (function(superClass) {
    extend(Popover, superClass);

    Popover.prototype.element = null;


    /**
     * Constructor.
     */

    function Popover() {
      this.$ = require('jquery');
      this.element = document.createElement('div');
      this.element.className = 'tooltip bottom fade php-atom-autocomplete-popover';
      this.element.innerHTML = "<div class='tooltip-arrow'></div><div class='tooltip-inner'></div>";
      document.body.appendChild(this.element);
      Popover.__super__.constructor.call(this, this.destructor);
    }


    /**
     * Destructor.
     */

    Popover.prototype.destructor = function() {
      this.hide();
      return document.body.removeChild(this.element);
    };


    /**
     * Retrieves the HTML element containing the popover.
     *
     * @return {HTMLElement}
     */

    Popover.prototype.getElement = function() {
      return this.element;
    };


    /**
     * sets the text to display.
     *
     * @param {string} text
     */

    Popover.prototype.setText = function(text) {
      return this.$('.tooltip-inner', this.element).html('<div class="php-atom-autocomplete-popover-wrapper">' + text.replace(/\n\n/g, '<br/><br/>') + '</div>');
    };


    /**
     * Shows a popover at the specified location with the specified text and fade in time.
     *
     * @param {int}    x          The X coordinate to show the popover at (left).
     * @param {int}    y          The Y coordinate to show the popover at (top).
     * @param {int}    fadeInTime The amount of time to take to fade in the tooltip.
     */

    Popover.prototype.show = function(x, y, fadeInTime) {
      if (fadeInTime == null) {
        fadeInTime = 100;
      }
      this.$(this.element).css('left', x + 'px');
      this.$(this.element).css('top', y + 'px');
      this.$(this.element).addClass('in');
      this.$(this.element).css('opacity', 100);
      return this.$(this.element).css('display', 'block');
    };


    /**
     * Hides the tooltip, if it is displayed.
     */

    Popover.prototype.hide = function() {
      this.$(this.element).removeClass('in');
      this.$(this.element).css('opacity', 0);
      return this.$(this.element).css('display', 'none');
    };

    return Popover;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdG9tLWF1dG9jb21wbGV0ZS1waHAvbGliL3NlcnZpY2VzL3BvcG92ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxtQkFBQTtJQUFBOzs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUVmLE1BQU0sQ0FBQyxPQUFQLEdBRU07OztzQkFDRixPQUFBLEdBQVM7OztBQUVUOzs7O0lBR2EsaUJBQUE7TUFDVCxJQUFDLENBQUEsQ0FBRCxHQUFLLE9BQUEsQ0FBUSxRQUFSO01BRUwsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUFxQjtNQUNyQixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUI7TUFFckIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFkLENBQTBCLElBQUMsQ0FBQSxPQUEzQjtNQUVBLHlDQUFNLElBQUMsQ0FBQSxVQUFQO0lBVFM7OztBQVdiOzs7O3NCQUdBLFVBQUEsR0FBWSxTQUFBO01BQ1IsSUFBQyxDQUFBLElBQUQsQ0FBQTthQUNBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEwQixJQUFDLENBQUEsT0FBM0I7SUFGUTs7O0FBSVo7Ozs7OztzQkFLQSxVQUFBLEdBQVksU0FBQTtBQUNSLGFBQU8sSUFBQyxDQUFBO0lBREE7OztBQUdaOzs7Ozs7c0JBS0EsT0FBQSxHQUFTLFNBQUMsSUFBRDthQUNMLElBQUMsQ0FBQSxDQUFELENBQUcsZ0JBQUgsRUFBcUIsSUFBQyxDQUFBLE9BQXRCLENBQThCLENBQUMsSUFBL0IsQ0FDSSxxREFBQSxHQUF3RCxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsRUFBc0IsWUFBdEIsQ0FBeEQsR0FBOEYsUUFEbEc7SUFESzs7O0FBS1Q7Ozs7Ozs7O3NCQU9BLElBQUEsR0FBTSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sVUFBUDs7UUFBTyxhQUFhOztNQUN0QixJQUFDLENBQUEsQ0FBRCxDQUFHLElBQUMsQ0FBQSxPQUFKLENBQVksQ0FBQyxHQUFiLENBQWlCLE1BQWpCLEVBQXlCLENBQUEsR0FBSSxJQUE3QjtNQUNBLElBQUMsQ0FBQSxDQUFELENBQUcsSUFBQyxDQUFBLE9BQUosQ0FBWSxDQUFDLEdBQWIsQ0FBaUIsS0FBakIsRUFBd0IsQ0FBQSxHQUFJLElBQTVCO01BRUEsSUFBQyxDQUFBLENBQUQsQ0FBRyxJQUFDLENBQUEsT0FBSixDQUFZLENBQUMsUUFBYixDQUFzQixJQUF0QjtNQUNBLElBQUMsQ0FBQSxDQUFELENBQUcsSUFBQyxDQUFBLE9BQUosQ0FBWSxDQUFDLEdBQWIsQ0FBaUIsU0FBakIsRUFBNEIsR0FBNUI7YUFDQSxJQUFDLENBQUEsQ0FBRCxDQUFHLElBQUMsQ0FBQSxPQUFKLENBQVksQ0FBQyxHQUFiLENBQWlCLFNBQWpCLEVBQTRCLE9BQTVCO0lBTkU7OztBQVFOOzs7O3NCQUdBLElBQUEsR0FBTSxTQUFBO01BQ0YsSUFBQyxDQUFBLENBQUQsQ0FBRyxJQUFDLENBQUEsT0FBSixDQUFZLENBQUMsV0FBYixDQUF5QixJQUF6QjtNQUNBLElBQUMsQ0FBQSxDQUFELENBQUcsSUFBQyxDQUFBLE9BQUosQ0FBWSxDQUFDLEdBQWIsQ0FBaUIsU0FBakIsRUFBNEIsQ0FBNUI7YUFDQSxJQUFDLENBQUEsQ0FBRCxDQUFHLElBQUMsQ0FBQSxPQUFKLENBQVksQ0FBQyxHQUFiLENBQWlCLFNBQWpCLEVBQTRCLE1BQTVCO0lBSEU7Ozs7S0E1RFk7QUFKdEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7RGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbmNsYXNzIFBvcG92ZXIgZXh0ZW5kcyBEaXNwb3NhYmxlXG4gICAgZWxlbWVudDogbnVsbFxuXG4gICAgIyMjKlxuICAgICAqIENvbnN0cnVjdG9yLlxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICAgICBAJCA9IHJlcXVpcmUgJ2pxdWVyeSdcblxuICAgICAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIEBlbGVtZW50LmNsYXNzTmFtZSA9ICd0b29sdGlwIGJvdHRvbSBmYWRlIHBocC1hdG9tLWF1dG9jb21wbGV0ZS1wb3BvdmVyJ1xuICAgICAgICBAZWxlbWVudC5pbm5lckhUTUwgPSBcIjxkaXYgY2xhc3M9J3Rvb2x0aXAtYXJyb3cnPjwvZGl2PjxkaXYgY2xhc3M9J3Rvb2x0aXAtaW5uZXInPjwvZGl2PlwiXG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChAZWxlbWVudClcblxuICAgICAgICBzdXBlciBAZGVzdHJ1Y3RvclxuXG4gICAgIyMjKlxuICAgICAqIERlc3RydWN0b3IuXG4gICAgIyMjXG4gICAgZGVzdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgQGhpZGUoKVxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKEBlbGVtZW50KVxuXG4gICAgIyMjKlxuICAgICAqIFJldHJpZXZlcyB0aGUgSFRNTCBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIHBvcG92ZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cbiAgICAjIyNcbiAgICBnZXRFbGVtZW50OiAoKSAtPlxuICAgICAgICByZXR1cm4gQGVsZW1lbnRcblxuICAgICMjIypcbiAgICAgKiBzZXRzIHRoZSB0ZXh0IHRvIGRpc3BsYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgICMjI1xuICAgIHNldFRleHQ6ICh0ZXh0KSAtPlxuICAgICAgICBAJCgnLnRvb2x0aXAtaW5uZXInLCBAZWxlbWVudCkuaHRtbChcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicGhwLWF0b20tYXV0b2NvbXBsZXRlLXBvcG92ZXItd3JhcHBlclwiPicgKyB0ZXh0LnJlcGxhY2UoL1xcblxcbi9nLCAnPGJyLz48YnIvPicpICsgJzwvZGl2PidcbiAgICAgICAgKVxuXG4gICAgIyMjKlxuICAgICAqIFNob3dzIGEgcG9wb3ZlciBhdCB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uIHdpdGggdGhlIHNwZWNpZmllZCB0ZXh0IGFuZCBmYWRlIGluIHRpbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2ludH0gICAgeCAgICAgICAgICBUaGUgWCBjb29yZGluYXRlIHRvIHNob3cgdGhlIHBvcG92ZXIgYXQgKGxlZnQpLlxuICAgICAqIEBwYXJhbSB7aW50fSAgICB5ICAgICAgICAgIFRoZSBZIGNvb3JkaW5hdGUgdG8gc2hvdyB0aGUgcG9wb3ZlciBhdCAodG9wKS5cbiAgICAgKiBAcGFyYW0ge2ludH0gICAgZmFkZUluVGltZSBUaGUgYW1vdW50IG9mIHRpbWUgdG8gdGFrZSB0byBmYWRlIGluIHRoZSB0b29sdGlwLlxuICAgICMjI1xuICAgIHNob3c6ICh4LCB5LCBmYWRlSW5UaW1lID0gMTAwKSAtPlxuICAgICAgICBAJChAZWxlbWVudCkuY3NzKCdsZWZ0JywgeCArICdweCcpXG4gICAgICAgIEAkKEBlbGVtZW50KS5jc3MoJ3RvcCcsIHkgKyAncHgnKVxuXG4gICAgICAgIEAkKEBlbGVtZW50KS5hZGRDbGFzcygnaW4nKVxuICAgICAgICBAJChAZWxlbWVudCkuY3NzKCdvcGFjaXR5JywgMTAwKVxuICAgICAgICBAJChAZWxlbWVudCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJylcblxuICAgICMjIypcbiAgICAgKiBIaWRlcyB0aGUgdG9vbHRpcCwgaWYgaXQgaXMgZGlzcGxheWVkLlxuICAgICMjI1xuICAgIGhpZGU6ICgpIC0+XG4gICAgICAgIEAkKEBlbGVtZW50KS5yZW1vdmVDbGFzcygnaW4nKVxuICAgICAgICBAJChAZWxlbWVudCkuY3NzKCdvcGFjaXR5JywgMClcbiAgICAgICAgQCQoQGVsZW1lbnQpLmNzcygnZGlzcGxheScsICdub25lJylcbiJdfQ==
