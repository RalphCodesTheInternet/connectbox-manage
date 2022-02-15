const express = require('express'),
    router = express.Router()
    configs = require('../configs.js'),
    fs = require('fs'),
    Logger = require('../logger.js'),
    logger = new Logger(configs.logging),
    functions = require('../functions.js');





router.get('/:call', function get(req, res) {
	var data = {code:0,result: [functions.get[req.params.call]() || '']};
	logger.log('debug', `${req.method} ${req.originalUrl}: ${data.result[0]}`);
	res.send(data);
});

router.put('/:call', function set(req,res) {
	var data = {code:0,result: [functions.set[req.params.call](req.body) || '']};
	logger.log('debug', `${req.method} ${req.originalUrl}: ${JSON.stringify(req.body)} ${data.result[0]}`);
	res.send(data);
});


module.exports = router;
