# PHP-tools

> A bunch of utilities you'd normally expect in an IDE.

## Features

Right now the features are limited, but we're on version `0.0.0` so yeah.

**Automatic class member insertion**

automatically checks all constructor arguments, and if they exist as class members. Any missing members are automatically inserted.

Right now it only adds members, it doesn't automatically update the constructor body yet.

It does automatically add docblocs, which is nice.

Usage: `php-tools:insert-class-members`
