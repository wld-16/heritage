import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import tokens from './plugins/tokens'
import {loadFonts} from './plugins/webfontloader'
import {Buffer} from 'buffer'

globalThis.Buffer = Buffer

loadFonts()


createApp(App)
    .use(vuetify)
    .use(router)
    .use(tokens,{ tokenServerBasePath: "http://localhost:3000"})
    .mount('#app')
