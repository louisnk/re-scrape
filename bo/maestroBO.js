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
	crawl: (params) => {
		let query = params && params.query;
		let city = (params && params.city) || config.city;

		return clBO.search(query, city)
			.then(clBO._serializeListings)
			.catch(err => { console.error(err); process.exit(err); });
	}
};

module.exports = maestro;