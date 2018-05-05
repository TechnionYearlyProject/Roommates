const expect = require('expect');
const { ObjectID } = require('mongodb');

const PrivateMessageModule = require('../../../server/models/privateMessage');

describe('Private Message Tests', () => {

   describe('#wasPrivateMessageRead', () => {
    it('should return true - message was read', (done) => {
    	const message = {
        _sentBy: new ObjectID(),
        createdAt: new Date().getTime(),
        content: "MESSAGE CONTENT",
		    wasRead: true,
		  };

      	expect(PrivateMessageModule.wasPrivateMessageRead(message)).toBe(true);
      	done();
    });

    it('should return false - message wasnt read', (done) => {
      const message = {
        _sentBy: new ObjectID(),
        createdAt: new Date().getTime(),
        content: "MESSAGE CONTENT",
        wasRead: false,
      };

        expect(PrivateMessageModule.wasPrivateMessageRead(message)).toBe(false);
        done();
    });
  });

   describe('#buildPrivateMessageJSON', () => {
    it('should return same values from JSON #1', (done) => {
      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;

    	const message = PrivateMessageModule.buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      expect(_sentBy.equals(message._sentBy)).toBe(true);
      expect(message.createdAt).toBe(createdAt);
      expect(message.content).toBe(content);
    	expect(message.wasRead).toBe(false);

      done();
    });
  });

  describe('#setPrivateMessageReadState', () => {
    it('should change message read status to true', (done) => {
      const message = {
        _sentBy: new ObjectID(),
        createdAt: new Date().getTime(),
        content: "MESSAGE CONTENT",
        wasRead: false,
      };

      var newMessage = PrivateMessageModule.setPrivateMessageReadState(message, true);
      
      expect(PrivateMessageModule.wasPrivateMessageRead(newMessage)).toBe(true);

      done();
    });
    
     it('should change message read status to false', (done) => {
      const message = {
        _sentBy: new ObjectID(),
        createdAt: new Date().getTime(),
        content: "MESSAGE CONTENT",
        wasRead: true,
      };

      var newMessage = PrivateMessageModule.setPrivateMessageReadState(message, false);
      
      expect(PrivateMessageModule.wasPrivateMessageRead(newMessage)).toBe(false);

      done();
    });

    it('should not change message read status', (done) => {
      const message = {
        _sentBy: new ObjectID(),
        createdAt: new Date().getTime(),
        content: "MESSAGE CONTENT",
        wasRead: false,
      };

      var newMessage = PrivateMessageModule.setPrivateMessageReadState(message, false);
      
      expect(PrivateMessageModule.wasPrivateMessageRead(newMessage)).toBe(false);

      done();
    });   
    
  });

   describe('#getPrivateMessageCreationTime', () => {
    it('should return the creattion time of the message', (done) => {
      const message = {
        _sentBy: new ObjectID(),
        createdAt: new Date().getTime(),
        content: "MESSAGE CONTENT",
        wasRead: false,
      };

      expect(PrivateMessageModule.getPrivateMessageCreationTime(message)).toBe(message.createdAt);
      done();
    });
  });

  describe('#wasPrivateMessageWrittenByParticipants', () => {
    it('should return yes for group of size 1 -  - message was written by the participants', (done) => {
      const message = {
        _sentBy: new ObjectID(),
        createdAt: new Date().getTime(),
        content: "MESSAGE CONTENT",
        wasRead: false,
      };

      expect(PrivateMessageModule.wasPrivateMessageWrittenByParticipants(message, [message._sentBy])).toBe(true);
      done();
    });

    it('should return true for group of size > 1  - message was written by the participants', (done) => {
      const message = {
        _sentBy: new ObjectID(),
        createdAt: new Date().getTime(),
        content: "MESSAGE CONTENT",
        wasRead: false,
      };

      expect(PrivateMessageModule.wasPrivateMessageWrittenByParticipants(message, [message._sentBy, new ObjectID()])).toBe(true);
      done();
    });

    it('should return false - message was no written by the participants', (done) => {
      const message = {
        _sentBy: new ObjectID(),
        createdAt: new Date().getTime(),
        content: "MESSAGE CONTENT",
        wasRead: false,
      };

      expect(PrivateMessageModule.wasPrivateMessageWrittenByParticipants(message, [new ObjectID()])).toBe(false);
      done();
    });

  });

});