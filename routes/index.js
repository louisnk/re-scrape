const express = require('express');
const router = express.Router();
const api = require('./api/index');
const validate = require('../utils/validation');


// apis
// auth

// candidate data
router.get('/api/candidate/:uuid/profile', jwtCheck, validate.clientAuth, api.candidates.getProfileDataByUUID);

// default to the welcome page
router.get('*', function(req, res, next) {
	res.redirect('/goodbye');
});

module.exports = router;
