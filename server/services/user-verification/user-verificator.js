const jwt = require('jsonwebtoken');

const mail = require('../mail/mail');
const { User } = require('../../models/user');


const supportMail = 'support@roommatesyearlyproject.com';
const EMAIL_SECRET = 'change_this_to_emailSecret'; //need to set EMAIL_SECRET env variable (also in real server)

const sendVerificationEmail = (user) => {
  jwt.sign(
    {
      id: user._id
    },
    EMAIL_SECRET,
    {
      expiresIn: '1d'
    },
    (err, EmailToken) => {
      if (err) {
        //no error indication is produced - for now.
        return;
      }
      const verificationURL = `http://localhost:3000/user/verify/${EmailToken}`; //TODO: user CORS

      //send mail
      const msg = {
        to: user.email,
        from: supportMail,
        subject: 'Roommates New Account Verification',
        //text: ``,
        html: `<h1>Welcome To Roommates!</h1>
               <p>To verify your account please follow this link:<br> 
               <a href="${verificationURL}">${verificationURL}</a></p>`,
      };
      mail.sendMail(msg);
      console.log('verification email sent.');
    }
  );
};

const verifyUser = (token) => {
  const { id } = jwt.verify(token, EMAIL_SECRET);
  return User.findByIdAndUpdate(id, { $set: { isVerified: true } });
};

module.exports = {
  sendVerificationEmail,
  verifyUser
};