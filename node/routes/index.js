var express = require('express'),
  router = express.Router(),
  crypto = require('crypto'), // crypto package
  func = require('../func'),
  session

const User = require('../models/mongodb/User'), //mongodb
  _ = require('underscore'),
  HttpStatus = require('http-status-codes') // http status codes package

/* GET home page. */
router.get('/', (req, res) => {
  session = req.session
  var isLogged = func.isLogged(req)
  return res.render('index', {
    title: 'Home',
    logged: isLogged,
    page: isLogged ? 'user/home' : 'guest/home',
    username: session.username,
    role: session.role
  })
})
/* GET login page */
router.get('/login', (req, res) => {
  session = req.session
  if (func.isLogged(req))
    return res.redirect('/')
  return res.render('index', {
    logged: false,
    title: 'Login',
    page: 'guest/login'
  })
})
/* POST to login page */
router.post('/login', (req, res, next) => {
  session = req.session
  User.getUserByUsername(
    req.body.username,
    data => {
      var passwordEncoded = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('hex')
      // check if password entered is same as stored
      if (passwordEncoded === data.password) {
        session.username = data.username
        session.email = data.email
        session.role = data.role
        session.uid = data._id
        session.pass = req.body.password
        return res.status(HttpStatus.OK)
          .json({
            success: true,
            message: 'Successfully logged in.'
          })
      } else {
        throw Object.assign(new Error('Wrong password!'), {
          password: 'Wrong password'
        })
      }
    },
    error => {
      next(error)
    }
  )
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  return res.status(HttpStatus.OK).redirect('/')
})
/* GET register page */
router.get('/register', (req, res) => {
  session = req.session
  if (func.isLogged(req))
    return res.redirect('/')
  return res.render('index', {
    logged: false,
    title: 'Register',
    page: 'guest/register'
  })
})
/* GET account page */
router.get('/account', (req, res, next) => {
  session = req.session
  if (!func.isLogged(req)) {
    return next()
  } else {
    return res.render('index', {
      logged: true,
      title: 'Home',
      page: 'user/account',
      username: session.username,
      role: session.role,
      id: session.uid,
      email: session.email,
      password: session.pass
    })
  }
})
/* GET manage page */
router.get('/manage', (req, res, next) => {
  session = req.session
  if (session.role === 'admin') {
    res.render('index', {
      logged: true,
      title: 'Manage',
      page: 'admin/manage',
      username: session.username,
      role: session.role
    })
  } else {
    next()
  }
})
/* GET recover page */
router.get('/recover/:token?', (req, res, next) => {
  session = req.session
  if (func.isLogged(req)) {
    next(new Error('Only logged out users can recover their password, you can change your password in account page.'))
  } else {
    if (req.params.token) {
      // Reset.getUserByToken(req.params.token,
      User.getUserByToken(req.params.token,
        data => {
          if (!_.isEmpty(data)) {
            res.render('index', {
              logged: false,
              title: 'Reset Password',
              page: 'user/reset',
              token: req.params.token
            })
          } else {
            res.render('index', {
              logged: false,
              title: 'Home',
              page: 'user/recover',
              msg: 'An Error occured while retreiving your request'
            })
          }
        },
        () => {
          res.render('index', {
            logged: false,
            title: 'Home',
            page: 'user/recover',
            msg: 'Request does not exist'
          })
        })

    } else {
      res.render('index', {
        logged: false,
        title: 'Home',
        page: 'user/recover'
      })
    }
  }
})
router.get('/about', (req, res) => {
  session = req.session
  res.render('index', {
    title: 'About',
    logged: func.isLogged(req),
    page: 'about',
    username: session.username,
    role: session.role
  })
})
router.use((error, req, res, next) => {
  next(error)
})
router.use('/login', (error, req, res, next) => {
  if (error instanceof TypeError) {
    return res.status(HttpStatus.NOT_ACCEPTABLE).json({
      success: false,
      message: 'Username does not exist',
      username: 'Does not exist'
    })
  }
  return res.status(HttpStatus.NOT_ACCEPTABLE).json({
    success: false,
    message: error.message,
    password: error.password,
    username: error.username
  })
})
module.exports = router