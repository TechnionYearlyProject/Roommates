const colors = require('colors/safe');

const serverConfig = require('./server-config.json');

const env = process.env.NODE_ENV || 'development';

const setEnvironmentVariables = () => {
  const envConfig = serverConfig[env];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
};

if (env === 'development' || env === 'test') {
  setEnvironmentVariables();
}

console.log(`Enviroment: 			${colors.green(env)}`);
console.log(`Port:       			${colors.green(process.env.PORT)}`);
console.log(`Database:   			${colors.green(process.env.MONGODB_URI)}`);
console.log('');