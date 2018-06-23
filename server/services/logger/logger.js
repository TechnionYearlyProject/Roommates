const winston = require('winston');
require('winston-daily-rotate-file');
require("winston-azure-blob-transport");

const {
  getLoggerToFileConfig,
  getLoggerToCloudConfig
} = require('./logger-config');

const logger = new (winston.Logger)({
  levels: winston.config.syslog.levels,
  transports: [
    new (winston.transports.Console)(getLoggerToFileConfig()),
    new (winston.transports.DailyRotateFile)(getLoggerToFileConfig()),
    new (winston.transports.AzureBlob)(getLoggerToCloudConfig())
  ]
});

const logError = (msg) => {
  logger.error(msg);
};

const logWarning = (msg) => {
  logger.warning(msg);
};

const logInfo = (msg) => {
  logger.info(msg);
};

const logDebug = (msg) => {
  logger.debug(msg);
};

logger.stream = {
  write(message, encoding) {
    logError(message);
  }
};

module.exports = {
  logError,
  logWarning,
  logInfo,
  logDebug
};