
require('dotenv').config()
const express = require('express')
const expressFileupload = require("express-fileupload");
const session = require("express-session")
const msal = require("@azure/msal-node")
const url = require("url")
const { Client } = require('pg');
const app = express()
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const port = process.env.PORT || 3000

const router = require("./router");

const SERVER_PORT = 3000
const cacheLocation = "./src/main/data/cache.json"
const cachePlugin = require("./cachePlugin")(cacheLocation)

const config = require("./config/customConfig.json")

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}

const getTokenAuthCode = function(scenarioConfig, clientApplication, port) {
  const serverPort = port || SERVER_PORT;

  const router = require('./router')

  app.use(session(sessionConfig))


  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(cors())
  app.use(expressFileupload({}))
  app.use(express.urlencoded({ extended: true }))
  app.use(router)

  const requestConfig = scenarioConfig.request;

  app.get("/", (req, res) => {
    if(req.query.code) {
      return res.redirect(url.format({ pathname: "/redirect", query: req.query }));
    }

    const { authCodeUrlParameters } = requestConfig;

    const cryptoProvider = new msal.CryptoProvider()

    if(req.query) {
      authCodeUrlParameters.state = req.query.state ? req.query.state : cryptoProvider.createNewGuid();
      authCodeUrlParameters.nonce = req.query.nonce ? req.query.nonce : cryptoProvider.createNewGuid();

      if(req.query.prompt) authCodeUrlParameters.prompt = req.query.prompt;

      if(req.query.loginHint) authCodeUrlParameters.loginHint = req.query.loginHint;

      if(req.query.domainHint) authCodeUrlParameters.domainHint = req.query.domainHint;
    }

    req.session.nonce = authCodeUrlParameters.nonce
    req.session.state = authCodeUrlParameters.state

    clientApplication.getAuthCodeUrl(authCodeUrlParameters).then((authCodeUrl) => {
      res.redirect(authCodeUrl);
    }).catch((error) => console.log(JSON.stringify(error)))
  })

  app.get("/refresh", (req, res) => {
    const refreshTokenRequest = {
      refreshToken: req.query.refreshToken
    }

    clientApplication.acquireTokenByRefreshToken(refreshTokenRequest).then(tokenResponse => {
      console.log("Successfully acquired token using Refresh Token Code");
      const refreshToken = () => {
        const tokenCache = clientApplication.getTokenCache().serialize();
        const refreshTokenObject = (JSON.parse(tokenCache)).RefreshToken
        return refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;
      }
      console.log(refreshToken())
      res.redirect(`http://localhost:3001/?accessToken=${tokenResponse.accessToken}&refreshToken=${refreshToken()}`)
    })
  })

  app.get("/redirect", (req, res) => {
    const tokenRequest = { ...requestConfig.tokenRequest, code: req.query.code, state: req.query.state, clientSecret: process.env.AZURE_CLIENT_SECRET };

    const authCodeResponse = {
      nonce: req.session.nonce,
      code: req.query.code,
      state: req.session.state
    }
    clientApplication.acquireTokenByCode(tokenRequest, authCodeResponse).then((tokenResponse) => {
      console.log("Successfully acquired token using Authorization Code");
      const refreshToken = () => {
        const tokenCache = clientApplication.getTokenCache().serialize();
        const refreshTokenObject = (JSON.parse(tokenCache)).RefreshToken
        const refreshToken = refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;
        return refreshToken;
      }
      console.log(refreshToken())
      res.redirect(`http://localhost:3001/#/?accessToken=${tokenResponse.accessToken}&refreshToken=${refreshToken()}`)
    }).catch((error) => {
      console.log(error);
      res.status(500).send(error)
    })
  })
  app.listen(port, () => {
    console.log(`Heritage Api listening at http://localhost:${port}`)
  })
}


const loggerOptions = {
  loggerCallback(logLevel, message, containsPii) {
    console.log(message);
  },
  piiLoggingEnabled: false,
  logLevel: msal.LogLevel.Verbose,
}

const clientConfig = {
  auth: {
    clientId: config.authOptions.clientId,
    authority: config.authOptions.authority,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    knownAuthorities: [config.authOptions.knownAuthorities]
  },
  cache: {
    cachePlugin
  }
}

const publicClientApplication = new msal.ConfidentialClientApplication(clientConfig);

return getTokenAuthCode(config, publicClientApplication, 3000)




module.exports = getTokenAuthCode;
