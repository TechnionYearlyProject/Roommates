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

const user1 = {
    email: 'user1@gmail.com',
    password: '123456',
    firstName: 'user1_firstName',
    lastName: 'user1_lastName',
    birthdate: '1992-06-24',
    gender: 'male',
    hobbies: [1,2,3]
};

const user2 = {
    email: 'user2@gmail.com',
    password: '123456',
    firstName: 'user2_firstName',
    lastName: 'user2_lastName',
    birthdate: '1992-06-24',
    gender: 'male',
    hobbies: [4,5,6]
};

const user3 = {
    email: 'user3@gmail.com',
    password: '123456',
    firstName: 'user3_firstName',
    lastName: 'user3_lastName',
    birthdate: '1992-06-24',
    gender: 'male',
    hobbies: [7,8,9]
};

const user4 = {
    email: 'user4@gmail.com',
    password: '123456',
    firstName: 'user4_firstName',
    lastName: 'user4_lastName',
    birthdate: '1992-06-24',
    gender: 'male',
    hobbies: [4,5,7]
};

const user5 = {
    email: 'user5@gmail.com',
    password: '123456',
    firstName: 'user5_firstName',
    lastName: 'user5_lastName',
    birthdate: '1992-06-24',
    gender: 'female'
};

const user6 = {
    email: 'user6@gmail.com',
    password: '123456',
    firstName: 'user6_firstName',
    lastName: 'user6_lastName',
    birthdate: '1992-06-24',
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

var populatedUsers = [];

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            populatedUsers[0] =  new User(users[0]);
            populatedUsers[1] =  new User(users[1]);
            populatedUsers[2] =  new User(users[2]);
            populatedUsers[3] =  new User(users[3]);
            populatedUsers[4] =  new User(users[4]);
            populatedUsers[5] =  new User(users[5]);
            return Promise.all([populatedUsers[0].save(), 
                                populatedUsers[1].save(),
                                populatedUsers[2].save(),
                                populatedUsers[3].save(),
                                populatedUsers[4].save(),
                                populatedUsers[5].save()
            ]);
        })
        .then(() => done())
        .catch(done);
};

const populateApartments = (done) => {
    apartment1._interested.push( populatedUsers[0]._id);
    apartment1._interested.push( populatedUsers[1]._id);
    apartment1._interested.push( populatedUsers[2]._id);
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
    populatedUsers
};