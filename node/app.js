var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
var routes = require('./routes/index')
var users = require('./routes/users')
var resets = require('./routes/resets')
var helmet = require('helmet')
var session = require('express-session')
var func = require('./func')
// var Tasks = require('./routes/Tasks');
var app = express()
// setting up domain for developlment
// should be changed for production
const DOMAIN = 'http://localhost:8080'

// setting sessions
app.use(session({
  secret: 'my-application',
  resave: true,
  cookie: {
    cookie: false
  },
  saveUninitialized: true
}))

// setting header security
app.use(helmet())
app.use(helmet.referrerPolicy({
  policy: 'same-origin'
}))
app.use(helmet.noCache())
app.use(helmet.noSniff())
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ["'self'"]
//     }
// }));

// view engine setup
app.set('views', path.join(__dirname, 'views'))
// app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs')

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use('/public', express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)
app.use('/users', users)
app.use('/resets', resets)
// app.use('/Tasks', Tasks);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', DOMAIN)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    var page = 'handle/error'
    var title = 'Error'
    res.status(err.status || 500)
    if (err.status === 403) {
      page = 'handle/forbidden'
      title = 'Forbidden'
    }
    res.render('index', {
      title: title,
      page: page,
      logged: func.isLogged(req),
      role: req.session.role,
      message: err.message
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})
module.exports = app