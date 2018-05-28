import React, { Component } from 'react';
import typeDAO from '../dao/TypeDAO';
import ComponentSwitch from '../reusableComonents/ComponentSwitch';

export default class Types extends Component {
    constructor(){
        super();
        this.state = {
            types: [],
            newType: '',
        }
    }

    componentWillMount(){
        typeDAO.getAllTypes()
        .then(res => {
            if (res.data.types && res.data.types.length) {
                let { types } = res.data;
                types = types.map(type => {
                    type.newName = '';
                    type.editMode = false;
                    return type;
                });
                this.setState({types:types});
            }
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

    toggelEditMode = index => {
        const { types } = this.state;
        types[index].editMode = !types[index].editMode;
        this.setState({types:types});
    }

    handlEditType = (index, value) => {
        const { types } = this.state;
        types[index].newName = value;
        this.setState({types:types});
    }

    updateType = index => {
        const { types } = this.state;
        const _type = types[index];
        typeDAO.updateType({id:_type.id, _type:_type.newName})
        .then(res => {
            _type._type = _type.newName;
            _type.newName = '';
            this.setState({types:types});
        }).catch(err => {console.error(err)});
    }

    deleteType = index => {
        console.log('delete type');
        const { types } = this.state;
        const _type = types[index];
        typeDAO.deleteTypeById(_type.id)
        .then(res => {
            types.splice(index, 1);
            this.setState({types: types});
        }).catch(err => {console.error(err)});
    }

    render(){
        const types = this.state.types.map((t, index) => <TypeRow key={t.id} t={t} index={index} toggelEditMode={this.toggelEditMode} handlEditType={this.handlEditType} deleteType={this.deleteType} updateType={this.updateType} />);
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
            <form className="input-group my-2" dir="ltr">
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
    const { t, index, toggelEditMode, handlEditType, deleteType, updateType } = props;
    const handleChange = e => {
        handlEditType(index, e.target.value);
    };
    return (
        <tr>
            <th scope="row">
                <ComponentSwitch selected={t.editMode.toString()}>
                    <div case="false">
                        {t._type}
                    </div>
                    <form className="input-group" case="true">
                        <button className="btn btn-primary input-group-prepend" onClick={e => {
                            e.preventDefault();
                            updateType(index);
                        }} >
                            עדכן
                        </button>
                        <input  type="text" value={t.newName} onChange={handleChange} />
                    </form>
                </ComponentSwitch>
            </th>
            <td>
                <button className="btn btn-primary" onClick={() => toggelEditMode(index)} >שנה שם</button>
                <button className="btn btn-danger" onClick={() =>{deleteType(index)}} >מחק</button>
            </td>
        </tr>
    );
}