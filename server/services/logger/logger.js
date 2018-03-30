
const winston = require('winston');
require('winston-daily-rotate-file');

const {getLoggerToFileConfig} = require('./logger-config');

var logger = new (winston.Logger)({
	levels: winston.config.syslog.levels,
	transports: [
	 	new (winston.transports.Console)(getLoggerToFileConfig()),
		new (winston.transports.DailyRotateFile)(getLoggerToFileConfig())
	]
});

var logError = (msg) => {
	logger.error(msg);
};

var logWarning = (msg) => {
	logger.warning(msg);
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
	logError,
	logWarning,
	logInfo,
	logDebug
};