import pg from 'pg'

import dotenv from 'dotenv'
import {query} from "express";
dotenv.config()

const dbConnectionString = process.env.DATABASE_URL
const willLogSQL = Boolean(process.env.LOG_SQL) || false
const params = new URL(dbConnectionString)

const config = {
  user: params.username,
  password: params.password,
  host: params.hostname,
  port: parseInt(params.port),
  database: params.pathname.split('/')[1],
  ssl: false
}

pg.types.setTypeParser(1082, function(stringValue) {
  return stringValue;  //1082 for date type
})

const pool = new pg.Pool(config)

let query = async(text, params) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  if(willLogSQL){
    console.log('executed query', { text, duration, rows: res.rowCount })
  }
  return res;
}
let client = (callback) => {
  pool.connect((err, client, done) => {
    callback(err, client, done)
  })
}

export {
  query,
  client
}