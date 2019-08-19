import React from "react";

const redirectToOrigin = () => {
    window.location.href = "https://portlmedia.com/";
}

const Header = (props) => {
    return <div className="header">
        <img
            className="portlLogo"
            src="https://portl-client-microsites.s3.amazonaws.com/porttllogo.png"
            alt="portl logo"
            onClick={redirectToOrigin}
        />
        <h1 className="headerText">{props.title}</h1>
    </div>
}

export default Header