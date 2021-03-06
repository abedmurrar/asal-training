var express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  routes = require('./routes/index'),
  users = require('./routes/users'),
  resets = require('./routes/resets'),
  helmet = require('helmet'),
  session = require('express-session'),
  func = require('./func'),
  // Tasks = require('./routes/Tasks'),
  app = express()
// setting up domain for developlment
// should be changed for production
const DOMAIN = 'http://localhost:8080'
const MongoStore = require('connect-mongo')(session)
const dbConnection = require('./config_mongodb')

app.enable('trust proxy')
app.disable('x-powered-by')

// setting sessions
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(session({
  secret: 'YWJlZG11cnJhcg==',
  resave: true,
  name: 'sess',
  cookie: {
    secure: app.get('env') !== 'development' ? true : false,
    httpOnly: true,
    expires: expiryDate
  },
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: dbConnection.connection
  })
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

// error handler
app.use((err, req, res, next) => {
  // production error handler
  // no stacktraces leaked to user
  if (app.get('env') !== 'development') {
    delete err.stack
  }
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
    message: err.message,
    stacktrace: err.stack
  })
})
module.exports = app