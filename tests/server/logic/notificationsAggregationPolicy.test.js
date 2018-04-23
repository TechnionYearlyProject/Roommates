const expect = require('expect');

const {shouldNotificationsBeAgregated} = require('../../../server/logic/notificationsAggregationPolicy');
const { ObjectID } = require('mongodb');

const notificationAType1AndNotRead = {
   notificationType: 1,
    _createdBy: new ObjectID(),
    wasRead: false,
    _notifiedObjectsIds: [new ObjectID()]
};

const notificationBType2AndNotRead = {
   notificationType: 2,
    _createdBy: new ObjectID(),
    wasRead: false,
    _notifiedObjectsIds: [new ObjectID()]
}

const notificationCType1AndRead = {
   notificationType: 1,
    _createdBy: new ObjectID(),
    wasRead: true,
    _notifiedObjectsIds: [new ObjectID()]
};

const notificationDType1AndNotRead = {
   notificationType: 1,
    _createdBy: new ObjectID(),
    wasRead: false,
    _notifiedObjectsIds: [new ObjectID()]
};

const notificationDType1AndNotReadSameNotifiedObjectLikeA = {
   notificationType: 1,
    _createdBy: new ObjectID(),
    wasRead: false,
    _notifiedObjectsIds: [notificationAType1AndNotRead._notifiedObjectsIds[0]]
};

const notificationEType1AndRead = {
   notificationType: 1,
    _createdBy: new ObjectID(),
    wasRead: true,
    _notifiedObjectsIds: [new ObjectID()]
};

describe('Notifications Aggregation Policy Tests', () => {
  describe('#shouldNotificationsBeAgregated', () => {
    it('should return false - different notifications types', (done) => {
      expect(shouldNotificationsBeAgregated(notificationAType1AndNotRead, notificationBType2AndNotRead)).toBe(false);
      done();
    });

    it('should return false - same type but one of them was read', (done) => {
      expect(shouldNotificationsBeAgregated(notificationAType1AndNotRead, notificationCType1AndRead)).toBe(false);
      done();
    });

    it('should return false - same type and both were not read but different notified ids', (done) => {
      expect(shouldNotificationsBeAgregated(notificationAType1AndNotRead, notificationDType1AndNotRead)).toBe(false);
      done();
    });

    it('should return true - same type and both were not read and same notified ID', (done) => {
      expect(shouldNotificationsBeAgregated(notificationAType1AndNotRead, notificationDType1AndNotReadSameNotifiedObjectLikeA)).toBe(true);
      done();
    });

    it('should return false - same type but both of them were read', (done) => {
      expect(shouldNotificationsBeAgregated(notificationCType1AndRead, notificationEType1AndRead)).toBe(false);
      done();
    });
  });
});