var http = require('http');
var querystring = require('querystring');
var	Hashes = require('jshashes');

exports.SYW = function(appId, appSecret) {
	function callEndpoint(endpoint, query, token, callback) {
		query = query || {};
		query.token = token;
		query.hash = generateAuthHash(token);
		var path = endpoint + getQueryString(query);

		var options = {
			host: 'platform.shopyourway.com',
			port: 80,
			path: path
		};

		http.get(options, function(res) {
			res.setEncoding('utf8');
            var data = '';
			res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function(){
               callback(null, data); 
            });
		}).on('error', function(err) {
           callback(new Error('Error while trying to call platform endpoint ' + endpoint + ': ' + err)); 
        });
	}

	function generateAuthHash(token) {
		return generateHash(token + appSecret);
	}

	function generateHash(str) {
		return new Hashes.SHA256().hex(str);
	}

	function getDateTimeUnix(date) {
		var val = Math.floor(date.getTime() / 1000);
		return val.toString();
	}

	function pad(number) {
		var r = String(number);
		if ( r.length === 1 ) {
			r = '0' + r;
		}
		return r;
	}

	function getQueryString(query) {
		return '?' + querystring.stringify(query).replace(/%3A/g,':');
	}
    
    return {
      call: callEndpoint
    };
};