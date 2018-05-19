/**
*
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The follwoing file contains all functionalities required by the sockets server. It is written in a different file so the REST server can use
 * the functions defined here as well and for test purposes.
 *
 *
 */
const { ObjectID } = require('mongodb');

const { setNotificationReadState } = require('../models/notification');
const { User } = require('../models/user');
/**
 *
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Sets the notification status to be "read" and updates the user document in DB.
 *
 * @param {String} _userId: the Id of the user who read the notification
 * @param {Notification} notification: the notifcation that you would like to modify its read status.
 *
 * @returns {Promise} that returns promise that resolved once the user document is updated in DB with the new data of the notification.
 */
const markNotificationAsRead = (_userId, notification) => {
	try{
		return User.findById(new ObjectID(_userId)).then(async (user) => {
			const updatedNotification = setNotificationReadState(notification,true);
	 	  	await user.saveUpdatedNotifications([updatedNotification._id], [updatedNotification]);
	 	});
    }catch(e){
    	logError(e.toString());
    	return Promise.reject();
  	}
}
/**
 *
 * @author: Or Abramovich
 * @date: 05/18
 *
 * The function updates both users (sender & receiver) documents in DB with the message.
 *
 * @param {String} _senderId: the Id of the user who sent the message.
 * @param {String} _toId: the Id of the receiver user.
 * @param {String} content: the content of the message.
 *
 * @returns {Promise} that resolved once both users documents are updated in DB with the new data of the message.
 */
const handleNewPrivateMessage = (_senderId, _toId, message) => {
	try{
		const participants = [new ObjectID(_senderId), new ObjectID(_toId)];

		const senderPromise = User.findById(new ObjectID(_senderId)).then(async (user) => {
	 	  	await user.inseryOrUpdateConversation(participants, [message]);
	 	});
	 	const receiverPromise = User.findById(new ObjectID(_toId)).then(async (user) => {
	 	  	await user.inseryOrUpdateConversation(participants, [message]);
	 	});

	 	return Promise.all([senderPromise, receiverPromise]);
    }catch(e){
    	logError(e.toString());
    	return Promise.reject();
  	}
}
/**
 *
 * @author: Or Abramovich
 * @date: 05/18
 *
 * The function updates the read state of the messages in both users (sender & receiver) documents in DB.
 *
 * @param {String} _senderId: the Id of the user who sent the read message.
 * @param {String} _toId: the Id of the user who sent the message.
 * @param {ObjectId} _lastMessageSeenId: representing the id of the last seen message  (all messages with prior time will be marked as read)
 *
 * @returns {Promise} that resolved once both users documents are updated in DB with the new data of the message.
 */
const handleReadPrivateMessage = (_senderId, _toId, _lastMessageSeenId) => {
	try{
		const participants = [new ObjectID(_senderId), new ObjectID(_toId)];

		const senderPromise = User.findById(new ObjectID(_senderId)).then(async (user) => {
	 	  	await user.markMessagesAsReadByLastMessage(participants, _lastMessageSeenId);
	 	});
	 	const receiverPromise = User.findById(new ObjectID(_toId)).then(async (user) => {
	 	  	await user.markMessagesAsReadByLastMessage(participants, _lastMessageSeenId);
	 	});

	 	return Promise.all([senderPromise, receiverPromise]);
    }catch(e){
    	logError(e.toString());
    	return Promise.reject();
  	}
}
module.exports = {
  markNotificationAsRead,
  handleNewPrivateMessage,
  handleReadPrivateMessage
};