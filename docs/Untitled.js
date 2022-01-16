console.clear();

var _arr = [1, 2, 3];
var _obj = {a: 'A', b: 'B', c: 'C'};
var _fn = function AtomGitPanel (...args) {
    var prototype = _.merge(this || self, {


        get stagingView() {
            if (!_.isEmpty(this.view)) {
                return this.view.querySelectorAll('.github-StagingView');
            }
        },

        get commitView() {
            if (!_.isEmpty(this.view)) {
                return this.view.querySelectorAll('.github-CommitView');
            }
        },

        get recentCommits() {
            if (!_.isEmpty(this.view)) {
                return this.view.querySelectorAll('.github-RecentCommits');
            }
        },

        get dialog() {
            if (!_.isEmpty(this.view)) {
                return this.view.querySelectorAll('.github-Dialog');
            }
        },

        get view() {
            if (!_.isEmpty(this.selector)) {
                return document.querySelector(this.selector);
            }
        },

        get selector() {
            if (!_.isEmpty(args[0]) && _.isString(args[0])) {
                return _.first(args);
            }
        },
    });
};

var foo1 = new _fn('atom-pane .item-views .github-Git', _obj);
console.group('foo1');
console.log(foo1);
console.groupEnd();