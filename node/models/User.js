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
        var errors = {};
        var isValid = true;
        var usernameRegex = /^[a-z](([a-z0-9][_\.\-]{0,1}){6,22})[a-z]$/;
        var emailRegex = /^[a-z0-9|_]([a-z0-9][_\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/;
        var passwordRegex = /^.{7,}$/;
        let username = User.username.trim().toLowerCase();
        let email = User.email.trim().toLowerCase();
        let password = User.password;
        if (username == '' || !usernameRegex.test(username)) {
            isValid = false;
            errors["username"] = 'username is not valid';
            //errors.push({ username: 'username is not valid' })
        }
        if (email == '' || !emailRegex.test(email)) {
            isValid = false;
            errors["email"] = 'email is not valid';
        }
        if (!passwordRegex.test(password)) {
            isValid = false;
            errors["password"] = 'password must be at least 7 characters';
        }
        if (isValid) {
            let passwordEncoded = crypto.createHash('sha256').update(password).digest('hex');
            return db.query("Insert into users(username,email,password) values(?,?,?)", [username, email, passwordEncoded], callback);
        }
        errors["code"] = 400;
        callback(errors);
    },
    deleteUser: function(id, callback) {
        return db.query("delete from users where user_id=?", [id], callback);
    },
    updateUser: function(id, User, callback) {
        var errors = {};
        var sql = 'update users set '
        var isValid = true;
        var entries = [];
        var usernameRegex = /^[a-z](([a-z0-9][_\.\-]{0,1}){6,22})[a-z]$/;
        var emailRegex = /^[a-z0-9|_]([a-z0-9][_\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/;
        var passwordRegex = /^.{7,}$/;
        let username = User.username.trim().toLowerCase();
        let email = User.email.trim().toLowerCase();
        let password = User.password;
        if (username == '' || !usernameRegex.test(username)) {
            isValid = false;
            errors["username"] = 'username is not valid';
            //errors.push({ username: 'username is not valid' })
        } else {
            entries.push(username);
            sql += 'username = ?'
        }
        if (email == '' || !emailRegex.test(email)) {
            isValid = false;
            errors["email"] = 'email is not valid';
        } else {
            entries.push(email);
            if (entries.length > 0)
                sql += ',email = ?';
            else
                sql += 'email = ?';
        }
        if (password == '' || !passwordRegex.test(password)) {
            isValid = false;
            errors["password"] = 'password must be at least 7 characters';
        } else {
            let passwordEncoded = crypto.createHash('sha256').update(password).digest('hex');
            entries.push(passwordEncoded);
            if (entries.length > 0)
                sql += ',password = ?';
            else
                sql += 'password = ?';
        }
        if (isValid) {
            entries.push(id);
            sql += ' where user_id=?';
            return db.query(sql, entries, callback);
        }
        errors["code"] = 400;
        callback(errors);
    }

};
module.exports = User;