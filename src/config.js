'use strict';
/**
 * Deals with the config file
 */

var langMapping = require('./lang-mapping')
	,	fs = require('fs');

function Config () {}

Config.prototype.isValidLang = function(lang) {
	for (var index in langMapping)
		if (index === lang || langMapping[index].dic.replace('.dic', '') === lang) {
			var result = {};
			result[index] = langMapping[index];

			return result;
		}

	return false;
};

/**
 * Loads a config file
 * @param  {string} where absolute path
 * @return {obj}       config obj
 */
Config.prototype.load = function (where) {
	var result = {location: where};

	try {
		var f = fs.readFileSync(where);
		result.data = JSON.parse(f);
	} catch (err){
		result.data = {};
	};

	return result;
};

Config.prototype.add = function(cfg, type, value) {
	switch (type) {
		case 'ignored':
			if (!cfg.ignored)
				cfg.ignored = [];

			cfg.ignored.push(value);
			break;

		case 'default':
			var lang = this.isValidLang(value);

			if (!lang)
				throw new Error('A valid lang should be passed. Alias or Name.');

			cfg.default = Object.keys(lang)[0];
			break;

		default:
			return;
	}

	fs.writeFileSync(cfg.location, JSON.stringify(cfg, undefined, 4));

	return cfg;
};

module.exports = new Config();
