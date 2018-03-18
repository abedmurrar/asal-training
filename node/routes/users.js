const express = require('express')
const router = express.Router()
const User = require('../models/User')

var sess;
router.get('/:id?', (req, res, next) => {
    sess = req.session;
    if (sess.username) {
        if (req.params.id) {
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
        } else {
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
        }
    } else {
        res.render('forbidden');
    }

})
router.post('/login', (req, res, next) => {
    sess = req.session;
    if (!sess.username) {
        User.login(req.body,
            data => {
                if (Object.keys(data[0]).length) {
                    sess.username = data[0].username;
                    res.redirect('http://localhost:8080')
                    res.status(200)
                    res.end()
                } else {
                    res.redirect('http://localhost:8080')
                    res.status(400)
                    res.end()
                }
            },
            error => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') // check ER_DUP_ENTRY
                    { res.status(409) } else { res.status(400) }
                    res.json(error)
                } else { res.json(req.body) }
            })
    } else { res.redirect('forbidden') }
})
router.post('/', (req, res, next) => {
    User.addUser(req.body,
        data => {
            if (data) {
                res.json(data)
            } else {
                res.json(req.body)
            }
        },
        error => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') // check ER_DUP_ENTRY
                { res.status(409) } else { res.status(400) }
                res.json(error)
            } else { res.json(req.body) }
        }
    )
})
router.delete('/:id', (req, res, next) => {
    sess = req.session;
    if (sess.username) {
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
    sess = req.session;
    if (sess.username) {
        if (req.body.username && req.body.username === sess.username) {
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
    } else {
        res.render('forbidden');
    }
})
module.exports = router