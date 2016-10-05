'use strict';
const _ = require('lodash');

let propsBO = {
	storeListings: (propType, listings) => {
		// @TODO: store listings in PostgreSQL DB for real aggregation
		// console.log(propType, listings[0]);
		process.exit(0);
		return Promise.resolve({ done: true })
	},
};

module.exports = propsBO;