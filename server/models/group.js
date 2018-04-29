const arrayFunctions = require('../helpers/arrayFunctions');
const { ObjectID } = require('mongodb');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const GROUP_STATUS_PENDING = 1;
const GROUP_STATUS_DECLINED = 2;
const GROUP_STATUS_ACCEPTED = 3;
const GROUP_STATUS_COMPLETED = 4;

const groupStatusCodes = [
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

//checks that the given value represents a supported group status id
const isSupportedGroupStatusID = (value) => {
    return arrayFunctions.containsElementWithProperty(groupStatusCodes, '_id', value);
};

//returns all supported group codes
const getGroupStatusCodes = () => groupStatusCodes;

const GroupSchema = new Schema({

});