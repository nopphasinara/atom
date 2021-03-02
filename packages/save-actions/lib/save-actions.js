'use babel';

import {CompositeDisposable} from 'atom';
import * as Path from 'path';
import * as FileSys from 'fs';
import * as Process from 'child_process';
import ActionsView from './view_actions';

export default {
  actionsView:   null,
  actionsPanel:  null,
  subscriptions: null,


  //
  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Create the action list view
    this.actionsView = new ActionsView(atom.config.get('save-actions.actionList')||[]);
    this.actionsPanel = atom.workspace.addModalPanel({
      item:      this.actionsView.getElement(),
      visible:   false,
      autoFocus: true
    });

    // Store new action list
    this.subscriptions.add(this.actionsView.onSave(actions=>{
      this.actionListWatcher.dispose();
      atom.config.set('save-actions.actionList', actions);
      this.actionListWatcher = atom.config.onDidChange('save-actions.actionList', evnt=>this.actionsView.renderActions(evnt.newValue||[]));
    }));


    // Watch the action list channges
    this.actionListWatcher = atom.config.onDidChange('save-actions.actionList', evnt=>this.actionsView.renderActions(evnt.newValue||[]));


    // Register command that show settings pane
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'save-actions:actions': () => this.toggleActionsPanel()
    }));


    // Invoke the given callback with all current and future text editors in the workspace
    this.subscriptions.add(atom.workspace.observeTextEditors(editor=>{
      const editorBuffer = editor.getBuffer();

      // Invoke the given callback before the buffer is saved to disk
      this.subscriptions.add(editorBuffer.onWillSave(evnt=>this.runActions('before', atom.workspace.getActiveTextEditor().getPath()||evnt.path)));

      // Invoke the given callback after the buffer is saved to disk
      this.subscriptions.add(editorBuffer.onDidSave(evnt=>this.runActions('after', evnt.path)));
    }));
  },


  //
  deactivate() {
    this.actionListWatcher.dispose();
    this.subscriptions.dispose();
    this.actionsPanel.destroy();
    this.actionsView.destroy();
  },


  //
  serialize() {
    return {};
  },


  /**/
  toggleActionsPanel() {
    if(this.actionsPanel.isVisible()) this.actionsPanel.hide();
    else                              this.actionsPanel.show();
  },


  /**/
  runActions(stage, filePath) {
    (atom.config.get('save-actions.actionList')||[]).forEach(props=>{
      if(props.stage===stage && this.isMatchGlob(filePath, props.fileMask))
        switch(props.context)
        {
          case 'shell': this.runShellCommand(props, filePath); break;
          case 'atom':  this.runAtomCommand(props, filePath); break;
        }
    });
  },


  /**/
  isMatchGlob(val, ptrn) {
    if(ptrn==='')
      return true;

    return RegExp('^'+ ptrn.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.').replace(/,/g, '|') +'$', 'g').test(val);
  },


  /**/
  formatCommand(cmdStr, filePath) {
    const
      pathInfo = Path.parse(filePath),
      projectPaths = atom.project.relativizePath(filePath);

    return cmdStr
      .replace(/%FILE_PATH%/g,         filePath)
      .replace(/%FILE_DIR%/g,          pathInfo.dir)
      .replace(/%FILE_NAME%/g,         pathInfo.base)
      .replace(/%FILE_NAME_BASE%/g,    pathInfo.name)
      .replace(/%FILE_NAME_EXT%/g,     pathInfo.ext)
      .replace(/%PROJECT_DIR%/g,       projectPaths[0])
      .replace(/%PROJECT_FILE_PATH%/g, projectPaths[1])
      .replace(/%PROJECT_FILE_DIR%/g,  Path.dirname(projectPaths[1]));
  },


  /**/
  runAtomCommand(props, filePath) {
    atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), this.formatCommand(props.command, filePath));
  },


  /**/
  runShellCommand(props, filePath) {
    props = Object.assign({
      command: '',
      type:    'async',
      mode:    'verbose'
    }, props);

    props.command = this.formatCommand(props.command, filePath);

    const opts = {
      //cwd:          '',                                                       // Current working directory of the child process. Default: null.
      //env:          {},                                                       // Environment key-value pairs. Default: process.env.
      //encoding:     '',                                                       // Default: 'utf8'
      //shell:        '',                                                       // Shell to execute the command with. See Shell requirements and Default Windows shell. Default: '/bin/sh' on Unix, process.env.ComSpec on Windows.
      //timeout:      0,                                                        // In milliseconds the maximum amount of time the process is allowed to run. Default: 0
      //maxBuffer:    0,                                                        // Largest amount of data in bytes allowed on stdout or stderr. If exceeded, the child process is terminated and any output is truncated. See caveat at maxBuffer and Unicode. Default: 1024 * 1024.
      //killSignal:   '',                                                       // The signal value to be used when the spawned process will be killed. Default: 'SIGTERM'
      //uid:          0,                                                        // Sets the user identity of the process (see setuid(2)).
      //gid:          0,                                                        // Sets the group identity of the process (see setgid(2)).
      windowsHide:  true                                                        // Hide the subprocess console window that would normally be created on Windows systems. Default: false.
    };

    if(props.type==='async')
      Process.exec(props.command, opts, (error, stdout, stderr)=>{
        if(error!==null)
          atom.notifications.addError('Save Actions', {dismissable: true, detail: props.command+'\r\n\r\n'+stderr});
        else if(props.mode==='verbose')
          atom.notifications.addSuccess('Save Actions', {dismissable: false, detail: props.command+'\r\n\r\n'+stdout});
      });

    else
      try
      {
        const cmdOutput = Process.execSync(props.command, opts);
        if(props.mode==='verbose')
          atom.notifications.addSuccess('Save Actions', {dismissable: false, detail: props.command+'\r\n\r\n'+cmdOutput});
      }
      catch(error)
      {
        atom.notifications.addError('Save Actions', {dismissable: true, detail: props.command+'\r\n\r\n'+error.stderr});
      }
  }
};
