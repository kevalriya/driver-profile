import auth0 from 'auth0-js';

export default class Auth {
    constructor(history) {
        this.scheduleRenewal();
        this.history = history
    }

    accessToken;
    idToken;
    expiresAt;
    tokenRenewalTimeout;

    auth0 = new auth0.WebAuth({
        domain: 'dev-2nvx8dom.auth0.com',
        clientID: 'y2JCKAu7MtYehlMu0jwW4Kgmvw1S4Flk',
        redirectUri: 'http://localhost:3000/callback',
        responseType: 'token id_token',
        scope: 'openid email'
    });

    login = () => {
        this.auth0.authorize();
    }

    handleAuthentication() {
        console.log('Authenticating hash')
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                console.log("Authentication finished")
            } else if (err) {
                this.history.push('/welcome');
                console.log(err);
                alert(`Error: ${err.error}. Check the console for further details.`);
            }
        });
    }

    getAccessToken = () => {
        return this.accessToken;
    }

    getIdToken = () => {
        return this.idToken;
    }

    setSession = (authResult) => {
        // Set isLoggedIn flag in localStorage
        localStorage.setItem('isLoggedIn', 'true');

        // Set the time that the Access Token will expire at
        let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
        this.accessToken = authResult.accessToken;
        this.idToken = authResult.idToken;
        this.expiresAt = expiresAt;
        // navigate to the home route

        this.scheduleRenewal();
        this.history.push('/welcome');
    }

    renewSession = () => {
        console.log('Trying to renew session')
        this.auth0.checkSession({ redirectUri: 'http://localhost:3000' }, (err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
            } else if (err) {
                this.logout();
                console.log(err);
                alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
            }
        });
    }

    scheduleRenewal() {
        let expiresAt = this.expiresAt;
        const timeout = expiresAt - Date.now();
        if (timeout > 0) {
            this.tokenRenewalTimeout = setTimeout(() => {
                this.renewSession();
            }, timeout);
        }
    }

    logout = () => {
        console.log('Trying to log out')
        // Remove tokens and expiry time
        this.accessToken = null;
        this.idToken = null;
        this.expiresAt = 0;

        // Remove isLoggedIn flag from localStorage
        localStorage.removeItem('isLoggedIn');

        this.auth0.logout({
            returnTo: window.location.origin
        });

        // Clear token removal
        clearTimeout(this.tokenRenewalTimeout);

        // navigate to the home route
        this.history.push('/welcome');
    }

    isAuthenticated = () => {
        console.log('Checking authentication status: ', new Date().getTime() < this.expiresAt)
        // Check whether the current time is past the
        // access token's expiry time
        let expiresAt = this.expiresAt;
        return new Date().getTime() < expiresAt;
    }
}