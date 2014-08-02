'use strict';

var Pasquale = require('../src/main.js')
  , dictmanager = require('dictmanager')
  , path = require('path')
  , assert = require('assert')
  , utils = require('../src/utils')
  , pasquale = null;

describe('Pasquale', function () {
  this.timeout(30000);

  it('should be defined', function () {
    assert(!!pasquale);
    assert(!!dictmanager);
  });

  it('should have the dict', function (done) {
    var dict = dictmanager.resolve('pt-br');
    var p = path.resolve(__dirname, '../dicts');

    dictmanager.download(dict.url, dict.name, p).then(function () {
      pasquale = new Pasquale();
      pasquale.setLanguage('pt-br');
      done();
    }, function (er) {
      done(er);
    });
  });

  describe('when checking,', function () {
    it('should not have suggestions in a correct text', function (done) {
      pasquale.checkTextSpell('palavras corretas').then(function (results) {
        assert(!utils.suggestionFound(results));
        done();
      }, function (err) {
        done(err);
      });
    });

    it('should have suggestions in an incorrect text', function (done) {
      pasquale.checkTextSpell('palavras correttas').then(function (results) {
        assert(utils.suggestionFound(results));
        done();
      }, function (err) {
        done(err);
      });
    });

    describe('having ignored words', function () {
      pasquale = new Pasquale({
        ignored: 'eradas'
      });

      it('should ignore an incorrect word if marked as ignored', function () {
        pasquale.checkTextSpell('palavras eradas').then(function (results) {
          assert(!utils.suggestionFound(results));
          done();
        }, function (err) {
          done(err);
        });
      });
    });

    describe('regarding multiline texts', function () {
      var text = {
        correct: 'isto é\num texto\nmulti linha',
        wrong: 'issto é\num tezto\nmulti linha'
      };

      it('should find suggestions in an incorrect text', function (done) {
        pasquale.checkTextSpell(text.wrong).then(function (results) {
          assert(utils.suggestionFound(results));
          done();
        });
      });

      it('should not find suggestions in a correct text', function (done) {
        pasquale.checkTextSpell(text.correct).then(function (results) {
          assert(!utils.suggestionFound(results));
          done();
        });
      });

      describe('regarding the position of the errors', function () {
        it('should be possible to get the line position', function (done) {
          pasquale.checkTextSpell(text.wrong).then(function (results) {
            var expectedPos = {l: 1, c: 3}
              , actualPos = results[1][1].position;

            assert.deepEqual(actualPos, expectedPos);
            done();
          });
        });
      });
    });
  });

});
