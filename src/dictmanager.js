/**
 * DictManager deals with lang-dict resolving
 * and downloading.
 */

var download = require('download')
  , langMap = require('./lang-mapping.json')
  , path = require('path')
  , os = require('os')
  , fs = require('fs')
  , readline = require('readline')
  , humanb = require('humanb')
  , q = require('q');

/**
 * Clones a given Object. This leads us to a
 * more 'immutable' programming.
 */
function clone(obj) {
  if (null == obj || "object" != typeof obj)
    return obj;

  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

function DictManager () {}

/**
 * Gets the directory that will be generated for
 * a dict downloaded from pasquale-inc
 * repositories.
 */
DictManager.prototype._getDictDirFromUrl = function (url) {
  if (!url)
    throw new Error('An URL must be passed to get the dir of the dict from it.');

  var match = url.match(/pasquale-inc\/([a-zA-Z\-]*)\/zip\/master$/);

  return match && match.length > 0
    ? match[1] + '-master'
    : null;
}

/**
 * Gets a representation of a dict given a
 * language and the directory containing them
 * @param  {string} lang the alias of a language
 * @param  {string} dir  abs path to dicts dir
 * @return {Object}
 */
DictManager.prototype.resolve = function (lang, dir) {
  var langObj = clone(langMap[lang]);

  if (!langObj)
    throw new Error('No path defined for this language.');

  dir = dir || path.resolve(__dirname, '../dicts');
  try {
    dir = path.join(dir, this._getDictDirFromUrl(langObj.url));
  } catch (err) {
    return langObj;
  }

  langObj.name = langObj.aff.replace('.aff', '');
  langObj.aff = path.join(dir, langObj.aff);
  langObj.dic = path.join(dir, langObj.dic);

  if (fs.existsSync(langObj.aff) && fs.existsSync(langObj.dic))
    langObj.exists = true;

  return langObj;
};

/**
 * Gets a representation of what dicts are
 * available. EXISTS is an array of dict objects
 * that represents those that were already
 * download and are ready to use. DOWNLOADABLE
 * are those with an URL but were not downloaded
 * yet.
 * @param  {string} dir abs path to the
 *                      directory containing the
 *                      dicts
 * @return {[Object]}
 */
DictManager.prototype.getAvaibleLanguages = function (dir) {
  var results = {
    exists: [],
    downloadable: []
  };

  for (var lang in langMap) {
    var dict = this.resolve(lang, dir);
    if (dict.exists)
      results.exists.push(dict);
    else if (dict.url)
      results.downloadable.push(dict);
  }

  return results;
};

DictManager.prototype.askForDownload = function(name) {
  var dfd = q.defer();
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Could\'t find dict DICTIONARY.');
  rl.question('Would you like to download THIS DICT? (Y/n) ', function (ans) {
    if (ans.toUpperCase() === 'N')
      dfd.reject();

    dfd.resolve();
    rl.close();
  });

  return dfd.promise;
};

/**
 * Downloads and extracts the dir to the correct
 * dicts folder.
 * @param  {string} url  the url containing the
 *                       dict
 * @param  {string} name the name of the dict
 * @param  {string} dir  dict's dir
 */
DictManager.prototype.download = function(url, name, dir) {
  var dfd = q.defer();
  var req = download({url: url, name: name}, dir, {extract: true});
  var repla = os.platform() === 'win32'
    ? '\033[0G'
    : '\r';

  if (!url)
    throw new Error('A URL is needed for this operation.');

  req.on('response', function (res) {
    var chunkSum = 0;
    console.log('Downloading ' + name);

    res.on('data', function (chunk) {
      chunkSum += chunk.length;
      process.stdout.write(" Downloaded - " + humanb(chunkSum) + repla);
    });

    res.on('end', function () {
      console.log('\n');
      dfd.resolve();
    });
  });

  req.on('error', function (err) {
    dfd.reject(err);
  });

  return dfd.promise;
};

module.exports = new DictManager();
