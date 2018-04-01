var database = require('../dbconnection')
var moment = require('moment')
var User = require('./User')

const format = 'YYYY-MM-DD HH:mm:ss'

const tables = {
  resets: 'resets',
  users: 'users',
  roles: 'user_role'
}

var Reset = {

  generateToken: (email, uuid, success, failure) => {
    var id = 0 // no user has id of 0
    User.getUserByEmail(email, data => {
      if (Object.keys(data).length > 0) {
        id = data.id
        return database(tables.resets)
          .insert({ token: uuid, user_id: id })
          .then(success)
          .catch(failure)
        // console.log(id)
      }
    },
    error => {
      console.log(error)
    })
  },
  getUserByToken: (token, success, failure) => {
    return database(tables.resets)
      .select('*')
      .join(tables.users, (query) => {
        query.on('user_id', '=', 'id')
      })
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

module.exports = Reset
