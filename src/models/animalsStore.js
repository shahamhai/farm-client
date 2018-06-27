import { types } from "mobx-state-tree";
import animalDAO from '../dao/AnimalDAO';
import typeDAO from '../dao/TypeDAO';
import Animal from './animal'
import Group from './group';
import AnimalType from './animalType';

const AnimalsStore = types.model('AnimalList', {
    animals: types.array(Animal),
    groups: types.array(Group),
    types: types.array(AnimalType)
}).actions(self => ({
    add(animal) {
        self.animalList.push(animal)
    },

    fetchAnimals(){
        animalDAO.getAllAnimals().then(self.saveToStore);
    },

    saveToStore(res) {
        let { animals } = res.data;
        animals = animals.map(animal => animal);
        self.animalList = animals;
    },

    getTypes(){
        typeDAO.getAllTypes().then(self.saveTypesToStore)
    },

    saveTypesToStore(res){
        self.types = res.data.types;
    }
})).views(self => ({
    
}));

const animalsStore = AnimalsStore.create({
    animals:[], 
    types:[{
        _type: 'קבוצה 1',
        id: 1
    }], 
    groups:[]
});

export default animalsStore;