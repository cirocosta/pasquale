'use strict';

var dictmanager = require('../src/dictmanager');
var assert = require('assert');
var path = require('path');

describe('DictManager', function () {
  it('should be sane', function () {
    assert(!!dictmanager);
  });

  describe('resolver', function () {
    it('should resolve non existing dicts', function () {
      var actual = dictmanager.resolve('en-ca');
      var p = path.resolve(__dirname, '../dicts/dict-english-canadian-master');
      var expected = {
        "aff": path.join(p, "English (Canadian).aff"),
        "dic": path.join(p, "English (Canadian).dic"),
        "url": "https://nodeload.github.com/pasquale-inc/dict-english-canadian/zip/master",
        "name": "English (Canadian)"
      };

      assert.deepEqual(actual, expected);
    });

    // it('should resolve existing dicts', function () {
    //  var actual = dictmanager.resolve('pt-br');
    //  var p = path.resolve('../dicts');
    //  var expected = {
    //    "aff": path.join(p, "Portuguese (Brazilian).aff"),
    //    "dic": path.join(p, "Portuguese (Brazilian).dic"),
    //    "name": "Portuguese (Brazilian)",
    //    "url": "https://nodeload.github.com/pasquale-inc/dict-portuguese-brazillian/zip/master",
    //    "exists": true
    //  };

    //  assert.deepEqual(actual, expected);
    // });

  });
});
