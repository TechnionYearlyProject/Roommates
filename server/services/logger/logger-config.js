
const fs = require('fs');
const path = require('path');


exports.getLoggerToFileConfig = function () {
	const logDirectory = path.join(__dirname, 'server_logs');
	const logFileName = path.join(logDirectory, 'server.log');
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

	const tsFormat = () => (new Date()).toLocaleTimeString();

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
