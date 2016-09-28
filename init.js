'use strict';

const config = require('./config');
const BO = require('./bo');

let query = {
	city: 'tac',
	sort: 'date',
	bedrooms: '3',
	max_price: 1900,
	minSqft: 1000,
	housing_type: '6'
};

BO.maestro.crawl(query)
	// then store the datas in PG or redis
	// update aggregated averages - $/sqft rental, sale, etc.