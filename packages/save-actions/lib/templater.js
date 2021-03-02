'use babel';

import * as FileSys from 'fs';

export default class Templater {
  static basePath = '';
  static templates = {};

  /**/
  static getTemplate(tmplName)
  {
    if(!this.templates.hasOwnProperty(tmplName))
      this.loadTemplate(tmplName);

    return this.templates[tmplName];
  }


  /**/
  static createElement(tmplName)
  {
    let tmpl = this.getTemplate(tmplName);
    return tmpl.content.cloneNode(true);
  }


  /**/
  static loadTemplate(tmplName)
  {
    this.templates[tmplName] = document.createElement('template');
    try
    {
      let tmplHtml = FileSys.readFileSync(this.basePath+tmplName+'.html', 'utf8');
      this.templates[tmplName].innerHTML = tmplHtml;
    }
    catch(err)
    {
    }
  }
}