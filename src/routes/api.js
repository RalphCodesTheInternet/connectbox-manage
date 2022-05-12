const express = require('express'),
    router = express.Router()
    configs = require('../configs.js'),
    fs = require('fs'),
    Logger = require('../logger.js'),
    logger = new Logger(configs.logging),
    functions = require('../functions.js');



router.get('/do/:command', function doCommand(req,res) {
	var data = {code:0,result: [functions.doCommand[req.params.command]()]};
	logger.log('debug', `${req.method} ${req.originalUrl}: ${data.result[0]}`);
	if (data.result[0].status) {
		res.status(data.result[0].status).send(data.result[0].message);
	}
	else {
		res.send(data);
	}
});

router.get('/brand/:key', function get(req, res) {
	var data = {code:0,result: [functions.getBrand(req.params.key)]};
	logger.log('debug', `${req.method} ${req.originalUrl}: ${data.result[0]}`);
	res.send(data);
});

router.get('/logs/:log', function get(req, res) {
	var data = {code:0,result: [functions.getLogs(req.params.log)]};
	logger.log('debug', `${req.method} ${req.originalUrl}: ${data.result[0]}`);
	res.send(data);
});

/**
 * Routes for LMS
 */
router.get('/lms/:key/:id(\\d+)', async function get(req, res) {
  if (!('lms_'+req.params.key in functions.get)) {
    res.sendStatus(404);
    return;
  }
  const result = await functions.get['lms_'+req.params.key](req.params.id);
  var data = {code:0,result: result};
  res.send(data);
});
router.get('/lms/:key', async function get(req, res) {
  if (!('lms_'+req.params.key in functions.get)) {
    res.sendStatus(404);
    return;
  }
  const result = await functions.get['lms_'+req.params.key]();
  var data = {code:0,result: result};
  res.send(data);
});
router.post('/lms/:key', async function post(req, res) {
  if (!('lms_'+req.params.key in functions.post)) {
    res.sendStatus(404);
    return;
  }
  const result = await functions.post['lms_'+req.params.key](req.body);
  var data = {code:0,result: result};
  res.send(data);
});
router.delete('/lms/:key/:id(\\d+)', async function del(req, res) {
  if (!('lms_'+req.params.key in functions.del)) {
    res.sendStatus(404);
    return;
  }
  const result = await functions.del['lms_'+req.params.key](req.params.id);
  var data = {code:0,result: result};
  res.send(data);
});

router.get('/:key', function get(req, res) {
	var data = {code:0,result: [functions.get[req.params.key]()]};
	logger.log('debug', `${req.method} ${req.originalUrl}: ${data.result[0]}`);
	res.send(data);
});

router.put('/brand', function set(req,res) {
	var data = {code:0,result: [functions.setBrand(req.body)]};
	logger.log('debug', `${req.method} ${req.originalUrl}: ${JSON.stringify(data.result[0])}`);
	if (data.result[0].status) {
		res.status(data.result[0].status).send(data.result[0].message);
	}
	else {
		res.send(data);
	}
});

router.put('/:key', function set(req,res) {
	var data = {code:0,result: [functions.set[req.params.key](req.body)]};
	logger.log('debug', `${req.method} ${req.originalUrl}: ${JSON.stringify(data.result[0])}`);
	if (data.result[0].status) {
		res.status(data.result[0].status).send(data.result[0].message);
	}
	else {
		res.send(data);
	}
});

module.exports = router;
