/**
 * @author: Alon Talmor
 * @date: 29/3/18
 * A service that provides mail services.
 * First we need to set up the OAuth2 key in order to authenticate
 * with the SMTP service.
 * After setting up the key successfully, it is possible to start
 * sending mails using the sendMail() procedure.
 * -
 * If you dont have the mail.json file (which is defining the key),
 * contact me and I'll sent it to you.
 */
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

/**
 * @author: Alon Talmor
 * @date: 29/3/18
 * This function send an email.
 * @param: msg - the message to send.
 * msg is an object with the following structure:
 * @prop: to: Email address to send the mail to. Example: you@example.com
 * @prop: from: Email address to send the mail from. Example: me@example.com
 * @prop: subject: Email message title.
 * @prop: text: Email message text.
 * @prop: html: It is possible to send formatted message using html syntax.
 */
const sendMail = (msg) => {
  sgMail.send(msg);
};

module.exports = {
  sendMail
};