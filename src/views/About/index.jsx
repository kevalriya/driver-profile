import React, { Component } from 'react';
import Header from '../../components/Header';

class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            title: "About"
        }
    }

    render = () => {
        return (
            <div>
                <Header title={this.state.title} />
                <h2>This page is not ready yet</h2>
            </div>
        )
    }
}

export default AboutPage