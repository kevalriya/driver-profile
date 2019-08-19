import React from 'react';
import withAnalytics from '../../compositions/Analytics/withAnalytics';
import { Button } from 'react-bootstrap';
import { serverUrl } from "../../config";

const errorRedirect = (url) => {
    window.location.href = url;
}

const ErrorTemplate = (props) => {
    return (
        <div className="infoBoxWrapper">
            <div className="infoWrapper">
                <h1 className="titleText" > {props.title} </h1>
                <h2 className="infoSubText" >
                    {typeof props.error === "string" ? props.error : Object.entries(props.error).join(", ")}
                </h2>
                <Button
                    onClick={() => errorRedirect(serverUrl + "/auth0login/wordpress")}
                    className="submissionButton"
                    type="submit"
                >
                    Sign in
                </Button>
                <Button
                    onClick={() => errorRedirect('https://portlmedia.com/contact-us')}
                    className="submissionButton"
                    type="submit"
                >
                    Back to portlmedia.com
                </Button>
            </div>
        </div>
    )
}


const Error = (props) => {
    console.log(props.err);
    return (
        <ErrorTemplate error={props.err} title="Error"/>
    )
}

export default withAnalytics(Error);