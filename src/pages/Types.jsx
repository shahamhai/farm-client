import React, { Component } from 'react';
import typeDAO from '../dao/TypeDAO';

export default class Types extends Component {
    constructor(){
        super();
        this.state = {
            types: [{id:1, _type:'sheepel'}],
            newType: ''
        }
    }

    componentWillMount(){
        typeDAO.getAllTypes()
        .then(res => {
            if (res.data.types && res.data.types.length)
            this.setState({types:res.data.types});
        })
        .catch(err => {
            console.error('could not retrive types from server', err);
        });
    }

    handleChange = e => {
        const { value } = e.target;
        this.setState({newType:value});
    }

    createType = e => {
        e.preventDefault();
        if(this.state.newType.length)
            typeDAO.createType({_type:this.state.newType})
            .then(res => {
                console.log(res.data)
                const { types } = this.state;
                types.push(res.data._type);
                this.setState({types:types, newType:''});
            })
            .catch(err => {
                console.error('couldnt save new type', err);
            });
    }

    render(){
        const types = this.state.types.map(t => <TypeRow key={t.id} t={t}/>)
        const { newType } = this.state;
        return (
            <div className="container-fluid rtl">
                <NewType newType={newType} handleChange={this.handleChange} createType={this.createType} />
                <TypesTable>
                    {types}
                </TypesTable>
            </div>
        );
    }
}
const NewType = props => {
    const { newType, handleChange, createType} = props;
    return (
        <div className="col-3" >
            <form className="input-group" dir="ltr">
                <input className="form-control" type="text" value={newType} onChange={handleChange} />
                <button className="btn btn-primary input-group-append rtl" onClick={createType}>
                    צור type חדש
                </button>
            </form>
        </div>
    );
}

const TypesTable = props => {
    return (
        <table className="table table-striped table-hover rtl">
            <thead>
                <tr>
                    <th scope="col">type</th>
                    <th scope="col">פעולות</th>
                </tr>
            </thead>
            <tbody>
                {props.children}
            </tbody>
        </table>
    );
}

const TypeRow = props => {
    const { t } = props;
    return (
        <tr>
            <th scope="row">{t._type}</th>
            <td>
                <button className="btn btn-primary">שנה שם</button>
                <button className="btn btn-danger" >מחק</button>
            </td>
        </tr>
    );
}