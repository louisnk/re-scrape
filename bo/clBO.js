'use strict';

const bluebird = require('bluebird');
const _ = require('lodash');
const redis = require('redis');
const request = require('request-promise');
const xml2json = require('xml2json');
const C = require('../constants');

// http://seattle.craigslist.org/search/tac/apa?min_price=1400&max_price=1900&bedrooms=3&minSqft=1200&maxSqft=2200&housing_type=6
let clBO = {
	_i: 0,
	_buildUrl: (city, category) => {
		return `${category}/${city}`
	},

	_parseResponse: (res) => {
		// if (_.isString(res) && res.indexOf('{[') === 0) {
			return JSON.parse(res);
		// }
		return res;
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

	getListing: (postUrl) => {

	},

	search: (query, city) => {
		let res = JSON.stringify(require('../sample_return'));
		return Promise.resolve(res).then(clBO._parseResponse);
		// return request.get({
		// 	uri: 'http://seattle.craigslist.org/jsonsearch/' + clBO._buildUrl(city, 'apa'),
		// 	qs: query
		// })
		// .then(clBO._parseResponse)
		// .catch(err => { console.error(err); throw err; });
	}
};

module.exports = clBO