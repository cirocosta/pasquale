'use strict';

var assert = require('assert')
	,	path  = require('path')
	,	config = require('../src/config');

describe('config,', function () {
	it('should be sane', function () {
		assert(!!config);
	});

	describe('regarding lang validation,', function () {
		describe('regarding getting lang from alias', function () {
			it('should get a valid one', function () {
				assert(config.isValidLang('pt-br'));
			});

			it('should not get an invalid one', function  () {
				assert(!config.isValidLang('err-er'));
			});
		});

		describe('regarding getting lang from name', function () {
			it('should get a valid one', function () {
				assert(config.isValidLang('Polish'));
			});

			it('should not get an invalid one', function  () {
				assert(!config.isValidLang('Errado'));
			});
		});
	});

	describe('regarding changing the cfg file,', function () {
		it('should add a default lang properly', function () {
			var location = path.resolve(__dirname, './files/config.json');
			var cfg = config.add({location: location}, 'default', 'pt-br');
			var expected = {location: location, 'default': 'pt-br'};

			assert.deepEqual(cfg, expected);
		});

		it('should throw if tries to add an invalid lang as default', function () {
			assert.throws(function () {
				config.add({}, 'default', 'err-er');
			}, Error);
		});

		it('should properly push to ignored a word', function () {
			var location = path.resolve(__dirname, './files/config.json');
			var cfg = config.add({location: location}, 'ignored', 'palavra');
			var expected = {location: location, ignored: ['palavra']};

			assert.deepEqual(cfg, expected);
		});
	});
});
