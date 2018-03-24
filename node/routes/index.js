var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes'); //http status codes package
const User = require('../models/User')
var crypto = require('crypto') //crypto package
var func = require('../func')

var session;

/* GET home page. */
router.get('/', (req, res) => {
    session = req.session;
    if (!func.isLogged(req)) {
        res.render('index', {
            title: 'Home',
            logged: false,
            page: 'home'
        });
    } else {
        res.render('index', {
            title: 'Home',
            logged: true,
            page: 'user/home',
            username: session.username,
            role: session.role
        });
    }
});



/* GET login page */
router.get('/login', (req, res) => {
    //if user is not logged in then respond with login page
    //if user is logged and tried to get this page then respond with home page
    session = req.session;
    if (!func.isLogged(req)) {
        res.render('index', {
            logged: false,
            title: 'Login',
            page: 'login'
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
});

/* POST to login page */
router.post('/login', (req, res, next) => {
    session = req.session;
    try {
        //check if session is not set
        if (!session.username) {
            User.getUserByUsername(req.body.username,
                data => {
                    if (typeof data != 'undefined') {
                        passwordEncoded = crypto
                            .createHash('sha256')
                            .update(req.body.password)
                            .digest('hex');
                        //check if password entered is same as stored
                        if (passwordEncoded == data.password) {
                            session.username = data.username;
                            session.email = data.email;
                            session.role = data.role;
                            session.uid = data.id;
                            res.status(HttpStatus.OK).json({ success: true, message: 'Successfully logged in.' })
                        } else {
                            res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Wrong password, try again.', password: 'Wrong password' });
                        }
                    } else {
                        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'username does not exist', username: 'username does not exist' })
                    }
                },
                error => {
                    console.log(error);
                    if (error) {
                        error.success = false;
                        res.status(HttpStatus.BAD_GATEWAY).json(error)
                    } else { res.status(HttpStatus.BAD_GATEWAY).json({ success: false, message: 'username can not be empty', username: 'username can not be empty' }) }
                })
        } else {
            err = new Error('you\'re already logged in!!')
            err.status = HttpStatus.NOT_IMPLEMENTED;
            next(err);
        }
    } catch (error) {
        next(new ReferenceError('Our aliens are working on your error right now, don\'t miss an input'))
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(HttpStatus.OK).redirect('/')
})

/* GET register page */
router.get('/register', (req, res) => {
    session = req.session;
    if (!func.isLogged(req)) {
        res.render('index', {
            logged: false,
            title: 'Register',
            page: 'register'
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
});

/* GET account page */
router.get('/account', (req, res, next) => {
    session = req.session;
    if (!func.isLogged(req)) {
        err = new Error('Page not found')
        err.status = HttpStatus.NOT_FOUND;
        next(err);
    } else {
        res.render('index', {
            logged: true,
            title: 'Home',
            page: 'account',
            username: session.username,
            role: session.role,
            id: session.uid,
            email: session.email
        })
    }
})

/* GET manage page */
router.get('/manage', (req, res, next) => {
    session = req.session;
    if (!func.isLogged(req)) {
        err = new Error('Apparently, this page doesn\'t exist on out server');
        err.status = HttpStatus.NOT_FOUND;
        next(err);
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
        err.status = HttpStatus.UNAUTHORIZED;
        next(err);
    }
})

router.get('/recover', (req, res, next) => {
    session = req.session;
    if (func.isLogged(req)) {
        err = new Error('Only logged out users can recover their password.')
        err.status(HttpStatus.NOT_ACCEPTABLE);
        next(err);
    } else {
        res.render('index', {
            logged: false,
            title: 'Home',
            page: 'recover'
        })
    }
})

// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'abedjmurrar@gmail.com',
//     pass: '**'
//   }
// });

// var mailOptions = {
//   from: 'abrar@gmail.com',
//   to: 'abedmurrar15@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

module.exports = router;