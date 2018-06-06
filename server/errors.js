
const ERR_INVALID_CRADENTIALS   = 101010;
const ERR_EMAIL_IN_USE          = 110000;
const INVALID_LOCATION          = 110100;
const UNKNOWN_ERROR             = 111111;
const UNCONFIRMED_USER          = 100000;
const PASSWORD_RESET_FAILURE    = 500000;
const MULTI_RATING              = 600000;
const IMAGE_UPLOAD_FAILURE      = 666000;
const APARTMENT_NOT_FOUND       = 160000;
const GROUP_CREATION_FAILED     = 160001;
const GROUP_NOT_FOUND           = 160002;
const GROUP_MEMBER_NOT_FOUND    = 160003;
const USER_NOT_FOUND            = 170000;

const Error = function (code, message) {
  return {
    code,
    message
  };
};

module.exports = {
  invalidCredentials: Error(ERR_INVALID_CRADENTIALS, 'Invalid credentials.'),
  emailInUse: Error(ERR_EMAIL_IN_USE, 'Email already in use.'),
  invalidLocation: Error(INVALID_LOCATION, 'Couldn\'t find location.'),
  unknownError: Error(UNKNOWN_ERROR, 'Unknown error occurred.'),
  unconfirmedUser: Error(UNCONFIRMED_USER, 'Account is not verified.'),
  PasswordResetFailure: Error(PASSWORD_RESET_FAILURE, 'Couldn\'t complete the reset password action.'),
  multiRating: Error(MULTI_RATING, 'User tried to rate 2 adjacent locations.'),
  imageUploadFailure: Error(IMAGE_UPLOAD_FAILURE, 'Error occurred while trying to upload images.'),
  apartmentNotFound: Error(APARTMENT_NOT_FOUND, 'The apartment was not found.'),
  groupCreationFailed: Error(GROUP_CREATION_FAILED, 'Couldn\'t create new group for the apartment.'),
  groupNotFound: Error(GROUP_NOT_FOUND, 'The group was not found.'),
  groupMemberNotFound: Error(GROUP_MEMBER_NOT_FOUND, 'The group member was not found.'),
  userNotFound: Error(USER_NOT_FOUND, 'The user was not found.')
};