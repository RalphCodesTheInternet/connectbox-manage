// Pull in the default config
var configs = {
	"logging":"console",
	"port":5002
};

const
    Logger = require('./logger.js'),
    logger = new Logger(configs.logging);

for (var env of Object.keys(process.env)) {
	if (env.includes('CHATHOST_')) {
		console.log(env);
		var key = env.replace('CHATHOST_','').toLowerCase();
		configs[key] = process.env[env];
	}
}
//logger.log('info', `configs: ${JSON.stringify(configs)}`);

module.exports = configs;
