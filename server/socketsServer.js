
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The following module is the web socket server of the platform which enables to send real-time messages (e.g. notifications, chat messages)
 * to a connected user.
 *
 *
 */
const io = require('socket.io')();

const { logInfo, logError } = require('./services/logger/logger');


 /**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The function starts the listner of the web socket server on a port set by an environment variable - WEB_SOCKETS_PORT
 *
 */
io.listen(process.env.WEB_SOCKETS_PORT, function(){
   logInfo(`Web Sokcet Server is up on port ${process.env.WEB_SOCKETS_PORT}.`);
});

/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The supported types that the client can ask to join. On any join request the user has to specify a property of "type" with one of the following values.
 * JOIN_PRIVATE - the user ask to open a communication channel (room) available only to him. Only one room is available for each user so there
 * is no meaning to send multiple joins with the JOIN_PRIVATE type.
 *
 */
const SocketJoinTypesEnum = {
  JOIN_PRIVATE: 1,
};
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The supported types of messages sent by the server.
 * Type: NOTIFICATION - a message contains data in format of notification schema and used to notify the user about changes he is subscribed to.
 *
 */
const SocketMsgTypesEnum = {
  NOTIFICATION: 1,
};
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * Define the connection and join messages callback.
 * 
 * @param {Socket} socket: web socket that raised the connection request.
 *
 */
io.sockets.on('connection', function (socket) {
  socket.on('join', function (data) {
 	  establishRoomsWithUser(data, socket);
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
const joinPrivateRoom = (_userId, socket) => {
  try{
    socket.join(_userId);
  }catch(e){
    logError(e.toString());
  }
}
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The function joins the socket to the relevant room which serves as a communication channel available to the user according to the join request
 * parameters.
 * 
 * @param {JSON} params: the parameters sent by the client socket in the join message. A must property is the type of the requested room -
 * is it a private room or group. 
 * 
 * @param {Socket} socket: web socket that raised the join request.
 *
 */
const establishRoomsWithUser = (params, socket) => {
  try{
  	switch(params.type){
  		case SocketJoinTypesEnum.JOIN_PRIVATE:
  			joinPrivateRoom(params._id, socket);
  		break;
  		default:
  			console.log("Not supported");
  		break;
  	}
  }catch(e){
    logError(e.toString());
  }
}
/**
 * @author: Or Abramovich
 * @date: 04/18
 *
 * The function send a specific user a msg of the given type with the given data. The message his sent to his private room i.e. it can be seen
 * only by him.
 * 
 * @param {ObjectID} _userId: the id of the user who is going to get the message
 * @param {Number} msgType: what type of message is sent e.g. notification, chat message etc.
 * @param {String} text: message content.
 * 
 *
 */
const sendUserRealTimeMsg = (_userId, msgType, text) => {
	io.sockets.in(_userId).emit(msgType, text);
}



module.exports = {
  sendUserRealTimeMsg,
  SocketMsgTypesEnum
};