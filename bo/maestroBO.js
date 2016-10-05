'use strict';

const _ = require('lodash');
const redis = require('redis');
const bluebird = require('bluebird');
const C = require('../constants');
const config = require('../config');
const clBO = require('./clBO');
const geoBO = require('./geoBO');
const parserBO = require('./parserBO');
const propertiesBO = require('./propertiesBO');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client = redis.createClient();

let maestro = {
	scrapeCL: (params) => {
		let query = params && params.query;
		let city = (params && params.city) || config.city;
		let propType = /fs/i.test(((params && params.type) || C.PROP_TYPE.FSBO)) ? C.CL_PROP_TYPE.FSBA : C.CL_PROP_TYPE.RENTAL;
		let maxPrice = (params && params.maxPrice) ||
			((propType === C.PROP_TYPE.FSBO || propType === C.PROP_TYPE.FSBA) ? 250000 : 2500);

		let queryParams = {
			max_price: maxPrice,
			bedrooms: (params && params.beds) || 2,
			minSqft: (params && params.minSqft) || 650,
			housing_type: [3,4,6] // cottage, duplex, house
		};

		return clBO.search(queryParams, city)
			.then(res => clBO._serializeSearch(_.filter(res && res[0], geoBO.isInBounds)))
			.then(serialized => Promise.all(_.map(serialized, clBO.getListing)))
			.then(listings => _.map(listings, parserBO.getCLDetails))
			.then(cleaned => propertiesBO.storeListings(propType, cleaned))
			.catch(err => { console.error(err); process.exit(err); });
	}
};

maestro.scrapeCL();

module.exports = maestro;
