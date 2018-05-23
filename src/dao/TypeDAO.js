import axios from 'axios';

class TypeDAO {
    constructor(){
        this.typeURL = 'http://159.89.100.98/api/types';
    }
    getAllTypes(){
        return axios.get(this.typeURL);
    }
    createType(_type){
        return axios.put(this.typeURL, _type);
    }
    updateType(_type){
        return axios.post(this.typeURL, _type);
    }
    deleteTypeById(id){
        return axios.delete(this.typeURL + '/' + id);
    }
}

const typeDAO = new TypeDAO();

export default typeDAO;