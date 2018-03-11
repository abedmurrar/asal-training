var db = require('../dbconnection'); //reference of dbconnection.js
var crypto = require('crypto');

var User = {

    getAllUsers: function(callback) {

        return db.query("Select * from users", callback);

    },
    getUserById: function(id, callback) {

        return db.query("select * from users where user_id=?", [id], callback);
    },
    addUser: function(User, callback) {
        let password = crypto.createHash('sha256').update(User.password).digest('hex');
        return db.query("Insert into users(username,email,password) values(?,?,?)", [User.username, User.email, password], callback);
    },
    deleteUser: function(id, callback) {
        return db.query("delete from users where user_id=?", [id], callback);
    },
    updateUser: function(id, User, callback) {
        let password = crypto.createHash('sha256').update(User.password).digest('hex');
        return db.query("update users set username=?,email=?,password=? where user_id=?", [User.username, User.email, password, id], callback);
    }

};
module.exports = User;