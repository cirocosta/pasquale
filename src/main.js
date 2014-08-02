'use strict';

var path = require('path')
  , Q = require('q')
  , unicodeHack = require('../lib/unicode_hack')
  , dictmanager = require('dictmanager')
  , Spellcheck = require('spellcheck');

/**
 * Constructor for Pasquale.
 * @param {object} options object containing
 * some options to be used: ignored -> words to
 * be ignored
 */
function Pasquale (options) {
  this.options = options || {ignored: []};
  this.sp;
}


/**
 * Sets the language to check the texts against
 * @param {string} lang The language as
 *                      described in lang-mapping
 * @param {string} dir the abs path to the dicts
 *                     dir
 */
Pasquale.prototype.setLanguage = function(lang, dir) {
  dir = dir || path.resolve(__dirname, '../dicts');

  var dict = dictmanager.resolve(lang, dir);

  if (!dict.exists)
    throw new Error('DictNotFound - A valid dict wasn\'t found.');

  this.sp = new Spellcheck(dict.aff, dict.dic);

  return dict;
};

/**
 * Checks the spelling of a given text (multi or
 * single line)
 * @param  {string} text The text to check
 * @return {Promise}      a promise containing
 * the results (array of arrays)
 */
Pasquale.prototype.checkTextSpell = function (text) {
  var lines = text.split('\n')
    , promises = []
    , dfd = Q.defer();

  for (var i in lines)
    promises.push(this.checkLineSpell(lines[i], +i));

  Q.all(promises)
    .then(function (results) {
      dfd.resolve(results);
    }, function (err) {
      dfd.reject(err);
    });

  return dfd.promise;
};

/**
 * Checks the spelling for a given line.
 * @param  {string} text      A line of text
 * @param  {string|number} lineCount the number
 * of the line
 * @return {Promise}   A promisse with the
 * results (array)
 */
Pasquale.prototype.checkLineSpell = function (text, lineCount) {
  var regex = unicodeHack(/\p{L}+/gi)
    , scope = this
    , promises = []
    , dfd = Q.defer()
    , match;

  while (match = regex.exec(text), match) {
    match.line = lineCount;
    promises.push(scope.checkWordSpell(match[0], match));
  }

  Q.all(promises)
    .then(function (results) {
      dfd.resolve(results);
    }, function (err) {
      dfd.reject(err);
    });

  return dfd.promise;
};

/**
 * Checks the spelling for a given word
 * @param  {string} word the word to check
 * @param  {obj} opts some more info about where
 * the word was found
 * @return {promise}      A promise containing
 * the results for the word
 */
Pasquale.prototype.checkWordSpell = function (word, opts) {
  var dfd = Q.defer();

  if (this.options.ignored.indexOf(word) > -1)
    return (dfd.resolve({word: word, correct: true}),
            dfd.promise);

  this.sp.check(word, function (err, correct, suggestions) {
    if (err) dfd.reject(err);
    if (correct) dfd.resolve({word: word, correct: true});
    else dfd.resolve({
      word: word,
      correct: false,
      position: {
        l: opts.line,
        c: opts.index
      },
      suggestions: suggestions
    });
  });

  return dfd.promise;
};

module.exports = Pasquale;
