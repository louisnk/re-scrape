'use strict';

const config = require('../config');

let geoBO = {

	isInBounds: (listing) => {
		let bounds = config.geo;

		// a horrible approximation of being in bounds
		return (listing.Latitude < bounds.nw.lat && listing.Latitude > bounds.se.lat) &&
			(listing.Longitude > bounds.nw.long && listing.Longitude > bounds.se.long);
	}
};

module.exports = geoBO;