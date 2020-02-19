var sql = require('../db');
var md5 = require('md5');

module.exports = {
	checkEmailExist: function(req,res) {
		return new Promise(function(resolve, reject) {
			sql.query("Select count(*) as total from admin where email = '"+ req.email +"'", function (err, count) {
				if (err) 
				console.log(err)
				else 
					resolve(count);
			});
		});
	},
	getAdmin: function(req,res) {
		return new Promise(function(resolve, reject) {
			sql.query("Select * from admin where email = '"+ req.email +"' and password = '"+ md5(req.password)+"'", function (err, rows) {
				if (err) 
				console.log(err)
				else 
					resolve(rows);
			});
		});
	},
	getAdminById: function(req,res) {
		return new Promise(function(resolve, reject) {
			sql.query("Select * from admin where id = '"+ req.id +"'", function (err, row) {
				if (err) 
				console.log(err)
				else 
					resolve(row);
			});
		});
	},
	updateAdminById: function(req,res) {
		return new Promise(function(resolve, reject) {
			sql.query("UPDATE admin SET username = '"+req.username+"', password = '"+md5(req.new_password)+"' where id = '"+ req.id +"'", function (err, row) {
				if (err) 
					console.log(err)
				else 
					resolve(row);
			});
		});
	},
	updateUsernameById(req,res){
		return new Promise(function(resolve, reject) {
			sql.query("UPDATE admin SET username = '"+req.username+"' where id = '"+ req.id +"'", function (err, row) {
				if (err) 
					console.log(err)
				else 
					resolve(row);
			});
		});
	}
}
