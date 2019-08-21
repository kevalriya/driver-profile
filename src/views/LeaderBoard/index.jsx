import React, { Component } from 'react';
import Header from '../../components/Header';

class LeaderBoardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Leader Board"
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

export default LeaderBoardPage