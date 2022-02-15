const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	cookieSession = require('cookie-session'),
    nocache = require('nocache'),
    cors = require('cors'),
   	{execSync}= require("child_process"),
	moment = require('moment-timezone'),
    configs = require('./configs.js'),
    Logger = require('./logger.js'),
    logger = new Logger(configs.logging);

app.listen(configs.port);
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.text({ type: 'text/html' , limit: '50mb'}));
app.use(cookieParser());
app.use(cookieSession({name: 'relaytrust',keys: ['81143184-d876-11eb-b8bc-0242ac130003'],maxAge: 24 * 60 * 60 * 1000}));

app.put('/admin/api/auth', function(req,res) {
	console.log(req.body);
	if (req.body && req.body.password && auth(req.body.password)) {
		req.session.username = "admin";
		res.sendStatus(200);
	}
	else {
		res.sendStatus(401);
	}
})

app.use(async function (req, res, next) {
	if (!req.session.username) {
		res.sendStatus(401);
	}
	else {
		next();
	}
});


app.use('/admin/api', require('./routes/api.js'));



function auth(password) {
	try {
		var authString = fs.readFileSync('/usr/local/connectbox/etc/basicauth','utf-8');
		var checkPassword = execSync(`echo ${password} | openssl passwd -apr1 -salt CBOX2018 -stdin`);
		if (checkPassword === authString) {
			return true;
		}
		else {
			return false;
		}
	}
	catch(e) {
		console.log(`ERROR: auth: ${e}`);
		return false;
	}
}