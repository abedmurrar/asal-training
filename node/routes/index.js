var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes'); //http status codes package
const AJAX_CALL = 'XMLHttpRequest';

var sess;
// router.use(session({ secret: 'my-application' }));

/* GET home page. */
router.get('/', (req, res) => {
    sess = req.session;
    var isLogged;
    if (sess.username)
        isLogged = true;
    else
        isLogged = false;
    res.render('index', {
        logged: isLogged
    });
});



/* GET login page */
router.get('/login', (req, res) => {
    if (req.headers['x-requested-with'] && req.headers['x-requested-with'] === AJAX_CALL) {
        res.status(HttpStatus.OK);

        res.render('login');
    } else {
        res.status(HttpStatus.FORBIDDEN);
        res.render('forbidden');
    }
    if (req.headers.origin && req.headers.origin !== DOMAIN) {
        res.status(HttpStatus.FORBIDDEN);
        res.render('forbidden');
    }

});

/* GET register page */
router.get('/register', (req, res) => {
    res.setHeader('Content-Security-Policy', "script-src 'self'");
    res.render('register');

});

module.exports = router;