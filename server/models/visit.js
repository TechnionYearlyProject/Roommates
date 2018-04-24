/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The following module provides the constants and the functionality of the visit attribute belongs to the Apartment model.
 *
 */

const arrayFunctions = require('../helpers/arrayFunctions');
const { ObjectID } = require('mongodb');


const VISIT_STATUS_PENDING_VISITOR_APPROVAL = 1;
const VISIT_STATUS_PENDING_OWNER_APPROVAL = 2;
const VISIT_STATUS_APPROVED = 3;
const VISIT_STATUS_CANCELED = 4;

const visitStatusCodes = [
  {
    _id: VISIT_STATUS_PENDING_VISITOR_APPROVAL,
    name: 'PENDING FOR VISITOR APPROVAL'
  },
  {
    _id: VISIT_STATUS_PENDING_OWNER_APPROVAL,
    name: 'PENDING FOR OWNER APPROVAL'
  },
  {
    _id: VISIT_STATUS_APPROVED,
    name: 'APPROVED'
  },
  {
    _id: VISIT_STATUS_CANCELED,
    name: 'CANCELED'
  }
];

const visitStatusChangeLogic = [
  {
    operation_name: "APPROVE",
    from_status: VISIT_STATUS_PENDING_OWNER_APPROVAL,
    to_status: VISIT_STATUS_APPROVED,
    can_be_done_by_the_owner: true,
    can_be_done_by_the_visitor: false
  },
  {
    operation_name: "APPROVE",
    from_status: VISIT_STATUS_PENDING_VISITOR_APPROVAL,
    to_status: VISIT_STATUS_APPROVED,
    can_be_done_by_the_owner: false,
    can_be_done_by_the_visitor: true
  },
  {
    operation_name: "CANCEL",
    //from_status: Not needed, can be from every status
    to_status: VISIT_STATUS_CANCELED,
    can_be_done_by_the_owner: true,
    can_be_done_by_the_visitor: true
  },
  {
    operation_name: "EDIT",
    //from_status: Not needed, can be from every status
    to_status: VISIT_STATUS_PENDING_VISITOR_APPROVAL,
    can_be_done_by_the_owner: true,
    can_be_done_by_the_visitor: false
  },
  {
    operation_name: "EDIT",
    //from_status: Not needed, can be from every status
    to_status: VISIT_STATUS_PENDING_OWNER_APPROVAL,
    can_be_done_by_the_owner: false,
    can_be_done_by_the_visitor: true
  },
  {
    operation_name: "ADD",
    //from_status: Not needed, can be from every status
    to_status: VISIT_STATUS_PENDING_OWNER_APPROVAL,
    can_be_done_by_the_owner: false,
    can_be_done_by_the_visitor: true
  },
];


/**
 * @author: Or Abramovich
 * @date: 04/18
 * Verifies that the given value represents a supported visit status id i.e. it exists in the visitStatusCodes array
 *
 * @param {Number} value: the status id to be checked
 *
 * @returns boolean indicating whether the value is a valid visit id
 */
const isSupportedVisitStatusID = (value) => {
  return arrayFunctions.containsElementWithProperty(visitStatusCodes, '_id', value);
}
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * returnes all supported visit codes
 *
 * @returns array with all available status codes
 */
const getVisitStatusCodes = () => visitStatusCodes;
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * returnes all supported visit status changes according to the business logic
 *
 * @returns array with all available status change actions
 */
const getVisitStatusChangeActions = () => visitStatusChangeLogic;
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * returnes the new status of a visit once it is approved.
 *
 * @returns number.
 */
const getVisitStatusOnApproval = () => VISIT_STATUS_APPROVED;
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * returnes the new status of a visit once it is canceled.
 *
 * @returns number.
 */
const getVisitStatusOnCancelation = () => VISIT_STATUS_CANCELED;
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * returnes the new status of a visit once it is changed accroding to the change initiator.
 *
 * @param {Boolean} isOwnerTriggeredChange: a flag indicated whther the apartment owner asked the status change
 * 
 * @returns number.
 */
const getVisitStatusOnChange = (isOwnerTriggeredChange) => (isOwnerTriggeredChange ? VISIT_STATUS_PENDING_VISITOR_APPROVAL : VISIT_STATUS_PENDING_OWNER_APPROVAL);
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * returnes the initial status of a visit once it is created.
 *
 * @returns number.
 */
const getVisitStatusOnCreate = () => VISIT_STATUS_PENDING_OWNER_APPROVAL;
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Verifies that the modifier can change the visit according to the business logic
 *
 * @param {ObjecID} _ownerID: the owner ID of the apartment
 * @param {ObjecID} _visitorID: the visior ID who want to visit the apartment
 * @param {ObjecID} _modifierID: the ID of the user who asked to make the change
 *
 * @returns boolean.
 */
const canModifyVisit = (_ownerID, _visitorID, _modifierID) => {
  return _modifierID.equals(_visitorID)  ||  _modifierID.equals(_ownerID);
};
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Verifies that the user can add a visit according to the business logic
 *
 * @param {Boolean} isOwner: a flag indicated whther the apartment owner asked to add the visit
 *
 * @returns boolean.
 */
const canAddVisit = (isOwner) => {
  return !isOwner;
};

/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Verifies that the status change from currentStatus to targetStatus is valid according to the business logic.
 *
 * @param {Number} currentStaus: the current status of the visit.
 * @param {Number} targetStatus: the target status of the visit.
 * @param {Boolean} isOwner:  flag indicated whther the apartment owner asked the status change
 *
 * @returns boolean.
 */
const isValidVisitStatusChange = (currentStaus, targetStatus, isOwner) => {
  var allowedChanges = visitStatusChangeLogic.filter(function (statusChange) {
    var fromStatusChecker = statusChange.hasOwnProperty('from_status') ? statusChange.from_status == currentStaus : true;
    var targetStatusChecker = statusChange.hasOwnProperty('to_status') ? statusChange.to_status == targetStatus : true;
    var modifierChecker = isOwner ? (statusChange.can_be_done_by_the_owner) : (statusChange.can_be_done_by_the_visitor);
    
    return fromStatusChecker && targetStatusChecker && modifierChecker;
  });

  return (allowedChanges.length > 0);
};


module.exports = {
  getVisitStatusChangeActions,
  canAddVisit,
  canModifyVisit,
  getVisitStatusOnApproval,
  getVisitStatusOnCancelation,
  getVisitStatusOnChange,
  getVisitStatusOnCreate,
  getVisitStatusCodes,
  isSupportedVisitStatusID,
  isValidVisitStatusChange
};