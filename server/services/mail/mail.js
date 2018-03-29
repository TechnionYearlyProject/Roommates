const sgMail = require('@sendgrid/mail');
const { logInfo, logError } = require('../logger/logger');

// Email service configuration
const setUpOAuth2Key = (key) => {
  sgMail.setApiKey(key);
  logInfo('Set up email SendGrid OAuth2 key');
};

try {
  const key = require('./mail.json')['MAIL_KEY'];
  setUpOAuth2Key(key);
} catch (e) {
  logError('No "mail.json" exists! Ask Alon for the file.');
}

const sendMail = (msg) => {
  sgMail.send(msg);
};

module.exports = {
  sendMail
};