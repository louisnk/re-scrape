'use strict';

const fs = require('fs');
const bluebird = require('bluebird');
const _ = require('lodash');
const redis = require('redis');
const request = require('request-promise');
const xml2json = require('xml2json');
const C = require('../constants');
const geoBO = require('./geoBO');

let _filterSearch = (val) => _.filter(val, geoBO.isInBounds);

let clBO = {
	_i: 0,
	_buildUrl: (city, category) => (
		`http://seattle.craigslist.org/jsonsearch/${category}/${city}`
	),

	_parseResponse: (res) => {
		if (_.isString(res) && res.indexOf('{[') === 0) {
			return JSON.parse(res);
		}
		return JSON.parse(res);
	},

	// _serializeListings: (filtered) => {
	// 	return clBO.getListing(filtered.postUrl)
	// 		.then(page => )
	// },

	_serializeSearch: (listings) => {
		return _.reduce(listings, (next, current, i, list) => {
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
			}, {});
	},

	getListing: (listing, key) => {
		if (!listing) throw new Error("No listing passed to get listing for");
		let listingUrl = listing && listing.postUrl;

		let pageData = fs.readFileSync(process.cwd() + '/samples/sample_rental.html', 'utf8')
		return Promise.resolve({ id: key, page: pageData });
		// return request.get({
		// 	uri: 'http:' + listingUrl
		// 	headers: {
		// 		'Accept': 'text/html',
		// 		// 'Accept-Encoding': 'gzip, deflate, sdch',
		// 		'Accept-Language': 'en-US,en;q=0.8,es;q=0.6',
		// 		'Cache-Control': 'no-cache',
		// 		'Connection': 'keep-alive',
		// 		'Cookie': 'cl_b=mgkN4eI_5RGb1tW5UR65qgjmJ/k; cl_def_lang=en_US; cl_map=-122.87384033203124%2C47.14489748555398%2C-122.06497192382811%2C47.44016355242185; cl_def_hp=seattle; cl_tocmode=sss%3Apic%2Chhh%3Amap%2Cccc%3Alist%2Cbbb%3Alist%2Cjjj%3Alist',
		// 		'DNT': '1',
		// 		'Host': 'seattle.craigslist.org',
		// 		'Pragma': 'no-cache',
		// 		'Upgrade-Insecure-Requests': '1',
		// 		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'
		// 	}
		// });
	},

	search: (query, city) => {
		let _buildReferer = (_query) => ((_.map(_query, (val, key) => (
			_.isArray(val) ? (_.map(val, (v) => (key + '=' + v))).join('&') : (key + '=' + val)
		)).join('&')));

		let res = JSON.stringify(require('../samples/sample_return'));
		return Promise.resolve(res).then(clBO._parseResponse);

		// return request.get({
		// 	uri: clBO._buildUrl(city, 'apa'),
		// 	qs: query,
		// 	headers: {
		// 		Accept:'application/json',
		// 		// 'Accept-Encoding':'gzip, deflate, sdch',
		// 		'Accept-Language':'en-US,en;q=0.8,es;q=0.6',
		// 		'Cache-Control':'no-cache',
		// 		Connection:'keep-alive',
		// 		Cookie:'cl_b=mgkN4eI_5RGb1tW5UR65qgjmJ/k; cl_def_lang=en_US; cl_map=-122.87384033203124%2C47.14489748555398%2C-122.06497192382811%2C47.44016355242185; cl_def_hp=seattle; cl_tocmode=sss%3Apic%2Chhh%3Amap%2Cccc%3Alist%2Cbbb%3Alist%2Cjjj%3Alist',
		// 		DNT:'1',
		// 		Host:'seattle.craigslist.org',
		// 		'X-Requested-With': 'XMLHttpRequest',
		// 		Referer: clBO._buildUrl(city, 'apa' ) + '?' + _buildReferer(query),
		// 		'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36"
		// 	}
		// })
		// .then(clBO._parseResponse)
		// .catch(err => { console.error(err); throw err; });
	}
};

// clBO.search({
// 		max_price: 2500,
// 		bedrooms: 2,
// 		minSqft: 600,
// 		// housing_type: 3 // cottage
// 		housing_type: 4, // duplex
// 		housing_type: 6 // house
// 	}, 'tac')
// 	.then(listings => clBO._serializeSearch(_.map(listings, _filterSearch)))
// 	.then(filtered => Promise.all(_.map(filtered, clBO.getListing)))

module.exports = clBO