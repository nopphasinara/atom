Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.isVerbose = isVerbose;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @babel */

var _atom = require("atom");

var CONFIG_YES = 0;
exports.CONFIG_YES = CONFIG_YES;
var CONFIG_NO = 1;
exports.CONFIG_NO = CONFIG_NO;
var CONFIG_ONLY_ERROR = 2;
exports.CONFIG_ONLY_ERROR = CONFIG_ONLY_ERROR;
var CONFIG_GIT = 3;
exports.CONFIG_GIT = CONFIG_GIT;
var CONFIG_GIT_VERBOSE = 4;

exports.CONFIG_GIT_VERBOSE = CONFIG_GIT_VERBOSE;
var NotificationsConfig = {
	"default": CONFIG_YES,
	"enum": [{ value: CONFIG_YES, description: "Simple" }, { value: CONFIG_NO, description: "None" }, { value: CONFIG_ONLY_ERROR, description: "Only Errors" }, { value: CONFIG_GIT, description: "Git Output" }, { value: CONFIG_GIT_VERBOSE, description: "Verbose Git Output" }]
};

exports.NotificationsConfig = NotificationsConfig;

function isVerbose() {
	return atom.config.get("git-menu.notifications") === CONFIG_GIT_VERBOSE;
}

var Notifications = (function () {
	function Notifications() {
		_classCallCheck(this, Notifications);
	}

	_createClass(Notifications, null, [{
		key: "addNotification",
		value: function addNotification(type, title, message, options) {
			switch (atom.config.get("git-menu.notifications")) {
				case CONFIG_NO:
					return;
				case CONFIG_ONLY_ERROR:
					if (type !== "error") {
						return;
					}
					break;
				case CONFIG_GIT:
				case CONFIG_GIT_VERBOSE:
					if (type === "git") {
						// eslint-disable-next-line no-param-reassign
						type = "info";
					} else if (type !== "error") {
						return;
					}
					break;
				case CONFIG_YES:
				default:
					if (type === "git") {
						// eslint-disable-next-line no-param-reassign
						type = "info";
					}
			}

			if (!title) {
				throw new Error("Notification title must be specified.");
			}

			if (typeof message === "object") {
				// eslint-disable-next-line no-param-reassign
				options = message;
			} else {
				if (typeof options !== "object") {
					// eslint-disable-next-line no-param-reassign
					options = {};
				}
				options.detail = message;
			}

			if (options.detail) {
				atom.notifications.addNotification(new _atom.Notification(type, title, options));
			}
		}
	}, {
		key: "addSuccess",
		value: function addSuccess(title, message, options) {
			Notifications.addNotification("success", title, message, options);
		}
	}, {
		key: "addError",
		value: function addError(title, message, options) {

			// default dismissable to true
			if (typeof options !== "object") {
				if (typeof message === "object") {
					if (typeof message.dismissable === "undefined") {
						message.dismissable = true;
					}
				} else {
					// eslint-disable-next-line no-param-reassign
					options = {
						dismissable: true
					};
				}
			} else if (typeof options.dismissable === "undefined") {
				options.dismissable = true;
			}
			Notifications.addNotification("error", title, message, options);
		}
	}, {
		key: "addInfo",
		value: function addInfo(title, message, options) {
			Notifications.addNotification("info", title, message, options);
		}
	}, {
		key: "addGit",
		value: function addGit(title, message, options) {
			if (Array.isArray(message)) {
				// eslint-disable-next-line no-param-reassign
				message = message.filter(function (m) {
					return !!m;
				}).join("\n\n");
			}
			if (message !== "") {
				Notifications.addNotification("git", title, message, options);
			}
		}
	}]);

	return Notifications;
})();

exports["default"] = Notifications;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvTm90aWZpY2F0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRTJCLE1BQU07O0FBRTFCLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQzs7QUFDckIsSUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDOztBQUNwQixJQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQzs7QUFDNUIsSUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDOztBQUNyQixJQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQzs7O0FBRTdCLElBQU0sbUJBQW1CLEdBQUc7QUFDbEMsWUFBUyxVQUFVO0FBQ25CLFNBQU0sQ0FDTCxFQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQyxFQUMxQyxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBQyxFQUN2QyxFQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFDLEVBQ3RELEVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDLEVBQzlDLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxvQkFBb0IsRUFBQyxDQUM5RDtDQUNELENBQUM7Ozs7QUFFSyxTQUFTLFNBQVMsR0FBRztBQUMzQixRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLEtBQUssa0JBQWtCLENBQUU7Q0FDMUU7O0lBRW9CLGFBQWE7VUFBYixhQUFhO3dCQUFiLGFBQWE7OztjQUFiLGFBQWE7O1NBQ1gseUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3JELFdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUM7QUFDakQsU0FBSyxTQUFT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Y2thZ2VzL2dpdC1tZW51L2xpYi9Ob3RpZmljYXRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQge05vdGlmaWNhdGlvbn0gZnJvbSBcImF0b21cIjtcblxuZXhwb3J0IGNvbnN0IENPTkZJR19ZRVMgPSAwO1xuZXhwb3J0IGNvbnN0IENPTkZJR19OTyA9IDE7XG5leHBvcnQgY29uc3QgQ09ORklHX09OTFlfRVJST1IgPSAyO1xuZXhwb3J0IGNvbnN0IENPTkZJR19HSVQgPSAzO1xuZXhwb3J0IGNvbnN0IENPTkZJR19HSVRfVkVSQk9TRSA9IDQ7XG5cbmV4cG9ydCBjb25zdCBOb3RpZmljYXRpb25zQ29uZmlnID0ge1xuXHRkZWZhdWx0OiBDT05GSUdfWUVTLFxuXHRlbnVtOiBbXG5cdFx0e3ZhbHVlOiBDT05GSUdfWUVTLCBkZXNjcmlwdGlvbjogXCJTaW1wbGVcIn0sXG5cdFx0e3ZhbHVlOiBDT05GSUdfTk8sIGRlc2NyaXB0aW9uOiBcIk5vbmVcIn0sXG5cdFx0e3ZhbHVlOiBDT05GSUdfT05MWV9FUlJPUiwgZGVzY3JpcHRpb246IFwiT25seSBFcnJvcnNcIn0sXG5cdFx0e3ZhbHVlOiBDT05GSUdfR0lULCBkZXNjcmlwdGlvbjogXCJHaXQgT3V0cHV0XCJ9LFxuXHRcdHt2YWx1ZTogQ09ORklHX0dJVF9WRVJCT1NFLCBkZXNjcmlwdGlvbjogXCJWZXJib3NlIEdpdCBPdXRwdXRcIn0sXG5cdF0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNWZXJib3NlKCkge1xuXHRyZXR1cm4gKGF0b20uY29uZmlnLmdldChcImdpdC1tZW51Lm5vdGlmaWNhdGlvbnNcIikgPT09IENPTkZJR19HSVRfVkVSQk9TRSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdGlmaWNhdGlvbnMge1xuXHRzdGF0aWMgYWRkTm90aWZpY2F0aW9uKHR5cGUsIHRpdGxlLCBtZXNzYWdlLCBvcHRpb25zKSB7XG5cdFx0c3dpdGNoIChhdG9tLmNvbmZpZy5nZXQoXCJnaXQtbWVudS5ub3RpZmljYXRpb25zXCIpKSB7XG5cdFx0Y2FzZSBDT05GSUdfTk86XG5cdFx0XHRyZXR1cm47XG5cdFx0Y2FzZSBDT05GSUdfT05MWV9FUlJPUjpcblx0XHRcdGlmICh0eXBlICE9PSBcImVycm9yXCIpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBDT05GSUdfR0lUOlxuXHRcdGNhc2UgQ09ORklHX0dJVF9WRVJCT1NFOlxuXHRcdFx0aWYgKHR5cGUgPT09IFwiZ2l0XCIpIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG5cdFx0XHRcdHR5cGUgPSBcImluZm9cIjtcblx0XHRcdH0gZWxzZSBpZiAodHlwZSAhPT0gXCJlcnJvclwiKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgQ09ORklHX1lFUzpcblx0XHRkZWZhdWx0OlxuXHRcdFx0aWYgKHR5cGUgPT09IFwiZ2l0XCIpIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG5cdFx0XHRcdHR5cGUgPSBcImluZm9cIjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXRpdGxlKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJOb3RpZmljYXRpb24gdGl0bGUgbXVzdCBiZSBzcGVjaWZpZWQuXCIpO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG5cdFx0XHRvcHRpb25zID0gbWVzc2FnZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuXHRcdFx0XHRvcHRpb25zID0ge307XG5cdFx0XHR9XG5cdFx0XHRvcHRpb25zLmRldGFpbCA9IG1lc3NhZ2U7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMuZGV0YWlsKSB7XG5cdFx0XHRhdG9tLm5vdGlmaWNhdGlvbnMuYWRkTm90aWZpY2F0aW9uKG5ldyBOb3RpZmljYXRpb24odHlwZSwgdGl0bGUsIG9wdGlvbnMpKTtcblx0XHR9XG5cdH1cblxuXHRzdGF0aWMgYWRkU3VjY2Vzcyh0aXRsZSwgbWVzc2FnZSwgb3B0aW9ucykge1xuXHRcdE5vdGlmaWNhdGlvbnMuYWRkTm90aWZpY2F0aW9uKFwic3VjY2Vzc1wiLCB0aXRsZSwgbWVzc2FnZSwgb3B0aW9ucyk7XG5cdH1cblxuXHRzdGF0aWMgYWRkRXJyb3IodGl0bGUsIG1lc3NhZ2UsIG9wdGlvbnMpIHtcblxuXHRcdC8vIGRlZmF1bHQgZGlzbWlzc2FibGUgdG8gdHJ1ZVxuXHRcdGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gXCJvYmplY3RcIikge1xuXHRcdFx0aWYgKHR5cGVvZiBtZXNzYWdlID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgbWVzc2FnZS5kaXNtaXNzYWJsZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdG1lc3NhZ2UuZGlzbWlzc2FibGUgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cblx0XHRcdFx0b3B0aW9ucyA9IHtcblx0XHRcdFx0XHRkaXNtaXNzYWJsZTogdHJ1ZSxcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmRpc21pc3NhYmxlID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRvcHRpb25zLmRpc21pc3NhYmxlID0gdHJ1ZTtcblx0XHR9XG5cdFx0Tm90aWZpY2F0aW9ucy5hZGROb3RpZmljYXRpb24oXCJlcnJvclwiLCB0aXRsZSwgbWVzc2FnZSwgb3B0aW9ucyk7XG5cdH1cblxuXHRzdGF0aWMgYWRkSW5mbyh0aXRsZSwgbWVzc2FnZSwgb3B0aW9ucykge1xuXHRcdE5vdGlmaWNhdGlvbnMuYWRkTm90aWZpY2F0aW9uKFwiaW5mb1wiLCB0aXRsZSwgbWVzc2FnZSwgb3B0aW9ucyk7XG5cdH1cblxuXHRzdGF0aWMgYWRkR2l0KHRpdGxlLCBtZXNzYWdlLCBvcHRpb25zKSB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkobWVzc2FnZSkpIHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuXHRcdFx0bWVzc2FnZSA9IG1lc3NhZ2UuZmlsdGVyKG0gPT4gISFtKS5qb2luKFwiXFxuXFxuXCIpO1xuXHRcdH1cblx0XHRpZiAobWVzc2FnZSAhPT0gXCJcIikge1xuXHRcdFx0Tm90aWZpY2F0aW9ucy5hZGROb3RpZmljYXRpb24oXCJnaXRcIiwgdGl0bGUsIG1lc3NhZ2UsIG9wdGlvbnMpO1xuXHRcdH1cblx0fVxufVxuIl19