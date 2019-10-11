'use babel';

import { CompositeDisposable } from 'atom';
const { exec } = require('child_process');
var remote = require('remote');

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'repl-console:run': () => this.runCode()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  runCommand(command){
    exec(command, (err, stdout, stderr) => {
      if(err){
        console.log(err.message);
      }

      if(stdout){
        console.log(stdout);
      }

      if(stderr){
        console.log(stderr);
      }

      console.log('Finished executing code via REPL Console');
    });
  },

  runCode() {
    let editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return;
    }

    let text = editor.getText();
    let grammerName = editor.getGrammar().name;

    // Open dev tools console
    remote.BrowserWindow.getFocusedWindow().openDevTools();

    let validGrammers = ['Ruby', 'JavaScript', 'Python', 'PHP', 'Go', 'Shell Script', 'JSON'];

    if(!validGrammers.includes(grammerName)){
      console.log(`REPL Console: unknown grammer - ${grammerName}`);
      console.log(`Valid Grammers:`, validGrammers.join(', '));
      return;
    }

    if(!text){
      return;
    }

    console.log(`Running ${grammerName} code via REPL Console`);

    let escapedText = text.replace(/(["$\\])/g, '\\$1');
    let command;

    switch (grammerName) {
      case 'Go':
        command = `echo "${escapedText}" > /tmp/repl-console-go-src.go && go run /tmp/repl-console-go-src.go; rm /tmp/repl-console-go-src.go`;
        break;

      case 'Ruby':
        command = `echo "${escapedText}" | ruby`;
        break;

      case 'Python':
        command = `echo "${escapedText}" | python`;
        break;

      case 'PHP':
        command = `echo "${escapedText}" | php`;
        break;

      case 'Shell Script':
        command = `echo "${escapedText}" | sh`;
        break;

      case 'JSON':
        try{
          console.log(JSON.parse(text));
        } catch(e){
          console.warn(e);
        }
        break;

      case 'JavaScript':
        // For JS run it directly in dev console
        try {
          let output = (new Function(text))();
          if(output){
            console.log(output);
          }
        } catch(e) {
          console.warn(e);
        }
        break;
    }

    if(command){
      this.runCommand(command);
    } else {
      console.log('Finished executing code via REPL Console');
    }
  }
};
