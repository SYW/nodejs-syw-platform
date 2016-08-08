var Hashes = require('jshashes');
var request = require('request');

exports.callEndpoint = function(appId, appSecret, endpoint, query, token, callback) {
  query = query || {};
  query.token = token;
  query.hash = generateAuthHash(token);
  var uri = 'https://platform.shopyourway.com' + endpoint;

  var options = {
    uri: uri,
    qs: query,
    json: true
  };

  request.get(options, function (err, response, body) {
    if (err) {
      var errMsg = err && err.message ? ' : ' + err.message : '';
      createError(errMsg);
      return;
    }

    if (response.statusCode != 200) {
      var statusCodeMsg = ' : the response status code is ' + response.statusCode;
      createError(statusCodeMsg);
      return;
    }

    callback(null, body);
  });

  function generateAuthHash(token) {
    return generateHash(token + appSecret);
  }

  function generateHash(str) {
    return new Hashes.SHA256().hex(str);
  }

  function createError(errMsg) {
    callback(new Error('Error while trying to call platform endpoint ' + endpoint + errMsg));
  }
};