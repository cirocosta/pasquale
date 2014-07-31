var download = require('download');
var langMap = require('./lang-mapping.json');
var path = require('path');
var fs = require('fs');
var q = require('q');
var ProgressBar = require('progress');

// 'https://nodeload.github.com/pasquale-inc/dict-portuguese-brazillian/zip/master'

function DictManager () {}

DictManager.prototype._isFullPath = function (p) {
  var unixFullPath = (p.charAt(0) === "/");
  var windowsFullPath = (p.indexOf(":") !== -1);

  return unixFullPath || windowsFullPath;
};

DictManager.prototype.resolve = function (lang, dir) {
  var langObj = langMap[lang];

  if (!langObj)
    throw new Error('No path defined for this language.');

  dir =  dir || path.resolve(__dirname, '../dicts');

  langObj.aff = path.join(dir, langObj.aff);
  langObj.dic = path.join(dir, langObj.dic);


  if (!(fs.existsSync(langObj.aff) || fs.existsSync(langObj.dic)))
    langObj.exists = false;

  return langObj
};

DictManager.prototype.download = function(url, dir) {
  var dfd = q.defer();
  var req = download(url, dir, {extract: true});

  req.on('response', function (res) {
    var len = +res.headers['content-length'];
    var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: len
    });

    res.on('data', function (chunk) {
      bar.tick(chunk.length);
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
