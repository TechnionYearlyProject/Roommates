const expect = require('expect');
const { ObjectID } = require('mongodb');

const Notificator = require('../../../../server/services/notifications-system/notifier');
const NotificationModule = require('../../../../server/models/notification');
const {User} = require('../../../../server/models/user');

const {
  users,
  populateUsers,
} = require('../../../seed/seed');



describe('Notificator Tests', () => {
  beforeEach(populateUsers);

  describe('#notifyUsers', () => {
    it('should notify single user with no aggregation', (done) => {
  		const notificationType = NotificationModule.NotificationsTypesEnum.APARTMENT_WAS_MODIFIED;
  		const createdBy = new ObjectID();
  		const notifiedObjectsIds = [new ObjectID()];

    	Notificator.notifyUsers(notificationType, createdBy, [users[0]._id], notifiedObjectsIds).then((promises) =>{
        Promise.all(promises).then((res) => {
          User.findById(users[0]._id).then((user)=> {
            expect(user.notifications.length).toBe(3);
            expect(user.notifications[2].notificationType).toBe(notificationType);
            expect(user.notifications[2]._createdBy[0].equals(createdBy)).toBe(true);
            expect(user.notifications[2]._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);
            done();
          });
        });
      }).catch((e) => done(e));;
    });

    it('should notify multiple user with no aggregation (one of them - doesnt exist and on of them - read)', (done) => {
      const notificationType = NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT;
      const createdBy = new ObjectID();
      const notifiedObjectsIds = [new ObjectID()];

      Notificator.notifyUsers(notificationType, createdBy, [users[0]._id, users[1]._id], notifiedObjectsIds).then((promises) =>{
        Promise.all(promises).then((res) => {
          User.findById(users[0]._id).then((user)=> {
            expect(user.notifications.length).toBe(3);
            expect(user.notifications[2].notificationType).toBe(notificationType);
            expect(user.notifications[2]._createdBy[0].equals(createdBy)).toBe(true);
            expect(user.notifications[2]._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);
            User.findById(users[1]._id).then((userB)=> {
              expect(userB.notifications.length).toBe(1);
              expect(userB.notifications[0].notificationType).toBe(notificationType);
              expect(userB.notifications[0]._createdBy[0].equals(createdBy)).toBe(true);
              expect(userB.notifications[0]._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);
              done();
            });
          });
        });
      }).catch((e) => done(e));;
    });

    it('should notify single user with aggregation', (done) => {
      const notificationType = NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT;
      const createdBy = new ObjectID();
      const notifiedObjectsIds = [new ObjectID()];

      Notificator.notifyUsers(notificationType, createdBy, [users[0]._id], notifiedObjectsIds).then((promises) =>{
        Promise.all(promises).then((res) => {
          User.findById(users[0]._id).then((user)=> {
            expect(user.notifications.length).toBe(2);
            expect(user.notifications[0].notificationType).toBe(notificationType);
            expect(user.notifications[0]._createdBy.length).toBe(2);
            expect(user.notifications[0]._createdBy[1].equals(createdBy)).toBe(true);
            expect(user.notifications[0]._notifiedObjectsIds.length).toBe(2);
            expect(user.notifications[0]._notifiedObjectsIds[1].equals(notifiedObjectsIds[0])).toBe(true);
            done();
          });
        });
      }).catch((e) => done(e));;
    });

    it('should not notify user on his own changes', (done) => {
      const notificationType = NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT;
      const createdBy = users[1]._id;
      const notifiedObjectsIds = [new ObjectID()];

      Notificator.notifyUsers(notificationType, createdBy, [createdBy], notifiedObjectsIds).then((promises) =>{
        Promise.all(promises).then((res) => {
          User.findById(createdBy).then((user)=> {
            expect(user.notifications.length).toBe(0);
            done();
          });
        });
      }).catch((e) => done(e));;
    });
  });
});




