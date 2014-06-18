'use strict';

var Q = require('q');

function checkTextSpell (sp, text) {
	var words = text.match(/\w+/g)
		,	promises = [];

	words.forEach(function (word) {
		if (isNaN(+word)) {
			promises.push(checkWordSpell(sp, word));
		}
	});

	Q.all(promises)
		.then(function (results) {
			console.log(results);
		});
}

function checkWordSpell (sp, word) {
	var dfd = Q.defer();

	sp.check(word, function (err, correct, suggestions) {
		if (err) dfd.reject(err);

		if (correct) dfd.resolve({correct: true});
		else dfd.resolve({correct: false, suggestions: suggestions});
	});

	return dfd.promise;
}

exports.checkTextSpell = checkTextSpell;

// var dictPath = path.resolve(__dirname, '../bower_components/Dictionaries/');

// spell = new SP(paths.ptBr.aff, paths.ptBr.dic);

// spell.check('this', function (err, correct, suggestions) {
// 	if (err) throw err;

// 	if (correct)
// 		console.log("correctly spelled!");
// 	else
// 		console.log(suggestions);
// });
