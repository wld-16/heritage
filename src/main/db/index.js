const pg = require('pg')
const { Pool, Client } = require('pg')
const url = require('url')
const dbConnectionString = process.env.DATABASE_URL || "postgres://postgres:safe223344xx@localhost:35432/heritage"
const willLogSQL = process.env.LOG_SQL || false 

const params = url.parse(dbConnectionString)
const auth = params.auth.split(':')

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: false
}

pg.types.setTypeParser(1082, function(stringValue) {
  return stringValue;  //1082 for date type
})

const pool = new Pool(config)

module.exports = {
  query: async(text, params) => {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    if(willLogSQL === "true" || willLogSQL === true){
      console.log('executed query', { text, duration, rows: res.rowCount })
    }
    return res;
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      callback(err, client, done)
    })
  }
}