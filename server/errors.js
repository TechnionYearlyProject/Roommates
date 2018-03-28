
const ERR_INVALID_CRADENTIALS   = 101010;
const ERR_EMAIL_IN_USE          = 110000;
const INVALID_LOCATION          = 110100;
const UNKNOWN_ERROR             = 111111;
const UNCONFIRMED_USER          = 100000;
const Error = function (code, message) {
  return {
    code,
    message
  };
};

module.exports = {
  invalidCradentials: Error(ERR_INVALID_CRADENTIALS, 'Invalid cradentials.'),
  emailInUse: Error(ERR_EMAIL_IN_USE, 'Email already in use.'),
  invalidLocation: Error(INVALID_LOCATION, 'Couldn\'t find location.'),
  unknownError: Error(UNKNOWN_ERROR, 'Uknown error occured.'),
  unconfirmedUser: Error(UNCONFIRMED_USER, 'Account is not verified.')
};