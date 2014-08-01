/**
 * Example of a question using readline.
 */

var Pasquale = require('../src/main');
var path = require('path');
var pasquale = new Pasquale();
var dictmanager = require('../src/dictmanager');

console.log(
	dictmanager.getAvaibleLanguages(
		path.resolve(__dirname, '../dicts')));


// pasquale
// 	.checkTextSpell('palavras correttas')
// 	.then(function (results) {
// 		console.log(JSON.stringify(results, undefined, 2));
// 	});

// var readline = require('readline');
// var rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// });

// console.log('Could\'t find dict DICTIONARY.');
// rl.question('Would you like to download THIS DICT? (Y/n) ', function (ans) {
// 	if (ans.toUpperCase() === 'N')
// 		(console.log('Aborting'), process.exit(0));

// 	rl.close();
// });

