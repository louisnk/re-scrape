'use strict';

const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const compression = require('compression');
const config = require('./config');
const consolidate = require('consolidate'); // templating
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const routes = require('./routes');

const shouldCompress = function(req, res) {
	/* istanbul ignore if */
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
};

// Setup the middlewares
app.use(compression({ filter: shouldCompress }));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
// app.use(cors({
// 	origin: config.cors[config.env] || config.cors.development,
// 	allowedHeaders: ['Origin', 'X-Requested-With', 'X-Koru-Token', 'X-Access-Token', 'Content-Type', 'Accept', 'Authorization']
// }));

app.use(function(req, res, next) {
	res.header('X-Powered-By', 'PHP 5.1');
	next();
});

// set a static file server to run from the app directory
app.use(express.static(__dirname + '/dashboard'));

// set the client for this project, then use the routes file to render things
app.use('/', setBase, routes);

module.exports = app;
