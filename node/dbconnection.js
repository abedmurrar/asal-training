var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '246805',
        database: 'asaltech'
    }
});
module.exports = knex;