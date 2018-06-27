import React, { Component } from 'react';
import { observer } from 'mobx-react';


class Groups extends Component {
    componentDidMount(){
        this.props.store.getAllGroups();
    }
    
    render(){
        const groups = this.props.store.groups.map(group => <GroupRow group={group} key={group.id} />)
        return (
            <div className="container-fluid">
                <GroupsTable 
                    newGroup={this.props.newGroup} 
                    create={this.createNewGroup} 
                    handleChange={this.handleNewGroupChange} 
                    group={this.props.store.newGroup} 
                >
                    {groups}
                </GroupsTable>
            </div>
        );
    }
}
export default observer(Groups);

const GroupsTable = observer(({children, group}) => {
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
                    <th scope="row"><input type="text" className="form-control" value={group.newName} onChange={e => {group.editName(e.target.value)}} /></th>
                    <td></td>
                    <td><button className="btn btn-success" onClick={group.createGroup}>צור קבוצה חדשה</button></td>
                </tr>
                {children}
            </tbody>
        </table>
    );
})

const GroupRow = observer(props => {
    const { group } = props;
    const { name, edit, animals, id, newName } = props.group;
    const nameTag = !edit ? name : 
        <form className="input-group" dir="ltr">
            <button className="btn btn-primary input-group-prepend" onClick={e => {
                e.preventDefault()
                group.updateName()
            }}>שמירת שם חדש</button>
            <input type="text" className="form-control rtl" value={newName} onChange={e => group.editName(e.target.value)}/>
        </form>
    return(
        <tr key={id}>
            <th scope="row">{nameTag}</th>
            <td>{animals}</td>
            <td>
                <div className="btn-group" dir="ltr">
                    <button type="button" className="btn btn-primary" onClick={e => {
                        e.preventDefault()
                        group.toggelEdit()}}
                        >שינוי שם</button>
                    <button type="button" className="btn btn-danger" onClick={group.deleteGroup}>מחיקה</button>
                </div>
            </td>
        </tr>
    );
})