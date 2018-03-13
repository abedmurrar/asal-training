var db = require('../dbconnection'); //reference of dbconnection.js
var crypto = require('crypto');

const usernameRegex = /^[a-z](([a-z0-9][_\.\-]{0,1}){6,22})[a-z]$/;
const emailRegex = /^[a-z0-9|_]([a-z0-9][_\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/;
const passwordRegex = /^.{7,}$/;
var User = {


    getAllUsers: function(callback) {

        return db.select('*').from('users').then(callback);
        // return db.query("Select * from users", callback);

    },
    getUserById: function(id, callback) {
        return db.select('*').from('users').where('id', id).then(callback);
        // return db.query("select * from users where user_id=?", [id], callback);
    },
    addUser: function(User, callback) {
        var errors = {};
        var isValid = true;
        let username = User.username.trim().toLowerCase();
        let email = User.email.trim().toLowerCase();
        let password = User.password;
        if (username == '' || !usernameRegex.test(username)) {
            isValid = false;
            errors["username"] = 'Username is not valid';
            //errors.push({ username: 'username is not valid' })
        }
        if (email == '' || !emailRegex.test(email)) {
            isValid = false;
            errors["email"] = 'Email is not valid';
        }
        if (!passwordRegex.test(password)) {
            isValid = false;
            errors["password"] = 'Password must be at least 7 characters';
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
        try {
            var errors = {};
            var sql = 'update users set '
            var entries = [];
            let username = User.username.trim().toLowerCase();
            let email = User.email.trim().toLowerCase();
            let password = User.password;
            if (username == '' || !usernameRegex.test(username)) {
                errors["username"] = 'Username is not valid';
                //errors.push({ username: 'username is not valid' })
            } else {
                entries.push(username);
                sql += 'username = ?'
            }
            if (email == '' || !emailRegex.test(email)) {
                errors["email"] = 'Email is not valid';
            } else {
                entries.push(email);
                if (entries.length > 0)
                    sql += ',email = ?';
                else
                    sql += 'email = ?';
            }
            if (password == '' || !passwordRegex.test(password)) {
                errors["password"] = 'Password must be at least 7 characters';
            } else {
                let passwordEncoded = crypto.createHash('sha256').update(password).digest('hex');
                entries.push(passwordEncoded);
                if (entries.length > 0)
                    sql += ',password = ?';
                else
                    sql += 'password = ?';
            }
            if (entries.length > 0) {
                entries.push(id);
                sql += ' where user_id=?';
                return db.query(sql, entries, callback);
            } else if (entries.length == 0) {
                errors["code"] = 422;
            } else {
                errors["code"] = 400;
            }
            callback(errors);
        } catch (error) {
            callback({ code: 500, failure: "Invalid data format or empty data" });
        }

    }

};
module.exports = User;