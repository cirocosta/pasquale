'use strict';

var fs = require('fs')
	,	Spellcheck = require('spellcheck');

function SP (affPath, dicPath) {

	if (!(affPath || dicPath) ||
	    !(affPath.match(/\.aff$/) || dicPath.match(/\.aff$/)))
		throw new Error('.aff and a .dic files must be specified');

	console.log(affPath);
	console.log(dicPath);

	if (!(fs.existsSync(affPath) || fs.existsSync(dicPath)))
		throw new Error('Both of the specified files must exist');

	return new Spellcheck(affPath, dicPath);
}

module.exports = SP;
