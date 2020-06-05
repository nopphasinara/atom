/** @babel */
/* global atom require */

import SharedPanel from './shared-panel'

const SETTINGS_PACKAGE = 'settings-view'

let hookedMethod = null

export default
{
    activate () {
        if (null == hookedMethod) {
            const hookPath = atom.packages.resolvePackagePath(SETTINGS_PACKAGE) + '/lib/settings-view'
            this.hookedClass = require(hookPath)

            hookedMethod = this.hookedClass.prototype.addCorePanel
        }

        this.hookedClass.prototype.addCorePanel = function (name, icon, cb) {
            hookedMethod.call(this, name, icon, cb)
            if ('Core' === name) {
                hookedMethod.call(this, 'Shared', 'gear', () => new SharedPanel())
            }
        }

        this.reloadSettingView()
    },

    deactivate () {
        this.hookedClass.prototype.addCorePanel = hookedMethod

        this.reloadSettingView()
    },

    reloadSettingView () {
        if (atom.packages.isPackageActive(SETTINGS_PACKAGE)) {
            for (const item of atom.workspace.getPaneItems()) {
                if (item instanceof this.hookedClass) {
                    // This will close the item. I can't find a way to refresh
                    // without closing.
                    atom.workspace.toggle(item)
                }
            }
        }
    },
};
