import React from 'react';

const InfoMessage = ({ title, message }) =>
    <div className="infoBoxWrapper">
        <div className="infoWrapper">
            <h1 className="titleText" >{title}</h1>
            <h2 className="infoSubText" >{message}</h2>
        </div>
    </div>


const Loading = () => (
    <InfoMessage title="LOADING EXPERIENCE" message="PLEASE WAIT" />
)
export default Loading;