const admin = require('../models/adminModel');
var md5 = require('md5');

var sess;
module.exports = {
	index: function(req, res) {
		res.render('admin/login', { title: 'Admin Panel', error: req.flash('error') ,success: req.flash('success') });
	},
	authenticate: function(req, res, next) {
		sess = req.session;
		admin
		.checkEmailExist(req.body)
		.then(function(data) {
			if (data[0].total > 0) {
				admin
				.getAdmin(req.body)
				.then(function(rows) {
					sess.user_id = rows[0].id;
					sess.username = rows[0].username;
					sess.email = rows[0].email;
					res.redirect('/admin/dashboard');
				})
				.catch(function(err) {
					req.flash('error', 'Password is not correct.');
					res.redirect('/admin');
				});
			} else {
				req.flash('error', 'Email id doesn`t exist.'), res.redirect('/admin');
			}
		})
		.catch(function() {
			req.flash('error', 'Something went wrong.');
			res.redirect('/admin');
		});
	},
	dashboard: function(req, res, next) {
		sess = req.session;
		if (sess.user_id) {
			res.render('admin/dashboard', {
				title: 'Dashboard',
				error: req.flash('error'),
				success: req.flash('success'),
				username: sess.username,
				email: sess.email
			});
			next();
		} else {
			req.flash('error', 'Your session has expired.');
			res.redirect('/admin');
		}
	},
	signout: function(req, res) {
		sess = req.session;
		sess.user_id = null;
		sess.username = null;
		sess.email = null;
		req.flash('success', 'You have log out successfully.');
		res.redirect('/admin');
		next()
	},
	profile: function(req, res) {
		sess = req.session;
		if (sess.user_id) {
			var id = sess.user_id;
			admin
			.getAdminById({ id: id })
			.then(function(row) {
				res.render('admin/profile', {
					title: 'Profile',
					results: row,
					error: req.flash('error'),
					success: req.flash('success'),
					username: sess.username,
					email: sess.email
				});
			})
			.catch(function(error) {
				req.flash('error', 'Sorry ! Please try again.');
				res.redirect('/admin/dashboard');
			});
		} else {
			req.flash('error', 'Your session has expired.');
			res.redirect('/admin');
		}
	},
	updateProfile: function(req, res, next) {
		sess = req.session;
		if (sess.user_id) {
			var id = sess.user_id;
			var username = req.body.username;
			var old_password = req.body.old_pass;
			var new_password = req.body.new_pass;
			admin.getAdminById({ id: id })
			.then(function(row) {
				if(old_password > 0 & new_password == 0){
					if(new_password > 0 & old_password == 0){
						if (md5(old_password) == row[0].password) {
							admin.updateAdminById({
								id: id,
								username: username,
								old_password: old_password,
								new_password: new_password
							})
							.then(function(row) {
								req.flash('success', 'Profile updated successfully.');
								res.render('admin/profile', {
									title: 'Profile',
									results: row,
									error: req.flash('error'),
									success: req.flash('success'),
									username: username,
									email: sess.email
								});
							})
							.catch(function(error) {
								req.flash('error', 'Sorry ! Please try again.');
								res.redirect('/admin/profile');
								next();
							});
						} 
						else {
							req.flash('error', 'Old password is not correct.');
							res.redirect('/admin/profile');
							next();
						}
					}
					else{
						req.flash('error', 'Enter old and new password.');
						res.redirect('/admin/profile');
						next();
					}
				}
				else{
					admin.updateUsernameById({
						id: id,
						username: username,
					})
					.then(function(row) {
						req.flash('success', 'Username updated successfully.');
						res.render('admin/profile', {
							title: 'Profile',
							results: row,
							error: req.flash('error'),
							success: req.flash('success'),
							username: username,
							email: sess.email
						});
						// res.redirect('/admin/profile');
					})
					.catch(function(error) {
						req.flash('error', 'Sorry ! Please try again.');
						res.redirect('/admin/profile');
						next();
					});
				}				
			})
			.catch(function(error) {
				req.flash('error', 'Something went wrong.');
				res.redirect('/admin/profile');
				next();
			});
		} else {
			req.flash('error', 'Your session has expired.');
			res.redirect('/admin');
		}
	},
};
