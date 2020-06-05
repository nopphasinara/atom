/** @babel */
/** @jsx etch.dom */
/* global atom document require */

import { CompositeDisposable } from 'atom'
import Path from 'path'

import SharedSchema from './shared-schema'

let SettingsPanel = null

function createSettingsPanel () {
    if (!SettingsPanel) {
        const packagePath = atom.packages.resolvePackagePath('settings-view')
        const settingsClass = Path.join(packagePath, 'lib/settings-panel')

        SettingsPanel = require(settingsClass)
    }
}

export default class SharedPanel
{
    constructor () {
        createSettingsPanel()

        this.sharedSchema = new SharedSchema()

        this.element = document.createElement('div')
        this.element.className = 'panels-item'
        this.element.tabIndex = 0

        this.update()

        this.subscriptions = new CompositeDisposable()
        this.subscriptions.add(atom.commands.add(this.element, {
            'core:move-up': () => { this.scrollUp() },
            'core:move-down': () => { this.scrollDown() },
            'core:page-up': () => { this.pageUp() },
            'core:page-down': () => { this.pageDown() },
            'core:move-to-top': () => { this.scrollToTop() },
            'core:move-to-bottom': () => { this.scrollToBottom() }
        }))

        this.subscriptions.add(this.sharedSchema.onDidSchemaChange(() => {
            this.update()
        }))
    }

    destroy () {
        this.subscriptions.dispose()
        this.sharedSchema.destroy()
    }

    update () {
        if (this.panel) {
            this.element.removeChild(this.panel.element)
        }

        this.panel = new SettingsPanel({
            namespace: 'shared',
            icon: 'gear',
            note: `<div class="text icon icon-question" id="shared-settings-note" tabindex="-1">` +
                  `These are Atom's shared settings which affect behavior of multiple packages.</div>`
        })

        this.element.appendChild(this.panel.element)
    }

    focus () {
        this.element.focus()
    }

    show () {
        this.element.style.display = ''
    }

    scrollUp () {
        this.element.scrollTop -= document.body.offsetHeight / 20
    }

    scrollDown () {
        this.element.scrollTop += document.body.offsetHeight / 20
    }

    pageUp () {
        this.element.scrollTop -= this.element.offsetHeight
    }

    pageDown () {
        this.element.scrollTop += this.element.offsetHeight
    }

    scrollToTop () {
        this.element.scrollTop = 0
    }

    scrollToBottom () {
        this.element.scrollTop = this.element.scrollHeight
    }
}
