'use strict';

const fs = require('fs');
const _ = require('lodash');
const bluebird = require('bluebird');
const htmlparser = require('htmlparser');

let sample = fs.readFileSync(process.cwd() + '/sample.html', 'utf8');

let testParams = {
	price: 'price',
};

let parserBO = {
	_serialize: (tree, params) => {
		let body = {};
		let toReturn = {};

		let _parse = (_chunk, _i) => {
			let key = _chunk && _chunk.attribs && (_chunk.attribs.id || _chunk.attribs.class);
			if (_chunk && _chunk.children && _chunk.children.length > 0) {
				// console.log("\n \n", key + ".children", _chunk.children, "\n \n");
				_.each(_chunk.children, (child, _j) => parseBody(child, _i, key));
			}
		};

		let parseBody = (_tree, i, key) => {
			if (_tree.name === 'section' ||
				(_tree.attribs &&
					_tree.attribs.class)) {
					if (/(postinginfos?)|postingtitle|price|titletextonly/i.test(_tree.attribs.class)) _parse(_tree);
					else if (/timeago/i.test(_tree.attribs.class)) console.log(_tree.attribs.children)
				}
				else if ('data' in _tree && key) {
					console.log("\n \n party --", key, _tree, "\n \n");
					toReturn[key] = _tree;
				}
		};

		let i = _.findIndex(tree, { name: 'body' });
		if (i > -1) body = tree[i] && tree[i].children;


		if (!_.isEmpty(body)) {
			_.each(body, parseBody);
		}

		console.log(toReturn);
	},

	getTree: (content) => {
		return new Promise((resolve, reject) => {
			let handler = new htmlparser.DefaultHandler((err, done) => {
				if (err) { return reject(err); }
				return resolve(done);
			}, { verbose: false, ignoreWhitespace: true });

			let parser = new htmlparser.Parser(handler);
			return parser.parseComplete(content);
		})
	}
};

parserBO.getTree(sample, testParams).then(parserBO._serialize);

module.exports = parserBO;
