'use strict';

var Pasquale = require('../src/main.js')
	,	assert = require('assert')
	,	utils = require('./utils')
	, pasquale = null;

describe('Pasquale', function () {

	pasquale = new Pasquale();
	pasquale.setLanguage('pt-br');

	it('should be defined', function () {
		assert(!!pasquale);
	});

	describe('when checking,', function () {
		it('should not have suggestions in a correct text', function (done) {
			pasquale.checkTextSpell('palavras corretas').then(function (results) {
				assert(!(!!utils.suggestionFound(results)));
				done();
			}, function (err) {
				done(err);
			});
		});

		it('should have suggestions in an incorrect text', function (done) {
			var text = 'isto está ok'

			pasquale.checkTextSpell('palavras correttas').then(function (results) {
				assert(!!utils.suggestionFound(results));
				done();
			}, function (err) {
				done(err);
			});
		});

		describe('regarding multiline texts', function () {
			var text = {
				correct: 'isto é\num texto\nmulti linha',
				wrong: 'issto é\num testo\nmulti linha'
			};

			it('should find suggestions in an incorrect text', function (done) {
				pasquale.checkTextSpell(text.wrong).then(function (results) {
					assert(utils.suggestionFound(results));
					done();
				});
			});

			it('should not find suggestions in a correct text', function (done) {
				pasquale.checkTextSpell(text.correct).then(function (results) {
					assert(!utils.suggestionFound(results));
					done();
				});
			});

			// describe('regarding the position of the errros', function () {
			// 	it('should be possible to get the line position', function (done) {
			// 		pasquale.checkTextSpell(text.wrong).then(function (results) {
			// 			var fstSugst = utils.suggestionFound(results);

			// 			assert(true);
			// 			done();
			// 		});
			// 	});

			// });
		});
	});

});
