
require('dotenv').config()
const express = require('express')
const expressFileupload = require("express-fileupload");
const { Client } = require('pg');
const app = express()
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const port = process.env.PORT || 3000

const router = require('./router')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(expressFileupload({}))
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
