/**
 * @author: Alon Talmor
 * @date: 2/4/18
 *
 * Service which is responsible for Reset-Password process.
 * It includes function for sending an email cotaining "safe" reference to the reset password page,
 * and a function for validating a reset-token.
 */
const jwt = require('jsonwebtoken');

const mail = require('../mail/mail');
const { PasswordResetFailure } = require('../../errors');
const { FORGOT_SECRET } = require('../../constants');

const forgotPasswordMail = 'forgotpassword@roommatesyearlyproject.com';
const forgotPasswordExperationTime = '12h'; // There is a timeout for the JWT token.

/**
 * @author: Alon Talmor
 * @date: 2/4/18
 *
 * As it's name suggests, The purpose of this function is to send a reset-password email.
 * We are creating a JWT token which will be part of the reset-password URL. The token is
 * created as follows:
 * 1. Create a payload to be encrypted that includes data for later verification.
 * 2. Create a secret, which is used as a key for the encryption. Note that this key is different for every user
 * since every user a different user-id and different hashed password.
 * 3. Create an expiration time for the token - so a single link cannot be used for infinite time. It also
 * influences the token randomness.
 * 4. Combine all of the above to create the JWT token.
 * --
 * Then an email with unique URL is sent to the requesting user.
 * @param {User} user: the user to send the reset password mail to.
 */
const sendResetPasswordMail = (user) => {
  const payload = {
    id: user._id,
    email: user.email
  };
  const secret = `${user.password}-${user._id}-${FORGOT_SECRET}`;
  const expiration = {
    expiresIn: forgotPasswordExperationTime
  };
  jwt.sign(payload, secret, expiration, (err, ResetToken) => {
    if (err) {
      throw PasswordResetFailure;
    }
    const resetPasswordURL = `http://localhost:8080/users/reset-password/${ResetToken}`; //TODO: user CORS

    const msg = {
      to: user.email,
      from: forgotPasswordMail,
      subject: '[Roommates] You Can Now Change Your Password!',
      html: `<h1>To change your password, click on the link below.</h1>
             <p><a href="${resetPasswordURL}">${resetPasswordURL}</a></p>`,
    };
    mail.sendMail(msg);
  });
};

/**
 * @author: Alon Talmor
 * @date: 2/4/18
 *
 * Simple function for verifying the JWT token onto the user.
 * Recreate the key (only the valid user can recreate th correct key) and use it to verify the token.
 * A "PasswordResetFailure" exception is thrown upon failure.
 *
 * @param {User} user - The requesting password-reset user.
 * @param {String} token - A valid user-related JWT token.
 */
const verifyResetToken = (user, token) => {
  try {
    const secret = `${user.password}-${user._id}-${FORGOT_SECRET}`;
    jwt.verify(token, secret);
  } catch (err) {
    throw PasswordResetFailure;
  }
};

module.exports = {
  sendResetPasswordMail,
  verifyResetToken
};