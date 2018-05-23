import React, { Component } from 'react';
import axios from 'axios';

export default class Groups extends Component {
    constructor(){
        super();
        this.state = {
            groups:[],
            newGroup:''
        };
    }

    componentDidMount(){
        axios.get('http://159.89.100.98/api/groups')
        .then(res => {
            const groups = res.data.groups.map(group => {
                const val = {id: group.id, name:group.name, edit: false, newName: group.name, animals:group.animals};
                return val;
            });
            this.setState({groups:groups});
        })
        .catch(() => {
            console.error('cant load data');
        });
    }

    toggelEdit = e => {
        const index = e.target.value;
        const { groups } = this.state;
        groups[index].edit = !groups[index].edit;
        this.setState({groups:groups});
    }

    updateGroup = index => {
        const { id, newName} = this.state.groups[index];
        console.log(id, newName);
        axios.post('http://159.89.100.98/api/groups',{id:id, name:newName})
        .then(res => {
            const { groups } = this.state;
            groups[index].name = newName;
            groups[index].newName = '';
            groups[index].edit = false;

            this.setState({groups:groups});
        })
        .catch(err => {
            console.error(err.stack);
        });
    }

    handleChange = (index, e) => {
        const { value } = e.target;
        const { groups } = this.state;
        groups[index].newName = value;
        this.setState({groups:groups});
    }

    createNewGroup = e => {
        e.preventDefault();
        const group = {name: this.state.newGroup};
        axios.put('http://159.89.100.98/api/groups', group).then(res => {
            console.log('created a new group');
        });
    }

    handleNewGroupChange = e => {
        const { value } = e.target;
        this.setState({newGroup:value});
    }

    deleteGroup = index => {
        const { id } = this.state.groups[index];
        axios.delete('http://159.89.100.98/api/groups/'+ id)
        .then(res => {
            const { groups } = this.state;
            groups.splice(index, 1);
            this.setState({groups:groups});
        })
    }

    render(){
        const groups = this.state.groups.map((group, index) => <GroupRow group={group} index={index} key={group.id} editMode={this.toggelEdit} save={this.updateGroup} deleteGroup={this.deleteGroup} handleChange={this.handleChange} />)
        return (
            <div className="container-fluid">
                <GroupsTable newGroup={this.state.newGroup} create={this.createNewGroup} handleChange={this.handleNewGroupChange} >
                    {groups}
                </GroupsTable>
            </div>
        );
    }
}

const GroupsTable = props => {
    return(
        <table className="table table-striped table-hover rtl">
            <thead>
                <tr>
                    <th scope="col">קבוצה</th>
                    <th scope="col">כמות חיות</th>
                    <th scope="col">פעולות</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row"><input type="text" className="form-control" value={props.newGroup} onChange={props.handleChange} /></th>
                    <td></td>
                    <td><button className="btn btn-success" onClick={props.create}>צור קבוצה חדשה</button></td>
                </tr>
                {props.children}
            </tbody>
        </table>
    );
}

const GroupRow = props => {
    const { name, edit, animals, id, newName } = props.group;
    const { handleChange, save, editMode, index, deleteGroup } = props;
    const update = e => {
        console.log('in update');
        console.log(id, newName);
        e.preventDefault();
        save(index);
    };
    const _deleteGroup = e => {
        console.log('in delete');
        e.preventDefault();
        deleteGroup(index);
    }
    const nameTag = !edit ? name : 
        <form className="input-group" dir="ltr">
            <button className="btn btn-primary input-group-prepend" onClick={update}>שמירת שם חדש</button>
            <input type="text" className="form-control rtl" value={newName} onChange={e => handleChange(index, e)}/>
        </form>
    return(
        <tr key={id}>
            <th scope="row">{nameTag}</th>
            <td>{animals}</td>
            <td>
                <div className="btn-group" dir="ltr">
                    <button readOnly value={index} type="button" className="btn btn-primary" onClick={editMode}>שינוי שם</button>
                    <button type="button" className="btn btn-danger" onClick={_deleteGroup}>מחיקה</button>
                </div>
            </td>
        </tr>
    );
}