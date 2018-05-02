const arrayFunctions = require('../helpers/arrayFunctions');
const { ObjectID } = require('mongodb');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GROUP_STATUS_PENDING = 1;
const GROUP_STATUS_DECLINED = 2;
const GROUP_STATUS_ACCEPTED = 3;
const GROUP_STATUS_COMPLETED = 4;

const GroupStatusCodes = [
    {
        _id: GROUP_STATUS_PENDING,
        name: 'PENDING FOR PARTICIPANTS RESPONSES'
    },
    {
        _id: GROUP_STATUS_DECLINED,
        name: 'A PARTICIPANT DECLINED'
    },
    {
        _id: GROUP_STATUS_ACCEPTED,
        name: 'ALL PARTICIPANTS APPROVED'
    },
    {
        _id: GROUP_STATUS_COMPLETED,
        name: 'ALL PARTICIPANTS APPROVED AND OWNER APPROVED'
    }
];

const visitStatusChangeLogic = [
    {
        operation_name: "APPROVE",
        from_status: GROUP_STATUS_PENDING,
        to_status: GROUP_STATUS_ACCEPTED,
        can_be_done_by_the_owner: false,
        can_be_done_by_the_visitor: true
    },
    {
        operation_name: "CANCEL",
        //from_status: Not needed, can be from every status
        to_status: GROUP_STATUS_DECLINED,
        can_be_done_by_the_owner: true,
        can_be_done_by_the_visitor: true
    },
    {
        operation_name: "COMPLETE",
        from_status: GROUP_STATUS_ACCEPTED,
        to_status: GROUP_STATUS_COMPLETED,
        can_be_done_by_the_owner: true,
        can_be_done_by_the_visitor: false
    },
];



const GroupSchema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        validate: {
            validator: (value) => isSupportedGroupStatusID(value),
            message: '{VALUE} is not a supported group status Id'
        },
        required: true
    },
});




//checks that the given value represents a supported group status id
const isSupportedGroupStatusID = (value) => {
    return arrayFunctions.containsElementWithProperty(GroupStatusCodes, '_id', value);
};

//returns all supported group codes
const getGroupStatusCodes = () => groupStatusCodes;

const getGroupCreatorID = (group) => group.creator;

const getGroupMemberIDs = (group) => group.members;



module.exports = {
    GroupSchema,
    GroupStatusCodes,
    isSupportedGroupStatusID,
    getGroupStatusCodes,
    getGroupCreatorID,
    getGroupMemberIDs,
};