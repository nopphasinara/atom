# Sass Compiler for ATOM editor

Sass Compiler based on node-sass library that provides binding for Node.js to libsass. Works only with scss syntax.

## Dependencies
* node-sass library https://github.com/sass/node-sass

## Modes
Available two compiling file detection modes:
* Base path is editor project.
* Tries to extract current path from editable file. It will check if **inputPath** value are in editable file path, and it will be reference point for compiling `Scss` file. Aslo it could be specified based on reference point with **outputPathExtracted**.

## Settings
| Parameter           	| Description                                    	|
|---------------------	|--------------------------------------------------------------------------------------------------------------------	|
| inputPath           	| Specifies where the *Scss* files are stored. ( Path relative to your project ).                                    	|
| outputPath          	| This specifies where the *CSS* will be saved. ( Path relative to your project ).                                   	|
| fileName            	| *Scss* type file name, to be parent of all @include.                                                               	|
| outputStyle         	| `String` to determine how the final *CSS* should be rendered. Its value should be one of `nested` or `compressed`. 	|
| successMsg          	| Eneable/disable success message.                                                                                   	|
| extractPath         	| Eneable/disable - Get path from file. ( package tries to extract current path based on editable file and sets reference point ).                              	|
| inputPathExtracted  	| Specifies where your *Scss* files are stored. ( Relative to extracted reference point ).                            	|
| outputPathExtracted 	| Specifies where the *CSS* will be saved. ( Relative to extracted reference point ).                                 	|

## Plans
* Include `node-sass` in package dependencies to use apm node not local one.
