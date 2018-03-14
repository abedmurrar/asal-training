const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/:id?', function(req, res, next) {

    if (req.params.id) {

        User.getUserById(req.params.id,
            data => {
                if (data) {
                    res.json(data);
                } else {
                    res.json(req.body);
                }
            },
            error => {
                if (error) {
                    res.json(err);
                    res.status(error.code);
                } else {
                    res.json(req.body);
                }
            }
        );
    } else {

        User.getAllUsers(
            data => {
                if (data) {
                    res.json(data);
                    res.status(400);
                } else {
                    res.json(req.body);
                }

            },
            error => {
                if (error) {
                    res.json(error);
                } else {
                    res.json(req.body);
                }
            }
        );
    }
});
router.post('/', function(req, res, next) {

    User.addUs.er(req.body,
        data => {
            if (data) {
                res.json(data);
            } else {
                res.json(req.body); //or return count for 1 &amp;amp;amp; 0
            }
        },
        error => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') // check ER_DUP_ENTRY
                    res.status(409);
                else
                    res.status(400);
                res.json(error);
            } else
                res.json(req.body);
        }
    );
});
router.delete('/:id', function(req, res, next) {

    User.deleteUser(req.params.id,
        data => {
            if (data) {
                res.json(data);
            } else {
                res.json(req.body); //or return count for 1 &amp;amp;amp; 0
            }
        },
        error => {
            if (error) {
                res.status(404)
                res.json(err);
            } else {
                res.json(req.body);
            }
        });
});
router.put('/:id', function(req, res, next) {

    User.updateUser(req.params.id, req.body,
        data => {
            if (data)
                res.json(data);
            else
                res.json(req.body);
        },
        error => {
            if (error) {
                if (error.code)
                    res.status(error.code);
                res.json(error);
            } else
                res.json(req.body);
        });
});
module.exports = router;