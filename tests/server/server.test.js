const expect = require('expect');
const request = require('supertest');
const { OK, BAD_REQUEST } = require('http-status');
const _ = require('lodash');

const { app } = require('../../server/server');
const { users, populateApartments, populateUsers } = require('../seed/seed');
const { XAUTH } = require('../../server/constants');
const { User } = require('../../server/models/user');

describe('Server Tests', () => {

    beforeEach(populateUsers);
    beforeEach(populateApartments);

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
                    expect(res.body).toMatchObject(expectedRes);
                    expect(res.body.birthdate).toBe(new Date(user.birthdate).toJSON());
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
                    expect(res.body).toMatchObject(expectedRes);
                    expect(res.body.birthdate).toBe(new Date(user.birthdate).toJSON());
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

});

//it('should fail', () => {
//     throw new Error('it should fail');
// });