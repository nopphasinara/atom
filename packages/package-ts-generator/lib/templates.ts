export const tsconfig = `{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true,
    "importHelpers": true,
    "jsx": "react",
    "lib": ["es6", "dom"],
    "module": "commonjs",
    "noLib": false,
    "outDir": "../dist",
    "preserveConstEnums": true,
    "reactNamespace": "React",
    "skipLibCheck": true,
    "sourceMap": true,
    "target": "es6"
  },
  "compileOnSave": true
}
`

export const mainTemplate = `import {CompositeDisposable} from "atom";
import {{PackageCamelName}}View from "./{{PackageName}}-view";

let {{ViewVariableName}}: {{PackageCamelName}}View;
let modalPanel: any;
let subscriptions: CompositeDisposable;

export function activate(state: any) {
    {{ViewVariableName}} = new {{PackageCamelName}}View(state.{{ViewVariableName}}State);
    modalPanel = atom.workspace.addModalPanel({
        item: {{ViewVariableName}}.getElement(),
        visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    subscriptions.add(atom.commands.add('atom-workspace',
        '{{PackageName}}:toggle', () => toggle()
    ));
}

export function deactivate() {
    modalPanel.destroy();
    subscriptions.dispose();
    {{ViewVariableName}}.destroy();
}

export function serialize() {
    return {
        {{ViewVariableName}}State: {{ViewVariableName}}.serialize()
    };
}

function toggle() {
    console.log('{{PackageCamelName}} was toggled!');
    return (
        modalPanel.isVisible() ?
            modalPanel.hide() :
            modalPanel.show()
    );
}
`

export const viewTemplate = `
export default class {{PackageCamelName}}View {
    element: HTMLElement;
    constructor(serializedState: any) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('{{PackageName}}');
        // Create message element
        const message = document.createElement('div');
        message.textContent = 'The {{PackageCamelName}} package is Alive! It\'s ALIVE!';
        message.classList.add('message');
        this.element.appendChild(message);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }
}
`

export const reactViewTemplate = `import React = require('react');
import ReactDOM = require('react-dom');

interface Props {
    foo: string;
}

class MyComponent extends React.Component<Props, null> {
    render() {
        return <p>Hello, {this.props.foo}! The {{PackageCamelName}} package is Alive!</p>
    }
}

export default class {{PackageCamelName}}View {
    element: HTMLElement;
    constructor(serializedState: any) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('{{PackageName}}');
        // Create react element
        ReactDOM.render(
            <MyComponent foo="bar" />,
            this.element
        );
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }
}
`
