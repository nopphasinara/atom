Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
exports.provideEventService = provideEventService;
/** @babel */

var _controller = require('./controller');

// Instance of the controller, constructed on activation.
var controller = null;

var _config = require('./config');

Object.defineProperty(exports, 'config', {
    enumerable: true,
    get: function get() {
        return _config.config;
    }
});

var _view = require('./view');

Object.defineProperty(exports, 'consumeElementIcons', {
    enumerable: true,
    get: function get() {
        return _view.consumeElementIcons;
    }
});

function activate(state) {
    controller = new _controller.AdvancedOpenFileController();
}

function deactivate() {
    controller.detach();
    controller.destroy();
    controller = null;
}

/**
 * Provide a service object allowing other packages to subscribe to our
 * events.
 */

function provideEventService() {
    return {
        onDidOpenPath: function onDidOpenPath(callback) {
            return _controller.emitter.on('did-open-path', callback);
        },

        onDidCreatePath: function onDidCreatePath(callback) {
            return _controller.emitter.on('did-create-path', callback);
        }
    };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9hZHZhbmNlZC1vcGVuLWZpbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBQ2tELGNBQWM7OztBQUloRSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUE7O3NCQUVBLFVBQVU7Ozs7O3VCQUF2QixNQUFNOzs7O29CQUNvQixRQUFROzs7OztxQkFBbEMsbUJBQW1COzs7O0FBRXBCLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUM1QixjQUFVLEdBQUcsNENBQWdDLENBQUM7Q0FDakQ7O0FBRU0sU0FBUyxVQUFVLEdBQUc7QUFDekIsY0FBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLGNBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQixjQUFVLEdBQUcsSUFBSSxDQUFDO0NBQ3JCOzs7Ozs7O0FBTU0sU0FBUyxtQkFBbUIsR0FBRztBQUNsQyxXQUFPO0FBQ0gscUJBQWEsRUFBQSx1QkFBQyxRQUFRLEVBQUU7QUFDcEIsbUJBQU8sb0JBQVEsRUFBRSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNoRDs7QUFFRCx1QkFBZSxFQUFBLHlCQUFDLFFBQVEsRUFBRTtBQUN0QixtQkFBTyxvQkFBUSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDbEQ7S0FDSixDQUFDO0NBQ0wiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvbGliL2FkdmFuY2VkLW9wZW4tZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbmltcG9ydCB7QWR2YW5jZWRPcGVuRmlsZUNvbnRyb2xsZXIsIGVtaXR0ZXJ9IGZyb20gJy4vY29udHJvbGxlcic7XG5cblxuLy8gSW5zdGFuY2Ugb2YgdGhlIGNvbnRyb2xsZXIsIGNvbnN0cnVjdGVkIG9uIGFjdGl2YXRpb24uXG5sZXQgY29udHJvbGxlciA9IG51bGxcblxuZXhwb3J0IHtjb25maWd9IGZyb20gJy4vY29uZmlnJztcbmV4cG9ydCB7Y29uc3VtZUVsZW1lbnRJY29uc30gZnJvbSAnLi92aWV3JztcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgY29udHJvbGxlciA9IG5ldyBBZHZhbmNlZE9wZW5GaWxlQ29udHJvbGxlcigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgICBjb250cm9sbGVyLmRldGFjaCgpO1xuICAgIGNvbnRyb2xsZXIuZGVzdHJveSgpO1xuICAgIGNvbnRyb2xsZXIgPSBudWxsO1xufVxuXG4vKipcbiAqIFByb3ZpZGUgYSBzZXJ2aWNlIG9iamVjdCBhbGxvd2luZyBvdGhlciBwYWNrYWdlcyB0byBzdWJzY3JpYmUgdG8gb3VyXG4gKiBldmVudHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlRXZlbnRTZXJ2aWNlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIG9uRGlkT3BlblBhdGgoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiBlbWl0dGVyLm9uKCdkaWQtb3Blbi1wYXRoJywgY2FsbGJhY2spO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uRGlkQ3JlYXRlUGF0aChjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIGVtaXR0ZXIub24oJ2RpZC1jcmVhdGUtcGF0aCcsIGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuIl19