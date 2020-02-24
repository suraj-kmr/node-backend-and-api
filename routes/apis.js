var express = require('express');
var router = express.Router();
var md5 = require('md5');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const multer = require('multer');

var User = require('../models/userModel.js');
var config = require('../config');

var app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const DIR = './public/images/users';
var path = require('path');
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, DIR);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
 
let upload = multer({storage: storage});

// /* GET users listing. */
// router.get('/', function(req, res, next) {
// 	res.send('respond with a resource');
// });

/* users registration. */
router.post('/register', function(req, res, next){ 
	var user = {
		name:req.body.name,
		email:req.body.email,
		password:md5(req.body.password),
		created_at:new Date().getTime(),
		updated_at:new Date().getTime(),
	}
	User.checkEmailExist(req.body.email,function(err, result){
		if (err) {
			return res.status(500).send({success: false, message:err});
		}
		else{
			if(result[0].total > 0){
				return res.status(409).send({success: false, message:"Email already registered."});
			}
			else{
				User.addUser(user, function(err, count) {  
					if (err) {
						return res.status(500).send({success: false, message:"There was a problem registering the user."});
					}
					else{
						if(count.insertId){
					    	//create a token
					    	var token = jwt.sign({ id: count.insertId }, config.secret, {
					      		expiresIn: 86400 // expires in 24 hours
					      	});
					    	res.status(200).send({ success: true, user_id: count.insertId, token: token, message:'Email registered successfully.'});
					    }
					    else{
					    	return res.status(500).send({success: false, message:"There was a problem registering the user.."});
					    }
					}
				});
			}
		}
	});

});

/* Login. */
router.post('/login', function(req, res, next){
	var pass = md5(req.body.password);
	User.findOne(req.body.email, function (err, data) {
		if (err) return res.status(500).send({ success: true, message:'Error on the server.'});
		if (!data) return res.status(404).send({ success: true, message:'No user found.'});

		if (data[0].password != pass) 
			return res.status(401).send({ success: false, token: null ,message:'Password is not correct'});

		var token = jwt.sign({ id: data[0].id }, config.secret, {
		    expiresIn: 86400 // expires in 24 hours
		});
		res.status(200).send({ success: true, user_id: data[0].id, token: token, message:'You have login successfully.'});
	});
	
});

/* GET users detail. */
router.get('/profile', function(req, res, next){
	var token = req.headers['x-access-token'];
	if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });

	jwt.verify(token, config.secret, function(err, decoded) {
		if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

		User.getUserById(decoded.id, function (err, result) {
	    	if (err) return res.status(500).send("There was a problem finding the user.");
	    	if (!result) return res.status(404).send({success:false, message:"No user found."});

	      	res.status(200).send({ success: true, users: result, message:'Profile fetch successfully.'}); //Comment this out!
	      	// next(result); // add this line
	  	});
	});
	
});

/*Update Profile */
router.post('/profile-update', upload.single('profile'), function(req, res, next){
	var user = {
		name:req.body.name,
		image:req.file.filename
	}
	var token = req.headers['x-access-token'];
	if (!token) return res.status(401).send({ success: false, message: 'No token provided.' });

	jwt.verify(token, config.secret, function(err, decoded) {
		if (err) return res.status(500).send({ success: false, message: 'Failed to authenticate token.' });

		User.updateUser(decoded.id, user, function (err, result) {
	    	if (err) return res.status(500).send("There was a problem finding the user.");
	    	if (!result) return res.status(404).send({success:false, message:"No user found."});
	      	res.status(200).send({ success: true, user_id: decoded.id, message:'Profile updated successfully.'}); //Comment this out!
	      	// next(result); // add this line
	  	});
	});
});

/* Log Out */
router.get('/logout', function(req, res, next){
	res.status(200).send({ success: true, token: null , message:'You have logout successfully.'});
});

module.exports = router;