Object.defineProperty(exports, "__esModule", {
	value: true
});
/** @babel */

exports["default"] = function (toolBar, button) {
	var options = {
		icon: button.icon,
		iconset: button.iconset,
		text: button.text,
		html: button.html,
		tooltip: button.tooltip,
		priority: button.priority || 45,
		data: button.file,
		background: button.background,
		color: button.color,
		"class": button["class"],
		callback: function callback(file) {
			atom.workspace.open(file);
		}
	};

	return toolBar.addButton(options);
};

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Wb2x1bWVzL1N0b3JhZ2UvUHJvamVjdHMvYXRvbS9wYWNrYWdlcy9mbGV4LXRvb2wtYmFyL2xpYi90eXBlcy9maWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUVlLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUN6QyxLQUFNLE9BQU8sR0FBRztBQUNmLE1BQUksRUFBRSxNQUFNLENBQUMsSUFBSTtBQUNqQixTQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87QUFDdkIsTUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO0FBQ2pCLE1BQUksRUFBRSxNQUFNLENBQUMsSUFBSTtBQUNqQixTQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87QUFDdkIsVUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLElBQUksRUFBRTtBQUMvQixNQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7QUFDakIsWUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVO0FBQzdCLE9BQUssRUFBRSxNQUFNLENBQUMsS0FBSztBQUNuQixXQUFPLE1BQU0sU0FBTTtBQUNuQixVQUFRLEVBQUUsa0JBQUMsSUFBSSxFQUFLO0FBQ25CLE9BQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFCO0VBQ0QsQ0FBQzs7QUFFRixRQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDbEMiLCJmaWxlIjoiL1ZvbHVtZXMvU3RvcmFnZS9Qcm9qZWN0cy9hdG9tL3BhY2thZ2VzL2ZsZXgtdG9vbC1iYXIvbGliL3R5cGVzL2ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh0b29sQmFyLCBidXR0b24pIHtcblx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHRpY29uOiBidXR0b24uaWNvbixcblx0XHRpY29uc2V0OiBidXR0b24uaWNvbnNldCxcblx0XHR0ZXh0OiBidXR0b24udGV4dCxcblx0XHRodG1sOiBidXR0b24uaHRtbCxcblx0XHR0b29sdGlwOiBidXR0b24udG9vbHRpcCxcblx0XHRwcmlvcml0eTogYnV0dG9uLnByaW9yaXR5IHx8IDQ1LFxuXHRcdGRhdGE6IGJ1dHRvbi5maWxlLFxuXHRcdGJhY2tncm91bmQ6IGJ1dHRvbi5iYWNrZ3JvdW5kLFxuXHRcdGNvbG9yOiBidXR0b24uY29sb3IsXG5cdFx0Y2xhc3M6IGJ1dHRvbi5jbGFzcyxcblx0XHRjYWxsYmFjazogKGZpbGUpID0+IHtcblx0XHRcdGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZSk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB0b29sQmFyLmFkZEJ1dHRvbihvcHRpb25zKTtcbn1cbiJdfQ==