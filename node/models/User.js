var db = require('../dbconnection'); //reference of dbconnection.js
var crypto = require('crypto'); //crypto package
var HttpStatus = require('http-status-codes'); //http status codes package

const usernameRegex = /^[a-z](([\w][\.\-]{0,1}){6,22})[a-z]$/;
/*
 * Username Regular Expression
 * a username must start and end with an alphabet
 * a username at least 7 characters and at most 24 characters of alphabets and digits
 * can contain [.] dot but not repeatedly, [-] dash but not repeatedly, and [_] underscore 
 */
const emailRegex = /^[\w]([\w][\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/;
/*
 * Email Regular Expression
 * an email is validated with respect to some of the RFC 5322 Syntax
 * https://tools.ietf.org/html/rfc5322
 */
const passwordRegex = /^.{7,}$/;
/*
 * Password Regular Expression
 * a password must contain at least 7 characters
 */
const table = 'users'; //database table name

/*
 * id       -> Integer, id of the row (or user)
 * User     -> Object with attributes of (username,email,password)
 * success  -> Function to call if no errors were caught
 * failure  -> Function to call if errors were caught
 */

var User = {

    getAllUsers: (success, failure) => {
        return db(table)
            .select('*')
            .then(success)
            .catch(failure);
    },
    getUserById: (id, success, failure) => {
        return db(table)
            .select('*')
            .where('id', id)
            .then(success)
            .catch(failure);
    },
    addUser: (User, success, failure) => {
        var errors = {};
        var isValid = true;
        try {
            let username = User.username.trim().toLowerCase();
            let email = User.email.trim().toLowerCase();
            let password = User.password;
            if (username == '' || !usernameRegex.test(username)) {
                isValid = false;
                errors["username"] = 'Username is not valid';
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
                console.log(passwordEncoded);
                return db(table)
                    .insert({ username: username, password: passwordEncoded, email: email })
                    .then(success)
                    .catch(failure);
            }
            errors["code"] = HttpStatus.BAD_REQUEST;
            failure(errors);

        } catch (error) {
            // if a User object was passed but didn't have one of the three attributes
            return failure();
        }
    },
    deleteUser: (id, success, failure) => {
        return db(table)
            .del()
            .where('id', id)
            .then(success)
            .catch(failure);
    },
    updateUser: (id, User, success, failure) => {
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
                    password = crypto
                        .createHash('sha256')
                        .update(password)
                        .digest('hex');
                    entries.password = password;
                }
            }
            if (Object.keys(entries).length > 0) {
                return db(table)
                    .update(entries)
                    .where('id', id)
                    .then(success)
                    .catch(failure);
            } else if (entries.length == 0) {
                errors["code"] = HttpStatus.UNPROCESSABLE_ENTITY;
            } else {
                errors["code"] = HttpStatus.BAD_REQUEST;
            }
            failure(errors);
        } catch (error) {
            failure({ code: HttpStatus.INTERNAL_SERVER_ERROR, failure: "Invalid data format!" });
        }

    },
    isExist: (User, success, failure) => {
        return db(table)
            .select('*')
            .where('username', User.username)
            .andWhere('email', User.email)
            .andWhere('password', User.password)
            .then(success)
            .catch(failure);
    },
    login: (User, success, failure) => {
        if (User.username && User.username.length && User.password && User.password.length) {
            return db(table)
                .select('username', 'password')
                .where('username', User.username)
                .andWhere('password', crypto
                    .createHash('sha256')
                    .update(User.password)
                    .digest('hex'))
                .then(success)
                .catch(failure);
        } else {
            failure({ error: HttpStatus.UNPROCESSABLE_ENTITY, failure: 'Invalid data format' });
        }
    }

};
module.exports = User;