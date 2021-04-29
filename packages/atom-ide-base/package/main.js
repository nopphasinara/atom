"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("atom");let t;exports.activate=function(){t=new e.CompositeDisposable,async function(){atom.packages.isPackageLoaded("intentions")&&atom.packages.disablePackage("intentions");const e=["atom-ide-markdown-service","atom-ide-datatip","atom-ide-signature-help","atom-ide-hyperclick","atom-ide-definitions","atom-ide-outline","linter","linter-ui-default"];e.some((e=>!atom.packages.isPackageLoaded(e)))&&(require("atom-package-deps").install("atom-ide-base",!0),e.filter((e=>!atom.packages.isPackageLoaded(e))).forEach((e=>{atom.notifications.addInfo(`Enabling package ${e} that is needed for "atom-ide-base"`),atom.packages.enablePackage(e)})))}().then((()=>{}))},exports.config={longLineLength:{title:"Long Line Length",description:"If an editor has a line with a length more than this number, the editor will reduce the expensive operations to help the performance.",type:"number",default:4e3,order:10},largeLineCount:{title:"Large File Line Count",description:"If an editor more line numbers than this number, the editor will reduce the expensive operations to help the performance.",type:"number",default:4e3,order:11}},exports.deactivate=function(){t&&t.dispose(),t=null};
//# sourceMappingURL=main.js.map
