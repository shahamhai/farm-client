import { types, getParent } from "mobx-state-tree";
import TypeDAO from '../dao/TypeDAO';

const AnimalType = types.model('AnimalType', {
    _type: types.string,
    id: types.number,
    editMode: false,
    newName: ''
}).actions(self => ({
    reset() {
        self.editMode= false;
        self.newName = '';
    },

    toggelEdit() {
        self.editMode = !self.editMode;
    },

    edit(name) {
        self.newName = name;
    },

    updateType() {
        if (self.newName.length && self.newName !== self._type) {
            TypeDAO.updateType({id:self.id, _type:self.newName})
            .then(self.updateSuccess)
            .catch(err => {
                console.error(err);
            }).catch(err => {console.error(err)})
        }
    },

    updateSuccess(res) {
        self._type = self.newName;
        self.reset();
    },

    deleteType() {
        TypeDAO.deleteTypeById(self.id)
        .then(self.deleteSuccess)
        .catch(err => {
            console.error(err);
        })
    },

    deleteSuccess(res) {
        getParent(self, 2).removeType(self);
    }
}));

export default AnimalType;