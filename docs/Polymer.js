<!doctype html>
<html>
<head>
<meta name="description" content="Polymer 3.0 example">
  <!-- Polyfills only needed for Firefox and Edge. -->
  <script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
</head>
<body>

<script type="module">
  import {PolymerElement, html} from 'https://unpkg.com/@polymer/polymer/polymer-element.js?module';
  import {Polymer} from 'https://unpkg.com/@polymer/polymer/polymer-legacy.js?module';
  import {dedupingMixin} from 'https://unpkg.com/@polymer/polymer/lib/utils/mixin.js?module';

  /******************************************************************
   * Basic directives implementation for Polymer
   * ****************************************************************/

  const directives = new WeakSet();
  const directive = (directiveFn) => {
    directives.add(directiveFn);
    return directiveFn;
  };
  const nothing = {};
  const DirectiveMixin = dedupingMixin((superClass) => class extends superClass {
    _valueToNodeAttribute(node, value, attribute) {
      if (directives.has(value) && (value = value(node, attribute, 'attribute')) === nothing) {
        return;
      }
      super._valueToNodeAttribute(node, value, attribute);
    }
    _setUnmanagedPropertyToNode(node, prop, value) {
      if (directives.has(value) && (value = value(node, prop, 'property')) === nothing) {
        return;
      }
      super._setUnmanagedPropertyToNode(node, prop, value);
    }
  });

  /************************************************
   * styleMap mixin example (from lit-html)
   * **********************************************/

  const previousStylePropertyCache = new WeakMap();
  const StyleMapMixin = dedupingMixin((superClass) => class extends DirectiveMixin(superClass) {
    styleMap(styleInfo) {
      return directive((element, name, type) => {
        if (name !== 'style' && type !== 'attribute') {
          throw new Error('styleMap can only be used in a `style$="[[styleMap(...)]]" binding`')
        }
        const {style} = element;
        let previousStyleProperties = previousStylePropertyCache.get(element);
        if (previousStyleProperties === undefined) {
          previousStylePropertyCache.set(element, previousStyleProperties = new Set());
        }
        // Remove old properties that no longer exist in styleInfo
        previousStyleProperties.forEach((name) => {
          if (!(name in styleInfo)) {
            previousStyleProperties.delete(name);
            if (name.indexOf('-') === -1) {
              style[name] = null;
            } else {
              style.removeProperty(name);
            }
          }
        });
        // Add or update properties
        for (const name in styleInfo) {
          previousStyleProperties.add(name);
          if (name.indexOf('-') === -1) {
            style[name] = styleInfo[name];
          } else {
            style.setProperty(name, styleInfo[name]);
          }
        }
        return nothing;
      });
    }
  });

  /************************************************
   * styleMap example usage
   * **********************************************/

  customElements.define('x-host', class extends StyleMapMixin(PolymerElement) {
    static properties = {
      styles: Object
    }
    static template = html`
      <style>span { padding: 10px; margin: 10px; }</style>
      <button on-click="changeColor">Change color</button>
      <span style$="[[styleMap(styles)]]">Test</span>
    `;
    constructor() {
      super();
      this.styles = { color: 'red' };
    }
    changeColor() {
      this.styles = {
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        background: `#${Math.floor(Math.random()*16777215).toString(16)}`
      }
    }
  });

  /************************************************
   * styleMap example usage (Legacy)
   * **********************************************/

  // Must install mixin into Polymer.Class
  const Class = Polymer.Class;
  Polymer.Class = (info, prevMixin) => {
    const mixin = prevMixin ?
      (superClass) => StyleMapMixin(prevMixin(superClass)) : StyleMapMixin;
    return Class(info, mixin);
  }

  Polymer({
    is: 'x-legacy',
    _template: html`
      <style>span { padding: 10px; margin: 10px; }</style>
      <button on-click="changeColor">Change color</button>
      <span style$="[[styleMap(styles)]]">Test</span>
    `,
    properties: {
      styles: {
        value() {
          return { color: 'red' };
        }
      }
    },
    changeColor() {
      this.styles = {
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        background: `#${Math.floor(Math.random()*16777215).toString(16)}`
      }
    }
  })

</script>

<x-host></x-host>

<hr>

<x-legacy></x-legacy>

</body>
</html>