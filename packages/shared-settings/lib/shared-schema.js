/** @babel */
/** @jsx etch.dom */
/* global atom Set */

import { CompositeDisposable, Emitter } from 'atom'
import deepEqual from 'deep-equal'
import deepClone from 'deep-clone'

class MergeError extends Error {

}

export default class SharedSchema
{
    constructor () {
        this.disposables = new CompositeDisposable()
        this.emitter = new Emitter()
        this.mergedSchema = {}

        this.disposables.add(atom.packages.onDidActivatePackage(this.loadSchemaFromPackage.bind(this)))
        this.disposables.add(atom.packages.onDidDeactivatePackage(this.loadSchemasFromPackages.bind(this)))

        this.loadSchemasFromPackages()
    }

    destroy () {
        this.disposables.dispose()
    }

    onDidSchemaChange (cb) {
        return this.emitter.on('schema-change', cb)
    }

    applySchema () {
        atom.config.setSchema('shared', {
            type: 'object',
            properties: this.mergedSchema
        })

        this.emitter.emit('schema-change')
    }

    loadSchemasFromPackages () {
        this.mergedSchema = {}

        for (const pkg of atom.packages.getActivePackages()) {
            this.loadSchemaFromPackage(pkg, false)
        }

        this.applySchema()
    }

    loadSchemaFromPackage (pkg, applyToConfig = true) {
        let schema

        if (pkg.metadata && pkg.metadata.sharedConfigSchema) {
            schema = pkg.metadata.sharedConfigSchema
        } else if (pkg.mainModule && typeof pkg.mainModule.sharedConfig === 'object') {
            schema = pkg.mainModule.sharedConfig
        }

        if (schema) {
            SharedSchema.mergeSchemaObjects(pkg.name, this.mergedSchema, schema, 'shared')

            if (applyToConfig) {
                this.applySchema()
            }
        }
    }

    static mergeSchemaItem = (pkgName, target, source) => {
        let packages, clone

        const coerce = (object) => {
            const enforce = (value) => {
                return atom.config.constructor.executeSchemaEnforcers('', value, {
                    type: object.type,
                })
            }

            const clone = deepClone(object)

            if (clone.default != null) {
                clone.default = enforce(clone.default)
            }

            if (clone.enum) {
                clone.enum = clone.enum.map(enforce)
            }

            return clone
        }

        if (!target) {
            clone = coerce(source)
        } else {
            packages = target.packages
            clone = deepClone(target)

            if (source) {
                source = coerce(source)

                for (const prop in source) {
                    if (prop in target) {
                        if (['type', 'default', 'enum', 'items', 'minimum', 'maximum', 'maximumLength'].indexOf(prop) !== -1 && !deepEqual(source[prop], target[prop])) {
                            throw new MergeError(`schema.${prop} not equal (${JSON.stringify(source[prop])}) and (${JSON.stringify(target[prop])})`)
                        }
                    } else {
                        clone[prop] = source[prop]
                    }
                }
            }
        }

        clone.packages = [...(new Set(packages ? packages.concat(pkgName) : [pkgName]))]

        return clone
    }

    static mergeSchemaObjects = (pkgName, target, source, path = 'shared') => {
        for (const key in source) {
            const srcItem = source[key]

            let clonedItem = null
            let packages = null
            let reason = ''

            if ('object' === srcItem.type) {
                let targetItem = null

                if (key in target) {
                    packages = target[key].packages
                    if ('object' === target[key].type && 'object' === typeof target[key].properties) {
                        targetItem = target[key]
                    }
                } else {
                    targetItem = {
                        type: 'object',
                        properties: {},
                        packages: [pkgName]
                    }
                }

                if (targetItem) {
                    SharedSchema.mergeSchemaObjects(pkgName, targetItem.properties, srcItem.properties, path + '.' + key)
                    clonedItem = targetItem
                }
            } else {
                try {
                    packages = target[key] && target[key].packages
                    clonedItem = SharedSchema.mergeSchemaItem(pkgName, target[key], srcItem)
                } catch (err) {
                    if (err instanceof MergeError) {
                        reason = `: "${err.message}"`
                    }
                }
            }

            if (!clonedItem) {
                atom.notifications.addWarning('Failed to merge shared schema', {
                    detail: `Schema "${path}" in package "${pkgName}" conflicts with packages (${packages ? packages.join(", ") : null})` + reason,
                    dismissable: true
                })
            } else {
                target[key] = clonedItem
            }
        }
    }
}
