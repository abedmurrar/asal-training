var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes'); //http status codes package
const User = require('../models/User')
var crypto = require('crypto') //crypto package
var func = require('../func')
const AJAX_CALL = 'XMLHttpRequest';

var session;

/* GET home page. */
router.get('/', (req, res) => {
    session = req.session;
    if (!func.isLogged(req)) {
        res.render('index', {
            title: 'Home',
            logged: false,
            page: 'login'
        });
    } else {
        res.render('index', {
            title: 'Home',
            logged: true,
            page: 'home',
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
            page: 'home',
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
                    passwordEncoded = crypto
                        .createHash('sha256')
                        .update(req.body.password)
                        .digest('hex');
                    //check if password entered is same as stored
                    if (passwordEncoded == data.password) {
                        session.username = data.username;
                        session.role = data.role;
                        session.id = data.id;
                        res.status(HttpStatus.OK).json({ success: true, message: 'Successfully logged in.' })
                    } else {
                        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Wrong password, try again.' });
                    }
                },
                error => {
                    if (error) {
                        error.success = false;
                        res.status(HttpStatus.BAD_GATEWAY).json(error)
                    } else { res.status(HttpStatus.BAD_GATEWAY).json({ success: false, msg: 'username can not be empty' }) }
                })
        } else {
            res.redirect('forbidden')
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).render('error', {
            message: 'Internal error',
            error: error
        })
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
            page: 'home',
            username: session.username,
            role: session.role
        })
    }
});

/* GET account page */
router.get('/account', (req, res) => {
    session = req.session;
    if (!func.isLogged(req)) {
        res.render('error', {
            error: 'Page not found 404',
            message: 'The page you requested is not found.'
        })
    } else {
        res.render('index', {
            logged: true,
            title: 'Home',
            page: 'account',
            username: session.username,
            role: session.role
        })
    }
})


module.exports = router;