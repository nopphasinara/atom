'use babel';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    projectDependencies: {
        type: 'object',
        title: 'Load project dependencies from package.json. Note: This can adversely affect load performance',
        properties: {
            suggestDev: {
                title: 'Suggest dev dependencies',
                type: 'boolean',
                'default': false
            },
            suggestProd: {
                title: 'Suggest regular dependencies',
                type: 'boolean',
                'default': false
            }
        }
    },
    fuzzy: {
        type: 'object',
        title: '(Experimental) Fuzzy file matching',
        properties: {
            enabled: {
                title: 'Enabled',
                type: 'boolean',
                'default': false
            },
            excludedDirs: {
                title: 'Directories to omit from matching',
                type: 'array',
                'default': ['node_modules', '.git']
            },
            fileTypes: {
                title: 'Allowable file types (* for anything)',
                type: 'array',
                'default': ['ts', 'js', 'jsx', 'json']
            }
        }
    },
    fileRelativePaths: {
        type: 'boolean',
        'default': true,
        title: 'File relative path completion',
        description: 'Upon selecting a match, the path relative to the current file will be inserted.' + ' Disabling this results in paths relative to the project'
    },
    importTypes: {
        type: 'object',
        title: 'Import types for autocompletion',
        properties: {
            es6: {
                type: 'boolean',
                'default': true,
                title: 'ES6 style "Import"'
            },
            require: {
                type: 'boolean',
                'default': true,
                title: 'Commonjs "require"'
            }
        }
    },
    hiddenFiles: {
        type: 'boolean',
        'default': false,
        title: 'Show hidden files (files starting with ".") in suggestions'
    },
    removeExtensions: {
        type: 'array',
        'default': ['.js'],
        title: 'Removes extension from suggestion',
        description: 'Import statements can usually autoresolve certain filetypes without providing an extension; ' + 'this provides the option to drop the extension'
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdWRwcmF3YXQvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWpzLWltcG9ydC9saWIvc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7OztxQkFFSTtBQUNYLHVCQUFtQixFQUFFO0FBQ2pCLFlBQUksRUFBRSxRQUFRO0FBQ2QsYUFBSyxFQUFFLCtGQUErRjtBQUN0RyxrQkFBVSxFQUFFO0FBQ1Isc0JBQVUsRUFBRTtBQUNSLHFCQUFLLEVBQUUsMEJBQTBCO0FBQ2pDLG9CQUFJLEVBQUUsU0FBUztBQUNmLDJCQUFTLEtBQUs7YUFDakI7QUFDRCx1QkFBVyxFQUFFO0FBQ1QscUJBQUssRUFBRSw4QkFBOEI7QUFDckMsb0JBQUksRUFBRSxTQUFTO0FBQ2YsMkJBQVMsS0FBSzthQUNqQjtTQUNKO0tBQ0o7QUFDRCxTQUFLLEVBQUU7QUFDSCxZQUFJLEVBQUUsUUFBUTtBQUNkLGFBQUssRUFBRSxvQ0FBb0M7QUFDM0Msa0JBQVUsRUFBRTtBQUNSLG1CQUFPLEVBQUU7QUFDTCxxQkFBSyxFQUFFLFNBQVM7QUFDaEIsb0JBQUksRUFBRSxTQUFTO0FBQ2YsMkJBQVMsS0FBSzthQUNqQjtBQUNELHdCQUFZLEVBQUU7QUFDVixxQkFBSyxFQUFFLG1DQUFtQztBQUMxQyxvQkFBSSxFQUFFLE9BQU87QUFDYiwyQkFBUyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUM7YUFDcEM7QUFDRCxxQkFBUyxFQUFFO0FBQ1AscUJBQUssRUFBRSx1Q0FBdUM7QUFDOUMsb0JBQUksRUFBRSxPQUFPO0FBQ2IsMkJBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUM7YUFDdkM7U0FDSjtLQUNKO0FBQ0QscUJBQWlCLEVBQUU7QUFDZixZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLElBQUk7QUFDYixhQUFLLEVBQUUsK0JBQStCO0FBQ3RDLG1CQUFXLEVBQUUsaUZBQWlGLEdBQzFGLDBEQUEwRDtLQUNqRTtBQUNELGVBQVcsRUFBRTtBQUNULFlBQUksRUFBRSxRQUFRO0FBQ2QsYUFBSyxFQUFFLGlDQUFpQztBQUN4QyxrQkFBVSxFQUFFO0FBQ1IsZUFBRyxFQUFFO0FBQ0Qsb0JBQUksRUFBRSxTQUFTO0FBQ2YsMkJBQVMsSUFBSTtBQUNiLHFCQUFLLEVBQUUsb0JBQW9CO2FBQzlCO0FBQ0QsbUJBQU8sRUFBRTtBQUNMLG9CQUFJLEVBQUUsU0FBUztBQUNmLDJCQUFTLElBQUk7QUFDYixxQkFBSyxFQUFFLG9CQUFvQjthQUM5QjtTQUNKO0tBQ0o7QUFDRCxlQUFXLEVBQUU7QUFDVCxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7QUFDZCxhQUFLLEVBQUUsNERBQTREO0tBQ3RFO0FBQ0Qsb0JBQWdCLEVBQUU7QUFDZCxZQUFJLEVBQUUsT0FBTztBQUNiLG1CQUFTLENBQUMsS0FBSyxDQUFDO0FBQ2hCLGFBQUssRUFBRSxtQ0FBbUM7QUFDMUMsbUJBQVcsRUFBRSw4RkFBOEYsR0FDckcsZ0RBQWdEO0tBQ3pEO0NBQ0oiLCJmaWxlIjoiL1VzZXJzL3N1ZHByYXdhdC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanMtaW1wb3J0L2xpYi9zZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBwcm9qZWN0RGVwZW5kZW5jaWVzOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICB0aXRsZTogJ0xvYWQgcHJvamVjdCBkZXBlbmRlbmNpZXMgZnJvbSBwYWNrYWdlLmpzb24uIE5vdGU6IFRoaXMgY2FuIGFkdmVyc2VseSBhZmZlY3QgbG9hZCBwZXJmb3JtYW5jZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIHN1Z2dlc3REZXY6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1N1Z2dlc3QgZGV2IGRlcGVuZGVuY2llcycsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VnZ2VzdFByb2Q6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1N1Z2dlc3QgcmVndWxhciBkZXBlbmRlbmNpZXMnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBmdXp6eToge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgdGl0bGU6ICcoRXhwZXJpbWVudGFsKSBGdXp6eSBmaWxlIG1hdGNoaW5nJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgZW5hYmxlZDoge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnRW5hYmxlZCcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXhjbHVkZWREaXJzOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdEaXJlY3RvcmllcyB0byBvbWl0IGZyb20gbWF0Y2hpbmcnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogWydub2RlX21vZHVsZXMnLCAnLmdpdCddXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmlsZVR5cGVzOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdBbGxvd2FibGUgZmlsZSB0eXBlcyAoKiBmb3IgYW55dGhpbmcpJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFsndHMnLCAnanMnLCAnanN4JywgJ2pzb24nXVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBmaWxlUmVsYXRpdmVQYXRoczoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgIHRpdGxlOiAnRmlsZSByZWxhdGl2ZSBwYXRoIGNvbXBsZXRpb24nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1Vwb24gc2VsZWN0aW5nIGEgbWF0Y2gsIHRoZSBwYXRoIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IGZpbGUgd2lsbCBiZSBpbnNlcnRlZC4nICtcbiAgICAgICAgICAgICcgRGlzYWJsaW5nIHRoaXMgcmVzdWx0cyBpbiBwYXRocyByZWxhdGl2ZSB0byB0aGUgcHJvamVjdCdcbiAgICB9LFxuICAgIGltcG9ydFR5cGVzOiB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICB0aXRsZTogJ0ltcG9ydCB0eXBlcyBmb3IgYXV0b2NvbXBsZXRpb24nLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBlczY6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0VTNiBzdHlsZSBcIkltcG9ydFwiJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmU6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0NvbW1vbmpzIFwicmVxdWlyZVwiJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBoaWRkZW5GaWxlczoge1xuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICB0aXRsZTogJ1Nob3cgaGlkZGVuIGZpbGVzIChmaWxlcyBzdGFydGluZyB3aXRoIFwiLlwiKSBpbiBzdWdnZXN0aW9ucydcbiAgICB9LFxuICAgIHJlbW92ZUV4dGVuc2lvbnM6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgZGVmYXVsdDogWycuanMnXSxcbiAgICAgICAgdGl0bGU6ICdSZW1vdmVzIGV4dGVuc2lvbiBmcm9tIHN1Z2dlc3Rpb24nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0ltcG9ydCBzdGF0ZW1lbnRzIGNhbiB1c3VhbGx5IGF1dG9yZXNvbHZlIGNlcnRhaW4gZmlsZXR5cGVzIHdpdGhvdXQgcHJvdmlkaW5nIGFuIGV4dGVuc2lvbjsgJ1xuICAgICAgICAgICAgKyAndGhpcyBwcm92aWRlcyB0aGUgb3B0aW9uIHRvIGRyb3AgdGhlIGV4dGVuc2lvbidcbiAgICB9XG59XG4iXX0=