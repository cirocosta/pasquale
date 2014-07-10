'use strict';

var fs = require('fs')
  , path = require('path')
  , Q = require('q')
  , unicodeHack = require('../lib/unicode_hack')
  , langMap = require('./lang-mapping.json')
  , Spellcheck = require('spellcheck');

/**
 * Constructor for Pasquale.
 * @param {object} options object containing
 * some options to be used: ignored -> words to
 * be ignored
 */
function Pasquale (options) {
  this.options = options || {ignored: []};
}

/**
 * Sets the language to check the texts against
 * @param {string} lang The language as
 * described in lang-mapping
 */
Pasquale.prototype.setLanguage = function(lang) {
  var langPaths = langMap[lang]
    , dictPath
    , affPath
    , dicPath;

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
 * @return {[type]}           A promisse with
 * the results (array)
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
