export default {
    install: (app, options) => {
        app.provide('token-server-url', options.tokenServerBasePath)
        app.provide('token-refresh-server-url', options.tokenServerBasePath + "/refresh")

        app.config.globalProperties.$writeTokens = (accessToken, refreshToken) => {
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)
        }
        app.config.globalProperties.$deleteTokens = () => {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
        }
        function parseJwt (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }
        function validateJwt(token) {
            const jwt = parseJwt(token);
            const expiresAt = new Date(jwt.exp * 1000)
            const dateNow = new Date()
            return expiresAt > dateNow
        }
        app.config.nextTick = setInterval(() => {
            const accessToken = localStorage.getItem("accessToken");
            if(!validateJwt(accessToken)) {
                const params = new URL(window.location.href).searchParams;
                if(params.has("accessToken") && params.has("refreshToken")){
                    localStorage.setItem("accessToken", params.get("accessToken"))
                    localStorage.setItem("refreshToken", params.get("refreshToken"))
                } else {
                    window.location.href = `${options.tokenServerBasePath}`
                }
            }
            const expiresAt = new Date(parseJwt(localStorage.getItem("accessToken")).exp * 1000)
            const dateNow = new Date()
            if(expiresAt - dateNow < 3000) {
                // Send refresh token
                window.location.href = `${options.tokenServerBasePath}/refresh?refreshToken=${localStorage.getItem("refreshToken")}`
            }
        },3000)
    }
}