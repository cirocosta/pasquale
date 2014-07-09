
function report (obj) {
  'use strict';
  var result = [];

  for (var i in obj) {
    var line = obj[i];

    for (var j in line) {
      var word = line[j];

      if (!word.correct) {
        result.push(word);
      }
    }
  }

  return JSON.stringify(result, undefined, 2);
}

module.exports = report;
