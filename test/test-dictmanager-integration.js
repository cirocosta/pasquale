var assert = require('assert');
var dictmanager = require('../src/dictmanager');
var path = require('path');
var fs = require('fs');

describe('DictManager', function () {
	it('should be sane', function () {
		assert(!!dictmanager);
	});

	describe('download,', function () {
		this.timeout(60000);

		it('should download a file and unzip it to the correct place', function (done) {
			var dict = dictmanager.resolve('pt-br');
			var p = path.resolve(__dirname, '../dicts');

			dictmanager.download(dict.url, dict.name, p).then(function () {
				done();
			}, function (err) {
				done(err);
			});
		});
	});
});
