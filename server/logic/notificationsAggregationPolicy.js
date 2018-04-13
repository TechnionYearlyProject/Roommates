/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The following module defines an aggregation policy regarding the users notifications. 
 * The aggregation policy is a business logic issue and might be changed modified. 
 * It is written as an external module so it could be injected.
 *
 */

const {getNotificationType, wasNotificationRead} = require('../models/notification');

/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Check if two notifications should be aggregated according to the policy which is -  
 * Both notifications were not read and are of the same type.
 *
 * @param {Notification} notificationA: one of the notifcation to be checked.
 * @param {Notification} notificationB: the other notifcation to be checked.
 *
 * @returns {Boolean} indicating whether both notifications should be aggregated according to the business logic.
 */
const shouldNotificationsBeAgregated = (notificationA, notificationB) => {
	return (
		getNotificationType(notificationA) == getNotificationType(notificationB) 
		&& !wasNotificationRead(notificationA)
		&& !wasNotificationRead(notificationB));
}


module.exports = {
  shouldNotificationsBeAgregated
};