var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _helperFormatJs = require('./../helper/format.js');

'use babel';

var ProtocolItemView = (function (_View) {
  _inherits(ProtocolItemView, _View);

  function ProtocolItemView() {
    _classCallCheck(this, ProtocolItemView);

    _get(Object.getPrototypeOf(ProtocolItemView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ProtocolItemView, [{
    key: 'initialize',
    value: function initialize(fileinfo) {
      var self = this;

      self.onError = function () {};
      self.onTransferring = function () {};
      self.onFinished = function () {};

      self.fileinfo = fileinfo;
      self.info = {
        client: fileinfo.client,
        direction: fileinfo.direction,
        remotePath: fileinfo.remotePath,
        localPath: fileinfo.localPath,
        size: fileinfo.size ? fileinfo.size : 0,
        progress: 0,
        stream: fileinfo.stream ? fileinfo.stream : null,
        status: fileinfo.status ? fileinfo.status : "Waiting"
      };

      if (self.info.direction == "download") {
        self.filename_a.html(self.info.localPath);
        self.filename_b.html(self.info.remotePath);
        self.direction.html("<--");
        self.size.html((0, _helperFormatJs.formatNumber)(self.info.size));
        self.status.html(self.info.status);
      } else {
        self.filename_a.html(self.info.localPath);
        self.filename_b.html(self.info.remotePath);
        self.direction.html("-->");
        self.size.html((0, _helperFormatJs.formatNumber)(self.info.size));
        self.status.html(self.info.status);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;

      self.remove();
    }
  }, {
    key: 'addStream',
    value: function addStream(stream) {
      var self = this;

      self.info.stream = stream;
    }
  }, {
    key: 'changeProgress',
    value: function changeProgress(data) {
      var self = this;

      self.info.progress = data;
      if (self.info.size && self.info.progress) {
        var percent = (100 / self.info.size * self.info.progress).toFixed(1);
        self.progress.html((0, _helperFormatJs.formatNumber)(self.info.progress) + ' (' + percent + ' %)');
      } else if (self.info.progress) {
        self.progress.html((0, _helperFormatJs.formatNumber)(self.info.progress) + ' (? %)');
      } else {
        self.progress.html('0 (0 %)');
      }
    }
  }, {
    key: 'changeStatus',
    value: function changeStatus(status) {
      var self = this;

      if (status.toLowerCase() == "connection closed" && self.info.status == "Transferring") {
        self.onError();
        self.info.status = 'Error';
        self.status.html('Error');
      } else if (status.toLowerCase() == "connection closed") {
        // Do nothing
      } else if (status.toLowerCase() == "error") {
          self.onError();
          self.info.status = status;
          self.status.html(self.info.status);
        } else if (status.toLowerCase() == "transferring" && self.info.status != "Waiting") {
          // Do nothing
        } else {
            if (status.toLowerCase() == "transferring") {
              self.onTransferring();
            } else if (status.toLowerCase() == "finished") {
              self.progress.html((0, _helperFormatJs.formatNumber)(self.info.size) + ' (100 %)');
              self.onFinished();
            }
            self.info.status = status;
            self.status.html(self.info.status);
          }
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this = this;

      return this.tr({
        'class': 'ftp-remote-edit-protocol-item'
      }, function () {
        _this.td({
          outlet: 'filename_a'
        });
        _this.td({
          outlet: 'direction'
        });
        _this.td({
          outlet: 'filename_b'
        });
        _this.td({
          outlet: 'size'
        });
        _this.td({
          outlet: 'progress'
        });
        _this.td({
          outlet: 'status'
        });
      });
    }
  }]);

  return ProtocolItemView;
})(_atomSpacePenViews.View);

module.exports = ProtocolItemView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9wcm90b2NvbC1pdGVtLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7aUNBRXFCLHNCQUFzQjs7OEJBQ2QsdUJBQXVCOztBQUhwRCxXQUFXLENBQUM7O0lBS04sZ0JBQWdCO1lBQWhCLGdCQUFnQjs7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7OytCQUFoQixnQkFBZ0I7OztlQUFoQixnQkFBZ0I7O1dBMkJWLG9CQUFDLFFBQVEsRUFBRTtBQUNuQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxPQUFPLEdBQUcsWUFBTSxFQUFHLENBQUM7QUFDekIsVUFBSSxDQUFDLGNBQWMsR0FBRyxZQUFNLEVBQUcsQ0FBQztBQUNoQyxVQUFJLENBQUMsVUFBVSxHQUFHLFlBQU0sRUFBRyxDQUFDOztBQUU1QixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixVQUFJLENBQUMsSUFBSSxHQUFHO0FBQ1YsY0FBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO0FBQ3ZCLGlCQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVM7QUFDN0Isa0JBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTtBQUMvQixpQkFBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTO0FBQzdCLFlBQUksRUFBRSxBQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUksUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ3pDLGdCQUFRLEVBQUUsQ0FBQztBQUNYLGNBQU0sRUFBRSxBQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJO0FBQ2xELGNBQU0sRUFBRSxBQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxTQUFTO09BQ3hELENBQUM7O0FBRUYsVUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMs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LENBQUM7QUFDTixnQkFBTSxFQUFFLFdBQVc7U0FDcEIsQ0FBQyxDQUFDO0FBQ0gsY0FBSyxFQUFFLENBQUM7QUFDTixnQkFBTSxFQUFFLFlBQVk7U0FDckIsQ0FBQyxDQUFDO0FBQ0gsY0FBSyxFQUFFLENBQUM7QUFDTixnQkFBTSxFQUFFLE1BQU07U0FDZixDQUFDLENBQUM7QUFDSCxjQUFLLEVBQUUsQ0FBQztBQUNOLGdCQUFNLEVBQUUsVUFBVTtTQUNuQixDQUFDLENBQUM7QUFDSCxjQUFLLEVBQUUsQ0FBQztBQUNOLGdCQUFNLEVBQUUsUUFBUTtTQUNqQixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBekJHLGdCQUFnQjs7O0FBbUh0QixNQUFNLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvZnRwLXJlbW90ZS1lZGl0L2xpYi92aWV3cy9wcm90b2NvbC1pdGVtLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCB7IGZvcm1hdE51bWJlciB9IGZyb20gJy4vLi4vaGVscGVyL2Zvcm1hdC5qcyc7XG5cbmNsYXNzIFByb3RvY29sSXRlbVZpZXcgZXh0ZW5kcyBWaWV3IHtcblxuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy50cih7XG4gICAgICBjbGFzczogJ2Z0cC1yZW1vdGUtZWRpdC1wcm90b2NvbC1pdGVtJyxcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLnRkKHtcbiAgICAgICAgb3V0bGV0OiAnZmlsZW5hbWVfYScsXG4gICAgICB9KTtcbiAgICAgIHRoaXMudGQoe1xuICAgICAgICBvdXRsZXQ6ICdkaXJlY3Rpb24nLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnRkKHtcbiAgICAgICAgb3V0bGV0OiAnZmlsZW5hbWVfYicsXG4gICAgICB9KTtcbiAgICAgIHRoaXMudGQoe1xuICAgICAgICBvdXRsZXQ6ICdzaXplJyxcbiAgICAgIH0pO1xuICAgICAgdGhpcy50ZCh7XG4gICAgICAgIG91dGxldDogJ3Byb2dyZXNzJyxcbiAgICAgIH0pO1xuICAgICAgdGhpcy50ZCh7XG4gICAgICAgIG91dGxldDogJ3N0YXR1cycsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemUoZmlsZWluZm8pIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYub25FcnJvciA9ICgpID0+IHsgfTtcbiAgICBzZWxmLm9uVHJhbnNmZXJyaW5nID0gKCkgPT4geyB9O1xuICAgIHNlbGYub25GaW5pc2hlZCA9ICgpID0+IHsgfTtcblxuICAgIHNlbGYuZmlsZWluZm8gPSBmaWxlaW5mbztcbiAgICBzZWxmLmluZm8gPSB7XG4gICAgICBjbGllbnQ6IGZpbGVpbmZvLmNsaWVudCxcbiAgICAgIGRpcmVjdGlvbjogZmlsZWluZm8uZGlyZWN0aW9uLFxuICAgICAgcmVtb3RlUGF0aDogZmlsZWluZm8ucmVtb3RlUGF0aCxcbiAgICAgIGxvY2FsUGF0aDogZmlsZWluZm8ubG9jYWxQYXRoLFxuICAgICAgc2l6ZTogKGZpbGVpbmZvLnNpemUpID8gZmlsZWluZm8uc2l6ZSA6IDAsXG4gICAgICBwcm9ncmVzczogMCxcbiAgICAgIHN0cmVhbTogKGZpbGVpbmZvLnN0cmVhbSkgPyBmaWxlaW5mby5zdHJlYW0gOiBudWxsLFxuICAgICAgc3RhdHVzOiAoZmlsZWluZm8uc3RhdHVzKSA/IGZpbGVpbmZvLnN0YXR1cyA6IFwiV2FpdGluZ1wiXG4gICAgfTtcblxuICAgIGlmIChzZWxmLmluZm8uZGlyZWN0aW9uID09IFwiZG93bmxvYWRcIikge1xuICAgICAgc2VsZi5maWxlbmFtZV9hLmh0bWwoc2VsZi5pbmZvLmxvY2FsUGF0aCk7XG4gICAgICBzZWxmLmZpbGVuYW1lX2IuaHRtbChzZWxmLmluZm8ucmVtb3RlUGF0aCk7XG4gICAgICBzZWxmLmRpcmVjdGlvbi5odG1sKFwiPC0tXCIpO1xuICAgICAgc2VsZi5zaXplLmh0bWwoZm9ybWF0TnVtYmVyKHNlbGYuaW5mby5zaXplKSk7XG4gICAgICBzZWxmLnN0YXR1cy5odG1sKHNlbGYuaW5mby5zdGF0dXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmZpbGVuYW1lX2EuaHRtbChzZWxmLmluZm8ubG9jYWxQYXRoKTtcbiAgICAgIHNlbGYuZmlsZW5hbWVfYi5odG1sKHNlbGYuaW5mby5yZW1vdGVQYXRoKTtcbiAgICAgIHNlbGYuZGlyZWN0aW9uLmh0bWwoXCItLT5cIik7XG4gICAgICBzZWxmLnNpemUuaHRtbChmb3JtYXROdW1iZXIoc2VsZi5pbmZvLnNpemUpKTtcbiAgICAgIHNlbGYuc3RhdHVzLmh0bWwoc2VsZi5pbmZvLnN0YXR1cyk7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHNlbGYucmVtb3ZlKCk7XG4gIH1cblxuICBhZGRTdHJlYW0oc3RyZWFtKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmluZm8uc3RyZWFtID0gc3RyZWFtO1xuICB9XG5cbiAgY2hhbmdlUHJvZ3Jlc3MoZGF0YSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5pbmZvLnByb2dyZXNzID0gZGF0YTtcbiAgICBpZiAoc2VsZi5pbmZvLnNpemUgJiYgc2VsZi5pbmZvLnByb2dyZXNzKSB7XG4gICAgICBjb25zdCBwZXJjZW50ID0gKDEwMCAvIHNlbGYuaW5mby5zaXplICogc2VsZi5pbmZvLnByb2dyZXNzKS50b0ZpeGVkKDEpO1xuICAgICAgc2VsZi5wcm9ncmVzcy5odG1sKGZvcm1hdE51bWJlcihzZWxmLmluZm8ucHJvZ3Jlc3MpICsgJyAoJyArIHBlcmNlbnQgKyAnICUpJyk7XG4gICAgfSBlbHNlIGlmIChzZWxmLmluZm8ucHJvZ3Jlc3MpIHtcbiAgICAgIHNlbGYucHJvZ3Jlc3MuaHRtbChmb3JtYXROdW1iZXIoc2VsZi5pbmZvLnByb2dyZXNzKSArICcgKD8gJSknKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5wcm9ncmVzcy5odG1sKCcwICgwICUpJyk7XG4gICAgfVxuICB9XG5cbiAgY2hhbmdlU3RhdHVzKHN0YXR1cykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHN0YXR1cy50b0xvd2VyQ2FzZSgpID09IFwiY29ubmVjdGlvbiBjbG9zZWRcIiAmJiBzZWxmLmluZm8uc3RhdHVzID09IFwiVHJhbnNmZXJyaW5nXCIpIHtcbiAgICAgIHNlbGYub25FcnJvcigpO1xuICAgICAgc2VsZi5pbmZvLnN0YXR1cyA9ICdFcnJvcic7XG4gICAgICBzZWxmLnN0YXR1cy5odG1sKCdFcnJvcicpO1xuICAgIH0gZWxzZSBpZiAoc3RhdHVzLnRvTG93ZXJDYXNlKCkgPT0gXCJjb25uZWN0aW9uIGNsb3NlZFwiKSB7XG4gICAgICAvLyBEbyBub3RoaW5nXG4gICAgfSBlbHNlIGlmIChzdGF0dXMudG9Mb3dlckNhc2UoKSA9PSBcImVycm9yXCIpIHtcbiAgICAgIHNlbGYub25FcnJvcigpO1xuICAgICAgc2VsZi5pbmZvLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgIHNlbGYuc3RhdHVzLmh0bWwoc2VsZi5pbmZvLnN0YXR1cyk7XG4gICAgfSBlbHNlIGlmIChzdGF0dXMudG9Mb3dlckNhc2UoKSA9PSBcInRyYW5zZmVycmluZ1wiICYmIHNlbGYuaW5mby5zdGF0dXMgIT0gXCJXYWl0aW5nXCIpIHtcbiAgICAgIC8vIERvIG5vdGhpbmdcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXR1cy50b0xvd2VyQ2FzZSgpID09IFwidHJhbnNmZXJyaW5nXCIpIHtcbiAgICAgICAgc2VsZi5vblRyYW5zZmVycmluZygpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0dXMudG9Mb3dlckNhc2UoKSA9PSBcImZpbmlzaGVkXCIpIHtcbiAgICAgICAgc2VsZi5wcm9ncmVzcy5odG1sKGZvcm1hdE51bWJlcihzZWxmLmluZm8uc2l6ZSkgKyAnICgxMDAgJSknKTtcbiAgICAgICAgc2VsZi5vbkZpbmlzaGVkKCk7XG4gICAgICB9XG4gICAgICBzZWxmLmluZm8uc3RhdHVzID0gc3RhdHVzO1xuICAgICAgc2VsZi5zdGF0dXMuaHRtbChzZWxmLmluZm8uc3RhdHVzKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm90b2NvbEl0ZW1WaWV3O1xuIl19