const
    configs = require('./configs.js'),
	{execSync}= require("child_process"),
    fs = require('fs'),
    Logger = require('./logger.js'),
    logger = new Logger(configs.logging);

var get = {};
var set = {};

function auth (password) {
	console.log(auth);
}
get.ssid = function (){
	return (execSync(`grep '^ssid=' /etc/hostapd/hostapd.conf | cut -d"=" -f2`).data)
}
set.ssid = function (){
	return ('test')
}


module.exports = {
	auth,
	get,
	set
};