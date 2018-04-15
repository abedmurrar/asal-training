var database = require('../../config_mongodb')
var Schema = database.Schema
var uniqueValidator = require('mongoose-unique-validator')
var moment = require('moment')
const format = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
const crypto = require('crypto')
var uuidv1 = require('uuid/v1')

var UserSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true
    },
    username: {
        type: String,
        required: [true, 'You can\'t have an account without username'],
        index: true,
        unique: true,
        uniqueCaseInsensitive: true,
        trim: true,
        validate: {
            validator: function (u) {
                return /^[a-z](([\w][.-]{0,1}){6,22})[a-z]$/.test(u)
            },
            message: '{VALUE} is not a valid username'
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        index: true,
        unique: true,
        uniqueCaseInsensitive: true,
        trim: true,
        validate: {
            validator: function (e) {
                return /^[\w]([\w][.-]{0,1}?)+@([a-z0-9][_.-]{0,1}?)+\.([a-z]{2,5})$/.test(e)
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: false,
        maxlength: 64,
        validate: {
            validator: function (p) {
                return /^.{7,}$/.test(p)
            },
            message: 'Password must at least be 7 characters long'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client',
        required: true,
        trim: true
    },
    token: {
        type: String,
        required: false,
        trim: true,
        index: true,
        unique: true,
        sparse: true
    },
    tokenRequestTime: {
        type: Date,
        required: false,
        trim: true
    }
}, {
    timestamps: true
})
UserSchema.pre('save', function (next) {
    var user = this
    // hash password if it has been modified or new user
    if (user.isModified('password')) {
        var hash = crypto
            .createHash('sha256')
            .update(user.password)
            .digest('hex')
        user.password = hash
    }
    if (user.isModified('token')) {
        user.tokenRequestTime = moment().format(format)
    }
    next()
})
UserSchema.statics.getAllUsers = function (success, failure) {
    this.find()
        .then(success)
        .catch(failure)
}
UserSchema.statics.getUserById = function (_id, success, failure) {
    this.findById(_id)
        .then(success)
        .catch(failure)
}
UserSchema.statics.getUserByUsername = function (username, success, failure) {
    this.findOne({
            username: username
        })
        .then(success)
        .catch(failure)
}
UserSchema.statics.getUserByEmail = function (email, success, failure) {
    this.findOne({
            email: email
        })
        .then(success)
        .catch(failure)
}
UserSchema.statics.addUser = function (userData, success, failure) {
    Object.assign(new this(), userData)
        .save()
        .then(success)
        .catch(failure)
}
UserSchema.statics.deleteUser = function (_id, success, failure) {
    this.findByIdAndRemove(_id)
        .then(success)
        .catch(failure)
}
UserSchema.statics.updateUser = function (_id, userData, success, failure) {
    this.findById(_id)
        .then(function (user) {
            Object.assign(user, userData)
                .save()
                .then(success)
                .catch(failure)
        })
        .catch(failure)
}
UserSchema.statics.changePassword = function (_id, password, confirm, success, failure) {
    if (password !== '' && password === confirm) {
        this.findById(_id)
            .then(function (user) {
                //delete user.token
                user.password = password
                user.save()
                    .then(success)
                    .catch(failure)
            })
            .catch(failure)
    } else {
        failure(new Error("Passwords do not match"))
    }
}
UserSchema.statics.generateToken = function (email, success, failure) {
    var db = this
    this.getUserByEmail(email, user => {
            db.findById(user._id)
                .then(function (user) {
                    user.token = uuidv1()
                    user.save()
                        .then(success)
                        .catch(failure)
                })
                .catch(failure)
        },
        error => {
            failure(error)
        })
}
UserSchema.statics.getUserByToken = function (token, success, failure) {
    this.findOne({
            token: token,
            tokenRequestTime: {
                $gt: moment().subtract(1, 'day').format(format),
                $lt: moment().format(format)
            }
        })
        .then(success)
        .catch(failure)
}
UserSchema.statics.getTokenByEmail = function (email, success, failure) {
    this.findOne({
            email: email,
            tokenRequestTime: {
                $gt: moment().subtract(1, 'day').format(format),
                $lt: moment().format(format)
            }
        })
        .then(success)
        .catch(failure)
}
UserSchema.plugin(uniqueValidator, {
    message: '{PATH} is already used.'
});

module.exports = database.model('User', UserSchema)