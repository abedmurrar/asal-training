const express = require('express')
const router = express.Router()
// const User = require('../models/mysql/User')
// const Reset = require('../models/mysql/Reset')
const User = require('../models/mongodb/User')
const debug = require('debug')('reset-api')
var nodemailer = require('nodemailer')
// var uuidv1 = require('uuid/v1')
var HttpStatus = require('http-status-codes') // http status codes package

router.put('/:token', (req, res) => {
  // Reset.getUserByToken(req.params.token,
  User.getUserByToken(req.params.token,
    data => {
      if (Object.keys(data).length > 0) {
        var _id = data._id
        var password = req.body.password
        var confirm = req.body.confirmPassword
        User.changePassword(_id, password, confirm,
          data => {
            if (data) {
              res.status(HttpStatus.OK).json({
                success: true,
                message: 'Password changed',
                password: 'Password changed'
              })
            } else {
              res.status(HttpStatus.NOT_IMPLEMENTED).json({
                success: false,
                message: 'Password not changed'
              })
            }
          },
          error => {
            if (error) {
              res.status(HttpStatus.NOT_ACCEPTABLE).json({
                success: false,
                message: 'Password invalid',
                password: 'Password invalid'
              })
            } else {
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Inavlid parameters'
              })
            }
          })
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false
        })
      }
    }, error => {
      if (error) {
        debug(error)
        res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
          success: false
        })
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false
        })
      }
    })
})
// here you send your email to generate a token
router.post('/', (req, res) => {
  // var token = uuidv1()
  try {
    // Reset.generateToken(req.body.email, token,
    User.generateToken(req.body.email,
      data => {
        if (data.length > 0) {
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'asaltechmailer@gmail.com',
              pass: '0598243335admin'
            }
          })

          var mailOptions = {
            from: 'asaltechmailer@gmail.com',
            to: req.body.email,
            subject: 'Password reset for asaltech Abed Al Rahman Murrar Task',
            html: "<p>You've received this email because of a password reset request" +
              ", if you didn't make this request you can ignore it, otherwise, " +
              'you have 24 hours before your request is invalid. If you don\'t remember making this request ignore this email.</p> <a href="http://localhost:8080/recover/' + token + '">Reset now</a> '
          }

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              res.status(HttpStatus.NOT_IMPLEMENTED).json({
                success: false,
                message: error
              })
              console.log(error)
            } else {
              res.status(HttpStatus.OK).json({
                success: true,
                message: info.response
              })
              console.log('Email sent: ' + info.response)
            }
          })
        }
      },
      error => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Check the parameters'
        })
        console.log(error)
      }
    )
  } catch (error) {
    res.status(HttpStatus.NOT_IMPLEMENTED).json({
      success: false,
      message: 'Email is invalid'
    })
  }
})
module.exports = router