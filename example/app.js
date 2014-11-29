
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
