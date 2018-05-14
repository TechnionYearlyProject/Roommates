const expect = require('expect');

const {markNotificationAsRead, handleNewPrivateMessage, handleReadPrivateMessage} = require('../../../server/logic/socketsServerHandlers');
const {User} = require('../../../server/models/user');
const {buildPrivateMessageJSON} = require('../../../server/models/privateMessage');
const { ObjectID } = require('mongodb');

const {
  user1Notification1Id,
  users,
  populateUsers,
} = require('../../seed/seed');

describe('Socket Server Handlers Tests', () => {
  beforeEach(populateUsers);

  describe('#markNotificationAsRead', () => {
    it('should mark notification as read', (done) => {
      markNotificationAsRead(users[0]._id, users[0].notifications[0]).then((promise) =>{
          User.findById(users[0]._id).then((user)=> {
          expect(user.notifications[0].wasRead).toBe(true);
          done();
        });
      }).catch((e) => done(e));;
    });
  });

  describe('#handleNewPrivateMessage', () => {
    it('should add private message to sender and reciever', (done) => {
      const _sentBy = new ObjectID(users[0]._id);
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      handleNewPrivateMessage(users[0]._id, users[1]._id, message).then(() =>{
          User.findById(users[0]._id).then((user)=> {
            expect(user.conversations.length).toBe(1);
            expect(user.conversations[0].messages.length).toBe(1);
            expect(user.conversations[0].messages[0].content).toBe(content);
            User.findById(users[1]._id).then((user)=> {
              expect(user.conversations.length).toBe(1);
              expect(user.conversations[0].messages.length).toBe(1);
              expect(user.conversations[0].messages[0].content).toBe(content);
              done();
            }).catch(done);
          });
      }).catch((e) => {console.log(e.toString())});
    });
  });

  describe('#handleReadPrivateMessage', () => {
    it('should add private message to sender and reciever', (done) => {
      const _sentBy = new ObjectID(users[0]._id);
      const createdAt = new Date().getTime();
      const content = "MESSAGE CONTENT";
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);
      message._id = new ObjectID();  //the message id should be the same for both sides! (the sender and the reciever.)

      handleNewPrivateMessage(users[0]._id, users[1]._id, message).then(() =>{
         handleReadPrivateMessage(users[1]._id, users[0]._id, message._id).then(() => {
            User.findById(users[0]._id).then((user)=> {
            expect(user.conversations.length).toBe(1);
            expect(user.conversations[0].messages.length).toBe(1);
            expect(user.conversations[0].messages[0].wasRead).toBe(true);
            User.findById(users[1]._id).then((user)=> {
              expect(user.conversations.length).toBe(1);
              expect(user.conversations[0].messages.length).toBe(1);
              expect(user.conversations[0].messages[0].wasRead).toBe(true);
              done();
            }).catch(done);
         }).catch((e) => {console.log(e.toString())});
        }).catch((e) => {console.log(e.toString())});
      });
    });
  });
});