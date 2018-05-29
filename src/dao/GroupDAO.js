import axios from 'axios';

class GroupDAO {
    constructor(){
        this.groupsURL = 'http://159.89.100.98/api/groups'
    }
    getAllGroups(){
        return axios.get(this.groupsURL);
    }
    createGroup(group){
        return axios.put(this.groupsURL, group);
    }
    updateGroup(group){
        return axios.post(this.groupsURL, group);
    }
    deleteGroupById(id){
        return axios.delete(this.groupsURL + '/' + id);
    }

}

const groupDAO = new GroupDAO();

export default groupDAO;