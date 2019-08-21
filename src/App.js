import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import Profile from './views/ViewProfile';
import ErrorPage from './components/Error';
import About from "./views/About";
import LeaderBoard from "./views/LeaderBoard"
import { serverUrl } from './config';
import './App.css';

const App = () => {
    const params = queryString.parse(window.location.search) 
    console.log(params)
    // if (params.ref) console.log(params.ref)
    if (params.ref) {
        console.log("ref:", params.ref)
        window.location.href = serverUrl + `/auth0login/driverprofile/?ref=${params.ref}`
    }
    return (
        <div>
            <Switch>
                <Route exact path='/profile' component={Profile}/>
                <Route exact path='/error' component={ErrorPage}/>
                <Route exact path='/about' component={About} />
                <Route exact path='/leaderboard' component={LeaderBoard} />
                <Route component={() => {return <Redirect exact to={'/profile' + window.location.search}/>}} />
            </Switch>
        </div>

    )
}

export default App;
