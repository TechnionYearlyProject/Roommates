const { ObjectID } = require('mongodb');

const { Apartment } = require('../../server/models/apartment');
const { User } = require('../../server/models/user');

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


const apartments = [
    apartment1,
    apartment2
];

const populateApartments = (done) => {
    Apartment.remove({})
        .then(() => Apartment.insertMany(apartments))
        .then(() => done())
        .catch(done);
};

const user1 = {
    email: 'user1@gmail.com',
    password: '123456',
    firstName: 'user1_firstName',
    lastName: 'user1_lastName',
    birthdate: '1992-06-24',
    gender: 'male'
};

const users = [
    user1
];

const coords = {
    andalusiaSpain: [-3.222444, 37.916345],
    technionIsrael: [35.020568, 32.776515]
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => User.insertMany(users))
        .then(() => done())
        .catch(done);
};

module.exports = {
    apartments,
    populateApartments,
    users,
    populateUsers,
    coords
};