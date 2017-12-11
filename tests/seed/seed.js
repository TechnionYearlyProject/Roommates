const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { app } = require('../../server/server');
const { Apartment } = require('../../server/models/apartment');
const { User } = require('../../server/models/user');
const { XAUTH } = require('../../server/constants');

const apartment1 = new Apartment({
    _createdBy: new ObjectID(),
    createdAt: new Date(),
    price: 1000,
    //_interested:
    enteranceDate: new Date(),
    location: {
        address: {
            state: "israel",
            city: "Haifa",
            street: "Gilboa",
            number: 35
            //apartmentNumber: 
        },
        geolocation: [35.016402, 32.783242]
    },
    numberOfRooms: 4,
    floor: 2,
    totalFloors: 4,
    //area: 
    //images: 
    //description: 
    //tags: 
    requiredNumberOfRoommates: 2,
    currentlyNumberOfRoomates: 1
    //comments
});

const apartment2 = new Apartment({
    _createdBy: new ObjectID(),
    createdAt: new Date(),
    price: 1000,
    //_interested:
    enteranceDate: new Date(),
    location: {
        address: {
            state: "israel",
            city: "Tel-Aviv",
            street: "Rothschild",
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
    //tags: 
    requiredNumberOfRoommates: 1,
    currentlyNumberOfRoomates: 1
    //comments
});

const user1Id = new ObjectID();
const user2Id= new ObjectID();

const user1 = {
    _id: user1Id,
    email: 'user1@gmail.com',
    password: '123456',
    firstName: 'user1_firstName',
    lastName: 'user1_lastName',
    birthdate: '1992-06-24',
    gender: 'male'
};

const user2 = {
    _id: user2Id,
    email: 'user2@gmail.com',
    password: '654321',
    firstName: 'user2_firstName',
    lastName: 'user2_lastName',
    birthdate: '1995-04-17',
    gender: 'male',
    tokens: [{
        access: XAUTH,
        token: jwt.sign({ _id: user2Id.toHexString(), access: XAUTH }, process.env.JWT_SECRET).toString()
      }]
};


const apartments = [
    apartment1,
    apartment2
];

const users = [
    user1,
    user2
];

const coords = {
    andalusiaSpain: [-3.222444, 37.916345],
    technionIsrael: [35.020568, 32.776515]
};


const populateApartments = (done) => {
    Apartment.remove({})
        .then(() => Apartment.insertMany(apartments))
        .then(() => done())
        .catch(done);
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            const user1 = new User(users[0]).save();
            const user2 = new User(users[1]).save();
    
            return Promise.all([user1, user2]);
        })
        .then(() => done())
        .catch(done);
};

module.exports = {
    apartments,
    users,
    coords,
    populateApartments,
    populateUsers
};