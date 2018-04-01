const express = require('express')
const router = express.Router()
const User = require('../models/User')
var HttpStatus = require('http-status-codes') // http status codes package
var session

router.get('/:id?', (req, res) => {
  session = req.session
  if (session.username && req.params.id && (session.id === req.params.id || session.role === 'admin')) {
    User.getUserById(req.params.id,
      data => {
        if (data) {
          res.status(HttpStatus.OK).json(data)
        } else {
          res.status(HttpStatus.NO_CONTENT).json(req.body)
        }
      },
      error => {
        if (error) {
          res.status(HttpStatus.BAD_REQUEST).json(error)
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(req.body)
        }
      }
    )
  } else if (session.username && session.role === 'admin') {
    User.getAllUsers(
      data => {
        if (data) {
          res.status(HttpStatus.OK).json(data)
        } else {
          res.status(HttpStatus.NO_CONTENT).json(req.body)
        }
      },
      error => {
        if (error) {
          res.status(HttpStatus.BAD_REQUEST).json(error)
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(req.body)
        }
      }
    )
  } else {
    res.status(HttpStatus.FORBIDDEN).json({ success: false, message: 'forbidden' })
  }
})

router.post('/', (req, res) => {
  User.addUser(req.body,
    data => {
      if (data.length > 0) {
        res.status(HttpStatus.OK).json({ success: true, message: 'Registered successfully', id: data[0] })
      } else {
        res.status(HttpStatus.NOT_IMPLEMENTED).json(req.body)
      }
    },
    error => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          if (error.sqlMessage.includes('username')) { res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.sqlMessage, username: 'Username already exists' }) } else if (error.sqlMessage.includes('email')) { res.status(409).json({ success: false, message: error.sqlMessage, email: 'Email already registered' }) }
        } else {
          error.success = false
          res.status(HttpStatus.BAD_REQUEST).json(error)
        }
      } else { res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'missing parameter' }) }
    }
  )
})
router.delete('/:id', (req, res) => {
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
          res.status(HttpStatus.NOT_IMPLEMENTED).json(req.body)
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
router.put('/:id', (req, res) => {
  session = req.session
  if (session.username && req.body.username && req.body.username === session.username) {
    User.updateUser(req.params.id, req.body,
      data => {
        if (data) {
          session.username = (req.body.username && req.body.username.length > 0) ? req.body.username : session.username
          session.pass = (req.body.password && req.body.password.length > 0) ? req.body.password : session.pass
          session.email = (req.body.email && req.body.email.length > 0) ? req.body.email : session.email
          res.status(HttpStatus.OK).json({ success: true, message: 'User modified', status: data })
        } else { res.status(HttpStatus.NOT_MODIFIED).json(req.body) }
      },
      error => {
        if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('username')) { res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.sqlMessage, username: 'Username already exists' }) } else if (error.sqlMessage.includes('email')) { res.status(409).json({ success: false, message: error.sqlMessage, email: 'Email already registered' }) }
          } else {
            error.success = false
            res.status(HttpStatus.BAD_REQUEST).json(error)
          }
        } else { res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Not allowed' }) }
      })
  } else {
    res.status(HttpStatus.FORBIDDEN).json({ success: false, message: 'forbidden' })
  }
})
module.exports = router
