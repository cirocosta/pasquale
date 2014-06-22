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
	var lines = text.split('\n')
		,	promises = []
		,	dfd = Q.defer();

	for (var i in lines)
		promises.push(this.checkLineSpell(lines[i]));

	Q.all(promises)
		.then(function (results) {
			dfd.resolve(results);
		}, function (err) {
			dfd.reject(err);
		});

	return dfd.promise;
};

Pasquale.prototype.checkLineSpell = function (text) {
	var regex = unicodeHack(/\p{L}+/gi)
		,	scope = this
		,	promises = []
		,	dfd = Q.defer()
		,	match;

	while (match = regex.exec(text), match)
		promises.push(scope.checkWordSpell(match[0], match));

	Q.all(promises)
		.then(function (results) {
			dfd.resolve(results);
		}, function (err) {
			dfd.reject(err);
		});

	return dfd.promise;
};

Pasquale.prototype.checkWordSpell = function (word, opts) {
	var dfd = Q.defer();

	this.sp.check(word, function (err, correct, suggestions) {
		if (err) dfd.reject(err);

		if (correct) dfd.resolve({word: word, correct: true});
		else dfd.resolve({
			word: word,
			correct: false,
			position: {
				l: 0,
				c: 0
			},
			suggestions: suggestions
		});
	});

	return dfd.promise;
};

module.exports = Pasquale;
