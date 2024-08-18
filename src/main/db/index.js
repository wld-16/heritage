const pg = require('pg')
const { Pool, Client } = require('pg')
const dbConnectionString = process.env.DATABASE_URL
const willLogSQL = process.env.LOG_SQL || false 

const params = new URL(dbConnectionString)

const config = {
  user: params.username,
  password: params.password,
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