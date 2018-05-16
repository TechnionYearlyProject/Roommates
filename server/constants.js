const EARTH_RADIUS_IN_KM = 6378.1;
const XAUTH = 'x-auth';
const XEXPIRATION = 'x-expiration';
const XAUTH_EXPIRATION_TIME = '24h'; // 24 hours

const VERIFICATION_SECRET = 'change_this_to_emailSecret';
const FORGOT_SECRET = 'change_it_to_secret_String';

const AZURE = {
  "STORAGE_ACCOUNT": {
    "NAME": "roommatestorage",
    "ACCESS_KEY": "FR/rtDGmDqg1Hnh49NaMBYihKiWnMLFDGKdmQSFVGUV0lx3JP7DUHAAebOnYmUiJIkIh16K0eJb1O1O5sszZXg==",
    "CONTAINERS": {
      "APARTMENT_IMAGES": "apartment-images"
    }
  }
};

module.exports = {
  XAUTH,
  EARTH_RADIUS_IN_KM,
  XEXPIRATION,
  XAUTH_EXPIRATION_TIME,

  VERIFICATION_SECRET,
  FORGOT_SECRET,

  AZURE
};