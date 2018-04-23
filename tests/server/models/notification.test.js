const expect = require('expect');
const { ObjectID } = require('mongodb');

const NotificationModule = require('../../../server/models/notification');

describe('Notification Tests', () => {
  describe('#isSupportedNotificationType', () => {
    it('should return false - not supported notification type - lower bound', (done) => {
      expect(NotificationModule.isSupportedNotificationType(0)).toBe(false);
      done();
    });
    it('should return false - not supported notification type - upper bound', (done) => {
      expect(NotificationModule.isSupportedNotificationType(100)).toBe(false);
      done();
    });
    it('should return true - supported notification type', (done) => {
      expect(NotificationModule.isSupportedNotificationType(NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT)).toBe(true);
      done();
    });
  });

  
  describe('#getNotifiedObjectsIDs', () => {
    it('should return single notified object Id', (done) => {
      const notification = {
       notificationType: NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT,
        _createdBy: new ObjectID(),
        wasRead: false,
        _notifiedObjectsIds: [new ObjectID()]
        };
        expect(NotificationModule.getNotifiedObjectsIDs(notification).length).toBe(1);
        expect(NotificationModule.getNotifiedObjectsIDs(notification)[0].equals(notification._notifiedObjectsIds[0])).toBe(true);
        done();
    });

    it('should return multiple notified objects ids', (done) => {
        const notification = {
       notificationType: NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT,
        _createdBy: new ObjectID(),
        wasRead: false,
        _notifiedObjectsIds: [new ObjectID(),new ObjectID()]
         };
        expect(NotificationModule.getNotifiedObjectsIDs(notification).length).toBe(2);
        expect(NotificationModule.getNotifiedObjectsIDs(notification)[0].equals(notification._notifiedObjectsIds[0])).toBe(true);
        expect(NotificationModule.getNotifiedObjectsIDs(notification)[1].equals(notification._notifiedObjectsIds[1])).toBe(true);
        done();
    });
  });

   describe('#containsNotifiedObjectIDs', () => {
    it('should return false - doesnt contain notified object', (done) => {
      const notification = {
       notificationType: NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT,
        _createdBy: new ObjectID(),
        wasRead: false,
        _notifiedObjectsIds: [new ObjectID()]
    };
        expect(NotificationModule.containsNotifiedObjectIDs(notification, [new ObjectID()])).toBe(false);
        done();
    });

    it('should return true - contains notified object - multiple scenario', (done) => {
        const notification = {
       notificationType: NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT,
        _createdBy: new ObjectID(),
        wasRead: false,
        _notifiedObjectsIds: [new ObjectID() ,new ObjectID()]
    };
        expect(NotificationModule.containsNotifiedObjectIDs(notification, notification._notifiedObjectsIds)).toBe(true);
        done();
    });

    it('should return true - contains notified object - single scenario', (done) => {
        const notification = {
       notificationType: NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT,
        _createdBy: new ObjectID(),
        wasRead: false,
        _notifiedObjectsIds: [new ObjectID()]
    };
        expect(NotificationModule.containsNotifiedObjectIDs(notification, notification._notifiedObjectsIds)).toBe(true);
        done();
    });
  });

   describe('#getNotificationType', () => {
    it('should return COMMENT_WAS_ADDED_TO_APARTMENT', (done) => {
    	const notification = {
		   notificationType: NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT,
		    _createdBy: new ObjectID(),
		    wasRead: false,
		    _notifiedObjectsIds: [new ObjectID()]
		};

      	expect(NotificationModule.getNotificationType(notification)).toBe(NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT);
      	done();
    });

    it('should return USER_LIKED_APARTMENT', (done) => {
      	const notification = {
		   notificationType: NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT,
		    _createdBy: new ObjectID(),
		    wasRead: false,
		    _notifiedObjectsIds: [new ObjectID()]
		};

      	expect(NotificationModule.getNotificationType(notification)).toBe(NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT);
      	done();
    });
  });

   describe('#wasNotificationRead', () => {
    it('should return true - notification was read', (done) => {
    	const notification = {
		   notificationType: NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT,
		    _createdBy: new ObjectID(),
		    wasRead: true,
		    _notifiedObjectsIds: [new ObjectID()]
		};

      	expect(NotificationModule.wasNotificationRead(notification)).toBe(true);
      	done();
    });

    it('should return false - notification wasnt read', (done) => {
      	const notification = {
		   notificationType: NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT,
		    _createdBy: new ObjectID(),
		    wasRead: false,
		    _notifiedObjectsIds: [new ObjectID()]
		};

      	expect(NotificationModule.wasNotificationRead(notification)).toBe(false);
      	done();
    });
  });

   describe('#buildNotificationJSON', () => {
    it('should return same values from JSON #1', (done) => {
    	const notificationType = NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT;
    	const createdBy = new ObjectID();
    	const wasRead = false;
    	const notifiedObjectsIds = [new ObjectID()];

    	const notification = NotificationModule.buildNotificationJSON(notificationType, createdBy, wasRead, notifiedObjectsIds);

      	expect(notification.notificationType).toBe(NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT);
      	expect(createdBy.equals(notification._createdBy)).toBe(true);
      	expect(notification.wasRead).toBe(false);
      	expect(notification._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);

      	done();
    });

    it('should return same values from JSON #2', (done) => {
    	const notificationType = NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT;
    	const createdBy = new ObjectID();
    	const wasRead = true;
    	const notifiedObjectsIds = [new ObjectID()];
    	
    	const notification = NotificationModule.buildNotificationJSON(notificationType, createdBy, wasRead, notifiedObjectsIds);

      	expect(notification.notificationType).toBe(NotificationModule.NotificationsTypesEnum.USER_LIKED_APARTMENT);
      	expect(createdBy.equals(notification._createdBy)).toBe(true);
      	expect(notification.wasRead).toBe(true);
      	expect(notification._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);

      	done();
    });
  });

  describe('#saveAggregationDataInNotification', () => {
    it('should add new and different single id for the notified and to the created by', (done) => {
    	const notificationType = NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT;
    	const createdBy = [new ObjectID()];
    	const wasRead = false;
    	const notifiedObjectsIds = [new ObjectID()];
    	const newNotifiedObjectId = [new ObjectID()];
    	const newCreatedBy = [new ObjectID()];

    	var notification = NotificationModule.buildNotificationJSON(notificationType, createdBy, wasRead, notifiedObjectsIds);
    	notification = NotificationModule.addAggregationDataInNotification(notification, newNotifiedObjectId, newCreatedBy);

    	expect(notification._notifiedObjectsIds.length).toBe(2);
      expect(notification._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);
		  expect(notification._notifiedObjectsIds[1].equals(newNotifiedObjectId[0])).toBe(true);

		  expect(notification._createdBy.length).toBe(2);
      expect(notification._createdBy[0].equals(createdBy[0])).toBe(true);
		  expect(notification._createdBy[1].equals(newCreatedBy[0])).toBe(true);

      	done();
    });

    it('should add new and different ids to both - notified and createdBy', (done) => {
    	const notificationType = NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT;
    	const createdBy = new ObjectID();
    	const wasRead = false;
    	const notifiedObjectsIds = [new ObjectID()];
    	const newNotifiedObjectId = [new ObjectID(), new ObjectID()];
		const newCreatedBy = [new ObjectID(), new ObjectID()];

    	var notification = NotificationModule.buildNotificationJSON(notificationType, [createdBy], wasRead, notifiedObjectsIds);
    	notification = NotificationModule.addAggregationDataInNotification(notification, newNotifiedObjectId, newCreatedBy);

    	expect(notification._notifiedObjectsIds.length).toBe(3);
      	expect(notification._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);
      	expect(notification._notifiedObjectsIds[1].equals(newNotifiedObjectId[0])).toBe(true);
      	expect(notification._notifiedObjectsIds[2].equals(newNotifiedObjectId[1])).toBe(true);

      	expect(notification._createdBy.length).toBe(3);
      	expect(notification._createdBy[0].equals(createdBy)).toBe(true);
      	expect(notification._createdBy[1].equals(newCreatedBy[0])).toBe(true);
      	expect(notification._createdBy[2].equals(newCreatedBy[1])).toBe(true);

      	done();
    });

    it('should return same notifiedObjectsIds and createdBy array since its a set and we supplied same id', (done) => {
    	const notificationType = NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT;
    	const createdBy = new ObjectID();
    	const wasRead = false;
    	const notifiedObjectsIds = [new ObjectID()];

    	var notification = NotificationModule.buildNotificationJSON(notificationType, [createdBy], wasRead, notifiedObjectsIds);
    	notification = NotificationModule.addAggregationDataInNotification(notification, notifiedObjectsIds, [createdBy]);

    	expect(notification._notifiedObjectsIds.length).toBe(1);
      	expect(notification._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);

      	expect(notification._createdBy.length).toBe(1);
      	expect(notification._createdBy[0].equals(createdBy)).toBe(true);

      	done();
    });

    it('should add some of the ids since its a set and we supplied same id', (done) => {	
    	const notificationType = NotificationModule.NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT;
    	const createdBy = new ObjectID();
    	const wasRead = false;
    	const notifiedObjectsIds = [new ObjectID()];
    	const newNotifiedObjectId = [new ObjectID(), notifiedObjectsIds[0]];
    	const newCreatedBy = [new ObjectID(), createdBy];

    	var notification = NotificationModule.buildNotificationJSON(notificationType, [createdBy], wasRead, notifiedObjectsIds);
    	notification = NotificationModule.addAggregationDataInNotification(notification, newNotifiedObjectId, newCreatedBy);

    	expect(notification._notifiedObjectsIds.length).toBe(2);
      	expect(notification._notifiedObjectsIds[0].equals(notifiedObjectsIds[0])).toBe(true);
      	expect(notification._notifiedObjectsIds[1].equals(newNotifiedObjectId[0])).toBe(true);

      	expect(notification._createdBy.length).toBe(2);
      	expect(notification._createdBy[0].equals(createdBy)).toBe(true);
		expect(notification._createdBy[1].equals(newCreatedBy[0])).toBe(true);

      	done();
    });
  });

  describe('#updateNotificationByJson', () => {
    it('should change partial fields (some others are not supported)', (done) => {
     
      const notificationExample = {
        notificationType: 1,
       _createdBy: new ObjectID(),
        wasRead: false,
        _notifiedObjectsIds: [new ObjectID()]
      };

      var json = {notificationType: 2, wasReadTEMP: true};
      var notification = NotificationModule.updateNotificationByJson(notificationExample, json);
      
      expect(notification.notificationType).toBe(2);
      expect(notification.wasRead).toBe(false);

      done();
    });

    it('should change partial fields (all are supported)', (done) => {
     
      const notificationExample = {
        notificationType: 1,
       _createdBy: new ObjectID(),
        wasRead: false,
        _notifiedObjectsIds: [new ObjectID()]
      };

      var json = {notificationType: 2, wasRead: true};
      var notification = NotificationModule.updateNotificationByJson(notificationExample, json);
      
      expect(notification.notificationType).toBe(2);
      expect(notification.wasRead).toBe(true);

      done();
    });
  });




});