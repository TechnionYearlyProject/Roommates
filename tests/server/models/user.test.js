const expect = require('expect');

const { ObjectID } = require('mongodb');
const { populateUsers, users, apartments } = require('../../seed/seed');
const { User } = require('../../../server/models/user');
const { buildPrivateMessageJSON } = require('../../../server/models/privateMessage');

const { getMatchScore } = require('../../../server/logic/matcher');

describe('User Tests', () => {
  beforeEach(populateUsers);
  describe('#getMatchingResult', () => {
    it('should return 0 - hobbies defined but no match', (done) => {
      const user = new User(users[0]);
      expect(user.getMatchingResult(users[1])).toBe(getMatchScore(users[0].hobbies, users[1].hobbies));
      done();
    });

    it('should return 0 - hobbies are not defined for both users', (done) => {
      const user = new User(users[4]);
      expect(user.getMatchingResult(users[5])).toBe(getMatchScore(users[4].hobbies, users[5].hobbies));
      done();
    });

    it('should return 0 - hobbies are not defined for one user (caller)', (done) => {
      const user = new User(users[4]);
      expect(user.getMatchingResult(users[0])).toBe(getMatchScore(users[0].hobbies, users[4].hobbies));
      done();
    });

    it('should return 0 - hobbies are not defined for one user (callee)', (done) => {
      const user = new User(users[0]);
      expect(user.getMatchingResult(users[4])).toBe(getMatchScore(users[0].hobbies, users[4].hobbies));
      done();
    });

    it('should return 1 - single match', (done) => {
      const user = new User(users[2]);
      expect(user.getMatchingResult(users[3])).toBe(getMatchScore(users[2].hobbies, users[3].hobbies));
      done();
    });

    it('should return 2 - multiple match', (done) => {
      const user = new User(users[1]);
      expect(user.getMatchingResult(users[3])).toBe(getMatchScore(users[3].hobbies, users[1].hobbies));
      done();
    });
  });

  describe('#getBestMatchingUsers', () => {
    it('should return users in order: 2,3,1 - different score for each user', (done) => {
      const user = new User(users[3]);
      user.getBestMatchingUsers([users[0]._id, users[1]._id, users[2]._id])
        .then((res) => {
          expect(res.length).toBe(3);
          expect(res[0].email).toBe(users[1].email);
          expect(res[1].email).toBe(users[2].email);
          expect(res[2].email).toBe(users[0].email);
          done();
        }).catch(done);
    });

    it('should return no users - no one is interested', (done) => {
      const user = new User(users[3]);
      user.getBestMatchingUsers([])
        .then((res) => {
          expect(res.length).toBe(0);
          done();
        }).catch(done);
    });
  });

  describe('#isOwner', () => {
    it('should return true', (done) => {
      const user = new User(users[1]);
      expect(user.isOwner(apartments[0]._id)).toBe(true);
      done();
    });

    it('should return false', (done) => {
      const user = new User(users[3]);
      expect(user.isOwner(apartments[0]._id)).toBe(false);
      done();
    });
  });

  describe('#inseryOrUpdateConversation', () => {
    it('should not add new conversation - not enough participants', (done) => {
      const user = new User(users[1]);
      var participants = [user._id];
      user.inseryOrUpdateConversation(participants, []).then((res) => {
          expect(res.conversations.length).toBe(0);
          done();
        }).catch((e) => {
          expect(e.name).toBe('ValidationError');
          done();
        });
    });
    
    it('should add new conversation with no messages', (done) => {
      const user = new User(users[1]);
      user.isNew = false;
      var participants = [user._id, new ObjectID()];
      user.inseryOrUpdateConversation(participants, []).then((res) => {
          expect(res.conversations.length).toBe(1);
          expect(res.conversations[0]._participants.length).toBe(2);
          expect(res.conversations[0]._participants[0].equals(user._id)).toBe(true);
          expect(res.conversations[0]._participants[1].equals(participants[1])).toBe(true);          
          expect(res.conversations[0].messages.length).toBe(0);
          done();
        }).catch(done);
    });

    it('should not add new conversation since user is not part of the participants', (done) => {
      const user = new User(users[1]);
      user.isNew = false;
      var participants = [new ObjectID(), new ObjectID()];
      user.inseryOrUpdateConversation(participants, []).then((res) => {
          expect(res.conversations.length).toBe(0);
          done();
        }).catch(done);
    });

    it('should add new conversation with messages', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      var participants = [user._id, _sentBy];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
          expect(res.conversations.length).toBe(1);
          expect(res.conversations[0]._participants.length).toBe(2);
          expect(res.conversations[0]._participants[0].equals(user._id)).toBe(true);
          expect(res.conversations[0]._participants[1].equals(participants[1])).toBe(true);          
          expect(res.conversations[0].messages.length).toBe(1);
          expect(_sentBy.equals(res.conversations[0].messages[0]._sentBy)).toBe(true);
          expect(res.conversations[0].messages[0].createdAt).toBe(createdAt);
          expect(res.conversations[0].messages[0].content).toBe(content);
          expect(res.conversations[0].messages[0].wasRead).toBe(false);

          done();
        }).catch(done);
    });

    it('should add messages to an exists conversation', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      var participants = [user._id, _sentBy];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
         res.inseryOrUpdateConversation(participants, messages).then((res) => {
          expect(res.conversations.length).toBe(1);        
          expect(res.conversations[0].messages.length).toBe(2);
          done();
        }).catch(done);
      }).catch(done);
    });

    it('should not add new conversation with messages - message was written by no participant', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      var participants = [user._id, new ObjectID()];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
          expect(res.conversations.length).toBe(0);

          done();
        }).catch(done);
    });
  });
  describe('#addNewMessageToConversation', () => {
    it('should not add new meesage - conversation doesnt exist', (done) => {
      const user = new User(users[1]);

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      user.addNewMessageToConversation(new ObjectID(), message).then((res) => {
          expect(res.conversations.length).toBe(0);
          done();
      }).catch(done);
    });

    it('should not add new message to conversation - message was not written by participants', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      var participants = [user._id, _sentBy];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        const _sentBy = new ObjectID();
        const createdAt = new Date().getTime();
        const content = "MESSAGE CONTENT";
        const wasRead = false;
        const newMessage = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);
        user.addNewMessageToConversation(res.conversations[0]._id, newMessage).then((res) => {
          expect(res.conversations[0].messages.length).toBe(1);
          done();
        }).catch(done);
      }).catch(done);
    });


    it('should add new message to conversation', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      var participants = [user._id, _sentBy];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        const _sentBy = res._id;
        const createdAt = new Date().getTime();
        const content = "MESSAGE CONTENT";
        const wasRead = false;
        const newMessage = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);
        user.addNewMessageToConversation(res.conversations[0]._id, newMessage).then((res) => {
          expect(res.conversations[0].messages.length).toBe(2);
          done();
        }).catch(done);
      }).catch(done);
    });
  });
  describe('#removeConversation', () => {
    it('should not remove conversation - conversation doesnt exist', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      var participants = [user._id, _sentBy];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        user.removeConversation([]).then((res) => {
          expect(res.conversations.length).toBe(1);
          done();
        }).catch(done);
      }).catch(done);
    });
    it('should remove conversation - conversation exists', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      var participants = [user._id, _sentBy];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        user.removeConversation(participants).then((res) => {
          expect(res.conversations.length).toBe(0);
          done();
        }).catch(done);
      }).catch(done);
    });
  });
  describe('#markConversationMessagesAsReadByTime', () => {
    it('should mark all messages of conversation as read', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      var participants = [user._id, _sentBy];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        user.markConversationMessagesAsReadByTime(participants, createdAt + 10).then((res) => {
          expect(res.conversations[0].messages[0].wasRead).toBe(true);
          done();
        }).catch(done);
      }).catch(done);
    });

    it('should not mark all messages of conversation as read - date is in the past', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      var participants = [user._id, _sentBy];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        user.markConversationMessagesAsReadByTime(participants, createdAt - 10).then((res) => {
          expect(res.conversations[0].messages[0].wasRead).toBe(false);
          done();
        }).catch(done);
      }).catch(done);
    });
  });

  describe('#getPrivateMessageById', () => {
     it('should get message - message exists', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);
      message._id = new ObjectID();

      var participants = [user._id, _sentBy];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        var res = user.getPrivateMessageById(participants, message._id);
        expect(res._sentBy.equals(_sentBy)).toBe(true);
        expect(res._id.equals(message._id)).toBe(true);
        expect(res.content).toBe(content);
        done();
      }).catch(done);
    });
    it('should get message - message doesnt exist', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);
      message._id = new ObjectID();

      var participants = [user._id, _sentBy];
      var messages = [message];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        var res = user.getPrivateMessageById(participants, new ObjectID());
        expect(res).toBe(null);
        done();
      }).catch(done);
    });
    it('should get message - conversation doesnt exist', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      var res = user.getPrivateMessageById([], new ObjectID());
      expect(res).toBe(null);
      done();
    });
  });

  describe('#isConversationWithParticipantsExist', () => {

    it('should return false - conversation with given participants doesnt exist', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      expect(user.isConversationWithParticipantsExist([])).toBe(false);
      done();
    });

    it('should return false - given participants is only a subset of the existing conversation participants', (done) => {
      const user = new User(users[1]);
      user.isNew = false;
      var participants = [user._id, new ObjectID()];
      user.inseryOrUpdateConversation(participants, []).then((res) => {
          expect(res.isConversationWithParticipantsExist([res._id])).toBe(false);
          done();
        }).catch(done);
    });

    it('should return true - conversation with given participants exists', (done) => {
      const user = new User(users[1]);
      user.isNew = false;
      var participants = [user._id, new ObjectID()];
      user.inseryOrUpdateConversation(participants, []).then((res) => {
          expect(res.isConversationWithParticipantsExist(participants)).toBe(true);
          done();
        }).catch(done);
    });
  });

  describe('#markMessagesAsReadByLastMessage', () => {
    it('should mark some of messages of conversation as read', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const messageOld = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);
      const messageNew = buildPrivateMessageJSON(_sentBy, createdAt+10, content, wasRead);
      messageOld._id = new ObjectID();
      var participants = [user._id, _sentBy];
      var messages = [messageOld, messageNew];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        user.markMessagesAsReadByLastMessage(participants, messageOld._id).then((res) => {
          expect(res.conversations[0].messages[0].wasRead).toBe(true);
          expect(res.conversations[0].messages[1].wasRead).toBe(false);
          done();
        }).catch(done);
      }).catch(done);
    });

    it('should mark all of messages of conversation as read', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const messageOld = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);
      const messageNew = buildPrivateMessageJSON(_sentBy, createdAt+10, content, wasRead);
      messageNew._id = new ObjectID();
      var participants = [user._id, _sentBy];
      var messages = [messageOld, messageNew];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        user.markMessagesAsReadByLastMessage(participants, messageNew._id).then((res) => {
          expect(res.conversations[0].messages[0].wasRead).toBe(true);
          expect(res.conversations[0].messages[1].wasRead).toBe(true);
          done();
        }).catch(done);
      }).catch(done);
    });

    it('should not mark any message as read - message id doesnt exist', (done) => {
      const user = new User(users[1]);
      user.isNew = false;

      const _sentBy = new ObjectID();
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const messageOld = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);
      const messageNew = buildPrivateMessageJSON(_sentBy, createdAt+10, content, wasRead);
      var participants = [user._id, _sentBy];
      var messages = [messageOld, messageNew];

      user.inseryOrUpdateConversation(participants, messages).then((res) => {
        user.markMessagesAsReadByLastMessage(participants, new ObjectID()).then((res) => {
          expect(res.conversations[0].messages[0].wasRead).toBe(false);
          expect(res.conversations[0].messages[1].wasRead).toBe(false);
          done();
        }).catch(done);
      }).catch(done);
    });
  });
});