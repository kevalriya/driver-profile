import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import FullStory from 'react-fullstory';
import ReactGA from 'react-ga';

const production = process.env.REACT_APP_ENV === "production";

console.log('process.env.REACT_APP_ENV: ', process.env.REACT_APP_ENV);
if (production) {
    ReactGA.initialize('UA-129510306-1', {
        debug: false,
        siteSpeedSampleRate: 100
    })

    ReactDOM.render(
        <BrowserRouter>
            <FullStory org="GKC8F" />
            <App />
        </BrowserRouter>, document.getElementById('root')
    );
} else {
    ReactDOM.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>, document.getElementById('root')
    );
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
