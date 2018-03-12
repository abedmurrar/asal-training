var mysql = require('mysql');
var connection = mysql.createPool({

    host: 'localhost',
    user: 'root',
    password: '246805',
    database: 'asaltech'

});
module.exports = connection;