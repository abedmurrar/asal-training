var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/:id?', function(req, res, next) {

    if (req.params.id) {

        User.getUserById(req.params.id, function(err, rows) {

            if (err) {
                res.json(err);
                res.status(400);
            } else {
                res.json(rows);
            }
        });
    } else {

        User.getAllUsers(function(err, rows) {

            if (err) {
                res.json(err);
                res.status(400);
            } else {
                res.json(rows);
            }

        });
    }
});
router.post('/', function(req, res, next) {

    User.addUser(req.body, function(err, count) {
        if (err) {
            if (err.code) {
                if (err.code == 'ER_DUP_ENTRY')
                    res.status(409);
                else
                    res.status(400);
            }
            res.json(err);
        } else {
            res.json(req.body); //or return count for 1 &amp;amp;amp; 0


        }
    });
});
router.delete('/:id', function(req, res, next) {

    User.deleteUser(req.params.id, function(err, count) {

        if (err) {
            res.status(404)
            res.json(err);
        } else {
            res.json(count);
        }

    });
});
router.put('/:id', function(req, res, next) {

    User.updateUser(req.params.id, req.body, function(err, rows) {

        if (err) {
            if (err.code == 'ER_DUP_ENTRY')
                res.status(409);
            else if (err.code)
                res.status(err.code);
            else
                res.status(400);
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});
module.exports = router;