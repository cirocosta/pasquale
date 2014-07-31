var download = require('download');
var langMap = require('./lang-mapping.json');
var path = require('path');
var os = require('os');
var fs = require('fs');
var humanb = require('humanb');
var q = require('q');


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
      process.stdout.write(" " + humanb(chunkSum) + " Downloaded" + repla);
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
