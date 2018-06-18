const expect = require('expect');
const request = require('supertest');
const {
  ObjectID
} = require('mongodb');
// const sleep = require('system-sleep');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND
} = require('http-status');

const {
  app
} = require('../../server/server');
const {
  XAUTH
} = require('../../server/constants');
const {
  User
} = require('../../server/models/user');
const {
  Apartment
} = require('../../server/models/apartment');
const {
  Review
} = require('../../server/models/review');
const {
  getSupportedTags
} = require('../../server/models/tag');
const {
  getSupportedHobbies
} = require('../../server/models/hobbie');
const {
  buildPrivateMessageJSON
} = require('../../server/models/privateMessage');
const { memberStatus, groupStatus } = require('../../server/models/group');

const {
  getVisitStatusCodes,
  getVisitStatusOnCreate,
  getVisitStatusOnCancelation,
  getVisitStatusOnChange,
  getVisitStatusChangeActions
} = require('../../server/models/visit');

const {
  Search
} = require('../../server/models/search');




const {
  apartment1User1VisitId,
  apartment1User2VisitId,
  apartments,
  users,
  reviews,
  coords,
  populateApartments,
  populateReviews,
  populateUsers,
  // populateGroups,
  notPublishedApartment,
  notPublishedReview1,
  notPublishedReview2,
  // irreleventReview,
  notRegisteredUser,
  // user1VerificationToken,
  user2VerificationToken,
  getForgotPasswordToken,
  review1Id,
  review2Id,
  populateSearchs,
  unsearchedSearch,
  newSearch,
  oldSearch
} = require('../seed/seed');

describe('#Server Tests', () => {
  beforeEach(populateUsers);
  beforeEach(populateApartments);
  beforeEach(populateReviews);


  // beforeEach((done) => {
  //     sleep(1.5 * 1000); //sleep 1.5 sec between queries for google map - we can't send too many requests in one second.
  //     done();
  // });




  describe('#GET /searchs/toNotify',() => {
    it('should return a list of one "to be notified" user', async () => {
      const search = Object.assign({}, unsearchedSearch);  
      search.createdAt = Date.now();
      await new Search(search).save();
      request(app)
        .get('/searchs/toNotify')
        .expect(OK)
        .expect((res => {
          expect(res.body.toBeNotified.length).toBe(1);
        }))
        .end((err) => {
          if(err) {
          }
        });
    }).timeout(5000);
  });
  
  
  
  describe('#POST /searchs', () => {
    it('should create a new search', (done) => {
      const search = Object.assign({}, unsearchedSearch);    
      request(app)
        .post('/searchs')
        .send(unsearchedSearch)
        .expect(OK)
        .expect((res)=>{
          expect(res.body.search.createdAt).toBeTruthy();
          expect(res.body.search.geolocation).toEqual(coords.technionIsrael);
          expect(res.body.search.address).toBeNull();
          expect(res.body.search.entranceDate).toEqual(new Date('2018-05-05').getTime());          
        })
        .end((err) => {
          if (err) {
            // console.log(err);
            return done(err);
          }
          return Search.find({
            radius: unsearchedSearch.radius
          })
            .then(($) => {
              expect($[0].createdAt).toBeTruthy();
              // expect($[0].toObject()).toMatchObject(search);
              expect($[0].geolocation[0]).toEqual(coords.technionIsrael[0]);
              expect($[0].geolocation[1]).toEqual(coords.technionIsrael[1]);
              expect($[0].address).toBeNull();
              expect($[0].entranceDate).toEqual(new Date('2018-05-05').getTime());
              done();
            }).catch((e) => done(e));
        });
    }).timeout(10000);
  });
  
  


  describe('#POST /apartments', () => {
    it('should create a new apartment', (done) => {
      const apartment = Object.assign({}, notPublishedApartment);

      request(app)
        .post('/apartments')
        .set(XAUTH, users[1].tokens[0].token)
        .send(notPublishedApartment)
        .expect(OK)
        .expect((res) => {
          apartment.location = {
            address: apartment.address
          };
          delete apartment.address;

          expect(res.body.apartment).toMatchObject(apartment);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }
          return Apartment.find({
            description: notPublishedApartment.description
          })
            .then(($) => {
              expect($[0]._createdBy).toEqual(users[1]._id);
              expect($[0].createdAt).toBeTruthy();
              expect($[0].toObject()).toMatchObject(apartment);
              expect($[0].location.geolocation).not.toEqual([0, 0]);
              expect($[0].comments.length).toBe(0);
              expect($[0].tags.length).toEqual(0);
              expect($[0]._interested.length).toEqual(0);
              done();
            }).catch((e) => done(e));
        });
    }).timeout(5000);

    it('should add apartment Id to user\'s published apartments', (done) => {
      request(app)
        .post('/apartments')
        .set(XAUTH, users[1].tokens[0].token)
        .send(notPublishedApartment)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const user = await User.findById(users[1]._id);
            const apartment = await Apartment.findOne({
              description: notPublishedApartment.description
            });
            expect(user._publishedApartments[0]).toEqual(apartments[0]._id.toHexString());
            expect(user._publishedApartments[1]).toEqual(apartment._id.toHexString());
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });

    it('should not create apartment to unautherized user', (done) => {
      request(app)
        .post('/apartments')
        .set(XAUTH, '1234')
        .send({})
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not create apartment with invalid data', (done) => {
      const apartment = {
        description: 'This is a great price. only for this test !!'
      };
      request(app)
        .post('/apartments')
        .set(XAUTH, users[1].tokens[0].token)
        .send({})
        .expect(BAD_REQUEST)
        .end((err) => {
          if (err) {
            return done(err);
          }

          return Apartment.find({
            description: apartment.description
          })
            .then((result) => {
              expect(result.length).toBe(0);
              done();
            }).catch((e) => done(e));
        });
    });

    it('should not create apartment with invalid tag', (done) => {
      const apartment = JSON.parse(JSON.stringify(notPublishedApartment));
      apartment.tags = [-1];
      request(app)
        .post('/apartments')
        .set(XAUTH, users[1].tokens[0].token)
        .send(apartment)
        .expect(BAD_REQUEST)
        .end((err) => {
          if (err) {
            return done(err);
          }

          return Apartment.find({
            description: apartment._id
          })
            .then((result) => {
              expect(result.length).toBe(0);
              done();
            }).catch((e) => done(e));
        });
    });

    it('should create apartment with valid tag ', (done) => {
      const validTagId = getSupportedTags()[0]._id;
      const apartment = JSON.parse(JSON.stringify(notPublishedApartment));
      apartment.tags = [validTagId];
      request(app)
        .post('/apartments')
        .set(XAUTH, users[1].tokens[0].token)
        .send(apartment)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const user = await User.findById(users[1]._id);
            const $ = await Apartment.findOne({
              description: notPublishedApartment.description
            });
            expect(user._publishedApartments[0]).toEqual(apartments[0]._id.toHexString());
            expect(user._publishedApartments[1]).toEqual($._id.toHexString());
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });
  });

  describe('#PUT /apartments/:id/subscription', () => {
    it('should return 404 when invalid id', (done) => {
      const id = new ObjectID();
      request(app)
        .put(`/apartments/${id}/subscription`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(NOT_FOUND)
        .end(done);
    });

    it('should not toggle subscription - unregistered user', (done) => {
      const id = apartments[1]._id;
      request(app)
        .put(`/apartments/${id}/subscription`)
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should remove subscription', (done) => {
      const id = apartments[0]._id;
      request(app)
        .put(`/apartments/${id}/subscription`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const apartment = await Apartment.findById(id);
            expect(apartment.isUserSubscriber(users[1]._id)).toBe(false);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    }).timeout(5000);

    it('should toggle to subscriber', (done) => {
      const id = apartments[1]._id;
      request(app)
        .put(`/apartments/${id}/subscription`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const apartment = await Apartment.findById(id);
            expect(apartment.isUserSubscriber(users[1]._id)).toBe(true);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    }).timeout(5000);
  });

  describe('#PATCH /users/notifications', () => {
    it('should edit notification (part of all user unread notifications)', (done) => {
      const id = [users[6].notifications[0]._id];
      request(app)
        .patch('/users/notifications')
        .set(XAUTH, users[6].tokens[0].token)
        .query({
          id
        })
        .send({
          wasRead: true
        })
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const user = await User.findById(users[6]._id);
            expect(user.getNotifications().length).toBe(2);
            expect(user.getNotifications()[0].wasRead).toBe(true);
            expect(user.getNotifications()[1].wasRead).toBe(false);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });

    it('should edit notification even if some dont exist (part of all user unread notifications)', (done) => {
      const id = [users[6].notifications[0]._id, new ObjectID().toHexString()];
      request(app)
        .patch('/users/notifications')
        .set(XAUTH, users[6].tokens[0].token)
        .query({
          id
        })
        .send({
          wasRead: true
        })
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const user = await User.findById(users[6]._id);
            expect(user.getNotifications().length).toBe(2);
            expect(user.getNotifications()[0].wasRead).toBe(true);
            expect(user.getNotifications()[1].wasRead).toBe(false);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });

    it('should edit multiple notifications', (done) => {
      const id = [users[6].notifications[0]._id, users[6].notifications[1]._id];
      request(app)
        .patch('/users/notifications')
        .set(XAUTH, users[6].tokens[0].token)
        .query({
          id
        })
        .send({
          wasRead: true
        })
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const user = await User.findById(users[6]._id);
            expect(user.getNotifications().length).toBe(2);
            expect(user.getNotifications()[0].wasRead).toBe(true);
            expect(user.getNotifications()[1].wasRead).toBe(true);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });
  });

  describe('#PUT /apartments/:id/comment', () => {
    it('should add a new comment', (done) => {
      const id = apartments[1]._id;
      const text = 'Nice apartment!';
      request(app)
        .put(`/apartments/${id}/comment`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          text
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.comments.length).toBe(1);
          expect(res.body.comments[0].text).toBe(text);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }
          return Apartment.findById(id)
            .then((apartment) => {
              expect(apartment.comments.length).toBe(1);
              expect(apartment.comments[0]._createdBy).toEqual(users[1]._id);
              expect(apartment.comments[0].text).toEqual(text);
              done();
            }).catch((e) => done(e));
        });
    }).timeout(5000);

    it('should not add comment with invalid text', (done) => {
      const id = apartments[1]._id;
      const text = '';
      request(app)
        .put(`/apartments/${id}/comment`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          text
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not add comment - unregistered user', (done) => {
      const id = apartments[1]._id;
      const text = 'Wow! Great apartment!';
      request(app)
        .put(`/apartments/${id}/comment`)
        .send({
          text
        })
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not add comment for invalid apartment', (done) => {
      const id = new ObjectID();
      const text = 'Wow! Great apartment!';
      request(app)
        .put(`/apartments/${id}/comment`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          text
        })
        .expect(NOT_FOUND)
        .end(done);
    });
  });


  describe('#PUT /apartments/:id/interested', () => {
    it('should return 404 when invalid id', (done) => {
      const id = new ObjectID();
      request(app)
        .put(`/apartments/${id}/interested`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(NOT_FOUND)
        .end(done);
    });

    it('should not add toggle interested - unregistered user', (done) => {
      const id = apartments[1]._id;
      request(app)
        .put(`/apartments/${id}/interested`)
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should toggle to not interested', (done) => {
      const id = apartments[0]._id;
      request(app)
        .put(`/apartments/${id}/interested`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const user = await User.findById(users[1]._id);
            const apartment = await Apartment.findById(id);
            expect(user.isInterestedInApartment(id)).toBe(false);
            expect(apartment.isUserInterested(users[1]._id)).toBe(false);

            expect(apartment.groups.length).toBe(0);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });

    it('should toggle to interested', (done) => {
      const id = apartments[1]._id;
      request(app)
        .put(`/apartments/${id}/interested`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const user = await User.findById(users[1]._id);
            const apartment = await Apartment.findById(id);
            expect(user.isInterestedInApartment(id)).toBe(true);
            expect(apartment.isUserInterested(users[1]._id)).toBe(true);
            expect(apartment.groups.length).toBe(0); // should not add a group !
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });
    it('should remove the groups with the uninterested user', (done) => {
      const id = apartments[2]._id;
      request(app)
        .put(`/apartments/${id}/interested`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const apartment = await Apartment.findById(id);
            expect(apartment.groups.length).toBe(2);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });
  });

  describe('#PATCH /apartments/:id', () => {
    it('should not edit apartment - non existing one', (done) => {
      const nonExistingId = new ObjectID();
      request(app)
        .patch(`/apartments/${nonExistingId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({})
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not edit apartment - user is not the owner', (done) => {
      const apartmentId = apartments[1]._id;
      request(app)
        .patch(`/apartments/${apartmentId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({})
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not edit apartment - value is illegal - invalid price value', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          price: -1
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not edit apartment - value is illegal - invalid floor type', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          floor: 'abc'
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should edit apartment', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          price: 30
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartment.price).toBe(30);
        })
        .end(async (err) => {
          if (err) {
            return done(err);
          }
          try {
            const apartment = await Apartment.findById(apartmentId);
            expect(apartment.price).toBe(30);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });
  });

  describe('#GET /apartments/:id/interested', () => {
    it('should not get interested - unregistered user', (done) => {
      const id = apartments[1]._id;
      request(app)
        .get(`/apartments/${id}/interested`)
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not get interested - apartment doesn\'t exist', (done) => {
      const id = new ObjectID().toHexString();
      request(app)
        .get(`/apartments/${id}/interested`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(NOT_FOUND)
        .end(done);
    });

    it('should not get interested - no interested users', (done) => {
      const id = apartments[1]._id;
      request(app)
        .get(`/apartments/${id}/interested`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .expect((res) => {
          expect(res.body._interested.length).toBe(0);
        })
        .end(async (err) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(5000);

    it('should get interested sorted', (done) => {
      const id = apartments[0]._id;
      request(app)
        .get(`/apartments/${id}/interested`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .expect((res) => {
          expect(res.body._interested.length).toBe(apartments[0]._interested.length);
          expect(res.body._interested[0]._id).toEqual(users[1]._id.toHexString());
          expect(res.body._interested[1]._id).toEqual(users[0]._id.toHexString());
          expect(res.body._interested[2]._id).toEqual(users[2]._id.toHexString());
        })
        .end(async (err) => {
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(5000);
  });

  describe('#DELETE /apartments', () => {
    it('should not delete aprtment - apartment doesnt exist', (done) => {
      const id = new ObjectID().toHexString();

      request(app)
        .delete(`/apartments/${id}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(UNAUTHORIZED)
        .end(done);
    }).timeout(5000);

    it('should not delete aprtment - user does not own the apartment', (done) => {
      const id = apartments[1]._id.toHexString();

      request(app)
        .delete(`/apartments/${id}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(UNAUTHORIZED)
        .end(done);
    }).timeout(5000);

    it('should delete aprtment from user and DB', (done) => {
      const id = apartments[0]._id.toHexString();

      request(app)
        .delete(`/apartments/${id}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const counter = await Apartment.count({
              _id: id
            });
            const user = await User.findById(users[1]._id);
            expect(counter).toBe(0);
            expect(user.isOwner(id)).toBe(false);

            return done();
          } catch (e) {
            return done(e);
          }
        });
    }).timeout(5000);
  });

  describe('#GET /apartments/visit/statuses', () => {
    it('should get all apartment visit statuses', (done) => {
      request(app)
        .get('/apartments/visit/statuses')
        .expect(OK)
        .expect((res) => {
          expect(res.body.statuses).toEqual(getVisitStatusCodes());
        })
        .end(done);
    });
  });

  describe('#GET /apartments/visit/actions', () => {
    it('should get all apartment visit statuses change actions', (done) => {
      request(app)
        .get('/apartments/visit/actions')
        .expect(OK)
        .expect((res) => {
          expect(res.body.statuses).toEqual(getVisitStatusChangeActions());
        })
        .end(done);
    });
  });


  describe('#PATCH /apartments/:id/visit/:visitId', () => {
    it('should not edit a visit - user is not relevant to the visit', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const visitId = apartment1User1VisitId.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/visit/${visitId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          schedTo: new Date('1-1-2027').getTime(),
          status: getVisitStatusOnCancelation()
        })
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not edit a visit - visit scheduled to the past', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const visitId = apartment1User2VisitId.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/visit/${visitId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          schedTo: new Date('1-1-2017').getTime(),
          status: getVisitStatusOnChange(false)
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not edit a visit - status is illegal', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const visitId = apartment1User2VisitId.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/visit/${visitId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          schedTo: new Date('1-1-2023').getTime(),
          status: getVisitStatusOnChange(true)
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not edit a visit - status is missing', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const visitId = apartment1User2VisitId.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/visit/${visitId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          schedTo: new Date('1-1-2023').getTime()
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should edit a visit', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const visitId = apartment1User2VisitId.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/visit/${visitId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          schedTo: new Date('1-1-2030').getTime(),
          status: getVisitStatusOnCancelation()
        })
        .expect(OK)
        .end((err) => {
          if (err) {
            return done(err);
          }
          return Apartment.findById(apartmentId)
            .then((apartment) => {
              const visit = apartment.getVisitDataById(visitId);
              expect(visit._askedBy.toHexString()).toBe(users[1]._id.toHexString());
              expect(visit.status).toBe(getVisitStatusOnCancelation());
              done();
            }).catch((e) => done(e));
        });
    });
  });

  describe('#PUT /apartments/:id/visit', () => {
    it('should not add a visit - visit scheduled to the past', (done) => {
      const apartmentId = apartments[1]._id.toHexString();
      request(app)
        .put(`/apartments/${apartmentId}/visit`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          schedTo: 10000
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not add a visit - unregistered user', (done) => {
      const apartmentId = apartments[1]._id.toHexString();
      request(app)
        .put(`/apartments/${apartmentId}/visit`)
        .send({
          schedTo: new Date('1-1-2027').getTime()
        })
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not add a visit - apartment doesnt exist', (done) => {
      const apartmentId = new ObjectID().toHexString();
      request(app)
        .put(`/apartments/${apartmentId}/visit`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          schedTo: new Date('1-1-2027').getTime()
        })
        .expect(NOT_FOUND)
        .end(done);
    });

    it('should not add a visit - visit has no schedule time', (done) => {
      const apartmentId = apartments[1]._id.toHexString();
      request(app)
        .put(`/apartments/${apartmentId}/visit`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({})
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should add a visit', (done) => {
      const apartmentId = apartments[1]._id.toHexString();
      request(app)
        .put(`/apartments/${apartmentId}/visit`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          schedTo: new Date('1-1-2027').getTime()
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartment.visits.length).toBe(1);
          expect(res.body.apartment.visits[0].scheduledTo).toBe(new Date('1-1-2027').getTime());
          expect(res.body.apartment.visits[0]._askedBy).toBe(users[1]._id.toHexString());
          expect(res.body.apartment.visits[0].status).toBe(getVisitStatusOnCreate());
        })
        .end((err) => {
          if (err) {
            return done(err);
          }
          return Apartment.findById(apartmentId)
            .then((apartment) => {
              expect(apartment.visits.length).toBe(1);
              expect(apartment.visits[0].scheduledTo).toBe(new Date('1-1-2027').getTime());
              expect(apartment.visits[0]._askedBy.toHexString()).toBe(users[1]._id.toHexString());
              expect(apartment.visits[0].status).toBe(getVisitStatusOnCreate());
              done();
            }).catch((e) => done(e));
        });
    });

    it('should not add a visit twice', (done) => {
      const apartmentId = apartments[1]._id.toHexString();
      request(app)
        .put(`/apartments/${apartmentId}/visit`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          schedTo: new Date('1-1-2027').getTime()
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartment.visits.length).toBe(1);
          expect(res.body.apartment.visits[0].scheduledTo).toBe(new Date('1-1-2027').getTime());
          expect(res.body.apartment.visits[0]._askedBy).toBe(users[1]._id.toHexString());
          expect(res.body.apartment.visits[0].status).toBe(getVisitStatusOnCreate());
          request(app)
            .put(`/apartments/${apartmentId}/visit`)
            .set(XAUTH, users[1].tokens[0].token)
            .send({
              schedTo: new Date('1-1-2028').getTime()
            })
            .expect(BAD_REQUEST);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }
          return Apartment.findById(apartmentId)
            .then((apartment) => {
              expect(apartment.visits.length).toBe(1);
              expect(apartment.visits[0].scheduledTo).toBe(new Date('1-1-2027').getTime());
              expect(apartment.visits[0]._askedBy.toHexString()).toBe(users[1]._id.toHexString());
              expect(apartment.visits[0].status).toBe(getVisitStatusOnCreate());
              done();
            }).catch((e) => done(e));
        });
    });
  });


  describe('#GET /apartments/tags', () => {
    it('should get all apartment tags', (done) => {
      request(app)
        .get('/apartments/tags')
        .expect(OK)
        .expect((res) => {
          expect(res.body.tags).toEqual(getSupportedTags());
        })
        .end(done);
    });
  });

  describe('#GET /apartments', () => {
    it('should find apartment by id', (done) => {
      const id = apartments[0]._id.toHexString();

      request(app)
        .get('/apartments')
        .query({
          id
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(1);
          expect(res.body.apartments[0]._id).toBe(id);
        })
        .end(done);
    });

    it('should find apartment by list of ids', (done) => {
      const id = [apartments[0]._id.toHexString(), apartments[1]._id.toHexString()];

      request(app)
        .get('/apartments')
        .query({
          id
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(2);
          expect(res.body.apartments[0]._id).toBe(id[0]);
          expect(res.body.apartments[1]._id).toBe(id[1]);
        })
        .end(done);
    });

    it('should ignore id property when invalid', (done) => {
      const id = '12345';

      request(app)
        .get('/apartments')
        .query({
          id
        })
        .expect(OK)
        .expect((res) => {
          // the id is ignored, so all apartments are returned (same as query {})
          expect(res.body.apartments.length).toBe(3);
        })
        .end(done);
    });

    it('should not find apartment with nonexistent id', (done) => {
      const id = new ObjectID().toHexString();

      request(app)
        .get('/apartments')
        .query({
          id
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(0);
        })
        .end(done);
    });

    it('should find apartment by owner\'s id', (done) => {
      const createdBy = apartments[1]._createdBy.toHexString();

      request(app)
        .get('/apartments')
        .query({
          createdBy
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(1);
          expect(res.body.apartments[0]._createdBy).toBe(createdBy);
        })
        .end(done);
    });

    it('should ignore owner\'s id property when invalid', (done) => {
      const createdBy = '12345';

      request(app)
        .get('/apartments')
        .query({
          createdBy
        })
        .expect(OK)
        .expect((res) => {
          // the owner's id is ignored, so all apartments are returned (same as query {})
          expect(res.body.apartments.length).toBe(3);
        })
        .end(done);
    });

    it('should not find apartment with nonexistent owner\'s id', (done) => {
      const createdBy = new ObjectID().toHexString();

      request(app)
        .get('/apartments')
        .query({
          createdBy
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(0);
        })
        .end(done);
    });

    it('should find apartment in price range', (done) => {
      const minPrice = apartments[1].price - 10;
      const maxPrice = apartments[1].price + 10;

      request(app)
        .get('/apartments')
        .query({
          price: [minPrice, maxPrice]
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(1);
          expect(res.body.apartments[0].price).toBe(apartments[1].price);
        })
        .end(done);
    });

    it('should not find apartment in invalid price range', (done) => {
      const minPrice = 100;
      const maxPrice = 200;

      request(app)
        .get('/apartments')
        .query({
          price: [minPrice, maxPrice]
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(0);
        })
        .end(done);
    });

    it('should find apartment due entrance date', (done) => {
      const entranceDate = new Date(apartments[0].entranceDate).toISOString();
      request(app)
        .get('/apartments')
        .query({
          entranceDate
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(1);
          expect(res.body.apartments[0].entranceDate).toBeLessThanOrEqual(apartments[0].entranceDate);
        })
        .end(done);
    });

    it('should not find apartment due invalid entrance date', (done) => {
      const entranceDate = '1-1-2017';

      request(app)
        .get('/apartments')
        .query({
          entranceDate
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(0);
        })
        .end(done);
    });

    it('should find apartment by address', (done) => {
      const address = apartments[0].getAddressString();

      request(app)
        .get('/apartments')
        .query({
          address
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(1);
          //expect(res.body.results[0].location.geolocation).toEqual(apartments[0].location.geolocation);
          expect(res.body.apartments[0].location.address).toEqual(apartments[0].location.address);
        })
        .end(done);
    }).timeout(5000);

    it('should not find apartment by invalid address', (done) => {
      const address = 'antartica';

      request(app)
        .get('/apartments')
        .query({
          address
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(0);
        })
        .end(done);
    }).timeout(5000);

    it('should find apartment by coords', (done) => {
      const latitude = 32.7831797;
      const longitude = 35.0164783;

      request(app)
        .get('/apartments')
        .query({
          geolocation: [longitude, latitude]
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(1);
          expect(res.body.apartments[0].location.geolocation[0]).toBe(apartments[0].location.geolocation[0]);
          expect(res.body.apartments[0].location.geolocation[1]).toBe(apartments[0].location.geolocation[1]);
        })
        .end(done);
    });

    it('should find apartments by coords and radius', (done) => {
      const latitude = 32.7831797;
      const longitude = 35.0164783;
      const radius = 100;

      request(app)
        .get('/apartments')
        .query({
          geolocation: [longitude, latitude],
          radius
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(3); //should find haifa and tel aviv
        })
        .end(done);
    });

    it('should not find apartment not in radius', (done) => {
      const latitude = 32.7831797;
      const longitude = 35.0164783;
      const radius = 50;

      request(app)
        .get('/apartments')
        .query({
          geolocation: [longitude, latitude],
          radius
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(1); //should find only haifa
        })
        .end(done);
    });


    it('should find apartments in radius', (done) => {
      const address = 'Technion israel';
      const radius = 3;
      request(app)
        .get('/apartments')
        .query({
          address,
          radius
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(1);
          //expect(res.body.results[0].location.geolocation).toEqual(apartments[0].location.geolocation);
          expect(res.body.apartments[0].location.address).toEqual(apartments[0].location.address);
        })
        .end(done);
    }).timeout(5000);

    it('should find apartment by min number of roommates', (done) => {
      const minRoommates = apartments[0].totalRoommates;

      request(app)
        .get('/apartments')
        .query({
          roommates: [minRoommates, null]
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(1);
          expect(res.body.apartments[0].totalRoommates).toBeGreaterThanOrEqual(minRoommates);
        })
        .end(done);
    });

    it('should find apartment by max number of roommates', (done) => {
      const maxRoommates = apartments[1].totalRoommates;

      request(app)
        .get('/apartments')
        .query({
          roommates: [null, maxRoommates]
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(2);
          expect(res.body.apartments[0].totalRoommates).toBeLessThanOrEqual(maxRoommates);
        })
        .end(done);
    });

    it('should find apartment by a range of roommates number', (done) => {
      const minRoommates = apartments[1].totalRoommates;
      const maxRoommates = apartments[1].totalRoommates;

      request(app)
        .get('/apartments')
        .query({
          roommates: [minRoommates, maxRoommates]
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(2);
          expect(res.body.apartments[0].totalRoommates).toBeGreaterThanOrEqual(minRoommates);
          expect(res.body.apartments[0].totalRoommates).toBeLessThanOrEqual(maxRoommates);
        })
        .end(done);
    });

    it('should not find apartment with invalid number of roommates', (done) => {
      const minRoommates = 11;

      request(app)
        .get('/apartments')
        .query({
          roommates: [minRoommates, null]
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(0);
        })
        .end(done);
    });

    it('should find apartment with valid tags', (done) => {
      request(app)
        .get('/apartments')
        .query({
          tags: [0, 7]
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartments.length).toBe(2);
          expect(res.body.apartments[0]._id.toString()).toBe(apartments[1]._id.toString());
        })
        .end(done);
    });
  });

  describe('#POST /users', () => {
    it('should register a new user', (done) => {
      request(app)
        .post('/users')
        .send(notRegisteredUser)
        .expect(OK)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeTruthy(); // token is returned after registration
          expect(res.body.user._id).toBeTruthy();
          expect(res.body.user).toMatchObject(User.toJSON(notRegisteredUser));
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          return User.findOne({
            email: notRegisteredUser.email
          })
            .then($ => {
              expect($).toBeTruthy();
              expect($._id).toBeTruthy();
              expect($.toObject()).toMatchObject(User.toJSON(notRegisteredUser));
              done();
            }).catch((errr) => done(errr));
        });
    });


    it('should register a new user without last name', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      delete user.lastName;

      request(app)
        .post('/users')
        .send(user)
        .expect(OK)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeTruthy();
          expect(res.body.user).toMatchObject(User.toJSON(user));
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          return User.findOne({
            email: user.email
          })
            .then($ => {
              expect($).toBeTruthy();
              expect($._id).toBeTruthy();
              expect($.toObject()).toMatchObject(User.toJSON(user));
              done();
            }).catch((errr) => done(errr));
        });
    });

    it('should not register an existing user', (done) => {
      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user with invalid email', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      user.email = 'alongmail.com';

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user with email already exist (case insensetive)', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      user.email = 'USER1@Gmail.com';

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should register a new user with uppercase email address', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      user.email = user.email.toUpperCase();
      request(app)
        .post('/users')
        .send(user)
        .expect(OK)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeTruthy(); // token is returned after registration
          expect(res.body.user._id).toBeTruthy();
          expect(res.body.user).toMatchObject(User.toJSON(notRegisteredUser));
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          return User.findOne({
            email: notRegisteredUser.email
          })
            .then($ => {
              expect($).toBeTruthy();
              expect($._id).toBeTruthy();
              expect($.toObject()).toMatchObject(User.toJSON(notRegisteredUser));
              done();
            }).catch((errr) => done(errr));
        });
    });

    it('should not register a user without email', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      delete user.email;

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user with invalid password', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      user.password = '12345'; //password is too short

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user without password', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      delete user.password;

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user with invalid firstName', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      user.firstName = 'A'; //first name is too short

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user without firstName', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      delete user.firstName;

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user with invalid birthdate', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      user.birthdate = -2208988800001; //'1900-01-01' -1 mili

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user without birthdate', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      delete user.birthdate;

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user with invalid gender', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      user.gender = 'notReal';

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user without gender', (done) => {
      const user = Object.assign({}, notRegisteredUser);
      delete user.gender;

      request(app)
        .post('/users')
        .send(user)
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should encrypt password', (done) => {
      request(app)
        .post('/users')
        .send(notRegisteredUser)
        .expect(OK)
        .end((err) => {
          if (err) {
            return done(err);
          }

          return User.findOne({
            email: notRegisteredUser.email
          })
            .then((savedUser) => {
              expect(savedUser.password).toBeTruthy();
              expect(savedUser.password).not.toBe(notRegisteredUser.password);
              done();
            }).catch((errr) => done(errr));
        });
    });
  });

  describe('#POST /users/login', () => {
    it('should login user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[0].email,
          password: users[0].password
        })
        .expect(OK)
        .expect((res) => expect(res.headers[XAUTH]).toBeTruthy())
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          return User.findOne({
            email: users[0].email
          })
            .then((user) => {
              expect(user.toObject().tokens[0]).toMatchObject({
                access: XAUTH,
                token: res.headers[XAUTH]
              });
              // It is important to check that the user is indeed verified, otherwise he shouldn't have been abled to login.
              expect(user.isVerified).toBeTruthy();
              done();
            }).catch((errr) => done(errr));
        });
    });

    it('should login user and return auth token (email is case insensetive)', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[0].email.toUpperCase(),
          password: users[0].password
        })
        .expect(OK)
        .expect((res) => expect(res.headers[XAUTH]).toBeTruthy())
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          return User.findOne({
            email: users[0].email
          })
            .then((user) => {
              expect(user.toObject().tokens[0]).toMatchObject({
                access: XAUTH,
                token: res.headers[XAUTH]
              });
              // It is important to check that the user is indeed verified, otherwise he shouldn't have been abled to login.
              expect(user.isVerified).toBeTruthy();
              done();
            }).catch((errr) => done(errr));
        });
    });

    it('should reject login with invalid email', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: 'invalid@gmail.com',
          password: users[0].password
        })
        .expect(BAD_REQUEST)
        .expect((res) => expect(res.headers[XAUTH]).toBeFalsy())
        .end((err) => done(err));
    });

    it('should reject login with invalid password', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[0].email,
          password: `${users[0].password}2`
        })
        .expect(BAD_REQUEST)
        .expect((res) => expect(res.headers[XAUTH]).toBeFalsy())
        .end((err) => {
          if (err) {
            return done(err);
          }
          return User.findOne({
            email: users[0].email
          }).then((user) => {
            expect(user.tokens.length).toBe(1); //the user has an old notification token
            done();
          }).catch((errr) => done(errr));
        });
    });
  });

  describe('#GET /users/tags', () => {
    it('should get all user tags', (done) => {
      request(app)
        .get('/users/tags')
        .expect(OK)
        .expect((res) => {
          expect(res.body.tags).toEqual(getSupportedHobbies());
        })
        .end(done);
    });
  });

  describe('#GET /users/self', () => {
    it('should return the connected user', (done) => {
      request(app)
        .get('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .expect((res) => {
          const expected = User.toJSON(users[1]);
          expected._id = expected._id.toHexString();
          expect(res.body.self).toMatchObject(expected);
        })
        .end(done);
    });

    it('should not return user when not authorized', (done) => {
      request(app)
        .get('/users/self')
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not return user when not authorized', (done) => {
      request(app)
        .get('/users/self')
        .set(XAUTH, 'C0FFEE')
        .expect(UNAUTHORIZED)
        .end((e) => done(e));
    });
  });

  describe('#GET /users', () => {
    it('should find single existing user by id', (done) => {
      const id = users[1]._id.toHexString();

      request(app)
        .get('/users')
        .query({
          id
        })
        .expect(OK)
        .expect((res) => {
          const expected = User.toJSON(users[1]);
          expected._id = expected._id.toHexString();
          expect(res.body.users[expected._id]).toEqual(expected);
        })
        .end((e) => done(e));
    });

    it('should find multiple existing user by id', (done) => {
      const id = [users[0]._id.toHexString(), users[1]._id.toHexString()];

      request(app)
        .get('/users')
        .query({
          id
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.users[users[0]._id]).toBeTruthy();
          expect(res.body.users[users[1]._id]).toBeTruthy();
        })
        .end((e) => done(e));
    });

    it('should only find multiple users that exist', (done) => {
      const id = [users[0]._id.toHexString(), new ObjectID().toHexString()];
      request(app)
        .get('/users')
        .query({
          id
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.users[users[0]._id]._id).toEqual(users[0]._id.toHexString());
          expect(Object.keys(res.body.users).length).toBe(1);
        })
        .end((e) => done(e));
    });

    it('should not find user with invalid id', (done) => {
      const id = '1234';

      request(app)
        .get('/users')
        .query({
          id
        })
        .expect(BAD_REQUEST)
        .end((e) => done(e));
    });

    it('should not find nonexistent user', (done) => {
      const id = new ObjectID().toHexString();

      request(app)
        .get('/users')
        .query({
          id
        })
        .expect(OK)
        .expect((res) => {
          expect(Object.keys(res.body.users).length).toBe(0);
        })
        .end((e) => done(e));
    });
  });

  describe('#DELETE /users/conversation', () => {
    it('should delete messages in the conversation', (done) => {
      const _sentBy = users[1]._id;
      const createdAt = new Date().getTime();
      const content = 'MESSAGE CONTENT';
      const wasRead = false;
      const message = buildPrivateMessageJSON(_sentBy, createdAt, content, wasRead);

      const participants = [users[1]._id, users[0]._id];
      const messages = [message];

      User.findById(users[1]._id).then(user => {
        user.inseryOrUpdateConversation(participants, messages).then(() => {
          const id = [users[0]._id.toHexString(), users[1]._id.toHexString()];
          request(app)
            .delete('/users/conversation')
            .set(XAUTH, users[1].tokens[0].token)
            .query({
              id
            })
            .expect(OK)
            .expect(() => {
              User.findById(users[1]._id).then($ => {
                expect($.conversations.length).toBe(0);
              }).catch(done);
            })
            .end(done);
        }).catch(done);
      });
    });
  });

  describe('#GET /users/:id/interested', () => {
    it('should return all interested apartments', (done) => {
      const id = users[5]._id.toHexString();
      request(app)
        .get(`/users/${id}/interested`)
        .expect(OK)
        .expect((res) => {
          expect(res.body.interested.length).toBe(1);
          expect(res.body.interested[0]._id).toBe(apartments[0]._id.toHexString());
          expect(res.body.interested[0].title).toBe(apartments[0].title);
        })
        .end(done);
    });

    it('should return empty list when no interests', (done) => {
      const id = users[4]._id.toHexString();

      request(app)
        .get(`/users/${id}/interested`)
        .expect(OK)
        .expect((res) => {
          expect(res.body.interested).toEqual([]);
        })
        .end(done);
    });

    it('should return 404 when invalid id', (done) => {
      const id = new ObjectID();
      request(app)
        .get(`/users/${id}/interested`)
        .expect(NOT_FOUND)
        .end(done);
    });
  });


  describe('#GET /users/:id/published', () => {
    it('should return all published apartments', (done) => {
      const id = users[5]._id.toHexString();

      request(app)
        .get(`/users/${id}/published`)
        .expect(OK)
        .expect((res) => {
          expect(res.body.published.length).toBe(2);
          expect(res.body.published[0]._id).toBe(apartments[0]._id.toHexString());
          expect(res.body.published[1]._id).toBe(apartments[1]._id.toHexString());
          expect(res.body.published[0].title).toBe(apartments[0].title);
          expect(res.body.published[1].title).toBe(apartments[1].title);
        })
        .end(done);
    });

    it('should return empty list when no publishes', (done) => {
      const id = users[4]._id.toHexString();

      request(app)
        .get(`/users/${id}/published`)
        .expect(OK)
        .expect((res) => {
          expect(res.body.published).toEqual([]);
        })
        .end(done);
    });

    it('should return 404 when invalid id', (done) => {
      const id = new ObjectID();
      request(app)
        .get(`/users/${id}/published`)
        .expect(NOT_FOUND)
        .end(done);
    });
  });

  describe('#PATCH /users/self', () => {
    it('should update user', (done) => {
      const user = Object.assign({}, users[3]);
      user.email = users[1].email;
      user._id = users[1]._id;
      user._publishedApartments = users[1]._publishedApartments;
      user._givenReviews = users[1]._givenReviews;
      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send(users[3])
        .expect(OK)
        .expect((res) => {
          const expected = User.toJSON(user);
          expected._id = expected._id.toHexString();
          //should not update the published apartment list
          expected._publishedApartments = users[1]._publishedApartments;
          expect(res.body.user).toMatchObject(expected);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }
          return User.findById(users[1]._id.toHexString())
            .then($ => {
              delete user.password; // we don't want to check the password since it's encrypted
              delete user._id;
              expect($.toObject()).toMatchObject(user);
              done();
            })
            .catch(done);
        });
    });

    it('should not update email', (done) => {
      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          email: 'user2@yahoo.com'
        })
        .expect(OK)
        .expect((res) => {
          const expected = User.toJSON(users[1]);
          expected._id = expected._id.toHexString();
          expect(res.body.user).toMatchObject(expected);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }
          return User.findById(users[1]._id.toHexString())
            .then((user) => {
              expect(user.email).toBe(users[1].email);
              done();
            })
            .catch(done);
        });
    });

    it('should not update to invalid first name', (done) => {
      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          firstName: 'A'
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not update to invalid birthdate', (done) => {
      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          birthdate: -2208988800001
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not update to invalid mobile phone number', (done) => {
      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          mobilePhone: -123
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not update to invalid gender', (done) => {
      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          gender: 'FakeGender'
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not update user when not authorized', (done) => {
      request(app)
        .patch('/users/self')
        .send(users[3])
        .expect(UNAUTHORIZED)
        .end(done);
    });
  });

  describe('#PATCH /users/verify/:token', () => {
    it('should verify the user', (done) => {
      request(app)
        .patch(`/users/verify/${user2VerificationToken}`)
        .expect(OK)
        .end((err) => {
          if (err) {
            return done(err);
          }
          return User.findById(users[1]._id.toHexString())
            .then((user) => {
              expect(user.isVerified).toBeTruthy();
              done();
            })
            .catch(done);
        });
    });
    it('should fail to verify the user', (done) => {
      request(app)
        .patch(`/users/verify/${user2VerificationToken}1`) // Bad token
        .expect(BAD_REQUEST)
        .end(done);
    });
  });

  describe('#POST /users/verify', () => {
    it('should send verification mail', (done) => {
      request(app)
        .post('/users/verify')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(OK)
        .end(done);
    });
    it('should not send verification mail on bad password', (done) => {
      request(app)
        .post('/users/verify')
        .send({
          email: users[1].email,
          password: `${users[1].password}a`
        })
        .expect(UNAUTHORIZED)
        .end(done);
    });
    it('should not send verification mail on bad email', (done) => {
      request(app)
        .post('/users/verify')
        .send({
          email: `${users[1].email}a`,
          password: users[1].password
        })
        .expect(UNAUTHORIZED)
        .end(done);
    });
    it('should not send verification mail when already verified', (done) => {
      request(app)
        .post('/users/verify')
        .send({
          email: users[0].email,
          password: users[0].password
        })
        .expect(BAD_REQUEST)
        .end(done);
    });
  });

  describe('#POST /users/reset', () => {
    it('should send email when authenticated', (done) => {
      request(app)
        .post('/users/reset')
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          email: users[1].email
        })
        .expect(OK)
        .end(done);
    });
    it('should send email when not authenticated', (done) => {
      request(app)
        .post('/users/reset')
        .send({
          email: users[1].email
        })
        .expect(OK)
        .end(done);
    });
  });

  /** Alon Talmor: this route is deprecated
  describe('#GET /users/reset/:token', () => {
    // Prepare the token for the tests.
    let hashedPassword = null;
    let user2ForgotPasswordToken = null;
    beforeEach(async () => {
      hashedPassword = (await User.findById(users[1]._id.toHexString())).password;
      user2ForgotPasswordToken = getForgotPasswordToken(hashedPassword);
    });

    it('should accept password reset', (done) => {
      request(app)
        .get(`/users/reset/${user2ForgotPasswordToken}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .end(done);
    });
    it('should not accept password reset on bad token', (done) => {
      request(app)
        .get(`/users/reset/${user2ForgotPasswordToken}l`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(BAD_REQUEST)
        .end(done);
    });
    it('should not accept password reset when not authenticated', (done) => {
      request(app)
        .get(`/users/reset/${user2ForgotPasswordToken}`) // The token is good
        .expect(UNAUTHORIZED) // but the user is not authorized
        .end(done);
    });
  });*/

  describe('#PATCH /users/reset/:token', () => {
    // Prepare the token for the tests.
    let hashedPassword = null;
    let user2ForgotPasswordToken = null;
    beforeEach(async () => {
      hashedPassword = (await User.findById(users[1]._id.toHexString())).password;
      user2ForgotPasswordToken = getForgotPasswordToken(hashedPassword);
    });

    it('should change the user\'s password', (done) => {
      request(app)
        .patch(`/users/reset/${user2ForgotPasswordToken}`)
        .send({
          email: users[1].email,
          password: 'newPassword'
        })
        .expect(OK)
        .end((err) => {
          if (err) {
            return done(err);
          }
          return User.findById(users[1]._id.toHexString())
            .then((user) => {
              expect(user.password).not.toBe(hashedPassword); // This means the the password has changed.
              done();
            })
            .catch(done);
        });
    });
    it('should not change to invalid password', (done) => {
      request(app)
        .patch(`/users/reset/${user2ForgotPasswordToken}`)
        .send({
          email: users[1].email,
          password: 'a' // Password is too short.
        })
        .expect(BAD_REQUEST)
        .end((err) => {
          if (err) {
            return done(err);
          }
          return User.findById(users[1]._id.toHexString())
            .then((user) => {
              expect(user.password).toBe(hashedPassword); // Password has not changed.
              done();
            })
            .catch(done);
        });
    });
    it('should not change password when token is invalid', (done) => {
      request(app)
        .patch(`/users/reset/${user2ForgotPasswordToken}l`) // Token is invalid.
        .send({
          email: users[1].email,
          password: 'newPassword' // Password is valid.
        })
        .expect(BAD_REQUEST)
        .end((err) => {
          if (err) {
            return done(err);
          }
          return User.findById(users[1]._id.toHexString())
            .then((user) => {
              expect(user.password).toBe(hashedPassword); // Password has not changed.
              done();
            })
            .catch(done);
        });
    });
  });

  describe('#POST /reviews', () => {
    it('should create a new review', (done) => {
      const review = Object.assign({}, notPublishedReview1);

      request(app)
        .post('/reviews')
        .set(XAUTH, users[1].tokens[0].token)
        .send(notPublishedReview1)
        .expect(OK)
        .end((err) => {
          if (err) {
            return done(err);
          }
          return Review.find({
            Pros: notPublishedReview1.Pros
          })
            .then(($) => {
              expect($[0]._createdBy).toEqual(users[1]._id);
              expect($[0].createdAt).toBeTruthy();
              expect($[0].toObject()).toMatchObject(review);
              expect($[0].geolocation).not.toEqual([35.020568, 32.776515]);
              done();
            }).catch((e) => done(e));
        });
    }).timeout(5000);

    it('should add review Id to user\'s given reviews', (done) => {
      request(app)
        .post('/reviews')
        .set(XAUTH, users[1].tokens[0].token)
        .send(notPublishedReview1)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const user = await User.findById(users[1]._id);
            const review = await Review.findOne({
              Pros: notPublishedReview1.Pros
            });
            expect(user._givenReviews[0]).toEqual(reviews[1]._id.toHexString());
            expect(user._givenReviews[1]).toEqual(reviews[3]._id.toHexString());
            expect(user._givenReviews[2]).toEqual(review._id.toHexString());
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });

    it('should not create a new review in an adjacent location by same user', (done) => {
      const review = Object.assign({}, notPublishedReview2);
      request(app)
        .post('/reviews')
        .set(XAUTH, users[1].tokens[0].token)
        .send(notPublishedReview2)
        .expect(BAD_REQUEST)
        .end((err) => {
          if (err) {
            return done(err);
          }
          return Review.find({
            Pros: review.Pros
          })
            .then((result) => {
              expect(result.length).toBe(0); // the review should not have been added
              done();
            }).catch((e) => done(e));
        });
    }).timeout(5000);

    it('should not create review to unauthorized user', (done) => {
      request(app)
        .post('/reviews')
        .set(XAUTH, '1234')
        .send({})
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not create review with invalid data', (done) => {
      const review = {
        Pros: 'This is a great price. only for this test !!'
      };
      request(app)
        .post('/reviews')
        .set(XAUTH, users[1].tokens[0].token)
        .send({})
        .expect(BAD_REQUEST)
        .end((err) => {
          if (err) {
            return done(err);
          }

          return Review.find({
            Pros: review.Pros
          })
            .then((result) => {
              expect(result.length).toBe(0);
              done();
            }).catch((e) => done(e));
        });
    }).timeout(5000);
  });
  describe('#PATCH /reviews/:id', () => {
    it('should not edit review - non existing one', (done) => {
      const nonExistingId = new ObjectID();
      request(app)
        .patch(`/reviews/${nonExistingId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({})
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not edit review - user is not the owner', (done) => {
      const reviewID = reviews[0]._id;
      request(app)
        .patch(`/reviews/${reviewID}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({})
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not edit review - value is illegal - invalid price value', (done) => {
      const reviewId = reviews[1]._id.toHexString();
      const rated = {
        parking: -1,
        publicTransport: 0,
        noise: 0,
        commercialServices: 0,
        upkeep: 0,
        generalRating: 0,
      };
      request(app)
        .patch(`/reviews/${reviewId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          ratedCharacteristics: rated
        })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should edit review', (done) => {
      const reviewId = reviews[1]._id.toHexString();
      const rated = {
        parking: 1,
        publicTransport: 2,
        noise: 3,
        commercialServices: 4,
        upkeep: 5,
        generalRating: 3,
      };
      request(app)
        .patch(`/reviews/${reviewId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({
          ratedCharacteristics: rated
        })
        .expect(OK)
        .expect((res) => {
          expect(res.body.review.ratedCharacteristics).toMatchObject(rated);
        })
        .end(async (err) => {
          if (err) {
            return done(err);
          }
          try {
            const review = await Review.findById(reviewId);
            expect(review.ratedCharacteristics).toMatchObject(rated);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });

    it('should reactivate a irrelevant review', (done) => {
      const reviewId = reviews[3]._id.toHexString();
      request(app)
        .patch(`/reviews/${reviewId}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .expect((res) => {
          expect(res.body.review.relevent).toBeTruthy();
        })
        .end(async (err) => {
          if (err) {
            return done(err);
          }
          try {
            const review = await Review.findById(reviewId);
            expect(review.relevent).toBeTruthy();
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });
  });

  describe('#GET /reviews/:long/:lat', () => {
    it('should return all reviews for Technion', (done) => {
      const tech = coords.technionIsrael;
      request(app)
        .get(`/reviews/${tech[0]}/${tech[1]}`)
        .expect(OK)
        .expect((res) => {
          expect(res.body.reviews.length).toBe(2);
          expect(res.body.reviews[0]._id).toBe(review1Id.toHexString());
          expect(res.body.reviews[1]._id).toBe(review2Id.toHexString());
        })
        .end(done);
    });
  });


  describe('#GET /reviews/aggregated/:long/:lat', () => {
    it('should return accurate calculated review for technion', (done) => {
      const tech = coords.technionIsrael;
      const rated = {
        parking: 2,
        publicTransport: 2,
        noise: 2,
        commercialServices: 2,
        upkeep: 2,
        generalRating: 2,
      };
      request(app)
        .get(`/reviews/aggregated/${tech[0]}/${tech[1]}`)
        .expect(OK)
        .expect((res) => {
          expect(res.body.r.ratedCharacteristics).toMatchObject(rated);
        })
        .end(done);
    });


    it('should return accurate calculated review for technion with irrelevent review', (done) => {
      const {
        dor
      } = coords;
      const rated = {
        parking: (2 / 1.5),
        publicTransport: (2 / 1.5),
        noise: (2 / 1.5),
        commercialServices: (2 / 1.5),
        upkeep: (2 / 1.5),
        generalRating: (2 / 1.5),
      };
      request(app)
        .get(`/reviews/aggregated/${dor[0]}/${dor[1]}`)
        .expect(OK)
        .expect((res) => {
          expect(res.body.r.ratedCharacteristics).toMatchObject(rated);
        })
        .end(done);
    });
  });

  describe('GET /reviews/aggregated/:long/:lat', () => {
    it('should return the new accurate review after updating old reviews', (done) => {
      const {
        westWall
      } = coords;
      const rated = {
        parking: 2,
        publicTransport: 2,
        noise: 2,
        commercialServices: 2,
        upkeep: 2,
        generalRating: 2,
      };
      request(app)
        .get(`/reviews/aggregated/${westWall[0]}/${westWall[1]}`)
        .expect(OK)
        .expect((res) => {
          expect(res.body.r.ratedCharacteristics).toMatchObject(rated);
          expect(res.body.r.numberOfRaters).toEqual(2);
        })
        .end(done);
    });
  });


  describe('DELETE /reviews', () => {
    it('should not delete review - apartment doesn\'t review', (done) => {
      const id = new ObjectID().toHexString();

      request(app)
        .delete(`/reviews/${id}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(UNAUTHORIZED)
        .end(done);
    }).timeout(5000);

    it('should not delete review - user did not give the review', (done) => {
      const id = reviews[0]._id.toHexString();

      request(app)
        .delete(`/reviews/${id}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(UNAUTHORIZED)
        .end(done);
    }).timeout(5000);

    it('should delete review from user and DB', (done) => {
      const id = reviews[1]._id.toHexString();

      request(app)
        .delete(`/reviews/${id}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const counter = await Review.count({
              _id: id
            });
            const user = await User.findById(users[1]._id);
            expect(counter).toBe(0);
            expect(user.isReviewOwner(id)).toBe(false);

            return done();
          } catch (e) {
            return done(e);
          }
        });
    }).timeout(5000);
  });

  describe('#GET /apartments/:id/groups', () => {
    it('should return the groups of the apartment', (done) => {
      const apartmentId = apartments[2]._id.toHexString();
      request(app)
        .get(`/apartments/${apartmentId}/groups`)
        .expect(OK)
        .expect((res) => {
          expect(res.body.groups.length).toBe(3);
          expect(res.body.groups[0].members[0].id).toBe(apartments[2].groups[0].members[0].id.toHexString());
          expect(res.body.groups[1].members[0].id).toBe(apartments[2].groups[1].members[0].id.toHexString());
        })
        .end(done);
    });
    it('should return an error when apartment does not exist', (done) => {
      const apartmentId = new ObjectID().toHexString();
      request(app)
        .get(`/apartments/${apartmentId}/groups`)
        .expect(BAD_REQUEST)
        .end(done);
    });
  });

  describe('#POST /apartments/:id/groups', () => {
    it('should add a new group when sending all group members', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const id = [users[0]._id.toHexString(), users[1]._id.toHexString()];
      request(app)
        .post(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id })
        .expect(OK)
        .end(async (error) => {
          if (error) {
            return done(error);
          }

          try {
            const apartment = await Apartment.findById(apartmentId);
            expect(apartment.groups.length).toBe(1);
            expect(apartment.groups[0].members.length).toBe(2);
            expect(apartment.groups[0].members[0].id.toHexString()).toBe(id[0]);
            expect(apartment.groups[0].members[1].id.toHexString()).toBe(id[1]);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });
    it('should create a new best group when sending a single member', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const id = users[1]._id.toHexString();
      request(app)
        .post(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id })
        .expect(OK)
        .end(async (error) => {
          if (error) {
            return done(error);
          }

          try {
            const apartment = await Apartment.findById(apartmentId);
            expect(apartment.groups.length).toBe(1);
            expect(apartment.groups[0].members.length).toBe(2);
            expect(apartment.groups[0].members[0].id.toHexString()).toBe(users[0]._id.toHexString());
            expect(apartment.groups[0].members[1].id.toHexString()).toBe(users[1]._id.toHexString());
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });
    it('should add a group with \'pending\' status', (done) => {
      const apartmentId = apartments[1]._id.toHexString();
      const id = [users[1]._id.toHexString()];
      request(app)
        .post(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({ id })
        .expect(OK)
        .end(async (error) => {
          if (error) {
            return done(error);
          }

          try {
            const apartment = await Apartment.findById(apartmentId);
            expect(apartment.groups.length).toBe(1);
            expect(apartment.groups[0].status).toBe(groupStatus.PENDING);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });

    it('should fail to add a group when not enough members', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const id = [users[0]._id.toHexString()];
      request(app)
        .post(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id })
        .expect(BAD_REQUEST)
        .end(async (error) => {
          if (error) {
            return done(error);
          }

          try {
            const apartment = await Apartment.findById(apartmentId);
            expect(apartment.groups.length).toBe(0);
            return done();
          } catch (e) {
            return done(e);
          }
        });
    });
    it('should fail when sending invalid id in list', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const id = [users[0]._id.toHexString(), '123456789'];
      request(app)
        .post(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id })
        .expect(BAD_REQUEST)
        .end(done);
    });
    it('should fail when sending invalid id as string', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const id = '123456789';
      request(app)
        .post(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id })
        .expect(BAD_REQUEST)
        .end(done);
    });
    it('should fail if sending non existing user', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const id = new ObjectID().toHexString();
      request(app)
        .post(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id })
        .expect(BAD_REQUEST)
        .end(done);
    });
    it('should not add a new group when not authenticated', (done) => {
      const apartmentId = apartments[0]._id.toHexString();
      const id = [users[0]._id.toHexString(), users[1]._id.toHexString()];
      request(app)
        .post(`/apartments/${apartmentId}/groups`)
        .send({ id })
        .expect(UNAUTHORIZED)
        .end(done);
    });
    it('should return an error when apartment does not exist', (done) => {
      const apartmentId = new ObjectID().toHexString();
      const id = users[1]._id.toHexString();
      request(app)
        .post(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id })
        .expect(BAD_REQUEST)
        .end(done);
    });
  });

  describe('#PATCH /apartments/:id/groups', () => {
    it('should updated the member\'s status', (done) => {
      const apartmentId = apartments[2]._id.toHexString();
      const groupId = apartments[2].groups[1]._id.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id: groupId, status: memberStatus.ACCEPTED })
        .expect(OK)
        .expect((res) => {
          expect((res.body.apartment.groups[1].members.find(m => m.id === (users[1]._id.toHexString()))).status).toBe(memberStatus.ACCEPTED);
        })
        .end((error) => {
          if (error) {
            return done(error);
          }
          return Apartment.findById(apartmentId)
            .then((apartment) => {
              expect((apartment.groups[1].members.find(m => m.id.equals(users[1]._id))).status).toBe(memberStatus.ACCEPTED);
              done();
            });
        });
    });
    it('should fail when member does not exist in group', (done) => {
      const apartmentId = apartments[2]._id.toHexString();
      const groupId = apartments[2].groups[0]._id.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id: groupId, status: memberStatus.ACCEPTED })
        .expect(BAD_REQUEST)
        .end(done);
    });
    it('should fail when group does not exist in apartment', (done) => {
      const apartmentId = apartments[2]._id.toHexString();
      const groupId = new ObjectID().toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id: groupId, status: memberStatus.ACCEPTED })
        .expect(BAD_REQUEST)
        .end(done);
    });
    it('should fail when apartment does not exist', (done) => {
      const apartmentId = new ObjectID().toHexString();
      const groupId = apartments[2].groups[0]._id.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/groups`)
        .set(XAUTH, users[1].tokens[0].token) // need to be authorized
        .send({ id: groupId, status: memberStatus.ACCEPTED })
        .expect(BAD_REQUEST)
        .end(done);
    });
    it('should fail when not authorized', (done) => {
      const apartmentId = apartments[2]._id.toHexString();
      const groupId = apartments[2].groups[1]._id.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/groups`)
        .send({ id: groupId, status: memberStatus.ACCEPTED })
        .expect(UNAUTHORIZED)
        .end(done);
    });
  });

  describe('#PATCH /apartments/:id/groups/sign', () => {
    it('should sign a group', (done) => {
      const apartmentId = apartments[2]._id.toHexString();
      const groupId = apartments[2].groups[2]._id.toHexString(); // all members accepted
      request(app)
        .patch(`/apartments/${apartmentId}/groups/sign`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({ id: groupId })
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartment.groups[2].status).toBe(groupStatus.COMPLETED);
        })
        .end((error) => {
          if (error) {
            return done(error);
          }

          return Apartment.findById(apartmentId)
            .then((apartment) => {
              expect(apartment.groups[2].status).toBe(groupStatus.COMPLETED);
              done();
            });
        });
    });
    it('should not sign a group when not all members accepted', (done) => {
      const apartmentId = apartments[2]._id.toHexString();
      const groupId = apartments[2].groups[0]._id.toHexString(); // not all members accepted here
      request(app)
        .patch(`/apartments/${apartmentId}/groups/sign`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({ id: groupId })
        .expect(BAD_REQUEST)
        .end(done);
    });
    it('should not sign a group by not the apartment\'s owner', (done) => {
      const apartmentId = apartments[2]._id.toHexString();
      const groupId = apartments[2].groups[2]._id.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/groups/sign`)
        .set(XAUTH, users[0].tokens[0].token)
        .send({ id: groupId })
        .expect(BAD_REQUEST)
        .end(done);
    });
    it('should not sign a group when not authorized', (done) => {
      const apartmentId = apartments[2]._id.toHexString();
      const groupId = apartments[2].groups[2]._id.toHexString();
      request(app)
        .patch(`/apartments/${apartmentId}/groups/sign`)
        .send({ id: groupId })
        .expect(UNAUTHORIZED)
        .end(done);
    });
    it('should not sign a group when group does not exist', (done) => {
      const apartmentId = apartments[2]._id.toHexString();
      const groupId = new ObjectID().toHexString(); // fake object id
      request(app)
        .patch(`/apartments/${apartmentId}/groups/sign`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({ id: groupId })
        .expect(BAD_REQUEST)
        .end(done);
    });
    it('should not sign a group when apartment does not exist', (done) => {
      const apartmentId = new ObjectID().toHexString(); // fake object id
      const groupId = apartments[2].groups[2]._id.toHexString(); // not all members accepted here
      request(app)
        .patch(`/apartments/${apartmentId}/groups/sign`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({ id: groupId })
        .expect(BAD_REQUEST)
        .end(done);
    });
  });

  describe('#GET *', () => {
    it('should return 404 on invalid route requests', (done) => {
      request(app)
        .get('/bad/path')
        .expect(NOT_FOUND)
        .end(done);
    });
  });
});