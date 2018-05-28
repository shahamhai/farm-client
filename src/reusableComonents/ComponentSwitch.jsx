import React, { Component } from 'react';

export default class ComponentSwitch extends Component {
    constructor(props){
        super(props)
    }

    render(){
        const { children, selected } = this.props;
        const selectedByUser = children.filter(child => child.props.case === selected);
        const defaultvalue = <div>this is the default value</div>;
        const userDefault = children.filter(child => child.props.defaultCase);
        return selectedByUser ? selectedByUser
            : userDefault ? userDefault
            : defaultvalue;
    }
}