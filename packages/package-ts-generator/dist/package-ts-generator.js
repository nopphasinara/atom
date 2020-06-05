"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const package_ts_generator_view_1 = require("./package-ts-generator-view");
let subscriptions;
let packageTsGeneratorView;
function activate(state) {
    packageTsGeneratorView = new package_ts_generator_view_1.default();
    packageTsGeneratorView.panel = atom.workspace.addModalPanel({
        item: packageTsGeneratorView.getElement(),
        visible: false
    });
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    subscriptions = new atom_1.CompositeDisposable();
    // Register command that toggles this view
    subscriptions.add(atom.commands.add('atom-workspace', 'package-ts-generator:generate-package', () => generatePackage()));
    subscriptions.add(atom.commands.add('atom-workspace', 'package-ts-generator:import-typing', () => importTyping()));
}
exports.activate = activate;
function deactivate() {
    subscriptions.dispose();
    packageTsGeneratorView.destroy();
}
exports.deactivate = deactivate;
function serialize() {
}
exports.serialize = serialize;
function generatePackage() {
    packageTsGeneratorView.showCreatePackage();
}
function importTyping() {
    packageTsGeneratorView.showImportTyping();
}
//# sourceMappingURL=package-ts-generator.js.map