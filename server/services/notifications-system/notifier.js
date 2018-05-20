/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The following service is responsible to send the notification updates to the relevant users.
 * The service checks for aggregation possibility according to the aggregation policy
 *
 */
const {
  shouldNotificationsBeAggregated
} = require('../../logic/notificationsAggregationPolicy');
const {
  buildNotificationJSON
} = require('../../models/notification');
const {
  User
} = require('../../models/user');
const {
  sendUserRealTimeNotification
} = require('../../socketsServer');
const _ = require('lodash');

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
 * @param {Boolean} wasRead: a flag indicates whether the notified person read the notification
 * @param {Number} creationDate: the creation date of the notification event
 *
 * @returns {Promise} which returns a promise (on resolve). The first promise is resolved once the function finds the user to be notified.
 * and the second one is resolved once the user DB document is updated with the notification.
 *
 */
const notifyUsers = (notificationType, fromId, toIdsArray, notifiedObjectIdsArr, wasRead, creationDate) => {
  const promises = [];
  const newNotification = buildNotificationJSON(notificationType, fromId, wasRead, notifiedObjectIdsArr, creationDate);
  toIdsArray.forEach((userId) => {
    if (!userId.equals(fromId)) { //don't notify the user on his own changes
      const findUserByIdPromise = User.findById(userId);
      findUserByIdPromise
        .then(async (user) => {
          const userNotifications = user.getNotifications();
          let shouldBeAggregated = false;
          let aggregateWithId;
          userNotifications.forEach((curNotification) => {
            if (shouldNotificationsBeAggregated(curNotification, newNotification)) {
              aggregateWithId = curNotification._id;
              shouldBeAggregated = true;
            }
          });
          if (!shouldBeAggregated) {
            const previousNotifications = user.getNotifications().slice();
            const updatedUser = await user.saveNewNotification(newNotification);
            //send real-time update for the new one
            const newNotifications = _.difference(updatedUser.getNotifications(), previousNotifications);
            newNotifications.forEach((n) => sendUserRealTimeNotification(userId, n));
          } else {
            await user.saveAggregationDataInNotification(aggregateWithId, notifiedObjectIdsArr, [fromId], creationDate);
            sendUserRealTimeNotification(userId, user.getNotificationById(aggregateWithId));
          }
        });
      promises.push(findUserByIdPromise);
    }
  });
  return promises;
};

module.exports = {
  notifyUsers
};