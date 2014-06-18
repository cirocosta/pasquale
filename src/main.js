'use strict';

var Q = require('q')
	,	fs = require('fs')
	,	Spellcheck = require('spellcheck');

function Pasquale (affPath, dicPath) {
	if (!(affPath || dicPath) ||
	    !(affPath.match(/\.aff$/) || dicPath.match(/\.aff$/)))
		throw new Error('.aff and a .dic files must be specified');

	if (!(fs.existsSync(affPath) || fs.existsSync(dicPath)))
		throw new Error('Both of the specified files must exist');

	this.sp = new Spellcheck(affPath, dicPath);
}

Pasquale.prototype.checkTextSpell = function (text) {
	var words = text.match(/\w+/g)
		,	scope = this
		,	promises = [];

	words.forEach(function (word) {
		if (isNaN(+word)) {
			promises.push(scope.checkWordSpell(word));
		}
	});

	Q.all(promises)
		.then(function (results) {
			console.log(results);
		});
};

Pasquale.prototype.checkWordSpell = function (word) {
	var dfd = Q.defer();

	this.sp.check(word, function (err, correct, suggestions) {
		if (err) dfd.reject(err);

		if (correct) dfd.resolve({word: word, correct: true});
		else dfd.resolve({word: word, correct: false, suggestions: suggestions});
	});

	return dfd.promise;
};

module.exports = Pasquale;
