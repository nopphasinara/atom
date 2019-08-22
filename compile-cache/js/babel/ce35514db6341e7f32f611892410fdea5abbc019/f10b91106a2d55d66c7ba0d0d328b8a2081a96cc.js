var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var FTP_REMOTE_EDIT_PROTOCOL_URI = 'h3imdall://ftp-remote-edit-protocol';
var Queue = require('./../helper/queue.js');

var ProtocolView = (function (_ScrollView) {
  _inherits(ProtocolView, _ScrollView);

  function ProtocolView() {
    _classCallCheck(this, ProtocolView);

    _get(Object.getPrototypeOf(ProtocolView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ProtocolView, [{
    key: 'initialize',
    value: function initialize(state) {
      _get(Object.getPrototypeOf(ProtocolView.prototype), 'initialize', this).call(this, state);
      var self = this;

      atom.workspace.addOpener(function (uri) {
        if (uri === FTP_REMOTE_EDIT_PROTOCOL_URI) {
          return self;
        }
      });
      atom.workspace.open(FTP_REMOTE_EDIT_PROTOCOL_URI, { activatePane: false, activateItem: false });

      self.head.prepend('<tr><th>Local file</th><th>Direction</th><th>Remote file</th><th>Size</th><th>Progress</th><th>Status</th></tr>');

      try {
        Queue.onDidAddFile = function (item) {
          self.list.prepend(item);
          var children = self.list.children();
          if (children.length > 50) {
            children.last().remove();
          }

          item.onError = function () {
            if (atom.config.get('ftp-remote-edit.notifications.openProtocolViewOnError')) {
              atom.workspace.open(FTP_REMOTE_EDIT_PROTOCOL_URI);
            }
            // TODO
          };

          item.onTransferring = function () {
            // TODO
          };

          item.onFinished = function () {
            //TODO
          };
        };
      } catch (e) {
        console.log(e);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;

      self.remove();
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return "Remote Transfer Log";
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return "list-unordered";
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return FTP_REMOTE_EDIT_PROTOCOL_URI;
    }
  }, {
    key: 'getAllowedLocations',
    value: function getAllowedLocations() {
      return ["bottom"];
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return "bottom";
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      atom.workspace.toggle(this);
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this = this;

      return this.div({
        'class': 'ftp-remote-edit-protocol tool-panel'
      }, function () {
        _this.table({
          'class': 'ftp-remote-edit-protocol-table',
          tabindex: -1,
          outlet: 'table'
        }, function () {
          _this.thead({
            outlet: 'head'
          });
          _this.tbody({
            outlet: 'list'
          });
        });
      });
    }
  }]);

  return ProtocolView;
})(_atomSpacePenViews.ScrollView);

module.exports = ProtocolView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9wcm90b2NvbC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2lDQUUyQixzQkFBc0I7O0FBRmpELFdBQVcsQ0FBQzs7QUFJWixJQUFNLDRCQUE0QixHQUFHLHFDQUFxQyxDQUFDO0FBQzNFLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztJQUV4QyxZQUFZO1lBQVosWUFBWTs7V0FBWixZQUFZOzBCQUFaLFlBQVk7OytCQUFaLFlBQVk7OztlQUFaLFlBQVk7O1dBcUJOLG9CQUFDLEtBQUssRUFBRTtBQUNoQixpQ0F0QkUsWUFBWSw0Q0FzQkcsS0FBSyxFQUFDO0FBQ3ZCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDOUIsWUFBSSxHQUFHLEtBQUssNEJBQTRCLEVBQUU7QUFDeEMsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7T0FDRixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7O0FBRWhHLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxtSEFBbUgsQ0FBQzs7QUFFckksVUFBSTtBQUNGLGFBQUssQ0FBQyxZQUFZLEdBQUcsVUFBQyxJQUFJLEVBQUs7QUFDN0IsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsY0FBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN0QyxjQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO0FBQ3hCLG9CQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7V0FDMUI7O0FBRUQsY0FBSSxDQUFDLE9BQU8sR0FBRyxZQUFNO0FBQ25CLGdCQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVEQUF1RCxDQUFDLEVBQUU7QUFDNUUsa0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7YUFDbkQ7O1dBRUYsQ0FBQzs7QUFFRixjQUFJLENBQUMsY0FBYyxHQUFHLFlBQU07O1dBRTNCLENBQUM7O0FBRUYsY0FBSSxDQUFDLFVBQVUsR0FBRyxZQUFNOztXQUV2QixDQUFDO1NBQ0gsQ0FBQztPQUNILENBQUMsT0FBTyxDQUFDLEVBQUU7QUFBRSxlQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQUU7S0FDaEM7OztXQUVNLG1CQUFHO0FBQ1IsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1dBRU8sb0JBQUc7QUFDVCxhQUFPLHFCQUFxQixDQUFDO0tBQzlCOzs7V0FFVSx1QkFBRztBQUNaLGFBQU8sZ0JBQWdCLENBQUM7S0FDekI7OztXQUVLLGtCQUFHO0FBQ1AsYUFBTyw0QkFBNEIsQ0FBQztLQUNyQzs7O1dBRWtCLCtCQUFHO0FBQ3BCLGFBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNuQjs7O1dBRWlCLDhCQUFHO0FBQ25CLGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCOzs7V0F0RmEsbUJBQUc7OztBQUNmLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNkLGlCQUFPLHFDQUFxQztPQUM3QyxFQUFFLFlBQU07QUFDUCxjQUFLLEtBQUssQ0FBQztBQUNULG1CQUFPLGdDQUFnQztBQUN2QyxrQkFBUSxFQUFFLENBQUMsQ0FBQztBQUNaLGdCQUFNLEVBQUUsT0FBTztTQUNoQixFQUFFLFlBQU07QUFDUCxnQkFBSyxLQUFLLENBQUM7QUFDVCxrQkFBTSxFQUFFLE1BQU07V0FDZixDQUFDLENBQUM7QUFDSCxnQkFBSyxLQUFLLENBQUM7QUFDVCxrQkFBTSxFQUFFLE1BQU07V0FDZixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBbkJHLFlBQVk7OztBQTJGbEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9mdHAtcmVtb3RlLWVkaXQvbGliL3ZpZXdzL3Byb3RvY29sLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgU2Nyb2xsVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcblxuY29uc3QgRlRQX1JFTU9URV9FRElUX1BST1RPQ09MX1VSSSA9ICdoM2ltZGFsbDovL2Z0cC1yZW1vdGUtZWRpdC1wcm90b2NvbCc7XG5jb25zdCBRdWV1ZSA9IHJlcXVpcmUoJy4vLi4vaGVscGVyL3F1ZXVlLmpzJyk7XG5cbmNsYXNzIFByb3RvY29sVmlldyBleHRlbmRzIFNjcm9sbFZpZXcge1xuXG4gIHN0YXRpYyBjb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLmRpdih7XG4gICAgICBjbGFzczogJ2Z0cC1yZW1vdGUtZWRpdC1wcm90b2NvbCB0b29sLXBhbmVsJyxcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLnRhYmxlKHtcbiAgICAgICAgY2xhc3M6ICdmdHAtcmVtb3RlLWVkaXQtcHJvdG9jb2wtdGFibGUnLFxuICAgICAgICB0YWJpbmRleDogLTEsXG4gICAgICAgIG91dGxldDogJ3RhYmxlJyxcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy50aGVhZCh7XG4gICAgICAgICAgb3V0bGV0OiAnaGVhZCcsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRib2R5KHtcbiAgICAgICAgICBvdXRsZXQ6ICdsaXN0JyxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemUoc3RhdGUpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKHN0YXRlKVxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKHVyaSA9PiB7XG4gICAgICBpZiAodXJpID09PSBGVFBfUkVNT1RFX0VESVRfUFJPVE9DT0xfVVJJKSB7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oRlRQX1JFTU9URV9FRElUX1BST1RPQ09MX1VSSSwgeyBhY3RpdmF0ZVBhbmU6IGZhbHNlLCBhY3RpdmF0ZUl0ZW06IGZhbHNlIH0pO1xuXG4gICAgc2VsZi5oZWFkLnByZXBlbmQoYDx0cj48dGg+TG9jYWwgZmlsZTwvdGg+PHRoPkRpcmVjdGlvbjwvdGg+PHRoPlJlbW90ZSBmaWxlPC90aD48dGg+U2l6ZTwvdGg+PHRoPlByb2dyZXNzPC90aD48dGg+U3RhdHVzPC90aD48L3RyPmApO1xuXG4gICAgdHJ5IHtcbiAgICAgIFF1ZXVlLm9uRGlkQWRkRmlsZSA9IChpdGVtKSA9PiB7XG4gICAgICAgIHNlbGYubGlzdC5wcmVwZW5kKGl0ZW0pO1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHNlbGYubGlzdC5jaGlsZHJlbigpO1xuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gNTApIHtcbiAgICAgICAgICBjaGlsZHJlbi5sYXN0KCkucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtLm9uRXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnRwLXJlbW90ZS1lZGl0Lm5vdGlmaWNhdGlvbnMub3BlblByb3RvY29sVmlld09uRXJyb3InKSkge1xuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihGVFBfUkVNT1RFX0VESVRfUFJPVE9DT0xfVVJJKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gVE9ET1xuICAgICAgICB9O1xuXG4gICAgICAgIGl0ZW0ub25UcmFuc2ZlcnJpbmcgPSAoKSA9PiB7ICAgICBcbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgIH07XG5cbiAgICAgICAgaXRlbS5vbkZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgICAgIC8vVE9ET1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUubG9nKGUpOyB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5yZW1vdmUoKTtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiBcIlJlbW90ZSBUcmFuc2ZlciBMb2dcIjtcbiAgfVxuXG4gIGdldEljb25OYW1lKCkge1xuICAgIHJldHVybiBcImxpc3QtdW5vcmRlcmVkXCI7XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIEZUUF9SRU1PVEVfRURJVF9QUk9UT0NPTF9VUkk7XG4gIH1cblxuICBnZXRBbGxvd2VkTG9jYXRpb25zKCkge1xuICAgIHJldHVybiBbXCJib3R0b21cIl07XG4gIH1cblxuICBnZXREZWZhdWx0TG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIFwiYm90dG9tXCI7XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgYXRvbS53b3Jrc3BhY2UudG9nZ2xlKHRoaXMpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG9jb2xWaWV3O1xuIl19