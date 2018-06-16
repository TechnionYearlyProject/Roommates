const _ = require('lodash');
const mongoose = require('mongoose');

const errors = require('../errors');

const groupStatus = {
  PENDING: 1,
  DECLINED: 2,
  ACCEPTED: 3,
  COMPLETED: 4
};

const memberStatus = {
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
        validator: (value) => (_.includes(memberStatus, value)),
        message: '{VALUE} is not a supported User Status'
      },
      required: true,
      default: memberStatus.PENDING
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

/**
 * @author: Alon Talmor
 * @date: 7/5/18
 * Updated the status of the group according to the other group members.
 * This methods puts some invariant on the schema.
 */
GroupSchema.pre('save', function (next) {
  const group = this;
  // check whether anyone declined - then set the group status to declined
  if (group.members.some($ => $.status === memberStatus.DECLINED)) {
    group.status = groupStatus.DECLINED;
  } // eslint-disable-line
  // check whether all members accepted - then set the froup status to accepted
  else if (group.members.every($ => $.status === memberStatus.ACCEPTED)) {
    group.status = groupStatus.ACCEPTED;
  }
  next();
});

/**
 * @author: Alon Talmor
 * @date: 6/5/18
 * updated the status of the specified member id.
 *
 */
GroupSchema.methods.updateStatus = function (memberId, status) {
  const group = this;

  for (let i = 0; i < group.members.length; i++) {
    if (group.members[i].id.equals(memberId)) {
      group.members[i].status = status;
      return;
    }
  }
  throw errors.groupMemberNotFound;
};

GroupSchema.methods.sign = function () {
  const group = this;

  if (group.status !== groupStatus.ACCEPTED) {
    throw errors.groupSignFailure;
  }
  group.status = groupStatus.COMPLETED;
};
// const Group = mongoose.model('Group', GroupSchema);

module.exports = {
  Group: GroupSchema,
  groupStatus,
  memberStatus
};