'use strict';

const _ = require('lodash');
const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../config');
const clBO = require('./clBO');
const geoBO = require('./geoBO');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client = redis.createClient();

let maestro = {
	fetchRelevantListings: (params) => {
		let query = params && params.query;
		let city = config.city;
		return clBO.search(query, city)
			.then(maestro._serializeListings)
			.catch(err => { console.error(err); process.exit(err); });
	},


	_serializeListings: (listings) => {
		return _(listings).chain().filter(geoBO.isInBounds)
			.reduce((next, current, i, list) => {
				if (!next[current.PostingID]) {
					next[current.PostingID] = {
						ask: current.Ask,
						beds: current.Bedrooms,
						lat: current.Latitude,
						long: current.Longitude,
						postUrl: current.PostingURL
					};
				}
				return next;
			}, {}).value();
	},
};

module.exports = maestro;