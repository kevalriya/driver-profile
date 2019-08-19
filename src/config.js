var serverUrl;
console.log("env var:", process.env.REACT_APP_ENV)
if  (process.env.REACT_APP_ENV === 'production') {
    serverUrl = 'https://api.portlmedia.com';
} else if (process.env.REACT_APP_ENV === 'staging'){
    serverUrl = 'https://api-staging.portlmedia.com';
} else {
    serverUrl = 'https://api-staging.portlmedia.com';
    // serverUrl = 'http://localhost:8080';
}

export {serverUrl}