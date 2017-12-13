const expect = require('expect');
const request = require('supertest');
const { OK, BAD_REQUEST, UNAUTHORIZED } = require('http-status');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { app } = require('../../server/server');
const { XAUTH } = require('../../server/constants');
const { User } = require('../../server/models/user');
const { Apartment } = require('../../server/models/apartment');
const { apartments, users, populateApartments, populateUsers } = require('../seed/seed');

describe('Server Tests', () => {

  beforeEach(populateUsers);
  beforeEach(populateApartments);

  describe('POST /apartments', () => {
    it('should create a new apartment', (done) => {
      const apartment = {
        address: {
          state: 'israel',
          city: 'haifa',
          street: 'ben zvi',
          number: 1
        },
        price: 2000,
        enteranceDate: '1-1-2018',
        description: 'This is a great price. only for this test !!',
        requiredNumberOfRoommates: 1,
        currentlyNumberOfRoomates: 0,
        numberOfRooms: 2,
        floor: 2,
        totalFloors: 3,
        area: 100,
      };

      request(app)
        .post('/apartments')
        .set(XAUTH, users[1].tokens[0].token)
        .send(apartment)
        .expect(OK)
        .expect((res) => {
          expect(res.body.apartment.location.address).toMatchObject(apartment.address);
          expect(res.body.apartment.price).toBe(apartment.price);
          expect(res.body.apartment.enteranceDate).toBe(new Date(apartment.enteranceDate).toJSON());
          expect(res.body.apartment.description).toBe(apartment.description);
          expect(res.body.apartment.requiredNumberOfRoommates).toBe(apartment.requiredNumberOfRoommates);
          expect(res.body.apartment.currentlyNumberOfRoomates).toBe(apartment.currentlyNumberOfRoomates);
          expect(res.body.apartment.numberOfRooms).toBe(apartment.numberOfRooms);
          expect(res.body.apartment.floor).toBe(apartment.floor);
          expect(res.body.apartment.totalFloors).toBe(apartment.totalFloors);
          expect(res.body.apartment.area).toBe(apartment.area);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
         Apartment.find({ description: apartment.description }).then((a) => {      
            expect(a[0]._createdBy).toEqual(users[1]._id);
            expect(a[0].createdAt).toBeTruthy();
            expect(a[0].price).toBe(apartment.price);
            expect(a[0].enteranceDate).toEqual(new Date(apartment.enteranceDate));
            expect(a[0].description).toBe(apartment.description);
            expect(a[0].requiredNumberOfRoommates).toBe(apartment.requiredNumberOfRoommates);
            expect(a[0].currentlyNumberOfRoomates).toBe(apartment.currentlyNumberOfRoomates);
            expect(a[0].numberOfRooms).toBe(apartment.numberOfRooms);
            expect(a[0].floor).toBe(apartment.floor);
            expect(a[0].totalFloors).toBe(apartment.totalFloors);
            expect(a[0].area).toBe(apartment.area);
            expect(a[0].location.address).toMatchObject(apartment.address);            
            expect(a[0].location.geolocation).not.toEqual([0, 0]);
            expect(a[0].comments.length).toBe(0);
            expect(a[0].tags.length).toEqual(0);
            expect(a[0]._interested.length).toEqual(0);
            done();
          }).catch((e) => done(e));
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
          .end((err, res) => {
              if (err) {
                  return done(err);
              }

              Apartment.find({ description: apartment.description }).then((apartments) => {
                  expect(apartments.length).toBe(0);
                  done();
              }).catch((e) => done(e));
          })
  });
  });

  describe('#POST /users', () => {

    it('should register a new user', (done) => {
      const user = {
        email: 'alon@gmail.com',
        password: '123456',
        firstName: 'Alon',
        lastName: 'Talmor',
        birthdate: '1992-06-24',
        gender: 'male'
      };
      const expectedRes = _.pick(user, ['email', 'firstName', 'lastName', 'gender']);

      request(app)
        .post('/users')
        .send(user)
        .expect(OK)
        .expect((res) => {

          expect(res.headers[XAUTH]).toBeTruthy();
          expect(res.body.user).toMatchObject(expectedRes);
          expect(res.body.user.birthdate).toBe(new Date(user.birthdate).toJSON());
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          User.findOne({ email: user.email }).then((savedUser) => {
            expect(savedUser).toBeTruthy();
            expect(savedUser._id).toBeTruthy();
            expect(savedUser.toObject()).toMatchObject(expectedRes);
            expect(savedUser.birthdate).toMatchObject(new Date(user.birthdate));
            done();
          }).catch((err) => done(err));
        });
    });


    it('should register a new user without last name', (done) => {
      const user = {
        email: 'alon@gmail.com',
        password: '123456',
        firstName: 'Alon',
        birthdate: '1992-06-24',
        gender: 'male'
      };
      const expectedRes = _.pick(user, ['email', 'firstName', 'gender']);

      request(app)
        .post('/users')
        .send(user)
        .expect(OK)
        .expect((res) => {

          expect(res.headers[XAUTH]).toBeTruthy();
          expect(res.body.user).toMatchObject(expectedRes);
          expect(res.body.user.birthdate).toBe(new Date(user.birthdate).toJSON());
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          User.findOne({ email: user.email }).then((savedUser) => {
            expect(savedUser).toBeTruthy();
            expect(savedUser._id).toBeTruthy();
            expect(savedUser.toObject()).toMatchObject(expectedRes);
            expect(savedUser.birthdate).toMatchObject(new Date(user.birthdate));
            done();
          }).catch((err) => done(err));
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
      const user = {
        email: 'alongmail.com',
        password: '123456',
        firstName: 'Alon',
        lastName: 'Talmor',
        birthdate: '1992-06-24',
        gender: 'male'
      };

      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user without email', (done) => {
      const user = {
        password: '123456',
        firstName: 'Alon',
        lastName: 'Talmor',
        birthdate: '1992-06-24',
        gender: 'male'
      };

      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user with invalid password', (done) => {
      const user = {
        email: 'alon@gmail.com',
        password: '12345', //password is too short
        firstName: 'Alon',
        lastName: 'Talmor',
        birthdate: '1992-06-24',
        gender: 'male'
      };

      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user without password', (done) => {
      const user = {
        email: 'alon@gmail.com',
        firstName: 'Alon',
        lastName: 'Talmor',
        birthdate: '1992-06-24',
        gender: 'male'
      };

      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user with invalid firstName', (done) => {
      const user = {
        email: 'alon@gmail.com',
        password: '123456',
        firstName: 'A', //first name is too short
        lastName: 'Talmor',
        birthdate: '1992-06-24',
        gender: 'male'
      };

      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user without firstName', (done) => {
      const user = {
        email: 'alon@gmail.com',
        password: '123456',
        lastName: 'Talmor',
        birthdate: '1992-06-24',
        gender: 'male'
      };

      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user with invalid birthdate', (done) => {
      const user = {
        email: 'alon@gmail.com',
        password: '123456',
        firstName: 'Alon',
        lastName: 'Talmor',
        birthdate: '1992-06-00',
        gender: 'male'
      };

      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user without birthdate', (done) => {
      const user = {
        email: 'alon@gmail.com',
        password: '123456',
        firstName: 'Alon',
        lastName: 'Talmor',
        gender: 'male'
      };

      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user with invalid gender', (done) => {
      const user = {
        email: 'alon@gmail.com',
        password: '123456',
        firstName: 'Alon',
        lastName: 'Talmor',
        birthdate: '1992-06-00',
        gender: 'notReal'
      };

      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should not register a user without gender', (done) => {
      const user = {
        email: 'alon@gmail.com',
        password: '123456',
        firstName: 'Alon',
        lastName: 'Talmor',
        birthdate: '1992-06-00',
      };

      request(app)
        .post('/users')
        .send(users[0])
        .expect(BAD_REQUEST)
        .expect((res) => {
          expect(res.headers[XAUTH]).toBeFalsy();
        })
        .end(done);
    });

    it('should encrypt password', (done) => {
      const user = {
        email: 'alon@gmail.com',
        password: '123456',
        firstName: 'Alon',
        lastName: 'Talmor',
        birthdate: '1992-06-24',
        gender: 'male'
      };

      request(app)
        .post('/users')
        .send(user)
        .expect(OK)
        .end((err) => {
          if (err) {
            return done(err);
          }

          User.findOne({ email: user.email }).then((savedUser) => {
            expect(savedUser.password).toBeTruthy();
            expect(savedUser.password).not.toBe(user.password);
            done();
          }).catch((err) => done(err));
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
          User.findOne({ email: users[0].email }).then((user) => {
            expect(user.toObject().tokens[0]).toMatchObject({
              access: XAUTH,
              token: res.headers[XAUTH]
            });
            done();
          }).catch((err) => done(err));
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
          password: users[0].password + '2'
        })
        .expect(BAD_REQUEST)
        .expect((res) => expect(res.headers[XAUTH]).toBeFalsy())
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.findOne({ email: users[0].email }).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((err) => done(err));;
        });
    });

  });
});