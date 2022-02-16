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

//DICT:GET:apssid: Access Point SSID
get.apssid = function (){
	return (execute(`grep '^ssid=' /etc/hostapd/hostapd.conf | cut -d"=" -f2`))
}
//DICT:SET:apssid: Access Point SSID
set.apssid = function (json){
	return (execute(`sudo sed -i -e "/ssid=/ s/=.*/=\"${json.value}\"/" /etc/hostapd/hostapd.conf`))
}

//DICT:GET:appassphrase: Access Point WPA passphrase
get.appassphrase = function (){
	return (execute(`grep '^wpa_passphrase=' /etc/hostapd/hostapd.conf | cut -d"=" -f2`))
}
//DICT:SET:appassphrase: Access Point WPA passphrase
set.appassphrase = function (json){
	return (execute(`sudo sed -i -e "/wpa_passphrase=/ s/=.*/=\"${json.value}\"/" /etc/hostapd/hostapd.conf`))
}

//DICT:GET:apchannel: Access Point Wi-Fi Channel
get.apchannel = function (){
	return (execute(`grep '^channel=' /etc/hostapd/hostapd.conf | cut -d"=" -f2`))
}
//DICT:SET:apchannel: Access Point Wi-Fi Channel
set.apchannel = function (json){
	return (execute(`sudo sed -i -e "/channel=/ s/=.*/=\"${json.value}\"/" /etc/hostapd/hostapd.conf`))
}

//DICT:GET:clientssid: Client Wi-Fi SSID
get.clientssid = function (){
	return (execute(`grep 'ssid' /etc/wpa_supplicant/wpa_supplicant.conf | cut -d'"' -f2`))
}
//DICT:SET:clientssid: Client Wi-Fi SSID
set.clientssid = function (json){
	return (execute(`sudo sed -i -e "/ssid=/ s/=.*/=\"${json.value}\"/" /etc/wpa_supplicant/wpa_supplicant.conf`))
}

//DICT:GET:clientpassphrase: Client Wi-Fi WPA Passphrase
get.clientpassphrase = function (){
	return (execute(`grep 'psk' /etc/wpa_supplicant/wpa_supplicant.conf | cut -d'"' -f2`))
}
//DICT:SET:clientpassphrase: Client Wi-Fi WPA Passphrase
set.clientpassphrase = function (json){
	return (execute(`sudo sed -i -e "/psk=/ s/=.*/=\"${json.value}\"/" /etc/wpa_supplicant/wpa_supplicant.conf`))
}

//DICT:GET:clientcountry: Client Wi-Fi Wi-Fi Country Support
get.clientcountry = function (){
	return (execute(`grep 'country=' /etc/wpa_supplicant/wpa_supplicant.conf | cut -d"=" -f2`))
}
//DICT:SET:clientcountry: Client Wi-Fi Wi-Fi Country Support
set.clientcountry = function (json){
	execute(`sudo sed -i -e "/country_code=/ s/=.*/=${json.value}/" /etc/hostapd/hostapd.conf`)
	return (execute(`sudo sed -i -e "/country=/ s/=.*/=\"${json.value}\"/" /etc/wpa_supplicant/wpa_supplicant.conf`))
}

//DICT:GET:hostname: Box Hostname
get.hostname = function (){
	return (execute(`cat /etc/hostname`))
}
//DICT:SET:hostname: Box Hostname
set.hostname = function (json){
	//todo
}

//DICT:GET:ismoodle: Returns 1 if Moodle is present
get.ismoodle = function() {
	if (fs.existsSync('/var/www/moodle/index.php')) {
		return('1');
	}
	else {
		return('0');
	}
}

//DICT:GET:brand: Get value from brand.txt.  Must include a value such as Image
function getBrand(key) {
	var brand = JSON.parse(fs.readFileSync('/usr/local/connectbox/brand.txt'));
	if (key === 'lcd_pages_stats') {
		// Special case where lcd_page_stats is a rollup of several settings
		key = 'lcd_pages_stats_day_one';
	}
	return(brand[key] || 0);
}

//DICT:SET:brand: Set value in brand.txt where value is like Image=connectbox_logo.png
function setBrand(body) {
	var brand = JSON.parse(fs.readFileSync('/usr/local/connectbox/brand.txt'));
	var key = body.value.split('=')[0];
	var val = body.value.split('=')[1];
	brand[key] = val;
	// One key sets a few lcd_pages_stats values so loop through and update all of them
	if (key === 'lcd_pages_stats') {
		delete brand[key];  // Don't keep lcd_pages_stats
		for (var pagekey of Object.keys(brand))	 {
			if (pagekey.startsWith(key)) {
				brand[pagekey] = val; // Example: lcd_pages_stats_hour_one = 1
			}
		}
	}
	fs.writeFileSync('/usr/local/connectbox/brand.txt',JSON.stringify(brand));
	return(body.value);
}

function execute(command) {
	return(execSync(command).toString().replace('\n',''));
}

module.exports = {
	auth,
	get,
	set,
	getBrand,
	setBrand
};