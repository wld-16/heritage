const { Pool, Client } = require('pg')
const url = require('url')
const dbConnectionString = process.env.DATABASE_URL || "postgres://sensei:herit12S@localhost:35432/heritage"
//const dbConnectionString = process.env.DATABASE_URL || 'postgres://uxkpngnshskoxx:3f9554935857b6cae7dbd5aee82f03ffefb10b60a7c9bbfc59e0e73251ca66a7@ec2-54-217-213-79.eu-west-1.compute.amazonaws.com:5432/ddl6msh9sbn4lo'

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

const pool = new Pool(config)

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      callback(err, res)
    })
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      callback(err, client, done)
    })
  }
}