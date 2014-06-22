'use strict';

var Pasquale = require('../src/main.js')
	,	assert = require('assert')
	, pasquale = null;


function suggestionFound (results) {
	var found = false;

	results.forEach(function (result) {
		if (result.suggestions) {
			found = true
			return;
		}
	});

	return found;
}

describe('Pasquale', function () {

	pasquale = new Pasquale();
	pasquale.setLanguage('pt-br');

	it('should be defined', function () {
		assert(!!pasquale);
	});

	describe('when checking,', function () {
		it('should not have suggestions in a correct text', function (done) {
			pasquale.checkTextSpell('palavras corretas').then(function (results) {
				assert(!suggestionFound(results));
				done();
			}, function (err) {
				done(err);
			});
		});

		it('should have suggestions in an incorrect text', function (done) {
			var text = 'isto está ok'

			pasquale.checkTextSpell('palavras correttas').then(function (results) {
				assert(suggestionFound(results));
				done();
			}, function (err) {
				done(err);
			});
		});
	});

});
