var express = require('express'),
  router = express.Router(),
  HttpStatus = require('http-status-codes'), // http status codes package
  crypto = require('crypto'), // crypto package
  func = require('../func'),
  session


// const User = require('../models/mysql/User') //mysql
// const Reset = require('../models/mysql/Reset') //mysql
const User = require('../models/mongodb/User'), //mongodb
  is = require('is')

/* GET home page. */
router.get('/', (req, res) => {
  session = req.session
  if (!func.isLogged(req)) {
    res.render('index', {
      title: 'Home',
      logged: false,
      page: 'guest/home'
    })
  } else {
    res.render('index', {
      title: 'Home',
      logged: true,
      page: 'user/home',
      username: session.username,
      role: session.role
    })
  }
})

/* GET login page */
router.get('/login', (req, res) => {
  // if user is not logged in then respond with login page
  // if user is logged and tried to get this page then respond with home page
  session = req.session
  if (!func.isLogged(req)) {
    res.render('index', {
      logged: false,
      title: 'Login',
      page: 'guest/login'
    })
  } else {
    res.render('index', {
      logged: true,
      title: 'Home',
      page: 'user/home',
      username: session.username,
      role: session.role
    })
  }
})

/* POST to login page */
router.post('/login', (req, res, next) => {
  session = req.session
  try {
    // check if session is not set
    if (!session.username) {
      if (is.undefined(req.body.username) || is.empty(req.body.username))
        throw Object.assign(new Error('Username can not be empty'), {
          username: 'Username can not be empty'
        })
      if (is.undefined(req.body.password) || is.empty(req.body.username))
        throw Object.assign(new TypeError('Password can not be empty'), {
          password: 'Password can not be empty'
        })
      User.getUserByUsername(
        req.body.username,
        data => {
          if (!is.undefined(data) && !is.null(data)) {
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
              /* mysql
              User.logUser(
                data._id,
                data => {
                  console.info(data)
                },
                error => {
                  console.error(error)
                }
              )
              */
              res.status(HttpStatus.OK)
                .json({
                  success: true,
                  message: 'Successfully logged in.'
                })
            } else {
              res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: 'Wrong password, try again.',
                password: 'Wrong password'
              })
            }
          } else {
            res.status(HttpStatus.UNAUTHORIZED).json({
              success: false,
              message: 'username does not exist',
              username: 'username does not exist'
            })
          }
        },
        error => {
          if (error) {
            error.success = false
            res.status(HttpStatus.BAD_GATEWAY).json(error)
          } else {
            res.status(HttpStatus.BAD_GATEWAY).json({
              success: false,
              message: 'username can not be empty',
              username: 'username can not be empty'
            })
          }
        }
      )
    } else {
      var err = new Error("you're already logged in!!")
      err.status = HttpStatus.NOT_IMPLEMENTED
      next(err)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.status(HttpStatus.OK).redirect('/')
})

/* GET register page */
router.get('/register', (req, res) => {
  session = req.session
  if (!func.isLogged(req)) {
    res.render('index', {
      logged: false,
      title: 'Register',
      page: 'guest/register'
    })
  } else {
    res.render('index', {
      logged: true,
      title: 'Home',
      page: 'user/home',
      username: session.username,
      role: session.role
    })
  }
})

/* GET account page */
router.get('/account', (req, res, next) => {
  session = req.session
  if (!func.isLogged(req)) {
    var err = new Error('Page not found')
    err.status = HttpStatus.NOT_FOUND
    next(err)
  } else {
    res.render('index', {
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
  var err
  if (!func.isLogged(req)) {
    err = new Error("Apparently, this page doesn't exist on out server")
    err.status = HttpStatus.NOT_FOUND
    next(err)
  } else if (session.role === 'admin') {
    res.render('index', {
      logged: true,
      title: 'Manage',
      page: 'admin/manage',
      username: session.username,
      role: session.role
    })
  } else {
    err = new Error('Only admins please, not authorized')
    err.status = HttpStatus.UNAUTHORIZED
    next(err)
  }
})

/* GET recover page */
router.get('/recover/:token?', (req, res, next) => {
  session = req.session
  if (func.isLogged(req)) {
    var err = new Error('Only logged out users can recover their password, you can change your password in account page.')
    err.status = HttpStatus.NOT_ACCEPTABLE
    next(err)
  } else {
    if (req.params.token) {
      // Reset.getUserByToken(req.params.token,
      User.getUserByToken(req.params.token,
        data => {
          if (Object.keys(data).length) {
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

module.exports = router