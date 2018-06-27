import { types } from "mobx-state-tree";
import typeDAO from '../dao/TypeDAO';
import AnimalType from './animalType';

const TypesStore = types.model('TypesStore', {
    types: types.array(AnimalType),
    newType: AnimalType
}).actions(self => ({
    getAllTypes() {
        typeDAO.getAllTypes()
        .then(self.saveTypesToStore)
    },
    saveTypesToStore(res) {
        if (res.data && res.data.types.length) {
            self.types = res.data.types;
        }
    },
    setTypeName(name) {
        self._type = name;
    },

    createNewType() {
        if (self.newType.newName.length) {
            typeDAO.createType({_type:self.newType.newName})
            .then(self.addNewTypeToStore)
            .catch(err => {
                console.error('could not save type on server');
            })
        }
    },
    addNewTypeToStore(res){
        self.types.push(res.data._type);
        self.newType.reset();
    },

    removeType(t) {
        self.types.splice(self.types.indexOf(t), 1);
    }
})).views(self => ({

}));

const typesStore = TypesStore.create({
    types:[],
    newType: AnimalType.create({_type:'', id:-1})
})

export default typesStore;