
const ERR_INVALID_CRADENTIALS   = 101010;
const ERR_EMAIL_IN_USE          = 110000;
const INVALID_LOCATION          = 110100;
const UNKNOWN_ERROR             = 111111;
const UNCONFIRMED_USER          = 100000;
const PASSWORD_RESET_FAILURE    = 500000;
const MULTI_RATING              = 600000;

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
  unconfirmedUser: Error(UNCONFIRMED_USER, 'Account is not verified.'),
  PasswordResetFailure: Error(PASSWORD_RESET_FAILURE, 'Couldn\'t complete the reset password action.'),
  multiRating: Error(MULTI_RATING, 'user tried to rste 2 adjacent locations.'),
};