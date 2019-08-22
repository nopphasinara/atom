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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9vbmUtZGFyay11aS9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxRQUFRLENBQUM7O0VBQ2hCLFNBQUEsR0FBWTs7RUFHWixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUF1QixTQUFELEdBQVcsV0FBakMsRUFBNkMsU0FBQyxLQUFEO2VBQzNDLFdBQUEsQ0FBWSxLQUFaO01BRDJDLENBQTdDO01BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQXVCLFNBQUQsR0FBVyxZQUFqQyxFQUE4QyxTQUFDLEtBQUQ7ZUFDNUMsWUFBQSxDQUFhLEtBQWI7TUFENEMsQ0FBOUM7TUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBdUIsU0FBRCxHQUFXLGlCQUFqQyxFQUFtRCxTQUFDLEtBQUQ7ZUFDakQsaUJBQUEsQ0FBa0IsS0FBbEI7TUFEaUQsQ0FBbkQ7TUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBdUIsU0FBRCxHQUFXLGtCQUFqQyxFQUFvRCxTQUFDLEtBQUQ7ZUFDbEQsa0JBQUEsQ0FBbUIsS0FBbkI7TUFEa0QsQ0FBcEQ7TUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBdUIsU0FBRCxHQUFXLGdCQUFqQyxFQUFrRCxTQUFDLEtBQUQ7ZUFDaEQsZ0JBQUEsQ0FBaUIsS0FBakI7TUFEZ0QsQ0FBbEQ7TUFLQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFtQixTQUFELEdBQVcsYUFBN0IsQ0FBSDtlQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBWixDQUFxQixTQUFELEdBQVcsYUFBL0IsRUFERjs7SUFsQlEsQ0FBVjtJQXFCQSxVQUFBLEVBQVksU0FBQTtNQUNWLGFBQUEsQ0FBQTtNQUNBLGNBQUEsQ0FBQTtNQUNBLG1CQUFBLENBQUE7TUFDQSxvQkFBQSxDQUFBO2FBQ0Esa0JBQUEsQ0FBQTtJQUxVLENBckJaOzs7RUErQkYsV0FBQSxHQUFjLFNBQUMsZUFBRDtXQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBWCxHQUF5QixlQUFELEdBQWlCO0VBRDdCOztFQUdkLGFBQUEsR0FBZ0IsU0FBQTtXQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBWCxHQUFzQjtFQURSOztFQU1oQixZQUFBLEdBQWUsU0FBQyxTQUFEO1dBQ2IsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsUUFBQSxHQUFTLFNBQVQsR0FBbUIsWUFBckMsRUFBa0QsU0FBUyxDQUFDLFdBQVYsQ0FBQSxDQUFsRDtFQURhOztFQUdmLGNBQUEsR0FBaUIsU0FBQTtXQUNmLElBQUksQ0FBQyxlQUFMLENBQXFCLFFBQUEsR0FBUyxTQUFULEdBQW1CLFlBQXhDO0VBRGU7O0VBTWpCLGlCQUFBLEdBQW9CLFNBQUMsY0FBRDtJQUNsQixJQUFHLGNBQUEsS0FBa0IsTUFBckI7YUFDRSxJQUFJLENBQUMsWUFBTCxDQUFrQixRQUFBLEdBQVMsU0FBVCxHQUFtQixtQkFBckMsRUFBeUQsTUFBekQsRUFERjtLQUFBLE1BQUE7YUFHRSxtQkFBQSxDQUFBLEVBSEY7O0VBRGtCOztFQU1wQixtQkFBQSxHQUFzQixTQUFBO1dBQ3BCLElBQUksQ0FBQyxlQUFMLENBQXFCLFFBQUEsR0FBUyxTQUFULEdBQW1CLG1CQUF4QztFQURvQjs7RUFNdEIsa0JBQUEsR0FBcUIsU0FBQyxlQUFEO0lBQ25CLElBQUcsZUFBSDthQUNFLElBQUksQ0FBQyxZQUFMLENBQWtCLFFBQUEsR0FBUyxTQUFULEdBQW1CLGVBQXJDLEVBQXFELFFBQXJELEVBREY7S0FBQSxNQUFBO2FBR0Usb0JBQUEsQ0FBQSxFQUhGOztFQURtQjs7RUFNckIsb0JBQUEsR0FBdUIsU0FBQTtXQUNyQixJQUFJLENBQUMsZUFBTCxDQUFxQixRQUFBLEdBQVMsU0FBVCxHQUFtQixlQUF4QztFQURxQjs7RUFNdkIsZ0JBQUEsR0FBbUIsU0FBQyxhQUFEO0lBQ2pCLElBQUcsYUFBSDthQUNFLElBQUksQ0FBQyxZQUFMLENBQWtCLFFBQUEsR0FBUyxTQUFULEdBQW1CLGlCQUFyQyxFQUF1RCxRQUF2RCxFQURGO0tBQUEsTUFBQTthQUdFLGtCQUFBLENBQUEsRUFIRjs7RUFEaUI7O0VBTW5CLGtCQUFBLEdBQXFCLFNBQUE7V0FDbkIsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsUUFBQSxHQUFTLFNBQVQsR0FBbUIsaUJBQXhDO0VBRG1CO0FBcEZyQiIsInNvdXJjZXNDb250ZW50IjpbInJvb3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcbnRoZW1lTmFtZSA9ICdvbmUtZGFyay11aSdcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSBcIiN7dGhlbWVOYW1lfS5mb250U2l6ZVwiLCAodmFsdWUpIC0+XG4gICAgICBzZXRGb250U2l6ZSh2YWx1ZSlcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgXCIje3RoZW1lTmFtZX0udGFiU2l6aW5nXCIsICh2YWx1ZSkgLT5cbiAgICAgIHNldFRhYlNpemluZyh2YWx1ZSlcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgXCIje3RoZW1lTmFtZX0udGFiQ2xvc2VCdXR0b25cIiwgKHZhbHVlKSAtPlxuICAgICAgc2V0VGFiQ2xvc2VCdXR0b24odmFsdWUpXG5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlIFwiI3t0aGVtZU5hbWV9LmhpZGVEb2NrQnV0dG9uc1wiLCAodmFsdWUpIC0+XG4gICAgICBzZXRIaWRlRG9ja0J1dHRvbnModmFsdWUpXG5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlIFwiI3t0aGVtZU5hbWV9LnN0aWNreUhlYWRlcnNcIiwgKHZhbHVlKSAtPlxuICAgICAgc2V0U3RpY2t5SGVhZGVycyh2YWx1ZSlcblxuICAgICMgREVQUkVDQVRFRDogVGhpcyBjYW4gYmUgcmVtb3ZlZCBhdCBzb21lIHBvaW50IChhZGRlZCBpbiBBdG9tIDEuMTcvMS4xOGlzaClcbiAgICAjIEl0IHJlbW92ZXMgYGxheW91dE1vZGVgXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KFwiI3t0aGVtZU5hbWV9LmxheW91dE1vZGVcIilcbiAgICAgIGF0b20uY29uZmlnLnVuc2V0KFwiI3t0aGVtZU5hbWV9LmxheW91dE1vZGVcIilcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIHVuc2V0Rm9udFNpemUoKVxuICAgIHVuc2V0VGFiU2l6aW5nKClcbiAgICB1bnNldFRhYkNsb3NlQnV0dG9uKClcbiAgICB1bnNldEhpZGVEb2NrQnV0dG9ucygpXG4gICAgdW5zZXRTdGlja3lIZWFkZXJzKClcblxuXG4jIEZvbnQgU2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5zZXRGb250U2l6ZSA9IChjdXJyZW50Rm9udFNpemUpIC0+XG4gIHJvb3Quc3R5bGUuZm9udFNpemUgPSBcIiN7Y3VycmVudEZvbnRTaXplfXB4XCJcblxudW5zZXRGb250U2l6ZSA9IC0+XG4gIHJvb3Quc3R5bGUuZm9udFNpemUgPSAnJ1xuXG5cbiMgVGFiIFNpemluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5zZXRUYWJTaXppbmcgPSAodGFiU2l6aW5nKSAtPlxuICByb290LnNldEF0dHJpYnV0ZShcInRoZW1lLSN7dGhlbWVOYW1lfS10YWJzaXppbmdcIiwgdGFiU2l6aW5nLnRvTG93ZXJDYXNlKCkpXG5cbnVuc2V0VGFiU2l6aW5nID0gLT5cbiAgcm9vdC5yZW1vdmVBdHRyaWJ1dGUoXCJ0aGVtZS0je3RoZW1lTmFtZX0tdGFic2l6aW5nXCIpXG5cblxuIyBUYWIgQ2xvc2UgQnV0dG9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnNldFRhYkNsb3NlQnV0dG9uID0gKHRhYkNsb3NlQnV0dG9uKSAtPlxuICBpZiB0YWJDbG9zZUJ1dHRvbiBpcyAnTGVmdCdcbiAgICByb290LnNldEF0dHJpYnV0ZShcInRoZW1lLSN7dGhlbWVOYW1lfS10YWItY2xvc2UtYnV0dG9uXCIsICdsZWZ0JylcbiAgZWxzZVxuICAgIHVuc2V0VGFiQ2xvc2VCdXR0b24oKVxuXG51bnNldFRhYkNsb3NlQnV0dG9uID0gLT5cbiAgcm9vdC5yZW1vdmVBdHRyaWJ1dGUoXCJ0aGVtZS0je3RoZW1lTmFtZX0tdGFiLWNsb3NlLWJ1dHRvblwiKVxuXG5cbiMgRG9jayBCdXR0b25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnNldEhpZGVEb2NrQnV0dG9ucyA9IChoaWRlRG9ja0J1dHRvbnMpIC0+XG4gIGlmIGhpZGVEb2NrQnV0dG9uc1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKFwidGhlbWUtI3t0aGVtZU5hbWV9LWRvY2stYnV0dG9uc1wiLCAnaGlkZGVuJylcbiAgZWxzZVxuICAgIHVuc2V0SGlkZURvY2tCdXR0b25zKClcblxudW5zZXRIaWRlRG9ja0J1dHRvbnMgPSAtPlxuICByb290LnJlbW92ZUF0dHJpYnV0ZShcInRoZW1lLSN7dGhlbWVOYW1lfS1kb2NrLWJ1dHRvbnNcIilcblxuXG4jIFN0aWNreSBIZWFkZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnNldFN0aWNreUhlYWRlcnMgPSAoc3RpY2t5SGVhZGVycykgLT5cbiAgaWYgc3RpY2t5SGVhZGVyc1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKFwidGhlbWUtI3t0aGVtZU5hbWV9LXN0aWNreS1oZWFkZXJzXCIsICdzdGlja3knKVxuICBlbHNlXG4gICAgdW5zZXRTdGlja3lIZWFkZXJzKClcblxudW5zZXRTdGlja3lIZWFkZXJzID0gLT5cbiAgcm9vdC5yZW1vdmVBdHRyaWJ1dGUoXCJ0aGVtZS0je3RoZW1lTmFtZX0tc3RpY2t5LWhlYWRlcnNcIilcbiJdfQ==
