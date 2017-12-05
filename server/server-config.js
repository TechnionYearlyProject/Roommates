const colors = require('colors/safe');

const env = process.env.NODE_ENV || 'development';

var serverConfig = require('./server-config.json');

const setEnvironemntVarsAccordingToConfig = (enviromentName) =>{
	var envConfig = serverConfig[env];
	Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

if(env === 'development' || env === 'test') {
	setEnvironemntVarsAccordingToConfig(env);
}

setEnvironemntVarsAccordingToConfig("all_env");

console.log(`Enviroment: 			${colors.green(env)}`);
console.log(`Port:       			${colors.green(process.env.PORT)}`);
console.log(`Database:   			${colors.green(process.env.MONGODB_URI)}`);
console.log('');