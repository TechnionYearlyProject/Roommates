const expect = require('expect');

const { ObjectID } = require('mongodb');

const visit = require('../../../server/models/visit');


describe('visit Tests', () => {
  describe('#isSupportedVisitStatusID', () => {
    it('should return false - not supported status id - 0', (done) => {
      expect(visit.isSupportedVisitStatusID(0)).toBe(false);
      done();
    });

    it('should return false - not supported status id - out of bounds', (done) => {
      expect(visit.isSupportedVisitStatusID(7)).toBe(false);
      done();
    });

    it('should return false - not supported status id - negative', (done) => {
      expect(visit.isSupportedVisitStatusID(-1)).toBe(false);
      done();
    });

    it('should return true - supported visit status id', (done) => {
      expect(visit.isSupportedVisitStatusID(1)).toBe(true);
      done();
    });

    it('should return true - last visit status id', (done) => {
      expect(visit.isSupportedVisitStatusID(4)).toBe(true);
      done();
    });
  });

  
  describe('#canModifyVisit', () => {
    const ownerId = new ObjectID();
    const visitorId = new ObjectID();
    const tempId = new ObjectID();
    
    it('should return false - not owner and not visitor cant modify visit', (done) => {
      expect(visit.canModifyVisit(ownerId,visitorId,tempId)).toBe(false);
      done();
    });

    it('should return true - owner can modify visit', (done) => {
      expect(visit.canModifyVisit(ownerId,visitorId,ownerId)).toBe(true);
      done();
    });

    it('should return true - visitor can modify visit', (done) => {
      expect(visit.canModifyVisit(ownerId,visitorId,visitorId)).toBe(true);
      done();
    });
  });

  describe('#isValidVisitStatusChange', () => {
  
    it('should return true - approved can be canceled by owner', (done) => {
      expect(visit.isValidVisitStatusChange(visit.getVisitStatusOnApproval(), visit.getVisitStatusOnCancelation(), true)).toBe(true);
      done();
    });

    it('should return true - approved can be canceled by visitor', (done) => {
      expect(visit.isValidVisitStatusChange(visit.getVisitStatusOnApproval(), visit.getVisitStatusOnCancelation(), false)).toBe(true);
      done();
    });

    it('should return false - visitor cant approve pending owner', (done) => {
      expect(visit.isValidVisitStatusChange(visit.getVisitStatusOnChange(false), visit.getVisitStatusOnApproval(), false)).toBe(false);
      done();
    });

    it('should return false - owner cant approve pending visitor', (done) => {
      expect(visit.isValidVisitStatusChange(visit.getVisitStatusOnChange(true), visit.getVisitStatusOnApproval(), true)).toBe(false);
      done();
    });

    it('should return true - owner can approve pending owner', (done) => {
      expect(visit.isValidVisitStatusChange(visit.getVisitStatusOnChange(false), visit.getVisitStatusOnApproval(), true)).toBe(true);
      done();
    });

    it('should return true - visitor can approve pending visitor', (done) => {
      expect(visit.isValidVisitStatusChange(visit.getVisitStatusOnChange(true), visit.getVisitStatusOnApproval(), false)).toBe(true);
      done();
    });

    it('should return false - owner cant make pending owner', (done) => {
      expect(visit.isValidVisitStatusChange(visit.getVisitStatusOnChange(true), visit.getVisitStatusOnChange(false), true)).toBe(false);
      done();
    });

    it('should return false - visitor cant make pending visitor', (done) => {
      expect(visit.isValidVisitStatusChange(visit.getVisitStatusOnChange(false), visit.getVisitStatusOnChange(true), false)).toBe(false);
      done();
    });

    it('should return false - visitor cant approve canceled visit', (done) => {
      expect(visit.isValidVisitStatusChange(visit.getVisitStatusOnCancelation(), visit.getVisitStatusOnApproval(), false)).toBe(false);
      done();
    });

    it('should return false - owner cant approve canceled visit', (done) => {
      expect(visit.isValidVisitStatusChange(visit.getVisitStatusOnCancelation(), visit.getVisitStatusOnApproval(), true)).toBe(false);
      done();
    });
  });
});