(function() {
  var root, setFontSize, setHideDockButtons, setStickyHeaders, setTabCloseButton, setTabSizing, themeName, unsetFontSize, unsetHideDockButtons, unsetStickyHeaders, unsetTabCloseButton, unsetTabSizing;

  root = document.documentElement;

  themeName = 'one-dark-ui';

  module.exports = {
    activate: function(state) {
      atom.config.observe(themeName + ".fontSize", function(value) {
        return setFontSize(value);
      });
      atom.config.observe(themeName + ".tabSizing", function(value) {
        return setTabSizing(value);
      });
      atom.config.observe(themeName + ".tabCloseButton", function(value) {
        return setTabCloseButton(value);
      });
      atom.config.observe(themeName + ".hideDockButtons", function(value) {
        return setHideDockButtons(value);
      });
      atom.config.observe(themeName + ".stickyHeaders", function(value) {
        return setStickyHeaders(value);
      });
      if (atom.config.get(themeName + ".layoutMode")) {
        return atom.config.unset(themeName + ".layoutMode");
      }
    },
    deactivate: function() {
      unsetFontSize();
      unsetTabSizing();
      unsetTabCloseButton();
      unsetHideDockButtons();
      return unsetStickyHeaders();
    }
  };

  setFontSize = function(currentFontSize) {
    return root.style.fontSize = currentFontSize + "px";
  };

  unsetFontSize = function() {
    return root.style.fontSize = '';
  };

  setTabSizing = function(tabSizing) {
    return root.setAttribute("theme-" + themeName + "-tabsizing", tabSizing.toLowerCase());
  };

  unsetTabSizing = function() {
    return root.removeAttribute("theme-" + themeName + "-tabsizing");
  };

  setTabCloseButton = function(tabCloseButton) {
    if (tabCloseButton === 'Left') {
      return root.setAttribute("theme-" + themeName + "-tab-close-button", 'left');
    } else {
      return unsetTabCloseButton();
    }
  };

  unsetTabCloseButton = function() {
    return root.removeAttribute("theme-" + themeName + "-tab-close-button");
  };

  setHideDockButtons = function(hideDockButtons) {
    if (hideDockButtons) {
      return root.setAttribute("theme-" + themeName + "-dock-buttons", 'hidden');
    } else {
      return unsetHideDockButtons();
    }
  };

  unsetHideDockButtons = function() {
    return root.removeAttribute("theme-" + themeName + "-dock-buttons");
  };

  setStickyHeaders = function(stickyHeaders) {
    if (stickyHeaders) {
      return root.setAttribute("theme-" + themeName + "-sticky-headers", 'sticky');
    } else {
      return unsetStickyHeaders();
    }
  };

  unsetStickyHeaders = function() {
    return root.removeAttribute("theme-" + themeName + "-sticky-headers");
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL29uZS1kYXJrLXVpL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLFFBQVEsQ0FBQzs7RUFDaEIsU0FBQSxHQUFZOztFQUdaLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQXVCLFNBQUQsR0FBVyxXQUFqQyxFQUE2QyxTQUFDLEtBQUQ7ZUFDM0MsV0FBQSxDQUFZLEtBQVo7TUFEMkMsQ0FBN0M7TUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBdUIsU0FBRCxHQUFXLFlBQWpDLEVBQThDLFNBQUMsS0FBRDtlQUM1QyxZQUFBLENBQWEsS0FBYjtNQUQ0QyxDQUE5QztNQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUF1QixTQUFELEdBQVcsaUJBQWpDLEVBQW1ELFNBQUMsS0FBRDtlQUNqRCxpQkFBQSxDQUFrQixLQUFsQjtNQURpRCxDQUFuRDtNQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUF1QixTQUFELEdBQVcsa0JBQWpDLEVBQW9ELFNBQUMsS0FBRDtlQUNsRCxrQkFBQSxDQUFtQixLQUFuQjtNQURrRCxDQUFwRDtNQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUF1QixTQUFELEdBQVcsZ0JBQWpDLEVBQWtELFNBQUMsS0FBRDtlQUNoRCxnQkFBQSxDQUFpQixLQUFqQjtNQURnRCxDQUFsRDtNQUtBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQW1CLFNBQUQsR0FBVyxhQUE3QixDQUFIO2VBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFaLENBQXFCLFNBQUQsR0FBVyxhQUEvQixFQURGOztJQWxCUSxDQUFWO0lBcUJBLFVBQUEsRUFBWSxTQUFBO01BQ1YsYUFBQSxDQUFBO01BQ0EsY0FBQSxDQUFBO01BQ0EsbUJBQUEsQ0FBQTtNQUNBLG9CQUFBLENBQUE7YUFDQSxrQkFBQSxDQUFBO0lBTFUsQ0FyQlo7OztFQStCRixXQUFBLEdBQWMsU0FBQyxlQUFEO1dBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFYLEdBQXlCLGVBQUQsR0FBaUI7RUFEN0I7O0VBR2QsYUFBQSxHQUFnQixTQUFBO1dBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFYLEdBQXNCO0VBRFI7O0VBTWhCLFlBQUEsR0FBZSxTQUFDLFNBQUQ7V0FDYixJQUFJLENBQUMsWUFBTCxDQUFrQixRQUFBLEdBQVMsU0FBVCxHQUFtQixZQUFyQyxFQUFrRCxTQUFTLENBQUMsV0FBVixDQUFBLENBQWxEO0VBRGE7O0VBR2YsY0FBQSxHQUFpQixTQUFBO1dBQ2YsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsUUFBQSxHQUFTLFNBQVQsR0FBbUIsWUFBeEM7RUFEZTs7RUFNakIsaUJBQUEsR0FBb0IsU0FBQyxjQUFEO0lBQ2xCLElBQUcsY0FBQSxLQUFrQixNQUFyQjthQUNFLElBQUksQ0FBQyxZQUFMLENBQWtCLFFBQUEsR0FBUyxTQUFULEdBQW1CLG1CQUFyQyxFQUF5RCxNQUF6RCxFQURGO0tBQUEsTUFBQTthQUdFLG1CQUFBLENBQUEsRUFIRjs7RUFEa0I7O0VBTXBCLG1CQUFBLEdBQXNCLFNBQUE7V0FDcEIsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsUUFBQSxHQUFTLFNBQVQsR0FBbUIsbUJBQXhDO0VBRG9COztFQU10QixrQkFBQSxHQUFxQixTQUFDLGVBQUQ7SUFDbkIsSUFBRyxlQUFIO2FBQ0UsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsUUFBQSxHQUFTLFNBQVQsR0FBbUIsZUFBckMsRUFBcUQsUUFBckQsRUFERjtLQUFBLE1BQUE7YUFHRSxvQkFBQSxDQUFBLEVBSEY7O0VBRG1COztFQU1yQixvQkFBQSxHQUF1QixTQUFBO1dBQ3JCLElBQUksQ0FBQyxlQUFMLENBQXFCLFFBQUEsR0FBUyxTQUFULEdBQW1CLGVBQXhDO0VBRHFCOztFQU12QixnQkFBQSxHQUFtQixTQUFDLGFBQUQ7SUFDakIsSUFBRyxhQUFIO2FBQ0UsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsUUFBQSxHQUFTLFNBQVQsR0FBbUIsaUJBQXJDLEVBQXVELFFBQXZELEVBREY7S0FBQSxNQUFBO2FBR0Usa0JBQUEsQ0FBQSxFQUhGOztFQURpQjs7RUFNbkIsa0JBQUEsR0FBcUIsU0FBQTtXQUNuQixJQUFJLENBQUMsZUFBTCxDQUFxQixRQUFBLEdBQVMsU0FBVCxHQUFtQixpQkFBeEM7RUFEbUI7QUFwRnJCIiwic291cmNlc0NvbnRlbnQiOlsicm9vdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxudGhlbWVOYW1lID0gJ29uZS1kYXJrLXVpJ1xuXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlIFwiI3t0aGVtZU5hbWV9LmZvbnRTaXplXCIsICh2YWx1ZSkgLT5cbiAgICAgIHNldEZvbnRTaXplKHZhbHVlKVxuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSBcIiN7dGhlbWVOYW1lfS50YWJTaXppbmdcIiwgKHZhbHVlKSAtPlxuICAgICAgc2V0VGFiU2l6aW5nKHZhbHVlKVxuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSBcIiN7dGhlbWVOYW1lfS50YWJDbG9zZUJ1dHRvblwiLCAodmFsdWUpIC0+XG4gICAgICBzZXRUYWJDbG9zZUJ1dHRvbih2YWx1ZSlcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgXCIje3RoZW1lTmFtZX0uaGlkZURvY2tCdXR0b25zXCIsICh2YWx1ZSkgLT5cbiAgICAgIHNldEhpZGVEb2NrQnV0dG9ucyh2YWx1ZSlcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgXCIje3RoZW1lTmFtZX0uc3RpY2t5SGVhZGVyc1wiLCAodmFsdWUpIC0+XG4gICAgICBzZXRTdGlja3lIZWFkZXJzKHZhbHVlKVxuXG4gICAgIyBERVBSRUNBVEVEOiBUaGlzIGNhbiBiZSByZW1vdmVkIGF0IHNvbWUgcG9pbnQgKGFkZGVkIGluIEF0b20gMS4xNy8xLjE4aXNoKVxuICAgICMgSXQgcmVtb3ZlcyBgbGF5b3V0TW9kZWBcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoXCIje3RoZW1lTmFtZX0ubGF5b3V0TW9kZVwiKVxuICAgICAgYXRvbS5jb25maWcudW5zZXQoXCIje3RoZW1lTmFtZX0ubGF5b3V0TW9kZVwiKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgdW5zZXRGb250U2l6ZSgpXG4gICAgdW5zZXRUYWJTaXppbmcoKVxuICAgIHVuc2V0VGFiQ2xvc2VCdXR0b24oKVxuICAgIHVuc2V0SGlkZURvY2tCdXR0b25zKClcbiAgICB1bnNldFN0aWNreUhlYWRlcnMoKVxuXG5cbiMgRm9udCBTaXplIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnNldEZvbnRTaXplID0gKGN1cnJlbnRGb250U2l6ZSkgLT5cbiAgcm9vdC5zdHlsZS5mb250U2l6ZSA9IFwiI3tjdXJyZW50Rm9udFNpemV9cHhcIlxuXG51bnNldEZvbnRTaXplID0gLT5cbiAgcm9vdC5zdHlsZS5mb250U2l6ZSA9ICcnXG5cblxuIyBUYWIgU2l6aW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnNldFRhYlNpemluZyA9ICh0YWJTaXppbmcpIC0+XG4gIHJvb3Quc2V0QXR0cmlidXRlKFwidGhlbWUtI3t0aGVtZU5hbWV9LXRhYnNpemluZ1wiLCB0YWJTaXppbmcudG9Mb3dlckNhc2UoKSlcblxudW5zZXRUYWJTaXppbmcgPSAtPlxuICByb290LnJlbW92ZUF0dHJpYnV0ZShcInRoZW1lLSN7dGhlbWVOYW1lfS10YWJzaXppbmdcIilcblxuXG4jIFRhYiBDbG9zZSBCdXR0b24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuc2V0VGFiQ2xvc2VCdXR0b24gPSAodGFiQ2xvc2VCdXR0b24pIC0+XG4gIGlmIHRhYkNsb3NlQnV0dG9uIGlzICdMZWZ0J1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKFwidGhlbWUtI3t0aGVtZU5hbWV9LXRhYi1jbG9zZS1idXR0b25cIiwgJ2xlZnQnKVxuICBlbHNlXG4gICAgdW5zZXRUYWJDbG9zZUJ1dHRvbigpXG5cbnVuc2V0VGFiQ2xvc2VCdXR0b24gPSAtPlxuICByb290LnJlbW92ZUF0dHJpYnV0ZShcInRoZW1lLSN7dGhlbWVOYW1lfS10YWItY2xvc2UtYnV0dG9uXCIpXG5cblxuIyBEb2NrIEJ1dHRvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuc2V0SGlkZURvY2tCdXR0b25zID0gKGhpZGVEb2NrQnV0dG9ucykgLT5cbiAgaWYgaGlkZURvY2tCdXR0b25zXG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoXCJ0aGVtZS0je3RoZW1lTmFtZX0tZG9jay1idXR0b25zXCIsICdoaWRkZW4nKVxuICBlbHNlXG4gICAgdW5zZXRIaWRlRG9ja0J1dHRvbnMoKVxuXG51bnNldEhpZGVEb2NrQnV0dG9ucyA9IC0+XG4gIHJvb3QucmVtb3ZlQXR0cmlidXRlKFwidGhlbWUtI3t0aGVtZU5hbWV9LWRvY2stYnV0dG9uc1wiKVxuXG5cbiMgU3RpY2t5IEhlYWRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuc2V0U3RpY2t5SGVhZGVycyA9IChzdGlja3lIZWFkZXJzKSAtPlxuICBpZiBzdGlja3lIZWFkZXJzXG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoXCJ0aGVtZS0je3RoZW1lTmFtZX0tc3RpY2t5LWhlYWRlcnNcIiwgJ3N0aWNreScpXG4gIGVsc2VcbiAgICB1bnNldFN0aWNreUhlYWRlcnMoKVxuXG51bnNldFN0aWNreUhlYWRlcnMgPSAtPlxuICByb290LnJlbW92ZUF0dHJpYnV0ZShcInRoZW1lLSN7dGhlbWVOYW1lfS1zdGlja3ktaGVhZGVyc1wiKVxuIl19
