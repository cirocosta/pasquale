'use strict';

var fs = require('fs')
	,	path = require('path')
	,	Q = require('q')
	,	unicodeHack = require('../lib/unicode_hack')
	,	langMap = require('./lang-mapping.json')
	,	Spellcheck = require('spellcheck');

function Pasquale () {}

Pasquale.prototype.setLanguage = function(lang) {
	var langPaths = langMap[lang]
		,	dictPath = ''
		, affPath = ''
		, dicPath = '';

	if (!langPaths) throw new Error('No path defined for this language');

	dictPath = path.resolve(__dirname, '../bower_components/Dictionaries');
	affPath = path.join(dictPath, langPaths.aff);
	dicPath = path.join(dictPath, langPaths.dic);

	if (!(affPath.match(/\.aff$/) || dicPath.match(/\.aff$/)))
		throw new Error('.aff and a .dic files must be specified');

	if (!(fs.existsSync(affPath) || fs.existsSync(dicPath)))
		throw new Error('Both of the specified files must exist');

	this.sp = new Spellcheck(affPath, dicPath);
};

Pasquale.prototype.checkTextSpell = function (text) {
	var regex = unicodeHack(/\p{L}+/g)
		,	words = []
		,	scope = this
		,	promises = []
		,	dfd = Q.defer();

	words = text.match(regex);
	if (!words) dfd.resolve([]);

	words.forEach(function (word) {
		if (isNaN(+word)) {
			promises.push(scope.checkWordSpell(word));
		}
	});

	Q.all(promises)
		.then(function (results) {
			dfd.resolve(results);
		}, function (err) {
			dfd.reject(err);
		});

	return dfd.promise;
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
