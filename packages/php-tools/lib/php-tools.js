'use babel';

import { CompositeDisposable } from 'atom'
const fs = window.require("fs");
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

export default {

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable()
    const notifications = atom.notifications;

    try {
        fs.statSync(`${__dirname}/../vendor`);
    } catch(error) {
        notifications.addInfo("Installing composer dependencies…")
        exec('php composer.phar install', {
            cwd: `${__dirname}/../`
        }, () => {
            notifications.addSuccess("Finished installing composer dependencies. Please run your command again.");
        });
    }

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'php-tools:insert-class-members': () => this.importClassMember()
    }))
},

  deactivate() {
    this.subscriptions.dispose()
  },

  importClassMember() {
    const editor = atom.workspace.getActiveTextEditor();

    if(!editor) return;

    const activeFilePath = editor.getPath();

    const cmd = `php ${__dirname}/php/src/importClassMembers.php "${activeFilePath}"`;

    exec(cmd, function(error, stdout, stderr) {
            if(error) {
                console.error(error);
            }

            if(stderr) {
                console.error(stderr);
            }

			if(!error && !stderr) {
                console.log(stdout);

                editor.setText(stdout);
                editor.save();
            }
		})
  }
};
