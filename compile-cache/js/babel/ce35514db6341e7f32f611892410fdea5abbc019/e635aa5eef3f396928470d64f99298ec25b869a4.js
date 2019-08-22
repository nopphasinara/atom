var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var FtpLogView = (function (_ScrollView) {
  _inherits(FtpLogView, _ScrollView);

  function FtpLogView() {
    _classCallCheck(this, FtpLogView);

    _get(Object.getPrototypeOf(FtpLogView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(FtpLogView, [{
    key: 'initialize',
    value: function initialize(state) {
      _get(Object.getPrototypeOf(FtpLogView.prototype), 'initialize', this).call(this, state);

      var self = this;

      // Resize Panel
      self.verticalResize.on('mousedown', function (e) {
        self.resizeVerticalStarted(e);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;

      self.remove();
    }
  }, {
    key: 'addLine',
    value: function addLine(msg) {
      var self = this;

      self.log.prepend('<li>' + msg + '</li>');
      var children = self.log.children();
      if (children.length > 50) {
        children.last().remove();
      }
    }
  }, {
    key: 'resizeVerticalStarted',
    value: function resizeVerticalStarted(e) {
      e.preventDefault();

      this.resizeHeightStart = this.height();
      this.resizeMouseStart = e.pageY;
      (0, _atomSpacePenViews.$)(document).on('mousemove', this.resizeVerticalView.bind(this));
      (0, _atomSpacePenViews.$)(document).on('mouseup', this.resizeVerticalStopped);
    }
  }, {
    key: 'resizeVerticalStopped',
    value: function resizeVerticalStopped() {
      delete this.resizeHeightStart;
      delete this.resizeMouseStart;
      (0, _atomSpacePenViews.$)(document).off('mousemove', this.resizeVerticalView);
      (0, _atomSpacePenViews.$)(document).off('mouseup', this.resizeVerticalStopped);
    }
  }, {
    key: 'resizeVerticalView',
    value: function resizeVerticalView(e) {
      if (e.which !== 1) {
        return this.resizeVerticalStopped();
      }

      var delta = e.pageY - this.resizeMouseStart;
      var height = Math.max(26, this.resizeHeightStart - delta);

      this.height(height);
      this.parentView.scroller.css('bottom', height + 'px');
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this = this;

      return this.div({
        'class': 'ftp-remote-edit-queue tool-panel panel-bottom',
        tabindex: -1,
        outlet: 'queue'
      }, function () {
        _this.ul({
          'class': 'list',
          tabindex: -1,
          outlet: 'log'
        });
        _this.div({
          'class': 'ftp-remote-edit-resize-handle',
          outlet: 'verticalResize'
        });
      });
    }
  }]);

  return FtpLogView;
})(_atomSpacePenViews.ScrollView);

module.exports = FtpLogView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9mdHAtbG9nLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7aUNBRThCLHNCQUFzQjs7QUFGcEQsV0FBVyxDQUFDOztJQUlOLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FvQkosb0JBQUMsS0FBSyxFQUFFO0FBQ2hCLGlDQXJCRSxVQUFVLDRDQXFCSyxLQUFLLEVBQUM7O0FBRXZCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7O0FBR2xCLFVBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFDLENBQUMsRUFBSztBQUN6QyxZQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDL0IsQ0FBQyxDQUFDO0tBQ0o7OztXQUVNLG1CQUFHO0FBQ1IsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1dBRU0saUJBQUMsR0FBRyxFQUFFO0FBQ1gsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sVUFBUSxHQUFHLFdBQVEsQ0FBQztBQUNwQyxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3JDLFVBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7QUFDeEIsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUMxQjtLQUNGOzs7V0FFb0IsK0JBQUMsQ0FBQyxFQUFFO0FBQ3ZCLE9BQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFbkIsVUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN2QyxVQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUNoQyxnQ0FBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNoRSxnQ0FBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0tBQ3ZEOzs7V0FFb0IsaUNBQUc7QUFDdEIsYUFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7QUFDOUIsYUFBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7QUFDN0IsZ0NBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN0RCxnQ0FBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0tBQ3hEOzs7V0FFaUIsNEJBQUMsQ0FBQyxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDakIsZUFBTyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztPQUNyQzs7QUFFRCxVQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztBQUM1QyxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLENBQUM7O0FBRTFELFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBSyxNQUFNLFFBQUssQ0FBQztLQUN2RDs7O1dBdkVhLG1CQUFHOzs7QUFDZixhQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDZCxpQkFBTywrQ0FBK0M7QUFDdEQsZ0JBQVEsRUFBRSxDQUFDLENBQUM7QUFDWixjQUFNLEVBQUUsT0FBTztPQUNoQixFQUFFLFlBQU07QUFDUCxjQUFLLEVBQUUsQ0FBQztBQUNOLG1CQUFPLE1BQU07QUFDYixrQkFBUSxFQUFFLENBQUMsQ0FBQztBQUNaLGdCQUFNLEVBQUUsS0FBSztTQUNkLENBQUMsQ0FBQztBQUNILGNBQUssR0FBRyxDQUFDO0FBQ1AsbUJBQU8sK0JBQStCO0FBQ3RDLGdCQUFNLEVBQUUsZ0JBQWdCO1NBQ3pCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0FsQkcsVUFBVTs7O0FBNEVoQixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc3VkcHJhd2F0Ly5hdG9tL3BhY2thZ2VzL2Z0cC1yZW1vdGUtZWRpdC9saWIvdmlld3MvZnRwLWxvZy12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7ICQsIFNjcm9sbFZpZXcgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5cbmNsYXNzIEZ0cExvZ1ZpZXcgZXh0ZW5kcyBTY3JvbGxWaWV3IHtcblxuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXYoe1xuICAgICAgY2xhc3M6ICdmdHAtcmVtb3RlLWVkaXQtcXVldWUgdG9vbC1wYW5lbCBwYW5lbC1ib3R0b20nLFxuICAgICAgdGFiaW5kZXg6IC0xLFxuICAgICAgb3V0bGV0OiAncXVldWUnLFxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMudWwoe1xuICAgICAgICBjbGFzczogJ2xpc3QnLFxuICAgICAgICB0YWJpbmRleDogLTEsXG4gICAgICAgIG91dGxldDogJ2xvZycsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgY2xhc3M6ICdmdHAtcmVtb3RlLWVkaXQtcmVzaXplLWhhbmRsZScsXG4gICAgICAgIG91dGxldDogJ3ZlcnRpY2FsUmVzaXplJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShzdGF0ZSkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoc3RhdGUpXG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIC8vIFJlc2l6ZSBQYW5lbFxuICAgIHNlbGYudmVydGljYWxSZXNpemUub24oJ21vdXNlZG93bicsIChlKSA9PiB7XG4gICAgICBzZWxmLnJlc2l6ZVZlcnRpY2FsU3RhcnRlZChlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnJlbW92ZSgpO1xuICB9XG5cbiAgYWRkTGluZShtc2cpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYubG9nLnByZXBlbmQoYDxsaT4ke21zZ308L2xpPmApO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gc2VsZi5sb2cuY2hpbGRyZW4oKTtcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gNTApIHtcbiAgICAgIGNoaWxkcmVuLmxhc3QoKS5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICByZXNpemVWZXJ0aWNhbFN0YXJ0ZWQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIHRoaXMucmVzaXplSGVpZ2h0U3RhcnQgPSB0aGlzLmhlaWdodCgpO1xuICAgIHRoaXMucmVzaXplTW91c2VTdGFydCA9IGUucGFnZVk7XG4gICAgJChkb2N1bWVudCkub24oJ21vdXNlbW92ZScsIHRoaXMucmVzaXplVmVydGljYWxWaWV3LmJpbmQodGhpcykpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZXVwJywgdGhpcy5yZXNpemVWZXJ0aWNhbFN0b3BwZWQpO1xuICB9XG5cbiAgcmVzaXplVmVydGljYWxTdG9wcGVkKCkge1xuICAgIGRlbGV0ZSB0aGlzLnJlc2l6ZUhlaWdodFN0YXJ0O1xuICAgIGRlbGV0ZSB0aGlzLnJlc2l6ZU1vdXNlU3RhcnQ7XG4gICAgJChkb2N1bWVudCkub2ZmKCdtb3VzZW1vdmUnLCB0aGlzLnJlc2l6ZVZlcnRpY2FsVmlldyk7XG4gICAgJChkb2N1bWVudCkub2ZmKCdtb3VzZXVwJywgdGhpcy5yZXNpemVWZXJ0aWNhbFN0b3BwZWQpO1xuICB9XG5cbiAgcmVzaXplVmVydGljYWxWaWV3KGUpIHtcbiAgICBpZiAoZS53aGljaCAhPT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzaXplVmVydGljYWxTdG9wcGVkKCk7XG4gICAgfVxuXG4gICAgbGV0IGRlbHRhID0gZS5wYWdlWSAtIHRoaXMucmVzaXplTW91c2VTdGFydDtcbiAgICBsZXQgaGVpZ2h0ID0gTWF0aC5tYXgoMjYsIHRoaXMucmVzaXplSGVpZ2h0U3RhcnQgLSBkZWx0YSk7XG5cbiAgICB0aGlzLmhlaWdodChoZWlnaHQpO1xuICAgIHRoaXMucGFyZW50Vmlldy5zY3JvbGxlci5jc3MoJ2JvdHRvbScsIGAke2hlaWdodH1weGApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRnRwTG9nVmlldztcbiJdfQ==