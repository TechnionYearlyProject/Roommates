/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The following module defines an aggregation policy regarding the users notifications. 
 * The aggregation policy is a business logic issue and might be changed modified. 
 * It is written as an external module so it could be injected.
 *
 */

const {getNotificationType, wasNotificationRead, containsNotifiedObjectIDs, getNotifiedObjectsIDs} = require('../models/notification');

/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Check if two notifications should be aggregated according to the policy which is -  
 * Both notifications were not read and are of the same type.
 *
 * @param {Notification} notificationToIncludeTheOtherOne: the candidate notification to include the other notification
 * @param {Notification} notificationToBeIncluded: the candidate notifcation to be included in the otherOne
 *
 * @returns {Boolean} indicating whether both notifications should be aggregated according to the business logic.
 */
const shouldNotificationsBeAgregated = (notificationToIncludeTheOtherOne, notificationToBeIncluded) => {
	return (
		getNotificationType(notificationToIncludeTheOtherOne) == getNotificationType(notificationToBeIncluded)
		&& containsNotifiedObjectIDs(notificationToIncludeTheOtherOne, getNotifiedObjectsIDs(notificationToBeIncluded))
		&& !wasNotificationRead(notificationToIncludeTheOtherOne)
		&& !wasNotificationRead(notificationToBeIncluded));
}


module.exports = {
  shouldNotificationsBeAgregated
};