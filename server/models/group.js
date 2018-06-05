const _ = require('lodash');
const mongoose = require('mongoose');

const groupStatus = {
  PENDING: 1,
  DECLINED: 2,
  ACCEPTED: 3,
  COMPLETED: 4
};

const userStatus = {
  PENDING: 1,
  ACCEPTED: 2,
  DECLINED: 3,
  PAYED: 4
};


const GroupSchema = new mongoose.Schema({
  members: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    status: {
      type: Number,
      validate: {
        validator: (value) => (_.includes(userStatus, value)),
        message: '{VALUE} is not a supported User Status'
      },
      required: true,
      default: userStatus.PENDING
    }
  }],
  createdAt: {
    type: Number,
    required: true,
    default: Date.now()
  },
  score: {
    type: Number,
    required: false,
    default: 0
  },
  status: {
    type: Number,
    validate: {
      validator: (value) => (_.includes(groupStatus, value)),
      message: '{VALUE} is not a supported group status Id'
    },
    required: true,
    default: groupStatus.PENDING
  },
  _apartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

// const Group = mongoose.model('Group', GroupSchema);

module.exports = {
  Group: GroupSchema,
  groupStatus,
  userStatus
};