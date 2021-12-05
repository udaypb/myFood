const knex = require('knex')

module.exports = knex({
    client: 'postgres',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '1234',
        database: 'maindata',
        port: 4321
    },
})