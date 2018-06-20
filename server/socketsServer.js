const {
  ObjectID
} = require('mongodb');

/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The following module is the web socket server of the platform which enables to send
 * real-time messages (e.g. notifications, chat messages) to a connected user.
 *
 *
 */
const io = require('socket.io')();
const socketioJwt = require('socketio-jwt');

const { markNotificationAsRead, handleNewPrivateMessage, handleReadPrivateMessage } = require('./logic/socketsServerHandlers');
const { logInfo, logError, logDebug } = require('./services/logger/logger');
const { buildPrivateMessageJSON } = require('./models/privateMessage');

/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The function starts the listner of the web socket server on a port set by an environment
 * variable - WEB_SOCKETS_PORT
 *
 */
io.listen(process.env.WEB_SOCKETS_PORT, () => {
  logInfo(`Web Socket Server is up on port ${process.env.WEB_SOCKETS_PORT}.`);
});

/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The supported types of messages sent by the server.
 * @type: JOIN - a message that allocates a new dedicated room which serves as a communication
 * channel available only to the user who raised the join request.
 * @type: NOTIFICATION - a message contains data in format of notification schema and used to
 * notify the user about changes he is subscribed to.
 * @type: NOTIFICATION_READ - a message contains data in format of notification schema which
 * sent by the user to signal that he has just read it.
 * @type: CHAT_MSG - 	a message contains data in format of chat message schema and used to pass
 * private messages  between users.
 * @type: CHAT_MSG_READ - a message contains data in format of chat message schema which sent
 * by the user to signal that he has just read it.
 *
 */
const SocketMsgTypes = {
  JOIN: 'join',
  NOTIFICATION: 'notification',
  NOTIFICATION_READ: 'notification_read',
  CHAT_MSG: 'chat_message',
  CHAT_MSG_READ: 'chat_message_read'
};
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Authenticates the token used by the client.
 *
 *
 */
/*
io.use(
  socketioJwt.authorize({
    secret: process.env.JWT_SECRET,
    // handshake: true
  })
);
*/
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Defines the connection and different messaages callbacks.
 *
 * @param {Socket} socket: web socket that raised the connection request.
 *
 */
io.sockets
  .on(
    'connection',
    socketioJwt.authorize({
      secret: process.env.JWT_SECRET,
      timeout: 15000
    })
  )
  .on('authenticated', function(socket) {
    //Establishes a new dedicated room which serves as a communication channel available only to the user
    socket.on(SocketMsgTypes.JOIN, function(data) {
      logDebug('someone connected');
      establishRoomForUser(socket.decoded_token._id, socket);
    });
    //Marks the notification as read and saves it in the user document
    socket.on(SocketMsgTypes.NOTIFICATION_READ, function(notification) {
      markNotificationAsRead(socket.decoded_token._id, notification);
    });
    //Sends a private message to the receiver and stores it in the DB.
    socket.on(SocketMsgTypes.CHAT_MSG, function (messageData) {
      logDebug('someone msg');
    	const message = buildPrivateMessageJSON(new ObjectID(socket.decoded_token._id), new Date().getTime(), messageData.content, false);
    	message._id = new ObjectID(); //the message id should be the same for both sides! (the sender and the reciever.)
    	handleNewPrivateMessage(socket.decoded_token._id, messageData.to, message).then((res)=>{
      		sendUserRealTimePrivateMessage(messageData.to, message);
    	})
  	});
    //Updates that the message was read in the users (sender & receiver) documents and send it to the other user
	socket.on(SocketMsgTypes.CHAT_MSG_READ, function (messageData) {
	    handleReadPrivateMessage(socket.decoded_token._id, messageData.to, messageData._id).then((res)=>{
	      sendUserRealTimeReadPrivateMessage(messageData.to, messageData);
	    })
  	});
  });

/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The function joins the socket to a private room which serves as a communication channel available only to the user who raised the join request.
 * the room name is set to the user id so only one room is available for each user.
 *
 * @param {ObjectID} _userId: the id of the user who raised the join request
 * @param {Socket} socket: web socket that raised the join request.
 *
 */
const establishRoomForUser = (_userId, socket) => {
  try {
    socket.join(_userId);
  } catch (e) {
    logError(e.toString());
  }
};
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The function send a specific user a msg of the given type with the given data. The message his sent to his private room i.e. it can be seen
 * only by him.
 *
 * @param {ObjectID} _userId: the id of the user who is going to get the message
 * @param {String} msgType: what type of message is sent e.g. notification, chat message etc.
 * @param {String} text: message content.
 *
 *
 */
const sendUserRealTimeMsg = (_userId, msgType, text) => {
  io.sockets.in(_userId).emit(msgType, text);
};
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The function send a specific user a notification msg. The message his sent to his private room i.e. it can be seen
 * only by him.
 *
 * @param {ObjectID} _userId: the id of the user who is going to get the notification
 * @param {Notification} notification: the notification object to be sent to the user.
 *
 *
 */
const sendUserRealTimeNotification = (_userId, notification) => {
  sendUserRealTimeMsg(
    _userId,
    SocketMsgTypes.NOTIFICATION,
    notification
  );
};

/**
 * @author: Or Abramovich
 * @date: 05/18
 *
 * The function send a specific user a chat msg. The message is sent to his private room i.e. it can be seen
 * only by him.
 * 
 * @param {ObjectID} _toId: the id of the user who is going to get the message
 * @param {String} message: the message object to be sent to the user.
 * 
 *
 */
const sendUserRealTimePrivateMessage = (_toId, message) => {
  sendUserRealTimeMsg(_toId, SocketMsgTypes.CHAT_MSG, message);
}
/**
 * @author: Or Abramovich
 * @date: 05/18
 *
 * The function send a specific user a read chat msg signal. The message is sent to his private room i.e. it can be seen
 * only by him. The message contains the last time the other user seen messages
 * 
 * @param {ObjectID} _toId: the id of the user who is going to get the message.
 * @param {String} message: containing the last time the other user seen messages from him.
 * 
 *
 */
const sendUserRealTimeReadPrivateMessage = (_toId, message) => {
  sendUserRealTimeMsg(_toId, SocketMsgTypes.CHAT_MSG_READ, message);
}
module.exports = {
  sendUserRealTimeNotification
};
