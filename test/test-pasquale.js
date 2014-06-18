'use strict';

var Pasquale = require('../src/main.js')
	,	assert = require('assert')
	, pasquale = null;

describe('Pasquale', function () {

	beforeEach(function () {
		pasquale = new Pasquale();
	});

	it('should be defined', function () {
		assert(!!pasquale);
	});

});
