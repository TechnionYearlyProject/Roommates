
const fs = require('fs');
const path = require('path');

const {
  AZURE
} = require('../../constants');

const tsFormat = () => (new Date()).toLocaleTimeString();

exports.getLoggerToFileConfig = function () {
	const logDirectory = path.join(__dirname, 'server_logs');
	const logFileName = path.join(logDirectory, 'server.log');
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    return  {
	    		"filename": logFileName,
	      		"timestamp": tsFormat,
	      		"datePattern": 'yyyy-MM-dd',
	      		"colorize": 'true',
	      		"maxsize": 10000000,
			    "maxFiles": 10,
	      		"prepend": true,
	      		"level":  process.env.LOG_LEVEL,
	      		"handleExceptions": true,
	            "humanReadableUnhandledException": true
        	};
};


exports.getLoggerToCloudConfig = function() {
	const blobName = "logs_" + (new Date()).toISOString().split('T')[0];
	const SA = AZURE.STORAGE_ACCOUNT;
	return {
          account: {
            name: SA.NAME,
            key: SA.ACCESS_KEY
        },
        containerName: SA.CONTAINERS.APP_LOGS,
        blobName: blobName,
        level: process.env.LOG_LEVEL
    };
};
