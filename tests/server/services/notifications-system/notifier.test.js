const expect = require('expect');
const {
  ObjectID
} = require('mongodb');

const Notificator = require('../../../../server/services/notifications-system/notifier');
const NotificationModule = require('../../../../server/models/notification');
const {
  User
} = require('../../../../server/models/user');

const {
  users,
  populateUsers,
} = require('../../../seed/seed');

describe('Notifier Tests', () => {
  beforeEach(populateUsers);

  describe('#notifyUsers', () => {
    it('should notify multiple user with no aggregation (one of them - doesn\'t exist and one of them - read)', (done) => {
      const notificationType = NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT;
      const createdBy = new ObjectID();
      const notifiedObjectsIds = [new ObjectID()];
      const newDate = new Date().getTime();

      const promises = Notificator.notifyUsers(
        notificationType,
        createdBy, [users[0]._id, users[1]._id],
        notifiedObjectsIds,
        false, newDate);

      Promise.all(promises)
        .then(async () => {
          const user1 = await User.findById(users[0]._id);
          expect(user1.notifications.length).toBe(4);
          expect(user1.notifications[0].notificationType).toBe(notificationType);
          expect(user1.notifications[0]._createdBy[0].equals(createdBy)).toBe(true);
          expect(user1.notifications[0]._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);
          expect(user1.notifications[0].createdAt).toBe(newDate);

          const user2 = await User.findById(users[1]._id);
          expect(user2.notifications.length).toBe(2);
          expect(user2.notifications[0].notificationType).toBe(notificationType);
          expect(user2.notifications[0]._createdBy[0].equals(createdBy)).toBe(true);
          expect(user2.notifications[0]._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);
          expect(user2.notifications[0].createdAt).toBe(newDate);

          done();
        })
        .catch(e => done(e));
    }).timeout(5000);

    it('should notify single user with no aggregation', (done) => {
      const notificationType = NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT;
      const createdBy = new ObjectID();
      const notifiedObjectsIds = [new ObjectID()];
      const newDate = new Date().getTime();

      const promises = Notificator.notifyUsers(notificationType,
        createdBy, [users[0]._id],
        notifiedObjectsIds,
        false,
        newDate);

      Promise.all(promises)
        .then(() => {
          User.findById(users[0]._id)
            .then((user) => {
              expect(user.notifications.length).toBe(4);
              expect(user.notifications[0].notificationType).toBe(notificationType);
              expect(user.notifications[0]._createdBy[0].equals(createdBy)).toBe(true);
              expect(user.notifications[0]._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);
              expect(user.notifications[0].createdAt).toBe(newDate);

              done();
            });
        })
        .catch((e) => done(e));
    });

    it('should notify single user with aggregation', (done) => {
      const notificationType = NotificationModule.NotificationsTypesEnum.APARTMENT_WAS_MODIFIED;
      const createdBy = new ObjectID();
      const notifiedObjectsIds = [new ObjectID(users[0].notifications[2]._notifiedObjectsIds[0])];
      const newDate = new Date().getTime();

      const promises = Notificator.notifyUsers(
        notificationType,
        createdBy, [users[0]._id],
        notifiedObjectsIds,
        false, newDate);

      Promise.all(promises).then((results) => {
        Promise.all(results).then(() => {
          User.findById(users[0]._id).then((user) => {
            expect(user.notifications.length).toBe(3);
            expect(user.notifications[2].notificationType).toBe(notificationType);
            expect(user.notifications[2]._createdBy.length).toBe(2);
            expect(user.notifications[2]._createdBy[1].equals(createdBy)).toBe(true);
            expect(user.notifications[2]._notifiedObjectsIds.length).toBe(1);
            expect(user.notifications[2]._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);
            expect(user.notifications[2].createdAt).toBe(newDate);
            done();
          });
        });
      }).catch((e) => done(e));
    });

    it('should not notify user on his own changes', (done) => {
      const notificationType = NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT;
      const createdBy = users[1]._id;
      const notifiedObjectsIds = [new ObjectID()];
      const newDate = new Date().getTime();

      const promises = Notificator.notifyUsers(
        notificationType,
        createdBy, [createdBy],
        notifiedObjectsIds,
        false,
        newDate);

      Promise.all(promises).then((results) => {
        Promise.all(results).then(() => {
          User.findById(createdBy).then(() => {
            done();
          });
        });
      }).catch((e) => done(e));
    });
  });
});