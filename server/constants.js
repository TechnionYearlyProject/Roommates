const EARTH_RADIUS_IN_KM = 6378.1;
const XAUTH = 'x-auth';
const XEXPIRATION = 'x-expiration';
const XAUTH_EXPIRATION_TIME = '24h'; // 24 hours

const VERIFICATION_SECRET = 'change_this_to_emailSecret';
const FORGOT_SECRET = 'change_it_to_secret_String';

module.exports = {
  XAUTH,
  EARTH_RADIUS_IN_KM,
  XEXPIRATION,
  XAUTH_EXPIRATION_TIME,

  VERIFICATION_SECRET,
  FORGOT_SECRET
};