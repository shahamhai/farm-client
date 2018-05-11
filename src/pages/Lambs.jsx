import React, { Component } from 'react';
import axios from 'axios';

export default class Lambs extends Component {
    constructor() {
        super();
        this.state = {
            lambs: []
        };
    }

    render(){

        return (
            <div>
                this is the lambs page
            </div>
        );
    }
}