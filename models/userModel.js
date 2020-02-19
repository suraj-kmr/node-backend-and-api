var sql = require('../db');
var md5 = require('md5');

module.exports = {
    getAllUsers: function(callback) {  
        return sql.query("Select * from users", callback);  
    },  
    getUserById: function(id, callback) {  
        return sql.query("select * from users where id=?", [id], callback);  
    },  
    addUser: function(User, callback) {  
        return sql.query("Insert into users values(?,?,?,?,?,?)", ['',User.name, User.email, User.password,'',''], callback);  
    },  
    deleteUser: function(id, callback) {  
        return sql.query("delete from users where id=?", [id], callback);  
    },  
    updateUser: function(id, User, callback) {  
        return sql.query("update users set Title=?,Status=? where id=?", [User.name, User.email, User.password, id], callback);  
    },
    checkEmailExist: function(email, callback){
        return sql.query('select count(*) as total from users where email=?', [email], callback);
    },
    checkPassword: function(email,password, callback){
        return sql.query('select * as total from users where email=?,password=?', [email,password], callback);
    },
    findOne: function(email, callback){
        return sql.query('select * from users where email=?', [email], callback);
    },
};