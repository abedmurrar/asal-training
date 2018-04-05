var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Connection String
var dbURI = process.env.MONGO_URL || 'mongodb://localhost:27017/asaltech'

//Connect to database
mongoose.connect(dbURI)

// Connection events
// When successfully connected
mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open to ' + dbURI);
})

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

// When the connection is open
mongoose.connection.on('open', () => {
    console.log('Mongoose default connection is open');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    })
})

var usersSchema = new Schema({
    username: {
        type: String,
        required: [true, 'You can\'t have an account without username'],
        index: true,
        unique: true,
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
        trim: false
    }
}, { timestamps: true })
mongoose.model('User', usersSchema)

module.exports = mongoose