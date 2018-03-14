var db = require('../dbconnection'); //reference of dbconnection.js
var crypto = require('crypto');

const usernameRegex = /^[a-z](([a-z0-9][_\.\-]{0,1}){6,22})[a-z]$/;
const emailRegex = /^[a-z0-9|_]([a-z0-9][_\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/;
const passwordRegex = /^.{7,}$/;
const table = 'users';
var User = {

    getAllUsers: function(success, failure) {
        return
        db(table)
            .select('*')
            .then(success)
            .catch(failure);
    },
    getUserById: function(id, success, failure) {
        return
        db(table)
            .select('*')
            .where('id', id)
            .then(success)
            .catch(failure);
    },
    addUser: function(User, success, failure) {
        var errors = {};
        var isValid = true;
        try {
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
                return
                db(table)
                    .insert({ username: username, password: passwordEncoded, email: email })
                    .then(success)
                    .catch(failure);
                // return db.query("Insert into users(username,email,password) values(?,?,?)", [username, email, passwordEncoded], success,failure);
            }
            errors["code"] = 400;
            failure(errors);

        } catch (error) {
            return failure();
        }
    },
    deleteUser: function(id, success, failure) {
        return db(table).del().where('id', id)
            .then(success)
            .catch(failure);
    },
    updateUser: function(id, User, success, failure) {
        try {
            var errors = {};
            var entries = {};
            if (User.username) {
                let username = User.username.trim().toLowerCase();
                if (!username.length || !usernameRegex.test(username)) {
                    errors["username"] = 'Username is not valid';
                } else {
                    entries.username = username;
                }
            }
            if (User.email) {
                let email = User.email.trim().toLowerCase();
                if (!email.length || !emailRegex.test(email)) {
                    errors["email"] = 'Email is not valid';
                } else {
                    entries.email = email;
                }
            }
            if (User.password) {
                let password = User.password;
                if (!password.length || !passwordRegex.test(password)) {
                    errors["password"] = 'Password must be at least 7 characters';
                } else {
                    password =
                        crypto
                        .createHash('sha256')
                        .update(password)
                        .digest('hex');
                    entries.password = password;
                }
            }
            if (Object.keys(entries).length) {
                return
                db(table)
                    .update(entries)
                    .where('id', id)
                    .then(success)
                    .catch(failure);
            } else if (entries.length == 0) {
                errors["code"] = 422;
            } else {
                errors["code"] = 400;
            }
            success, failure(errors);
        } catch (error) {
            failure({ code: 500, failure: "Invalid data format!" });
        }

    }

};
module.exports = User;