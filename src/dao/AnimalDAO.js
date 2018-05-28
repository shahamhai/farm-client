import axios from 'axios';

class AnimalDAO {
    constructor(){
        this.animalUrl = 'http://159.89.100.98/api/animals';
    }
    createAnimal(animal){
        return axios.put(this.animalUrl, animal);
    }
    getAllAnimals(){
        return axios.get(this.animalUrl);
    }
    updateAnimal(animal){
        return axios.post(this.animalUrl, animal);
    }
    deleteAnimalById(id){
        return axios.delete(this.animalUrl + '/' + id);
    }
}

const animalDAO = new AnimalDAO();
export default animalDAO;