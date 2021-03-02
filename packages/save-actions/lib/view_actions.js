'use babel';

import Templater from './templater';
import {Emitter} from 'atom';


export default class ActionsView {

  //
  constructor(actions) {
    Templater.basePath = __dirname+'/../templates/';
    this.element = Templater.createElement('view_actions').firstChild;
    this.element.querySelector('#button-close').addEventListener('click', (evnt) => this.close());
    this.element.querySelector('#button-add')  .addEventListener('click', (evnt) => this.addActionItem());
    this.element.querySelector('#button-save') .addEventListener('click', (evnt) => this.save());
    this.element.querySelector('#list-actions').addEventListener('click', (evnt) => this.actionListHandler(evnt));
    this.element.addEventListener('keydown', (evnt) => { if(evnt.key==='Escape') this.close(); } );

    this.renderActions(actions);

    this.emitter = new Emitter();
  }


  /**/
  onSave(callback)
  {
    return this.emitter.on('updated', callback);
  }


  /**/
  renderActions(actions) {
    this.actions = actions;

    const actionListElm = this.element.querySelector('#list-actions');

    actionListElm.style.display = 'none';

    while(actionListElm.hasChildNodes())
      actionListElm.lastChild.remove();

    actions.forEach(action=>{
      this.addActionItem(action);
    });

    actionListElm.style.display = '';
  }


  /**/
  close() {
    atom.workspace.panelForItem(this.element).hide();
    this.renderActions(this.actions);
  }


  /**/
  save() {
    this.actions = [];

    this.element.querySelectorAll('.item-action').forEach(actionElm=>{
      let props = {
        command:  actionElm.querySelector('[name=command]').value,
        fileMask: actionElm.querySelector('[name=fileMask]').value,
        context:  actionElm.querySelector('[name=context]').value,
        stage:    actionElm.querySelector('[name=stage]').value
      };

      if(props.context==='shell')
      {
        props.type = actionElm.querySelector('[name=type]').value;
        props.mode = actionElm.querySelector('[name=mode]').value;
      }

      this.actions.push(props);
    });

    this.emitter.emit('updated', this.actions);
    atom.workspace.panelForItem(this.element).hide();
  }


  /**/
  toggleActionContext(elm, val)
  {
    if(val===undefined)
      val = elm.value==='shell' ? 'atom' : 'shell';

    elm.value = val;
    elm.title = (val==='shell' ? 'This is a system shell command' : 'This is an Atom command')+' (click to change it)';
    elm.closest('.item-action').querySelectorAll('.button-type, .button-mode').forEach((itemElm) => { itemElm.style.visibility = val==='shell' ? 'visible' : 'hidden'; });
  }


  /**/
  toggleActionStage(elm, val)
  {
    if(val===undefined)
      val = elm.value==='after' ? 'before' : 'after';

    elm.value = val;
    elm.title = (val==='after' ? 'This command will run after saving the file' : 'This command will run before saving the file')+' (click to change it)';
  }


  /**/
  toggleActionType(elm, val)
  {
    if(val===undefined)
      val = elm.value==='async' ? 'sync' : 'async';

    elm.value = val;
    elm.title = (val==='async' ? 'This command will run asynchronously' : 'This command will run synchronously')+' (click to change it)';
  }


  /**/
  toggleActionMode(elm, val)
  {
    if(val===undefined)
      val = elm.value==='verbose' ? 'silent' : 'verbose';

    elm.value = val;
    elm.title = (val==='verbose' ? 'The results of this command will be displayed as a notification' : 'The results of this command will not be displayed')+' (click to change it)';
  }


  /**/
  addActionItem(props={}) {
    props = Object.assign({
      command:  '',
      fileMask: '',
      context:  'shell',
      stage:    'after',
      type:     'async',
      mode:     'verbose'
    }, props);

    const actionElm = Templater.createElement('part_action-item');
    actionElm.querySelector('[name=command]').value = props.command;
    actionElm.querySelector('[name=fileMask]').value = props.fileMask;
    this.toggleActionContext(actionElm.querySelector('[name=context]'), props.context);
    this.toggleActionType(actionElm.querySelector('[name=type]'), props.type);
    this.toggleActionStage(actionElm.querySelector('[name=stage]'), props.stage);
    this.toggleActionMode(actionElm.querySelector('[name=mode]'), props.mode);

    this.element.querySelector('#list-actions').appendChild(actionElm);
  }


  /**/
  actionListHandler(evnt)
  {
    const targetElm = evnt.target;

    if(targetElm.matches('.button-remove'))
      targetElm.closest('.item-action').remove();

    else if(targetElm.matches('.button-context'))
      this.toggleActionContext(targetElm);

    else if(targetElm.matches('.button-type'))
      this.toggleActionType(targetElm);

    else if(targetElm.matches('.button-stage'))
      this.toggleActionStage(targetElm);

    else if(targetElm.matches('.button-mode'))
      this.toggleActionMode(targetElm);
  }


  //
  getElement() {
    return this.element;
  }


  // Returns an object that can be retrieved when package is activated
  serialize() {}


  // Tear down any state and detach
  destroy() {
    this.emitter.dispose();
    this.element.remove();
  }
}
