var root = this;

// CommonJS/nodeJS Loader
if (typeof module !== 'undefined' && module.exports) {
    module.exports = lightMarkdown;

// AMD Loader
} else if (typeof define === 'function' && define.amd) {
    define(function () {
        'use strict';
        return lightMarkdown;
    });

// Regular Browser loader
} else {
    root.lightMarkdown = lightMarkdown;
}
