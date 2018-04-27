
const { logError } = require('./logger');


/**
 * @author: Or Abramovich
 * The following function intercept the outgoing traffic and logs
 * the request along-side the status code and the path of a bad request.
 *
 * @updatedBy: Alon Talmor
 * @date: 27/04/18
 * fix logger sometimes throwing exception when chunk isn't of Buffer type.
 */
exports.logResponseBodyOnError = function (req, res, next) {
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      chunks.push(Buffer.from(chunk));
    }

    Buffer.concat(chunks).toString('utf8');
    if (res.statusCode >= 400) {
      const errorMsg = `${req.path} returned: ${res.statusCode} for the following request: ${JSON.stringify(req.body)}`;
      logError(errorMsg);
    }
    oldEnd.apply(res, arguments);
  };

  next();
};