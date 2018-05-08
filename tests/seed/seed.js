const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

require('../../server/server');
const { Apartment } = require('../../server/models/apartment');
const { Review } = require('../../server/models/review');
const { User } = require('../../server/models/user');
const { NotificationsTypesEnum } = require('../../server/models/notification');
const { XAUTH, VERIFICATION_SECRET, FORGOT_SECRET } = require('../../server/constants');
const visit = require('../../server/models/visit');

const user1Id = new ObjectID();
const user2Id = new ObjectID();
const user3Id = new ObjectID();
const user4Id = new ObjectID();
const user5Id = new ObjectID();
const user6Id = new ObjectID();

const apartment1Id = new ObjectID();
const apartment2Id = new ObjectID();

const review1Id = new ObjectID();
const review2Id = new ObjectID();
const review3Id = new ObjectID();
const irreleventReviewId = new ObjectID();

const apartment1User1VisitId = new ObjectID();
const apartment1User2VisitId = new ObjectID();

const user1Notification1Id = new ObjectID();

const apartment1 = new Apartment({
  _id: apartment1Id,
  _createdBy: new ObjectID(),
  createdAt: Date.now(),
  price: 2000,
  _interested: [user1Id.toHexString(), user2Id.toHexString(), user3Id.toHexString()],
  entranceDate: new Date('1-1-2018').getTime(),
  location: {
    address: {
      state: 'israel',
      city: 'haifa',
      street: 'gilboa',
      number: 35
      //apartmentNumber:
    },
    geolocation: [35.0157237, 32.7825085]
  },
  numberOfRooms: 4,
  floor: 2,
  totalFloors: 4,
  //area:
  //images:
  //description:
  //tags:
  requiredRoommates: 2,
  totalRoommates: 3,
  _notificationSubscribers: [user2Id],
  visits: [{
    _id: apartment1User1VisitId,
    _askedBy: user1Id,
    createdAt: new Date('1-1-2018').getTime(),
    scheduledTo: new Date('1-1-2019').getTime(),
    status: visit.getVisitStatusOnCreate()
  },
  {
    _id: apartment1User2VisitId,
    _askedBy: user2Id,
    createdAt: new Date('1-1-2018').getTime(),
    scheduledTo: new Date('1-1-2019').getTime(),
    status: visit.getVisitStatusOnCreate()
  }
  ],
  //comments
});

const apartment2 = new Apartment({
  _id: apartment2Id,
  _createdBy: new ObjectID(),
  createdAt: Date.now(),
  price: 1000,
  //_interested:
  entranceDate: new Date('12-29-2019').getTime(),
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
  requiredRoommates: 1,
  totalRoommates: 2,
  //comments
});

const notPublishedApartment = {
  address: {
    state: 'israel',
    city: 'haifa',
    street: 'ben zvi',
    number: 1
  },
  price: 2000,
  entranceDate: new Date('1-1-2018').getTime(),
  description: 'notPublishedApartment',
  requiredRoommates: 1,
  totalRoommates: 4,
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
  hobbies: [1, 2, 3],
  _givenReviews: [review1Id.toHexString()],
  notifications: [
    {
      _id: user1Notification1Id,
      notificationType: NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT,
      _createdBy: [new ObjectID().toHexString()],
      wasRead: false,
      _notifiedObjectsIds: [new ObjectID().toHexString()],
      createdAt: new Date().getTime()
    },
    {
      notificationType: NotificationsTypesEnum.USER_LIKED_APARTMENT,
      _createdBy: [new ObjectID().toHexString()],
      wasRead: true,
      _notifiedObjectsIds: [new ObjectID().toHexString()],
      createdAt: new Date().getTime()
    },
    {
      notificationType: NotificationsTypesEnum.APARTMENT_WAS_MODIFIED,
      _createdBy: [new ObjectID().toHexString()],
      wasRead: false,
      _notifiedObjectsIds: [new ObjectID().toHexString()],
      createdAt: new Date().getTime()
    },
  ],
};

const user2 = {
  _id: user2Id,
  email: 'user2@gmail.com',
  password: '654321',
  isVerified: false,
  firstName: 'user2_firstName',
  lastName: 'user2_lastName',
  birthdate: new Date('1995-04-17').getTime(),
  gender: 'male',
  mobilePhone: '',
  image: '',
  about: '',
  hobbies: [1, 4, 5, 6],
  _publishedApartments: [apartment1Id.toHexString()],
  _givenReviews: [review2Id.toHexString(),review3Id.toHexString()],
  _interestedApartments: [apartment2Id.toHexString()],
  tokens: [{
    access: XAUTH,
    token: jwt.sign({ _id: user2Id.toHexString(), access: XAUTH }, process.env.JWT_SECRET).toString(),
    expiration: Date.now() + 1000000
  }],
  notifications: [
    {
      _id: new ObjectID().toHexString(),
      notificationType: NotificationsTypesEnum.COMMENT_WAS_ADDED_TO_APARTMENT,
      _createdBy: [new ObjectID().toHexString()],
      wasRead: false,
      _notifiedObjectsIds: [new ObjectID().toHexString()],
      createdAt: new Date().getTime()
    },
  ],
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
  hobbies: [7, 8, 9],
  _givenReviews: [irreleventReviewId.toHexString()],
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
  _givenReviews: [],
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
  _givenReviews: [],
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
  _givenReviews: [],
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

const user1VerificationToken = jwt.sign({ id: user1Id }, VERIFICATION_SECRET, { expiresIn: '1h' });
const user2VerificationToken = jwt.sign({ id: user2Id }, VERIFICATION_SECRET, { expiresIn: '1h' });
const getForgotPasswordToken = (hashedPassword) => jwt.sign(
  {
    id: user2Id,
    email: user2.email
  },
  `${hashedPassword}-${user2Id}-${FORGOT_SECRET}`,
  {
    expiresIn: '1h'
  });

const review1 = {
  _id: review1Id,
  _createdBy: user1Id,
  createdAt: Date.now(),
  activatedAt: Date.now(),
  street: 'shalom Aleichem',
  city: 'haifa',
  state: 'israel',
  geolocation: [35.020568, 32.776515], // [32.7824885, 35.0177497],
  ratedCharacteristics: {
    parking: 3,
    publicTransport: 3,
    noise: 3,
    commercialServices: 3,
    upkeep: 3,
    generalRating: 3
  },
  Pros: 'looks good,smells nice',
  Cons: 'no parks and no parking',
  relevent:true
};

const review2 = {
  _id: review2Id,
  _createdBy: user2Id,
  createdAt: Date.now(),
  activatedAt: Date.now(),
  street: 'malal street',
  city: 'haifa',
  state: 'israel',
  geolocation: [35.020568, 32.776515], // [32.7793633, 35.0157763],
  ratedCharacteristics: {
    parking: 1,
    publicTransport: 1,
    noise: 1,
    commercialServices: 1,
    upkeep: 1,
    generalRating: 1
  },
  Pros: 'looks good,smells nice',
  Cons: 'no parks and no parking what so ever',
  relevent:true
};

const review3 = {
  _id: review3Id,
  _createdBy: user2Id,
  createdAt: Date.now(),
  activatedAt: Date.now(),
  street: 'dor',
  city: 'haifa',
  state: 'israel',
  geolocation: [34.9948996, 32.8148386], // [32.7793633, 35.0157763],32.8148386,34.9948996
  ratedCharacteristics: {
    parking: 1,
    publicTransport: 1,
    noise: 1,
    commercialServices: 1,
    upkeep: 1,
    generalRating: 1
  },
  Pros: 'looks good,smells nice',
  Cons: 'no parks and no parking what so ever',
  relevent:true
};

const irreleventReview = {
  _id: irreleventReviewId,
  _createdBy: user3Id,
  createdAt: Date.now(),
  activatedAt: Date.now(),
  street: 'dor',
  city: 'haifa',
  state: 'israel',
  geolocation: [34.9948996, 32.8148386], // [32.7793633, 35.0157763],32.8148386,34.9948996
  ratedCharacteristics: {
    parking: 2,
    publicTransport: 2,
    noise: 2,
    commercialServices: 2,
    upkeep: 2,
    generalRating: 2
  },
  Pros: 'looks good,smells nice',
  Cons: 'no parks and no parking what so ever',
  relevent:false
};

const notPublishedReview1 = {
  // _id: review2Id,
  // _createdBy: new ObjectID(),
  // createdAt: Date.now(),
  street: 'derech ruppin',
  city: 'jerusalem',
  state: 'israel',
  // geolocation: [35.020568, 32.776515], // [32.7793633, 35.0157763],
  ratedCharacteristics: {
    parking: 4,
    publicTransport: 4,
    noise: 4,
    commercialServices: 4,
    upkeep: 4,
    generalRating: 4,
  },
  Pros: 'looks good,smells nice but so odd',
  Cons: 'no parks and no parking what so ever'
};

const notPublishedReview2 = {
  // _id: review2Id,
  // _createdBy: new ObjectID(),
  // createdAt: Date.now(),
  street: 'malal street',
  city: 'haifa',
  state: 'israel',
  // geolocation: [35.020568, 32.776515], // [32.7793633, 35.0157763],
  ratedCharacteristics: {
    parking: 2,
    publicTransport: 1,
    noise: 1,
    commercialServices: 5,
    upkeep: 1,
    generalRating: 3,
  },
  Pros: 'looks good,smells nice but so odd',
  Cons: 'no parks and no parking what so ever'
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

const reviews = [
  review1,
  review2,
  review3
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

const populateReviews = (done) => {
  Review.remove({})
    .then(() =>
      Promise.all([
        new Review(reviews[0]).save(),
        new Review(reviews[1]).save(),
        new Review(reviews[2]).save(),
        new Review(irreleventReview).save(),
      ]))
    .then(() => done())
    .catch(done);
};

module.exports = {
  apartment1User2VisitId,
  apartment1User1VisitId,
  user1Notification1Id,
  apartments,
  users,
  reviews,
  coords,
  populateApartments,
  populateReviews,
  populateUsers,
  notPublishedApartment,
  notPublishedReview1,
  notPublishedReview2,
  irreleventReview,
  notRegisteredUser,
  user1VerificationToken,
  user2VerificationToken,
  getForgotPasswordToken
};