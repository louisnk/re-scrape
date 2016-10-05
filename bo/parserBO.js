'use strict';

const fs = require('fs');
const _ = require('lodash');
const jqdom = require('jqdom');
const pyShell = require('python-shell');
const C = require('../utils/constants');

let sample = fs.readFileSync(process.cwd() + '/samples/sample_rental.html', 'utf8');

let clSelectors = {
	title: 'title',
	price: '.price',
	description: '#postingbody',
	details: '.mapAndAttrs > .attrgroup span'
};

let fakeData = {
  beds: 2,
  baths: 1,
  price: 1150,
  sqft: 900,
  office: true,
  tub: true,
  hotTub: false,
  remodeled: true,
  wd: true,
  garage: false,
  hardwood: false,
  basement: true,
  nearUniv: false
}

let parserBO = {
	_cleanDetails: (pageContent) => {
		let usableData = {
			title: '',
			beds: 0,
			baths: 0,
			price: 0,
			sqft: 0,
			office: false,
			tub: false,
			hotTub: false,
			remodeled: false,
			wd: false,
			garage: false,
			hardwood: false,
			basement: false,
			nearUniv: false,
			description: ''
		};

		let detBath = pageContent.details.match(/\d(?=ba)/ig);
		let descBath = pageContent.description.match(/\d(\.\d{1,2})?(?= ?(ba(th)?))/ig);
		let baths = detBath && descBath
			? (detBath[0] > descBath[0] ? descBath[0] : detBath[0])
			: !detBath && descBath
				? descBath[0]
				: detBath && !descBath
					? descBath[0]
					: 0;

		usableData.title = _.capitalize(pageContent.title);
		usableData.price = pageContent.price.match(/\d{1,}/g);
		usableData.price = usableData.price && parseInt(usableData.price[0]);
		usableData.beds = pageContent.details.match(/\d(?=b[r(ed)])/ig);
		usableData.beds = usableData.beds && parseInt(usableData.beds[0]);
		usableData.baths = parseFloat(baths);
		usableData.sqft = pageContent.details.match(/\d{3,5}(?=ft2)?/ig);
		usableData.sqft = usableData.sqft && parseInt(usableData.sqft[0]);
		usableData.office = /(office|den)/ig.test(pageContent.description);
		usableData.tub = / tub/ig.test(pageContent.description);
		usableData.wd = / ?(washer|(w\/d)|dryer)/ig.test(pageContent.description) ||
			/ ?(washer|(w\/d)|dryer)/ig.test(pageContent.details);
		usableData.remodeled = /remodeled|updated/ig.test(pageContent.description);
		usableData.hardwood = /(wood|bamboo) (?=floors?)/ig.test(pageContent.description);
		usableData.basement = /basement/ig.test(pageContent.description);
		usableData.description = _.filter(pageContent.description.split(/[ \n]/ig), (val) => (val && !/[\n\*]/.test(val)));

		// console.log(usableData);

		return usableData;
	},

	_runPy: (data, propType) => {
		let script = propType === C.PROP_TYPE.RENTAL ? 'aggregate_rent.py' : 'aggregate_forsale.py';

		let data3 = _.extend(_.cloneDeep(data), { baths: 1 });
		let options = {
			mode: 'text',
			scriptPath: process.cwd() + '/modules',
			args: [
				JSON.stringify(data),
				JSON.stringify(fakeData),
				JSON.stringify(data3)
			]
		};

		pyShell.run(script, options, (err, res) => {
			if (err) throw err;
			console.log(JSON.parse(res[0]));
		});
	},

	getCLDetails: (content) => {
		if (!content || _.isEmpty(content)) throw new Error("No content");

		let pageContent = {};

		let $ = jqdom(content && content.page);

		_.each(clSelectors, (value, key) => {
			pageContent[key] = $(value).text();
		});

		return { id: content.id, data: parserBO._cleanDetails(pageContent) };
	}
};

// parserBO.getCLDetails(sample, testParams)
// 	.then(parserBO._runPy)
// 	.catch(console.log);

module.exports = parserBO;
