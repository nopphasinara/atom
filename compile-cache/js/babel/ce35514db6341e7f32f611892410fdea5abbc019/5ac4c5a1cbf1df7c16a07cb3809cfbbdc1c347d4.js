'use babel';

// These only match prefixes
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.capturedDependency = capturedDependency;
exports.startsWith = startsWith;
exports.endsWith = endsWith;
exports.not = not;
exports.matchesNPMNaming = matchesNPMNaming;
exports.dropExtensions = dropExtensions;
exports.getDirAndFilePrefix = getDirAndFilePrefix;
exports.getParentDir = getParentDir;
exports.isHiddenFile = isHiddenFile;
var REQUIRE_REGEX = /require\(["']([^"']+)$/;
var ES6_REGEX = /(?:^import .*?|^}) from ["']([^"']+)$/;

function capturedDependency(prefix, importTypes) {
    var results = null;

    if (importTypes.es6) {
        results = ES6_REGEX.exec(prefix);
    }

    if (!results && importTypes.require) {
        results = REQUIRE_REGEX.exec(prefix);
    }

    if (results && results.length) {
        return results[1];
    }

    return null;
}

// Taken from MDN
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function startsWith(base, keyword) {
    var keywordRegex = new RegExp('^' + escapeRegex(keyword));

    return keywordRegex.test(base);
}

function endsWith(base, keyword) {
    var keywordRegex = new RegExp(escapeRegex(keyword) + '$');

    return keywordRegex.test(base);
}

/**
 * Returns a function that returns the logical negation of the given function's output
 */

function not(func) {
    return function () {
        return !func.apply(undefined, arguments);
    };
}

// Used to check if a given string matches the constraints of NPM naming
// Algo basically taken from https://docs.npmjs.com/files/package.json

function matchesNPMNaming(prefix) {
    if (encodeURIComponent(prefix) !== prefix) {
        return false;
    }

    // I don't check for capital letters so that I can still match even if user puts caps for some reason
    return (/^[^._]/.test(prefix)
    );
}

function dropExtensions(fileName, extensions) {
    for (var i = 0; i < extensions.length; i++) {
        var ext = extensions[i];

        if (endsWith(fileName, ext)) {
            fileName = fileName.substring(0, fileName.length - ext.length);

            break;
        }
    }

    return fileName;
}

function getDirAndFilePrefix(filePath) {
    var pathParts = filePath.split('/');
    var toComplete = pathParts.pop();

    return [pathParts.join('/'), toComplete];
}

function getParentDir(filePath) {
    return getDirAndFilePrefix(filePath)[0];
}

function isHiddenFile(fileName) {
    return startsWith(fileName, '.');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzLWltcG9ydC9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFHWixJQUFNLGFBQWEsR0FBRyx3QkFBd0IsQ0FBQztBQUMvQyxJQUFNLFNBQVMsR0FBRyx1Q0FBdUMsQ0FBQzs7QUFFbkQsU0FBUyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFO0FBQ3BELFFBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFbkIsUUFBSSxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ2pCLGVBQU8sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3BDOztBQUVELFFBQUksQ0FBQyxPQUFPLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRTtBQUNqQyxlQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN4Qzs7QUFFRCxRQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQzNCLGVBQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3JCOztBQUVELFdBQU8sSUFBSSxDQUFDO0NBQ2Y7OztBQUdELFNBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTtBQUN0QixXQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDckQ7O0FBRU0sU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtBQUN0QyxRQUFNLFlBQVksR0FBRyxJQUFJLE1BQU0sT0FBSyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUcsQ0FBQzs7QUFFNUQsV0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ2xDOztBQUVNLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7QUFDcEMsUUFBTSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFJLENBQUM7O0FBRTVELFdBQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUNsQzs7Ozs7O0FBS00sU0FBUyxHQUFHLENBQUMsSUFBSSxFQUFFO0FBQ3RCLFdBQU8sWUFBVztBQUNkLGVBQU8sQ0FBQyxJQUFJLGtCQUFJLFNBQVMsQ0FBQyxDQUFDO0tBQzlCLENBQUM7Q0FDTDs7Ozs7QUFJTSxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtBQUNyQyxRQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUN2QyxlQUFPLEtBQUssQ0FBQztLQUNoQjs7O0FBR0QsV0FBTyxTQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztNQUFDO0NBQ2hDOztBQUVNLFNBQVMsY0FBYyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUU7QUFDakQsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEMsWUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV4QixZQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDekIsb0JBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFL0Qsa0JBQU07U0FDVDtLQUNKOztBQUVELFdBQU8sUUFBUSxDQUFDO0NBQ25COztBQUVNLFNBQVMsbUJBQW1CLENBQUMsUUFBUSxFQUFFO0FBQzFDLFFBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsUUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVuQyxXQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztDQUM1Qzs7QUFFTSxTQUFTLFlBQVksQ0FBQyxRQUFRLEVBQUU7QUFDbkMsV0FBTyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUMzQzs7QUFFTSxTQUFTLFlBQVksQ0FBQyxRQUFRLEVBQUU7QUFDbkMsV0FBTyxVQUFVLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0NBQ3BDIiwiZmlsZSI6Ii9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzLWltcG9ydC9saWIvdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gVGhlc2Ugb25seSBtYXRjaCBwcmVmaXhlc1xuY29uc3QgUkVRVUlSRV9SRUdFWCA9IC9yZXF1aXJlXFwoW1wiJ10oW15cIiddKykkLztcbmNvbnN0IEVTNl9SRUdFWCA9IC8oPzpeaW1wb3J0IC4qP3xefSkgZnJvbSBbXCInXShbXlwiJ10rKSQvO1xuXG5leHBvcnQgZnVuY3Rpb24gY2FwdHVyZWREZXBlbmRlbmN5KHByZWZpeCwgaW1wb3J0VHlwZXMpIHtcbiAgICBsZXQgcmVzdWx0cyA9IG51bGw7XG5cbiAgICBpZiAoaW1wb3J0VHlwZXMuZXM2KSB7XG4gICAgICAgIHJlc3VsdHMgPSBFUzZfUkVHRVguZXhlYyhwcmVmaXgpO1xuICAgIH1cblxuICAgIGlmICghcmVzdWx0cyAmJiBpbXBvcnRUeXBlcy5yZXF1aXJlKSB7XG4gICAgICAgIHJlc3VsdHMgPSBSRVFVSVJFX1JFR0VYLmV4ZWMocHJlZml4KTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0c1sxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuLy8gVGFrZW4gZnJvbSBNRE5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpOyAvLyAkJiBtZWFucyB0aGUgd2hvbGUgbWF0Y2hlZCBzdHJpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0c1dpdGgoYmFzZSwga2V5d29yZCkge1xuICAgIGNvbnN0IGtleXdvcmRSZWdleCA9IG5ldyBSZWdFeHAoYF4ke2VzY2FwZVJlZ2V4KGtleXdvcmQpfWApO1xuXG4gICAgcmV0dXJuIGtleXdvcmRSZWdleC50ZXN0KGJhc2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5kc1dpdGgoYmFzZSwga2V5d29yZCkge1xuICAgIGNvbnN0IGtleXdvcmRSZWdleCA9IG5ldyBSZWdFeHAoYCR7ZXNjYXBlUmVnZXgoa2V5d29yZCl9JGApO1xuXG4gICAgcmV0dXJuIGtleXdvcmRSZWdleC50ZXN0KGJhc2UpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGxvZ2ljYWwgbmVnYXRpb24gb2YgdGhlIGdpdmVuIGZ1bmN0aW9uJ3Mgb3V0cHV0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3QoZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICFmdW5jKC4uLmFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuLy8gVXNlZCB0byBjaGVjayBpZiBhIGdpdmVuIHN0cmluZyBtYXRjaGVzIHRoZSBjb25zdHJhaW50cyBvZiBOUE0gbmFtaW5nXG4vLyBBbGdvIGJhc2ljYWxseSB0YWtlbiBmcm9tIGh0dHBzOi8vZG9jcy5ucG1qcy5jb20vZmlsZXMvcGFja2FnZS5qc29uXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hlc05QTU5hbWluZyhwcmVmaXgpIHtcbiAgICBpZiAoZW5jb2RlVVJJQ29tcG9uZW50KHByZWZpeCkgIT09IHByZWZpeCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gSSBkb24ndCBjaGVjayBmb3IgY2FwaXRhbCBsZXR0ZXJzIHNvIHRoYXQgSSBjYW4gc3RpbGwgbWF0Y2ggZXZlbiBpZiB1c2VyIHB1dHMgY2FwcyBmb3Igc29tZSByZWFzb25cbiAgICByZXR1cm4gL15bXi5fXS8udGVzdChwcmVmaXgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJvcEV4dGVuc2lvbnMoZmlsZU5hbWUsIGV4dGVuc2lvbnMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4dGVuc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGV4dCA9IGV4dGVuc2lvbnNbaV07XG5cbiAgICAgICAgaWYgKGVuZHNXaXRoKGZpbGVOYW1lLCBleHQpKSB7XG4gICAgICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cmluZygwLCBmaWxlTmFtZS5sZW5ndGggLSBleHQubGVuZ3RoKTtcblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmlsZU5hbWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREaXJBbmRGaWxlUHJlZml4KGZpbGVQYXRoKSB7XG4gICAgY29uc3QgcGF0aFBhcnRzID0gZmlsZVBhdGguc3BsaXQoJy8nKTtcbiAgICBjb25zdCB0b0NvbXBsZXRlID0gcGF0aFBhcnRzLnBvcCgpO1xuXG4gICAgcmV0dXJuIFtwYXRoUGFydHMuam9pbignLycpLCB0b0NvbXBsZXRlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcmVudERpcihmaWxlUGF0aCkge1xuICAgIHJldHVybiBnZXREaXJBbmRGaWxlUHJlZml4KGZpbGVQYXRoKVswXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSGlkZGVuRmlsZShmaWxlTmFtZSkge1xuICAgIHJldHVybiBzdGFydHNXaXRoKGZpbGVOYW1lLCAnLicpO1xufVxuIl19