# shared-settings package

This package adds a new 'Shared' settings view to the built-in `settings-view` package.

Individual packages now have a place to store and fetch settings which may be shared
among many packages.

For example, there are many atom packages which execute the PHP binary. Currently, every
one of these packages must add an entry into its own package schema for the path to the
PHP binary. It is an inconvenience for the end user to have to configure each of these.

This package solves the problem by creating a single place to store such settings.

Within your `package.json`, add the new entry `sharedConfigSchema` and populate it
the same way you would populate your packages main `configSchema`. With the above example
a package.json may look like:

```js
{
    "sharedConfigSchema": {
        "php": {
            "type": "object",
            "properties": {
                "php-command": {
                  "title": "PHP command",
                  "description": "The path to your PHP binary (e.g. /usr/bin/php, php, ...).",
                  "type": "string",
                  "default": "php"
                }
            }
        }
    }
}
```

These settings may be accessed through the standard `Config` class under the global namespace 'shared':

```js
const cmd = atom.config.get('shared.php.php-command')
```

#### Notice
When multiple packages specify the same setting key, but with different schemas, a notification
will be shown to the user and the schema from the first package loaded will be applied.

Known schemas are listed in the [schemas directory](schemas) for your convenience. This list will
grow as the package becomes more popular. If you think a new schema should be listed, please
submit a pull request.

As a package developer, the burden is on you to make sure no conflicts arise.

Copyright (c) 2018 Owen Parry <waldermort@gmail.com>
