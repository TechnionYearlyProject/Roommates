const colors = require('colors/safe');

const serverConfig = require('./server-config.json');

const env = process.env.NODE_ENV || 'development';


const setEnvironmentVariablesByEnv = (enviro) => {
  const envConfig = serverConfig[enviro];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
};

const setEnvironmentVariables = () => {
  setEnvironmentVariablesByEnv(env);
};

const setDefaultEnvironmentVariables = () => {
	setEnvironmentVariablesByEnv('default');
};


setDefaultEnvironmentVariables();

if (env === 'development' || env === 'test') {
  setEnvironmentVariables();
}

console.log(`Enviroment: 				${colors.green(env)}`);
console.log(`Port:       				${colors.green(process.env.PORT)}`);
console.log(`Websockets Server Port: 	${colors.green(process.env.WEB_SOCKETS_PORT)}`);
console.log(`Database:   				${colors.green(process.env.MONGODB_URI)}`);
console.log(`Log Level:   				${colors.green(process.env.LOG_LEVEL)}`);
console.log('');