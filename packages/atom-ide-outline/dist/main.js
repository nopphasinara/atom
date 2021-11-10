"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("atom"),e=require("zadeh"),n=require("path"),i=require("util"),o=require("fs"),r=require("assert");function s(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var a=s(t),l=s(n),c=s(i),d=s(o),u=s(r),f="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},h={};Object.defineProperty(h,"__esModule",{value:!0}),h.scrollIntoView=function(t,e){const n=m(t);t.scrollIntoView(e),v(n)};var p=h.scrollIntoViewIfNeeded=function(t,e=!0){var n,i,o;const r=m(t);null!==(n=null===(i=(o=t).scrollIntoViewIfNeeded)||void 0===i?void 0:i.call(o,e))&&void 0!==n||t.scrollIntoView(e),v(r)};function m(t){let e=t;const n=new Map;for(;null!==e;)n.set(e,e.scrollTop),e=e.parentElement;return n}function v(t){t.forEach(((t,e)=>{e.scrollTop!==t&&g(e)&&(e.scrollTop=t)}))}function g(t){const e=null==t?void 0:t.style.overflow;return"hidden"===(null!=e?e:getComputedStyle(t).overflow)}h.isOverflowHidden=g;var y={};Object.defineProperty(y,"__esModule",{value:!0});var w=y.isItemVisible=function(t){if(null==t)return!1;const e=b(t);if(void 0!==e&&!E(e))return!1;const n=atom.workspace.paneContainerForItem(t);return void 0!==n&&("function"!=typeof n.isVisible||n.isVisible())};function E(t){return!(t instanceof HTMLElement)||"none"!==t.style.display&&!t.hidden&&0!==t.offsetHeight}function b(t){if(null!=t)return"function"==typeof t.getElement?t.getElement():t.element}y.isElementVisible=E,y.getItemElement=b;var P="function"==typeof WeakSet,C=Object.keys;function T(t,e){return t===e||t!=t&&e!=e}function L(t){return t.constructor===Object||null==t.constructor}function k(t){return!!t&&"function"==typeof t.then}function x(t){return!(!t||!t.$$typeof)}function M(){var t=[];return{add:function(e){t.push(e)},has:function(e){return-1!==t.indexOf(e)}}}var O=P?function(){return new WeakSet}:M;function I(t){return function(e){var n=t||e;return function(t,e,i){void 0===i&&(i=O());var o=!!t&&"object"==typeof t,r=!!e&&"object"==typeof e;if(o||r){var s=o&&i.has(t),a=r&&i.has(e);if(s||a)return s&&a;o&&i.add(t),r&&i.add(e)}return n(t,e,i)}}}var S=Function.prototype.bind.call(Function.prototype.call,Object.prototype.hasOwnProperty);function A(t,e,n,i){var o=C(t),r=o.length;if(C(e).length!==r)return!1;if(r)for(var s=void 0;r-- >0;){if("_owner"===(s=o[r])){var a=x(t),l=x(e);if((a||l)&&a!==l)return!1}if(!S(e,s)||!n(t[s],e[s],i))return!1}return!0}var j="function"==typeof Map,R="function"==typeof Set;function D(t){var e="function"==typeof t?t(n):n;function n(t,n,i){if(t===n)return!0;if(t&&n&&"object"==typeof t&&"object"==typeof n){if(L(t)&&L(n))return A(t,n,e,i);var o=Array.isArray(t),r=Array.isArray(n);return o||r?o===r&&function(t,e,n,i){var o=t.length;if(e.length!==o)return!1;for(;o-- >0;)if(!n(t[o],e[o],i))return!1;return!0}(t,n,e,i):(o=t instanceof Date,r=n instanceof Date,o||r?o===r&&T(t.getTime(),n.getTime()):(o=t instanceof RegExp,r=n instanceof RegExp,o||r?o===r&&function(t,e){return t.source===e.source&&t.global===e.global&&t.ignoreCase===e.ignoreCase&&t.multiline===e.multiline&&t.unicode===e.unicode&&t.sticky===e.sticky&&t.lastIndex===e.lastIndex}(t,n):k(t)||k(n)?t===n:j&&(o=t instanceof Map,r=n instanceof Map,o||r)?o===r&&function(t,e,n,i){var o=t.size===e.size;return o&&t.size&&t.forEach((function(t,r){o&&(o=!1,e.forEach((function(e,s){!o&&n(r,s,i)&&(o=n(t,e,i))})))})),o}(t,n,e,i):R&&(o=t instanceof Set,r=n instanceof Set,o||r)?o===r&&function(t,e,n,i){var o=t.size===e.size;return o&&t.size&&t.forEach((function(t){o&&(o=!1,e.forEach((function(e){o||(o=n(t,e,i))})))})),o}(t,n,e,i):A(t,n,e,i)))}return t!=t&&n!=n}return n}var F=D();function B(t,e){let n=e;const i=document.createElement("span");i.classList.add("outline-icon"),void 0===n&&void 0!==t&&(n=t);let o="🞇";if("string"==typeof n&&n.length>0){let t;0===n.indexOf("type-")?(t=`${n}`,o=n.replace("type-","")):(t=`type-${n}`,o=n),i.classList.add(t)}return i.innerHTML=`<span>${o.substring(0,3)}</span>`,i}D((function(){return T})),D(I()),D(I(T));class H{constructor(){this.outlineList=void 0,this.pointToElementsMap=new Map,this.treeFilterer=new e.TreeFilterer,this.element=document.createElement("div"),this.element.classList.add("atom-ide-outline"),this.element.appendChild(function(){const t=document.createElement("span");t.className="outline-toolbar";const e=document.createElement("button");e.innerHTML="Reveal Cursor",e.className="btn outline-btn",e.addEventListener("click",(()=>atom.commands.dispatch(atom.views.getView(atom.workspace),"outline:reveal-cursor"))),t.appendChild(e);const n=document.createElement("button");return n.innerHTML="Show Call Hierarchy",n.className="btn outline-btn",n.addEventListener("click",(()=>atom.commands.dispatch(atom.views.getView(atom.workspace),"outline:show-call-hierarchy"))),t.appendChild(n),t}()),this.element.appendChild(this.createSearchBar()),this.outlineContent=document.createElement("div"),this.element.appendChild(this.outlineContent),this.outlineContent.classList.add("outline-content")}reset(){var t,e,n;null===(t=this.searchBarEditorDisposable)||void 0===t||t.dispose(),null===(e=this.selectCursorDisposable)||void 0===e||e.dispose(),null===(n=this.searchBarEditor)||void 0===n||n.setText("")}destroy(){this.element.remove()}getElement(){return this.element}getTitle(){return"Outline"}getIconName(){return"list-unordered"}setOutline(t,e,n){if(void 0!==this.lastEntries&&W(t,this.lastEntries))return this.pointToElementsMap.clear(),void V(this.outlineList,t,e,this.pointToElementsMap);this.lastEntries=t,this.createOutlineList(t,e,n)}createOutlineList(t,e,n){this.clearContent(),n&&this.outlineContent.appendChild(function(){const t=document.createElement("div");return t.innerHTML='<span class="large-file-mode">Large file mode</span>',t}()),this.updateSearchBar(t,e,n),this.outlineList=_(t,e,n,this.pointToElementsMap),this.outlineContent.appendChild(this.outlineList)}clearContent(){this.outlineContent.innerHTML="",void 0!==this.outlineList&&(this.outlineList.dataset.editorRootScope=""),this.lastEntries=void 0}updateSearchBar(t,e,n){var i,o;null===(i=this.searchBarEditorDisposable)||void 0===i||i.dispose();const r=t[0],s=void 0!==(null==r?void 0:r.representativeName)?"representativeName":"plainText";this.treeFilterer.setCandidates(t,s,"children"),this.searchBarEditorDisposable=null===(o=this.searchBarEditor)||void 0===o?void 0:o.onDidStopChanging((()=>this.filterOutlineTree(e,n)))}createSearchBar(){this.searchBarEditor=new t.TextEditor({mini:!0,placeholderText:"Filter"});const e=document.createElement("div");return e.classList.add("outline-searchbar"),e.appendChild(atom.views.getView(this.searchBarEditor)),e}renderLastOutlienList(){void 0!==this.outlineList&&(this.clearContent(),this.outlineContent.appendChild(this.outlineList))}filterOutlineTree(t,n){var i,o;if(!t.isAlive()||!w(t))return;const r=null===(i=this.searchBarEditor)||void 0===i?void 0:i.getText();if("string"!=typeof r)return void this.renderLastOutlienList();const s=r.trim();if(0===s.length)return void this.renderLastOutlienList();let a;try{a=this.treeFilterer.filter(s,{maxResults:100,usePathScoring:!1})}catch(i){const r=i;r.message=`Filtering failed for unkown reasons.\n${r.message}`,console.error(r),this.reset();const a=this.treeFilterer.candidates;return this.treeFilterer=new e.TreeFilterer(a),this.updateSearchBar(a,t,n),null===(o=this.searchBarEditor)||void 0===o||o.setText(s),void this.filterOutlineTree(t,n)}const l=(c=a).filter(((t,e)=>c.findIndex((e=>F(e,t)))===e));var c;if(0===l.length)return _e("noResult");const d=_(l,t,n,this.pointToElementsMap);this.clearContent(),this.outlineContent.appendChild(d)}presentStatus(t){this.clearContent();const e=function(t){const e=document.createElement("div");e.className="status";const{title:n="",description:i=""}=t;return e.innerHTML=`<h1>${n}</h1>\n  <span>${i}</span>`,e}(t);this.outlineContent.appendChild(e)}selectAtCursorLine(t){const e=t.getLastCursor();if(!w(this))return;if(z)return void(z=!1);if(void 0!==this.focusedElms)for(const t of this.focusedElms)t.toggleAttribute("cursorOn",!1);const n=e.getBufferRow();if(this.focusedElms=this.pointToElementsMap.get(n),void 0===this.focusedElms){const t=this.pointToElementsMap.keys();let e=0;for(const i of t){if(i>=n){const t=this.pointToElementsMap.get(e);t[t.length-1].classList.add("after-border");const n=this.pointToElementsMap.get(i);this.focusedElms=[...n,...t];break}e=i}}if(void 0!==this.focusedElms){for(const t of this.focusedElms)p(t,!0),t.toggleAttribute("cursorOn",!0);this.selectCursorDisposable=t.onDidChangeCursorPosition((()=>{var t;if(void 0!==this.focusedElms)for(const t of this.focusedElms)t.toggleAttribute("cursorOn",!1);null===(t=this.selectCursorDisposable)||void 0===t||t.dispose()}))}atom.views.getView(t).focus()}}function _(t,e,n,i){const o=document.createElement("ul");o.dataset.editorRootScope=e.getRootScopeDescriptor().getScopesArray().join(" ");const r=e.getTabLength();return"number"==typeof r&&o.style.setProperty("--editor-tab-length",Math.max(r/2,2).toString(10)),$(o,t,e,n||atom.config.get("atom-ide-outline.foldInitially"),0),V(o,t,e,i),o}function W(t,e){if(t===e)return!0;{const n=t.length;if(n!==e.length)return!1;for(let i=0;i<n;i++){const n=t[i],o=e[i];if(n.representativeName!==o.representativeName||n.plainText!==o.plainText||n.kind!==o.kind||n.icon!==o.icon||!W(n.children,o.children))return!1}}return!0}function N(t){return t.children.length>=1}function $(t,e,n,i,o){var r,s;!function(t){atom.config.get("atom-ide-outline.sortEntries")&&t.sort(((t,e)=>{const n=t.startPosition.row-e.startPosition.row;return 0===n?t.startPosition.column-t.startPosition.column:n}))}(e);for(const a of e){const e=document.createElement("li"),l=document.createElement("span");if(l.innerText=null!==(s=null!==(r=a.representativeName)&&void 0!==r?r:a.plainText)&&void 0!==s?s:"",l.prepend(B(a.icon,a.kind)),e.appendChild(l),N(a)){const t=document.createElement("ul");t.style.setProperty("--indent-level",(o+1).toString(10)),t.addEventListener("click",(t=>t.stopPropagation()),{passive:!0}),e.appendChild(t);const r=U(t,i);l.prepend(r),$(t,a.children,n,i,o+1)}t.appendChild(e)}}function V(t,e,n,i,o){const r=t.children;for(let t=0,o=e.length;t<o;t++){const o=e[t],s=r[t];if(s.addEventListener("click",(()=>G(o.startPosition,n)),{passive:!0}),q(i,o.startPosition.row,s),N(o)){V(s.lastElementChild,o.children,n,i)}}}function q(t,e,n){const i=t.get(e);void 0!==i?(i.push(n),t.set(e,i)):t.set(e,[n])}let z=!1;function G(t,e){const n=atom.workspace.paneForItem(e);void 0!==n&&(n.activate(),e.getCursors()[0].setBufferPosition(t,{autoscroll:!0}),z=!0)}function U(t,e){const n=document.createElement("button");return e?(t.hidden=!0,n.classList.add("outline-fold-btn","collapsed")):n.classList.add("outline-fold-btn","expanded"),n.addEventListener("click",(e=>{t.hidden=!t.hidden,t.hidden?(n.classList.remove("expanded"),n.classList.add("collapsed")):(n.classList.remove("collapsed"),n.classList.add("expanded")),e.stopPropagation()}),{passive:!0}),n}var J={};Object.defineProperty(J,"__esModule",{value:!0});var K=J.ProviderRegistry=void 0;const Q=a.default;K=J.ProviderRegistry=class{constructor(){this.providers=[]}addProvider(t){const e=this.providers.findIndex((e=>t.priority>e.priority));return-1===e?this.providers.push(t):this.providers.splice(e,0,t),new Q.Disposable((()=>{this.removeProvider(t)}))}removeProvider(t){const e=this.providers.indexOf(t);-1!==e&&this.providers.splice(e,1)}getProviderForEditor(t){const e=t.getGrammar().scopeName;return this.findProvider(e)}getAllProvidersForEditor(t){const e=t.getGrammar().scopeName;return this.findAllProviders(e)}findProvider(t){for(const e of this.findAllProviders(t))return e;return null}*findAllProviders(t){for(const e of this.providers)null!=e.grammarScopes&&-1===e.grammarScopes.indexOf(t)||(yield e)}};var X={},Y={};Object.defineProperty(Y,"__esModule",{value:!0}),Y.getCwd=void 0;const Z=l.default,tt=c.default,et=d.default,nt=tt.promisify(et.stat);Y.getCwd=async function(t=""){var e;let n;if(t)n=t;else{const t=atom.workspace.getActivePaneItem();if(n=null===(e=null==t?void 0:t.getPath)||void 0===e?void 0:e.call(t),n){const t=atom.project.relativizePath(n)[0];if(t)return t}}try{if(n){if((await nt(n)).isDirectory())return n;n=Z.dirname(n);if((await nt(n)).isDirectory())return n}}catch(t){}return n=atom.project.getPaths()[0],n};var it={},ot=f&&f.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(it,"__esModule",{value:!0}),it.isPositionInRange=it.matchRegexEndingAt=it.wordAtPositionFromBuffer=it.getWordFromCursorOrSelection=it.getWordFromMouseEvent=it.trimRange=it.wordAtPosition=void 0;const rt=a.default,st=ot(u.default);function at(t,e,n){let i;if(n instanceof RegExp)i=n;else{const o=t.getNonWordCharacters(e).replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&");let r=`^[\t ]*$|[^\\s${o}]+`;(null==n||n.includeNonWordCharacters)&&(r+=`|[${o}]+`),i=new RegExp(r,"g")}return ct(t.getBuffer(),e,i)}function lt(t,e){const n=at(t,e);return null==n||1!==n.wordMatch.length?null:n.wordMatch[0]}function ct(t,e,n){const{row:i,column:o}=e,r=t.rangeForRow(i);let s;return t.scanInRange(n,r,(t=>{const{range:n}=t;n.start.isLessThanOrEqual(e)&&n.end.isGreaterThan(e)&&(s=t),n.end.column>o&&t.stop()})),s?{wordMatch:s.match,range:s.range}:null}it.wordAtPosition=at,it.trimRange=function(t,e,n=/\S/){const i=t.getBuffer();let{start:o,end:r}=e;return i.scanInRange(n,e,(({range:t,stop:e})=>{o=t.start,e()})),i.backwardsScanInRange(n,e,(({range:t,stop:e})=>{r=t.end,e()})),new rt.Range(o,r)},it.getWordFromMouseEvent=function(t,e){const n=t.getElement().component;return st.default(n),lt(t,n.screenPositionForMouseEvent(e))},it.getWordFromCursorOrSelection=function(t){const e=t.getSelectedText();if(e&&e.length>0)return e;const n=t.getCursorScreenPosition();return lt(t,n)},it.wordAtPositionFromBuffer=ct,it.matchRegexEndingAt=function(t,e,n){const i=t.getTextInRange([[e.row,0],e]),o=n.exec(i);return null==o?null:o[0]},it.isPositionInRange=function(t,e){return Array.isArray(e)?e.some((e=>e.containsPoint(t))):e.containsPoint(t)};var dt={};Object.defineProperty(dt,"__esModule",{value:!0}),dt.notifyError=void 0,dt.notifyError=function(t){atom.notifications.addError(t.name,{stack:t.stack,detail:t.message})};var ut={};function ft(t,e){if(t.largeFileMode)return 1e5;const n=t.getLineCount();return n>=e?n:0}function ht(t,e,n=t.getLineCount()){const i=t.getBuffer();for(let t=0,o=n;t<o;t++){const n=i.lineLengthForRow(t);if(n>e)return n}return 0}Object.defineProperty(ut,"__esModule",{value:!0}),ut.lineLengthIfLong=ut.lineCountIfLarge=ut.largeness=void 0,ut.largeness=function(t,e=atom.config.get("atom-ide-base.largeLineCount")||4e3,n=atom.config.get("atom-ide-base.longLineLength")||4e3){const i=ft(t,e);if(0!==i)return i;const o=ht(t,n);return 0!==o?o:0},ut.lineCountIfLarge=ft,ut.lineLengthIfLong=ht,function(t){var e=f&&f.__createBinding||(Object.create?function(t,e,n,i){void 0===i&&(i=n),Object.defineProperty(t,i,{enumerable:!0,get:function(){return e[n]}})}:function(t,e,n,i){void 0===i&&(i=n),t[i]=e[n]}),n=f&&f.__exportStar||function(t,n){for(var i in t)"default"===i||Object.prototype.hasOwnProperty.call(n,i)||e(n,t,i)};Object.defineProperty(t,"__esModule",{value:!0}),n(Y,t),n(J,t),n(it,t),n(dt,t),n(ut,t)}(X);const pt={noEditor:{title:"Outline is unavailable.",description:"Open a text editor."},noProvider:{title:"Provider is unavailable",description:"Looks like a provider for this type of file is not available. Check if a relevant IDE language package is installed and has outline support, or try adding one from Atom's package registry (e.g.: atom-ide-javascript, atom-typescript, ide-python, ide-rust, ide-css, ide-json)."},noResult:{title:"No result was found.",description:"The Outline could not found the text you entered in the filter bar."}};var mt=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)},vt="object"==typeof f&&f&&f.Object===Object&&f,gt="object"==typeof self&&self&&self.Object===Object&&self,yt=vt||gt||Function("return this")(),wt=yt,Et=function(){return wt.Date.now()},bt=/\s/;var Pt=function(t){for(var e=t.length;e--&&bt.test(t.charAt(e)););return e},Ct=/^\s+/;var Tt=function(t){return t?t.slice(0,Pt(t)+1).replace(Ct,""):t},Lt=yt.Symbol,kt=Lt,xt=Object.prototype,Mt=xt.hasOwnProperty,Ot=xt.toString,It=kt?kt.toStringTag:void 0;var St=function(t){var e=Mt.call(t,It),n=t[It];try{t[It]=void 0;var i=!0}catch(t){}var o=Ot.call(t);return i&&(e?t[It]=n:delete t[It]),o},At=Object.prototype.toString;var jt=St,Rt=function(t){return At.call(t)},Dt=Lt?Lt.toStringTag:void 0;var Ft=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":Dt&&Dt in Object(t)?jt(t):Rt(t)},Bt=function(t){return null!=t&&"object"==typeof t};var Ht=Tt,_t=mt,Wt=function(t){return"symbol"==typeof t||Bt(t)&&"[object Symbol]"==Ft(t)},Nt=/^[-+]0x[0-9a-f]+$/i,$t=/^0b[01]+$/i,Vt=/^0o[0-7]+$/i,qt=parseInt;var zt=mt,Gt=Et,Ut=function(t){if("number"==typeof t)return t;if(Wt(t))return NaN;if(_t(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=_t(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=Ht(t);var n=$t.test(t);return n||Vt.test(t)?qt(t.slice(2),n?2:8):Nt.test(t)?NaN:+t},Jt=Math.max,Kt=Math.min;var Qt=function(t,e,n){var i,o,r,s,a,l,c=0,d=!1,u=!1,f=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function h(e){var n=i,r=o;return i=o=void 0,c=e,s=t.apply(r,n)}function p(t){return c=t,a=setTimeout(v,e),d?h(t):s}function m(t){var n=t-l;return void 0===l||n>=e||n<0||u&&t-c>=r}function v(){var t=Gt();if(m(t))return g(t);a=setTimeout(v,function(t){var n=e-(t-l);return u?Kt(n,r-(t-c)):n}(t))}function g(t){return a=void 0,f&&i?h(t):(i=o=void 0,s)}function y(){var t=Gt(),n=m(t);if(i=arguments,o=this,l=t,n){if(void 0===a)return p(l);if(u)return clearTimeout(a),a=setTimeout(v,e),h(l)}return void 0===a&&(a=setTimeout(v,e)),s}return e=Ut(e)||0,zt(n)&&(d=!!n.leading,r=(u="maxWait"in n)?Jt(Ut(n.maxWait)||0,e):r,f="trailing"in n?!!n.trailing:f),y.cancel=function(){void 0!==a&&clearTimeout(a),c=0,i=l=o=a=void 0},y.flush=function(){return void 0===a?s:g(Gt())},y};function Xt(t,e,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(t):i?i.value:e.get(t)}function Yt(t,e,n,i,o){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!o)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!o:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?o.call(t,n):o?o.value=n:e.set(t,n),n}var Zt,te,ee,ne,ie,oe,re,se,ae,le,ce,de,ue,fe,he,pe,me,ve,ge,ye,we,Ee={noEditor:{title:"Call Hierarchy is unavailable.",description:"Open a text editor."},noProvider:{title:"Provider is unavailable.",description:"Looks like a provider for this type of file is not available. Check if a relevant IDE language package is installed and has call hierarchy support, or try adding one from Atom's package registry (e.g.: atom-ide-deno)."},noResult:{title:"No result was found.",description:"Move the cursor over the function name."}};class be extends HTMLElement{constructor({providerRegistry:e}){super(),Zt.set(this,new t.CompositeDisposable),te.set(this,void 0),ee.set(this,void 0),ne.set(this,void 0),ie.set(this,void 0),oe.set(this,300),re.set(this,void 0),this.destroyed=!1,this.getTitle=()=>"Call Hierarchy",this.getIconName=()=>"link",se.set(this,(()=>{Yt(this,ie,"incoming"===Xt(this,ie,"f")?"outgoing":"incoming","f"),this.setAttribute("current-type",Xt(this,ie,"f")),this.showCallHierarchy()})),ae.set(this,(async t=>{const e=Xt(this,re,"f"),n=Yt(this,re,be.getStatus(t),"f");if("valid"===n){Xt(this,ne,"f").innerHTML="";const e=new Pe(t);return Xt(this,ne,"f").appendChild(e),void await e.toggleAllItem()}if(e===n)return;Xt(this,ne,"f").innerHTML="";const i=new Ce(Ee[n]);Xt(this,ne,"f").appendChild(i)})),Yt(this,ee,e,"f");const n=this.appendChild(document.createElement("div"));n.innerHTML='\n      <div class="icon icon-alignment-align">Incoming</div>\n      <div class="icon icon-alignment-aligned-to">Outgoing</div>\n    ',n.addEventListener("click",(()=>Xt(this,se,"f").call(this))),Yt(this,ne,this.appendChild(document.createElement("div")),"f"),Yt(this,ie,"incoming","f"),this.setAttribute("current-type","incoming");const i=Qt(this.showCallHierarchy.bind(this),Xt(this,oe,"f"));Xt(this,Zt,"f").add(atom.workspace.observeActiveTextEditor((t=>{var e;null===(e=Xt(this,te,"f"))||void 0===e||e.dispose(),Yt(this,te,null==t?void 0:t.onDidChangeCursorPosition((e=>{i(t,e.newBufferPosition)})),"f"),this.showCallHierarchy(t)})))}static getStatus(t){return"string"==typeof t?t:t&&0!==t.data.length?"valid":"noResult"}async showCallHierarchy(t,e){if(this.destroyed)return;const n=null!=t?t:atom.workspace.getActiveTextEditor();if(!n)return void await Xt(this,ae,"f").call(this,"noEditor");const i=null!=e?e:n.getCursorBufferPosition(),o=Xt(this,ee,"f").getProviderForEditor(n);o?await Xt(this,ae,"f").call(this,await("incoming"===Xt(this,ie,"f")?o.getIncomingCallHierarchy(n,i):o.getOutgoingCallHierarchy(n,i))):await Xt(this,ae,"f").call(this,"noProvider")}destroy(){var t;this.innerHTML="",null===(t=Xt(this,te,"f"))||void 0===t||t.dispose(),Xt(this,Zt,"f").dispose(),this.destroyed=!0}}Zt=new WeakMap,te=new WeakMap,ee=new WeakMap,ne=new WeakMap,ie=new WeakMap,oe=new WeakMap,re=new WeakMap,se=new WeakMap,ae=new WeakMap,customElements.define("atom-ide-outline-call-hierarchy-view",be);class Pe extends HTMLElement{constructor(t){super(),le.set(this,void 0),ce.set(this,void 0),de.set(this,300),ue.set(this,(({path:t,range:{start:{row:e,column:n}},selectionRange:i})=>{const o=atom.workspace.getActiveTextEditor();(null==o?void 0:o.getPath())===t?(o.setCursorBufferPosition([e,n]),o.scrollToBufferPosition([e,n],{center:!0}),o.setSelectedBufferRange(i)):atom.workspace.open(t,{initialLine:e,initialColumn:n,searchAllPanes:!0,activatePane:!0,activateItem:!0}).then((t=>null==t?void 0:t.setSelectedBufferRange(i)))})),Yt(this,le,t,"f"),Yt(this,ce,Xt(this,le,"f").data.map(((e,n)=>t.itemAt(n))),"f"),this.append(...Xt(this,le,"f").data.map(((t,e)=>{var n,i,o;const r=document.createElement("div");r.setAttribute("title",t.path),r.innerHTML=`\n          <div class="icon icon-chevron-right">\n            <div>\n              <span>${Te(t.name)}</span>\n              <span class="detail">${Te(t.detail?` - ${t.detail}`:"")}</span>\n              ${t.tags.map((t=>`<span class="tag-${Te(t)}">${Te(t)}</span>`)).join("")}\n            </div>\n          </div>\n        `,null===(n=r.querySelector(":scope>div>div"))||void 0===n||n.insertAdjacentElement("afterbegin",B(null!==(i=t.icon)&&void 0!==i?i:void 0,void 0));let s=!1;return null===(o=r.querySelector(":scope>div"))||void 0===o||o.addEventListener("click",(t=>{t.stopPropagation(),s&&Xt(this,le,"f")?Xt(this,ue,"f").call(this,Xt(this,le,"f").data[e]):(this.toggleItemAt(e),window.setTimeout((()=>s=!1),Xt(this,de,"f")),s=!0)}),!1),Xt(this,ce,"f")[e].then((t=>{Pe.isEmpty(t)||r.classList.add("call-hierarchy-exist-child-data")})),r})))}static isEmpty(t){return!t||0===t.data.length}async toggleItemAt(t){const e=this.querySelectorAll(":scope>div")[t],n=e.querySelector(":scope>div"),i=e.querySelector("atom-ide-outline-call-hierarchy-item");if(i)"none"!==i.style.display?(i.style.display="none",null==n||n.classList.replace("icon-chevron-down","icon-chevron-right")):(i.style.display="",null==n||n.classList.replace("icon-chevron-right","icon-chevron-down"));else{const i=await Xt(this,ce,"f")[t];Pe.isEmpty(i)||(e.appendChild(new Pe(i)),null==n||n.classList.replace("icon-chevron-right","icon-chevron-down"))}}async toggleAllItem(){var t,e;const n=null!==(e=null===(t=Xt(this,le,"f"))||void 0===t?void 0:t.data.length)&&void 0!==e?e:0;await Promise.all([...Array(n).keys()].map((t=>this.toggleItemAt(t))))}}le=new WeakMap,ce=new WeakMap,de=new WeakMap,ue=new WeakMap,customElements.define("atom-ide-outline-call-hierarchy-item",Pe);class Ce extends HTMLElement{constructor({title:t,description:e}){super(),this.innerHTML=`\n      <h1>${Te(t)}</h1>\n      <span>${Te(e)}</span>\n    `}}function Te(t){return t.replace(/["&'<>`]/g,(t=>({"&":"&amp;","'":"&#x27;","`":"&#x60;",'"':"&quot;","<":"&lt;",">":"&gt;"}[t])))}customElements.define("atom-ide-outline-call-hierarchy-status-item",Ce);class Le{constructor({createItem:t}){fe.add(this),me.set(this,void 0),Yt(this,me,t,"f")}toggle(){const{state:t,targetPane:e}=Xt(this,fe,"m",we).call(this);"hidden"===t?Xt(this,fe,"m",ve).call(this,{targetPane:e}):"noItem"===t?Xt(this,fe,"m",ge).call(this,{targetPane:e}):Xt(this,fe,"m",ye).call(this,{targetPane:e})}show(){const{state:t,targetPane:e}=Xt(this,fe,"m",we).call(this);"hidden"===t?Xt(this,fe,"m",ve).call(this,{targetPane:e}):"noItem"===t&&Xt(this,fe,"m",ge).call(this,{targetPane:e})}delete(){const t=this.item&&atom.workspace.paneForItem(this.item);t&&Xt(this,fe,"m",ye).call(this,{targetPane:t})}}he=Le,me=new WeakMap,fe=new WeakSet,pe=function(){return atom.workspace.getRightDock()},ve=function({targetPane:t}){this.item&&t.activateItem(this.item);const e=atom.workspace.getPaneContainers().find((e=>e.getPanes().includes(t)));e&&"show"in e&&e.show()},ge=function({targetPane:t}){this.item=Xt(this,me,"f").call(this),t.addItem(this.item),t.activateItem(this.item),Xt(Le,he,"m",pe).call(Le).show()},ye=function({targetPane:t}){this.item&&t.destroyItem(this.item)},we=function(){const t=this.item&&atom.workspace.paneForItem(this.item);return t?t.getActiveItem()===this.item&&atom.workspace.getVisiblePanes().includes(t)?{state:"visible",targetPane:t}:{state:"hidden",targetPane:t}:{state:"noItem",targetPane:Xt(Le,he,"m",pe).call(Le).getActivePane()}};const ke=new K,xe=new t.CompositeDisposable,Me=new Le({createItem:()=>new be({providerRegistry:ke})});var Oe={initialDisplay:{title:"Initial Outline Display",description:"Show outline initially aftern atom loads",type:"boolean",default:!0},sortEntries:{title:"Sort entries based on the line number",description:"This option sorts the entries based on where they appear in the code.",type:"boolean",default:!0},foldInitially:{title:"Fold the entries initially",description:"If enabled, the outline entries are folded initially. This is enabled automatically in large file mode.",type:"boolean",default:!1}};const Ie=new t.CompositeDisposable;let Se;const Ae=new K;let je;async function Re(e){if(void 0===e)return;null==je||je.dispose(),je=new t.CompositeDisposable,await He(e);const n=function(t){const e=X.largeness(t);return Math.max(e/4,300)}(e),i=Qt(Be,n);je.add(e.onDidStopChanging((async()=>{await i(e)})),e.onDidDestroy((()=>{_e("noEditor")})))}function De(){const t=atom.workspace.getActiveTextEditor();void 0!==t&&void 0!==Se&&Se.selectAtCursorLine(t)}async function Fe(){void 0===Se&&(Se=new H);const t=atom.workspace.paneForItem(Se);if(t)return void await t.destroyItem(Se);const e=atom.workspace.getRightDock(),[n]=e.getPanes();n.addItem(Se),n.activateItem(Se),e.show();try{await Re(atom.workspace.getActiveTextEditor())}catch(t){X.notifyError(t)}}function Be(t=atom.workspace.getActiveTextEditor()){if(w(Se))return He(t)}async function He(t=atom.workspace.getActiveTextEditor()){var e;if(void 0===Se?Se=new H:Se.reset(),void 0===t)return _e("noEditor");const n=Ae.getProviderForEditor(t);if(!n)return _e("noProvider");const i=await n.getOutline(t);Se.setOutline(null!==(e=null==i?void 0:i.outlineTrees)&&void 0!==e?e:[],t,Boolean(X.largeness(t)))}function _e(t){null==Se||Se.presentStatus(pt[t])}exports.activate=function(){xe.add(atom.commands.add("atom-workspace","outline:toggle-call-hierarchy",(()=>Me.toggle())),atom.commands.add("atom-workspace","outline:show-call-hierarchy",(()=>Me.show()))),Ie.add(atom.commands.add("atom-workspace","outline:toggle",Fe),atom.commands.add("atom-workspace","outline:reveal-cursor",De)),Ie.add(atom.workspace.onDidChangeActiveTextEditor(Re)),atom.config.get("atom-ide-outline.initialDisplay")&&Fe().catch((t=>{X.notifyError(t)}))},exports.config=Oe,exports.consumeCallHierarchyProvider=function(t){var e;const n=ke.addProvider(t);return xe.add(n),null===(e=Me.item)||void 0===e||e.showCallHierarchy(),n},exports.consumeOutlineProvider=function(t){const e=Ae.addProvider(t);return Ie.add(e),He().catch((t=>{throw t})),e},exports.deactivate=function(){xe.dispose(),Me.delete(),null==je||je.dispose(),Ie.dispose(),null==Se||Se.destroy(),Se=void 0},exports.getOutline=He,exports.outlineProviderRegistry=Ae,exports.revealCursor=De,exports.setStatus=_e,exports.statuses=pt,exports.toggleOutlineView=Fe;
//# sourceMappingURL=main.js.map
