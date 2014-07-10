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
	var result = {};

	try {
		result = JSON.parse(fs.readFileSync(where));
	} catch (err) {
		result = {};
	}

	result.location = where;

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

	return this.writeConfig(cfg);
};

Config.prototype.remove = function(cfg, type, value) {
	switch (type) {
		case 'ignored':
			if (!(cfg.ignored && cfg.ignored.length))
				return cfg;

			cfg.ignored.splice(cfg.ignored.indexOf(value), 1);
			break;
	}

	return this.writeConfig(cfg);
};

Config.prototype.writeConfig = function(cfg) {
	if (!cfg.location)
		throw new Error('Can\'t write to file: No location specified');

	fs.writeFileSync(cfg.location,
	                 JSON.stringify(cfg, undefined, 4));

	return cfg;
};

module.exports = new Config();
