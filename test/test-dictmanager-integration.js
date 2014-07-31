var assert = require('assert');
var dictmanager = require('../src/dictmanager');
var path = require('path');
var fs = require('fs');

describe('DictManager', function () {
	it('should be sane', function () {
		assert(!!dictmanager);
	});

	describe('download,', function () {
		it('should download a file and unzip it to the correct place', function () {
			assert(false);
		});
	});
});
