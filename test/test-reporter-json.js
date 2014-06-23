var reporter = require('../src/reporter-json')
  , assert = require('assert')
  , Pasquale = require('../src/main');

describe('JsonReporter', function () {
  it('should be defined', function () {
    assert(!!reporter);
  });

  var mock = {
    "correct": [
      [{"correct": true,
        "word": "vida"
       },
       {
        "correct": true,
        "word": "louca"
       },
       {
        "correct": true,
        "word": "parte"
       }
      ]
    ],
    "wrong": [
      [{
        "correct": true,
        "word": "vida"
       },
       {
        "correct": false,
        "position": {
          "c": 5,
          "l": 0
       },
        "suggestions": ["lou\u00e7a","lousa"],
        "word": "louka"
      },
      {
       "correct": true,
       "word": "parte"
      }]]};

  it('should return an empty list if everything is correct', function () {
    var expected = JSON.stringify([]);
    var actual = reporter(mock.correct);

    assert.deepEqual(actual, expected);
  });

  it('should NOT return an empty list if everything is correct', function () {
    var expected = JSON.stringify([{"correct": false,
      "position": {"c":5, "l":0 },
      "suggestions": ["louça","lousa"],
      "word":"louka"}], undefined, 2);
    var actual = reporter(mock.wrong);

    assert.deepEqual(actual, expected);
  });
});
