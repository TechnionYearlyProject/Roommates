
const ERR_INVALID_CRADENTIALS = 101010;
const ERR_EMAIL_IN_USE = 11000;

const Error = function (code, message) {
  return {
    code,
    message
  };
};

module.exports = {
  invalidCradentials: Error(ERR_INVALID_CRADENTIALS, 'Invalid cradentials.'),
  emailInUse: Error(ERR_EMAIL_IN_USE, 'Email already in use.')
};