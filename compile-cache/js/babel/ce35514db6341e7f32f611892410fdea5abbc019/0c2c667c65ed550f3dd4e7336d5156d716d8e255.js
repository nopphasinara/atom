Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** @babel */

var _which = require("which");

var _which2 = _interopRequireDefault(_which);

var _commands = require("./commands");

var _commands2 = _interopRequireDefault(_commands);

var _Notifications = require("./Notifications");

exports["default"] = {
	gitPath: {
		type: "string",
		"default": _which2["default"].sync("git", { nothrow: true }) || "git",
		description: "Path to your git executable",
		order: 0
	},
	notifications: {
		type: "integer",
		"enum": _Notifications.NotificationsConfig["enum"],
		"default": _Notifications.NotificationsConfig["default"],
		order: 1
	},
	logFormat: {
		type: "string",
		title: "Default Log Format",
		description: "(see https://git-scm.com/docs/git-log#_pretty_formats)",
		"default": "medium",
		order: 2
	},
	treeView: {
		type: "boolean",
		title: "Tree View",
		description: "Show files as tree view",
		"default": true,
		order: 3
	},
	rebaseOnPull: {
		type: "boolean",
		title: "Rebase on Pull",
		description: "Rebase instead of merge on Pull and Sync",
		"default": false,
		order: 4
	},
	confirmationDialogs: {
		type: "object",
		order: 5,
		properties: Object.keys(_commands2["default"]).reduce(function (prev, cmd, idx) {
			if (_commands2["default"][cmd].confirm) {
				var label = _commands2["default"][cmd].label || _commands2["default"][cmd].confirm.label;
				prev[cmd] = {
					title: label,
					description: "Show confirmation dialog on " + label,
					type: "boolean",
					"default": true,
					order: idx
				};
			}
			return prev;
		}, {
			deleteRemote: {
				title: "Delete Remote",
				description: "Show confirmation dialog when deleting a remote branch",
				type: "boolean",
				"default": true,
				order: Object.keys(_commands2["default"]).length
			},
			deleteAfterMerge: {
				title: "Delete After Merge",
				description: "Show confirmation dialog when deleting a branch after merging",
				type: "boolean",
				"default": true,
				order: Object.keys(_commands2["default"]).length + 1
			}
		})
	},
	contextMenuItems: {
		type: "object",
		order: 6,
		properties: Object.keys(_commands2["default"]).reduce(function (prev, cmd, idx) {
			if (_commands2["default"][cmd].label) {
				prev[cmd] = {
					title: _commands2["default"][cmd].label,
					description: _commands2["default"][cmd].description,
					type: "boolean",
					"default": true,
					order: idx
				};
			}
			return prev;
		}, {})
	}
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9naXQtbWVudS9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O3dCQUNKLFlBQVk7Ozs7NkJBQ0MsaUJBQWlCOztxQkFFcEM7QUFDZCxRQUFPLEVBQUU7QUFDUixNQUFJLEVBQUUsUUFBUTtBQUNkLGFBQVMsbUJBQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxJQUFJLEtBQUs7QUFDcEQsYUFBVyxFQUFFLDZCQUE2QjtBQUMxQyxPQUFLLEVBQUUsQ0FBQztFQUNSO0FBQ0QsY0FBYSxFQUFFO0FBQ2QsTUFBSSxFQUFFLFNBQVM7QUFDZixVQUFNLDBDQUF3QjtBQUM5QixhQUFTLDZDQUEyQjtBQUNwQyxPQUFLLEVBQUUsQ0FBQztFQUNSO0FBQ0QsVUFBUyxFQUFFO0FBQ1YsTUFBSSxFQUFFLFFBQVE7QUFDZCxPQUFLLEVBQUUsb0JBQW9CO0FBQzNCLGFBQVcsRUFBRSx3REFBd0Q7QUFDckUsYUFBUyxRQUFRO0FBQ2pCLE9BQUssRUFBRSxDQUFDO0VBQ1I7QUFDRCxTQUFRLEVBQUU7QUFDVCxNQUFJLEVBQUUsU0FBUztBQUNmLE9BQUssRUFBRSxXQUFXO0FBQ2xCLGFBQVcsRUFBRSx5QkFBeUI7QUFDdEMsYUFBUyxJQUFJO0FBQ2IsT0FBSyxFQUFFLENBQUM7RUFDUjtBQUNELGFBQVksRUFBRTtBQUNiLE1BQUksRUFBRSxTQUFTO0FBQ2YsT0FBSyxFQUFFLGdCQUFnQjtBQUN2QixhQUFXLEVBQUUsMENBQTBDO0FBQ3ZELGFBQVMsS0FBSztBQUNkLE9BQUssRUFBRSxDQUFDO0VBQ1I7QUFDRCxvQkFBbUIsRUFBRTtBQUNwQixNQUFJLEVBQUUsUUFBUTtBQUNkLE9BQUssRUFBRSxDQUFDO0FBQ1IsWUFBVSxFQUFFLE1BQU0sQ0FBQyxJQUFJLHVCQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUs7QUFDNUQsT0FBSSxzQkFBUyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU7QUFDMUIsUUFBTSxLQUFLLEdBQUcsc0JBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLHNCQUFTLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDakUsUUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHO0FBQ1gsVUFBSyxFQUFFLEtBQUs7QUFDWixnQkFBVyxtQ0FBaUMsS0FBSyxBQUFFO0FBQ25ELFNBQUksRUFBRSxTQUFTO0FBQ2YsZ0JBQVMsSUFBSTtBQUNiLFVBQUssRUFBRSxHQUFHO0tBQ1YsQ0FBQztJQUNGO0FBQ0QsVUFBTyxJQUFJLENBQUM7R0FDWixFQUFFO0FBQ0YsZUFBWSxFQUFFO0FBQ2IsU0FBSyxFQUFFLGVBQWU7QUFDdEIsZUFBVyxFQUFFLHdEQUF3RDtBQUNyRSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxNQUFNLENBQUMsSUFBSSx1QkFBVSxDQUFDLE1BQU07SUFDbkM7QUFDRCxtQkFBZ0IsRUFBRTtBQUNqQixTQUFLLEVBQUUsb0JBQW9CO0FBQzNCLGVBQVcsRUFBRSwrREFBK0Q7QUFDNUUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksdUJBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQztJQUN2QztHQUNELENBQUM7RUFDRjtBQUNELGlCQUFnQixFQUFFO0FBQ2pCLE1BQUksRUFBRSxRQUFRO0FBQ2QsT0FBSyxFQUFFLENBQUM7QUFDUixZQUFVLEVBQUUsTUFBTSxDQUFDLElBQUksdUJBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBSztBQUM1RCxPQUFJLHNCQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRTtBQUN4QixRQUFJLENBQUMsR0FBRyxDQUFDLEdBQUc7QUFDWCxVQUFLLEVBQUUsc0JBQVMsR0FBRyxDQUFDLENBQUMsS0FBSztBQUMxQixnQkFBVyxFQUFFLHNCQUFTLEdBQUcsQ0FBQyxDQUFDLFdBQVc7QUFDdEMsU0FBSSxFQUFFLFNBQVM7QUFDZixnQkFBUyxJQUFJO0FBQ2IsVUFBSyxFQUFFLEdBQUc7S0FDVixDQUFDO0lBQ0Y7QUFDRCxVQUFPLElBQUksQ0FBQztHQUNaLEVBQUUsRUFBRSxDQUFDO0VBQ047Q0FDRCIsImZpbGUiOiIvVm9sdW1lcy9TdG9yYWdlL1Byb2plY3RzL2F0b20vcGFja2FnZXMvZ2l0LW1lbnUvbGliL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHdoaWNoIGZyb20gXCJ3aGljaFwiO1xuaW1wb3J0IGNvbW1hbmRzIGZyb20gXCIuL2NvbW1hbmRzXCI7XG5pbXBvcnQge05vdGlmaWNhdGlvbnNDb25maWd9IGZyb20gXCIuL05vdGlmaWNhdGlvbnNcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRnaXRQYXRoOiB7XG5cdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRkZWZhdWx0OiB3aGljaC5zeW5jKFwiZ2l0XCIsIHtub3Rocm93OiB0cnVlfSkgfHwgXCJnaXRcIixcblx0XHRkZXNjcmlwdGlvbjogXCJQYXRoIHRvIHlvdXIgZ2l0IGV4ZWN1dGFibGVcIixcblx0XHRvcmRlcjogMCxcblx0fSxcblx0bm90aWZpY2F0aW9uczoge1xuXHRcdHR5cGU6IFwiaW50ZWdlclwiLFxuXHRcdGVudW06IE5vdGlmaWNhdGlvbnNDb25maWcuZW51bSxcblx0XHRkZWZhdWx0OiBOb3RpZmljYXRpb25zQ29uZmlnLmRlZmF1bHQsXG5cdFx0b3JkZXI6IDEsXG5cdH0sXG5cdGxvZ0Zvcm1hdDoge1xuXHRcdHR5cGU6IFwic3RyaW5nXCIsXG5cdFx0dGl0bGU6IFwiRGVmYXVsdCBMb2cgRm9ybWF0XCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiKHNlZSBodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0LWxvZyNfcHJldHR5X2Zvcm1hdHMpXCIsXG5cdFx0ZGVmYXVsdDogXCJtZWRpdW1cIixcblx0XHRvcmRlcjogMixcblx0fSxcblx0dHJlZVZpZXc6IHtcblx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHR0aXRsZTogXCJUcmVlIFZpZXdcIixcblx0XHRkZXNjcmlwdGlvbjogXCJTaG93IGZpbGVzIGFzIHRyZWUgdmlld1wiLFxuXHRcdGRlZmF1bHQ6IHRydWUsXG5cdFx0b3JkZXI6IDMsXG5cdH0sXG5cdHJlYmFzZU9uUHVsbDoge1xuXHRcdHR5cGU6IFwiYm9vbGVhblwiLFxuXHRcdHRpdGxlOiBcIlJlYmFzZSBvbiBQdWxsXCIsXG5cdFx0ZGVzY3JpcHRpb246IFwiUmViYXNlIGluc3RlYWQgb2YgbWVyZ2Ugb24gUHVsbCBhbmQgU3luY1wiLFxuXHRcdGRlZmF1bHQ6IGZhbHNlLFxuXHRcdG9yZGVyOiA0LFxuXHR9LFxuXHRjb25maXJtYXRpb25EaWFsb2dzOiB7XG5cdFx0dHlwZTogXCJvYmplY3RcIixcblx0XHRvcmRlcjogNSxcblx0XHRwcm9wZXJ0aWVzOiBPYmplY3Qua2V5cyhjb21tYW5kcykucmVkdWNlKChwcmV2LCBjbWQsIGlkeCkgPT4ge1xuXHRcdFx0aWYgKGNvbW1hbmRzW2NtZF0uY29uZmlybSkge1xuXHRcdFx0XHRjb25zdCBsYWJlbCA9IGNvbW1hbmRzW2NtZF0ubGFiZWwgfHwgY29tbWFuZHNbY21kXS5jb25maXJtLmxhYmVsO1xuXHRcdFx0XHRwcmV2W2NtZF0gPSB7XG5cdFx0XHRcdFx0dGl0bGU6IGxhYmVsLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBgU2hvdyBjb25maXJtYXRpb24gZGlhbG9nIG9uICR7bGFiZWx9YCxcblx0XHRcdFx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRcdFx0XHRkZWZhdWx0OiB0cnVlLFxuXHRcdFx0XHRcdG9yZGVyOiBpZHgsXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHJldjtcblx0XHR9LCB7XG5cdFx0XHRkZWxldGVSZW1vdGU6IHtcblx0XHRcdFx0dGl0bGU6IFwiRGVsZXRlIFJlbW90ZVwiLFxuXHRcdFx0XHRkZXNjcmlwdGlvbjogXCJTaG93IGNvbmZpcm1hdGlvbiBkaWFsb2cgd2hlbiBkZWxldGluZyBhIHJlbW90ZSBicmFuY2hcIixcblx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdGRlZmF1bHQ6IHRydWUsXG5cdFx0XHRcdG9yZGVyOiBPYmplY3Qua2V5cyhjb21tYW5kcykubGVuZ3RoLFxuXHRcdFx0fSxcblx0XHRcdGRlbGV0ZUFmdGVyTWVyZ2U6IHtcblx0XHRcdFx0dGl0bGU6IFwiRGVsZXRlIEFmdGVyIE1lcmdlXCIsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBcIlNob3cgY29uZmlybWF0aW9uIGRpYWxvZyB3aGVuIGRlbGV0aW5nIGEgYnJhbmNoIGFmdGVyIG1lcmdpbmdcIixcblx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdGRlZmF1bHQ6IHRydWUsXG5cdFx0XHRcdG9yZGVyOiBPYmplY3Qua2V5cyhjb21tYW5kcykubGVuZ3RoICsgMSxcblx0XHRcdH0sXG5cdFx0fSksXG5cdH0sXG5cdGNvbnRleHRNZW51SXRlbXM6IHtcblx0XHR0eXBlOiBcIm9iamVjdFwiLFxuXHRcdG9yZGVyOiA2LFxuXHRcdHByb3BlcnRpZXM6IE9iamVjdC5rZXlzKGNvbW1hbmRzKS5yZWR1Y2UoKHByZXYsIGNtZCwgaWR4KSA9PiB7XG5cdFx0XHRpZiAoY29tbWFuZHNbY21kXS5sYWJlbCkge1xuXHRcdFx0XHRwcmV2W2NtZF0gPSB7XG5cdFx0XHRcdFx0dGl0bGU6IGNvbW1hbmRzW2NtZF0ubGFiZWwsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246IGNvbW1hbmRzW2NtZF0uZGVzY3JpcHRpb24sXG5cdFx0XHRcdFx0dHlwZTogXCJib29sZWFuXCIsXG5cdFx0XHRcdFx0ZGVmYXVsdDogdHJ1ZSxcblx0XHRcdFx0XHRvcmRlcjogaWR4LFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHByZXY7XG5cdFx0fSwge30pLFxuXHR9LFxufTtcbiJdfQ==