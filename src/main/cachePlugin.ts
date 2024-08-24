/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import fs from 'fs';
import {ICachePlugin, TokenCacheContext} from "@azure/msal-node";
const cacheLocation = "./src/main/data/cache.json"

 /**
 * Cache Plugin configuration
 */

 const beforeCacheAccess: (tokenCacheContext: TokenCacheContext) => Promise<void> = (cacheContext) => {
     return new Promise((resolve, reject) => {
         if (fs.existsSync(cacheLocation)) {
             fs.readFile(cacheLocation, "utf-8", (err, data) => {
                 if (err) {
                     reject(err);
                 } else {
                     cacheContext.tokenCache.deserialize(data);
                     resolve();
                 }
             });
         } else {
             fs.writeFile(cacheLocation, cacheContext.tokenCache.serialize(), (err) => {
                 if (err) {
                     reject(err);
                 }
                 resolve();
             });
         }
     });
 }

const afterCacheAccess: (tokenCacheContext: TokenCacheContext) => Promise<void> = (cacheContext) => {
    return new Promise((resolve, reject) => {
        if(cacheContext.cacheHasChanged){
            fs.writeFile(cacheLocation, cacheContext.tokenCache.serialize(), (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        } else {
            resolve();
        }
    });
};
const cachePlugin : ICachePlugin = {
    beforeCacheAccess,
    afterCacheAccess
}

export {
    cachePlugin
}