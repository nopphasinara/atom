# php-integrator/atom-base-legacy-php56
<p align="right">
:coffee:
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YKTNLZCRHMRTJ">Send me some coffee beans</a>
</p>

## Legacy
This is a legacy version that requires PHP >= 5.6. Users that are on PHP 7.1 can and should use [the newer version](https://github.com/php-integrator/atom-base).

This package only exists to cater towards users that are not in any position to upgrade their host PHP version. As a result, any issues that appear in this package will not be fixed, no new features will be added and no enhancements will be done.

## About
This package provides Atom integration for [PHP Integrator](https://gitlab.com/php-integrator/core) and exposes a service that other packages can use to provide additional functionality, such as autocompletion,
code navigation and tooltips. The user can then select his desired combination of functionalities from these other packages:
  * **[php-integrator-autocomplete-plus](https://github.com/php-integrator/atom-autocompletion-legacy-php56)** - Provides intelligent PHP autocompletion in combination with autocomplete-plus.
  * **[php-integrator-navigation](https://github.com/php-integrator/atom-navigation-legacy-php56)** - Provides code navigation and go to functionality.
  * **[php-integrator-tooltips](https://github.com/php-integrator/atom-tooltips-legacy-php56)** - Shows tooltips with documentation.
  * **[php-integrator-annotations](https://github.com/php-integrator/atom-annotations-legacy-php56)** - Shows annotations, such as for overridden methods and interface implementations.
  * **[php-integrator-call-tips](https://github.com/php-integrator/atom-call-tips-legacy-php56)** - Shows call tips containing parameters in your code. (Complements the autocompletion package.)
  * **[php-integrator-refactoring](https://github.com/php-integrator/atom-refactoring-legacy-php56)** - Provides basic refactoring capabilities.
  * **[php-integrator-linter](https://github.com/php-integrator/atom-linter-legacy-php56)** - Shows indexing errors and problems with your code.

The following package also exists, but is currently looking for a new maintainer (see also its README):
  * **[php-integrator-symbol-viewer](https://github.com/tocjent/php-integrator-symbol-viewer)** - Provides a side panel listing class symbols with search and filter features.

Note that the heavy lifting is performed by the [PHP core](https://gitlab.com/php-integrator/core), which is automatically installed as _payload_ for this package and kept up to date automatically.

The source code was originally based on the php-autocomplete-plus code base, but has significantly diverged from it since then.

## What do I need to do to make it work?
See [the website](https://php-integrator.github.io/#what-do-i-need) as well as [the wiki](https://github.com/php-integrator/atom-base/wiki).

![GPLv3 Logo](http://gplv3.fsf.org/gplv3-127x51.png)
