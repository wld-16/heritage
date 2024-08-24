
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { Request, Response } from 'express'
import expressFileupload from "express-fileupload"
import session from "express-session"
import url from "url"
import { parseJwt } from './services/jwt-service.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import { router } from "./router.js";

import * as msal from "@azure/msal-node"
const app = express()

const port: number = parseInt(process.env.PORT) || 3000

import { UserService } from './services/user-service.js'
const userService = new UserService()

const clientUrl: string = process.env.CLIENT_URL
import { cachePlugin } from "./cachePlugin.js";

import config from "./config/customConfig.json" assert { type: "json" }
import {Configuration} from "@azure/msal-node";

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  }
}

function log(content: string) {
  console.log("[" + new Date().toLocaleString() + "] - " + content)
}

const getTokenAuthCode = function(scenarioConfig, clientApplication, port) {

  app.use(session(sessionConfig))


  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(cors())
  app.use(expressFileupload({}))
  app.use(express.urlencoded({ extended: true }))
  app.use(router)

  const requestConfig = scenarioConfig.request;

  app.get("/", (req: Request, res: Response) => {
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

  app.get("/refresh", (req: Request, res: Response) => {
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
      res.redirect(`${clientUrl}/?accessToken=${tokenResponse.accessToken}&refreshToken=${refreshToken()}`)
    })
  })

  app.get("/redirect", (req: Request, res: Response) => {
    const tokenRequest = { ...requestConfig.tokenRequest, code: req.query.code, state: req.query.state, clientSecret: process.env.AZURE_CLIENT_SECRET };

    const authCodeResponse = {
      nonce: req.session.nonce,
      code: req.query.code,
      state: req.session.state
    }
    clientApplication.acquireTokenByCode(tokenRequest, authCodeResponse).then((tokenResponse) => {
      log("Successfully acquired token using Authorization Code");
      const refreshToken = () => {
        const tokenCache = clientApplication.getTokenCache().serialize();
        const refreshTokenObject = (JSON.parse(tokenCache)).RefreshToken
        const refreshToken = refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;
        return refreshToken;
      }
      const oid = parseJwt(tokenResponse.accessToken).oid;

      userService.existsUser(oid).then(exists => {
        if(!exists) {
          userService.createOrUpdateUser(oid)
        }
      })
      res.redirect(`${clientUrl}?accessToken=${tokenResponse.accessToken}&refreshToken=${refreshToken()}&idToken=${tokenResponse.idToken}`)
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

const clientConfig : Configuration = {
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

getTokenAuthCode(config, publicClientApplication, port)



export {
  getTokenAuthCode
};
