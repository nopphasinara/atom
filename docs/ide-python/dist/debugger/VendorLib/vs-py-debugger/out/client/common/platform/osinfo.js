// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const platform_1 = require("../utils/platform");

const constants_1 = require("./constants");

function getPathVariableName(info) {
  return platform_1.isWindows(info) ? constants_1.WINDOWS_PATH_VARIABLE_NAME : constants_1.NON_WINDOWS_PATH_VARIABLE_NAME;
}

exports.getPathVariableName = getPathVariableName;

function getVirtualEnvBinName(info) {
  return platform_1.isWindows(info) ? 'scripts' : 'bin';
}

exports.getVirtualEnvBinName = getVirtualEnvBinName;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9zaW5mby5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsInBsYXRmb3JtXzEiLCJyZXF1aXJlIiwiY29uc3RhbnRzXzEiLCJnZXRQYXRoVmFyaWFibGVOYW1lIiwiaW5mbyIsImlzV2luZG93cyIsIldJTkRPV1NfUEFUSF9WQVJJQUJMRV9OQU1FIiwiTk9OX1dJTkRPV1NfUEFUSF9WQVJJQUJMRV9OQU1FIiwiZ2V0VmlydHVhbEVudkJpbk5hbWUiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFQyxFQUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxNQUFNQyxVQUFVLEdBQUdDLE9BQU8sQ0FBQyxtQkFBRCxDQUExQjs7QUFDQSxNQUFNQyxXQUFXLEdBQUdELE9BQU8sQ0FBQyxhQUFELENBQTNCOztBQUNBLFNBQVNFLG1CQUFULENBQTZCQyxJQUE3QixFQUFtQztBQUMvQixTQUFPSixVQUFVLENBQUNLLFNBQVgsQ0FBcUJELElBQXJCLElBQTZCRixXQUFXLENBQUNJLDBCQUF6QyxHQUFzRUosV0FBVyxDQUFDSyw4QkFBekY7QUFDSDs7QUFDRFQsT0FBTyxDQUFDSyxtQkFBUixHQUE4QkEsbUJBQTlCOztBQUNBLFNBQVNLLG9CQUFULENBQThCSixJQUE5QixFQUFvQztBQUNoQyxTQUFPSixVQUFVLENBQUNLLFNBQVgsQ0FBcUJELElBQXJCLElBQTZCLFNBQTdCLEdBQXlDLEtBQWhEO0FBQ0g7O0FBQ0ROLE9BQU8sQ0FBQ1Usb0JBQVIsR0FBK0JBLG9CQUEvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuJ3VzZSBzdHJpY3QnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcGxhdGZvcm1fMSA9IHJlcXVpcmUoXCIuLi91dGlscy9wbGF0Zm9ybVwiKTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4vY29uc3RhbnRzXCIpO1xuZnVuY3Rpb24gZ2V0UGF0aFZhcmlhYmxlTmFtZShpbmZvKSB7XG4gICAgcmV0dXJuIHBsYXRmb3JtXzEuaXNXaW5kb3dzKGluZm8pID8gY29uc3RhbnRzXzEuV0lORE9XU19QQVRIX1ZBUklBQkxFX05BTUUgOiBjb25zdGFudHNfMS5OT05fV0lORE9XU19QQVRIX1ZBUklBQkxFX05BTUU7XG59XG5leHBvcnRzLmdldFBhdGhWYXJpYWJsZU5hbWUgPSBnZXRQYXRoVmFyaWFibGVOYW1lO1xuZnVuY3Rpb24gZ2V0VmlydHVhbEVudkJpbk5hbWUoaW5mbykge1xuICAgIHJldHVybiBwbGF0Zm9ybV8xLmlzV2luZG93cyhpbmZvKSA/ICdzY3JpcHRzJyA6ICdiaW4nO1xufVxuZXhwb3J0cy5nZXRWaXJ0dWFsRW52QmluTmFtZSA9IGdldFZpcnR1YWxFbnZCaW5OYW1lO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b3NpbmZvLmpzLm1hcCJdfQ==