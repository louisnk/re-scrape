const express = require('express');
const router = express.Router();
const api = require('./api/index');
const validate = require('../utils/validation');


// apis
router.get('/api/scrape/craigslist', api.scrape.craigslist);


// default to the welcome page
router.get('*', function(req, res, next) {
	res.redirect('/goodbye');
});

module.exports = router;
