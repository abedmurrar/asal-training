var database = require('../config_mysql') // reference of config_mysql.js
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
    User.getUserByEmail(email, data => {
      database(tables.resets)
        .insert({ token: uuid, user_id: data.id })
        .then(success)
        .catch(failure)
    },
      error => {
        console.log(error)
      })
  },
  getUserByToken: (token, success, failure) => {
    database(tables.resets)
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
    database(tables.users)
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
  }
}

module.exports = Reset
