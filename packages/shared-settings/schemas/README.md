The files here are to be used as a guide to adding shared schemas to your own projects.
You **don't** need to import all keys, select only those which your project uses. If
you find a setting not present, you are free to add it.

The purpose of this is to avoid conflicts between schemas created by individual developers by
placing all common settings in a common place.

Each file in this directory is named according to the top level namespace of known
schemas. So, for schema related to PHP projects, look in `php.schema`.

Pull requests are welcome, but only common settings will be merged. Please keep all
property names as `kebab-cased` and default values which are supported on all OS's.
