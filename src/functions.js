const
    configs = require('./configs.js'),
	{execSync}= require("child_process"),
	{ exec } = require('child_process'),
	fs = require('fs'),
    Logger = require('./logger.js'),
    logger = new Logger(configs.logging);

var get = {};
var set = {};
var doCommand = {};

function auth (password) {
	console.log(auth);
}

//DICT:SET:password (string): Set Web Access password
set.password = function (json){
	var hash = execute(`echo ${json.value} | openssl passwd -apr1 -salt CBOX2018 -stdin`)
	fs.writeFileSync('/usr/local/connectbox/etc/basicauth',`admin:${hash.toString()}`);
	return (true);
}

//DICT:GET:apssid: Access Point SSID
get.apssid = function (){
	return (execute(`grep '^ssid=' /etc/hostapd/hostapd.conf | cut -d"=" -f2`))
}
//DICT:SET:apssid (string): Access Point SSID
set.apssid = function (json){
	return (execute(`sudo sed -i -e "/ssid=/ s/=.*/=\"${json.value}\"/" /etc/hostapd/hostapd.conf`))
}

//DICT:GET:appassphrase: Access Point WPA passphrase
get.appassphrase = function (){
	return (execute(`grep '^wpa_passphrase=' /etc/hostapd/hostapd.conf | cut -d"=" -f2`))
}
//DICT:SET:appassphrase (string): Access Point WPA passphrase
set.appassphrase = function (json){
	return (execute(`sudo sed -i -e "/wpa_passphrase=/ s/=.*/=\"${json.value}\"/" /etc/hostapd/hostapd.conf`))
}

//DICT:GET:apchannel: Access Point Wi-Fi Channel
get.apchannel = function (){
	return (execute(`grep '^channel=' /etc/hostapd/hostapd.conf | cut -d"=" -f2`))
}
//DICT:SET:apchannel (integer): Access Point Wi-Fi Channel
set.apchannel = function (json){
	return (execute(`sudo sed -i -e "/channel=/ s/=.*/=\"${json.value}\"/" /etc/hostapd/hostapd.conf`))
}

//DICT:GET:clientssid: Client Wi-Fi SSID
get.clientssid = function (){
	return (execute(`grep 'ssid' /etc/wpa_supplicant/wpa_supplicant.conf | cut -d'"' -f2`))
}
//DICT:SET:clientssid (string): Client Wi-Fi SSID
set.clientssid = function (json){
	return (execute(`sudo sed -i -e "/ssid=/ s/=.*/=\\\"${json.value}\\\"/" /etc/wpa_supplicant/wpa_supplicant.conf`))
}

//DICT:GET:clientpassphrase: Client Wi-Fi WPA Passphrase
get.clientpassphrase = function (){
	return (execute(`grep 'psk' /etc/wpa_supplicant/wpa_supplicant.conf | cut -d'"' -f2`))
}
//DICT:SET:clientpassphrase (string): Client Wi-Fi WPA Passphrase
set.clientpassphrase = function (json){
	return (execute(`sudo sed -i -e "/psk=/ s/=.*/=\\\"${json.value}\\\"/" /etc/wpa_supplicant/wpa_supplicant.conf`))
}

//DICT:GET:clientcountry: Client Wi-Fi Wi-Fi Country Support
get.clientcountry = function (){
	return (execute(`grep 'country=' /etc/wpa_supplicant/wpa_supplicant.conf | cut -d"=" -f2`))
}
//DICT:SET:clientcountry(2 letter country code): Client Wi-Fi Wi-Fi Country Support
set.clientcountry = function (json){
	execute(`sudo sed -i -e "/country_code=/ s/=.*/=${json.value}/" /etc/hostapd/hostapd.conf`)
	return (execute(`sudo sed -i -e "/country=/ s/=.*/=\"${json.value}\"/" /etc/wpa_supplicant/wpa_supplicant.conf`))
}

//DICT:GET:connectedclients: Count of devices connected to access point
get.connectedclients = function (){
	var wifi = {"accesspoint":"wlan1","client":"wlan0"};  // Defaults
	if (fs.existsSync('/usr/local/connectbox/wificonf.txt')) {
		wifi.accesspoint = execute(`grep 'AccessPointIF' /usr/local/connectbox/wificonf.txt | cut -d"=" -f2`);
		wifi.client = execute(`grep 'ClientIF' /usr/local/connectbox/wificonf.txt | cut -d"=" -f2`);
	}
	return (execute(`iw ${wifi.accesspoint} station dump |grep Station |wc -l`))
}

//DICT:GET:connectedclients: Count of devices connected to access point
get.clientwificonnection = function (){
	var wifi = {"accesspoint":"wlan1","client":"wlan0"};  // Defaults
	if (fs.existsSync('/usr/local/connectbox/wificonf.txt')) {
		wifi.accesspoint = execute(`grep 'AccessPointIF' /usr/local/connectbox/wificonf.txt | cut -d"=" -f2`);
		wifi.client = execute(`grep 'ClientIF' /usr/local/connectbox/wificonf.txt | cut -d"=" -f2`);
	}
	var text = ['Offline','Connected'];
	var response = text[execute(`iwconfig ${wifi.client} | grep 'Link Quality' |wc -l`)] || "Error: Device Not Found";
	return (response);
}

//DICT:SET:wifirestart(interface): Client Wi-Fi Wi-Fi Country Support
set.wifirestart = function (json){
	// This provides the interface information for each wifi interface
	var wifi = {"accesspoint":"wlan1","client":"wlan0"};  // Defaults
	if (fs.existsSync('/usr/local/connectbox/wificonf.txt')) {
		wifi.accesspoint = execute(`grep 'AccessPointIF' /usr/local/connectbox/wificonf.txt | cut -d"=" -f2`);
		wifi.client = execute(`grep 'ClientIF' /usr/local/connectbox/wificonf.txt | cut -d"=" -f2`);
	}
	// Now do the update
	var interface = wifi[json.value];
	var response = execute(`sudo ifdown ${interface} && sleep 1 && sudo ifup ${interface}`);
	if (json.value === 'accesspoint') {
		response += execute(`sudo systemctl restart hostapd`);
	}
	return (response);  
}

//DICT:GET:wifistatus: Retrieve current wifi adaptor information
get.wifistatus = function (){
	var wifi = {"accesspoint":"wlan1","client":"wlan0"};  // Defaults
	if (fs.existsSync('/usr/local/connectbox/wificonf.txt')) {
		wifi["Access Point Status"] = execute(`grep 'AccessPointIF' /usr/local/connectbox/wificonf.txt | cut -d"=" -f2`);
		wifi["Client Wi-Fi Status"] = execute(`grep 'ClientIF' /usr/local/connectbox/wificonf.txt | cut -d"=" -f2`);
	}
	var response = {
		accesspoint: execute(`iwconfig ${wifi.accesspoint} && ifconfig ${wifi.accesspoint}` || null),
		client: execute(`iwconfig ${wifi.client} && ifconfig ${wifi.client}` || null)
	}
	return (response);
}

//DICT:GET:hostname: Box Hostname
get.hostname = function (){
	return (execute(`cat /etc/hostname`))  
}
//DICT:SET:hostname: Box Hostname
set.hostname = function (json){
	fs.writeFileSync('/etc/hostname',`${json.value}`);  // set hostname
	setBrand({value:`Brand=${json.value}`}); // set in brands.txt
	execute(`sudo sed -i -e "/server_name / s/server_name .*/server_name learn.${json.value} learn.thewell learn.connectbox;/" /etc/nginx/sites-enabled/connectbox_moodle.conf`)
	execute(`sudo sed -i -e "/server_name / s/server_name .*/server_name ${json.value} thewell connectbox;/" /etc/nginx/sites-enabled/connectbox_enhanced.conf`)
	// The http://  value must be handled with \\\/\\\/ because it has to double escape the slashes due to regexp
	execute(`sudo sed -i -e "/wwwroot / s/=.*/= 'http:\\\/\\\/${json.value.toLowerCase()}';/" /var/www/moodle/config.php`)
	execute('nginx -s reload') // Restart nginx now
	return (true)
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

//DICT:DO:umountusb: Unmount USB for safe removal
doCommand.unmountusb = function() {
	return(execute(`sudo pumount /media/usb0`));
}

//DICT:DO:shutdown: Halt system
doCommand.shutdown = function() {
	return(execute(`sudo shutdown -t 1 -h`))
}

//DICT:DO:reboot: Reboot
doCommand.reboot = function() {
	return(execute(`sudo shutdown -t 1 -r`))
}

//DICT:SET:openwelldownload (URL): Download the file and install into OpenWell 
set.openwelldownload = function(json) {
	return(execute(`sudo /usr/bin/python /usr/local/connectbox/bin/lazyLoader.py ${json.value}`));
}

//DICT:DO:openwellusb: Trigger a loading of OpenWell content from USB (openwell.zip OR semi-structured media)
doCommand.openwellusb = function() {
	if (fs.existsSync('/media/usb0/openwell.zip')) {
		return(execute(`scripts/openwellunzip.sh`));
	}
	else {
		return(execute(`sudo python /usr/local/connectbox/bin/enhancedInterfaceUSBLoader.py`))
	}
}

//DICT:SET:coursedownload (URL): Download the Moodle course and install 
set.coursedownload = function(json) {
	execute(`sudo wget -O /tmp/download.mbz ${json.value} >/tmp/course-download.log 2>&1`);
	return(execute(`sudo -u www-data /usr/bin/php /var/www/moodle/admin/cli/restore_backup.php --file=/tmp/download.mbz --categoryid=1`));
}

//DICT:DO:courseusb: Trigger a loading of Moodle content (*.mbz) from USB
doCommand.courseusb = function() {
	execute(`sudo -u www-data /usr/bin/php /var/www/moodle/admin/cli/restore_courses_directory.php /media/usb0/`);
	return true;
}

//DICT:DO:wipe (password): Erase SD Card -- password is wipethebox
doCommand.wipe = function(json) {
    if (json.value === 'wipethebox') {
    	exec(`scripts/wipe.sh &`);
	    return true;
    }
    else {
    	return false;
    }
}

//DICT:SET:securitykey (string): Update the Moodle and Phonehome security key for sync with Dashboard
set.securitykey = function(json) {
	setBrand({value:'server_authorization='+json.value});
	execute(`sudo wget -O /tmp/download.mbz ${json.value} >/tmp/course-download.log 2>&1`);
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
	var response = ''
	try {
		return(execSync(command).toString().replace('\n',''));
	}
	catch (error) {
		return(error.toString());
	}
}

module.exports = {
	auth,
	get,
	set,
	doCommand,
	getBrand,
	setBrand
};