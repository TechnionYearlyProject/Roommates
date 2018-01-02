const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
// const sleep = require('system-sleep');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND
} = require('http-status');

const { app } = require('../../server/server');
const { XAUTH } = require('../../server/constants');
const { User } = require('../../server/models/user');
const { Apartment } = require('../../server/models/apartment');
const { getSupportedTags } = require('../../server/models/tag');
const { getSupportedHobbies } = require('../../server/models/hobbie');

const {
  apartments,
  users,
  populateApartments,
  populateUsers,
  notPublishedApartment,
  notRegisteredUser
} = require('../seed/seed');

describe('Server Tests', () => {
  beforeEach(populateUsers);
  beforeEach(populateApartments);
  // beforeEach((done) => {
  //   sleep(1.5 * 1000); //sleep 1.5 sec between queries for google map - we can't send too many requests in one second.
  //   done();
  // });

  describe('POST /apartments', () => {
    it('should create a new apartment', (done) => {
      const apartment = Object.assign({}, notPublishedApartment);

      request(app)
        .post('/apartments')
        .set(XAUTH, users[1].tokens[0].token)
        .send(notPublishedApartment)
        .expect(OK)
        .expect((res) => {
          apartment.location = { address: apartment.address };
          delete apartment.address;

          expect(res.body.apartment).toMatchObject(apartment);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }
          return Apartment.find({ description: notPublishedApartment.description })
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
            const apartment = await Apartment.findOne({ description: notPublishedApartment.description });
            expect(user._publishedApartments[0]).toEqual(apartments[0]._id);
            expect(user._publishedApartments[1]).toEqual(apartment._id);
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

          return Apartment.find({ description: apartment.description })
            .then((result) => {
              expect(result.length).toBe(0);
              done();
            }).catch((e) => done(e));
        });
    });

    it('should not create apartment with invalid tag ', (done) => {
      var apartment = JSON.parse(JSON.stringify(notPublishedApartment));
      apartment.tags = [0];
      request(app)
        .post('/apartments')
        .set(XAUTH, users[1].tokens[0].token)
        .send(apartment)
        .expect(BAD_REQUEST)
        .end((err) => {
          if (err) {
            return done(err);
          }

          return Apartment.find({ description: apartment._id })
            .then((result) => {
              expect(result.length).toBe(0);
              done();
            }).catch((e) => done(e));
        });
    });

    it('should create apartment with valid tag ', (done) => {
      const validTagId = getSupportedTags()[0]._id;
      var apartment = JSON.parse(JSON.stringify(notPublishedApartment));
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
            const apartment = await Apartment.findOne({ description: notPublishedApartment.description });
            expect(user._publishedApartments[0]).toEqual(apartments[0]._id);
            expect(user._publishedApartments[1]).toEqual(apartment._id);
            return done();
          } catch (e) {
            return done(e);
          }
        });         
    });
  });

describe('PUT /apartments/:id/comment', () => {
    it('should add a new comment', (done) => {
      const id = apartments[1]._id;
      const text = "Nice apartment!";
      request(app)
        .put(`/apartments/${id}/comment`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({text})
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
      const text = "";
      request(app)
        .put(`/apartments/${id}/comment`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({text})
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not add comment - unregistered user', (done) => {
      const id = apartments[1]._id;
      const text = "Wow! Great apartment!";
      request(app)
        .put(`/apartments/${id}/comment`)
        .send({text})
        .expect(UNAUTHORIZED)
        .end(done);
    });

    it('should not add comment for invalid apartment', (done) => {
      const id = new ObjectID();
      const text = "Wow! Great apartment!";
      request(app)
        .put(`/apartments/${id}/comment`)
        .set(XAUTH, users[1].tokens[0].token)
        .send({text})
        .expect(NOT_FOUND)
        .end(done);
    });


  });

  describe('DELETE /apartments', () => {
    it('should not delete aprtment - apartment doesnt exist', (done) => {

      const id = new ObjectID().toHexString();

      request(app)
        .delete(`/apartments/${id}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(UNAUTHORIZED)
        .end(done);
    }).timeout(5000);

    it('should not delete aprtment - user does not own the apartment', (done) => {
      const id = apartments[1]._id.toHexString();;

      request(app)
        .delete(`/apartments/${id}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(UNAUTHORIZED)
        .end(done);
    }).timeout(5000);

    it('should delete aprtment from user and DB', (done) => {
      const id = apartments[0]._id.toHexString();;

      request(app)
        .delete(`/apartments/${id}`)
        .set(XAUTH, users[1].tokens[0].token)
        .expect(OK)
        .end(async (err) => {
          if (err) {
            return done(err);
          }

          try {
            const counter = await Apartment.count({_id: id});
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

  describe('GET /apartments/tags', () => {
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
        .query({ id })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(1);
          expect(res.body.results[0]._id).toBe(id);
        })
        .end(done);
    });

    it('should not find apartment with invalid id', (done) => {
      const id = '12345';

      request(app)
        .get('/apartments')
        .query({ id })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not find apartment with nonexistent id', (done) => {
      const id = new ObjectID().toHexString();

      request(app)
        .get('/apartments')
        .query({ id })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(0);
        })
        .end(done);
    });

    it('should find apartment by owner\'s id', (done) => {
      const createdBy = apartments[1]._createdBy.toHexString();

      request(app)
        .get('/apartments')
        .query({ createdBy })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(1);
          expect(res.body.results[0]._createdBy).toBe(createdBy);
        })
        .end(done);
    });

    it('should not find apartment with invalid owner\'s id', (done) => {
      const createdBy = '12345';

      request(app)
        .get('/apartments')
        .query({ createdBy })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not find apartment with nonexistent owner\'s id', (done) => {
      const createdBy = new ObjectID().toHexString();

      request(app)
        .get('/apartments')
        .query({ createdBy })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(0);
        })
        .end(done);
    });

    it('should find apartment in price range', (done) => {
      const fromPrice = apartments[1].price - 10;
      const toPrice = apartments[1].price + 10;

      request(app)
        .get('/apartments')
        .query({ fromPrice, toPrice })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(1);
          expect(res.body.results[0].price).toBe(apartments[1].price);
        })
        .end(done);
    });

    it('should not find apartment in invalid price range', (done) => {
      const fromPrice = 100;
      const toPrice = 200;

      request(app)
        .get('/apartments')
        .query({ fromPrice, toPrice })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(0);
        })
        .end(done);
    });

    it('should find apartment due enterance date', (done) => {
      const untilEnteranceDate = apartments[0].enteranceDate;
      request(app)
        .get('/apartments')
        .query({ untilEnteranceDate })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(1);
          expect(res.body.results[0].enteranceDate).toBeLessThanOrEqual(apartments[0].enteranceDate);
        })
        .end(done);
    });

    it('should not find apartment due invalid enterance date', (done) => {
      const untilEnteranceDate = new Date('1-1-2017').getTime();

      request(app)
        .get('/apartments')
        .query({ untilEnteranceDate })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(0);
        })
        .end(done);
    });

    it('should find apartment by address', (done) => {
      const address = apartments[0].getAddressString();

      request(app)
        .get('/apartments')
        .query({ address })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(1);
          //expect(res.body.results[0].location.geolocation).toEqual(apartments[0].location.geolocation);
          expect(res.body.results[0].location.address).toEqual(apartments[0].location.address);
        })
        .end(done);
    });

    it('should not find apartment by invalid address', (done) => {
      const address = 'antartica';

      request(app)
        .get('/apartments')
        .query({ address })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(0);
        })
        .end(done);
    });

    it('should find apartments in radius', (done) => {
      const address = 'Technion israel';
      const radius = 3;
      request(app)
        .get('/apartments')
        .query({ address, radius })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(1);
          //expect(res.body.results[0].location.geolocation).toEqual(apartments[0].location.geolocation);
          expect(res.body.results[0].location.address).toEqual(apartments[0].location.address);
        })
        .end(done);
    }).timeout(5000);

    it('should find apartment by total number of roommates', (done) => {
      const roommatesNumber = apartments[1].currentlyNumberOfRoomates;

      request(app)
        .get('/apartments')
        .query({ roommatesNumber })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(1);
          expect(res.body.results[0].currentlyNumberOfRoomates).toBe(roommatesNumber);
        })
        .end(done);
    });
    it('should not find apartment with invalid number of roommates', (done) => {
      const roommatesNumber = 11;

      request(app)
        .get('/apartments')
        .query({ roommatesNumber })
        .expect(OK)
        .expect((res) => {
          expect(res.body.results.length).toBe(0);
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
          expect(res.headers[XAUTH]).toBeTruthy();
          expect(res.body.user).toMatchObject(User.toJSON(notRegisteredUser));
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          return User.findOne({ email: notRegisteredUser.email })
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

          return User.findOne({ email: user.email })
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

          return User.findOne({ email: notRegisteredUser.email })
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
          return User.findOne({ email: users[0].email })
            .then((user) => {
              expect(user.toObject().tokens[0]).toMatchObject({
                access: XAUTH,
                token: res.headers[XAUTH]
              });
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
          return User.findOne({ email: users[0].email }).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((errr) => done(errr));
        });
    });
  });

  describe('GET /users/tags', () => {
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
          expect(res.body.self).toEqual(User.toJSON(users[1]));
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
        .end(done);
    });
  });

  describe('#GET /users/:id', () => {
    it('should find existing user by id', (done) => {
      const id = users[1]._id.toHexString();

      request(app)
        .get(`/users/${id}`)
        .expect(OK)
        .expect((res) => {
          expect(res.body.user).toEqual(User.toJSON(users[1]));
        })
        .end(done);
    });

    it('should not find user with invalid id', (done) => {
      const id = '1234';

      request(app)
        .get(`/users/${id}`)
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not find nonexistent user', (done) => {
      const id = new ObjectID();

      request(app)
        .get(`/users/${id}`)
        .expect(NOT_FOUND)
        .end(done);
    });
  });

  describe('PATCH /users/self', () => {
    it('should update user', (done) => {
      const user = Object.assign({}, users[3]);
      user.email = users[1].email;

      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send(users[3])
        .expect(OK)
        .expect((res) => {
          expect(res.body.user).toEqual(User.toJSON(user));
        })
        .end((err) => {
          if (err) {
            return done(err);
          }
          return User.findById(users[1]._id.toHexString())
            .then($ => {
              expect($.toObject()).toMatchObject(User.toJSON(user));
              done();
            })
            .catch(done);
        });
    });

    it('should not update email', (done) => {
      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send({ email: 'user2@yahoo.com' })
        .expect(OK)
        .expect((res) => {
          expect(res.body.user).toEqual(User.toJSON(users[1]));
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
        .send({ firstName: 'A' })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not update to invalid birthdate', (done) => {
      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send({ birthdate: -2208988800001 })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not update to invalid mobile phone number', (done) => {
      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send({ mobilePhone: -123 })
        .expect(BAD_REQUEST)
        .end(done);
    });

    it('should not update to invalid gender', (done) => {
      request(app)
        .patch('/users/self')
        .set(XAUTH, users[1].tokens[0].token)
        .send({ gender: 'FakeGender' })
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


});