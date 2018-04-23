/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The following module includes the schema and the basic funcionaliity that depends on the schema of a notification.
 * Notification is a message that sent to a user based on business logic that informs him about a change.
 * Notification schema consists of the following:
 * @param {Number} notificationType: describes the nature of the notification - what the user is notified about.
 * @param {Arry of objectID} _createdBy: an array of user Ids that triggered the notification (who did the action that caused the notification)
 * @param {Boolean} wasRead: a flag indicates whether the notified person read the notification
 * @param {Arry of objectID} _notifiedObjectsIds: the ids of the objects that were modified that caused the notification
 * @param {Number} creationDate: the creation date of the notification event
 *
 */

const _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const arrayFunctions = require('../helpers/arrayFunctions');


const NotificationsTypesEnum = {
  COMMENT_WAS_ADDED_TO_APARTMENT: 1,
  USER_LIKED_APARTMENT: 2,
  APARTMENT_WAS_MODIFIED: 3
};

const NotificationSchema = new mongoose.Schema({
    notificationType: {
      type: Number,
      required: true,
      validate: {
      validator: (value) => isSupportedNotificationType(value),
        message: '{VALUE} is not a supported notification type'
      }
    },
    _createdBy: {
      type: [ mongoose.Schema.Types.ObjectId],
      required: true
    },
    wasRead: {
      type: Boolean,
      default: false
    },
    _notifiedObjectsIds: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true
    },
    createdAt: {
      type: Number,
      required: true
    },
});



/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * check if a notification type is valid i.e. part of the NotificationsTypesEnum.
 *
 * @param {Number} value: the notifcation type to be checked.
 *
 * @returns {Boolean} indicating whether true notification supported , otherwise false.
 */
const isSupportedNotificationType = (value) => Object.values(NotificationsTypesEnum).includes(value);
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Returns the notification type of the given notification.
 *
 * @param {Notification} notification: the notifcation that you would like to retrieve the type from.
 *
 * @returns {Number} representing the type of the given notification. The type is guranteed to be part of NotificationsTypesEnum.
 */
const getNotificationType = (notification) => notification.notificationType;
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Returns whether the notification was already read by the user who recieved it.
 *
 * @param {Notification} notification: the notifcation that you would like to retrieve the read status from.
 *
 * @returns {Boolean} indicating whether the notification was read by the user.
 */
const wasNotificationRead = (notification) => notification.wasRead;
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Returns the notified objects ids associated with the notification
 *
 * @param {Notification} notification: the notifcation that you would like to retrieve the notified objects ids from.
 *
 * @returns {Array of ObjectID} of the notified objects ids of the given notification
 */
const getNotifiedObjectsIDs = (notification) => notification._notifiedObjectsIds;
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Returns whether the given object ids are already associated with the notification.
 *
 * @param {Notification} notification: the notifcation that you would like to check the association of the notified object id with.
 * @param {array of ObjectID} _notifiedObjectIDsArr: the array of object IDs to be checked if already assocaited with the notification
 *
 * @returns {Boolean} indicating whether the given object ids are already associated with the given notification.
 */
const containsNotifiedObjectIDs = (notification, _notifiedObjectIDsArr) => {
  const temp = arrayFunctions.unionArrays(notification._notifiedObjectsIds, _notifiedObjectIDsArr);
  return temp.length == notification._notifiedObjectsIds.length;
}
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Adds the given notified ids (represents the ids of the objects that were modified that caused the notification) 
 * to the given notification. The notified ids are added to the notified ids array of the 
 * notification which is a set i.e no duplicate values. The function handles situation of duplications.
 *
 * @param {Notification} notification: the notifcation that you would like to modify its notified ids.
 * @param {Array of objectID} notifiedObjectsIdsArray: the new notified ids to be added to the given notification.
 *
 * @returns {Notification} which is same to the given one but with the additionals notified ids.
 */
const addNotifiedIdsToNotification = (notification, notifiedObjectsIdsArray) => {
	notification._notifiedObjectsIds = arrayFunctions.unionArrays(notification._notifiedObjectsIds, notifiedObjectsIdsArray);
	return notification;
};
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Adds the given created by ids (represents the user Ids that triggered the notification (who did the action that caused the notification))
 * to the given notification. The created by ids are added to the created by ids array of the 
 * notification which is a set i.e no duplicate values. The function handles situation of duplications.
 *
 * @param {Notification} notification: the notifcation that you would like to modify its created by ids.
 * @param {Array of objectID} createdByIdsArray: the new created by ids to be added to the given notification.
 *
 * @returns {Notification} which is same to the given one but with the additionals create by ids.
 */
const addCreatedByIdsToNotification = (notification, createdByIdsArray) => {
	notification._createdBy = arrayFunctions.unionArrays(notification._createdBy, createdByIdsArray);
	return notification;
};
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Aggregates the data of the notification i.e. performs 2 tasks:
 * 1. Adds the given created by ids (represents the user Ids that triggered the notification (who did the action that caused the notification))
 * to the given notification.
 * 2. Adds the given notified ids (represents the ids of the objects that were modified that caused the notification) 
 * to the given notification.
 *
 * @param {Notification} notification: the notifcation that you would like to modify its created by and notified ids.
 * @param {Array of objectID} notifiedObjectsIdsArray: the new notified ids to be added to the given notification.
 * @param {Array of objectID} newCreateByIdsArray: the new created by ids to be added to the given notification.
 * @param {Number} newCreationDate: the new date to be kept in the notification structure as the creation date
 *
 * @returns {Notification} which is same to the given one but with the aggregated data i.e additionals created by and notified ids.
 */
const addAggregationDataInNotification = (notification, notifiedObjectsIdsArray, newCreateByIdsArray, newCreationDate) => {
	notification = addNotifiedIdsToNotification(notification, notifiedObjectsIdsArray);
	notification = addCreatedByIdsToNotification(notification,newCreateByIdsArray);
  notification.createdAt = newCreationDate;
	return notification;
}
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Converts the given paramters into a JSON which is equivalent to the notification document except that id doesn't have an _id property.
 *
 * @param {Number} notificationType: describes the nature of the notification - what the user is notified about.
 * @param {Arry of objectID} createdBy: an array of user Ids that triggered the notification (who did the action that caused the notification)
 * @param {Boolean} wasRead: a flag indicates whether the notified person read the notification
 * @param {Arry of objectID} notifiedObjectsIds: the ids of the objects that were modified that caused the notification
 * @param {Number} creationDate: the creation date of the notification event
 *
 * @returns {JSON} which encloses all above information which is equivalent to the notification document except that id doesn't have an _id property. 
 */
const buildNotificationJSON = (notificationType, createdBy, wasRead, notifiedObjectsIds, creationDate) => {
	return {
		notificationType: notificationType,
		_createdBy: createdBy,
		wasRead: wasRead,
		_notifiedObjectsIds: notifiedObjectsIds,
    createdAt: creationDate
	};
};
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Updates the given notification with the values taken from the json
 *
 * @param {Notification} curNotificationJson: the notifcation that you would like to modify its read flag.
 * @param {JSON} updateJson: a json containing the updated values with the same property names
 *
 * @returns {Notificaiton} with the modified data.
 */
const updateNotificationByJson = (curNotificationJson, updateJson) => {
  Object.keys(updateJson).forEach(function(key) {
    if(curNotificationJson.hasOwnProperty(key)){
      curNotificationJson[key] = updateJson[key];
    }    
  });
  return curNotificationJson;
};



module.exports = {
  NotificationSchema,
  NotificationsTypesEnum,
  isSupportedNotificationType,
  getNotificationType,
  getNotifiedObjectsIDs,
  containsNotifiedObjectIDs,
  wasNotificationRead,
  addAggregationDataInNotification,
  buildNotificationJSON,
  updateNotificationByJson
};