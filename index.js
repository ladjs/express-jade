
//     express-jade
//     Copyright (c) 2014- Nick Baugh <niftylettuce@gmail.com> (http://niftylettuce.com)
//     MIT Licensed

// Express middleware to compile client-side Jade templates as
// vanilla JavaScript functions in the `window.jade` namespace

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source: <https://github.com/niftylettuce/express-jade>

exports = module.exports = expressJade;

var path = require('path');
var fs = require('fs');
var debug = require('debug')('express-jade');
var jade = require('jade');
var util = require('util');

var viewsDir;
var namespace;
var options;

function expressJade(_viewsDir, _namespace, _options) {

  viewsDir = _viewsDir;
  debug('viewsDir', viewsDir);

  namespace = _namespace || 'jade';
  namespace = 'window.' + namespace;
  debug('namespace', namespace);

  options = _options || {};
  debug('options', options);

  return middleware;
}

function middleware(req, res, next) {

  var routePath = req.route.path.replace('*', '');

  var jadeFile = req.path.substring(0, req.path.length - 3);
  jadeFile = jadeFile.replace(routePath, '');
  debug('jadeFile', jadeFile);

  var filePath = path.join(viewsDir, jadeFile + '.jade');

  debug('filePath', filePath);

  fs.exists(filePath, function(exists) {

    if (!exists)
      return next();

    fs.readFile(filePath, 'utf8', function(err, str) {

      if (err) return next(err);

      options.filename = filePath;

      var js  = jade.compileClient(str, options);
      js.replace(' template', '');
      js = util.format("%s = %s || {}; %s['%s'] = %s;", namespace, namespace, namespace, jadeFile, js);
      debug('js', js);

      res.set('Content-Type', 'application/javascript');
      res.send(js);

    });

  });


}
