'use strict';

var dictmanager = require('../src/dictmanager');
var assert = require('assert');
var path = require('path');

describe('DictManager', function () {
	it('should be sane', function () {
		assert(!!dictmanager);
	});

	describe('resolver', function () {
		it('should resolve non existing dicts', function () {
			var actual = dictmanager.resolve('pt-br');
			var p = path.resolve('../dicts');
			var expected = {
			  "aff": path.join(p, "Portuguese (Brazilian).aff"),
			  "dic": path.join(p, "Portuguese (Brazilian).dic"),
			  "url": "https://nodeload.github.com/pasquale-inc/dict-portuguese-brazillian/zip/master",
			  "exists": false
			};

			assert.deepEqual(actual, expected);
		});
	});
});
