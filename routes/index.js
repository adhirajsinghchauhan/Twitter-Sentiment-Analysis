'use strict';
var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
var twitterSearch = require('../logic/twitterSearch');
var db = require('diskdb');
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/ittproject';

var app = express();
app.use(cookieParser());

var apiCallCount = -1;

db = db.connect('logic/db', ['blah']);

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});

router.post('/sendMessage', function(req, res) {
	sendMessage(req.body.search, function(data) {
		res.json(data);
	});
});

router.get('/account', function(req, res) {
	res.render('account');
});

router.post('/login', function(req, res) {
	mongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Unable to connect to MongoDB server: ', err);
		} else {
			var _id = {
				username: req.body.username,
				password: req.body.password
			};
			var user = db.collection('users').findOne(_id, function(err, document) {
				console.log(document);
			});

			// users.insert(newUser, function(err, result) {
			// 	if (err) {
			// 		console.log("Could not insert into database: ", err);
			// 		res.json(err);
			// 	} else {
			// 		console.log("Inserted into database: ", result);
			// 		res.json(result);
			// 	}
			// });
			db.close();
		}
	});
});

router.post('/signup', function(req, res) {
	mongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Unable to connect to MongoDB server: ', err);
		} else {
			var users = db.collection('users');
			var newUser = {
				_id: {
					username: req.body.username,
					password: req.body.password
				},
				email: req.body.email
			};

			users.insert(newUser, function(err, result) {
				if (err) {
					console.log("Could not insert into database: ", err.message);
					res.send({
						error: 'err.message'
					});
				} else {
					console.log("Inserted into database: ", result);
					res.send({
						result: result
					});
				}
			});
			db.close();
		}
	});
});

router.get('/index', function(req, res) {
	res.render('index');
});

router.get('/about', function(req, res) {
	res.render('about');
});

router.get('/services', function(req, res) {
	res.render('services');
});

router.get('/portfolio', function(req, res) {
	res.render('portfolio');
});

router.get('/sentiment', function(req, res) {
	res.cookie('apiCallCount', ++apiCallCount, {
		maxAge: 900000,
		httpOnly: true
	});
	console.log(req.cookies.apiCallCount);

	if (apiCallCount >= 50) {
		res.render('sentiment', {
			'error': true,
			'message': 'API Calls Exceeded'
		});
	} else {
		res.render('sentiment', {
			'error': false,
			'message': 'None'
		});
	}
});

router.post('/search', function(req, res) {
	twitterSearch(req.body.search, function(data) {
		res.json(data);
		// db.blah.save(data);
	});
});

module.exports = router;
