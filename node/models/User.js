var database = require('../dbconnection') // reference of dbconnection.js
var crypto = require('crypto') // crypto package
var HttpStatus = require('http-status-codes') // http status codes package
var uuidv1 = require('uuid/v1')
var moment = require('moment')

const usernameRegex = /^[a-z](([\w][\.\-]{0,1}){6,22})[a-z]$/
/*
* Username Regular Expression
* a username must start and end with an alphabet
* a username at least 7 characters and at most 24 characters of alphabets and digits
* can contain [.] dot but not repeatedly, [-] dash but not repeatedly, and [_] underscore
*/
const emailRegex = /^[\w]([\w][\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/
/*
* Email Regular Expression
* an email is validated with respect to some of the RFC 5322 Syntax
* https://tools.ietf.org/html/rfc5322
*/
const passwordRegex = /^.{7,}$/
/*
* Password Regular Expression
* a password must contain at least 7 characters
*/
const tables = { // database table name
  users: 'users',
  roles: 'user_role',
  resets: 'resets'
}

const format = 'YYYY-MM-DD HH:mm:ss'

/*
 * id       -> Integer, id of the row (or user)
 * User     -> Object with attributes of (username,email,password)
 * success  -> Function to call if no errors were caught
 * failure  -> Function to call if errors were caught
 */

// admin password 0598243335admin

var User = {

  getAllUsers: (success, failure) => {
    return database(tables.users)
      .join(tables.roles, (query) => {
        query.on('u_role', '=', 'role_id')
      })
      .select('id', 'username', 'password', 'email', 'role')
      .then(success)
      .catch(failure)
  },
  getUserById: (id, success, failure) => {
    return database(tables.users)
      .select('id', 'username', 'password', 'email', 'role')
      .join(tables.roles, (query) => {
        query.on('u_role', '=', 'role_id')
      })
      .where('id', id)
      .first()
      .then(success)
      .catch(failure)
  },
  getUserByUsername: (username, success, failure) => {
    if (username.length) {
      return database(tables.users)
        .join(tables.roles, (query) => {
          query.on('u_role', '=', 'role_id')
        })
        .select('*')
        .where('username', username)
        .first()
        .then(success)
        .catch(failure)
    } else {
      failure({ message: 'Empty request' })
    }
  },
  getUserByEmail: (email, success, failure) => {
    if (email.length) {
      return database(tables.users)
        .join(tables.roles, (query) => {
          query.on('u_role', '=', 'role_id')
        })
        .select('*')
        .where('email', email)
        .first()
        .then(success)
        .catch(failure)
    } else {
      failure({ message: 'Empty request' })
    }
  },
  addUser: (User, success, failure) => {
    var errors = {}
    var isValid = true
    try {
      let username = User.username.trim().toLowerCase()
      let email = User.email.trim().toLowerCase()
      let password = User.password
      if (username === '' || !usernameRegex.test(username)) {
        isValid = false
        errors['username'] = 'Username is not valid'
      }
      if (email === '' || !emailRegex.test(email)) {
        isValid = false
        errors['email'] = 'Email is not valid'
      }
      if (!passwordRegex.test(password)) {
        isValid = false
        errors['password'] = 'Password must be at least 7 characters'
      }
      if (isValid) {
        let passwordEncoded = crypto.createHash('sha256').update(password).digest('hex')
        return database(tables.users)
          .insert({ username: username, password: passwordEncoded, email: email })
          .then(success)
          .catch(failure)
      }
      failure(errors)
    } catch (error) {
      // if a User object was passed but didn't have one of the three attributes
      return failure()
    }
  },
  deleteUser: (id, success, failure) => {
    return database(tables.users)
      .del()
      .where('id', id)
      .then(success)
      .catch(failure)
  },
  updateUser: (id, User, success, failure) => {
    try {
      var errors = {}
      var entries = { last_modified: new Date() }
      if (User.username) {
        let username = User.username.trim().toLowerCase()
        if (!username.length || !usernameRegex.test(username)) {
          errors['username'] = 'Username is not valid'
        } else {
          entries.username = username
        }
      }
      if (User.email) {
        let email = User.email.trim().toLowerCase()
        if (!email.length || !emailRegex.test(email)) {
          errors['email'] = 'Email is not valid'
        } else {
          entries.email = email
        }
      }
      if (User.password) {
        let password = User.password
        if (!password.length || !passwordRegex.test(password)) {
          errors['password'] = 'Password must be at least 7 characters'
        } else {
          password = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex')
          entries.password = password
        }
      }
      if (Object.keys(entries).length > 0) {
        return database(tables.users)
          .update(entries)
          .where('id', id)
          .then(success)
          .catch(failure)
      }
      failure(errors)
    } catch (error) {
      failure({ code: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Invalid data format!' })
    }
  },
  logUser: (id, success, failure) => {
    return database(tables.users)
      .update({ last_logged: new Date() })
      .where('id', id)
      .then(success)
      .catch(failure)
  },
  generateToken: (email, success, failure) => {
    var id
    this.getUserByEmail(email, data => {
      if (Object.keys(data).length > 0) {
        id = data.id
      }
    },
    error => {
      console.log(error)
    })
    return database(tables.resets)
      .insert({ token: uuidv1(), user_id: id })
      .then(success)
      .catch(failure)
  },
  getToken: (token, success, failure) => {
    return database(tables.resets)
      .select('*')
      .where('token', token)
      .andWhereBetween('request_time', [moment().subtract(1, 'days').format(format), moment().format(format)])
      .first()
      .then(success)
      .catch(failure)
  },
  getTokenByEmail: (email, success, failure) => {
    if (email.length) {
      return database(tables.users)
        .join(tables.roles, (query) => {
          query.on('u_role', '=', 'role_id')
        })
        .join(tables.resets, (query) => {
          query.on('id', '=', 'user_id')
        })
        .select('*')
        .where('email', email)
        .andWhereBetween('request_time',
          [
            moment()
              .subtract(1, 'days')
              .format(format),
            moment()
              .format(format)
          ])
        .first()
        .then(success)
        .catch(failure)
    } else {
      failure({ message: 'Empty request' })
    }
  }
}
module.exports = User
