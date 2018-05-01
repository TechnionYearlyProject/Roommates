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
	 	  	await user.saveUpdatedNotification(updatedNotification._id, updatedNotification);
	 	});
    }catch(e){
    	logError(e.toString());
  	}
}

module.exports = {
  markNotificationAsRead
};