function isArray (obj) {
  return toString.call(obj) === '[object Array]';
}

function flatten (arr) {
  var result = [];

  for (var i in arr) {
    if (isArray(arr[i]))
      flatten(arr[i]).forEach(function (elem) {
        result.push(elem);
      });
    else
      result.push(arr[i]);
  }

  return result;
};

function suggestionFound (results) {
  results = flatten(results);

  for (var i in results)
    if (results[i].suggestions)
      return true;

  return false;
}

exports.suggestionFound = suggestionFound;
exports.flatten = flatten;
