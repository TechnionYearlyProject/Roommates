/**
 * @author: Alon Talmor
 * @date: 29/3/18
 * Use this service to send user verification codes by mail
 * and to verify verification requests.
 * User verification codes are used to verify that a new user has filled up
 * a valid email address during registeration.
 * -
 * There should be 2 places where a verification email should be sent:
 * 1. The first is right after a successful user registeration.
 * 2. The second one is when an unverified user is requesting to resend verification email
 *    (might be necessary if the user has't recieved the first verification email during registration).
 */
const jwt = require('jsonwebtoken');

const mail = require('../mail/mail');
const { User } = require('../../models/user');


const verifyMail = 'verify@roommatesyearlyproject.com';
const VERIFICATION_SECRET = 'change_this_to_emailSecret'; //need to set EMAIL_SECRET env variable (also in real server)
const verificationEmailExperationTime = '1d';
/**
 * @author: Alon Talmor
 * @date: 29/3/18
 * The main function for sending verification email.
 * First the function creates a jwt token, which encrypts the requesting user id.
 * This token should be expired after a set amout of time.
 * After creating the token, an email is sent to the user using the email address
 * the user has used during registration. The body of the mail includes a url to
 * the appropriate verification page. The server is responsible to handle such requests.
 * 
 * @param {User} user: The user to send verification email to.
 */
const sendVerificationEmail = (user) => {
  jwt.sign(
    {
      id: user._id
    },
    VERIFICATION_SECRET,
    {
      expiresIn: verificationEmailExperationTime
    },
    (err, EmailToken) => {
      if (err) {
        //no error indication is produced - for now.
        return;
      }
      const verificationURL = `http://localhost:3000/users/verify/${EmailToken}`; //TODO: user CORS

      //send mail
      const msg = {
        to: user.email,
        from: verifyMail,
        subject: '[Roommates] New Account Verification!',
        //text: ``,
        html: `<h1>Welcome To Roommates!</h1>
               <p>To verify your account please follow this link:<br> 
               <a href="${verificationURL}">${verificationURL}</a></p>`,
      };
      mail.sendMail(msg);
    }
  );
};

/**
 * @author: Alon Talmor
 * @date: 29/3/18
 * Verify a jwt verification token. This token should have been created by sendVerificationEmail().
 * The first step is to derive the user id from the token. This id can be used next to find the user
 * in the database. We expect the id to be valid, if it's not we expect the DB search method to reject
 * the request (this means the Promise.reject() will be returned).
 * Otherwise, the user's "isVerfied" property is updated to true,
 * and the verification process has completed successfully.
 */
const verifyUser = (token) => {
  const { id } = jwt.verify(token, VERIFICATION_SECRET);
  return User.findByIdAndUpdate(id, { $set: { isVerified: true } });
};

module.exports = {
  sendVerificationEmail,
  verifyUser
};