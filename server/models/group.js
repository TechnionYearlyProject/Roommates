const arrayFunctions = require('../helpers/arrayFunctions');
const { ObjectID } = require('mongodb');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GROUP_STATUS_PENDING = 1;
const GROUP_STATUS_DECLINED = 2;
const GROUP_STATUS_ACCEPTED = 3;
const GROUP_STATUS_COMPLETED = 4;

const USER_STATUS_PENDING = 1;
const USER_STATUS_ACCEPTED = 2;
const USER_STATUS_DECLINED = 3;
const USER_STATUS_PAYED = 4;


const GroupStatusCodes = [GROUP_STATUS_PENDING, GROUP_STATUS_DECLINED, GROUP_STATUS_ACCEPTED, GROUP_STATUS_COMPLETED];

const UserStatusCode = [USER_STATUS_PENDING, USER_STATUS_ACCEPTED, USER_STATUS_DECLINED, USER_STATUS_PAYED];

// const groupStatusChangeLogic = [
//     {
//         operation_name: "APPROVE",
//         from_status: GROUP_STATUS_PENDING,
//         to_status: GROUP_STATUS_ACCEPTED,
//         can_be_done_by_the_owner: false,
//         can_be_done_by_the_visitor: true
//     },
//     // {
//     //     operation_name: "CANCEL",
//     //     //from_status: Not needed, can be from every status
//     //     to_status: GROUP_STATUS_DECLINED,
//     //     can_be_done_by_the_owner: true,
//     //     can_be_done_by_the_visitor: true
//     // },
//     {
//         operation_name: "COMPLETE",
//         from_status: GROUP_STATUS_ACCEPTED,
//         to_status: GROUP_STATUS_COMPLETED,
//         can_be_done_by_the_owner: true,
//         can_be_done_by_the_visitor: false
//     },
// ];



const GroupSchema = new Schema({
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    memberPayed: {
        type: [Number],
        required: true
    },
    // apartment: {
    //     type: String,
    //     required: true
    // },
    createdAt: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: false
    },
    status: {
        type: Number,
        validate: {
            validator: (value) => (value === value),
            message: '{VALUE} is not a supported group status Id'
        },
        required: true
    },
});




//checks that the given value represents a supported group status id
const isSupportedGroupStatusID = (value) => {
    return value >= 0 && value <= 4;
};

const getGroupStatusOnCreate = () => {
    return 0;
};


//returns all supported group codes
const getGroupStatusCodes = () => groupStatusCodes;

const getGroupCreatorID = (group) => group.creator;

const getGroupMemberIDs = (group) => group.members;


const Group = mongoose.model('Group', GroupSchema);
module.exports = {
    Group,
    GroupStatusCodes,
    getGroupStatusOnCreate,
    isSupportedGroupStatusID,
    getGroupStatusCodes,
    getGroupCreatorID,
    getGroupMemberIDs,
};