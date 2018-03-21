const express = require('express')
const router = express.Router()
const User = require('../models/User')
var debug = require('debug')('users-route')
var HttpStatus = require('http-status-codes'); //http status codes package
var session;

router.get('/:id?', (req, res, next) => {
    debug('request parameters ' + req.params)
    debug('session in request: ' + session)
    session = req.session;
    if (session.username && req.params.id && session.id == req.params.id) {
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
                    res.json(req.body)
                }
            }
        )
    } else if (session.username && session.role === 'admin') {
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
                    res.json(req.body)
                }
            }
        )
    } else {
        debug('an unlogged user attempted to get users/user')
        res.status(HttpStatus.FORBIDDEN).render('forbidden');
    }

})

router.post('/', (req, res, next) => {
    User.addUser(req.body,
        data => {
            if (data) {
                console.log(data);
                res.json({ success: true, msg: 'Registered successfully', id: data[0] })
            } else {
                res.status(HttpStatus.NOT_IMPLEMENTED).json(req.body)
            }
        },
        error => {
            if (error) {
                console.log(error);
                if (error.code === 'ER_DUP_ENTRY') {
                    res.status(409).json({ success: false, msg: error.sqlMessage })
                } else {
                    error.success = false;
                    res.status(HttpStatus.BAD_REQUEST).json(error)
                }
            } else { res.status(HttpStatus.BAD_GATEWAY).json({ success: false, msg: 'missing parameter' }) }
        }
    )
})
router.delete('/:id', (req, res, next) => {
    session = req.session;
    if (session.username) {
        User.deleteUser(req.params.id,
            data => {
                if (data) {
                    res.json(data)
                } else {
                    res.json(req.body)
                }
            },
            error => {
                if (error) {
                    res.status(404)
                    res.json(error)
                } else {
                    res.json(req.body)
                }
            })
    } else {
        res.render('forbidden');
    }
})
router.put('/:id', (req, res, next) => {
    session = req.session;
    if (session.username && req.body.username && req.body.username === session.username) {
        User.updateUser(req.params.id, req.body,
            data => {
                if (data) { res.json(data) } else { res.json(req.body) }
            },
            error => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') { // check ER_DUP_ENTRY
                        res.status(409)
                    } else { res.status(400) }
                    res.json(error)
                } else { res.json(req.body) }
            })
    } else {
        res.render('forbidden');
    }

})
module.exports = router