import React, { Component } from 'react';
import ComponentSwitch from '../reusableComonents/ComponentSwitch';
import { observer } from 'mobx-react';

class Types extends Component {
    componentDidMount(){
        this.props.store.getAllTypes();
    }

    render(){
        const types = this.props.store.types.map(t => <TypeRow key={t.id} t={t} />)
        const { newType } = this.props.store;
        return (
            <div className="container-fluid rtl">
                <NewType newType={newType} store={this.props.store} />
                <TypesTable>
                    {types}
                </TypesTable>
            </div>
        );
    }
}

export default observer(Types);
const NewType = observer(props => {
    const { newType, store} = props;
    return (
        <div className="col-3" >
            <form className="input-group my-2" dir="ltr">
                <input className="form-control" type="text" value={newType.newName} onChange={e => {newType.edit(e.target.value)}} />
                <button className="btn btn-primary input-group-append rtl" onClick={e => {
                    e.preventDefault();
                    store.createNewType();
                    }}>
                    צור type חדש
                </button>
            </form>
        </div>
    );
})

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

const TypeRow = observer(props => {
    const { t } = props;
    return (
        <tr>
            <th scope="row">
                <ComponentSwitch selected={t.editMode.toString()}>
                    <div case="false">
                        {t._type}
                    </div>
                    <form className="input-group" case="true">
                        <button 
                            className="btn btn-primary input-group-prepend" 
                            onClick={e => {
                                e.preventDefault();
                                t.updateType();
                            }} 
                        >
                            עדכן
                        </button>
                        <input 
                            type="text" 
                            value={t.newName} 
                            onChange={e => {t.edit(e.target.value)}} 
                        />
                    </form>
                </ComponentSwitch>
            </th>
            <td>
                <button className="btn btn-primary" onClick={e => { 
                    e.preventDefault()
                    t.toggelEdit()
                }} >שנה שם</button>
                <button className="btn btn-danger" onClick={e =>{
                    e.preventDefault()
                    t.deleteType()
                }} >מחק</button>
            </td>
        </tr>
    );
})