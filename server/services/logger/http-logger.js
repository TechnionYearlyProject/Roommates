
const { logError } = require('./logger');

//The following function intercept the outgoing traffic and logs the request along-side the status code and the path of a bad request.
exports.logResponseBodyOnError = function(req, res, next) {
  var oldWrite = res.write, oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk)
      chunks.push(chunk);

    var body = Buffer.concat(chunks).toString('utf8');
    if(res.statusCode >= 400){
      var errorMsg = req.path + " returned: " + res.statusCode + " for the following request: " + JSON.stringify(req.body); 
    	logError(errorMsg);
    }
    oldEnd.apply(res, arguments);
  };

  next();
};