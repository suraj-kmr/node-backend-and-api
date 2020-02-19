var express = require('express');
const multer = require('multer');
var router = express.Router();

const DIR = './public/images/setting';
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

var admin_controller = require('../controllers/AdminController.js');
var setting_controller = require('../controllers/SettingController.js');

/* GET Login page. */
router.get('/', admin_controller.index);
/* Admin authentication */
router.post('/authentication', admin_controller.authenticate);
/* Dashboard page*/
router.get('/dashboard', admin_controller.dashboard);
/* Profile page*/
router.get('/profile', admin_controller.profile);
/* Update profile page*/
router.post('/profile-update', admin_controller.updateProfile);
/* SignOut page*/
router.get('/logout', admin_controller.signout);

/* GET Setting page. */
router.get('/settings', setting_controller.index);
/* Save setting */
router.post('/save-setting',upload.single('logo'), setting_controller.store);


module.exports = router;
