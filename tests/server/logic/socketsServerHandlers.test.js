const expect = require('expect');

const {markNotificationAsRead} = require('../../../server/logic/socketsServerHandlers');
const {User} = require('../../../server/models/user');

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
});