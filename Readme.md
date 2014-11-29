
# express-jade

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

Express middleware to compile client-side Jade templates as template functions in the `window.jade` namespace.

Here is a quick flow of how it works (see the full [Example](#example) below):

1. Your template located at `./views/users/show.jade` is loaded from `<script src="/js/templates/users/show.js"></script>`
2. You render the template using `jade['user/show'](locals)`, whereas `locals` is an object (e.g. `var locals = { name: 'Nifty', desc: 'Lettuce' };`)
3. Inject the newly rendered HTML from this Jade template into your web page.

**This module was created namely for use with [Eskimo](http://eskimo.io)**


## Install

```bash
npm install -S express-jade
```


## Usage

> This middleware should only be used for development mode.
> For production, use [gulp][gulp] or [grunt][grunt] to pre-compile jade to the assets (public) directory.

Simply `require` the middleware and invoke it with a path to the jade template directory.

You can also pass a custom `namespace` as the second argument, and an object of [Jade options][jade-options] as the third.

```js
var expressJade = require('express-jade');

var viewsDir = path.join(__dirname, 'views');
var namespace = 'jade';
var jadeOptions = { pretty: true };

// ...

app.get('/js/templates/*', expressJade(viewsDir, namespace, jadeOptions));

// ...
```


## Example

> This example is also found in the `./example` folder.

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>express-jade</title>
  </head>
  <body>

    <!-- The content of this div will change upon page load -->
    <div id="content">Loading user</div>

    <!-- Include the Jade runtime for rendering templates -->
    <!-- Note: Use `bower install -S jade` if you're using Bower  -->
    <script src="/js/jade/runtime.js"></script>

    <!-- Simply load the script and it will inject the template to window namespace -->
    <script src="/js/templates/user/show.js"></script>

    <!-- Very basic usage showing directory traversal as well -->
    <script>
      var $content = document.getElementById("content");
      $content.innerHTML = jade['user/show']({
        user: {
          name: 'Nifty',
          desc: 'Lettuce'
        }
      });
    </script>

  </body>
</html>
```

`views/user/show.jade`:

```jade

h1= user.name
p= user.desc
```

`app.js`:

```js

var express = require('express');
var expressJade = require('../');
var serveStatic = require('serve-static');
var path = require('path');
var app = express();

app.use(serveStatic(path.join(__dirname)));

if (process.env.NODE_ENV !== 'production') {
  var viewsDir = path.join(__dirname, 'views');
  var namespace = 'jade';
  app.get('/js/templates/*', expressJade(viewsDir, namespace));
}

app.listen(3000);
```

Start the app with `node app` and open <http://localhost:3000>.


## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express-jade.svg?style=flat
[npm-url]: https://npmjs.org/package/express-jade
[travis-image]: https://img.shields.io/travis/niftylettuce/express-jade.svg?style=flat
[travis-url]: https://travis-ci.org/niftylettuce/express-jade
[coveralls-image]: https://img.shields.io/coveralls/niftylettuce/express-jade.svg?style=flat
[coveralls-url]: https://coveralls.io/r/niftylettuce/express-jade?branch=master
[downloads-image]: http://img.shields.io/npm/dm/express-jade.svg?style=flat
[downloads-url]: https://npmjs.org/package/express-jade
[gulp]: http://gulpjs.com/
[grunt]: http://gruntjs.com/
[jade-options]: http://jade-lang.com/api/
