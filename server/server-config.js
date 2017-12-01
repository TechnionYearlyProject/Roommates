const colors = require('colors/safe');

const env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test') {
    var serverConfig = require('./server-config.json');
    var envConfig = serverConfig[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

console.log(`Enviroment: ${colors.green(env)}`);
console.log(`Port:       ${colors.green(process.env.PORT)}`);
console.log(`Database:   ${colors.green(process.env.MONGODB_URI)}`);
console.log('');