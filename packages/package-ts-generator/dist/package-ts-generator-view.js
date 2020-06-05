"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const templates = require("./templates");
const mustache = require("mustache");
const path = require("path");
const fs = require("fs");
class PackageTsGeneratorView {
    constructor() {
        this.element = document.createElement('div');
        this.disposables = new atom_1.CompositeDisposable();
        this.miniEditor = new atom_1.TextEditor({ mini: true });
        this.element.appendChild(this.miniEditor.element);
        this.checkboxDiv = document.createElement('div');
        this.checkbox = document.createElement('input');
        this.checkbox.setAttribute("type", "checkbox");
        this.checkboxDiv.appendChild(this.checkbox);
        let label = document.createElement('label');
        label.innerHTML = "&nbsp;&nbsp;--global&nbsp;&nbsp;&nbsp;&nbsp;";
        this.checkboxDiv.appendChild(label);
        this.saveCheckbox = document.createElement('input');
        this.saveCheckbox.setAttribute("type", "checkbox");
        this.saveCheckbox.setAttribute("checked", "checked");
        this.checkboxDiv.appendChild(this.saveCheckbox);
        label = document.createElement('label');
        label.innerHTML = "&nbsp;&nbsp;--save&nbsp;&nbsp;&nbsp;&nbsp;";
        this.checkboxDiv.appendChild(label);
        this.proxyCheckbox = document.createElement('input');
        this.proxyCheckbox.setAttribute("type", "checkbox");
        this.checkboxDiv.appendChild(this.proxyCheckbox);
        label = document.createElement('label');
        label.innerHTML = "&nbsp;&nbsp;use proxychains";
        this.checkboxDiv.appendChild(label);
        this.element.appendChild(this.checkboxDiv);
        this.error = document.createElement("div");
        this.error.classList.add("error");
        this.element.appendChild(this.error);
        this.message = document.createElement("div");
        this.message.classList.add("message");
        this.element.appendChild(this.message);
        // let blurHandler = () => this.close();
        // this.miniEditor.element.addEventListener('blur', blurHandler)
        // this.disposables.add(new Disposable(() => this.miniEditor.element.removeEventListener('blur, blurHandler')));
        this.disposables.add(atom.commands.add(this.element, "core:confirm", () => this.confirm()));
        this.disposables.add(atom.commands.add(this.element, "core:cancel", () => this.close()));
    }
    showCreatePackage() {
        this.checkboxDiv.hidden = true;
        this.inCreateMode = true;
        this.message.textContent = "Enter package path";
        this.previouslyFocusedElement = document.activeElement;
        this.setPathText();
        this.panel.show();
        this.miniEditor.element.focus();
    }
    showImportTyping() {
        this.checkboxDiv.hidden = false;
        this.inCreateMode = false;
        this.message.textContent = "Enter type name";
        this.miniEditor.setText("");
        this.panel.show();
        this.miniEditor.element.focus();
    }
    setPathText() {
        let pathText = path.join(getHomeDirectory(), "github", "my-package");
        this.miniEditor.setText(pathText);
        this.miniEditor.setSelectedBufferRange(new atom_1.TextBuffer.Range(new atom_1.TextBuffer.Point(0, pathText.length - 10), new atom_1.TextBuffer.Point(0, pathText.length)));
    }
    close() {
        if (!this.panel.isVisible())
            return;
        if (this.previouslyFocusedElement)
            this.previouslyFocusedElement.focus();
        this.panel.hide();
    }
    confirm() {
        if (this.inCreateMode) {
            let packagePath = path.normalize(this.miniEditor.getText().trim());
            if (this.validatePackagePath(packagePath)) {
                this.createPackageFiles(packagePath, () => {
                    atom.open({ pathsToOpen: [packagePath], newWindow: true, devMode: false, safeMode: false });
                    this.close();
                });
            }
        }
        else {
            let typingName = this.miniEditor.getText().trim();
            this.close();
            this.importTyping(typingName.trim(), this.checkbox.checked, this.saveCheckbox.checked, this.proxyCheckbox.checked);
        }
    }
    importTyping(type, global, save, proxy) {
        if (type.length == 0) {
            return;
        }
        let typingsPath = require.resolve("typings/dist/bin");
        let command = proxy ? "proxychains4" : "node";
        let args = [];
        if (proxy) {
            args.push("node");
        }
        args.push(typingsPath);
        args.push("install");
        args.push(type);
        if (save) {
            args.push("--save");
        }
        if (global) {
            args.push("--global");
        }
        args.push("--cwd");
        let paths = atom.project.getPaths();
        if (paths.length == 0) {
            return;
        }
        else if (paths.length == 1) {
            args.push(path.join(paths[0], "lib"));
        }
        else {
            let editor = atom.workspace.getActiveTextEditor();
            if (editor) {
                let fpath = editor.getPath();
                let res = undefined;
                for (let p of paths) {
                    if (fpath.indexOf(p) == 0) {
                        res = p;
                        break;
                    }
                }
                if (!res) {
                    args.push(path.join(paths[0], "lib"));
                }
                else {
                    args.push(path.join(res, "lib"));
                }
            }
            else {
                args.push(path.join(paths[0], "lib"));
            }
        }
        let stdout = "";
        let stderr = "";
        new atom_1.BufferedProcess({
            command, args,
            stderr: function (data) {
                stderr += data;
            },
            stdout: function (data) {
                stdout += data;
            },
            exit: function (code) {
                if (code == 0) {
                    atom.notifications.addSuccess("Import " + type + " succeeded!", { detail: stdout });
                }
                else {
                    atom.notifications.addError("Import " + type + " failed!", { detail: stdout + "\n" + stderr });
                    console.error(stdout + "\n" + stderr);
                }
            }
        });
    }
    validatePackagePath(path) {
        if (fs.existsSync(path)) {
            this.error.textContent = "Path already exists at " + path;
            this.error.style.display = "block";
            return false;
        }
        return true;
    }
    linkPackage(packagePath, callback) {
        let args = ["link", packagePath];
        runCommand(atom.packages.getApmPath(), args, callback);
    }
    createPackageFiles(packagePath, callback) {
        let command = ["init", "--package", packagePath, "--syntax", "javascript"];
        runCommand(atom.packages.getApmPath(), command, () => {
            this.modifyPackageForTS(packagePath, callback);
        });
    }
    modifyPackageForTS(packagePath, callback) {
        let data = fs.readFileSync(path.join(packagePath, "package.json"));
        let packageInfo = JSON.parse(data);
        packageInfo.main = packageInfo.main.replace("lib", "dist");
        fs.mkdirSync(path.join(packagePath, "dist"));
        if (atom.config.get('package-ts-generator.createWithReact')) {
            packageInfo.dependencies["react"] = "15.5.4";
            packageInfo.dependencies["react-dom"] = "15.5.4";
        }
        fs.writeFileSync(path.join(packagePath, "package.json"), JSON.stringify(packageInfo, null, 2));
        fs.writeFileSync(path.join(packagePath, "lib", "tsconfig.json"), templates.tsconfig);
        let PackageName = path.basename(packagePath);
        let comps = PackageName.split("-");
        let PackageCamelName = comps.map(s => s[0].toUpperCase() + s.slice(1)).join('');
        let view = {
            PackageName,
            PackageCamelName,
            ViewVariableName: PackageCamelName[0].toLowerCase() + PackageCamelName.slice(1) + "View"
        };
        fs.unlinkSync(path.join(packagePath, "lib", PackageName + ".js"));
        fs.unlinkSync(path.join(packagePath, "lib", PackageName + "-view.js"));
        fs.writeFileSync(path.join(packagePath, "lib", PackageName + ".ts"), mustache.render(templates.mainTemplate, view));
        if (atom.config.get('package-ts-generator.createWithReact')) {
            fs.writeFileSync(path.join(packagePath, "lib", PackageName + "-view.tsx"), mustache.render(templates.reactViewTemplate, view));
        }
        else {
            fs.writeFileSync(path.join(packagePath, "lib", PackageName + "-view.ts"), mustache.render(templates.viewTemplate, view));
        }
        if (this.isInAtomPath(packagePath)) {
            callback();
        }
        else {
            this.linkPackage(packagePath, callback);
        }
    }
    isInAtomPath(packagePath) {
        let packagesPath = path.join(atom.getConfigDirPath(), "packages", path.sep);
        if (packagePath.indexOf(packagesPath) == 0) {
            return true;
        }
        return false;
    }
    destroy() {
        this.disposables.dispose();
        this.panel.destroy();
        this.element.remove();
    }
    getElement() {
        return this.element;
    }
}
exports.default = PackageTsGeneratorView;
function runCommand(command, args, exit) {
    new atom_1.BufferedProcess({ command, args, exit });
}
function getHomeDirectory() {
    if (process.platform == 'win32') {
        return process.env.USERPROFILE;
    }
    else {
        return process.env.HOME;
    }
}
//# sourceMappingURL=package-ts-generator-view.js.map