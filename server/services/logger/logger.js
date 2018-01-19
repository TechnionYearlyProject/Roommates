
const winston = require('winston');
require('winston-daily-rotate-file');

const {getLoggerToFileConfig} = require('./logger-config');

var logger = new (winston.Logger)({
	transports: [
	 	new (winston.transports.Console)(),
		new (winston.transports.DailyRotateFile)(getLoggerToFileConfig())
	]
});

var logError = (msg) => {
	logger.error(msg);
};

var logWarning = (msg) => {
	logger.warn(msg);
};

var logInfo = (msg) => {
	logger.info(msg);
};

var logDebug = (msg) => {
	logger.debug(msg);
};

logger.stream = {
    write: function(message, encoding){
        logError(message);
    }
};

module.exports = {
	logger,
	logError,
	logWarning,
	logInfo,
	logDebug
};