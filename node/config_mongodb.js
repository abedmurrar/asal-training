var mongoose = require('mongoose')

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

module.exports = mongoose