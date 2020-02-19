const site = require('../models/settingModel');
var md5 = require('md5');
const multer = require('multer');

var sess;
module.exports = {
	index: function(req, res) {
        sess= req.session;
        if(sess.user_id){
            site.getSettings()
            .then(function(rows){
                res.render('admin/setting', {
                    result: rows,
                    title: 'Site Setting', 
                    error: req.flash('error'),
                    success: req.flash('success') 
                });
            })
            .catch(function(err){
                req.flash('error','Something went wrong.');
                res.redirect('/admin/settings');
            })
        }
        else{
            req.flash('error','Your session has expired.');
            res.redirect('/admin');
        }
    },
    store: function(req, res) {
        sess = req.session;
		if (sess.user_id) {
            site.update(req)
            .then(function(row){
                req.flash('success', 'settings saved successfully.');
                res.redirect('/admin/settings');
                next();
            })
            .catch(function(err){
                req.flash('error', 'please try again.');
                res.redirect('/admin/settings');
                next();
            })
        }
        else{
            req.flash('error', 'Your session has expired.');
			res.redirect('/admin');
        }
    }
};