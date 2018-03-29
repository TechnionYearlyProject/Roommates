const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

require('../../server/server');
const { Apartment } = require('../../server/models/apartment');
const { User } = require('../../server/models/user');
const { XAUTH } = require('../../server/constants');

const user1Id = new ObjectID();
const user2Id = new ObjectID();
const user3Id = new ObjectID();
const user4Id = new ObjectID();
const user5Id = new ObjectID();
const user6Id = new ObjectID();

const apartment1Id = new ObjectID();
const apartment2Id = new ObjectID();

const apartment1 = new Apartment({
    _id: apartment1Id,
    title: 'Apartment 1',
    _createdBy: new ObjectID(),
    createdAt: Date.now(),
    price: 2000,
    _interested: [user1Id.toHexString(), user2Id.toHexString(), user3Id.toHexString()],
    enteranceDate: new Date('1-1-2018').getTime(),
    location: {
        address: {
            state: 'israel',
            city: 'haifa',
            street: 'gilboa',
            number: 35
            //apartmentNumber:
        },
        geolocation: [35.0164783, 32.7831797]
    },
    numberOfRooms: 4,
    floor: 2,
    totalFloors: 4,
    //area:
    //images:
    //description:
    //tags:
    requiredNumberOfRoommates: 2,
    currentlyNumberOfRoommates: 1
    //comments
});

const apartment2 = new Apartment({
    _id: apartment2Id,
    title: 'Apartment 2',
    _createdBy: new ObjectID(),
    createdAt: Date.now(),
    price: 1000,
    //_interested:
    enteranceDate: new Date('12-29-2019').getTime(),
    location: {
        address: {
            state: 'israel',
            city: 'Tel-Aviv',
            street: 'Rothschild',
            number: 23
            //apartmentNumber:
        },
        geolocation: [34.775313, 32.065887]
    },
    numberOfRooms: 3,
    floor: 1,
    totalFloors: 5,
    //area:
    //images:
    //description:
    tags: [1, 8],
    requiredNumberOfRoommates: 1,
    currentlyNumberOfRoommates: 2,
    //comments
});

const notPublishedApartment = {
    title: 'Not published Apartment',
    address: {
        state: 'israel',
        city: 'haifa',
        street: 'ben zvi',
        number: 1
    },
    price: 2000,
    enteranceDate: new Date('1-1-2018').getTime(),
    description: 'notPublishedApartment',
    requiredNumberOfRoommates: 1,
    currentlyNumberOfRoommates: 0,
    numberOfRooms: 2,
    floor: 2,
    totalFloors: 3,
    area: 100,
};

const user1 = {
    _id: user1Id,
    email: 'user1@gmail.com',
    password: '123456',
    isVerified: true,
    firstName: 'user1_firstName',
    lastName: 'user1_lastName',
    birthdate: new Date('1992-06-24').getTime(),
    gender: 'male',
    mobilePhone: '',
    image: '',
    about: '',
    hobbies: [1, 2, 3]
};

const user2 = {
    _id: user2Id,
    email: 'user2@gmail.com',
    password: '654321',
    firstName: 'user2_firstName',
    lastName: 'user2_lastName',
    birthdate: new Date('1995-04-17').getTime(),
    gender: 'male',
    mobilePhone: '',
    image: '',
    about: '',
    hobbies: [1, 4, 5, 6],
    _publishedApartments: [apartment1Id.toHexString()],
    _interestedApartments: [apartment2Id.toHexString()],
    tokens: [{
        access: XAUTH,
        token: jwt.sign({ _id: user2Id.toHexString(), access: XAUTH }, process.env.JWT_SECRET).toString(),
        expiration: Date.now() + 1000000
    }]
};

const user3 = {
    _id: user3Id,
    email: 'user3@gmail.com',
    password: '123456',
    firstName: 'user3_firstName',
    lastName: 'user3_lastName',
    birthdate: new Date('1992-06-24').getTime(),
    gender: 'male',
    mobilePhone: '',
    image: '',
    about: '',
    hobbies: [7, 8, 9]
};

const user4 = {
    _id: user4Id,
    email: 'user4@gmail.com',
    password: '123456',
    firstName: 'user4_firstName',
    lastName: 'user4_lastName',
    birthdate: new Date('1992-06-24').getTime(),
    gender: 'male',
    mobilePhone: '0541234567',
    about: 'I\'m user number 4',
    _publishedApartments: [],
    _interestedApartments: [],
    image: '',
    hobbies: [4, 5, 7]
};

const user5 = {
    _id: user5Id,
    email: 'user5@gmail.com',
    password: '123456',
    firstName: 'user5_firstName',
    lastName: 'user5_lastName',
    birthdate: new Date('1992-06-24').getTime(),
    mobilePhone: '',
    image: '',
    about: '',
    gender: 'female',
    _publishedApartments: [],
    _interestedApartments: []
};

const user6 = {
    _id: user6Id,
    email: 'user6@gmail.com',
    password: '123456',
    firstName: 'user6_firstName',
    lastName: 'user6_lastName',
    birthdate: new Date('1992-06-24').getTime(),
    mobilePhone: '',
    image: '',
    about: '',
    gender: 'male',
    _publishedApartments: [apartment1Id.toHexString(), apartment2Id.toHexString()],
    _interestedApartments: [apartment1Id.toHexString()]
};

const notRegisteredUser = {
    email: 'alon@gmail.com',
    password: '123456',
    firstName: 'Alon',
    lastName: 'Talmor',
    birthdate: new Date('1992-06-24').getTime(),
    gender: 'male'
};


const apartments = [
    apartment1,
    apartment2
];

const users = [
    user1,
    user2,
    user3,
    user4,
    user5,
    user6
];

const coords = {
    andalusiaSpain: [-3.222444, 37.916345],
    technionIsrael: [35.020568, 32.776515]
};

const populateUsers = (done) => {
    User.remove({})
        .then(() =>
            Promise.all([
                new User(users[0]).save(),
                new User(users[1]).save(),
                new User(users[2]).save(),
                new User(users[3]).save(),
                new User(users[4]).save(),
                new User(users[5]).save()
            ]))
        .then(() => done())
        .catch(done);
};

const populateApartments = (done) => {
    Apartment.remove({})
        .then(() => Apartment.insertMany(apartments))
        .then(() => done())
        .catch(done);
};

module.exports = {
    apartments,
    users,
    coords,
    populateApartments,
    populateUsers,
    notPublishedApartment,
    notRegisteredUser
};