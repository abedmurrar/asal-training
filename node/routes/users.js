const express = require('express')
const router = express.Router()
const User = require('../models/User')
var debug = require('debug')('users-route')
var HttpStatus = require('http-status-codes') // http status codes package
var session

router.get('/:id?', (req, res, next) => {
  session = req.session
  if (session.username && req.params.id && (session.id === req.params.id || session.role === 'admin')) {
    User.getUserById(req.params.id,
      data => {
        if (data) {
          res.json(data)
        } else {
          res.json(req.body)
        }
      },
      error => {
        if (error) {
          res.json(error)
          res.status(error.code)
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(req.body)
        }
      }
    )
  } else if (session.username && session.role === 'admin') {
    console.log(session.role)
    User.getAllUsers(
      data => {
        if (data) {
          res.json(data)
        } else {
          res.json(req.body)
        }
      },
      error => {
        if (error) {
          res.json(error)
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(req.body)
        }
      }
    )
  } else {
    debug('an unlogged user attempted to get users/user')
    res.status(HttpStatus.FORBIDDEN).json({ success: false, message: 'forbidden' })
  }
})

router.post('/', (req, res, next) => {
  User.addUser(req.body,
    data => {
      if (data) {
        res.json({ success: true, message: 'Registered successfully', id: data[0] })
      } else {
        res.status(HttpStatus.NOT_IMPLEMENTED).json(req.body)
      }
    },
    error => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          if (error.sqlMessage.includes('username')) { res.status(409).json({ success: false, message: error.sqlMessage, username: 'Username already exists' }) } else if (error.sqlMessage.includes('email')) { res.status(409).json({ success: false, message: error.sqlMessage, email: 'Email already registered' }) }
        } else {
          error.success = false
          res.status(HttpStatus.BAD_REQUEST).json(error)
        }
      } else { res.status(HttpStatus.BAD_GATEWAY).json({ success: false, message: 'missing parameter' }) }
    }
  )
})
router.delete('/:id', (req, res, next) => {
  session = req.session
  if (session.username && (session.uid === req.params.id || session.role === 'admin')) {
    User.deleteUser(req.params.id,
      data => {
        if (data) {
          if (session.uid === req.params.id) {
            req.session.destroy()
          }
          res.status(HttpStatus.OK).json(data)
        } else {
          res.status(HttpStatus.OK).json(req.body)
        }
      },
      error => {
        if (error) {
          res.status(HttpStatus.NOT_FOUND).json(error)
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(req.body)
        }
      })
  } else {
    res.status(HttpStatus.FORBIDDEN).json({ success: false, message: 'forbidden' })
  }
})
router.put('/:id', (req, res, next) => {
  session = req.session
  if (session.role && ((session.role === 'reset' && session.resetUid && session.resetUid === req.params.id) ||
        (session.username && req.body.username && req.body.username === session.username))) {
    User.updateUser(req.params.id, req.body,
      data => {
        if (data) {
          if (session.role !== 'reset') {
            var user = JSON.parse(data)
            session.username = user.username
            session.pass = user.password
            session.email = user.email
          } else {
            session.destroy()
          }
          res.json(data)
        } else { res.json(req.body) }
      },
      error => {
        if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('username')) { res.status(409).json({ success: false, message: error.sqlMessage, username: 'Username already exists' }) } else if (error.sqlMessage.includes('email')) { res.status(409).json({ success: false, message: error.sqlMessage, email: 'Email already registered' }) }
          } else {
            error.success = false
            res.status(400).json(error)
          }
        } else { res.status(HttpStatus.METHOD_NOT_ALLOWED).json({ success: false, message: 'Not allowed' }) }
      })
  } else {
    res.status(HttpStatus.FORBIDDEN).json({ success: false, message: 'forbidden' })
  }
})
module.exports = router
