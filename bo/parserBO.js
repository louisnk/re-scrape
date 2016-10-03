'use strict';

const fs = require('fs');
const _ = require('lodash');
const bluebird = require('bluebird');
const jqdom = require('jqdom');
const pyShell = require('python-shell');

let sample = fs.readFileSync(process.cwd() + '/samples/sample_rental.html', 'utf8');

let testParams = {
	title: 'title',
	price: '.price',
	description: '#postingbody',
	details: '.mapAndAttrs > .attrgroup span'
};

let parserBO = {
	_cleanCL: (tree) => {
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

		let detBath = tree.details.match(/\d(?=ba)/ig);
		let descBath = tree.description.match(/\d(\.\d{1,2})?(?= ?(ba(th)?))/ig);
		let baths = detBath && descBath
			? (detBath[0] > descBath[0] ? descBath[0] : detBath[0])
			: !detBath && descBath
				? descBath[0]
				: detBath && !descBath
					? descBath[0]
					: 0;

		usableData.title = _.capitalize(tree.title);
		usableData.price = tree.price.match(/\d{1,}/g);
		usableData.price = usableData.price && parseInt(usableData.price[0]);
		usableData.beds = tree.details.match(/\d(?=b[r(ed)])/ig);
		usableData.beds = usableData.beds && parseInt(usableData.beds[0]);
		usableData.baths = parseFloat(baths);
		usableData.sqft = tree.details.match(/\d{3,5}(?=ft2)?/ig);
		usableData.sqft = usableData.sqft && parseInt(usableData.sqft[0]);
		usableData.office = /(office|den)/ig.test(tree.description);
		usableData.tub = / tub/ig.test(tree.description);
		usableData.wd = / ?(washer|(w\/d)|dryer)/ig.test(tree.description) ||
			/ ?(washer|(w\/d)|dryer)/ig.test(tree.details);
		usableData.remodeled = /remodeled|updated/ig.test(tree.description);
		usableData.hardwood = /(wood|bamboo) (?=floors?)/ig.test(tree.description);
		usableData.basement = /basement/ig.test(tree.description);
		usableData.description = _.filter(tree.description.split(/[ \n]/ig), (val) => (val && !/[\n\*]/.test(val)));

		// console.log(usableData);

		return Promise.resolve(usableData);
	},

	_runPy: (data) => {
		let options = {
			mode: 'text',
			scriptPath: process.cwd() + '/modules',
			args: [JSON.stringify(data), JSON.stringify(data)]
		};

		// console.log(data);

		pyShell.run('aggregate_rent.py', options, (err, res) => {
			if (err) throw err;
			console.log(JSON.parse(res[0]));
		});

		// var shell = new pyShell(process.cwd() + '/modules/aggregator.py');

		// shell.send(data);

		// shell.on('message', (message) => {
		// 	console.log("message from python: ", message);
		// });

		// shell.end((err) => {
		// 	if (err) console.log('error?', err); throw err;
		// 	console.log("finished");
		// });
	},

	getCLDetails: (content, params) => {
		return new Promise((resolve, reject) => {
			if (!content || _.isEmpty(content)) reject("No content");

			let tree = {};

			let $ = jqdom(content);

			_.each(params, (value, key) => {
				tree[key] = $(value).text();
			});

			return resolve(tree);
		})
	}
};

parserBO.getCLDetails(sample, testParams)
	.then(parserBO._cleanCL)
	.then(parserBO._runPy)
	.catch(err => {
		console.log(err);
	})

module.exports = parserBO;
