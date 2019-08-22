Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.get = get;
/** @babel */

var DEFAULT_ACTIVE_FILE_DIR = 'Active file\'s directory';
exports.DEFAULT_ACTIVE_FILE_DIR = DEFAULT_ACTIVE_FILE_DIR;
var DEFAULT_PROJECT_ROOT = 'Project root';
exports.DEFAULT_PROJECT_ROOT = DEFAULT_PROJECT_ROOT;
var DEFAULT_EMPTY = 'Empty';

exports.DEFAULT_EMPTY = DEFAULT_EMPTY;

function get(key) {
    return atom.config.get('advanced-open-file.' + key);
}

var config = {
    createDirectories: {
        title: 'Create directories',
        description: 'When opening a path to a directory that doesn\'t\n                      exist, create the directory instead of beeping.',
        type: 'boolean',
        'default': false
    },
    createFileInstantly: {
        title: 'Create files instantly',
        description: 'When opening files that don\'t exist, create them\n                      immediately instead of on save.',
        type: 'boolean',
        'default': false
    },
    helmDirSwitch: {
        title: 'Shortcuts for fast directory switching',
        description: 'See README for details.',
        type: 'boolean',
        'default': false
    },
    defaultInputValue: {
        title: 'Default input value',
        description: 'What should the path input default to when the dialog\n                      is opened?',
        type: 'string',
        'enum': [DEFAULT_ACTIVE_FILE_DIR, DEFAULT_PROJECT_ROOT, DEFAULT_EMPTY],
        'default': DEFAULT_ACTIVE_FILE_DIR
    },
    fuzzyMatch: {
        title: 'Use fuzzy matching for matching filenames',
        description: 'Replaces default prefix-based matching. See README for\n                      details.',
        type: 'boolean',
        'default': false
    },
    ignoredPatterns: {
        title: 'Ignore patterns',
        description: 'Array of glob patterns to hide matching filenames.',
        type: 'array',
        'default': ['*.pyc', '*.pyo'],
        items: {
            type: 'string'
        }
    }
};
exports.config = config;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRU8sSUFBTSx1QkFBdUIsR0FBRywwQkFBMEIsQ0FBQzs7QUFDM0QsSUFBTSxvQkFBb0IsR0FBRyxjQUFjLENBQUM7O0FBQzVDLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQzs7OztBQUc5QixTQUFTLEdBQUcsQ0FBQyxHQUFHLEVBQUU7QUFDckIsV0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcseUJBQXVCLEdBQUcsQ0FBRyxDQUFDO0NBQ3ZEOztBQUdNLElBQUksTUFBTSxHQUFHO0FBQ2hCLHFCQUFpQixFQUFFO0FBQ2YsYUFBSyxFQUFFLG9CQUFvQjtBQUMzQixtQkFBVywySEFDbUQ7QUFDOUQsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO0tBQ2pCO0FBQ0QsdUJBQW1CLEVBQUU7QUFDakIsYUFBSyxFQUFFLHdCQUF3QjtBQUMvQixtQkFBVyw0R0FDbUM7QUFDOUMsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO0tBQ2pCO0FBQ0QsaUJBQWEsRUFBRTtBQUNYLGFBQUssRUFBRSx3Q0FBd0M7QUFDL0MsbUJBQVcsRUFBRSx5QkFBeUI7QUFDdEMsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO0tBQ2pCO0FBQ0QscUJBQWlCLEVBQUU7QUFDZixhQUFLLEVBQUUscUJBQXFCO0FBQzVCLG1CQUFXLDJGQUNjO0FBQ3pCLFlBQUksRUFBRSxRQUFRO0FBQ2QsZ0JBQU0sQ0FBQyx1QkFBdUIsRUFBRSxvQkFBb0IsRUFBRSxhQUFhLENBQUM7QUFDcEUsbUJBQVMsdUJBQXVCO0tBQ25DO0FBQ0QsY0FBVSxFQUFFO0FBQ1IsYUFBSyxFQUFFLDJDQUEyQztBQUNsRCxtQkFBVywwRkFDWTtBQUN2QixZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7S0FDakI7QUFDRCxtQkFBZSxFQUFFO0FBQ2YsYUFBSyxFQUFFLGlCQUFpQjtBQUN4QixtQkFBVyxFQUFFLG9EQUFvRDtBQUNqRSxZQUFJLEVBQUUsT0FBTztBQUNiLG1CQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztBQUMzQixhQUFLLEVBQUU7QUFDSCxnQkFBSSxFQUFFLFFBQVE7U0FDakI7S0FDRjtDQUNKLENBQUMiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvbGliL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQUNUSVZFX0ZJTEVfRElSID0gJ0FjdGl2ZSBmaWxlXFwncyBkaXJlY3RvcnknO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUFJPSkVDVF9ST09UID0gJ1Byb2plY3Qgcm9vdCc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9FTVBUWSA9ICdFbXB0eSc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldChrZXkpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KGBhZHZhbmNlZC1vcGVuLWZpbGUuJHtrZXl9YCk7XG59XG5cblxuZXhwb3J0IGxldCBjb25maWcgPSB7XG4gICAgY3JlYXRlRGlyZWN0b3JpZXM6IHtcbiAgICAgICAgdGl0bGU6ICdDcmVhdGUgZGlyZWN0b3JpZXMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogYFdoZW4gb3BlbmluZyBhIHBhdGggdG8gYSBkaXJlY3RvcnkgdGhhdCBkb2Vzbid0XG4gICAgICAgICAgICAgICAgICAgICAgZXhpc3QsIGNyZWF0ZSB0aGUgZGlyZWN0b3J5IGluc3RlYWQgb2YgYmVlcGluZy5gLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgY3JlYXRlRmlsZUluc3RhbnRseToge1xuICAgICAgICB0aXRsZTogJ0NyZWF0ZSBmaWxlcyBpbnN0YW50bHknLFxuICAgICAgICBkZXNjcmlwdGlvbjogYFdoZW4gb3BlbmluZyBmaWxlcyB0aGF0IGRvbid0IGV4aXN0LCBjcmVhdGUgdGhlbVxuICAgICAgICAgICAgICAgICAgICAgIGltbWVkaWF0ZWx5IGluc3RlYWQgb2Ygb24gc2F2ZS5gLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgaGVsbURpclN3aXRjaDoge1xuICAgICAgICB0aXRsZTogJ1Nob3J0Y3V0cyBmb3IgZmFzdCBkaXJlY3Rvcnkgc3dpdGNoaW5nJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdTZWUgUkVBRE1FIGZvciBkZXRhaWxzLicsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBkZWZhdWx0SW5wdXRWYWx1ZToge1xuICAgICAgICB0aXRsZTogJ0RlZmF1bHQgaW5wdXQgdmFsdWUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogYFdoYXQgc2hvdWxkIHRoZSBwYXRoIGlucHV0IGRlZmF1bHQgdG8gd2hlbiB0aGUgZGlhbG9nXG4gICAgICAgICAgICAgICAgICAgICAgaXMgb3BlbmVkP2AsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBlbnVtOiBbREVGQVVMVF9BQ1RJVkVfRklMRV9ESVIsIERFRkFVTFRfUFJPSkVDVF9ST09ULCBERUZBVUxUX0VNUFRZXSxcbiAgICAgICAgZGVmYXVsdDogREVGQVVMVF9BQ1RJVkVfRklMRV9ESVIsXG4gICAgfSxcbiAgICBmdXp6eU1hdGNoOiB7XG4gICAgICAgIHRpdGxlOiAnVXNlIGZ1enp5IG1hdGNoaW5nIGZvciBtYXRjaGluZyBmaWxlbmFtZXMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogYFJlcGxhY2VzIGRlZmF1bHQgcHJlZml4LWJhc2VkIG1hdGNoaW5nLiBTZWUgUkVBRE1FIGZvclxuICAgICAgICAgICAgICAgICAgICAgIGRldGFpbHMuYCxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIGlnbm9yZWRQYXR0ZXJuczoge1xuICAgICAgdGl0bGU6ICdJZ25vcmUgcGF0dGVybnMnLFxuICAgICAgZGVzY3JpcHRpb246ICdBcnJheSBvZiBnbG9iIHBhdHRlcm5zIHRvIGhpZGUgbWF0Y2hpbmcgZmlsZW5hbWVzLicsXG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogWycqLnB5YycsICcqLnB5byddLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIH0sXG4gICAgfVxufTtcbiJdfQ==