/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The following service is responsible to send the notification updates to the relevant users. 
 * The service checks for aggregation possibility according to the aggregation policy
 *
 */
const {shouldNotificationsBeAgregated} = require('../../logic/notificationsAggregationPolicy');
const {buildNotificationJSON} = require('../../models/notification');
const {User} = require('../../models/user');
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Generates the notification object and send it notification to the relevant users. The notification might be added as a new one 
 * or will be aggregated with another one (depends on the aggregation policy).
 * 
 * @param {Number} notificationType: describes the nature of the notification - what the user is notified about.
 * @param {objectID} fromId: the user id that triggered the notification (who did the action that caused the notification).
 * @param {array of objectID} toIdsArray: an array of users ids that have to be notified
 * @param {Arry of objectID} notifiedObjectIdsArr: the ids of the objects that were modified that caused the notification
 *
 * @returns {Promise} which returns a promise (on resolve). The first promise is resolved once the function finds the user to be notified.
 * and the second one is resolved once the user DB document is updated with the notification.
 * 
 */
const notifyUsers = (notificationType, fromId, toIdsArray, notifiedObjectIdsArr) => {
	 var promises = [];
	 const newNotification = buildNotificationJSON(notificationType, fromId, false, notifiedObjectIdsArr);
	 toIdsArray.forEach(function(userId) {
	 	if(!userId.equals(fromId)){ //don't notify the user on his own changes
		 	var findUserByIdPromise = User.findById(userId);
		  	findUserByIdPromise.then((user) => {
			  	const userNotifications = user.getNotifications();
			  	var shouldBeAggregated = false;
			  	var aggregateWithId;
			  	userNotifications.forEach(function(curNotification) {
			  		if(shouldNotificationsBeAgregated(newNotification, curNotification)){
			  			aggregateWithId = curNotification._id;
			  			shouldBeAggregated = true;
			  		}
			 	});
			 	if(!shouldBeAggregated){
			 		 return user.saveNewNotification(newNotification);
			 	}else{
			 		return user.saveAggregationDataInNotification(aggregateWithId, notifiedObjectIdsArr, [fromId]);
			 	}
		 	});
		 	promises.push(findUserByIdPromise);
		}
	 });
	 return Promise.all(promises);
};

module.exports = {
  notifyUsers
};





