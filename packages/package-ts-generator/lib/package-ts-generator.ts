import {CompositeDisposable} from "atom";
import PackageTsGeneratorView from "./package-ts-generator-view";

let subscriptions: CompositeDisposable;
let packageTsGeneratorView: PackageTsGeneratorView;

export function activate(state: any) {
    packageTsGeneratorView = new PackageTsGeneratorView();
    packageTsGeneratorView.panel = atom.workspace.addModalPanel({
        item: packageTsGeneratorView.getElement(),
        visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    subscriptions.add(atom.commands.add('atom-workspace',
        'package-ts-generator:generate-package', () => generatePackage()
    ));

    subscriptions.add(atom.commands.add('atom-workspace',
        'package-ts-generator:import-typing', () => importTyping()
    ));
}

export function deactivate() {
    subscriptions.dispose();
    packageTsGeneratorView.destroy();
}

export function serialize() {

}

function generatePackage() {
    packageTsGeneratorView.showCreatePackage();
}

function importTyping() {
    packageTsGeneratorView.showImportTyping();
}
