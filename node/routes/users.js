const express = require('express'),
  router = express.Router(),
  // User = require('../models/mysql/User'),
  User = require('../models/mongodb/User'),
  _ = require('underscore')
var HttpStatus = require('http-status-codes'), // http status codes package
  session

router.get('/:id?', (req, res, next) => {
  session = req.session
  if (session.username && req.params.id && (session.uid === req.params.id || session.role === 'admin')) {
    User.getUserById(req.params.id,
      user => {
        if (user) {
          return res.status(HttpStatus.OK).json(user)
        } else {
          return res.status(HttpStatus.NO_CONTENT).json(req.body)
        }
      },
      error => {
        next(error)
      }
    )
  } else if (session.username && session.role === 'admin') {
    User.getAllUsers(
      users => {
        if (users) {
          return res.status(HttpStatus.OK).json(users)
        } else {
          return res.status(HttpStatus.NO_CONTENT).json(req.body)
        }
      },
      error => {
        return next(error)
      }
    )
  } else {
    res.status(HttpStatus.FORBIDDEN)
    return next(null)
  }
})
router.post('/', (req, res, next) => {
  User.addUser(req.body,
    addedUser => {
      if (Object.keys(addedUser).length > 0) { // mongodb 
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'Registered successfully',
          id: addedUser._id // mongodb 
        })
      } else {
        return res.status(HttpStatus.NOT_IMPLEMENTED).json(req.body)
      }
    },
    error => {
      return next(error)
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
          return res.status(HttpStatus.OK).json(data)
        } else {
          return res.status(HttpStatus.NOT_IMPLEMENTED).json(req.body)
        }
      },
      error => {
        return next(error)
      })
  } else {
    res.status(HttpStatus.FORBIDDEN)
    return next(null)
  }
})
router.put('/:id', (req, res, next) => {
  session = req.session
  if (session.username && req.body.username && req.body.username === session.username) {
    User.updateUser(req.params.id, req.body,
      data => {
        if (!_.isEmpty(data)) {
          session.username = !_.isUndefined(req.body.username) && !_.isEmpty(req.body.username) ? req.body.username : session.username
          session.pass = (req.body.password && req.body.password.length > 0) ? req.body.password : session.pass
          session.email = (req.body.email && req.body.email.length > 0) ? req.body.email : session.email
          return res.status(HttpStatus.OK).json({
            success: true,
            message: 'User ' + data._id + ' modified successfully',
          })
        } else {
          return res.status(HttpStatus.NOT_MODIFIED).json(req.body)
        }
      },
      error => {
        return next(error)
      })
  } else {
    res.status(HttpStatus.FORBIDDEN)
    return next(null)
  }
})
router.use((error, req, res, next) => {
  //Validation Error (PUT/POST)
  if (error.name === 'ValidationError') {
    if (!_.isUndefined(error.errors.email)) {
      return res.status(HttpStatus.CONFLICT).json({
        success: false,
        message: error.message,
        email: 'Email already registered'
      })
    }
    if (!_.isUndefined(error.errors.username)) {
      return res.status(HttpStatus.CONFLICT).json({
        success: false,
        message: error.messsage,
        username: 'Username already exists'
      })
    }
  }
  //Forbidden Access (GET/PUT/DELETE) 
  else if (res.statusCode === HttpStatus.FORBIDDEN) {
    return res.json({
      message: 'Forbidden to access.',
      success: false
    })
  } else {
    return res.status(HttpStatus.NOT_ACCEPTABLE).json({
      success: false,
      message: error.message
    })
  }
})
module.exports = router