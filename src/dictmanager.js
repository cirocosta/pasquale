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

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Object
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

DictManager.prototype._getDictDirFromUrl = function (url) {
  if (!url)
    throw new Error('An URL must be passed to get the dir of the dict from it.');

  var match = url.match(/pasquale-inc\/([a-zA-Z\-]*)\/zip\/master$/);

  return match && match.length > 0
    ? match[1] + '-master'
    : null;
}

// DIR has to be a full path
DictManager.prototype.resolve = function (lang, dir) {
  var langObj = clone(langMap[lang]);

  if (!langObj)
    throw new Error('No path defined for this language.');

  dir = dir || path.resolve(__dirname, '../dicts');
  dir = path.join(dir, this._getDictDirFromUrl(langObj.url));

  langObj.name = langObj.aff.replace('.aff', '');
  langObj.aff = path.join(dir, langObj.aff);
  langObj.dic = path.join(dir, langObj.dic);

  if (fs.existsSync(langObj.aff) && fs.existsSync(langObj.dic))
    langObj.exists = true;

  return langObj;
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

DictManager.prototype.download = function(url, name, dir) {
  var dfd = q.defer();
  var req = download({url: url, name: name}, dir, {extract: true});
  var repla = os.platform() === 'win32'
    ? '\033[0G'
    : '\r';

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
