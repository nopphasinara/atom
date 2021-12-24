# Atom LESS Package

### Configurations

- "main": string - The relative or absolute path to the main LESS file to be compiled (ignores all other options)
- "out": boolean|string - true to output using the filename, or a string specifying a name to use
- "compress": boolean - Use Less.JS built-in compression (not compatible with Clean-CSS or Source Maps)
- "strictMath": boolean - Require brackets around math expressions
- "sourceMap": boolean|Object - true to turn on source maps, or an object specifying LESS source map properties
- "cleancss": string|object - a string specifying the 'compatibility' property, or an object specifying the Clean-CSS properties (not compatible with Source Maps)
- "autoprefixer": string|object - a ; separated string specifying the 'browsers' property, or an object specifying the AutoPrefixer properties