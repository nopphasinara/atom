/** @babel */
/* global atom describe it expect beforeEach spyOn */

import SharedSchema from '../lib/shared-schema'

describe('SharedSchema', () => {

    beforeEach(() => {
        spyOn(atom.notifications, 'addWarning')
    });

    describe('mergeSchemaItem', () => {
        it('returns a clone of source when no target is given', () => {
            const schema = {
                type: 'string',
                default: 'Hello World!'
            }

            const value = SharedSchema.mergeSchemaItem('test', undefined, schema)

            expect(value).not.toBe(schema)
            expect(value.packages).toEqual(['test'])

            delete value.packages

            expect(value).toEqual(schema)
        })

        it('returns a clone of target when no source is given', () => {
            const schema = {
                type: 'string',
                default: 'Hello World!'
            }

            const value = SharedSchema.mergeSchemaItem('test', schema, undefined)

            expect(value).not.toBe(schema)
            expect(value.packages).toEqual(['test'])

            delete value.packages

            expect(value).toEqual(schema)
        })

        it('coerces source values', () => {
            const source = {
                type: 'boolean',
                default: 'true',
                enum: [true, 'false']
            }

            const value = SharedSchema.mergeSchemaItem('test', undefined, source)

            expect(value).toEqual({
                type: 'boolean',
                default: true,
                enum: [true, false],
                packages: ['test']
            })
        })

        it('does not coerce target values', () => {
            const target = {
                type: 'boolean',
                default: 'true',
                enum: [true, 'false'],
                packages: ['test']
            }

            const value = SharedSchema.mergeSchemaItem('test', target, undefined)

            expect(value).toEqual({
                type: 'boolean',
                default: 'true',
                enum: [true, 'false'],
                packages: ['test']
            })
        })

        it('merges source and target into a new object', () => {
            const source = {
                type: 'boolean',
                default: 'true'
            }
            const target = {
                type: 'boolean',
                default: true,
                packages: ['exists']
            }

            const value = SharedSchema.mergeSchemaItem('test', target, source)

            expect(value).not.toBe(source)
            expect(value).not.toBe(target)
            expect(value).toEqual({
                type: 'boolean',
                default: true,
                packages: ['exists', 'test'] // NOTE order is important
            })
        })

        it('returns unique list of packages', () => {
            const source = {
                type: 'boolean',
                default: 'true'
            }
            const target = {
                type: 'boolean',
                default: true,
                packages: ['1', '2', '1', '2', '3']
            }

            const value = SharedSchema.mergeSchemaItem('test', target, source)

            expect(value.packages).toEqual(['1', '2', '3', 'test'])
        })

        it('ignores title and description properties', () => {
            const source = {
                title: 'Goodbye',
                description: 'Goodbye World'
            }
            const target = {
                title: 'Hello',
                description: 'Hello World'
            }

            const value = SharedSchema.mergeSchemaItem('test', target, source)

            expect(value).toEqual({
                title: 'Hello',
                description: 'Hello World',
                packages: ['test']
            })
        })

        it('throws on unequal properties', () => {
            const source = {
                type: 'string'
            }
            const target = {
                type: 'boolean'
            }

            expect(SharedSchema.mergeSchemaItem.bind(null, 'test', target, source)).toThrow()
        })
    })

    describe('mergeSchemaObjects', () => {
        it('merges source into target', () => {
            const source = {
                source1: {
                    type: 'string',
                    default: 'foo'
                }
            }
            const target = {
                target1: {
                    type: 'string',
                    default: 'foo',
                    packages: ['exists']
                }
            }

            SharedSchema.mergeSchemaObjects('test', target, source)

            expect(atom.notifications.addWarning).not.toHaveBeenCalled()
            expect(target).toEqual({
                source1: {
                    type: 'string',
                    default: 'foo',
                    packages: ['test']
                },
                target1: {
                    type: 'string',
                    default: 'foo',
                    packages: ['exists']
                }
            })
        })

        it('does not modify source', () => {
            const source = {
                source1: {
                    type: 'string',
                    default: 'foo'
                }
            }
            const target = {
                target1: {
                    type: 'string',
                    default: 'foo',
                    packages: ['exists']
                }
            }

            SharedSchema.mergeSchemaObjects('test', target, source)

            expect(atom.notifications.addWarning).not.toHaveBeenCalled()
            expect(source).toEqual({
                source1: {
                    type: 'string',
                    default: 'foo'
                }
            })
        })

        it('merges nested objects', () => {
            const source = {
                nested: {
                    type: 'object',
                    properties: {
                        source1: {
                            type: 'string',
                            default: 'foo'
                        }
                    }
                }
            }
            const target = {
                nested: {
                    type: 'object',
                    properties: {
                        target1: {
                            type: 'string',
                            default: 'foo',
                            packages: ['exists']
                        }
                    }
                }
            }

            SharedSchema.mergeSchemaObjects('test', target, source)

            expect(atom.notifications.addWarning).not.toHaveBeenCalled()
            expect(target).toEqual({
                nested: {
                    type: 'object',
                    'properties': {
                        target1: {
                            type: 'string',
                            default: 'foo',
                            packages: ['exists']
                        },
                        source1: {
                            type: 'string',
                            default: 'foo',
                            packages: ['test']
                        },
                    }
                }
            })
        })

        it('adds package name when merging same schema', () => {
            const source = {
                nested: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            default: 'foo'
                        }
                    }
                }
            }
            const target = {
                nested: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            default: 'foo',
                            packages: ['exists']
                        }
                    }
                }
            }

            SharedSchema.mergeSchemaObjects('test', target, source)

            expect(atom.notifications.addWarning).not.toHaveBeenCalled()
            expect(target).toEqual({
                nested: {
                    type: 'object',
                    'properties': {
                        name: {
                            type: 'string',
                            default: 'foo',
                            packages: ['exists', 'test']
                        },
                    }
                }
            })
        })

        it('warns user when merging missmatched schemas', () => {
            const source = {
                nested: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            default: 'foo'
                        }
                    }
                }
            }
            const target = {
                nested: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            default: 'bar',
                            packages: ['exists']
                        }
                    }
                }
            }

            SharedSchema.mergeSchemaObjects('test', target, source)

            expect(atom.notifications.addWarning).toHaveBeenCalled()
        })
    })
})
