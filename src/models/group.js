import { types, getParent } from "mobx-state-tree";
import groupDAO from '../dao/GroupDAO';

const Group = types.model('Group', {
    animals: types.number,
    edit: false,
    id: types.number,
    name: types.string,
    newName: ''
}).actions(self => ({
    updateName() {
        if (self.newName.length && self.newName !== self.name) {
            groupDAO.updateGroup({id:self.id, name:self.newName})
            .then(self.updateNameSuccess)
            .catch(err => {
                console.error(err);
            });

        }
    },
    updateNameSuccess(res) {
        self.name = self.newName;
        self.reset();
    },

    reset() {
        self.newName = '';
        self.edit = false;
    },

    toggelEdit() {
        self.edit = !self.edit;
    },

    editName(name) {
        self.newName = name;
    },

    deleteGroup() {
        groupDAO.deleteGroupById(self.id)
        .then(self.deleteGroupSuccess)
        .catch(err => {console.error(err)})
    },

    deleteGroupSuccess(res) {
        getParent(self, 2).removeGroup(self);
    },

    createGroup() {
        groupDAO.createGroup({name: self.newName})
        .then(self.createGroupSuccess)
        .catch(err => {
            console.error(err);
        })
    },

    createGroupSuccess(res) {
        getParent(self, 1).createGroup(res.data.group);
        self.reset();
    }
}));

export default Group;