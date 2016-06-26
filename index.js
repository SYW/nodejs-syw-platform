var proxy = require('./proxy');

exports.SYW = function(appId, appSecret) {
  return {
    callEndpoint: function(endpoint, query, token, callback) {
      proxy.callEndpoint(appId, appSecret, endpoint, query, token, callback);
    }
  }
};