/**
 * @author: Or Abramovich
 * @date: 05/18
 *
 * The following module includes the schema and the basic funcionaliity that depends on the schema of a private message.
 * The private message (AKA message) object is the core unit of the private messaging feature. a message object represents a message sent from user X 
 * and it is a part of a conversation (so it's a weak entity).
 * Message schema consists of the following:
 * @param {ObjectID} _sentBy: The id of the user who sent the message. 
 * @param {Number} createdAt: the creation time of the message.
 * @param {String} conetnt: the content of the message i.e. the message itself
 * @param {Boolean} wasRead: a flag indicates whether the notified person read the notification
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const arrayFunctions = require('../helpers/arrayFunctions');

const PrivateMessageSchema = new mongoose.Schema({
    _sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    createdAt: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      minlength: 1,
      required: true
    },
    wasRead: {
      type: Boolean,
      default: false
    },
 
});


/**
 * @author: Or Abramovich
 * @date: 05/18
 *
 * Converts the given paramters into a JSON which is equivalent to the message document except that id doesn't have an _id property.
 *
 * @param {ObjectID} _sentBy: The id of the user who sent the message. 
 * @param {Number} createdAt: the creation time of the message.
 * @param {String} content: the content of the message i.e. the message itself
 * @param {Boolean} wasRead: a flag indicates whether the notified person read the notification
 *
 * @returns {JSON} which encloses all above information which is equivalent to the notification document except that id doesn't have an _id property. 
 */
const buildPrivateMessageJSON = (_sentBy, createdAt, content, wasRead) => {
	return {
		_sentBy: _sentBy,
    createdAt: createdAt,
		content: content,
		wasRead: wasRead
	};
};
/**
 * @author: Or Abramovich
 * @date: 05/18
 *
 * Sets the read status property of a private message.
 *
 * @param {Private Message} curPrivateMessage: the message to be modified.
 * @param {Boolean} newReadState: the new value should be assigned to the read flag which indicates whether the message was read by the user.
 *
 * @returns {Private Message} with the modified data.
 */
 const setPrivateMessageReadState = (curPrivateMessage, newReadState) => {
    curPrivateMessage.wasRead = newReadState;
    return curPrivateMessage;
 }
 /**
 * @author: Or Abramovich
 * @date: 05/18
 *
 * Returns the creation time of the given message.
 *
 * @param {Private Message} privateMessage: the message to get the date of.
 *
 * @returns {Number} preseting the creation time of the given message.
 */
 const getPrivateMessageCreationTime = (privateMessage) => {
    return privateMessage.createdAt;
 }
/**
 * @author: Or Abramovich
 * @date: 05/18
 *
 * Returns whether the private message was already read by the user who recieved it.
 *
 * @param {Private Message} message: the message that you would like to retrieve the read status from.
 *
 * @returns {Boolean} indicating whether the message was read by the user.
 */
const wasPrivateMessageRead = (message) => message.wasRead;
/**
 * @author: Or Abramovich
 * @date: 05/18
 *
 * Returns whether the private message was written by one of the given participants
 *
 * @param {Private Message} message: the message to be checked
 * @param {Array of ObjectID} participants: the participants to be checked
 *
 * @returns {Boolean} indicating whether the message was read by the user.
 */
const wasPrivateMessageWrittenByParticipants = (message, _participants) => {
  return arrayFunctions.unionArrays(_participants, [message._sentBy]).length == _participants.length;
}

module.exports = {
  PrivateMessageSchema,
  buildPrivateMessageJSON,
  setPrivateMessageReadState,
  wasPrivateMessageRead,
  wasPrivateMessageWrittenByParticipants,
  getPrivateMessageCreationTime
};