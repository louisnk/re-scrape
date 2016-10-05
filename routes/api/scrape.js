'use strict';
const _ = require('lodash');
const bo = require('../../bo');

let api = {
	craigslist: (req, res) => {
		let params = {
			city: req.query && req.query.city,
			query: req.query && req.query.query
		};

		return bo.maestro.scrapeCL(params)
			.then(done => res.status(200).json(done))
			.catch(err => res.status(400).json({ err: err.message }));
	}
};

module.exports = api;
