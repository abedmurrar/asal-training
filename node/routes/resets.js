const express = require('express'),
  router = express.Router(),
  // const User = require('../models/mysql/User')
  // const Reset = require('../models/mysql/Reset')
  User = require('../models/mongodb/User'),
  HttpStatus = require('http-status-codes') // http status codes package

var nodemailer = require('nodemailer')

router.put('/:token', (req, res, next) => {
  // Reset.getUserByToken(req.params.token,
  User.getUserByToken(req.params.token,
    data => {
      var _id = data._id
      var password = req.body.password
      var confirm = req.body.confirmPassword
      return User.changePassword(_id, password, confirm,
        data => {
          if (data) {
            return res.status(HttpStatus.OK).json({
              success: true,
              message: 'Password changed',
              password: 'Password changed'
            })
          } else {
            return res.status(HttpStatus.NOT_IMPLEMENTED).json({
              success: false,
              message: 'Password not changed'
            })
          }
        },
        error => {
          return next(error)
        })

    }, error => {
      return next(error)
    })
})

router.post('/', (req, res, next) => {
  User.generateToken(req.body.email,
    data => {
      nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'asaltechmailer@gmail.com',
          pass: '0598243335admin'
        }
      }).sendMail({
        from: 'asaltechmailer@gmail.com',
        to: req.body.email,
        subject: 'Password reset for asaltech Abed Al Rahman Murrar Task',
        html: "<p>You've received this email because of a password reset request" +
          ", if you didn't make this request you can ignore it, otherwise, " +
          'you have 24 hours before your request is invalid. If you don\'t remember making this request ignore this email.</p> <a href="http://localhost:8080/recover/' + data.token + '">Reset now</a> '
      }, (error, info) => {
        if (error) {
          return next(new Error('Mail not sent'))
        } else {
          return res.status(HttpStatus.OK).json({
            success: true,
            message: info.response
          })
        }
      })
    },
    error => {
      return next(error)
    }
  )
})

router.use('/:token', (error, req, res, next) => {
  return res.status(HttpStatus.BAD_REQUEST).json({
    success: false,
    message: 'Token may be timed out, or passwords do not match'
  })
})

router.use((error, req, res, next) => {
  return res.status(HttpStatus.BAD_REQUEST).json({
    success: false,
    message: 'Could not make your request, please check if the email is inserted correctly'
  })
})
module.exports = router