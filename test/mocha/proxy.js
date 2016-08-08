var sinon = require('sinon');
var proxy = require("../../proxy");
var request = require("request");

describe("Proxy", function() {

  describe("callEndpoint", function() {
    var appId = "dummy-appdId";
    var appSecret = "dummy-appSecret";
    var endpoint = "dummy-endpoint";
    var query = "dummy-query";
    var token = "dummy-token";

    it("WhenResponseReturnWithError_ShouldCallCallbackWithError", sinon.test(function() {
      var callback = sinon.spy();
      var dummyErrorMessage = "dummy-error-message";
      var expectedError = new Error("Error while trying to call platform endpoint " + endpoint + " : " + dummyErrorMessage);

      SetResponseWithError(this, dummyErrorMessage);

      proxy.callEndpoint(appId, appSecret, endpoint, query, token, callback);

      sinon.assert.calledOnce(callback);
      sinon.assert.calledWith(callback, sinon.match.instanceOf(Error));
      sinon.assert.calledWith(callback, sinon.match(function (result) {
        return areErrorMessagesEqual(result, expectedError);
      }, "Error"));
    }));

    it("WhenResponseStatusCodeIsNot200_ShouldCallCallbackWithError", sinon.test(function() {
      var callback = sinon.spy();
      var expectedError = new Error("Error while trying to call platform endpoint " + endpoint + " : the response status code is 500");

      SetResponseStatusCode(this, 500);

      proxy.callEndpoint(appId, appSecret, endpoint, query, token, callback);

      sinon.assert.calledOnce(callback);
      sinon.assert.calledWith(callback, sinon.match.instanceOf(Error));
      sinon.assert.calledWith(callback, sinon.match(function (result) {
        return areErrorMessagesEqual(result, expectedError);
      }, "Error"));
    }));

    it("WhenResponseIsValid_ShouldCallCallbackWithBody", sinon.test(function() {
      var callback = sinon.spy();
      var expectedBody = "expected-body";

      SetValidResponse(this, expectedBody);

      proxy.callEndpoint(appId, appSecret, endpoint, query, token, callback);

      sinon.assert.calledOnce(callback);
      sinon.assert.calledWith(callback, sinon.match.same(null), sinon.match(expectedBody));
    }));

    function areErrorMessagesEqual(result, expected) {
      return result.message == expected.message;
    }

    function SetResponseWithError(test, message) {
      test.stub(request, 'get').yields({ message: message }, null, null);
    }

    function SetResponseStatusCode(test, statusCode) {
      test.stub(request, 'get').yields(null, { statusCode: statusCode }, null);
    }

    function SetValidResponse(test, body) {
      test.stub(request, 'get').yields(null, { statusCode: 200 }, body);
    }
  });
});
